import LoginForm from '@/components/login-form';
export const metadata = { title: 'Iniciar sesión' };
export default function LoginPage() {
  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel">
        <p className="eyebrow">IMPERIOSUR · TU CUENTA</p>
        <h1>INICIÁ SESIÓN</h1>
        <p>Ingresá con tu usuario de ImperioSur.</p>
        <LoginForm />
      </div>
    </section>
  );
}
