'use client';

import { useState } from 'react';
import BeerCard from './beer-card';
import { cervezas, filtrarCervezas } from '@/lib/cervezas';

export default function BeerCatalog() {
  const [categoria, setCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const resultados = filtrarCervezas(cervezas, categoria, busqueda);
  return <><div className="catalog-toolbar"><div className="filter-tabs" role="group" aria-label="Filtrar por estilo">{['Todas', 'Rubias', 'Lupuladas', 'Oscuras'].map((nombre) => <button key={nombre} aria-pressed={categoria === nombre} className={categoria === nombre ? 'active' : ''} onClick={() => setCategoria(nombre)} type="button">{nombre}</button>)}</div><label className="catalog-search"><span className="sr-only">Buscar variedad</span><input type="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Encontrá tu estilo…" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></svg></label></div><p className="result-count" aria-live="polite">{resultados.length} {resultados.length === 1 ? 'variedad para descubrir' : 'variedades para descubrir'}</p><div className="beer-grid catalog-grid">{resultados.map((cerveza, index) => <BeerCard key={cerveza.slug} cerveza={cerveza} index={index} />)}</div>{resultados.length === 0 && <div className="empty-catalog"><h2>OTRO INTENTO,<br />OTRO SABOR.</h2><p>No encontramos una variedad con esa búsqueda.</p><button className="button button-red" onClick={() => { setBusqueda(''); setCategoria('Todas'); }} type="button">Ver todas las variedades</button></div>}</>;
}
