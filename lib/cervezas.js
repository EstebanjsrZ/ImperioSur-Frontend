export const cervezas = [
  {
    slug: 'ipa', nombre: 'IPA', marca: 'ImperioSur', categoria: 'Lupuladas',
    imagen: '/images/imperiosur-ipa.png', color: '#a42b35', fondo: '#eee3d9',
    bajada: 'Carácter que se hace notar.',
    descripcion: 'El perfil de una IPA combina el protagonismo del lúpulo con un amargor marcado. Una variedad para quienes disfrutan explorar aromas y sabores intensos.',
    notas: ['Lupulada', 'Aromática', 'Amargor marcado'],
    frase: 'PARA LOS QUE\nELIGEN CARÁCTER.',
  },
  {
    slug: 'golden', nombre: 'Golden', marca: 'ImperioSur', categoria: 'Rubias',
    imagen: '/images/imperiosur-golden.png', color: '#b9882e', fondo: '#f0e8d5',
    bajada: 'La simpleza de un buen encuentro.',
    descripcion: 'El estilo Golden se caracteriza por su color dorado y su perfil suave. Una forma fresca y equilibrada de acercarse al mundo de la cerveza artesanal.',
    notas: ['Dorada', 'Suave', 'Refrescante'],
    frase: 'LOS BUENOS\nMOMENTOS, SIMPLES.',
  },
  {
    slug: 'stout', nombre: 'Stout', marca: 'ImperioSur', categoria: 'Oscuras',
    imagen: '/images/imperiosur-stout.png', color: '#3a3a34', fondo: '#e8e5dd',
    bajada: 'Una intensidad que invita a quedarse.',
    descripcion: 'El estilo Stout se reconoce por su color oscuro y las notas tostadas de sus maltas. Una cerveza para descubrir con tiempo y disfrutar cada matiz.',
    notas: ['Oscura', 'Tostada', 'Intensa'],
    frase: 'EL LADO OSCURO\nDEL BUEN SABOR.',
  },
];

export function buscarCerveza(slug) {
  return cervezas.find((cerveza) => cerveza.slug === slug);
}

export function filtrarCervezas(lista, categoria = 'Todas', busqueda = '') {
  const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const consulta = normalizar(busqueda.trim());
  return lista.filter((cerveza) => (categoria === 'Todas' || cerveza.categoria === categoria)
    && normalizar(`${cerveza.marca} ${cerveza.nombre} ${cerveza.categoria} ${cerveza.notas.join(' ')}`).includes(consulta));
}
