import { afterEach, expect, it, vi } from 'vitest';
import { guardarProducto } from '@/app/gestion/productos/actions';
import { productoSchema } from './producto-schema';

vi.mock('@/lib/auth-server', () => ({
  tokenActual: async () => 'token-prueba',
  pedirDjango: vi.fn(),
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { pedirDjango } from './auth-server';
import { revalidatePath } from 'next/cache';

const producto = {
  nombre: '  IPA  ',
  descripcion: '',
  precio: '1990,50',
  stock: '0',
  categoria: '1',
  marca: '2',
  presentacion: '',
  proveedores: [],
};

afterEach(() => vi.clearAllMocks());

it('valida el formulario de producto y normaliza sus datos para Django', () => {
  expect(productoSchema.parse(producto)).toMatchObject({
    nombre: 'IPA',
    precio: '1990.50',
    stock: 0,
    categoria: 1,
    marca: 2,
    presentacion: null,
  });
  expect(
    productoSchema.safeParse({
      ...producto,
      precio: '2,999',
      stock: '-1',
      categoria: '',
    }).success,
  ).toBe(false);
});

it('devuelve los errores de Django al editar sin refrescar la lista', async () => {
  pedirDjango.mockResolvedValue(
    Response.json({ categoria: ['La categoría no existe.'] }, { status: 400 }),
  );
  await expect(guardarProducto('7', producto)).resolves.toEqual({
    error: 'Revisá los datos del producto.',
    campos: { categoria: ['La categoría no existe.'] },
  });
  expect(pedirDjango).toHaveBeenCalledWith(
    'productos/7/',
    expect.objectContaining({
      method: 'PATCH',
      token: 'token-prueba',
      body: expect.objectContaining({ precio: '1990.50' }),
    }),
  );
  expect(revalidatePath).not.toHaveBeenCalled();
});
