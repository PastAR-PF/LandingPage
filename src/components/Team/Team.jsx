'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import styles from './Team.module.css';

const members = [
  { name: 'Tiziana Carrizo', initials: 'TC', legajo: '94506', color: '#1A5C38', photo: '/images/team/pendant.jpg' },
  { name: 'José I. Maspero Castro', initials: 'JM', legajo: '94304', color: '#3A8A58' },
  { name: 'Salvador Gibert', initials: 'SG', legajo: '94181', color: '#7A4F35' },
  { name: 'Marco Figueroa', initials: 'MF', legajo: '94359', color: '#246E46', photo: '/images/team/sweater.jpg' },
  { name: 'Agustín Rey Laje', initials: 'AR', legajo: '95535', color: '#134430', photo: '/images/team/rio.jpg' },
];

const values = [
  { metric: 'Scrum', label: 'Metodología ágil adaptada' },
  { metric: '5', label: 'Módulos de software' },
  { metric: '2026', label: 'Año de lanzamiento' },
];

export default function Team() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section className={`section ${styles.section}`} id="team" ref={sectionRef}>
      <div className="container">
        {/* Parte 1 — Historia */}
        <div className={styles.historyLayout}>
          <motion.div
            className={styles.imageBlock}
            initial={{ opacity: 0, x: -48, scale: 0.96 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.img
              src="/images/team_history_1778804975684.png"
              alt="Equipo PastAR"
              className={styles.image}
              style={{ y: imgY }}
            />
            {/* Badge flotante */}
            <motion.div
              className={styles.floatBadge}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ type: 'spring', delay: 0.5, bounce: 0.4, duration: 0.8 }}
            >
              <span className={styles.floatBadgeDot} />
              Córdoba · Argentina
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.textBlock}
            initial={{ opacity: 0, x: 48 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="section-label">Los que lo construyeron</span>
            <motion.h2
              className="section-title"
              initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
              animate={inView ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              Ingeniería con <span className={styles.highlight}>raíces en el campo</span>
            </motion.h2>

            {[
              'PastAR nació en Córdoba con una visión clara: migrar la trazabilidad ganadera del papel a un ecosistema digital de precisión, pensado para la realidad del campo argentino.',
              'Combinamos IoT, análisis de datos y software de gestión para cubrir el ciclo productivo completo del animal — desde la cría hasta el feedlot — con detección temprana de anomalías y respaldo técnico para decisiones genéticas.',
            ].map((text, i) => (
              <motion.p
                key={i}
                className={styles.desc}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.3 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                {text}
              </motion.p>
            ))}

            {/* Valores */}
            <motion.div
              className={styles.values}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.52, ease: [0.23, 1, 0.32, 1] }}
            >
              {values.map((v, i) => (
                <div key={i} className={styles.value}>
                  <span className={styles.valueMetric}>{v.metric}</span>
                  <span className={styles.valueLabel}>{v.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Parte 2 — El equipo */}
        <div className={styles.teamGrid}>
          <motion.h3
            className={styles.teamGridTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            El equipo
          </motion.h3>

          <div className={styles.members}>
            {members.map((m, i) => (
              <motion.div
                key={m.legajo}
                className={styles.memberCard}
                style={{ '--accent': m.color, '--accent-ring': `${m.color}22` }}
                initial={{ opacity: 0, y: 32, scale: 0.94 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: 'spring', delay: 0.2 + i * 0.08, bounce: 0.3, duration: 0.7 }}
                whileHover={{ y: -6, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
              >
                <div
                  className={styles.avatar}
                  style={m.photo ? { '--accent': m.color } : { background: m.color }}
                >
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className={styles.avatarImg} />
                  ) : (
                    m.initials
                  )}
                </div>
                <span className={styles.memberName}>{m.name}</span>
                <span className={styles.memberLegajo}>Legajo {m.legajo}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
