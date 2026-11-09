import 'server-only';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'imperiosur_session';
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function tokenActual() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function pedirAuth(endpoint, opciones) {
  return pedirDjango(`auth/${endpoint}/`, opciones);
}

export async function pedirDjango(
  recurso,
  { token, body, method = 'GET' } = {},
) {
  const base = (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:8000/api/'
  ).replace(/\/?$/, '/');
  const multipart = body instanceof FormData;
  return fetch(new URL(recurso, base), {
    method,
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
    headers: {
      Accept: 'application/json',
      ...(body && !multipart ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}),
  });
}

// Los POST con cookies sólo se aceptan desde el propio sitio (protección CSRF).
export function mismoOrigen(request) {
  const origin = request.headers.get('origin');
  // Next.js puede normalizar request.url a localhost en desarrollo.
  // Host conserva el destino al que realmente se conectó el navegador.
  const destino = new URL(request.url);
  destino.host = request.headers.get('host') || destino.host;
  return Boolean(origin && origin === destino.origin);
}

export function jsonPrivado(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}
