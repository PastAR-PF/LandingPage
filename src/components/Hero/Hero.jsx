'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Hero.module.css';
import StampArgentino from './StampArgentino';
import TextType from '@/components/ui/TextType';
import CountUp from '@/components/ui/CountUp';


export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [stamped, setStamped] = useState(false);
  const [typed, setTyped] = useState(false);

  const handleTypingComplete = () => {
    setTyped(true);
    setStamped(true);
  };

  return (
    <section className={styles.hero} id="hero" ref={ref}>
      <div className={styles.bgSolid} />

      {/* Video de fondo (loop, silenciado) + overlay forest para contraste */}
      <video
        className={styles.bgVideo}
        src="/videos/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className={styles.bgOverlay} />

      <div className={styles.content}>
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Badge */}
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className={styles.badgeDot} />
            Ganadería de precisión · IoT + IA
          </motion.div>

          <motion.div
            className={styles.sloganBlock}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className={styles.title}>
              <TextType
                text="Nuestro campo, nuestros datos"
                typingSpeed={100}
                initialDelay={450}
                loop={false}
                showCursor={!typed}
                cursorCharacter="▍"
                cursorClassName={styles.cursor}
                onComplete={handleTypingComplete}
              />
            </h1>
            {/* Guiño implícito a la bandera argentina — celeste / blanco / celeste */}
            <span className={styles.flagRibbon} aria-hidden="false" />
          </motion.div>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            Trazabilidad individual y alertas predictivas diseñadas para la realidad argentina.
            Transformá el esfuerzo diario en rentabilidad asegurada con tecnología local.
          </motion.p>

          {/* Stats con contadores */}
          <motion.div
            className={styles.stats}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.44, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className={styles.stat}>
              <span className={styles.statNumber}><CountUp from={0} to={24} duration={1.8} />/<CountUp from={0} to={7} duration={1.4} /></span>
              <span className={styles.statLabel}>Monitoreo continuo</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}><CountUp from={0} to={47} duration={2} />%</span>
              <span className={styles.statLabel}>Más eficiencia</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}><CountUp from={0} to={3} duration={1.2} />x</span>
              <span className={styles.statLabel}>Detección temprana</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Sello argentino — impacta al terminar de tipear el título */}
      <div className={styles.stampAnchor} aria-hidden="true">
        <motion.div
          className={styles.stamp}
          initial={{ opacity: 0, scale: 4, rotate: -18, filter: 'blur(5px)' }}
          animate={stamped ? {
            opacity: [0, 1, 1],
            scale: [4, 0.9, 1],
            rotate: [-18, -9, -8],
            filter: ['blur(5px)', 'blur(0px)', 'blur(0px)'],
          } : {}}
          transition={{ duration: 0.45, times: [0, 0.6, 1], ease: 'easeOut' }}
        >
          <StampArgentino />
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className={styles.waveBottom}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="var(--color-bg)" />
        </svg>
      </div>
    </section>
  );
}
