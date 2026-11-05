import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  tokenActual,
  pedirAuth,
  mismoOrigen,
  jsonPrivado,
} from '@/lib/auth-server';

export async function POST(request) {
  if (!mismoOrigen(request))
    return jsonPrivado({ detail: 'Origen no permitido.' }, 403);
  const token = await tokenActual();
  if (token) {
    try {
      const response = await pedirAuth('logout', { method: 'POST', token });
      if (!response.ok && ![401, 403].includes(response.status))
        return jsonPrivado(
          { detail: 'No pudimos cerrar la sesión. Volvé a intentar.' },
          502,
        );
    } catch {
      return jsonPrivado(
        {
          detail:
            'No pudimos conectar para cerrar la sesión. Volvé a intentar.',
        },
        503,
      );
    }
  }
  (await cookies()).delete(SESSION_COOKIE);
  return jsonPrivado({ ok: true });
}
