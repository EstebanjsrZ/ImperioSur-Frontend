import Link from 'next/link';
import Brand from './brand';
import { Arrow, Wave } from './icons';

export default function Footer() {
  return <footer className="site-footer" id="origen"><div className="footer-top"><div><p className="eyebrow">RÍO CUARTO, CÓRDOBA</p><h2>EL PRÓXIMO ENCUENTRO<br />TIENE NOMBRE.</h2></div><Link className="round-arrow" href="/cervezas" aria-label="Explorar cervezas"><Arrow /></Link></div><div className="footer-main"><Link href="/" aria-label="ImperioSur, inicio"><Brand /></Link><p>Cerveza artesanal.<br />Carácter riocuartense.<br />Buenos momentos para compartir.</p><nav aria-label="Navegación al pie"><Link href="/cervezas">Nuestras cervezas</Link><Link href="/#esencia">Nuestra esencia</Link><Link href="/#origen">Nuestro origen</Link></nav><Wave className="footer-wave" /></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ImperioSur · Río Cuarto, Argentina.</span><span>Disfrutá con responsabilidad. Solo mayores de 18 años.</span></div></footer>;
}
