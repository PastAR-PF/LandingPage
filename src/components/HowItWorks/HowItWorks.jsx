'use client';
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './HowItWorks.module.css';

/*
  Coordenadas para la imagen 1024×1024 (viewBox 0 0 100 100).
  sketch.{cx,cy,rx,ry} encierra el elemento en el dibujo:

  Corral  → izq, oval horizontal:  cx≈18, cy≈55, rx≈13, ry≈10
  Casa    → centro, alta+antena:   cx≈45, cy≈53, rx≈10, ry≈10
  Globo   → derecha, grupo:        cx≈62, cy≈36, rx≈10, ry≈7
  Insight → esquina der abajo:     cx≈84, cy≈55, rx≈14, ry≈10
*/
const steps = [
  {
    id: 'rodeo',
    num: '01',
    label: 'El comienzo',
    title: 'Registrás tu rodeo',
    desc: 'Cada animal recibe un collar electrónico. En minutos tenés tu rodeo digital con raza, genealogía e historial completo.',
    bullets: [
      'Collar electrónico para cada animal',
      'Historial clínico y reproductivo digital',
      'Sin papel, sin error humano',
    ],
    sketch: { cx: 15, cy: 55, rx: 12, ry: 8 },
  },
  {
    id: 'gateway',
    num: '02',
    label: 'La transmisión',
    title: 'La base receptora',
    desc: 'La casa IoT recibe los datos del collar cada pocos minutos via Bluetooth/WiFi. Sin internet, sin pérdida de información.',
    bullets: [
      'Batería solar, sin mantenimiento',
      'Resistente al campo argentino',
      'Funciona fuera de cobertura celular',
    ],
    sketch: { cx: 45, cy: 53, rx: 10, ry: 9 },
  },
  {
    id: 'nube',
    num: '03',
    label: 'La inteligencia',
    title: 'IA analiza en la nube',
    desc: 'Nuestros modelos correlacionan ITH, actividad y genealogía para detectar celo, partos inminentes y alertas sanitarias.',
    bullets: [
      'Detección de celo con 94% de precisión',
      'Alerta de partos 12 horas antes',
      'Análisis de estrés térmico por lote',
    ],
    sketch: { cx: 62, cy: 36, rx: 10, ry: 6 },
  },
  {
    id: 'insights',
    num: '04',
    label: 'El resultado',
    title: 'Recibís alertas',
    desc: 'Notificaciones con el historial del animal y recomendación concreta. Tomás decisiones desde donde estés.',
    bullets: [
      'App mobile y dashboard web',
      'Integración con tu veterinario',
      'Reportes semanales automáticos',
    ],
    sketch: { cx: 84, cy: 55, rx: 14, ry: 9 },
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  // El wrapper exterior es quien crea el scroll space de 400vh
  const wrapperRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // "start start" = cuando el top del wrapper llega al top del viewport (empieza)
    // "end end"    = cuando el bottom del wrapper llega al bottom del viewport (termina)
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Mapear 0-1 a índice 0..3, con el último paso sostenido al final
    const raw = v * steps.length;
    const i = Math.min(steps.length - 1, Math.floor(raw));
    setActive(i);
  });

  const step = steps[active];

  return (
    // Wrapper exterior: crea el espacio de scroll (4 × 100vh)
    <div ref={wrapperRef} className={styles.scrollWrapper} id="how">

      {/* Seccion sticky: ocupa exactamente 100vh, pegada al viewport */}
      <section className={styles.section}>

        {/* IZQUIERDA: titulo + accordion de pasos */}
        <div className={styles.leftCol}>

          <div className={styles.titleBlock}>
            <h2 className={styles.title}>
              Del Corral<br />
              a tus <span className={styles.highlight}>manos</span>
            </h2>
            <p className={styles.subtitle}>
              El ciclo de datos que potencia tu campo.
            </p>
          </div>

          {/* Pasos con timeline - compactos, sin min-height */}
          <div className={styles.stepsList}>
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={styles.step}
              >
                {/* Timeline: dot + linea vertical */}
                <div className={styles.timeline}>
                  <div
                    className={[
                      styles.dot,
                      active === i ? styles.dotActive : '',
                      active > i ? styles.dotDone : '',
                    ].join(' ')}
                  >
                    {active > i ? '✓' : s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`${styles.line} ${active > i ? styles.lineDone : ''}`} />
                  )}
                </div>

                {/* Contenido del paso */}
                <div className={styles.stepBody}>
                  <span className={styles.stepLabel}>{s.label}</span>
                  <h3 className={`${styles.stepTitle} ${active === i ? styles.stepTitleActive : ''}`}>
                    {s.title}
                  </h3>

                  {/* Detalle que se expande o comprime */}
                  <AnimatePresence initial={false}>
                    {active === i && (
                      <motion.div
                        className={styles.stepDetail}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <p className={styles.stepDesc}>{s.desc}</p>
                        <ul className={styles.bullets}>
                          {s.bullets.map((b, bi) => (
                            <motion.li
                              key={bi}
                              className={styles.bullet}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.28, delay: 0.12 + bi * 0.07 }}
                            >
                              <span className={styles.bulletCheck} aria-hidden="true">✓</span>
                              {b}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DERECHA: sketch */}
        <div className={styles.rightCol}>
          <div className={styles.sketchFrame}>
            <div className={styles.sketchWrapper}>
              <img
                src="/images/pastar-flow-sketch.png"
                alt="Diagrama del sistema PastAR"
                className={styles.sketchImg}
                draggable="false"
              />

              {/* Elipse de highlight sobre el elemento activo */}
              <svg
                className={styles.highlightSvg}
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <AnimatePresence mode="wait">
                  <motion.ellipse
                    key={active}
                    cx={step.sketch.cx}
                    cy={step.sketch.cy}
                    rx={step.sketch.rx}
                    ry={step.sketch.ry}
                    stroke="#1A5C38"
                    strokeWidth="0.7"
                    strokeDasharray="3.5 2.5"
                    fill="rgba(26,92,56,0.07)"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    style={{ transformOrigin: `${step.sketch.cx}% ${step.sketch.cy}%` }}
                  />
                </AnimatePresence>
              </svg>

              {/* Chip inferior con el paso activo */}
              <div className={styles.sketchChip}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active}
                    className={styles.sketchChipText}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step.num} — {step.title}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
