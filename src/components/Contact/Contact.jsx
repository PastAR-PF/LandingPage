'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Contact.module.css';
import { HiMail, HiLocationMarker } from 'react-icons/hi';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.section}`} id="contact" ref={ref}>
      <div className={`blob blob-green ${styles.blob1}`} />
      <div className={`blob blob-accent ${styles.blob2}`} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Sumate desde el día uno</span>
          <motion.h2
            className={`section-title ${styles.headerTitle}`}
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={inView ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            Unite a la ganadería
            <br />
            <span className={styles.highlight}>inteligente</span>
          </motion.h2>
          <p className="section-subtitle">
            ¿Querés saber más sobre PastAR? Dejanos tu mensaje y te contactamos para una demo personalizada.
          </p>
        </motion.div>

        <div className={styles.layout}>
          <motion.div
            className={styles.infoCol}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Email destacado */}
            <a href="mailto:contacto@pastar.com.ar" className={styles.emailHighlight}>
              <div className={styles.infoIcon}>
                <HiMail />
              </div>
              <div>
                <div className={styles.infoCard} style={{ background: 'none', border: 'none', padding: 0 }}>
                  <h4>Escribinos directo</h4>
                </div>
                <span className={styles.emailAddress}>contacto@pastar.com.ar</span>
              </div>
            </a>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <HiLocationMarker />
              </div>
              <div>
                <h4>Ubicación</h4>
                <p>Córdoba, Argentina</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            className={styles.form}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="contact-name" className={styles.label}>Nombre</label>
                <input
                  type="text"
                  id="contact-name"
                  className={styles.input}
                  placeholder="Tu nombre"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contact-email" className={styles.label}>Email</label>
                <input
                  type="email"
                  id="contact-email"
                  className={styles.input}
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact-subject" className={styles.label}>Asunto</label>
              <input
                type="text"
                id="contact-subject"
                className={styles.input}
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact-message" className={styles.label}>Mensaje</label>
              <textarea
                id="contact-message"
                className={styles.textarea}
                placeholder="Contanos sobre tu establecimiento y necesidades..."
                rows={5}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Enviar Mensaje
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
