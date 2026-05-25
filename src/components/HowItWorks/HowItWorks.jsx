'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './HowItWorks.module.css';
import { HiCube, HiDeviceMobile, HiStatusOnline, HiLightningBolt } from 'react-icons/hi';

const steps = [
  {
    number: '01',
    title: 'Colocá el collar',
    description: 'Ajustá el collar sensor en el cuello del animal. Es liviano, resistente al agua y se carga con energía solar.',
    icon: <HiCube />,
  },
  {
    number: '02',
    title: 'Registrá tu rodeo',
    description: 'Cargá la información de tu establecimiento, potreros y categorías de hacienda en la plataforma.',
    icon: <HiDeviceMobile />,
  },
  {
    number: '03',
    title: 'Monitoreá en tiempo real',
    description: 'Accedé al dashboard para ver ubicación, temperatura, actividad y alertas de cada animal, 24/7.',
    icon: <HiStatusOnline />,
  },
  {
    number: '04',
    title: 'Tomá decisiones con datos',
    description: 'Usá los análisis predictivos y reportes para optimizar la producción y prevenir problemas sanitarios.',
    icon: <HiLightningBolt />,
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.section}`} id="how-it-works" ref={ref}>
      {/* Wave top */}
      <div className={styles.waveTop}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,0 L0,0 Z" fill="var(--color-bg)" />
        </svg>
      </div>

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Cómo funciona</span>
          <h2 className="section-title">
            Empezá en <span className={styles.highlight}>4 simples pasos</span>
          </h2>
          <p className="section-subtitle">
            Desde la instalación del collar hasta los primeros insights, en minutos.
          </p>
        </motion.div>

        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={styles.step}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            >
              <div className={styles.stepNumber}>
                <span>{step.number}</span>
              </div>
              {i < steps.length - 1 && <div className={styles.connector} />}
              <div className={styles.stepContent}>
                <span className={styles.stepIcon}>{step.icon}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wave bottom */}
      <div className={styles.waveBottom}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,30 1440,40 L1440,80 L0,80 Z" fill="var(--color-bg)" />
        </svg>
      </div>
    </section>
  );
}
