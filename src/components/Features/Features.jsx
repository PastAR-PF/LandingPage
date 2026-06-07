'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Features.module.css';
import MagicBento from '@/components/ui/MagicBento';

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className={styles.section} id="features" ref={ref}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="section-label">El campo que piensa solo</span>
          <motion.h2
            className="section-title"
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={inView ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            Cinco módulos para <span className={styles.highlight}>potenciar tu campo</span>
          </motion.h2>
          <p className="section-subtitle">
            PastAR integra cinco módulos de software que cubren el ciclo productivo
            completo del animal, desde la gestión de accesos hasta la recomendación de razas.
          </p>
        </motion.div>

        {/* MagicBento */}
        <motion.div
          className={styles.bentoWrap}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={320}
            particleCount={10}
            glowColor="58, 138, 88"
          />
        </motion.div>
      </div>
    </section>
  );
}
