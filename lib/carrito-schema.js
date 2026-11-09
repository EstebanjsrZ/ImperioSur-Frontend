import { z } from 'zod';

export const MAX_PRODUCTOS = 30;
export const MAX_CANTIDAD = 2147483647;

export const itemsCarritoSchema = z
  .array(
    z.object({
      producto: z.number().int().positive(),
      cantidad: z.number().int().min(1).max(MAX_CANTIDAD),
    }),
  )
  .max(MAX_PRODUCTOS)
  .refine(
    (items) =>
      new Set(items.map(({ producto }) => producto)).size === items.length,
  );

export const compraSchema = z.object({
  items: itemsCarritoSchema.refine((items) => items.length > 0),
});
