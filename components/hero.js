'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Arrow, Crown } from './icons';

const slides = [
  {
    eyebrow: 'RÍO CUARTO · CÓRDOBA · ARGENTINA',
    lines: ['DE ACÁ.', 'PARA COMPARTIR.'],
    text: 'Cerveza artesanal con carácter propio. Para los encuentros que se disfrutan sin apuro.',
    label: 'Descubrí ImperioSur',
    href: '/#cervezas',
    caption: 'EL ORIGEN DE UN BUEN MOMENTO',
    type: 'river',
  },
  {
    eyebrow: 'NUESTRA SELECCIÓN · IMPERIOSUR GOLDEN',
    lines: ['LO SIMPLE.', 'BIEN HECHO.'],
    text: 'Dorada, suave y refrescante. Descubrí una variedad que invita a encontrarse.',
    label: 'Conocé la Golden',
    href: '/cervezas/golden',
    caption: 'IMPERIOSUR GOLDEN',
    type: 'golden',
  },
  {
    eyebrow: 'NUESTRA SELECCIÓN · IMPERIOSUR IPA',
    lines: ['CON CARÁCTER.', 'COMO VOS.'],
    text: 'El lúpulo se hace protagonista. Conocé el lado más aromático de ImperioSur.',
    label: 'Conocé la IPA',
    href: '/cervezas/ipa',
    caption: 'IMPERIOSUR IPA',
    type: 'ipa',
  },
];

const SLIDE_SECONDS = 10;

export default function Hero() {
  const [{ active }, setPlayback] = useState({
    active: 0,
    secondsLeft: SLIDE_SECONDS,
  });
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  const slide = slides[active];
  const playing = !paused && !reduced && visible;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setPlayback((current) =>
        current.secondsLeft > 1
          ? { ...current, secondsLeft: current.secondsLeft - 1 }
          : {
              active: (current.active + 1) % slides.length,
              secondsLeft: SLIDE_SECONDS,
            },
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [active, playing]);

  const move = (direction) =>
    setPlayback((current) => ({
      active: (current.active + direction + slides.length) % slides.length,
      secondsLeft: SLIDE_SECONDS,
    }));
  return (
    <section
      className={`hero hero-${slide.type}${playing ? '' : ' hero-paused'}`}
      aria-label="ImperioSur, cerveza artesanal"
      aria-roledescription="carrusel"
      style={{ '--slide-duration': `${SLIDE_SECONDS}s` }}
    >
      <div className="hero-landscape">
        <Image
          src="/images/hero-rio-4k.webp"
          alt="Una pinta junto al río con la corona y el nombre ImperioSur tallados en el vidrio"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 767px) max(110vw, 880px), 110vw"
          quality={90}
        />
      </div>
      <div className="hero-shade" />
      {slide.type !== 'river' && (
        <div className="hero-product" key={`image-${slide.type}`}>
          <div className="hero-halo" />
          <Image
            src={`/images/imperiosur-${slide.type}.png`}
            alt={`Botella ImperioSur ${slide.type}`}
            width={600}
            height={900}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
      <div className="hero-copy" key={active}>
        <p className="eyebrow hero-eyebrow">
          <span />
          {slide.eyebrow}
        </p>
        <h1>
          {slide.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero-description">{slide.text}</p>
        <Link className="button button-red" href={slide.href}>
          {slide.label}
          <Arrow />
        </Link>
      </div>
      <div className="hero-stamp" aria-hidden="true">
        <Crown />
        <span>IMPERIOSUR</span>
        <small>HECHA PARA COMPARTIR</small>
      </div>
      <div className="hero-bottom">
        <a className="scroll-cue" href="#cervezas">
          <span className="scroll-line" />
          SEGUÍ DESCUBRIENDO
        </a>
        <span className="hero-caption">{slide.caption}</span>
        <div className="slide-controls">
          <button
            className="slide-arrow"
            type="button"
            onClick={() => move(-1)}
            aria-label="Portada anterior"
          >
            <Arrow direction="left" />
          </button>
          <span className="slide-index">
            0{active + 1}
            <span> / 0{slides.length}</span>
          </span>
          <button
            className="slide-arrow"
            type="button"
            onClick={() => move(1)}
            aria-label="Portada siguiente"
          >
            <Arrow />
          </button>
          <button
            className="pause-slider"
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}
            aria-pressed={paused}
          >
            {paused ? '▶' : 'Ⅱ'}
          </button>
        </div>
      </div>
    </section>
  );
}
