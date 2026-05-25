'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import styles from './Features.module.css';
import { HiMap, HiChartBar, HiStatusOnline, HiBell, HiBookOpen } from 'react-icons/hi';

const features = [
  {
    icon: <HiChartBar />,
    title: 'Dashboard Analítico',
    description:
      'Visualiza métricas clave de tu rodeo en tiempo real: peso promedio, índice de salud, temperatura y actividad.',
    image: '/images/app-home-dashboard.png',
  },
  {
    icon: <HiMap />,
    title: 'Árbol Genealógico',
    description:
      'Visualizá la genealogía completa de cada animal: padres, crías y linaje con trazabilidad total.',
    image: '/images/app-genealogy-tree.png',
  },
  {
    icon: <HiStatusOnline />,
    title: 'Mapa en Vivo',
    description:
      'Monitoreá la ubicación exacta de cada animal en tiempo real sobre un mapa satelital de tu establecimiento.',
    image: '/images/app-map-tracking.png',
  },
  {
    icon: <HiBell />,
    title: 'Asistente IA',
    description:
      'Consultá el estado de cualquier animal, recibí alertas inteligentes y recomendaciones predictivas.',
    image: '/images/app-ai-chat.png',
  },
  {
    icon: <HiBookOpen />,
    title: 'Biblioteca de Razas',
    description:
      'Accedé a fichas técnicas completas con características, peso promedio y recomendaciones por raza.',
    image: '/images/app-cow-library.png',
  },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate for seamless looping
  const duplicatedFeatures = [...features, ...features];

  return (
    <section className={`section ${styles.section}`} id="features" ref={ref}>
      <div className={`blob blob-accent ${styles.blob1}`} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Funcionalidades</span>
          <h2 className="section-title">
            Todo lo que necesitas para
            <br />
            <span className={styles.highlight}>potenciar tu campo</span>
          </h2>
          <p className="section-subtitle">
            Descubre los módulos integrados que cubren desde el registro de animales hasta el análisis avanzado.
          </p>
        </motion.div>
      </div>

      <motion.div
        className={styles.carouselContainer}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div
          className={styles.carouselTrack}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {duplicatedFeatures.map((feature, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardImageWrap}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={320}
                  height={420}
                  className={styles.cardImage}
                  quality={90}
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.iconWrap}>
                  {feature.icon}
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
