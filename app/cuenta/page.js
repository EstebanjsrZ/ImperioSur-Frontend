import { redirect } from 'next/navigation';
import { tokenActual, pedirAuth } from '@/lib/auth-server';
import AccountPanel from '@/components/account-panel';
import { consultarGestion } from '@/lib/gestion-server';

export const metadata = { title: 'Mi cuenta' };
export default async function CuentaPage() {
  const token = await tokenActual();
  if (!token) redirect('/login');
  const response = await pedirAuth('me', { token });
  if ([401, 403].includes(response.status)) redirect('/login');
  if (!response.ok) throw new Error('No pudimos verificar tu sesión.');
  const puedeGestionar =
    (await consultarGestion(token).catch(() => 'permiso')) === 'permitido';
  return <AccountPanel puedeGestionar={puedeGestionar} />;
}
