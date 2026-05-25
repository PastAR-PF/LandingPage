'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Pricing.module.css';
import { HiCheck } from 'react-icons/hi';

const plans = [
  {
    name: 'Starter',
    price: 'USD 250',
    period: '/año',
    description: 'Ideal para establecimientos pequeños que quieren comenzar a digitalizar su operación.',
    features: [
      'Monitoreo en tiempo real',
      'Gestión básica de rodeo',
      'Hasta 50 animales',
      'Soporte por email',
      'App mobile incluida',
    ],
    featured: false,
    cta: 'Comenzar',
  },
  {
    name: 'Pro',
    price: 'USD 300',
    period: '/mes',
    description: 'Para productores que necesitan trazabilidad avanzada y análisis predictivo.',
    features: [
      'Todo de Starter',
      'Alertas y análisis predictivo',
      'Trazabilidad completa SENASA',
      'Reportes avanzados',
      'Hasta 500 animales',
      'Soporte prioritario',
      'Biblioteca de razas',
    ],
    featured: true,
    cta: 'Elegir Pro',
  },
  {
    name: 'Enterprise',
    price: 'A convenir',
    period: '',
    description: 'Infraestructura dedicada para grandes establecimientos con SLA garantizado.',
    features: [
      'Todo de Pro',
      'Animales ilimitados',
      'Infraestructura dedicada',
      'SLA garantizado',
      'Integración personalizada',
      'Account manager dedicado',
      'Onboarding presencial',
    ],
    featured: false,
    cta: 'Contactar',
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.section}`} id="pricing" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Planes</span>
          <h2 className="section-title">
            Elegí el plan que se adapte
            <br />
            <span className={styles.highlight}>a tu establecimiento</span>
          </h2>
          <p className="section-subtitle">
            Modelo SaaS con suscripción mensual. Sin costos ocultos. El hardware del collar
            se adquiere por separado.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`${styles.card} ${plan.featured ? styles.cardFeatured : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            >
              {plan.featured && <div className={styles.badge}>Más Popular</div>}
              <div className={styles.cardTop}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
                <p className={styles.planDesc}>{plan.description}</p>
              </div>
              <div className={styles.divider} />
              <ul className={styles.featureList}>
                {plan.features.map((feature, j) => (
                  <li key={j} className={styles.featureItem}>
                    <HiCheck className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} ${styles.planCta}`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
