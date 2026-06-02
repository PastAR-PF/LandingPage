'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './CollarSensor.module.css';
import { HiLocationMarker, HiSun, HiChip, HiWifi } from 'react-icons/hi';
import { MdThermostat, MdSpeed } from 'react-icons/md';

const specs = [
  { icon: <MdSpeed />, title: 'Acelerómetro + Giroscopio', desc: 'Clasifican la actividad: pastoreo, rumia, desplazamiento y reposo.' },
  { icon: <MdThermostat />, title: 'Temperatura y Humedad', desc: 'Capturan las condiciones ambientales para el cálculo del ITH.' },
  { icon: <HiLocationMarker />, title: 'GPS NEO-6M', desc: 'Coordenadas del animal para referenciarlo sobre la imagen aérea.' },
  { icon: <HiSun />, title: 'Batería + Panel Solar', desc: 'El panel se orienta hacia arriba por el contrapeso. Autonomía sin red eléctrica.' },
  { icon: <HiChip />, title: 'Microcontrolador ESP32', desc: 'Lógica de Deep Sleep, buffer local y transmisión por WiFi/Bluetooth.' },
  { icon: <HiWifi />, title: 'Conectividad LPWAN', desc: 'LoRaWAN de largo alcance y bajo consumo para campos extensos.' },
];

const connectivity = [
  { title: 'Red LoRaWAN', desc: 'Transmisión de largo alcance y bajo consumo con antenas fijas en el establecimiento.' },
  { title: 'Antena móvil (Starlink)', desc: 'Durante los recorridos, la camioneta lleva conectividad y los collares transmiten al pasar.' },
  { title: 'Almacenamiento offline', desc: 'Los collares acumulan datos y los transmiten cuando se restablece la conexión.' },
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
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="section-label">Hardware</span>
          <motion.h2
            className="section-title"
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={inView ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            Smart Collar <span className={styles.highlight}>IoT</span>
          </motion.h2>
          <p className="section-subtitle">
            Diseño de referencia del collar sensor: el componente central de captura
            de datos en campo, autónomo y alimentado por energía solar.
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
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    type: 'spring',
                    duration: 0.6,
                    delay: 0.08 * i,
                    bounce: 0.15,
                  }}
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

        {/* Conectividad */}
        <motion.div
          className={styles.connectivity}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className={styles.connHeader}>
            <h3 className={styles.connTitle}>Conectividad en entornos rurales</h3>
            <p className={styles.connSubtitle}>
              Donde las redes 3G/4G no llegan, evaluamos tres alternativas de transmisión:
            </p>
          </div>
          <div className={styles.connGrid}>
            {connectivity.map((c, i) => (
              <motion.div
                key={i}
                className={styles.connCard}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className={styles.connNum}>{String(i + 1).padStart(2, '0')}</span>
                <h4 className={styles.connCardTitle}>{c.title}</h4>
                <p className={styles.connCardDesc}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
