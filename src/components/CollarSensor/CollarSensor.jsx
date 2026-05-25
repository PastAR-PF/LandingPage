'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './CollarSensor.module.css';
import { HiLocationMarker, HiSun, HiChip, HiWifi, HiClock } from 'react-icons/hi';
import { MdThermostat } from 'react-icons/md';

const specs = [
  { icon: <HiChip />, title: 'Microprocesador ARM', desc: 'Alto rendimiento para análisis en el borde.' },
  { icon: <HiLocationMarker />, title: 'GPS Avanzado', desc: 'Precisión submétrica para tracking constante.' },
  { icon: <HiSun />, title: 'Autonomía Total', desc: 'Batería de larga duración optimizada.' },
  { icon: <MdThermostat />, title: 'Biometría', desc: 'Temperatura corporal y ritmo cardíaco.' },
  { icon: <HiWifi />, title: 'Conectividad LoRa', desc: 'Largo alcance para campos extensos.' },
  { icon: <HiClock />, title: 'IMU 9-Ejes', desc: 'Patrones de movimiento y comportamiento 3D.' },
];

export default function CollarSensor() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeView, setActiveView] = useState('front');

  const images = {
    front: '/images/collar_front_1778804945915.png',
    side: '/images/collar_side_1778804961246.png',
  };

  return (
    <section className={`section ${styles.section}`} id="collar" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Hardware</span>
          <h2 className="section-title">
            Smart Collar <span className={styles.highlight}>IoT</span>
          </h2>
          <p className="section-subtitle">
            Ingeniería de precisión. Diseño ergonómico. Conoce el dispositivo que 
            conecta a tu ganado con la nube en tiempo real.
          </p>
        </motion.div>

        <div className={styles.layout}>
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.viewControls}>
              <button 
                className={`${styles.viewBtn} ${activeView === 'front' ? styles.active : ''}`}
                onClick={() => setActiveView('front')}
              >
                Frontal
              </button>
              <button 
                className={`${styles.viewBtn} ${activeView === 'side' ? styles.active : ''}`}
                onClick={() => setActiveView('side')}
              >
                Lateral
              </button>
            </div>
            
            <div className={styles.imageWrapper}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeView}
                  src={images[activeView]}
                  alt="PastAR Smart Collar"
                  className={styles.collarImage}
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
            </div>
          </motion.div>

          <div className={styles.specsCol}>
            <div className={styles.specsGrid}>
              {specs.map((spec, i) => (
                <motion.div
                  key={i}
                  className={styles.specCard}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 * i }}
                >
                  <div className={styles.specIcon}>{spec.icon}</div>
                  <div>
                    <h4 className={styles.specTitle}>{spec.title}</h4>
                    <p className={styles.specDesc}>{spec.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
