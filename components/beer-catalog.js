'use client';

import { useEffect, useState } from 'react';
import BeerCard from './beer-card';
import CatalogStatus from './catalog-status';
import { listarCategorias, listarProductos } from '@/lib/api';

export default function BeerCatalog({ featured = false }) {
  const [consulta, setConsulta] = useState({ categoria: '', pagina: 1 });
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBusquedaAplicada(busqueda.trim());
      setConsulta((actual) => ({ ...actual, pagina: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError('');
    Promise.all([
      listarProductos({
        pagina: consulta.pagina,
        categoria: consulta.categoria,
        busqueda: busquedaAplicada,
        cantidad: featured ? 3 : 6,
        signal: controller.signal,
      }),
      featured
        ? Promise.resolve([])
        : listarCategorias({ signal: controller.signal }),
    ])
      .then(([productos, estilos]) => {
        if (controller.signal.aborted) return;
        setDatos(productos);
        setCategorias(estilos);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, [consulta, busquedaAplicada, intento, featured]);

  const limpiar = () => {
    setBusqueda('');
    setBusquedaAplicada('');
    setConsulta({ categoria: '', pagina: 1 });
  };
  return (
    <>
      {!featured && (
        <div className="catalog-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Filtrar por estilo"
          >
            {[{ id: '', nombre: 'Todas' }, ...categorias].map(
              ({ id, nombre }) => (
                <button
                  key={id}
                  aria-pressed={consulta.categoria === String(id)}
                  className={consulta.categoria === String(id) ? 'active' : ''}
                  onClick={() =>
                    setConsulta({ categoria: String(id), pagina: 1 })
                  }
                  type="button"
                >
                  {nombre}
                </button>
              ),
            )}
          </div>
          <label className="catalog-search">
            <span className="sr-only">Buscar variedad</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Encontrá tu estilo…"
            />
          </label>
        </div>
      )}
      {cargando ? (
        <CatalogStatus cargando />
      ) : error ? (
        <CatalogStatus
          error={error}
          onRetry={() => setIntento((actual) => actual + 1)}
        />
      ) : (
        <>
          {!featured && (
            <p className="result-count" aria-live="polite">
              {datos?.count || 0}{' '}
              {datos?.count === 1
                ? 'variedad para descubrir'
                : 'variedades para descubrir'}
            </p>
          )}
          <div className={`beer-grid ${featured ? '' : 'catalog-grid'}`}>
            {datos?.results.map((producto, index) => (
              <BeerCard key={producto.id} producto={producto} index={index} />
            ))}
          </div>
          {datos?.count === 0 &&
            (consulta.categoria || busquedaAplicada ? (
              <div className="empty-catalog">
                <h2>
                  OTRO INTENTO,
                  <br />
                  OTRO SABOR.
                </h2>
                <p>No encontramos una variedad con esa búsqueda.</p>
                <button
                  className="button button-red"
                  onClick={limpiar}
                  type="button"
                >
                  Ver todas las variedades
                </button>
              </div>
            ) : (
              <CatalogStatus />
            ))}
          {!featured && datos?.count > 0 && (
            <nav
              className="catalog-pagination"
              aria-label="Páginas del catálogo"
            >
              <button
                className="button button-outline"
                type="button"
                disabled={!datos.previous}
                onClick={() =>
                  setConsulta((actual) => ({
                    ...actual,
                    pagina: actual.pagina - 1,
                  }))
                }
              >
                Anterior
              </button>
              <span aria-live="polite">
                Página {consulta.pagina} de {Math.ceil(datos.count / 6)}
              </span>
              <button
                className="button button-outline"
                type="button"
                disabled={!datos.next}
                onClick={() =>
                  setConsulta((actual) => ({
                    ...actual,
                    pagina: actual.pagina + 1,
                  }))
                }
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
