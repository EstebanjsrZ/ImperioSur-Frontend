import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Effects from '@/components/effects';
import AuthProvider from '@/components/auth-provider';
import CarritoProvider from '@/components/carrito-provider';

export const metadata = {
  title: {
    default: 'ImperioSur | Cerveza artesanal de Río Cuarto',
    template: '%s | ImperioSur',
  },
  description:
    'ImperioSur. Cerveza artesanal de Río Cuarto, Córdoba. Descubrí nuestras variedades y encontrá tu próximo buen momento.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <body>
        <AuthProvider>
          <CarritoProvider>
            <a className="skip-link" href="#contenido">
              Saltar al contenido
            </a>
            <Header />
            <main id="contenido">{children}</main>
            <Footer />
            <Effects />
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
