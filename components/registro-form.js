'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registroSchema } from '@/lib/registro-schema';
import { useAuth } from './auth-provider';

const campos = [
  {
    name: 'first_name',
    label: 'Nombre (opcional)',
    autoComplete: 'given-name',
  },
  {
    name: 'last_name',
    label: 'Apellido (opcional)',
    autoComplete: 'family-name',
  },
  { name: 'username', label: 'Usuario', autoComplete: 'username' },
  {
    name: 'email',
    label: 'Correo electrónico',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'password1',
    label: 'Contraseña',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    name: 'password2',
    label: 'Repetí tu contraseña',
    type: 'password',
    autoComplete: 'new-password',
  },
];

export default function RegistroForm({ destino }) {
  const { registrar } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registroSchema),
    defaultValues: Object.fromEntries(campos.map(({ name }) => [name, ''])),
  });

  async function enviar(datos) {
    try {
      await registrar(datos);
      router.replace(destino);
      router.refresh();
    } catch (error) {
      for (const { name } of campos) {
        const mensajes = error.campos?.[name];
        if (Array.isArray(mensajes))
          setError(name, { message: mensajes.join(' ') });
      }
      setError('root', { message: error.message });
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(enviar)} noValidate>
      {campos.map(({ name, label, type = 'text', autoComplete }) => (
        <div className="grid gap-2" key={name}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            type={type}
            autoComplete={autoComplete}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
            {...register(name)}
          />
          {errors[name] && (
            <p className="auth-error" id={`${name}-error`}>
              {errors[name].message}
            </p>
          )}
        </div>
      ))}
      {errors.root && (
        <p className="auth-error" role="alert">
          {errors.root.message}
        </p>
      )}
      <button className="button button-red" disabled={isSubmitting}>
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  );
}
