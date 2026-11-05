import { describe, expect, it } from 'vitest';
import { cervezas, filtrarCervezas } from './cervezas';

describe('catálogo de variedades ImperioSur', () => {
  it('combina filtro de estilo y búsqueda sin devolver otras variedades', () => {
    expect(
      filtrarCervezas(cervezas, 'Rubias', 'ImperioSur').map(
        (item) => item.slug,
      ),
    ).toEqual(['golden']);
    expect(filtrarCervezas(cervezas, 'Rubias', 'IPA')).toEqual([]);
  });
});
