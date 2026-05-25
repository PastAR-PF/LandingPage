'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Problem.module.css';
import { HiExclamationCircle, HiCheckCircle, HiXCircle, HiShieldCheck } from 'react-icons/hi';

const problems = [
  'Registro manual en planillas de papel',
  'Sin trazabilidad del historial productivo',
  'Detección tardía de enfermedades',
  'Falta de datos para la toma de decisiones',
  'Dificultad para cumplir normativas sanitarias',
];

const solutions = [
  'Plataforma digital centralizada en la nube',
  'Historial completo con datos en tiempo real',
  'Alertas automáticas ante comportamiento anómalo',
  'Dashboards con métricas y análisis predictivo',
  'Trazabilidad completa alineada a SENASA',
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.section}`} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">El desafío</span>
          <h2 className="section-title">
            La ganadería necesita una
            <span className={styles.highlight}> transformación digital</span>
          </h2>
          <p className="section-subtitle">
            Los métodos tradicionales ya no son suficientes. PastAR digitaliza la gestión
            de tu campo para que tomes mejores decisiones.
          </p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={`${styles.card} ${styles.problemCard}`}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}><HiXCircle style={{ fontSize: '1.6rem', color: '#EF4444' }} /></span>
              <h3>Sin PastAR</h3>
            </div>
            <ul className={styles.list}>
              {problems.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  <HiExclamationCircle className={styles.iconProblem} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className={`${styles.card} ${styles.solutionCard}`}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}><HiShieldCheck style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }} /></span>
              <h3>Con PastAR</h3>
            </div>
            <ul className={styles.list}>
              {solutions.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  <HiCheckCircle className={styles.iconSolution} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
