'use client';
/**
 * ScrollReveal — wrapper reutilizable para revelar elementos al scroll.
 * Usa clip-path para un efecto más expresivo que un simple fade+y.
 *
 * Props:
 *   delay   — ms antes de empezar (default 0)
 *   y       — desplazamiento vertical inicial en px (default 32)
 *   clip    — usar clip-path reveal en lugar de translate (default false)
 *   children
 */
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, y = 32, clip = false, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const variants = clip
    ? {
        hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0, y: 16 },
        visible: {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: delay / 1000, ease: [0.23, 1, 0.32, 1] },
        },
      }
    : {
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, delay: delay / 1000, ease: [0.23, 1, 0.32, 1] },
        },
      };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}
