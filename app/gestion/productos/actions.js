'use server';

import { revalidatePath } from 'next/cache';
import { pedirDjango, tokenActual } from '@/lib/auth-server';
import {
  idProducto,
  imagenProducto,
  productoSchema,
} from '@/lib/producto-schema';

async function modificarProducto(id, method, body) {
  if (id !== null && !idProducto.safeParse(id).success)
    return { error: 'El producto no es válido.' };

  try {
    const token = await tokenActual();
    if (!token) return { error: 'Tu sesión terminó. Volvé a iniciar sesión.' };
    const ruta = id === null ? 'productos/' : `productos/${id}/`;
    const respuesta = await pedirDjango(ruta, { method, token, body });
    if (respuesta.status === 401)
      return { error: 'Tu sesión terminó. Volvé a iniciar sesión.' };
    if (respuesta.status === 403)
      return { error: 'Tu cuenta no tiene permiso para gestionar productos.' };
    if (respuesta.status === 404)
      return { error: 'El producto ya no está disponible.' };
    if (respuesta.status === 400) {
      const datos = await respuesta.json().catch(() => null);
      const detalle = Array.isArray(datos) ? datos[0] : datos?.detail;
      return {
        error:
          typeof detalle === 'string'
            ? detalle
            : 'Revisá los datos del producto.',
        campos: datos,
      };
    }
    if (!respuesta.ok) return { error: 'No pudimos completar la operación.' };
  } catch {
    return {
      error: 'No pudimos conectar con el catálogo. Intentá nuevamente.',
    };
  }

  revalidatePath('/gestion/productos');
  return { ok: true };
}

export async function guardarProducto(id, valores, adjunto) {
  const datos = productoSchema.safeParse(valores);
  if (!datos.success) return { error: 'Revisá los datos del producto.' };
  const method = id === null ? 'POST' : 'PATCH';
  if (!adjunto) return modificarProducto(id, method, datos.data);

  const imagen = imagenProducto.safeParse(
    adjunto instanceof FormData ? adjunto.get('imagen') : null,
  );
  if (!imagen.success) {
    const error = imagen.error.issues[0].message;
    return { error, campos: { imagen: [error] } };
  }
  const body = new FormData();
  body.append('imagen', imagen.data);
  const { proveedores, ...campos } = datos.data;
  for (const [campo, valor] of Object.entries(campos)) {
    body.append(campo, valor ?? '');
  }
  for (const proveedor of proveedores) body.append('proveedores', proveedor);
  // PUT permite vaciar la relación si no quedan proveedores en el formulario multipart.
  return modificarProducto(id, id === null ? 'POST' : 'PUT', body);
}

export async function eliminarProducto(id) {
  if (id === null) return { error: 'El producto no es válido.' };
  return modificarProducto(id, 'DELETE');
}
