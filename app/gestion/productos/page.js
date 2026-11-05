import Link from 'next/link';
import EliminarProducto from '@/components/eliminar-producto';
import { formatearPrecio } from '@/lib/productos';
import { exigirGestion, leerGestion } from '@/lib/gestion-server';

const ruta = '/gestion/productos';

export default async function ProductosGestion({ searchParams }) {
  const token = await exigirGestion();
  const { pagina } = await searchParams;
  const numero = Number(pagina);
  const actual = Number.isSafeInteger(numero) && numero > 0 ? numero : 1;
  const { results, next, previous } = await leerGestion(
    `productos/?page=${actual}&page_size=12`,
    token,
  );

  return (
    <>
      <div className="gestion-barra">
        <h1>Productos</h1>
        <Link className="button button-red" href={`${ruta}/nuevo`}>
          Nuevo producto
        </Link>
      </div>
      {results.length === 0 ? (
        <p>Todavía no hay productos cargados.</p>
      ) : (
        <ul className="gestion-lista">
          {results.map((producto) => (
            <li key={producto.id} className="gestion-barra">
              <div>
                <h2>{producto.nombre}</h2>
                <p>
                  {formatearPrecio(producto.precio)} · Stock {producto.stock}
                </p>
              </div>
              <div className="gestion-acciones">
                <Link
                  className="button button-outline"
                  href={`${ruta}/${producto.id}/editar`}
                >
                  Editar
                </Link>
                <EliminarProducto
                  id={String(producto.id)}
                  nombre={producto.nombre}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      {(previous || next) && (
        <nav className="gestion-nav" aria-label="Páginas de productos">
          {previous && (
            <Link href={`${ruta}?pagina=${actual - 1}`}>Anterior</Link>
          )}
          <span>Página {actual}</span>
          {next && <Link href={`${ruta}?pagina=${actual + 1}`}>Siguiente</Link>}
        </nav>
      )}
    </>
  );
}
