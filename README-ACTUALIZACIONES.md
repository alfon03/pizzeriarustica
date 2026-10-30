# Pizzería Rústica — web unificada

La web se ha actualizado desde el archivo `Pizzeria.rar` aportado.

## Qué ha cambiado
- Nueva sección **Novedades** en `index.html` y enlace en navegación.
- Nueva categoría **Novedades** en la carta completa, accesible mediante
  `carta.html?categoria=novedades#pizzas-carta`.
- Dos pizzas nuevas en `carta.json`: **Pulled BBQ** y **Full Cheese**, 13 €.
- PDF de carta completa y de novedades en `documentos/`.
- Nuevo CSS independiente `novedades-rustica.css` para no romper el diseño actual.

## Cómo editar futuras novedades
1. Abrir `carta.json`.
2. Añadir una pizza nueva al array `pizzas`, con un ID único y `categoria: "novedades"`.
3. Guardar el archivo y volver a subirlo al alojamiento o a GitHub.
4. Actualizar por separado el Word/PDF de novedades si cambia el contenido.

**Imágenes:** poner `imagen: null` hasta tener una fotografía real de cada pizza.

**Alérgenos:** revisar fichas técnicas, especialmente salsas y preparados de las
nuevas pizzas. El queso sin lactosa sigue conteniendo el alérgeno leche.

**Prueba local:** `python -m http.server 8000` en esta carpeta. No abrir
`index.html` como archivo local, ya que la carta se carga por `fetch`.


## Ajuste de botones y responsive (30/10/2026)

- Se corrige el contraste del enlace «Ver novedades en la carta», que antes usaba texto blanco sin un fondo adecuado.
- Las dos acciones de Novedades tienen estilos coherentes: botón naranja de carta y botón claro para PDF.
- El botón «Ver carta completa en PDF» de `carta.html` se integra con el encabezado verde oscuro.
- Se añade `rustica-ajustes-responsive.css` como última hoja de estilos de `index.html` y `carta.html`; mantener su orden.
- Se incluyen ajustes para pantallas de 320–620 px, tablet y escritorio, sin alterar `carta.json`.
- El icono de PDF se añade a `assets/ui-icons.svg`.

Sube **todo el contenido de `WEB_PUBLICAR`**, respetando la estructura, o actualiza los 5 archivos editados (`index.html`, `carta.html`, `assets/ui-icons.svg`, `README-ACTUALIZACIONES.md`, y el nuevo `rustica-ajustes-responsive.css`). No hace falta subir los Word.
