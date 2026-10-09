/* RÚSTICA 2.0 · Componentes compartidos entre inicio y carta.
   Los productos y precios se editan solamente en carta.json. */
(() => {
  'use strict';

  const isHome = document.body.dataset.page === 'home';
  const grid = document.getElementById(isHome ? 'pizza-grid' : 'carta-pizza-grid');
  const filters = document.getElementById(isHome ? 'pizza-tabs' : 'carta-tabs');
  const euros = (price) => new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2
  }).format(price);
  let menuData = null;
  let category = 'all';

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  function initializeMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
    document.addEventListener('click', (event) => {
      if (!toggle.contains(event.target) && !nav.contains(event.target)) close();
    });
  }

  const categoryLabel = (id) => ({
    'tradicionales': 'LAS DE SIEMPRE',
    'base-crema': 'BASE CREMA',
    'especiales': 'ESPECIALES'
  }[id] || 'PIZZA RÚSTICA');

  function pizzaCard(pizza, index) {
    const name = escapeHTML(pizza.nombre);
    const ingredients = Array.isArray(pizza.ingredientes) ? pizza.ingredientes.map(escapeHTML).join(' · ') : '';
    const type = ['tradicionales', 'base-crema', 'especiales'].includes(pizza.categoria) ? pizza.categoria : 'tradicionales';
    return `<article class="pizza-card pizza-${type}">
      <div class="pizza-card-top"><span class="pizza-card-type">${categoryLabel(type)}</span><span class="pizza-card-number">${String(index + 1).padStart(2, '0')}</span></div>
      <div class="pizza-card-emblem" aria-hidden="true"><span>R</span><i>✳</i></div>
      <div class="pizza-card-content">
        <h3>${name}</h3><p>${ingredients}</p>
        <div class="pizza-card-bottom"><strong>${euros(pizza.precio)}</strong><span class="pizza-card-arrow" aria-hidden="true">↗</span></div>
      </div>
    </article>`;
  }

  function pizzasToShow() {
    const matches = menuData.pizzas.filter((pizza) => category === 'all' || pizza.categoria === category);
    if (!isHome) return matches;
    if (category !== 'all') return matches.slice(0, 6);
    const featured = matches.filter((pizza) => pizza.destacada);
    return (featured.length ? featured : matches).slice(0, 6);
  }

  function renderPizzas() {
    if (!grid || !menuData) return;
    const list = pizzasToShow();
    grid.innerHTML = list.length
      ? list.map(pizzaCard).join('')
      : '<p class="menu-empty">No hay pizzas disponibles en esta categoría.</p>';
    grid.setAttribute('aria-busy', 'false');
    const count = document.getElementById('pizza-count');
    if (count) count.textContent = `${list.length} ${list.length === 1 ? 'PIZZA' : 'PIZZAS'}`;
  }

  function renderFilters() {
    if (!filters || !menuData) return;
    const categories = [{ id: 'all', nombre: 'Todas' }, ...menuData.categorias];
    filters.innerHTML = categories.map(({ id, nombre }) => `<button type="button" data-category="${escapeHTML(id)}" aria-pressed="${id === category}" class="${id === category ? 'is-selected' : ''}">${escapeHTML(nombre)}</button>`).join('');
    filters.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-category]');
      if (!button || !filters.contains(button)) return;
      category = button.dataset.category;
      filters.querySelectorAll('button').forEach((item) => {
        const active = item.dataset.category === category;
        item.classList.toggle('is-selected', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderPizzas();
    });
  }

  function renderExtras() {
    if (!menuData || isHome) return;
    const drinks = document.getElementById('bebidas-list');
    const jars = document.getElementById('postres-tarros');
    const slices = document.getElementById('postres-porciones');
    if (drinks) drinks.innerHTML = menuData.bebidas.map(({ nombre, precio }) => `<div class="extra-row"><span>${escapeHTML(nombre)}</span><strong>${euros(precio)}</strong></div>`).join('');
    const dessertPrice = euros(menuData.postres.precio);
    if (jars) jars.innerHTML = menuData.postres.tarros.map((name) => `<div class="extra-row"><span>${escapeHTML(name)}</span><strong>${dessertPrice}</strong></div>`).join('');
    if (slices) slices.innerHTML = menuData.postres.porciones.map((name) => `<div class="extra-row"><span>${escapeHTML(name)}</span><strong>${dessertPrice}</strong></div>`).join('');
  }

  function showMenuError() {
    if (grid) {
      grid.setAttribute('aria-busy', 'false');
      grid.innerHTML = `<p class="menu-empty">Ahora mismo no podemos mostrar la carta. <a href="tel:+34603678738">Llámanos al 603 67 87 38</a> y te ayudamos.</p>`;
    }
    if (filters) filters.innerHTML = '';
    document.querySelectorAll('.extra-list .menu-loading').forEach((item) => {
      item.textContent = 'Consulta disponibilidad y precios por teléfono.';
    });
  }

  async function loadMenu() {
    if (!grid) return;
    try {
      const response = await fetch('carta.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.pizzas) || !Array.isArray(data.categorias) || !Array.isArray(data.bebidas) || !data.postres) {
        throw new Error('carta.json tiene un formato inesperado');
      }
      menuData = data;
      renderFilters();
      renderPizzas();
      renderExtras();
    } catch (error) {
      console.error('No se pudo cargar la carta:', error);
      showMenuError();
    }
  }

  initializeMobileMenu();
  loadMenu();
})();
