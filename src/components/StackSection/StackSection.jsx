'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './StackSection.module.css';

/**
 * Pane de "tapado" estilo icomat que funciona con secciones de CUALQUIER alto.
 *
 * Truco: `position: sticky` con `top = viewportHeight - sectionHeight` (<= 0).
 * Así la sección scrollea normal (se lee COMPLETA) y recién queda fija mostrando
 * su ÚLTIMA pantalla, justo en el momento en que la SIGUIENTE sube y la tapa
 * (orden del DOM = la siguiente pinta encima). Para una sección de exactamente
 * 1 pantalla, top = 0 (sticky clásico).
 *
 * Profundidad: overlay que oscurece la sección mientras la tapan.
 * En mobile (<768px) se desactiva: scroll normal.
 */
export default function StackSection({ children }) {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const [range, setRange] = useState([0, 1]);
  const [stickyTop, setStickyTop] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mql = window.matchMedia('(max-width: 768px)');

    const measure = () => {
      if (mql.matches) {
        setEnabled(false);
        return;
      }
      const vh = window.innerHeight;
      const h = el.offsetHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const bottom = top + h;
      // Se fija mostrando su última pantalla (top negativo si es más alta que el viewport).
      setStickyTop(Math.min(0, vh - h));
      // La siguiente la tapa durante la última pantalla de scroll de esta sección.
      setRange([bottom - vh, bottom]);
      setEnabled(true);
    };

    measure();
    // Re-medir cuando cambia el alto (fuentes/imágenes que cargan tarde) o el viewport.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    mql.addEventListener?.('change', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      mql.removeEventListener?.('change', measure);
    };
  }, []);

  const darken = useTransform(scrollY, range, [0, 0.42], { clamp: true });

  return (
    <div
      ref={ref}
      className={styles.pane}
      style={enabled ? { top: `${stickyTop}px` } : undefined}
    >
      {children}
      <motion.div
        className={styles.darken}
        style={{ opacity: enabled ? darken : 0 }}
        aria-hidden
      />
    </div>
  );
}
