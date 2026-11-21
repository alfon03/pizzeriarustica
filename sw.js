/* RÚSTICA — Service Worker (para GitHub Pages y dominio propio)
   Cambia VERSION tras publicar modificaciones de contenido y recursos.
   La web y los datos de la carta se precargan para poder consultarlos sin Internet.
   Los PDFs se guardan sólo después de abrirlos online (son archivos grandes).
*/
const VERSION = '2026-11-21-v1';
const PREFIX = 'rustica-pwa-';
const SHELL_CACHE = `${PREFIX}shell-${VERSION}`;
const DATA_CACHE = `${PREFIX}datos-${VERSION}`;
const DOCUMENT_CACHE = `${PREFIX}pdf-${VERSION}`;
const CORE_FILES = [
  "./",
  "./index.html",
  "./carta.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/js/carta.js",
  "./assets/js/pwa.js",
  "./assets/js/resenas.js",
  "./assets/js/script.js",
  "./assets/data/carta.json",
  "./assets/data/resenas.json",
  "./assets/images/brush-green-cta.png",
  "./assets/images/brush-orange-hero.png",
  "./assets/images/brush-orange-location.png",
  "./assets/images/brush-orange-small.png",
  "./assets/images/brush-orange-tab.png",
  "./assets/images/brush-orange-wide.png",
  "./assets/images/green-texture.jpg",
  "./assets/images/hero-pizza.jpg",
  "./assets/images/italy-brush.png",
  "./assets/images/leaf-cream-bottom-left.png",
  "./assets/images/leaf-cream-bottom-right.png",
  "./assets/images/leaf-cream-top-right.png",
  "./assets/images/leaf-decor-left.png",
  "./assets/images/leaf-hero-bottom-left.png",
  "./assets/images/logorustica.png",
  "./assets/images/masa-dough.jpg",
  "./assets/images/paper-stroke.png",
  "./assets/images/paper-texture.jpg",
  "./assets/images/pizza-leaf-gold.png",
  "./assets/icons/alergenos/gluten.svg",
  "./assets/icons/alergenos/lacteo.svg",
  "./assets/icons/alergenos/pescado.svg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-16x16.png",
  "./assets/icons/favicon-32x32.png",
  "./assets/icons/favicon-512.png",
  "./assets/icons/pwa-192.png",
  "./assets/icons/pwa-maskable-512.png",
  "./assets/icons/ui-icons.svg",
  "./favicon.ico"
];

const localURL = (path) => new URL(path, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(CORE_FILES.map(localURL));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) &&
      ![SHELL_CACHE, DATA_CACHE, DOCUMENT_CACHE].includes(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function saveResponse(cacheName, request, response) {
  if (response && response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName, fallback) {
  try {
    const response = await fetch(request);
    return saveResponse(cacheName, request, response);
  } catch (_error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (fallback) {
      const fallbackResponse = await caches.match(localURL(fallback));
      if (fallbackResponse) return fallbackResponse;
    }
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  return networkFirst(request, SHELL_CACHE);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin ||
      !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  if (request.mode === 'navigate') {
    const fallback = url.pathname.endsWith('/carta.html') ? './carta.html' :
      (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) ? './index.html' :
        './offline.html';
    event.respondWith(networkFirst(request, SHELL_CACHE, fallback));
    return;
  }

  if (url.pathname.includes('/assets/data/')) {
    // Se consultan las novedades en Internet y, sin conexión, la copia guardada.
    event.respondWith(networkFirst(request, DATA_CACHE));
  } else if (url.pathname.includes('/documentos/') && url.pathname.endsWith('.pdf')) {
    // Evita precargar PDFs grandes, pero permite abrirlos offline después de consultarlos.
    event.respondWith(networkFirst(request, DOCUMENT_CACHE));
  } else {
    event.respondWith(cacheFirst(request));
  }
});
