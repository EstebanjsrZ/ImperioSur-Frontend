'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Effects() {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      element.setAttribute('data-visible', 'false');
      observer.observe(element);
    });
    let frame;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--hero-shift',
          `${Math.min(window.scrollY * 0.18, 150)}px`,
        );
        frame = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty('--hero-shift');
    };
  }, [pathname]);
  return null;
}
