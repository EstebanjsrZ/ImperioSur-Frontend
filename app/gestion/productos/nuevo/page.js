import ProductoForm from '@/components/producto-form';
import { exigirGestion, opcionesProducto } from '@/lib/gestion-server';

export default async function NuevoProducto() {
  const token = await exigirGestion();
  return (
    <>
      <h1>Nuevo producto</h1>
      <ProductoForm opciones={await opcionesProducto(token)} />
    </>
  );
}
