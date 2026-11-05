import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cervezas, buscarCerveza } from '@/lib/cervezas';
import { Arrow, Crown, Wave } from '@/components/icons';
import BeerCard from '@/components/beer-card';

export function generateStaticParams() { return cervezas.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cerveza = buscarCerveza(slug);
  return { title: cerveza ? `ImperioSur ${cerveza.nombre}` : 'Variedad no encontrada' };
}

export default async function CervezaPage({ params }) {
  const { slug } = await params;
  const cerveza = buscarCerveza(slug);
  if (!cerveza) notFound();
  return <><section className="beer-detail section-wrap" style={{ '--beer-color': cerveza.color, '--beer-background': cerveza.fondo }}><Link className="back-link" href="/cervezas"><Arrow direction="left" />Todas las variedades</Link><div className="detail-grid"><div className="detail-visual"><span className="detail-disc"><Crown /></span><Image src={cerveza.imagen} alt={`ImperioSur ${cerveza.nombre}, cerveza artesanal de Río Cuarto`} width={650} height={975} loading="eager" fetchPriority="high" /><span className="detail-background-name">{cerveza.nombre}</span></div><div className="detail-copy" data-reveal><p className="eyebrow">IMPERIOSUR · {cerveza.categoria.toUpperCase()}</p><h1>{cerveza.nombre.toUpperCase()}<span>CON CARÁCTER<br />RIOCUARTENSE.</span></h1><p className="detail-lead">{cerveza.bajada}</p><Wave /><p>{cerveza.descripcion}</p><div className="taste-notes">{cerveza.notas.map((nota) => <span key={nota}>{nota}</span>)}</div><p className="origin-note">Cerveza artesanal · Río Cuarto, Córdoba.<br /><small>Presentación ilustrativa. Descubrí el perfil del estilo.</small></p><Link className="button button-red" href="/cervezas">Seguí descubriendo <Arrow /></Link></div></div></section><section className="more-beers section-wrap"><div className="section-heading" data-reveal><p className="eyebrow">OTRAS PERSONALIDADES</p><h2>SIEMPRE HAY MÁS<br />PARA DESCUBRIR.</h2></div><div className="beer-grid two-beers">{cervezas.filter((item) => item.slug !== slug).map((item, index) => <BeerCard key={item.slug} cerveza={item} index={index} />)}</div></section></>;
}
