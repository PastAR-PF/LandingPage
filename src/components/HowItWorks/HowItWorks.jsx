'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './HowItWorks.module.css';
import DotGrid from '@/components/ui/DotGrid';
import Stepper, { Step } from '@/components/ui/Stepper';

const steps = [
  {
    n: '01',
    title: 'Registrás tu rodeo',
    body: 'Cada animal recibe su caravana electrónica única. El sistema registra raza, fecha de nacimiento, genealogía, categoría productiva y peso inicial. La carga se hace desde la app directamente en el campo, incluso sin conectividad.',
  },
  {
    n: '02',
    title: 'El collar transmite datos',
    body: 'El collar integra acelerómetro y giroscopio, sensor de temperatura y humedad, y GPS NEO-6M. El microcontrolador ESP32 gestiona el Deep Sleep, almacena un buffer local y transmite por WiFi/Bluetooth cuando hay conexión.',
  },
  {
    n: '03',
    title: 'La plataforma analiza',
    body: 'Los datos se procesan correlacionando el Índice de Temperatura y Humedad (ITH) con la actividad del rodeo. Los modelos detectan automáticamente celo, partos y eventos sanitarios, modelados por raza.',
  },
  {
    n: '04',
    title: 'Recibís alertas y reportes',
    body: 'El sistema te avisa con anticipación: comportamiento anómalo, animal fuera del perímetro o desviaciones productivas. Cada alerta incluye el historial del animal y una recomendación de acción concreta.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className={styles.section} id="how" ref={ref}>
      {/* DotGrid invertido — fondo Forest oscuro, puntos sage */}
      <DotGrid
        dotSize={4}
        gap={26}
        baseColor="#2A6B43"
        activeColor="#85C49A"
        proximity={130}
        shockRadius={200}
        shockStrength={3}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className={`section-label ${styles.label}`}>Cómo funciona</span>
          <motion.h2
            className={styles.title}
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={inView ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            De la caravana al <span className={styles.highlight}>insight</span>
          </motion.h2>
          <p className={styles.subtitle}>
            Un flujo continuo de datos que convierte cada animal en una fuente de inteligencia productiva.
          </p>
        </motion.div>

        {/* Stepper en card blanca */}
        <motion.div
          className={styles.stepperCard}
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <Stepper backButtonText="Anterior" nextButtonText="Siguiente">
            {steps.map((s, i) => (
              <Step key={i}>
                <div className={styles.stepContent}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepBody}>{s.body}</p>
                </div>
              </Step>
            ))}
          </Stepper>
        </motion.div>
      </div>
    </section>
  );
}
