'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { obtenerProducto } from '@/lib/api';
import { formatearPrecio, presentarProducto } from '@/lib/productos';
import ProductImage from './product-image';
import AgregarCarrito from './agregar-carrito';
import CatalogStatus from './catalog-status';
import { Arrow, Crown, Wave } from './icons';

export default function ProductDetail({ id }) {
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError(null);
    obtenerProducto(id, { signal: controller.signal })
      .then((datos) => {
        if (!controller.signal.aborted) setProducto(presentarProducto(datos));
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, [id, intento]);

  return (
    <section
      className="beer-detail section-wrap"
      style={
        producto
          ? {
              '--beer-color': producto.color,
              '--beer-background': producto.fondo,
            }
          : undefined
      }
    >
      <Link className="back-link" href="/cervezas">
        <Arrow direction="left" />
        Todas las variedades
      </Link>
      {cargando ? (
        <CatalogStatus cargando />
      ) : error ? (
        <CatalogStatus
          error={error.message}
          onRetry={
            error.status === 404
              ? undefined
              : () => setIntento((actual) => actual + 1)
          }
        />
      ) : (
        <div className="detail-grid">
          <div className="detail-visual">
            <span className="detail-disc">
              <Crown />
            </span>
            <ProductImage
              src={producto.imagenVista}
              nombre={producto.nombre}
              eager
            />
          </div>
          <div className="detail-copy">
            <p className="eyebrow">
              {producto.marcaNombre} · {producto.categoriaNombre}
            </p>
            <h1 className="product-detail-title">
              {producto.nombre}
              <span>
                CON CARÁCTER
                <br />
                RIOCUARTENSE.
              </span>
            </h1>
            <Wave />
            <p>
              {producto.descripcion || 'Una variedad artesanal para descubrir.'}
            </p>
            <div className="product-price">
              <strong>{formatearPrecio(producto.precio)}</strong>
              <span>
                {producto.stock > 0
                  ? `${producto.stock} unidades disponibles`
                  : 'Sin stock por el momento'}
              </span>
            </div>
            <AgregarCarrito producto={producto} />
          </div>
        </div>
      )}
    </section>
  );
}
