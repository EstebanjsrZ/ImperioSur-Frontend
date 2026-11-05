# ImperioSur — Frontend

Primera propuesta visual local de Cervecería ImperioSur, una marca de cerveza artesanal de Río Cuarto, Córdoba. Proyecto separado del backend Django, creado con Next.js App Router, React, JavaScript, Tailwind CSS y estilos propios.

## Abrir en Windows

```powershell
cd "$env:USERPROFILE\Desktop\Cerveceria-EFI\ImperioSur-Frontend"
npm run dev
```

Entrar a http://127.0.0.1:3000/. Las dependencias ya están instaladas en esta PC. Para preparar una copia nueva, o reinstalar desde cero con el servidor detenido, ejecutar `npm ci` antes de `npm run dev`. Se necesita Node.js 20.9 o superior; se instaló Node.js LTS en esta PC.

![Vista local de ImperioSur](docs/capturas/inicio.jpg)

## Rutas y funcionamiento

- `/`: portada con carrusel de tres mensajes, controles anterior/siguiente y pausa; presentación de las variedades, esencia de la marca y origen.
- `/cervezas`: catálogo editorial con búsqueda, filtros por estilo y recuperación cuando no hay resultados.
- `/cervezas/ipa`, `/cervezas/golden`, `/cervezas/stout`: fichas de cada variedad ImperioSur y navegación hacia las demás.
- Menú adaptable en móvil, cierre mediante Escape, enlaces internos y página 404.

## Animaciones

- Transiciones de texto y entrada de botellas en la portada.
- Zoom suave en la fotografía y desplazamiento de fondo al hacer scroll.
- Apariciones progresivas de secciones mediante IntersectionObserver.
- Movimiento de botellas, flechas y botones al pasar el mouse.
- Menú fijo que cambia al desplazarse.
- Pausa del carrusel, suspensión cuando la pestaña no está visible y respeto por `prefers-reduced-motion`.

## Alcance de esta versión

Esta entrega sirve para revisar el diseño y las animaciones **en local**. Las tres variedades son contenido editorial de demostración: no se simulan ventas, stock, precios, pagos ni pedidos reales. Las fotografías y etiquetas son ilustrativas.

La conexión con la API de Django y los flujos de cuenta, gestión y pedidos se integrarán después de aprobar la propuesta visual y coordinar la consigna de Programación III. El backend existente se conserva en la carpeta vecina `Cerveceria-Backend`. No se modificó ni publicó el backend para crear esta propuesta.

## Archivos

- `app/`: páginas, layout y estilos globales.
- `components/`: marca, menú, portada, tarjetas, catálogo y efectos.
- `lib/cervezas.js`: contenido editorial y búsqueda.
- `public/images/`: portada y etiquetas originales de ImperioSur.
- `docs/imagenes.md`: procedencia y prompts de las imágenes.

## Validación

```powershell
npm test
npm run build
```

Se agregaron cuatro pruebas con Vitest para filtros combinados, normalización, búsquedas sin coincidencias y resolución de rutas de variedades. Además se revisan los recorridos en navegador.

## Git y organización

Repositorio: [EstebanjsrZ/ImperioSur-Frontend](https://github.com/EstebanjsrZ/ImperioSur-Frontend).

- `feature/frontend`: diseño inicial, animaciones, variedades y pruebas.
- `develop`: integración y revisión del trabajo del frontend.
- `main`: versión final revisada.

El recorrido es `feature/frontend` → Pull Request a `develop` → Pull Request a `main`. La página se ejecuta localmente en esta etapa; la integración de datos reales y los requisitos restantes de Programación III se completarán en las siguientes tareas.
