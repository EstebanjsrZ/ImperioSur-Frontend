import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/hero';
import BeerCatalog from '@/components/beer-catalog';
import { Arrow, Crown, Wave } from '@/components/icons';

export default function Home() {
  return (
    <>
      <Hero />
      <div
        className="origin-ribbon"
        aria-label="ImperioSur, cerveza artesanal de Río Cuarto"
      >
        <span>RÍO CUARTO, CÓRDOBA</span>
        <Crown />
        <span>CARÁCTER ARTESANAL</span>
        <Crown />
        <span>HECHA PARA COMPARTIR</span>
        <Crown />
        <span>IMPERIOSUR</span>
      </div>
      <section className="beer-section section-wrap" id="cervezas">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">
            <span className="red-dash" />
            UNA MARCA. DISTINTAS PERSONALIDADES.
          </p>
          <h2>
            ENCONTRÁ
            <br />
            TU IMPERIOSUR.
          </h2>
          <p>
            Distintos estilos, una misma pasión por lo artesanal.
            <br />
            Hay una ImperioSur para cada buen momento.
          </p>
        </div>
        <BeerCatalog featured />
        <div className="section-bottom" data-reveal>
          <span>Descubrí los perfiles de nuestras variedades.</span>
          <Link className="text-link" href="/cervezas">
            EXPLORAR TODAS <Arrow />
          </Link>
        </div>
      </section>
      <section className="manifesto" id="esencia">
        <div className="manifesto-picture" data-reveal>
          <Image
            src="/images/hero-rio-corona-tallada.png"
            alt="Vaso con la corona y el nombre ImperioSur tallados en el vidrio"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <div className="picture-shade" />
          <span className="picture-caption">NUESTRO PUNTO DE ENCUENTRO.</span>
        </div>
        <div className="manifesto-copy" data-reveal>
          <p className="eyebrow">NUESTRA ESENCIA</p>
          <h2>
            EL ORIGEN
            <br />
            IMPORTA.
            <br />
            <span>
              LA COMPAÑÍA,
              <br />
              TAMBIÉN.
            </span>
          </h2>
          <Wave />
          <p>
            ImperioSur nace con una idea simple: darle identidad propia a los
            momentos compartidos.
          </p>
          <p>
            Desde Río Cuarto, Córdoba, elegimos el carácter artesanal, los
            sabores que invitan a descubrir y esa buena compañía que transforma
            cualquier encuentro.
          </p>
          <Link className="button button-outline" href="/cervezas">
            Conocé nuestras cervezas <Arrow />
          </Link>
        </div>
      </section>
      <section className="values section-wrap">
        <div data-reveal>
          <span className="value-index">01 /</span>
          <h3>CON IDENTIDAD.</h3>
          <p>
            Una cerveza de Río Cuarto, con el nombre y el carácter de
            ImperioSur.
          </p>
        </div>
        <div data-reveal style={{ '--reveal-delay': '100ms' }}>
          <span className="value-index">02 /</span>
          <h3>CON CARÁCTER.</h3>
          <p>
            Variedades para explorar. De la suavidad de una Golden a la
            intensidad de una Stout.
          </p>
        </div>
        <div data-reveal style={{ '--reveal-delay': '200ms' }}>
          <span className="value-index">03 /</span>
          <h3>CON LOS TUYOS.</h3>
          <p>
            Porque una buena cerveza también es una excusa para volver a
            encontrarse.
          </p>
        </div>
      </section>
      <section className="final-banner">
        <Image
          src="/images/hero-rio-corona-tallada.png"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="picture-shade" />
        <div data-reveal>
          <p className="eyebrow">LO ARTESANAL SE DISFRUTA MEJOR ACOMPAÑADO</p>
          <h2>
            BUENA CERVEZA.
            <br />
            MEJOR COMPAÑÍA.
          </h2>
          <Link className="button button-red" href="/cervezas">
            Elegí tu variedad <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
