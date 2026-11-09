import { loginSchema } from '@/lib/login-schema';
import {
  iniciarSesion,
  pedirAuth,
  mismoOrigen,
  jsonPrivado,
} from '@/lib/auth-server';

export async function POST(request) {
  if (!mismoOrigen(request))
    return jsonPrivado({ detail: 'Origen no permitido.' }, 403);
  const datos = loginSchema.safeParse(await request.json().catch(() => null));
  if (!datos.success)
    return jsonPrivado({ detail: 'Revisá el usuario y la contraseña.' }, 400);
  try {
    const response = await pedirAuth('login', {
      method: 'POST',
      body: datos.data,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 400 || response.status === 401)
        return jsonPrivado(
          { detail: 'Usuario o contraseña incorrectos.', errors: body },
          400,
        );
      return jsonPrivado(
        {
          detail:
            response.status === 429
              ? 'Demasiados intentos. Esperá unos minutos.'
              : 'No pudimos iniciar sesión. Intentá nuevamente.',
        },
        response.status === 429 ? 429 : 502,
      );
    }
    return await iniciarSesion(body);
  } catch {
    return jsonPrivado(
      { detail: 'No pudimos conectar con el servidor. Intentá nuevamente.' },
      503,
    );
  }
}
