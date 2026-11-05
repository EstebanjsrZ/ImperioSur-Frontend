import { z } from 'zod';

const entero = z
  .string()
  .regex(/^\d{1,10}$/, 'Ingresá un número entero.')
  .transform(Number)
  .pipe(z.number().int().max(2147483647, 'El valor es demasiado grande.'));

export const idProducto = z
  .string()
  .regex(/^[1-9]\d*$/)
  .refine((id) => Number.isSafeInteger(Number(id)));

const relacion = entero.refine((id) => id > 0, 'Elegí una opción.');

export const imagenProducto = z
  .file()
  .max(4 * 1024 * 1024, 'La imagen puede pesar hasta 4 MB.')
  .mime(
    ['image/jpeg', 'image/png', 'image/webp'],
    'Elegí una imagen JPG, PNG o WebP.',
  );

export const productoSchema = z.object({
  nombre: z.string().trim().min(1, 'Ingresá el nombre.').max(150),
  descripcion: z.string().trim(),
  precio: z
    .string()
    .trim()
    .regex(
      /^\d{1,8}([.,]\d{1,2})?$/,
      'Ingresá un precio con hasta dos decimales.',
    )
    .transform((precio) => precio.replace(',', '.')),
  stock: entero,
  categoria: relacion,
  marca: relacion,
  presentacion: z.union([z.literal('').transform(() => null), relacion]),
  proveedores: z.array(relacion),
});
