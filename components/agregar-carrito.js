'use client';

import Link from 'next/link';
import { MAX_CANTIDAD, MAX_PRODUCTOS } from '@/lib/carrito-schema';
import { useCarrito } from './carrito-provider';

export default function AgregarCarrito({ producto }) {
  const { carrito, agregar } = useCarrito();
  const { id, nombre, stock } = producto;
  const cantidad = carrito?.find((item) => item.producto === id)?.cantidad ?? 0;
  const lleno = !cantidad && carrito?.length >= MAX_PRODUCTOS;
  const limite = cantidad >= Math.min(stock, MAX_CANTIDAD);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="button button-red disabled:opacity-50"
        aria-label={`Agregar ${nombre} al carrito`}
        disabled={!carrito || lleno || limite}
        onClick={() => agregar(id, stock)}
      >
        {stock <= 0
          ? 'Sin stock'
          : lleno
            ? 'Carrito lleno'
            : limite
              ? 'Límite disponible'
              : 'Agregar al carrito'}
      </button>
      {cantidad > 0 && (
        <Link className="underline" href="/carrito" aria-live="polite">
          Ver carrito ({cantidad})
        </Link>
      )}
    </div>
  );
}
