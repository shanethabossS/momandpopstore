'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CountUp — animates a number from 0 to `to` when it scrolls into view.
 * Real numbers only. Respects reduced-motion (renders the final value at once).
 */
export function CountUp({ to, duration = 1200, suffix = '' }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(to); return; }

    let timer: ReturnType<typeof setInterval> | null = null;
    let started = false;
    const step = 1000 / 60;
    const run = () => {
      const start = Date.now();
      timer = setInterval(() => {
        const t = Math.min(1, (Date.now() - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(eased * to));
        if (t >= 1 && timer) { clearInterval(timer); timer = null; }
      }, step);
    };
    const begin = () => { if (!started) { started = true; run(); io.disconnect(); } };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) begin();
    }, { threshold: 0.4 });
    io.observe(node);
    // Fallback: never leave the number stuck at 0 if the observer never fires.
    const fallback = setTimeout(begin, 1200);
    return () => { io.disconnect(); clearTimeout(fallback); if (timer) clearInterval(timer); };
  }, [to, duration]);

  return <span ref={ref} className="tabular-nums">{value.toLocaleString()}{suffix}</span>;
}
