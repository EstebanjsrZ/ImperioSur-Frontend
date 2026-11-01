import Link from 'next/link';
import { Arrow, Crown } from './icons';
import ProductImage from './product-image';
import { formatearPrecio, presentarProducto } from '@/lib/productos';

export default function BeerCard({ producto, index = 0 }) {
  const cerveza = presentarProducto(producto);
  const href = `/cervezas/${cerveza.id}`;
  return <article className="beer-card" style={{ '--beer-color': cerveza.color, '--beer-background': cerveza.fondo, '--card-delay': `${index * 70}ms` }}>
    <Link className="beer-visual" href={href} aria-label={`Conocer ${cerveza.nombre}`}><span className="beer-disc"><Crown /></span><ProductImage src={cerveza.imagenVista} nombre={cerveza.nombre} eager={index === 0} /><span className="beer-number">{String(index + 1).padStart(2, '0')}</span><span className="beer-style">{cerveza.categoriaNombre}</span></Link>
    <div className="beer-card-text"><p className="eyebrow">{cerveza.marcaNombre}</p><h3><Link href={href}>{cerveza.nombre}</Link></h3><p className="product-description">{cerveza.descripcion || 'Descubrí esta variedad artesanal.'}</p><div className="product-price"><strong>{formatearPrecio(cerveza.precio)}</strong><span>{cerveza.stock > 0 ? `${cerveza.stock} disponibles` : 'Sin stock'}</span></div><Link className="text-link" href={href}>CONOCELA <Arrow /></Link></div>
  </article>;
}
