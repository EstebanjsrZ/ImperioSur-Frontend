'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
const AuthContext = createContext(null);

async function solicitarSesion(endpoint, body) {
  const response = await fetch(`/api/auth/${endpoint}`, {
    method: endpoint === 'me' ? 'GET' : 'POST',
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const datos = await response.json();
  if (!response.ok)
    throw Object.assign(
      new Error(datos.detail || 'No pudimos completar la operación.'),
      { status: response.status, campos: datos.errors },
    );
  return datos;
}

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [estado, setEstado] = useState('cargando');
  const [error, setError] = useState('');
  const revision = useRef(0);
  const verificar = useCallback(async () => {
    const actual = ++revision.current;
    setEstado('cargando');
    setError('');
    try {
      const datos = await solicitarSesion('me');
      if (actual !== revision.current) return;
      setUsuario(datos.usuario);
      setEstado('autenticado');
    } catch (err) {
      if (actual !== revision.current) return;
      setUsuario(null);
      setEstado(err.status === 401 ? 'anonimo' : 'error');
      if (err.status !== 401) setError(err.message);
    }
  }, []);
  useEffect(() => {
    verificar();
    return () => {
      revision.current++;
    };
  }, [verificar]);
  async function ingresar(credenciales) {
    ++revision.current;
    const datos = await solicitarSesion('login', credenciales);
    setUsuario(datos.usuario);
    setEstado('autenticado');
    setError('');
  }
  async function salir() {
    ++revision.current;
    await solicitarSesion('logout');
    setUsuario(null);
    setEstado('anonimo');
    setError('');
  }
  return (
    <AuthContext.Provider
      value={{ usuario, estado, error, ingresar, salir, verificar }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth necesita AuthProvider.');
  return context;
}
