import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="not-found section-wrap">
      <p className="eyebrow">404 · NOS SALIMOS DE LA RONDA</p>
      <h1>
        POR ACÁ
        <br />
        NO ERA.
      </h1>
      <p>La página que buscás no está disponible. Volvamos a lo bueno.</p>
      <Link className="button button-red" href="/cervezas">
        Descubrir las cervezas
      </Link>
    </section>
  );
}
