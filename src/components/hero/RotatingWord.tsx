'use client';

import { useEffect, useState } from 'react';

/**
 * RotatingWord — swaps through a list of words with a soft rise-in motion.
 * Signature hero device. Respects reduced-motion (shows the first word static).
 */
export function RotatingWord({ words, intervalMs = 2100 }: { words: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  // Reserve width for the longest word so the line never jumps.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');

  return (
    <span className="mkt-rot" aria-live="polite">
      <span className="mkt-rot-ghost" aria-hidden="true">{longest}</span>
      <span key={i} className="mkt-rot-word">{words[i]}</span>
    </span>
  );
}
