import {
  jsonPrivado,
  mismoOrigen,
  pedirDjango,
  tokenActual,
} from '@/lib/auth-server';
import { compraSchema } from '@/lib/carrito-schema';

function mensajes(datos) {
  if (typeof datos === 'string') return [datos];
  if (datos && typeof datos === 'object')
    return Object.values(datos).flatMap(mensajes);
  return [];
}

export async function POST(request) {
  if (!mismoOrigen(request))
    return jsonPrivado({ detail: 'Origen no permitido.' }, 403);
  const token = await tokenActual();
  if (!token)
    return jsonPrivado(
      { detail: 'Iniciá sesión para confirmar el pedido.' },
      401,
    );
  const datos = compraSchema.safeParse(await request.json().catch(() => null));
  if (!datos.success)
    return jsonPrivado({ detail: 'Revisá las cantidades del carrito.' }, 400);

  try {
    const response = await pedirDjango('pedidos/', {
      method: 'POST',
      token,
      body: datos.data,
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok && Number.isInteger(body.id))
      return jsonPrivado({ id: body.id }, 201);
    if ([401, 403].includes(response.status))
      return jsonPrivado(
        { detail: 'Tu sesión venció. Ingresá de nuevo para continuar.' },
        401,
      );
    if (response.status === 400)
      return jsonPrivado(
        {
          detail:
            mensajes(body).join(' ') || 'Revisá los productos del carrito.',
        },
        400,
      );
  } catch {
    // Si la respuesta se perdió, el pedido puede haberse guardado.
  }
  return jsonPrivado(
    {
      detail:
        'No pudimos comprobar el resultado. Revisá Mis pedidos antes de volver a confirmar.',
    },
    502,
  );
}
