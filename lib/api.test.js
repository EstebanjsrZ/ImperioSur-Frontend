import { afterEach, describe, expect, it, vi } from 'vitest';
import { listarProductos } from './api';

afterEach(() => vi.unstubAllGlobals());
const responder = (datos) => ({ ok: true, json: async () => datos });

describe('contrato con Django REST', () => {
  it('envía búsqueda, categoría y página al backend sin filtrar sólo la página actual', async () => {
    const pedir = vi.fn().mockResolvedValue(
      responder({
        count: 8,
        next: 'pagina-2',
        previous: null,
        results: [{ id: 4 }],
      }),
    );
    vi.stubGlobal('fetch', pedir);
    const datos = await listarProductos({
      pagina: 2,
      categoria: 3,
      busqueda: 'IPA & Golden',
    });
    const url = pedir.mock.calls[0][0];
    expect(url.searchParams.get('search')).toBe('IPA & Golden');
    expect(url.searchParams.get('categoria')).toBe('3');
    expect(url.searchParams.get('page')).toBe('2');
    expect(datos.count).toBe(8);
  });
});
