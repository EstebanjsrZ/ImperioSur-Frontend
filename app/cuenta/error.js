'use client';
export default function ErrorCuenta({ reset }) {
  return (
    <div>
      <h1>No pudimos abrir tu cuenta</h1>
      <p role="alert">
        Verificá la conexión con el servidor y volvé a intentar.
      </p>
      <button className="button button-red" onClick={reset}>
        Reintentar
      </button>
    </div>
  );
}
