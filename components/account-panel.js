'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './auth-provider';

export default function AccountPanel({ puedeGestionar }) {
  const { usuario, estado, error, verificar, salir } = useAuth();
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);
  const [errorSalida, setErrorSalida] = useState('');
  useEffect(() => {
    verificar();
  }, [verificar]);
  useEffect(() => {
    if (estado === 'anonimo') router.replace('/login');
  }, [estado, router]);
  useEffect(() => {
    const actualizar = () => verificar();
    window.addEventListener('focus', actualizar);
    return () => window.removeEventListener('focus', actualizar);
  }, [verificar]);
  async function cerrar() {
    setCerrando(true);
    setErrorSalida('');
    try {
      await salir();
      router.replace('/login');
      router.refresh();
    } catch (err) {
      setErrorSalida(err.message);
    } finally {
      setCerrando(false);
    }
  }
  if (estado === 'error')
    return (
      <div>
        <p role="alert">{error}</p>
        <button className="button button-red" onClick={verificar}>
          Reintentar
        </button>
      </div>
    );
  if (estado !== 'autenticado')
    return <p role="status">Verificando tu sesión…</p>;
  return (
    <>
      <h1>MI CUENTA</h1>
      <p>Hola, {usuario.nombre || usuario.username}.</p>
      <p>Tu sesión está activa.</p>
      <p>
        <Link className="button button-outline" href="/cuenta/pedidos">
          Mis pedidos
        </Link>
      </p>
      {puedeGestionar && (
        <p>
          <Link className="button button-outline" href="/gestion">
            Gestionar catálogo
          </Link>
        </p>
      )}
      {errorSalida && (
        <p className="auth-error" role="alert">
          {errorSalida}
        </p>
      )}
      <button
        className="button button-red"
        onClick={cerrar}
        disabled={cerrando}
      >
        {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
    </>
  );
}
