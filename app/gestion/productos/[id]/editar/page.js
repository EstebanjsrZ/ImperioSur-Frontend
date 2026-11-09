import ProductoForm from '@/components/producto-form';
import {
  exigirGestion,
  leerProducto,
  opcionesProducto,
} from '@/lib/gestion-server';

export default async function EditarProducto({ params }) {
  const token = await exigirGestion();
  const { id } = await params;
  const [producto, opciones] = await Promise.all([
    leerProducto(id, token),
    opcionesProducto(token),
  ]);
  return (
    <>
      <h1>Editar producto</h1>
      <ProductoForm producto={producto} opciones={opciones} />
    </>
  );
}
