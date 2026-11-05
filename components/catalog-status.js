export default function CatalogStatus({ error, cargando = false, onRetry }) {
  return (
    <div className="catalog-status" role={error ? 'alert' : 'status'}>
      <h2>
        {cargando
          ? 'PREPARANDO EL CATÁLOGO…'
          : error
            ? 'UN MOMENTO, POR FAVOR.'
            : 'PRONTO, MÁS SABORES.'}
      </h2>
      <p>
        {cargando
          ? 'Estamos buscando tus próximas ImperioSur.'
          : error || 'Todavía no hay productos cargados en nuestro catálogo.'}
      </p>
      {onRetry && (
        <button type="button" className="button button-red" onClick={onRetry}>
          Volver a intentar
        </button>
      )}
    </div>
  );
}
