import { describe, expect, it } from 'vitest';
import { buscarCerveza, cervezas, filtrarCervezas } from './cervezas';

describe('catálogo de variedades ImperioSur', () => {
  it('combina filtro de estilo y búsqueda sin devolver otras variedades', () => {
    expect(
      filtrarCervezas(cervezas, 'Rubias', 'ImperioSur').map(
        (item) => item.slug,
      ),
    ).toEqual(['golden']);
    expect(filtrarCervezas(cervezas, 'Rubias', 'IPA')).toEqual([]);
  });
  it('admite búsquedas sin acentos, en mayúsculas y con espacios exteriores', () => {
    expect(
      filtrarCervezas(cervezas, 'Todas', '  AROMATICA  ').map(
        (item) => item.slug,
      ),
    ).toEqual(['ipa']);
  });
  it('devuelve una lista vacía para consultas sin coincidencias', () => {
    expect(filtrarCervezas(cervezas, 'Todas', 'variedad inexistente')).toEqual(
      [],
    );
  });
  it('identifica la variedad por su ruta y rechaza identificadores desconocidos', () => {
    expect(buscarCerveza('stout').nombre).toBe('Stout');
    expect(buscarCerveza('no-existe')).toBeUndefined();
  });
});
