'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/login-schema';
import { useAuth } from './auth-provider';

export default function LoginForm() {
  const { ingresar, estado } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });
  useEffect(() => {
    if (estado === 'autenticado') router.replace('/cuenta');
  }, [estado, router]);
  async function enviar(datos) {
    try {
      await ingresar(datos);
      router.replace('/cuenta');
      router.refresh();
    } catch (error) {
      for (const campo of ['username', 'password']) {
        if (Array.isArray(error.campos?.[campo]))
          setError(campo, { message: error.campos[campo].join(' ') });
      }
      setError('root', {
        message: error.message || 'No pudimos iniciar sesión.',
      });
    }
  }
  return (
    <form className="auth-form" onSubmit={handleSubmit(enviar)} noValidate>
      <label htmlFor="username">Usuario</label>
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <input
            id="username"
            autoComplete="username"
            {...field}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
        )}
      />
      {errors.username && (
        <p id="username-error" className="auth-error" role="alert">
          {errors.username.message}
        </p>
      )}
      <label htmlFor="password">Contraseña</label>
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...field}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
        )}
      />
      {errors.password && (
        <p id="password-error" className="auth-error" role="alert">
          {errors.password.message}
        </p>
      )}
      {errors.root && (
        <p className="auth-error" role="alert">
          {errors.root.message}
        </p>
      )}
      <button
        className="button button-red"
        disabled={
          isSubmitting || estado === 'cargando' || estado === 'autenticado'
        }
      >
        {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
