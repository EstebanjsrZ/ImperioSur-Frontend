import Link from 'next/link';
import { exigirGestion } from '@/lib/gestion-server';

export default async function GestionPage() {
  await exigirGestion();
  return (
    <>
      <h1>Gestión de catálogo</h1>
      <p>Administrá los productos que aparecen en el catálogo de ImperioSur.</p>
      <Link className="button button-red" href="/gestion/productos">
        Ver productos
      </Link>
    </>
  );
}
