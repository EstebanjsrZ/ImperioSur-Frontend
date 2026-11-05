import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Ingresá tu usuario.')
    .max(150, 'El usuario admite hasta 150 caracteres.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
});
