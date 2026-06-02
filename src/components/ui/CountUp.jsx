'use client';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';

export default function CountUp({
  to, from = 0, direction = 'up', delay = 0, duration = 2,
  className = '', startWhen = true, separator = '', onStart, onEnd,
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const maxDecimals = Math.max(
    ...[from, to].map(n => { const s = n.toString(); return s.includes('.') && parseInt(s.split('.')[1]) ? s.split('.')[1].length : 0; })
  );

  const formatValue = useCallback((latest) => {
    const opts = { useGrouping: !!separator, minimumFractionDigits: maxDecimals, maximumFractionDigits: maxDecimals };
    const fmt = Intl.NumberFormat('en-US', opts).format(latest);
    return separator ? fmt.replace(/,/g, separator) : fmt;
  }, [maxDecimals, separator]);

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(direction === 'down' ? to : from);
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (!isInView || !startWhen) return;
    onStart?.();
    const t1 = setTimeout(() => motionValue.set(direction === 'down' ? from : to), delay * 1000);
    const t2 = setTimeout(() => onEnd?.(), delay * 1000 + duration * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
