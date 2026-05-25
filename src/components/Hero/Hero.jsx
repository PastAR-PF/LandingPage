'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className={styles.hero} id="hero" ref={ref}>
      {/* Background image */}
      <div className={styles.bgImage}>
        <img src="/images/hero_bg_1778804931512.png" alt="Fondo aesthetic premium PastAR" />
        <div className={styles.bgOverlay} />
      </div>

      {/* Blobs */}
      <div className={`blob blob-green ${styles.blob1}`} />
      <div className={`blob blob-accent ${styles.blob2}`} />

      <div className={styles.content}>
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className={styles.title}>
            Minimizando riesgos, <span className={styles.titleAccent}>maximizando la producción</span>
          </h1>

          <p className={styles.subtitle}>
            Ofrecemos el sistema más avanzado de trazabilidad y monitoreo IoT para 
            el productor moderno. Simplifica tu operación y potencia tus resultados.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Monitoreo continuo</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>IoT</span>
              <span className={styles.statLabel}>Tracking Avanzado</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>Data</span>
              <span className={styles.statLabel}>Análisis Predictivo</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.imageBlock}
        initial={{ opacity: 0, x: 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.phoneWrapper}>
          <img
            src="/images/cow_transparent.png"
            alt="Vaca con Smart Collar PastAR"
            className={styles.phoneImage}
          />
        </div>
      </motion.div>

      {/* Wave bottom */}
      <div className={styles.waveBottom}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
            fill="var(--color-bg)"
          />
        </svg>
      </div>
    </section>
  );
}
