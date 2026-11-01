import BeerCatalog from '@/components/beer-catalog';

export const metadata = { title: 'Nuestras cervezas' };

export default function CervezasPage() {
  return <section className="catalog-page section-wrap"><div className="section-heading" data-reveal><p className="eyebrow"><span className="red-dash" />EL CARÁCTER DE IMPERIOSUR</p><h1>NUESTRAS<br />CERVEZAS.</h1><p>Elegí el estilo que va con vos.<br />El próximo buen momento empieza por acá.</p></div><BeerCatalog /></section>;
}
