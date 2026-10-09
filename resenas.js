/* Rústica V4 — reseñas seleccionadas. No consulta ni sincroniza Google en tiempo real. */
(() => {
  'use strict';
  const track = document.getElementById('reviews-track');
  const controls = document.getElementById('reviews-controls');
  if (!track || !controls) return;
  const prev = document.getElementById('reviews-prev');
  const next = document.getElementById('reviews-next');
  const toggle = document.getElementById('reviews-toggle');
  const pagination = document.getElementById('reviews-pagination');
  const carousel = document.getElementById('reviews-carousel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intervalMs = 6500;
  let reviews = [];
  let active = 0;
  let timer = null;
  let manualPause = reduceMotion.matches;
  let hoverPause = false;
  let focusPause = false;
  let inViewport = true;

  function visibleCount() {
    return window.matchMedia('(max-width: 620px)').matches ? 1 :
      window.matchMedia('(max-width: 1100px)').matches ? 2 : 3;
  }
  function safeText(element, text) { element.textContent = String(text); }
  function makeCard(review) {
    const card = document.createElement('article');
    card.className = 'review-card review-testimonial';
    const stars = document.createElement('span');
    stars.className = 'review-stars';
    stars.setAttribute('aria-label', `${review.estrellas} de 5 estrellas`);
    safeText(stars, '★'.repeat(review.estrellas));
    const quote = document.createElement('p');
    safeText(quote, `“${review.texto}”`);
    const author = document.createElement('div');
    author.className = 'review-author';
    const avatar = document.createElement('span');
    avatar.className = 'review-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    safeText(avatar, review.autor.charAt(0).toUpperCase());
    const info = document.createElement('span');
    const name = document.createElement('strong');
    safeText(name, review.autor);
    const source = document.createElement('small');
    safeText(source, review.fragmento ? 'Reseña en Google · extracto' : 'Reseña en Google');
    info.append(name, source);
    author.append(avatar, info);
    card.append(stars, quote, author);
    return card;
  }
  function render() {
    const count = Math.min(visibleCount(), reviews.length);
    const frag = document.createDocumentFragment();
    for (let i=0; i<count; i++) frag.append(makeCard(reviews[(active+i)%reviews.length]));
    track.replaceChildren(frag);
    const start = active + 1;
    const end = (active + count - 1) % reviews.length + 1;
    safeText(pagination, count === 1 ? `${start} de ${reviews.length}` : `${start}–${end} de ${reviews.length}`);
  }
  function stop() { if (timer !== null) { clearInterval(timer); timer = null; } }
  function start() {
    stop();
    if (!manualPause && !hoverPause && !focusPause && !document.hidden && inViewport && reviews.length > 1 && !reduceMotion.matches) {
      timer = setInterval(() => { active = (active + 1) % reviews.length; render(); }, intervalMs);
    }
  }
  function syncToggle() {
    safeText(toggle, manualPause ? '▶' : 'Ⅱ');
    toggle.setAttribute('aria-label', manualPause ? 'Reanudar rotación de reseñas' : 'Pausar rotación de reseñas');
    toggle.title = manualPause ? 'Reanudar rotación' : 'Pausar rotación';
  }
  function advance(direction) {
    if (!reviews.length) return;
    active = (active + direction + reviews.length) % reviews.length;
    render();
    start();
  }
  prev.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance(1));
  toggle.addEventListener('click', () => { manualPause = !manualPause; syncToggle(); start(); });
  carousel.addEventListener('mouseenter', () => { hoverPause = true; stop(); });
  carousel.addEventListener('mouseleave', () => { hoverPause = false; start(); });
  carousel.addEventListener('focusin', () => { focusPause = true; stop(); });
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) { focusPause = false; start(); }
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); advance(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  document.addEventListener('visibilitychange', start);
  if ('IntersectionObserver' in window) {
    const viewportObserver = new IntersectionObserver((entries) => {
      inViewport = entries[0].isIntersecting;
      start();
    }, {threshold: 0.1});
    viewportObserver.observe(carousel);
  }
  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) manualPause = true;
    syncToggle(); start();
  });
  window.addEventListener('resize', () => {
    if (!reviews.length) return;
    render(); start();
  }, {passive:true});

  fetch('resenas.json')
    .then(r => { if (!r.ok) throw new Error('Reseñas no disponibles'); return r.json(); })
    .then(data => {
      reviews = data.resenas.filter(r => r && typeof r.autor === 'string' &&
        typeof r.texto === 'string' && Number.isInteger(r.estrellas) && r.estrellas >= 1 && r.estrellas <= 5);
      if (reviews.length < 2) return;
      controls.hidden = false;
      render(); syncToggle(); start();
    })
    .catch(() => {
      // Las tres primeras opiniones del HTML permanecen visibles sin conexión a JSON.
      controls.hidden = true;
    });
})();
