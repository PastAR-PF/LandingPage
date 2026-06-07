'use client';
import {
  useRef, useMemo, useEffect, useContext, createContext, Suspense,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  RoundedBox, Environment, Lightformer, Instances, Instance, Html, OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { HiLocationMarker, HiChip, HiWifi } from 'react-icons/hi';
import { MdThermostat, MdSpeed, MdBatteryFull } from 'react-icons/md';

const FOREST = '#1A5C38';
const MOSS   = '#3A8A58';

const R = 2.4;
const DEVICE_Z = R - 0.42;

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const remap = (v, lo, hi) => clamp01((v - lo) / (hi - lo));

/* ─── Textures ─────────────────────────────────────────────── */

function makePCBTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#13502f';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(180,220,190,0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.moveTo(20, 24 + i * 26);
    ctx.lineTo(120 + (i % 3) * 30, 24 + i * 26);
    ctx.stroke();
  }
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(150, 70, 80, 80);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(150, 70, 80, 16);
  ctx.fillStyle = '#c9c9b0';
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(146, 78 + i * 10, 6, 4);
    ctx.fillRect(230, 78 + i * 10, 6, 4);
  }
  ctx.fillStyle = 'rgba(230,230,220,0.5)';
  for (let i = 0; i < 4; i++) ctx.fillRect(24, 170 + i * 14, 90 - i * 12, 5);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeNylonTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  // base nylon (dark forest tint)
  ctx.fillStyle = '#23352b';
  ctx.fillRect(0, 0, 128, 128);
  // woven twill — offset blocks read as fabric weave
  const cell = 8;
  for (let y = 0; y < 128; y += cell) {
    const shift = ((y / cell) % 2) === 0 ? 0 : cell / 2;
    for (let x = -cell; x < 128; x += cell) {
      ctx.fillStyle = (((x + shift) / cell) % 2 < 1) ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.12)';
      ctx.fillRect(x + shift, y, cell - 2, cell - 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(40, 2);
  tex.anisotropy = 8;
  return tex;
}

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBeltGeometry(radius, width, thickness, cornerR = 0.05, loopSeg = 240, csSeg = 5) {
  const hw = width / 2 - cornerR;
  const ht = thickness / 2 - cornerR;
  const corners = [
    { cx:  ht, cy:  hw, a0: 0 },
    { cx: -ht, cy:  hw, a0: Math.PI / 2 },
    { cx: -ht, cy: -hw, a0: Math.PI },
    { cx:  ht, cy: -hw, a0: -Math.PI / 2 },
  ];
  const cs = [];
  for (const c of corners) {
    for (let k = 0; k <= csSeg; k++) {
      const ang = c.a0 + (k / csSeg) * (Math.PI / 2);
      cs.push([c.cx + Math.cos(ang) * cornerR, c.cy + Math.sin(ang) * cornerR]);
    }
  }
  const ring = cs.length;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= loopSeg; i++) {
    const a = (i / loopSeg) * Math.PI * 2;
    const ca = Math.cos(a), sa = Math.sin(a);
    for (let j = 0; j < ring; j++) {
      const [radOff, y] = cs[j];
      const r = radius + radOff;
      pos.push(ca * r, y, sa * r);
      uv.push(i / loopSeg, j / ring);
    }
  }
  for (let i = 0; i < loopSeg; i++) {
    for (let j = 0; j < ring; j++) {
      const jn = (j + 1) % ring;
      const a = i * ring + j, b = i * ring + jn;
      const c = (i + 1) * ring + jn, d = (i + 1) * ring + j;
      idx.push(a, d, b, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setIndex(idx);
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

/* ─── Shared assets (textures + materials) ─────────────────────
   Created once, reused across every module, disposed on unmount.
   Provided via context so modules don't prop-drill them.        */

const AssetCtx = createContext(null);
const useAssets = () => useContext(AssetCtx);

function useCollarAssets() {
  const pcb   = useMemo(makePCBTexture, []);
  const glow  = useMemo(makeGlowTexture, []);
  const nylon = useMemo(makeNylonTexture, []);

  const mats = useMemo(() => ({
    shellOuter:  new THREE.MeshPhysicalMaterial({ color: '#2b2b30', roughness: 0.45, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.3, envMapIntensity: 1.8 }),
    shellInner:  new THREE.MeshPhysicalMaterial({ color: '#1b1b1e', roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.5 }),
    gasket:      new THREE.MeshStandardMaterial({ color: '#0e0e10', roughness: 0.95 }),
    metalSilver: new THREE.MeshStandardMaterial({ color: '#c9ced6', metalness: 0.95, roughness: 0.3, envMapIntensity: 1.5 }),
    metalDark:   new THREE.MeshStandardMaterial({ color: '#2c2c30', metalness: 0.85, roughness: 0.36 }),
    gold:        new THREE.MeshStandardMaterial({ color: '#d8b24a', metalness: 0.9, roughness: 0.35 }),
    pcbPlain:    new THREE.MeshStandardMaterial({ color: '#15623a', roughness: 0.6, metalness: 0.08 }),
    ceramic:     new THREE.MeshStandardMaterial({ color: '#e9e7dd', roughness: 0.55 }),
    chipBlack:   new THREE.MeshStandardMaterial({ color: '#0d0d10', roughness: 0.5, metalness: 0.25 }),
    sensorWhite: new THREE.MeshStandardMaterial({ color: '#d9dde2', roughness: 0.6 }),
    strap:       new THREE.MeshStandardMaterial({ map: nylon, color: '#5f6f63', roughness: 0.85, metalness: 0, side: THREE.DoubleSide }),
  }), [nylon]);

  useEffect(() => () => {
    [pcb, glow, nylon].forEach((t) => t && t.dispose());
    Object.values(mats).forEach((m) => m.dispose());
  }, [pcb, glow, nylon, mats]);

  return useMemo(() => ({ tex: { pcb, glow, nylon }, mats }),
    [pcb, glow, nylon, mats]);
}

/* ─── Instanced helpers (repeated geometry → 1 draw call) ────── */

function Screws({ positions }) {
  return (
    <Instances limit={positions.length} range={positions.length}>
      <cylinderGeometry args={[0.075, 0.075, 0.06, 18]} />
      <meshStandardMaterial color="#3a3a3e" metalness={0.9} roughness={0.34} />
      {positions.map((p, i) => (
        <Instance key={i} position={p} rotation={[Math.PI / 2, 0, 0]} />
      ))}
    </Instances>
  );
}

/* ─── Status LED (emissive + additive glow) ────────────────── */

function LED({ position, color, glow, phase = 0 }) {
  const matRef = useRef();
  const glowRef = useRef();
  useFrame(({ clock }) => {
    const p = 0.6 + Math.sin(clock.elapsedTime * 2.2 + phase) * 0.4;
    if (matRef.current) matRef.current.emissiveIntensity = 1.4 + p * 1.6;
    if (glowRef.current) glowRef.current.material.opacity = 0.35 + p * 0.4;
  });
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.1, 0.06, 0.05]} />
        <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={2} roughness={0.3} toneMapped={false} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0.05]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial map={glow} color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─── Modules ──────────────────────────────────────────────────
   Each module is a self-contained <group> centered at its own
   origin, so the parent can place it (assembled) and later offset
   it (exploded) without touching the module's internals.        */

// Top shell: solid cover + corner screws + status LEDs.
function ShellTop() {
  const { mats, tex } = useAssets();
  return (
    <group>
      <RoundedBox args={[3.0, 1.7, 0.22]} radius={0.16} smoothness={5} material={mats.shellOuter} />
      {/* subtle recessed inset on the top face */}
      <RoundedBox args={[2.5, 1.24, 0.04]} radius={0.1} smoothness={3} position={[0, 0, 0.11]} material={mats.shellInner} />
      <Screws positions={[[-1.3, 0.66, 0.12], [1.3, 0.66, 0.12], [-1.3, -0.66, 0.12], [1.3, -0.66, 0.12]]} />
      <LED position={[0.95, -0.7, 0.13]} color="#4ade80" glow={tex.glow} phase={0} />
      <LED position={[1.12, -0.7, 0.13]} color="#5b9bd5" glow={tex.glow} phase={1.4} />
    </group>
  );
}

// ESP32 antenna meander (printed serpentine on the WROOM tab).
function Meander({ center }) {
  const [cx, cy, cz] = center;
  const n = 5;
  return (
    <Instances limit={n} range={n}>
      <boxGeometry args={[0.4, 0.028, 0.012]} />
      <meshStandardMaterial color="#ededed" roughness={0.5} />
      {Array.from({ length: n }).map((_, i) => (
        <Instance key={i} position={[cx, cy - 0.12 + i * 0.06, cz]} />
      ))}
    </Instances>
  );
}

function SmdParts() {
  const pts = [[0.2, 0.5], [0.55, 0.35], [0.3, -0.4], [0.65, -0.15], [-0.05, -0.55], [0.95, 0.5]];
  return (
    <Instances limit={pts.length} range={pts.length}>
      <boxGeometry args={[0.12, 0.07, 0.05]} />
      <meshStandardMaterial color="#101014" roughness={0.5} metalness={0.3} />
      {pts.map((p, i) => <Instance key={i} position={[p[0], p[1], 0.065]} />)}
    </Instances>
  );
}

function EdgePads() {
  const pts = [];
  for (let i = 0; i < 8; i++) { const y = -0.6 + i * 0.17; pts.push([-1.3, y], [1.3, y]); }
  return (
    <Instances limit={pts.length} range={pts.length}>
      <boxGeometry args={[0.1, 0.06, 0.02]} />
      <meshStandardMaterial color="#d8b24a" metalness={0.9} roughness={0.35} />
      {pts.map((p, i) => <Instance key={i} position={[p[0], p[1], 0.045]} />)}
    </Instances>
  );
}

// Main board: green FR4 with the ESP32-WROOM can, antenna tab, USB, SMD, pads.
function MainBoard() {
  const { mats, tex } = useAssets();
  return (
    <group>
      <RoundedBox args={[2.7, 1.45, 0.07]} radius={0.04} smoothness={2} material={mats.pcbPlain} />
      <mesh position={[0, 0, 0.037]}>
        <planeGeometry args={[2.6, 1.38]} />
        <meshStandardMaterial map={tex.pcb} roughness={0.55} metalness={0.1} />
      </mesh>
      {/* ESP32-WROOM shielded can */}
      <RoundedBox args={[0.8, 1.0, 0.13]} radius={0.02} smoothness={2} position={[-0.5, 0.0, 0.1]} material={mats.metalSilver} />
      {/* printed antenna tab */}
      <mesh position={[-0.5, 0.72, 0.045]}>
        <boxGeometry args={[0.55, 0.42, 0.03]} />
        <meshStandardMaterial color="#10502e" roughness={0.5} />
      </mesh>
      <Meander center={[-0.5, 0.72, 0.062]} />
      {/* USB / programming connector */}
      <mesh position={[1.2, 0, 0.09]} material={mats.metalSilver}>
        <boxGeometry args={[0.18, 0.34, 0.16]} />
      </mesh>
      <SmdParts />
      <EdgePads />
    </group>
  );
}

// GPS NEO-6M: small board + ceramic patch antenna + feed point.
function GpsModule() {
  const { mats } = useAssets();
  return (
    <group>
      <RoundedBox args={[0.72, 0.72, 0.05]} radius={0.03} smoothness={2} material={mats.pcbPlain} />
      <RoundedBox args={[0.52, 0.52, 0.16]} radius={0.02} smoothness={2} position={[0, 0, 0.1]} material={mats.ceramic} />
      <mesh position={[0, 0, 0.185]}>
        <planeGeometry args={[0.44, 0.44]} />
        <meshStandardMaterial color="#cfd3d8" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.12, 0.19]} rotation-x={Math.PI / 2} material={mats.gold}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
      </mesh>
    </group>
  );
}

// IMU: tiny breakout + QFN chip with pin-1 dot and instanced leads.
function ChipLeads() {
  const pts = [];
  const n = 5;
  for (let i = 0; i < n; i++) {
    const o = -0.1 + i * 0.05;
    pts.push([o, 0.15], [o, -0.15], [0.15, o], [-0.15, o]);
  }
  return (
    <Instances limit={pts.length} range={pts.length}>
      <boxGeometry args={[0.03, 0.03, 0.02]} />
      <meshStandardMaterial color="#d8b24a" metalness={0.9} roughness={0.4} />
      {pts.map((p, i) => <Instance key={i} position={[p[0], p[1], 0.045]} />)}
    </Instances>
  );
}

function ImuModule() {
  const { mats } = useAssets();
  return (
    <group>
      <RoundedBox args={[0.42, 0.42, 0.04]} radius={0.02} smoothness={2} material={mats.pcbPlain} />
      <mesh position={[0, 0, 0.06]} material={mats.chipBlack}>
        <boxGeometry args={[0.26, 0.26, 0.07]} />
      </mesh>
      <mesh position={[-0.08, 0.08, 0.1]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.012, 0.012, 0.01, 8]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <ChipLeads />
    </group>
  );
}

// Temp/Humidity: board + sensor body + metal cap with a vent grille.
function VentGrille({ center }) {
  const [cx, cy, cz] = center;
  const pts = [];
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) pts.push([cx + i * 0.07, cy + j * 0.07, cz]);
  return (
    <Instances limit={pts.length} range={pts.length}>
      <cylinderGeometry args={[0.018, 0.018, 0.04, 10]} />
      <meshStandardMaterial color="#15151a" roughness={0.7} />
      {pts.map((p, i) => <Instance key={i} position={p} rotation={[Math.PI / 2, 0, 0]} />)}
    </Instances>
  );
}

function TempHumModule() {
  const { mats } = useAssets();
  return (
    <group>
      <RoundedBox args={[0.5, 0.55, 0.04]} radius={0.02} smoothness={2} material={mats.pcbPlain} />
      <RoundedBox args={[0.34, 0.34, 0.18]} radius={0.03} smoothness={2} position={[0, 0, 0.11]} material={mats.sensorWhite} />
      <mesh position={[0, 0, 0.205]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 24]} />
        <meshStandardMaterial color="#b8bcc2" metalness={0.6} roughness={0.4} />
      </mesh>
      <VentGrille center={[0, 0, 0.225]} />
    </group>
  );
}

// LoRaWAN: board + RF shield can + u.FL connector + antenna stub.
function LoraModule() {
  const { mats } = useAssets();
  return (
    <group>
      <RoundedBox args={[0.7, 0.55, 0.05]} radius={0.03} smoothness={2} material={mats.pcbPlain} />
      <RoundedBox args={[0.44, 0.4, 0.1]} radius={0.02} smoothness={2} position={[-0.05, 0, 0.075]} material={mats.metalSilver} />
      <mesh position={[0.26, 0.16, 0.06]} material={mats.gold}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
      </mesh>
      <group position={[0.26, 0.16, 0.06]} rotation={[-0.4, 0, 0.25]}>
        <mesh position={[0, 0, 0.32]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.028, 0.028, 0.6, 12]} />
          <meshStandardMaterial color="#0e0e12" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.63]}>
          <sphereGeometry args={[0.045, 12, 10]} />
          <meshStandardMaterial color="#0e0e12" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// Battery: single long-life lithium primary cell (~2 yr autonomy).
function Battery() {
  const { mats } = useAssets();
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* steel can */}
      <mesh material={mats.metalSilver}>
        <cylinderGeometry args={[0.36, 0.36, 1.9, 28]} />
      </mesh>
      {/* lithium wrap label */}
      <mesh>
        <cylinderGeometry args={[0.365, 0.365, 1.5, 28]} />
        <meshStandardMaterial color="#37506b" roughness={0.5} />
      </mesh>
      {/* spec band */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.368, 0.368, 0.16, 28]} />
        <meshStandardMaterial color="#dcdfe6" roughness={0.55} />
      </mesh>
      {/* positive terminal */}
      <mesh position={[0, 0.98, 0]} material={mats.gold}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
      </mesh>
      {/* negative end cap */}
      <mesh position={[0, -0.96, 0]} material={mats.metalDark}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 28]} />
      </mesh>
    </group>
  );
}

// Bottom shell: back plate + sealing rim + bottom connector.
function ShellBottom() {
  const { mats } = useAssets();
  return (
    <group>
      <RoundedBox args={[2.95, 1.62, 0.2]} radius={0.12} smoothness={4} material={mats.shellInner} />
      <RoundedBox args={[3.0, 1.68, 0.06]} radius={0.13} smoothness={3} position={[0, 0, 0.12]} material={mats.gasket} />
      <RoundedBox args={[0.5, 0.12, 0.32]} radius={0.04} smoothness={2} position={[0, -0.82, 0]} material={mats.shellInner} />
    </group>
  );
}

/* ─── Static parts (don't disassemble) ─────────────────────── */

// Strap lugs that hold the band — stay put with the strap.
function SideClamp({ side }) {
  const { mats } = useAssets();
  const x = side * 1.6;
  const ridges = [-0.5, -0.25, 0, 0.25, 0.5];
  return (
    <group position={[x, 0, 0]}>
      <RoundedBox args={[0.42, 1.5, 1.0]} radius={0.1} smoothness={3} material={mats.shellOuter} />
      <Instances limit={ridges.length} range={ridges.length}>
        <boxGeometry args={[0.07, 0.13, 0.92]} />
        <meshStandardMaterial color="#0e0e0e" roughness={0.5} metalness={0.3} />
        {ridges.map((yy, i) => <Instance key={i} position={[side * 0.22, yy, 0]} />)}
      </Instances>
    </group>
  );
}

// Flat nylon webbing band + stitched edges (piping on the outer face).
function Strap() {
  const { mats } = useAssets();
  const geo = useMemo(() => makeBeltGeometry(R, 1.15, 0.1, 0.03), []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group>
      <mesh geometry={geo} material={mats.strap} />
      {[0.46, -0.46].map((yy, i) => (
        <mesh key={i} position={[0, yy, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R + 0.06, 0.012, 8, 170]} />
          <meshStandardMaterial color="#b9ad8e" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// Side-release clip (harness style) — integrated to the band, not separate.
function Clip() {
  const { mats } = useAssets();
  const body = mats.shellOuter;
  return (
    <group position={[0, 0, -(R + 0.2)]} rotation={[0, Math.PI, 0]}>
      {/* female housing */}
      <RoundedBox args={[0.95, 0.9, 0.34]} radius={0.13} smoothness={4} position={[0.5, 0, 0]} material={body} />
      {/* male buckle */}
      <RoundedBox args={[0.8, 0.78, 0.3]} radius={0.11} smoothness={4} position={[-0.45, 0, 0]} material={body} />
      {/* mating seam */}
      <mesh position={[0.05, 0, 0.02]} material={mats.gasket}>
        <boxGeometry args={[0.12, 0.74, 0.32]} />
      </mesh>
      {/* release tabs poking out top & bottom of the housing */}
      <RoundedBox args={[0.18, 0.16, 0.36]} radius={0.04} smoothness={2} position={[0.6, 0.5, 0]} material={body} />
      <RoundedBox args={[0.18, 0.16, 0.36]} radius={0.04} smoothness={2} position={[0.6, -0.5, 0]} material={body} />
      {/* webbing bars on each end */}
      {[1.04, -0.92].map((xx, i) => (
        <mesh key={i} position={[xx, 0, 0]} material={mats.metalDark}>
          <boxGeometry args={[0.1, 0.74, 0.2]} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Component tags (DOM labels anchored to each module) ────── */

const LABELS = {
  gps:     { icon: <HiLocationMarker />, title: 'GPS NEO-6M',               sub: 'Coordenadas en tiempo real' },
  imu:     { icon: <MdSpeed />,          title: 'Acelerómetro + Giróscopo', sub: 'Actividad y comportamiento' },
  temp:    { icon: <MdThermostat />,     title: 'Temperatura y Humedad',    sub: 'Cálculo del ITH' },
  board:   { icon: <HiChip />,           title: 'Microcontrolador ESP32',   sub: 'Deep Sleep y buffer local' },
  lora:    { icon: <HiWifi />,           title: 'Conectividad LoRaWAN',     sub: 'Hasta 15 km de alcance' },
  lithium: { icon: <MdBatteryFull />,    title: 'Batería de Litio',         sub: 'Hasta ~2 años de autonomía' },
};

const TAG_STYLE = {
  display: 'flex', alignItems: 'center', gap: '8px', width: 'max-content', maxWidth: '210px',
  padding: '6px 12px 6px 6px', background: 'rgba(255,255,255,0.96)', borderRadius: '12px',
  border: '1px solid rgba(26,92,56,0.14)', boxShadow: '0 8px 22px rgba(26,92,56,0.20)',
  backdropFilter: 'blur(4px)', transition: 'opacity 0.25s ease', userSelect: 'none',
};
const TAG_ICON = {
  width: '32px', height: '32px', flexShrink: 0, background: FOREST, color: '#fff',
  borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem',
};
const TAG_TITLE = { margin: 0, fontSize: '0.74rem', fontWeight: 700, color: '#1d2b22', lineHeight: 1.2, whiteSpace: 'nowrap' };
const TAG_SUB   = { margin: 0, fontSize: '0.64rem', color: '#5a6b60', lineHeight: 1.3 };

/* ─── Module layout ────────────────────────────────────────────
   assembled = resting position inside the closed puck (device-local).
   explode   = offset added (× explode amount) when disassembling.
   labelPos  = where the tag sits, beside the piece (module-local).
   Stack runs along Z: +Z outer (shell/solar) → -Z inner (battery/back). */

const MODULES = [
  { id: 'shellTop', assembled: [0, 0, 0.5],        explode: [0, 2.6, 2.4] },
  { id: 'board',    assembled: [0, 0, 0.18],       explode: [0, 0.0, 0.6],  label: 'board', labelPos: [-0.5, -0.95, 0.3] },
  { id: 'gps',      assembled: [0.82, 0.4, 0.32],  explode: [2.6, 1.7, 1.2],  label: 'gps',  labelPos: [0.55, 0.55, 0.2] },
  { id: 'imu',      assembled: [0.3, -0.1, 0.32],  explode: [-2.5, 0.1, 1.4], label: 'imu',  labelPos: [-0.5, 0.1, 0.2] },
  { id: 'temp',     assembled: [-0.9, 0.42, 0.34], explode: [-2.7, 1.6, 1.2], label: 'temp', labelPos: [-0.5, 0.5, 0.25] },
  { id: 'lora',     assembled: [0.7, -0.45, 0.32], explode: [2.6, -1.7, 1.2], label: 'lora', labelPos: [0.55, -0.5, 0.2] },
  { id: 'battery',  assembled: [0, 0, -0.15],      explode: [0, -2.8, 0.6], label: 'lithium', labelPos: [1.15, -0.35, 0.3] },
  { id: 'shellBot', assembled: [0, 0, -0.5],       explode: [0, -1.7, -2.2] },
];

const COMP = {
  shellTop: ShellTop, board: MainBoard,
  gps: GpsModule, imu: ImuModule, temp: TempHumModule,
  lora: LoraModule, battery: Battery, shellBot: ShellBottom,
};

/* ─── Animated Collar ──────────────────────────────────────── */

function Collar({ scrollProgress }) {
  const strapRef = useRef();
  const buckleRef = useRef();
  const moduleRefs = useRef([]);
  const labelEls = useRef({});

  useFrame(() => {
    const t = scrollProgress?.current ?? 0;
    const e = remap(t, 0.12, 0.7); // 0 = assembled, 1 = fully exploded

    for (let i = 0; i < MODULES.length; i++) {
      const g = moduleRefs.current[i];
      if (!g) continue;
      const { assembled: a, explode: x } = MODULES[i];
      g.position.set(a[0] + x[0] * e, a[1] + x[1] * e, a[2] + x[2] * e);
    }

    // Tags fade in as the pieces separate (avoids clutter when stacked)
    const op = clamp01((e - 0.12) / 0.22);
    for (const id in labelEls.current) {
      const el = labelEls.current[id];
      if (el) el.style.opacity = op;
    }

    // Band + clip drop away together (clip stays attached to the strap)
    const bandY = -1.7 * e;
    if (strapRef.current) strapRef.current.position.y = bandY;
    if (buckleRef.current) buckleRef.current.position.y = bandY;
  });

  return (
    <group scale={0.7}>
      <group ref={strapRef}><Strap /></group>
      <group ref={buckleRef}><Clip /></group>
      <group position={[0, 0, DEVICE_Z]}>
        {MODULES.map((m, i) => {
          const C = COMP[m.id];
          const L = m.label ? LABELS[m.label] : null;
          return (
            <group key={m.id} ref={(el) => { moduleRefs.current[i] = el; }} position={m.assembled}>
              <C />
              {L && (
                <Html position={m.labelPos} center zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
                  <div ref={(el) => { labelEls.current[m.id] = el; }} style={{ ...TAG_STYLE, opacity: 0 }}>
                    <span style={TAG_ICON}>{L.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={TAG_TITLE}>{L.title}</h4>
                      <p style={TAG_SUB}>{L.sub}</p>
                    </div>
                  </div>
                </Html>
              )}
            </group>
          );
        })}
        <SideClamp side={-1} />
        <SideClamp side={1} />
      </group>
    </group>
  );
}

/* User can orbit the model by dragging; wheel still scrolls the page
   (zoom/pan off). Showcase auto-rotate stops on first interaction or
   once the teardown starts opening. */
function ControlsRig({ scrollProgress }) {
  const ref = useRef();
  const touched = useRef(false);
  useFrame(() => {
    const e = remap(scrollProgress?.current ?? 0, 0.12, 0.7);
    if (ref.current) ref.current.autoRotate = e < 0.08 && !touched.current;
  });
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableZoom={false}
      autoRotate
      autoRotateSpeed={0.55}
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.82}
      onStart={() => { touched.current = true; }}
    />
  );
}

/* ─── Scene ────────────────────────────────────────────────── */

function Scene({ scrollProgress }) {
  const assets = useCollarAssets();
  return (
    <AssetCtx.Provider value={assets}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 7, 6]} intensity={2.2} />
      <directionalLight position={[-5, 3, -4]} intensity={1.0} color="#dfe9ff" />
      <pointLight position={[0, -2, 5]} intensity={0.6} color={MOSS} />

      <ControlsRig scrollProgress={scrollProgress} />

      <Suspense fallback={null}>
        <Collar scrollProgress={scrollProgress} />
        <Environment resolution={512}>
          <Lightformer intensity={5}   position={[0, 5, 4]}    scale={[9, 5, 1]} color="#ffffff" />
          <Lightformer intensity={3}   position={[-6, 1, 3]}   scale={[5, 6, 1]} color="#dfe9ff" />
          <Lightformer intensity={3.6} position={[5, 3, -3]}   scale={[6, 6, 1]} color="#fff4e6" />
          <Lightformer intensity={2}   position={[0, -3, 4]}   scale={[8, 3, 1]} color="#d4edd9" />
          <Lightformer intensity={2.6} position={[3, 4, 5]}    scale={[2, 2, 1]} color="#ffffff" />
        </Environment>
      </Suspense>
    </AssetCtx.Provider>
  );
}

/* ─── Export ────────────────────────────────────────────────── */

export default function Collar3DScene({ scrollProgress }) {
  return (
    <Canvas
      camera={{ position: [0, 1.8, 12], fov: 38, near: 1, far: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  );
}
