'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Team.module.css';

export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.section}`} id="team" ref={ref}>
      <div className={`container ${styles.container}`}>
        <motion.div
          className={styles.imageBlock}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <img src="/images/team_history_1778804975684.png" alt="Equipo PastAR" className={styles.image} />
        </motion.div>

        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="section-label">Quiénes Somos</span>
          <h2 className="section-title">
            Nuestra <span className={styles.highlight}>Historia</span>
          </h2>
          <p className={styles.desc}>
            PastAR nació en las aulas de la UTN FRC con una visión clara: llevar la gestión ganadera al futuro mediante tecnología IoT accesible y de alto impacto. 
          </p>
          <p className={styles.desc}>
            Somos un equipo multidisciplinario de jóvenes ingenieros y diseñadores apasionados por la innovación. Entendemos que el campo argentino necesita soluciones modernas para optimizar la producción, mejorar el bienestar animal y simplificar el trabajo diario.
          </p>
          <p className={styles.desc}>
            Con nuestra plataforma, buscamos empoderar al productor con datos precisos y alertas en tiempo real, transformando la manera en que se gestionan los establecimientos agropecuarios hoy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
