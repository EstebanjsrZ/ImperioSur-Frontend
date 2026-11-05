import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  tokenActual,
  pedirAuth,
  jsonPrivado,
} from '@/lib/auth-server';

export async function GET() {
  const token = await tokenActual();
  if (!token)
    return jsonPrivado({ detail: 'Iniciá sesión para continuar.' }, 401);
  try {
    const response = await pedirAuth('me', { token });
    if ([401, 403].includes(response.status)) {
      (await cookies()).delete(SESSION_COOKIE);
      return jsonPrivado({ detail: 'Tu sesión ya no es válida.' }, 401);
    }
    if (!response.ok)
      return jsonPrivado({ detail: 'No pudimos verificar tu sesión.' }, 502);
    return jsonPrivado({ usuario: await response.json() });
  } catch {
    return jsonPrivado({ detail: 'No pudimos conectar con el servidor.' }, 503);
  }
}
