'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Arrow, Crown } from './icons';

const slides = [
  { eyebrow: 'RÍO CUARTO · CÓRDOBA · ARGENTINA', lines: ['DE ACÁ.', 'PARA COMPARTIR.'], text: 'Cerveza artesanal con carácter propio. Para los encuentros que se disfrutan sin apuro.', label: 'Descubrí ImperioSur', href: '/#cervezas', caption: 'EL ORIGEN DE UN BUEN MOMENTO', type: 'river' },
  { eyebrow: 'NUESTRA SELECCIÓN · IMPERIOSUR GOLDEN', lines: ['LO SIMPLE.', 'BIEN HECHO.'], text: 'Dorada, suave y refrescante. Descubrí una variedad que invita a encontrarse.', label: 'Conocé la Golden', href: '/cervezas/golden', caption: 'IMPERIOSUR GOLDEN', type: 'golden' },
  { eyebrow: 'NUESTRA SELECCIÓN · IMPERIOSUR IPA', lines: ['CON CARÁCTER.', 'COMO VOS.'], text: 'El lúpulo se hace protagonista. Conocé el lado más aromático de ImperioSur.', label: 'Conocé la IPA', href: '/cervezas/ipa', caption: 'IMPERIOSUR IPA', type: 'ipa' },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(true);
  const slide = slides[active];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused || hover || reduced) return;
    const timer = setInterval(() => { if (!document.hidden) setActive((value) => (value + 1) % slides.length); }, 8500);
    return () => clearInterval(timer);
  }, [paused, hover, reduced]);

  const move = (direction) => setActive((value) => (value + direction + slides.length) % slides.length);
  return <section className={`hero hero-${slide.type}`} aria-label="ImperioSur, cerveza artesanal" aria-roledescription="carrusel" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
    <div className="hero-landscape"><Image src="/images/hero-rio.png" alt="Una pinta de cerveza dorada junto al río al atardecer" fill loading="eager" fetchPriority="high" sizes="100vw" quality={90} /></div>
    <div className="hero-shade" />
    {slide.type !== 'river' && <div className="hero-product" key={`image-${slide.type}`}><div className="hero-halo" /><Image src={`/images/imperiosur-${slide.type}.png`} alt={`Botella ImperioSur ${slide.type}`} width={600} height={900} loading="eager" fetchPriority="high" /></div>}
    <div className="hero-copy" key={active}>
      <p className="eyebrow hero-eyebrow"><span />{slide.eyebrow}</p>
      <h1>{slide.lines.map((line) => <span key={line}>{line}</span>)}</h1>
      <p className="hero-description">{slide.text}</p>
      <Link className="button button-red" href={slide.href}>{slide.label}<Arrow /></Link>
    </div>
    <div className="hero-stamp" aria-hidden="true"><Crown /><span>IMPERIOSUR</span><small>HECHA PARA COMPARTIR</small></div>
    <div className="hero-bottom">
      <a className="scroll-cue" href="#cervezas"><span className="scroll-line" />SEGUÍ DESCUBRIENDO</a>
      <span className="hero-caption">{slide.caption}</span>
      <div className="slide-controls"><button className="slide-arrow" type="button" onClick={() => move(-1)} aria-label="Portada anterior"><Arrow direction="left" /></button><span className="slide-index">0{active + 1}<span> / 03</span></span><button className="slide-arrow" type="button" onClick={() => move(1)} aria-label="Portada siguiente"><Arrow /></button><button className="pause-slider" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'} aria-pressed={paused}>{paused ? '▶' : 'Ⅱ'}</button></div>
    </div>
  </section>;
}
