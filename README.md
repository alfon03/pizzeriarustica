# Pizzería Rústica — Diseño original mejorado V4.2

Esta versión conserva los fondos, pinceladas, hojas decorativas, logotipo, tipografías e imagen principal originales. Los ajustes están en `mejoras.css` y en `acabados-v42.css`, cargados después de `style.css`.

## Mejoras
- Diseño pulido en ordenadores, tablets y móviles: botones y filtros más cómodos, tipografía legible, tarjetas mejor espaciadas y llamada fija en móvil.
- Carta de 17 pizzas con filtros `Todas`, `Tradicionales`, `Base crema`, `Especiales`. No existe categoría `Vegetarianas` (sí la pizza **Vegetariana**).
- **No se utilizan fotografías de las pizzas individuales de ejemplo**: sus campos `imagen` siguen en `null`, mostrando el logo de marca hasta que se incorporen fotos reales.
- Se conservan las imágenes originales no asociadas a pizzas de ejemplo. La galería muestra las imágenes de ambiente incluidas en el proyecto, identificadas como **ilustrativas** (no se afirma que sean fotos reales del local).
- Llamada al **603 67 87 38** como opción principal, WhatsApp como alternativa.
- Mejoras de teclado, foco visible, botón para saltar al contenido y reducción de animaciones según preferencia del usuario.
- La carta muestra alérgenos por pizza con etiquetas e iconos: gluten, leche y pescado (solo si lleva atún). Leyenda y aviso explicativo al final de la carta.

## IMPORTANTE: verificación antes de publicar la información de alérgenos
- **Gluten:** todas las pizzas según la receta comunicada.
- **Leche:** el **queso sin lactosa sigue conteniendo proteínas de leche** y *sí* se debe marcar como alérgeno leche. Se marca leche en todas las pizzas con queso, incluyendo las de tomate, y en las de base crema por la nata. Eliminar leche de las pizzas con queso sería engañoso/peligroso para personas alérgicas.
- **Pescado:** se marca en las tres pizzas con atún.
- **Falta confirmación** de fichas técnicas de masas, quesos, ingredientes y salsas, posibles trazas/contacto cruzado, y alérgenos de **postres y bebidas** (que pueden incluir frutos secos, huevo, etc.). No asumir que el restaurante entero tiene solo tres tipos de alérgenos. Antes de publicar información definitiva, consultar a la persona responsable de seguridad alimentaria.
- La etiqueta «sin lactosa» no puede extenderse a todos los quesos de la carta sin verificar roquefort, otros quesos, queso de cabra, nata, embutidos y salsas.

## Uso
Abrir con servidor local (por ejemplo Live Server de VS Code o `python -m http.server 8000` dentro de la carpeta), ya que las páginas cargan `carta.json` con `fetch`.

Las fotos reales se podrán incorporar cambiando `"imagen": null` en `carta.json` por la ruta `"assets/foto-real.jpg"`.

Los productos, ingredientes, precios, dirección y horario no se han modificado. Los enlaces de contacto y redes se mantienen.


## V4 · reseñas, adaptación y SEO
- Se mantiene el diseño original y sus imágenes; solo se han añadido reglas en `mejoras.css`.
- Las **9 reseñas** del fichero `resenas.json` se han seleccionado de la relación proporcionada por el propietario (octubre de 2026). Algunos textos son extractos, identificados como tales. Los nombres se muestran tal y como aparecían en Google.
- La sección rota las opiniones automáticamente cada 6,5 segundos (3 en escritorio, 2 en tablet, 1 en móvil), con controles de anterior, siguiente y pausa. Se detiene en hover/foco, pestaña oculta y para quien active «reducir movimiento».
- **No es una sincronización automática con Google**: para actualizar la selección edita `resenas.json`. Sin JavaScript o si falla la carga se ven las primeras 3 reseñas en HTML.
- Link exacto a la ficha del negocio para leer todas las reseñas: https://www.google.com/maps/search/?api=1&query=Pizzer%C3%ADa%20Rustica%20Napoletana%20Style%20XXL%20Lora%20del%20R%C3%ADo&query_place_id=ChIJ_e6LOQDvEg0RnpeNVBLz2Lw
- Link directo para escribir una reseña (verificar en dispositivo real si abre correctamente la ficha): https://search.google.com/local/writereview?placeid=ChIJ_e6LOQDvEg0RnpeNVBLz2Lw
- Se añadió SEO local `Restaurant` con nombre, teléfono, dirección y mapa, sin valoración agregada artificial ni horarios supuestos.
- El horario del HTML se conserva de la versión anterior sin modificar; compruébalo con el negocio porque hay divergencias entre fuentes externas y lo indicado en el sitio.


## V4.1 · favicon transparente
- `favicon.ico`, los PNG de 16/32/512 px y el icono de inicio de iPhone se regeneraron a partir del logo original **sin fondo rectangular**.
- En navegadores que recuerdan el icono antiguo, vacía la caché o abre en modo privado.

## V4.2 · detalles finales de interfaz
- Nuevo archivo `acabados-v42.css`: pulido de tarjetas, mejora de separación, enfoque por teclado, botones táctiles y botón fijo para llamadas con espacio para las barras de navegación del móvil.
- Ajustes para móviles pequeños (320–390 px), tablets y escritorio; se mantiene la identidad visual, todos los elementos decorativos y el favicon transparente.
- Las reseñas **solo rotan automáticamente si la sección está visible** y continúan deteniéndose al interactuar, cambiar de pestaña o activar movimiento reducido.
- Menú móvil: el botón recupera correctamente el texto accesible «Abrir menú» al cerrar desde un enlace.
- Limpieza menor de HTML y del enlace del mapa dentro de los datos estructurados.
- Comprobación automatizada de los tamaños **320, 360, 390, 768, 1024 y 1440 px**: sin desbordamiento horizontal; filtros, menú, reseñas y enlaces telefónicos revisados en navegador de pruebas con recursos locales simulados. Recomendable una última comprobación en la web publicada para verificar también iconos SVG y fuentes externas.

**Pendiente antes de publicar:** confirmar horarios de cierre y fichas técnicas de ingredientes, alérgenos de postres y bebidas y posibles trazas. No presentar esta información como certificada hasta verificarla.
