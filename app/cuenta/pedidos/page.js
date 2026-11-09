import Link from 'next/link';
import { redirect } from 'next/navigation';
import { leerPagina } from '@/lib/api';
import { pedirDjango, tokenActual } from '@/lib/auth-server';
import { formatearPrecio } from '@/lib/productos';

export const metadata = { title: 'Mis pedidos' };
const estados = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default async function PedidosPage({ searchParams }) {
  const token = await tokenActual();
  if (!token) redirect('/login');
  const valor = (await searchParams).pagina;
  const pagina =
    typeof valor === 'string' && /^[1-9]\d{0,5}$/.test(valor)
      ? Number(valor)
      : 1;
  const response = await pedirDjango(`pedidos/?page=${pagina}`, { token });
  if ([401, 403].includes(response.status)) redirect('/login');
  if (response.status === 404 && pagina > 1) redirect('/cuenta/pedidos');
  if (!response.ok) throw new Error('No pudimos cargar tus pedidos.');
  const { results, next, previous } = leerPagina(await response.json());

  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel">
        <p className="eyebrow">IMPERIOSUR · TU CUENTA</p>
        <h1>MIS PEDIDOS</h1>
        <Link className="underline" href="/cuenta">
          Volver a mi cuenta
        </Link>
        {results.length === 0 ? (
          <p>
            Todavía no hiciste pedidos.{' '}
            <Link className="underline" href="/cervezas">
              Ver cervezas
            </Link>
            .
          </p>
        ) : (
          <ol className="space-y-4">
            {results.map(({ id, fecha, estado, detalles = [] }) => {
              const total = detalles.reduce(
                (acumulado, detalle) =>
                  acumulado + Math.round(Number(detalle.subtotal) * 100),
                0,
              );
              return (
                <li className="rounded-lg border p-4" key={id}>
                  <h2 className="font-bold">Pedido #{id}</h2>
                  <p>
                    <time dateTime={fecha}>
                      {new Date(fecha).toLocaleDateString('es-AR', {
                        timeZone: 'America/Argentina/Cordoba',
                      })}
                    </time>
                    {' · '}
                    {estados[estado] ?? estado}
                  </p>
                  <ul className="my-2">
                    {detalles.map(
                      ({
                        id: detalle,
                        producto,
                        producto_nombre,
                        cantidad,
                        subtotal,
                      }) => (
                        <li key={detalle}>
                          {cantidad} ×{' '}
                          {producto_nombre || `Producto #${producto}`} ·{' '}
                          {formatearPrecio(subtotal)}
                        </li>
                      ),
                    )}
                  </ul>
                  <p className="font-bold">
                    Total: {formatearPrecio(total / 100)}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
        {(previous || next) && (
          <nav aria-label="Páginas de pedidos" className="flex gap-4">
            {previous && (
              <Link
                className="underline"
                href={`/cuenta/pedidos?pagina=${pagina - 1}`}
              >
                Anterior
              </Link>
            )}
            {next && (
              <Link
                className="underline"
                href={`/cuenta/pedidos?pagina=${pagina + 1}`}
              >
                Siguiente
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
