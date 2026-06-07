'use client';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  motion, useInView, useScroll, useTransform, useMotionValueEvent,
} from 'framer-motion';
import styles from './CollarSensor.module.css';
import {
  HiWifi, HiGlobeAlt, HiServer, HiCheck,
} from 'react-icons/hi';

const Collar3DScene = dynamic(() => import('./Collar3DScene'), { ssr: false });

const connectivity = [
  {
    title: 'Red LoRaWAN',
    img: '/images/app-map-tracking.png',
    icon: <HiWifi />,
    bullets: [
      'Hasta 15 km de alcance en campo abierto',
      'Bajo consumo, ideal para collares solares',
      'Antenas fijas en el establecimiento',
    ],
  },
  {
    title: 'Antena móvil (Starlink)',
    img: '/images/cow_with_black_collar.png',
    icon: <HiGlobeAlt />,
    bullets: [
      'La camioneta lleva la conexión en los recorridos',
      'Los collares transmiten al paso, sin intervención',
      'Sin infraestructura fija adicional',
    ],
  },
  {
    title: 'Almacenamiento offline',
    img: '/images/app-dashboard.png',
    icon: <HiServer />,
    bullets: [
      'Los collares acumulan datos localmente',
      'Sincronización automática al restablecer señal',
      'Sin pérdida de información por cortes de red',
    ],
  },
];

export default function CollarSensor() {
  const sectionRef      = useRef(null);
  const scrollDriverRef = useRef(null);
  const scrollProgressRef = useRef(0);

  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: scrollDriverRef,
    offset: ['start start', 'end end'],
  });

  // Transient subscription — no React re-renders
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollProgressRef.current = v;
  });

  // Component tags now live inside the 3D scene (anchored to each module).
  const hintOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  return (
    <section className={`section ${styles.section}`} id="collar" ref={sectionRef}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="section-label">Hecho para aguantar el campo</span>
          <motion.h2
            className="section-title"
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={inView ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            Smart Collar <span className={styles.highlight}>IoT</span>
          </motion.h2>
          <p className="section-subtitle">
            Arrastrá para girarlo y scrolleá para desarmar el módulo y ver cada componente.
          </p>
        </motion.div>
      </div>

      {/* ── Scroll-driven 3D experience ────────────────────────── */}
      <div className={styles.scrollDriver} ref={scrollDriverRef}>
        <div className={styles.stickyScene}>

          {/* Full-width canvas — drag to rotate, scroll to disassemble.
              Component tags are anchored to each module inside the scene. */}
          <Collar3DScene scrollProgress={scrollProgressRef} />

          {/* Scroll hint */}
          <motion.div className={styles.scrollHint} style={{ opacity: hintOpacity }}>
            <span>Scrolleá para explorar</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Provides scroll distance for the sticky animation */}
        <div className={styles.scrollSpace} aria-hidden />
      </div>

      {/* ── Connectivity ──────────────────────────────────────── */}
      <div className={styles.connectivity}>
        <div className="container">
          <motion.div
            className={styles.connHeader}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <h3 className={styles.connTitle}>Conectividad en entornos rurales</h3>
            <p className={styles.connSubtitle}>
              Donde las redes 3G/4G no llegan, evaluamos tres alternativas de transmisión:
            </p>
          </motion.div>

          <div className={styles.connGrid}>
            {connectivity.map((c, i) => (
              <motion.div
                key={i}
                className={styles.connCard}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className={styles.connCardImgWrap}>
                  <img src={c.img} alt={c.title} className={styles.connCardImg} />
                  <div className={styles.connCardBadge}>{c.icon}</div>
                </div>
                <div className={styles.connCardBody}>
                  <h4 className={styles.connCardTitle}>{c.title}</h4>
                  <ul className={styles.connCardBullets}>
                    {c.bullets.map((b, j) => (
                      <li key={j}>
                        <HiCheck className={styles.connCardCheck} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
