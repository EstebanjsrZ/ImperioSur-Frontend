import CarritoPanel from '@/components/carrito-panel';

export const metadata = { title: 'Carrito' };

export default function CarritoPage() {
  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel">
        <p className="eyebrow">IMPERIOSUR · TIENDA</p>
        <h1>TU CARRITO</h1>
        <CarritoPanel />
      </div>
    </section>
  );
}
