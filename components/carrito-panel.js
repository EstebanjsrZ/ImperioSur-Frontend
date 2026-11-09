'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { pedirAPI } from '@/lib/api';
import { MAX_CANTIDAD } from '@/lib/carrito-schema';
import { formatearPrecio } from '@/lib/productos';
import { useAuth } from './auth-provider';
import { useCarrito } from './carrito-provider';

export default function CarritoPanel() {
  const { carrito, cambiarCantidad, quitar, descontarCompra } = useCarrito();
  const { estado, verificar } = useAuth();
  const [catalogo, setCatalogo] = useState(null);
  const [revision, setRevision] = useState(0);
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultadoIncierto, setResultadoIncierto] = useState(false);
  const bloqueo = useRef(false);
  const ids = carrito?.map(({ producto }) => producto).join(',') ?? '';

  useEffect(() => {
    if (!ids) return;
    const controller = new AbortController();
    const { signal } = controller;
    Promise.all(
      ids.split(',').map(async (id) => {
        try {
          return [id, await pedirAPI(`productos/${id}/`, { signal })];
        } catch (err) {
          if (err.status === 404) return [id, null];
          throw err;
        }
      }),
    ).then(
      (productos) => {
        if (!signal.aborted)
          setCatalogo({
            ids,
            revision,
            productos: Object.fromEntries(productos),
          });
      },
      () => {
        if (!signal.aborted) setCatalogo({ ids, revision, error: true });
      },
    );
    return () => controller.abort();
  }, [ids, revision]);

  const actual =
    catalogo?.ids === ids && catalogo.revision === revision ? catalogo : null;
  const filas =
    carrito?.map((item) => ({
      ...item,
      cerveza: actual?.productos?.[item.producto],
    })) ?? [];
  const subtotal = filas.reduce(
    (total, { cerveza, cantidad }) =>
      total +
      (cerveza ? Math.round(Number(cerveza.precio) * 100) * cantidad : 0),
    0,
  );
  const valido =
    actual?.productos &&
    filas.length > 0 &&
    filas.every(
      ({ cerveza, cantidad }) => cerveza && cerveza.stock >= cantidad,
    );

  async function confirmar() {
    if (
      bloqueo.current ||
      !valido ||
      estado !== 'autenticado' ||
      resultadoIncierto
    )
      return;
    bloqueo.current = true;
    setEnviando(true);
    setPedido(null);
    setError('');
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito }),
      });
      const datos = await response.json();
      if (response.ok && Number.isInteger(datos.id)) {
        descontarCompra(carrito);
        setPedido(datos.id);
        return;
      }
      if (response.status === 401) verificar();
      if (response.status === 400) setRevision((n) => n + 1);
      if (response.status >= 500 || response.ok) setResultadoIncierto(true);
      setError(
        datos.detail ||
          'No pudimos confirmar el pedido. Revisá Mis pedidos antes de reintentar.',
      );
    } catch {
      setResultadoIncierto(true);
      setError(
        'Se interrumpió la conexión. Revisá Mis pedidos antes de volver a confirmar.',
      );
    } finally {
      bloqueo.current = false;
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-6">
      {pedido !== null && (
        <p role="status" className="rounded-lg border p-4">
          Recibimos tu pedido #{pedido}.{' '}
          <Link className="underline" href="/cuenta/pedidos">
            Ver mis pedidos
          </Link>
          .
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {resultadoIncierto && (
        <p>
          <Link className="underline" href="/cuenta/pedidos">
            Revisar mis pedidos
          </Link>
        </p>
      )}
      {carrito === null ? (
        <p role="status">Cargando carrito…</p>
      ) : !ids ? (
        <p>
          Tu carrito está vacío.{' '}
          <Link className="underline" href="/cervezas">
            Ver cervezas
          </Link>
          .
        </p>
      ) : !actual ? (
        <p role="status">Consultando precios y disponibilidad…</p>
      ) : actual.error ? (
        <p role="alert">
          No pudimos consultar los productos.{' '}
          <button
            type="button"
            className="underline"
            onClick={() => setRevision((n) => n + 1)}
          >
            Reintentar
          </button>
          .
        </p>
      ) : (
        <>
          <ul className="divide-y rounded-lg border px-4">
            {filas.map(({ producto, cantidad, cerveza }) => {
              const nombre = cerveza?.nombre ?? `Producto #${producto}`;
              const limite = Math.min(cerveza?.stock ?? 0, MAX_CANTIDAD);
              return (
                <li
                  key={producto}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-bold">{nombre}</p>
                    <p>
                      {cerveza
                        ? `${formatearPrecio(cerveza.precio)} por unidad`
                        : 'Ya no está en el catálogo.'}
                    </p>
                    {cerveza && limite < cantidad && (
                      <p role="status">Disponibles ahora: {limite}.</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="rounded border px-3 py-1 disabled:opacity-50"
                      type="button"
                      aria-label={`Quitar una unidad de ${nombre}`}
                      disabled={enviando || limite < 1 || cantidad <= 1}
                      onClick={() =>
                        cambiarCantidad(
                          producto,
                          Math.min(cantidad - 1, limite),
                          limite,
                        )
                      }
                    >
                      −
                    </button>
                    <span aria-label={`Cantidad de ${nombre}`}>{cantidad}</span>
                    <button
                      className="rounded border px-3 py-1 disabled:opacity-50"
                      type="button"
                      aria-label={`Sumar una unidad de ${nombre}`}
                      disabled={enviando || cantidad >= limite}
                      onClick={() =>
                        cambiarCantidad(producto, cantidad + 1, limite)
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="underline"
                      disabled={enviando}
                      onClick={() => quitar(producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-xl font-bold">
            Total estimado: {formatearPrecio(subtotal / 100)}
          </p>
          {estado === 'autenticado' ? (
            <button
              className="button button-red disabled:opacity-50"
              type="button"
              disabled={!valido || enviando || resultadoIncierto}
              onClick={confirmar}
            >
              {enviando ? 'Confirmando…' : 'Confirmar pedido'}
            </button>
          ) : estado === 'anonimo' ? (
            <p>
              Para confirmar,{' '}
              <Link className="underline" href="/login?next=/carrito">
                iniciá sesión
              </Link>{' '}
              o{' '}
              <Link className="underline" href="/registro?next=/carrito">
                creá una cuenta
              </Link>
              .
            </p>
          ) : estado === 'error' ? (
            <p>
              No pudimos verificar tu sesión.{' '}
              <button type="button" className="underline" onClick={verificar}>
                Reintentar
              </button>
              .
            </p>
          ) : (
            <p role="status">Verificando tu sesión…</p>
          )}
        </>
      )}
    </div>
  );
}
