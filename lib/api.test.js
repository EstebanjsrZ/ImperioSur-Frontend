import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, leerPagina, listarCategorias, listarProductos, obtenerProducto } from './api';
import { formatearPrecio, presentarProducto } from './productos';

afterEach(() => vi.unstubAllGlobals());
const responder = (datos) => ({ ok: true, json: async () => datos });

describe('contrato con Django REST', () => {
  it('envía búsqueda, categoría y página al backend sin filtrar sólo la página actual', async () => {
    const pedir = vi.fn().mockResolvedValue(responder({ count: 8, next: 'pagina-2', previous: null, results: [{ id: 4 }] }));
    vi.stubGlobal('fetch', pedir);
    const datos = await listarProductos({ pagina: 2, categoria: 3, busqueda: 'IPA & Golden' });
    const url = pedir.mock.calls[0][0];
    expect(url.searchParams.get('search')).toBe('IPA & Golden');
    expect(url.searchParams.get('categoria')).toBe('3');
    expect(url.searchParams.get('page')).toBe('2');
    expect(datos.count).toBe(8);
  });
  it('resuelve las relaciones por ID del detalle sin exigir anidado fuera del list', async () => {
    vi.stubGlobal('fetch', vi.fn((url) => Promise.resolve(responder(url.pathname.includes('/productos/')
      ? { id: 4, categoria: 2, marca: 3, precio: '3500.00', stock: 0 }
      : { id: 2, nombre: url.pathname.includes('/categorias/') ? 'Rubias' : 'ImperioSur' }))));
    const producto = await obtenerProducto(4);
    expect(producto.categoria.nombre).toBe('Rubias');
    expect(producto.marca.nombre).toBe('ImperioSur');
    expect(producto.stock).toBe(0);
  });
  it('recorre categorías paginadas para ofrecer todos los filtros', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(responder({ count: 2, results: [{ id: 1 }], next: 'siguiente' }))
      .mockResolvedValueOnce(responder({ count: 2, results: [{ id: 2 }], next: null })));
    expect(await listarCategorias()).toEqual([{ id: 1 }, { id: 2 }]);
  });
  it('distingue caída de la API, 404 y respuesta inválida sin mostrar productos inventados', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')));
    await expect(listarProductos()).rejects.toThrow('No pudimos conectar');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(obtenerProducto(999)).rejects.toMatchObject({ status: 404 });
    expect(() => leerPagina({ detail: 'error' })).toThrow(ApiError);
  });
  it('conserva precio cero y stock agotado, con imagen de reemplazo cuando no hay foto', () => {
    expect(formatearPrecio('0.00')).toContain('0,00');
    expect(formatearPrecio(undefined)).toBe('Precio a consultar');
    const producto = presentarProducto({ nombre: 'Porter', stock: 0, imagen: null, precio: '2800.00', marca: { nombre: 'Otra marca' } });
    expect(producto.marcaNombre).toBe('Otra marca');
    expect(producto.stock).toBe(0);
    expect(producto.imagenVista).toContain('placeholder');
  });
});
