export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/').replace(/\/?$/, '/');

export class ApiError extends Error {
  constructor(message, status = 0) { super(message); this.status = status; }
}

export async function pedirAPI(recurso, { signal, query = {} } = {}) {
  const url = new URL(recurso, API_URL);
  for (const [clave, valor] of Object.entries(query)) {
    if (valor !== '' && valor !== undefined && valor !== null) url.searchParams.set(clave, valor);
  }
  let respuesta;
  try {
    respuesta = await fetch(url, {
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000),
      headers: { Accept: 'application/json' }, cache: 'no-store',
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError('No pudimos conectar con el catálogo. Intentá nuevamente en unos momentos.');
  }
  if (!respuesta.ok) throw new ApiError(respuesta.status === 404 ? 'No encontramos este producto.' : 'No pudimos cargar el catálogo. Intentá nuevamente.', respuesta.status);
  return respuesta.json();
}

export function leerPagina(datos) {
  if (Array.isArray(datos)) return { count: datos.length, results: datos, next: null, previous: null };
  if (!datos || !Array.isArray(datos.results) || !Number.isInteger(datos.count)) throw new ApiError('El catálogo no está disponible en este momento.');
  return datos;
}

export async function listarProductos({ pagina = 1, categoria = '', busqueda = '', cantidad = 6, signal } = {}) {
  return leerPagina(await pedirAPI('productos/', { signal, query: { page: pagina, categoria, search: busqueda, page_size: cantidad } }));
}

export async function listarCategorias({ signal } = {}) {
  const categorias = [];
  let pagina = 1;
  let datos;
  do {
    datos = leerPagina(await pedirAPI('categorias/', { signal, query: { page: pagina++, page_size: 100 } }));
    categorias.push(...datos.results);
  } while (datos.next);
  return categorias;
}

export async function obtenerProducto(id, { signal } = {}) {
  if (!/^[1-9]\d*$/.test(String(id))) throw new ApiError('No encontramos este producto.', 404);
  const producto = await pedirAPI(`productos/${id}/`, { signal });
  const [categoria, marca] = await Promise.all(['categoria', 'marca'].map((campo) => {
    const relacion = producto[campo];
    return typeof relacion === 'object' ? relacion : pedirAPI(`${campo === 'categoria' ? 'categorias' : 'marcas'}/${relacion}/`, { signal });
  }));
  return { ...producto, categoria, marca };
}
