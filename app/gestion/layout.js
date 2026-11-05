import Link from 'next/link';
import './gestion.css';

export const metadata = { title: 'Gestión de catálogo' };

export default function GestionLayout({ children }) {
  return (
    <section className="auth-page section-wrap gestion">
      <nav className="gestion-nav" aria-label="Gestión de catálogo">
        <Link href="/cuenta">Mi cuenta</Link>
        <Link href="/gestion">Gestión</Link>
        <Link href="/gestion/productos">Productos</Link>
      </nav>
      {children}
    </section>
  );
}
