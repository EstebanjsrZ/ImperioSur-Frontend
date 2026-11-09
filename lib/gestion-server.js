import 'server-only';

import { notFound, redirect } from 'next/navigation';
import { pedirDjango, tokenActual } from './auth-server';
import { idProducto } from './producto-schema';

export async function consultarGestion(token) {
  if (!token) return 'sesion';
  const respuesta = await pedirDjango('productos/', {
    method: 'OPTIONS',
    token,
  });
  if (respuesta.status === 401) return 'sesion';
  if (respuesta.status === 403) return 'permiso';
  if (!respuesta.ok)
    throw new Error('No pudimos verificar los permisos del catálogo.');
  const metadata = await respuesta.json();
  return metadata.actions?.POST ? 'permitido' : 'permiso';
}

export async function exigirGestion() {
  const token = await tokenActual();
  const acceso = await consultarGestion(token);
  if (acceso === 'sesion') redirect('/login');
  if (acceso === 'permiso') redirect('/cuenta');
  return token;
}

export async function leerGestion(recurso, token) {
  const respuesta = await pedirDjango(recurso, { token });
  if (respuesta.status === 404) notFound();
  if (!respuesta.ok)
    throw new Error('No pudimos cargar los datos del catálogo.');
  return respuesta.json();
}

export async function opcionesProducto(token) {
  const recursos = ['categorias', 'marcas', 'presentaciones', 'proveedores'];
  const opciones = await Promise.all(
    recursos.map(async (recurso) => {
      const items = [];
      let pagina = 1;
      let respuesta;
      do {
        respuesta = await leerGestion(
          `${recurso}/?page_size=100&page=${pagina}`,
          token,
        );
        items.push(...respuesta.results);
        pagina++;
      } while (respuesta.next);
      return items.map(({ id, nombre, capacidad_ml }) => ({
        id,
        nombre: capacidad_ml ? `${nombre} · ${capacidad_ml} ml` : nombre,
      }));
    }),
  );
  return Object.fromEntries(
    recursos.map((recurso, indice) => [recurso, opciones[indice]]),
  );
}

export async function leerProducto(id, token) {
  if (!idProducto.safeParse(id).success) notFound();
  return leerGestion(`productos/${id}/`, token);
}
