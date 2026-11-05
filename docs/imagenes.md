# Imágenes originales de la propuesta visual

Herramienta: ImageGen integrado. Las imágenes se guardaron dentro del proyecto y son ilustrativas; no son fotografías de una fábrica o de productos físicos existentes.

La referencia de diseño fue https://cervezablest.com.ar/: se tomaron ideas generales de composición, fotografía de gran tamaño, navegación sobre la imagen, tipografía destacada y transiciones. No se utilizaron sus logos, envases, fotografías ni textos.

## Portada

Archivo: `public/images/hero-rio.png`.

La imagen se generó antes del cambio de nombre de El Litoral a ImperioSur. No contiene letras ni marcas y el usuario aprobó conservarla al definir Río Cuarto como origen de ImperioSur.

Prompt final de generación:

> Use case: photorealistic-natural. Asset type: full-bleed cinematic homepage photograph for the new Argentine craft beer brand Cervecería El Litoral. Create a premium natural editorial beer photograph, landscape 16:9 panoramic composition. Main subject: a generous tall pint glass of luminous golden amber craft beer with a thick realistic white foam head, fine condensation, standing on weathered dark timber at the edge of a quiet Paraná-style river and lush riverside woodland at late golden hour. The glass occupies the RIGHT third, crisp and life-sized, river and leafy trees softly blurred behind it. The LEFT half must remain naturally dark, spacious, and low detail for a big white headline added in HTML, with no lettering in the image. Deep forest greens, charcoal shadows, rich amber liquid and warm rim light. Authentic, tactile, atmospheric, not a glossy synthetic 3D render. Eye-level 50mm editorial advertising photography, subtle film grain, believable optical depth. No people, no brand logos or emblems on the glass, no text, no watermark, no borders, no collage. This is an original creative asset, not a reproduction of the Blest website or its trademarks.

## Variedades

Archivos: `public/images/imperiosur-ipa.png`, `imperiosur-golden.png` e `imperiosur-stout.png`. Se pidió transparencia en los tres casos. Cada imagen se generó por separado.

Prompt común, con las sustituciones indicadas abajo:

> Use case: product-mockup. A single premium photorealistic Argentine craft beer bottle for the fictional new brewery ImperioSur from Río Cuarto. One amber brown 500ml glass bottle with crown cap, upright front-facing, centered with the ENTIRE silhouette and cap and bottom visible, occupying 85 percent of a portrait canvas. Transparent background, no backdrop, no pedestal, no surrounding props, with only a very subtle contact shadow. Highly realistic studio product photography, crisp reflections and cold subtle condensation. Beautiful original cream paper label with a restrained original crown-and-river emblem, {COLOR} accents. The main large readable logotype on the label must be EXACTLY "ImperioSur" (capital I and S, one word). The beer variety below must be EXACTLY "{CLASE}" in bold condensed capitals. Small text "CERVEZA ARTESANAL" above the logotype and "RÍO CUARTO · CÓRDOBA" at the bottom. No other brands, no invented alcohol percentages, no barcodes, no extra lettering, no watermark. A tasteful, cohesive brand system with artisanal engraved linework and clean typography. The same bottle and label composition is used across the IPA, GOLDEN and STOUT variants. This image is the {CLASE} variant, no other bottles.

| Archivo | CLASE | COLOR |
| --- | --- | --- |
| imperiosur-ipa.png | IPA | deep crimson red |
| imperiosur-golden.png | GOLDEN | warm ochre gold |
| imperiosur-stout.png | STOUT | charcoal black |

La marca de navegación y el favicon se construyeron como texto y SVG propios para mantener legibilidad y escalabilidad.
