# Pizzería Rústica — web reorganizada + PWA

Sitio estático de Pizzería Rústica, listo para publicar en GitHub Pages y utilizar como PWA instalable.

## Archivos principales

```text
index.html                      Inicio de la web
carta.html                      Carta online
manifest.webmanifest            Metadatos para instalar la PWA
sw.js                           Service worker / funcionamiento offline
offline.html                    Página de respaldo sin conexión
favicon.ico                     Favicon de compatibilidad
CNAME                           Dominio personalizado (no borrar)
googleedf3312aaa1c813e.html    Verificación Google (no borrar)
assets/
  css/style.css                 Hoja de estilos unificada
  js/script.js                  Inicio, pizzas y novedades
  js/carta.js                   Carta y filtros
  js/resenas.js                 Reseñas
  js/pwa.js                     Registro de service worker
  data/carta.json               Pizzas, precios, alérgenos, bebidas y postres
  data/resenas.json             Reseñas seleccionadas
  images/                       Fotografías, texturas y decoración
  icons/                        Iconos, logo PWA y SVG de alérgenos
documentos/                     PDF de la carta completa y novedades
```

## Lo que ha cambiado

- Se han ordenado los estilos, scripts, JSON, imágenes e iconos en subcarpetas.
- Se han corregido **todas las rutas** de HTML, CSS y JS.
- Se ha retirado del paquete el historial `.git/` (aprox. 149 archivos del ZIP original): **no se debe eliminar la carpeta `.git` del repositorio local que estés utilizando**.
- Se han reunido dos imágenes decorativas idénticas (`leaf-footer-left.png` y `leaf-hero-top-left.png`) en `assets/images/leaf-decor-left.png`.
- Se conservan los PDF, `CNAME`, el archivo de validación de Google y los datos existentes; no se han cambiado precios ni productos.
- Se han añadido manifest, iconos 192/512/maskable, registro de service worker y experiencia offline.

## Cómo publicarlo

1. Haz copia de seguridad de tu repositorio/servidor actual.
2. Copia el **contenido** de esta carpeta a la **raíz del repositorio** de GitHub Pages (donde ya está `index.html`). **No copies una carpeta extra `Pizzeria_PWA/`**.
3. En la copia del repositorio, borra los archivos viejos que hayan quedado fuera de estas nuevas rutas (`style.css`, `script.js`, `carta.js`, `resenas.js`, `carta.json`, `resenas.json`, y la antigua disposición de `assets/`), sin tocar `.git/`.
4. Verifica que `CNAME` permanece en la raíz y publica los cambios normalmente. Nunca uses `git push --force` para resolver problemas de sincronización.
5. Abre la web desde su dominio **HTTPS** y vuelve a cargar una vez para activar el service worker.

Para comprobarlo localmente, desde esta carpeta ejecuta:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000` (no `file://`, ya que la carta se obtiene mediante `fetch`). La PWA es instalable en navegadores compatibles. Para instalarla en iPhone/iPad utiliza el menú Compartir → Añadir a pantalla de inicio.

## Actualizaciones y uso sin conexión

- Portada, carta, imágenes e información de la carta quedan en caché tras una primera visita **con conexión**, cuando finaliza la instalación del service worker.
- Al volver a tener conexión, se intenta descargar el JSON más reciente de pizzas y reseñas.
- Los PDF no se precargan: se podrán abrir offline **si previamente se han abierto online** en el navegador y se han guardado en caché.
- Google Fonts, Instagram, Google Maps, teléfono y WhatsApp son servicios externos y pueden necesitar conexión.
- **Importante:** cambia el valor `VERSION` en `sw.js` tras publicar cambios en imágenes, estilos, páginas o textos para renovar la caché offline; el navegador cargará el nuevo service worker cuando detecte el cambio.

## Comprobaciones antes de publicar

- Revisar fichas técnicas, trazas y alérgenos: los datos de la carta deben confirmarse con el negocio.
- Probar los enlaces a cartas PDF, redes y el funcionamiento de botones en móvil.
- Comprobar en herramientas de desarrollo → Aplicación → Manifest y Service Workers la instalación y el modo sin conexión.
