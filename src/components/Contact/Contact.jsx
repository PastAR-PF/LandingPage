'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Contact.module.css';
import { HiMail, HiLocationMarker, HiPhone, HiAcademicCap } from 'react-icons/hi';

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
          <span className="section-label">Contacto</span>
          <h2 className="section-title">
            Unite a la ganadería
            <br />
            <span className={styles.highlight}>inteligente</span>
          </h2>
          <p className="section-subtitle">
            ¿Querés saber más sobre PastAR? Dejanos tu mensaje y te contactamos para una demo personalizada.
          </p>
        </motion.div>

        <div className={styles.layout}>
          <motion.div
            className={styles.infoCol}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <HiMail />
              </div>
              <div>
                <h4>Email</h4>
                <p>contacto@pastar.com.ar</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <HiLocationMarker />
              </div>
              <div>
                <h4>Ubicación</h4>
                <p>UTN — Facultad Regional Córdoba, Argentina</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <HiPhone />
              </div>
              <div>
                <h4>Teléfono</h4>
                <p>+54 351 XXX XXXX</p>
              </div>
            </div>

            <div className={styles.utnBadge}>
              <HiAcademicCap className={styles.utnIcon} />
              <p>Proyecto de Tesis Final — Ingeniería en Sistemas, UTN FRC 2025</p>
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
