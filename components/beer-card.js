import Image from 'next/image';
import Link from 'next/link';
import { Arrow, Crown } from './icons';

export default function BeerCard({ cerveza, index = 0 }) {
  return <article className="beer-card" data-reveal style={{ '--beer-color': cerveza.color, '--beer-background': cerveza.fondo, '--reveal-delay': `${index * 90}ms` }}>
    <Link className="beer-visual" href={`/cervezas/${cerveza.slug}`} aria-label={`Conocer ImperioSur ${cerveza.nombre}`}><span className="beer-disc"><Crown /></span><Image src={cerveza.imagen} alt={`Botella de ImperioSur ${cerveza.nombre}`} width={450} height={675} loading={index === 0 ? 'eager' : 'lazy'} sizes="(max-width: 700px) 80vw, 30vw" /><span className="beer-number">0{index + 1}</span><span className="beer-style">{cerveza.categoria}</span></Link>
    <div className="beer-card-text"><p className="eyebrow">IMPERIOSUR</p><h3><Link href={`/cervezas/${cerveza.slug}`}>{cerveza.nombre}</Link></h3><p>{cerveza.bajada}</p><Link className="text-link" href={`/cervezas/${cerveza.slug}`}>CONOCELA <Arrow /></Link></div>
  </article>;
}
