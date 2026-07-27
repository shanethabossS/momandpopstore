'use client';

import { useEffect } from 'react';

export function MarketplaceMotion() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    for (const target of targets) observer.observe(target);

    const hero = document.querySelector<HTMLElement>('[data-market-hero]');
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        hero.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      });
    };
    hero?.addEventListener('pointermove', move, { passive: true });

    return () => {
      observer.disconnect();
      hero?.removeEventListener('pointermove', move);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
