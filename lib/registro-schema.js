import { z } from 'zod';
import { loginSchema } from './login-schema';

export const registroSchema = z
  .object({
    username: loginSchema.shape.username.regex(
      /^[\p{L}\p{N}_@.+-]+$/u,
      'Usá letras, números o los signos @ . + - _.',
    ),
    first_name: z.string().trim().max(150, 'Hasta 150 caracteres.'),
    last_name: z.string().trim().max(150, 'Hasta 150 caracteres.'),
    email: z.email('Ingresá un correo válido.').max(254),
    password1: z.string().min(8, 'Usá al menos 8 caracteres.').max(128),
    password2: z.string().min(1, 'Repetí tu contraseña.').max(128),
  })
  .refine(({ password1, password2 }) => password1 === password2, {
    path: ['password2'],
    message: 'Las contraseñas no coinciden.',
  });
