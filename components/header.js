'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Brand from './brand';
import { useAuth } from './auth-provider';
import { Arrow } from './icons';

export default function Header() {
  const { estado } = useAuth();
  const cuentaHref = estado === 'autenticado' ? '/cuenta' : '/login';
  const cuentaTexto = estado === 'autenticado' ? 'Mi cuenta' : 'Iniciar sesión';
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const home = pathname === '/';

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 45);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const closeMenu = () => setMenu(false);
  return (
    <header
      className={`site-header ${scrolled || !home || menu ? 'header-solid' : ''}`}
    >
      <div className="header-inner">
        <nav className="nav-left" aria-label="Navegación principal">
          <Link href="/cervezas">NUESTRAS CERVEZAS</Link>
          <Link href="/#esencia">NUESTRA ESENCIA</Link>
        </nav>
        <Link
          className="header-logo"
          href="/"
          aria-label="ImperioSur, inicio"
          onClick={closeMenu}
        >
          <Brand />
        </Link>
        <nav className="nav-right" aria-label="Más opciones">
          <Link href={cuentaHref}>{cuentaTexto}</Link>
          <Link className="nav-cta" href="/cervezas">
            ENCONTRÁ TU ESTILO <Arrow />
          </Link>
        </nav>
        <button
          type="button"
          className={`menu-toggle ${menu ? 'is-open' : ''}`}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenu(!menu)}
        >
          <span />
          <span />
        </button>
      </div>
      {menu && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Navegación móvil"
        >
          <Link onClick={closeMenu} href={cuentaHref}>
            {cuentaTexto} <Arrow />
          </Link>
          <Link onClick={closeMenu} href="/cervezas">
            Nuestras cervezas <Arrow />
          </Link>
          <Link onClick={closeMenu} href="/#esencia">
            Nuestra esencia <Arrow />
          </Link>
          <Link onClick={closeMenu} href="/#origen">
            Río Cuarto, Córdoba <Arrow />
          </Link>
        </nav>
      )}
    </header>
  );
}
