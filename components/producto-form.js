'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guardarProducto } from '@/app/gestion/productos/actions';
import { imagenProducto, productoSchema } from '@/lib/producto-schema';

const campos = [
  ['nombre', 'Nombre'],
  ['descripcion', 'Descripción', 'texto'],
  ['precio', 'Precio', 'decimal'],
  ['stock', 'Stock', 'numeric'],
  ['categoria', 'Categoría', 'categorias'],
  ['marca', 'Marca', 'marcas'],
  ['presentacion', 'Presentación', 'presentaciones'],
  ['proveedores', 'Proveedores', 'proveedores'],
];

export default function ProductoForm({ producto, opciones }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productoSchema, undefined, { raw: true }),
    defaultValues: {
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio: String(producto?.precio ?? ''),
      stock: String(producto?.stock ?? 0),
      categoria: String(producto?.categoria ?? ''),
      marca: String(producto?.marca ?? ''),
      presentacion: String(producto?.presentacion ?? ''),
      proveedores: (producto?.proveedores ?? []).map(String),
    },
  });

  async function enviar({ imagen, ...valores }) {
    try {
      let adjunto;
      if (imagen?.length) {
        const archivo = imagenProducto.safeParse(imagen[0]);
        if (!archivo.success) {
          setError('imagen', { message: archivo.error.issues[0].message });
          return;
        }
        adjunto = new FormData();
        adjunto.append('imagen', archivo.data);
      }
      const resultado = await guardarProducto(
        producto ? String(producto.id) : null,
        valores,
        adjunto,
      );
      if (resultado.ok) {
        router.replace('/gestion/productos');
        return;
      }
      for (const campo of [...campos.map(([nombre]) => nombre), 'imagen']) {
        const mensajes = resultado.campos?.[campo];
        if (Array.isArray(mensajes))
          setError(campo, { message: mensajes.join(' ') });
      }
      setError('root', { message: resultado.error });
    } catch {
      setError('root', {
        message: 'No pudimos guardar el producto. Intentá nuevamente.',
      });
    }
  }

  return (
    <form
      className="auth-form gestion-form"
      onSubmit={handleSubmit(enviar)}
      noValidate
    >
      {campos.map(([campo, etiqueta, tipo]) => (
        <div className="gestion-campo" key={campo}>
          <label htmlFor={campo}>{etiqueta}</label>
          <Controller
            name={campo}
            control={control}
            render={({ field }) => {
              const props = {
                ...field,
                id: campo,
                'aria-invalid': Boolean(errors[campo]),
                'aria-describedby': errors[campo]
                  ? `${campo}-error`
                  : undefined,
              };

              if (opciones[tipo]) {
                const multiple = campo === 'proveedores';

                return (
                  <select
                    {...props}
                    multiple={multiple}
                    onChange={(event) => {
                      const valor = multiple
                        ? Array.from(
                            event.target.selectedOptions,
                            (opcion) => opcion.value,
                          )
                        : event.target.value;

                      field.onChange(valor);
                    }}
                  >
                    {!multiple && (
                      <option value="">
                        {campo === 'presentacion'
                          ? 'Sin presentación'
                          : 'Elegí una opción'}
                      </option>
                    )}
                    {opciones[tipo].map(({ id, nombre }) => (
                      <option key={id} value={id}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                );
              }

              if (tipo === 'texto') {
                return <textarea {...props} rows={4} />;
              }

              return <input {...props} inputMode={tipo} />;
            }}
          />
          {errors[campo] && (
            <p id={`${campo}-error`} className="gestion-error" role="alert">
              {errors[campo].message}
            </p>
          )}
        </div>
      ))}
      <div className="gestion-campo">
        <label htmlFor="imagen">Imagen</label>
        <p id="imagen-ayuda">
          {producto?.imagen
            ? 'Dejá este campo vacío para conservar la foto actual. '
            : ''}
          JPG, PNG o WebP de hasta 4 MB.
        </p>
        {/* El navegador gestiona el archivo; no se le asigna un value. */}
        <input
          id="imagen"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-invalid={Boolean(errors.imagen)}
          aria-describedby={
            errors.imagen ? 'imagen-ayuda imagen-error' : 'imagen-ayuda'
          }
          {...register('imagen')}
        />
        {errors.imagen && (
          <p id="imagen-error" className="gestion-error" role="alert">
            {errors.imagen.message}
          </p>
        )}
      </div>
      {errors.root && (
        <p className="gestion-error" role="alert">
          {errors.root.message}
        </p>
      )}
      <div className="gestion-acciones">
        <button className="button button-red" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar producto'}
        </button>
        <Link className="button button-outline" href="/gestion/productos">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
