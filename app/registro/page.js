import Link from 'next/link';
import RegistroForm from '@/components/registro-form';

export const metadata = { title: 'Crear cuenta' };

export default async function RegistroPage({ searchParams }) {
  const destino =
    (await searchParams).next === '/carrito' ? '/carrito' : '/cuenta';
  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel">
        <p className="eyebrow">IMPERIOSUR · TU CUENTA</p>
        <h1>CREÁ TU CUENTA</h1>
        <p>Registrate para hacer pedidos y ver tus compras.</p>
        <RegistroForm destino={destino} />
        <p>
          ¿Ya tenés cuenta?{' '}
          <Link
            className="underline"
            href={destino === '/carrito' ? '/login?next=/carrito' : '/login'}
          >
            Iniciá sesión
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
