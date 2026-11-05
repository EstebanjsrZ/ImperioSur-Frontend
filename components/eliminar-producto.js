'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eliminarProducto } from '@/app/gestion/productos/actions';

export default function EliminarProducto({ id, nombre }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  async function eliminar() {
    setOcupado(true);
    setError('');
    try {
      const resultado = await eliminarProducto(id);
      if (resultado.ok) {
        setConfirmando(false);
        router.replace('/gestion/productos');
      } else setError(resultado.error);
    } catch {
      setError('No pudimos eliminar el producto. Intentá nuevamente.');
    } finally {
      setOcupado(false);
    }
  }

  if (!confirmando)
    return (
      <button
        className="button button-outline"
        aria-label={`Eliminar ${nombre}`}
        onClick={() => setConfirmando(true)}
      >
        Eliminar
      </button>
    );

  return (
    <div className="gestion-confirmar">
      <p>¿Eliminar {nombre}?</p>
      <div className="gestion-acciones">
        <button
          className="button button-red"
          onClick={eliminar}
          disabled={ocupado}
        >
          {ocupado ? 'Eliminando…' : 'Confirmar eliminación'}
        </button>
        <button
          className="button button-outline"
          disabled={ocupado}
          onClick={() => {
            setConfirmando(false);
            setError('');
          }}
        >
          Cancelar
        </button>
      </div>
      {error && (
        <p className="gestion-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
