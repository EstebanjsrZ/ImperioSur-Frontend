import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const cookieStore = vi.hoisted(() => ({
  set: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: async () => cookieStore }));
import { POST as login } from '../app/api/auth/login/route';
import { mismoOrigen } from './auth-server';

function request(endpoint, body, origin = 'http://localhost:3000') {
  return new Request(`http://localhost:3000/api/auth/${endpoint}`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => vi.unstubAllGlobals());

describe('sesión con Django a través de Next.js', () => {
  it('acepta el Host real aunque Next normalice la URL a localhost', () => {
    const local = new Request('http://localhost:3000/api/auth/login', {
      headers: { Host: '127.0.0.1:3000', Origin: 'http://127.0.0.1:3000' },
    });
    expect(mismoOrigen(local)).toBe(true);
    for (const origin of [
      'https://otro.test',
      'http://127.0.0.1:4000',
      'https://127.0.0.1:3000',
      'null',
    ]) {
      expect(
        mismoOrigen(
          new Request(local.url, {
            headers: { Host: '127.0.0.1:3000', Origin: origin },
          }),
        ),
      ).toBe(false);
    }
    expect(mismoOrigen(new Request(local.url))).toBe(false);
  });
  it('guarda el token HttpOnly sin devolverlo al navegador', async () => {
    fetch.mockResolvedValue(
      Response.json({
        token: 'token-prueba',
        usuario: { id: 1, username: 'ignacio' },
      }),
    );
    const response = await login(
      request('login', { username: 'ignacio', password: 'clave' }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      usuario: { id: 1, username: 'ignacio' },
    });
    expect(cookieStore.set).toHaveBeenCalledWith(
      'imperiosur_session',
      'token-prueba',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      username: 'ignacio',
      password: 'clave',
    });
  });
});
