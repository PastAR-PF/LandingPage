'use client';
import { useRef, useEffect } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';
import styles from './Hero.module.css';
import LightRays from './LightRays';
import TextType from '@/components/ui/TextType';
import CountUp from '@/components/ui/CountUp';


export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  /* Parallax sutil en la imagen de la vaca */
  const imgY = useMotionValue(0);
  const imgSpring = useSpring(imgY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onScroll = () => imgY.set(window.scrollY * 0.12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [imgY]);

  return (
    <section className={styles.hero} id="hero" ref={ref}>
      <div className={styles.bgSolid} />

      {/* Light Rays — origen top-right, apuntan hacia la vaca */}
      <LightRays
        raysOrigin="top-right"
        raysColor="#A8D5B5"
        raysSpeed={0.7}
        lightSpread={3.2}
        rayLength={3.8}
        fadeDistance={1.8}
        saturation={1.8}
        pulsating={true}
        followMouse={true}
        mouseInfluence={0.22}
        noiseAmount={0.04}
        distortion={0.06}
      />

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
                as="span"
                typingSpeed={62}
                initialDelay={450}
                loop={false}
                showCursor={true}
                cursorCharacter="▍"
                cursorClassName={styles.cursor}
              />
            </h1>
            {/* Guiño implícito a la bandera argentina — celeste / blanco / celeste */}
            <span className={styles.flagRibbon} aria-hidden="true" />
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

      {/* Imagen vaca con parallax */}
      <motion.div
        className={styles.imageBlock}
        style={{ y: imgSpring }}
        initial={{ opacity: 0, x: 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
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
          <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="var(--color-bg)" />
        </svg>
      </div>
    </section>
  );
}
