import Link from 'next/link';
import LoginForm from '@/components/login-form';
export const metadata = { title: 'Iniciar sesión' };
export default async function LoginPage({ searchParams }) {
  const destino =
    (await searchParams).next === '/carrito' ? '/carrito' : '/cuenta';
  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel">
        <p className="eyebrow">IMPERIOSUR · TU CUENTA</p>
        <h1>INICIÁ SESIÓN</h1>
        <p>Ingresá con tu usuario de ImperioSur.</p>
        <LoginForm destino={destino} />
        <p>
          ¿Todavía no tenés cuenta?{' '}
          <Link
            className="underline"
            href={
              destino === '/carrito' ? '/registro?next=/carrito' : '/registro'
            }
          >
            Registrate
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
