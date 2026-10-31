# Pizzería Rústica — web unificada lista para GitHub Pages

Esta carpeta es la **raíz de publicación** de la web de Rústica. Contiene solo los archivos necesarios para publicar la página, más estas instrucciones. El ZIP original aportado por el propietario **no se modifica**.

## Publicación en GitHub Pages

- Repositorio actual: `https://github.com/alfon03/pizzeriarustica`
- Dominio personalizado: `rusticanapoletanastylexxl.es`
- **Conservar `CNAME`** en la raíz del repositorio: GitHub Pages lo necesita para el dominio propio.
- Las páginas `index.html` y `carta.html` deben estar en la raíz que sirve GitHub Pages (no dentro de una carpeta `Pizzeria/`).
- **No sustituir ni borrar la carpeta `.git` del ordenador**. Copiar los archivos y carpetas de este ZIP al repositorio, actualizar los existentes y eliminar los ficheros obsoletos enumerados abajo.
- No usar `git push --force` para resolver conflictos de sincronización.

## Estructura limpia

- `index.html` — página principal.
- `carta.html` — carta online con filtros.
- `style.css` — **todos los estilos unificados**, incluidos responsive, novedades y corrección de «Nuestra masa».
- `script.js`, `carta.js`, `resenas.js` — comportamiento de la web.
- `carta.json`, `resenas.json` — datos editables; pizzas, precios y reseñas.
- `assets/` — solo imágenes e iconos referenciados realmente en la web.
- `documentos/Carta_Rustica_Completa_A5.pdf` — carta completa en PDF (2 páginas A5).
- `documentos/Carta_Novedades_Rustica_A5.pdf` — PDF correcto de Novedades (1 página A5, logo mejorado).
- `CNAME` — configuración del dominio personalizado.
- `favicon*`, `apple-touch-icon.png` — iconos de navegador / móvil.

## Qué se ha eliminado respecto al ZIP recibido

- Las cinco hojas CSS separadas `mejoras.css`, `acabados-v42.css`, `novedades-rustica.css`, `rustica-ajustes-responsive.css` y `rustica_correccion_pasion_movil.css`: su contenido **ya está integrado en `style.css`** en el mismo orden.
- `app.js`, que ninguna página utilizaba; `script.js` y `carta.js` se conservan.
- Cinco fotos de pizzas de demostración que no aparecían en pantalla (las 19 pizzas usan `imagen: null`).
- Iconos SVG de alérgenos no utilizados: se conservan gluten, leche y pescado.
- `favicon-source.png` (archivo de trabajo, no usado por el navegador).
- El README antiguo y el historial `.git` del ZIP original **no se incluyen** en este paquete de publicación. La carpeta `.git` de tu repositorio local debe conservarse.

## Aplicar estos cambios a tu carpeta existente en Windows

1. Haz una copia de seguridad de `C:\Users\alfon\Desktop\Pizzeria`.
2. Descomprime este ZIP en otra carpeta y copia su **contenido**, no la carpeta que lo contiene, a la carpeta `Pizzeria` del escritorio. Mantén la carpeta `.git` sin tocar.
3. Elimina de tu carpeta `Pizzeria` solo los ficheros antiguos que se enumeran en «Qué se ha eliminado» (si siguen allí). La carpeta `assets/alergenos/` debe conservar sus 3 iconos actuales y puedes borrar el resto de SVG no usados.
4. En PowerShell dentro de `Pizzeria`:

   ```powershell
   git status
   git add -A
   git commit -m "Unificar web Rustica y corregir PDFs y movil"
   git fetch origin
   git status
   ```

   Si Git indica que tu rama también está por detrás del remoto, primero resuelve la sincronización sin sobrescribir tu versión. Si no lo está: `git push origin main`.

## Edición y pruebas

- Para actualizar pizzas y precios: editar `carta.json` (19 pizzas, incluidas Pulled BBQ y Full Cheese, ambas a 13 €).
- Para incorporar fotos reales: cambiar `imagen: null` por una ruta real en `assets/`.
- Para actualizar las reseñas seleccionadas: editar `resenas.json`. No se sincronizan automáticamente con Google.
- Para visualizar localmente, abrir terminal en esta carpeta y ejecutar `python -m http.server 8000`; navegar a `http://localhost:8000`. No usar `file://` porque la web carga JSON con `fetch`.
- La información sobre alérgenos requiere validación con las fichas técnicas y posibles trazas antes de considerarse definitiva. Un queso sin lactosa **sigue conteniendo el alérgeno leche**.

**Nota:** No se ha cambiado el texto de la web ni los precios respecto al ZIP aportado. Se ha corregido el PDF de Novedades duplicado y la disposición de la sección de masa en móvil.
