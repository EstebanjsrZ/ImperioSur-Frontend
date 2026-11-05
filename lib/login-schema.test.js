import { describe, expect, it } from 'vitest';
import { loginSchema } from './login-schema';

describe('validación del login', () => {
  it('rechaza usuario vacío o compuesto por espacios', () => {
    for (const username of ['', '   '])
      expect(
        loginSchema.safeParse({ username, password: 'clave' }).success,
      ).toBe(false);
  });
});
