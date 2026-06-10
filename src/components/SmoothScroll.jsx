'use client';
import { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';

/**
 * Scroll suave/inercial global (estilo icomat).
 * `root` ata Lenis al window (sin divs wrapper que rompan position:sticky)
 * y actualiza window.scrollY, por lo que framer-motion useScroll sigue
 * funcionando (Hero stack + pin 3D de CollarSensor).
 * smoothWheel solo afecta a la rueda; en touch queda el scroll nativo.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  // Expone la instancia en dev (útil para depurar / scrollear desde la consola).
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.__lenis = lenisRef.current?.lenis;
    }
  });

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
