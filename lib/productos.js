import { cervezas } from './cervezas';

export function presentarProducto(producto) {
  const estilo = cervezas.find((item) =>
    producto.nombre.toLowerCase().includes(item.slug),
  );
  return {
    ...producto,
    categoriaNombre: producto.categoria?.nombre || 'Artesanal',
    marcaNombre: producto.marca?.nombre || 'Cerveza artesanal',
    color: estilo?.color || '#a42b35',
    fondo: estilo?.fondo || '#eee3d9',
    imagenVista: producto.imagen || '/images/producto-placeholder.svg',
  };
}

export function formatearPrecio(precio) {
  if (
    precio === null ||
    precio === undefined ||
    precio === '' ||
    !Number.isFinite(Number(precio))
  )
    return 'Precio a consultar';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(Number(precio));
}
