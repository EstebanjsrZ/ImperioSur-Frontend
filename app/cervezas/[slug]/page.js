import { notFound, redirect } from 'next/navigation';
import ProductDetail from '@/components/product-detail';
import { listarProductos } from '@/lib/api';

export const metadata = { title: 'Detalle de cerveza' };

export default async function CervezaPage({ params }) {
  const { slug } = await params;
  if (['ipa', 'golden', 'stout'].includes(slug)) {
    let coincidencia;
    try {
      const pagina = await listarProductos({ busqueda: slug });
      coincidencia = pagina.results.find((item) => item.nombre.toLowerCase().split(/\s+/).includes(slug));
    } catch { /* El catálogo ofrece reintentar cuando la API no está disponible. */ }
    redirect(coincidencia ? `/cervezas/${coincidencia.id}` : '/cervezas');
  }
  if (!/^[1-9]\d*$/.test(slug)) notFound();
  return <ProductDetail id={slug} />;
}
