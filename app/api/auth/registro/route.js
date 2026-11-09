import {
  iniciarSesion,
  jsonPrivado,
  mismoOrigen,
  pedirAuth,
} from '@/lib/auth-server';
import { registroSchema } from '@/lib/registro-schema';

export async function POST(request) {
  if (!mismoOrigen(request))
    return jsonPrivado({ detail: 'Origen no permitido.' }, 403);
  const datos = registroSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!datos.success)
    return jsonPrivado({ detail: 'Revisá los datos de tu cuenta.' }, 400);
  try {
    const response = await pedirAuth('registro', {
      method: 'POST',
      body: datos.data,
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok) return await iniciarSesion(body, 201);
    if (response.status === 400)
      return jsonPrivado(
        { detail: 'Revisá los datos de tu cuenta.', errors: body },
        400,
      );
    if (response.status === 429)
      return jsonPrivado(
        { detail: 'Demasiados intentos. Esperá unos minutos.' },
        429,
      );
  } catch {
    return jsonPrivado({ detail: 'No pudimos conectar con el servidor.' }, 503);
  }
  return jsonPrivado(
    { detail: 'No pudimos crear la cuenta. Intentá de nuevo.' },
    502,
  );
}
