import { afterEach, describe, expect, it, vi } from 'vitest';
import { listarProductos } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});
const responder = (datos) => Response.json(datos);

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

  it('espera a Render y vuelve a consultar durante el arranque', async () => {
    vi.useFakeTimers();
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://catalogo.onrender.com/api/');
    vi.resetModules();
    const { listarProductos: listarEnRender } = await import('./api');
    const pedir = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(new Response('Arrancando', { status: 503 }))
      .mockResolvedValueOnce(
        new Response('<p>Arrancando</p>', {
          headers: { 'Content-Type': 'text/html' },
        }),
      )
      .mockResolvedValueOnce(responder({ count: 1, results: [{ id: 4 }] }));
    vi.stubGlobal('fetch', pedir);
    const consulta = listarEnRender();
    await vi.advanceTimersByTimeAsync(12000);
    await expect(consulta).resolves.toMatchObject({ count: 1 });
    expect(pedir).toHaveBeenCalledTimes(4);
  });
});
