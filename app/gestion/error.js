'use client';

export default function GestionError({ reset }) {
  return (
    <>
      <h1>No pudimos cargar la gestión</h1>
      <p>Comprobá que el backend esté disponible y volvé a intentar.</p>
      <button className="button button-red" onClick={reset}>
        Reintentar
      </button>
    </>
  );
}
