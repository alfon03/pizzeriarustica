/* Registra la PWA: sólo se activa por HTTPS o localhost. */
(() => {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .catch((error) => {
        console.warn('La instalación sin conexión no está disponible:', error);
      });
  });
})();
