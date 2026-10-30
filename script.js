/* =========================================================
   RÚSTICA — HOME / MENU.JS
   Carga carta.json, pinta categorías y muestra máximo 5 pizzas.
   ========================================================= */

const CARTA_URL = "carta.json";
const MAX_PIZZAS_HOME = 5;
const LOGO_PLACEHOLDER = "assets/logorustica.png";

let cartaData = null;
let filtroActivo = "all";


/* =========================================================
   ALÉRGENOS
   ========================================================= */

const ALERGENOS = {
  gluten: { nombre: "Gluten", icono: "assets/alergenos/gluten.svg" },
  lacteo: { nombre: "Leche", icono: "assets/alergenos/lacteo.svg" },
  pescado: { nombre: "Pescado", icono: "assets/alergenos/pescado.svg" }
};


/* =========================================================
   UTILIDADES
   ========================================================= */

const formatoEuro = (precio) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(precio) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(precio);


const escapeHTML = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");


function pizzaPerteneceA(pizza, filtro) {
  if (filtro === "all") {
    return true;
  }

  return (
    pizza.categoria === filtro ||
    (pizza.etiquetas || []).includes(filtro)
  );
}


/* =========================================================
   ALÉRGENOS
   ========================================================= */

function crearAlergenos(lista = []) {
  if (!Array.isArray(lista) || !lista.length) return "";

  const alergenos = lista.map(codigo => ALERGENOS[codigo]).filter(Boolean);
  if (!alergenos.length) return "";

  return `<div class="pizza-allergens" aria-label="Alérgenos: ${escapeHTML(alergenos.map(a => a.nombre).join(', '))}">
    ${alergenos.map(alergeno => `<span class="allergen-tag" title="Contiene ${escapeHTML(alergeno.nombre.toLowerCase())}">
      <img src="${escapeHTML(alergeno.icono)}" alt="" aria-hidden="true" loading="lazy" width="22" height="22">
      <span>${escapeHTML(alergeno.nombre)}</span>
    </span>`).join("")}
  </div>`;
}


/* =========================================================
   TARJETA DE PIZZA
   ========================================================= */

function crearMediaPizza(pizza) {
  if (pizza.imagen) {
    return `
      <img
        src="${escapeHTML(pizza.imagen)}"
        alt="Pizza ${escapeHTML(pizza.nombre)}"
        loading="lazy"
      >
    `;
  }

  return `
    <div
      class="pizza-placeholder"
      role="img"
      aria-label="Fotografía de ${escapeHTML(pizza.nombre)} próximamente"
    >
      <img
        src="${LOGO_PLACEHOLDER}"
        alt=""
        aria-hidden="true"
      >
    </div>
  `;
}


function crearPizzaCard(pizza) {
  const ingredientes = Array.isArray(pizza.ingredientes)
    ? pizza.ingredientes.map(escapeHTML).join(", ")
    : "";

  return `
    <article
      class="pizza-card is-visible"
      data-pizza-id="${escapeHTML(pizza.id)}"
    >
      ${crearMediaPizza(pizza)}

      <div class="pizza-card-body">
        <h3>${escapeHTML(pizza.nombre.toUpperCase())}</h3>

        <p>${ingredientes}.</p>

        <div class="pizza-card-bottom">
          <strong class="pizza-price">${formatoEuro(pizza.precio)}</strong>
          ${crearAlergenos(pizza.alergenos)}
        </div>
      </div>
    </article>
  `;
}


/* =========================================================
   CATEGORÍAS
   ========================================================= */

function renderTabs(categorias = []) {
  const tabs = document.querySelector("#pizza-tabs");

  if (!tabs) return;

  const botones = [
    {
      id: "all",
      nombre: "TODAS"
    },
    ...categorias
  ];

  tabs.innerHTML = botones
    .map((categoria, index) => `
      <button
        type="button"
        class="${index === 0 ? "selected" : ""}"
        data-filter="${escapeHTML(categoria.id)}"
        aria-pressed="${index === 0 ? "true" : "false"}"
      >
        ${escapeHTML(categoria.nombre)}
      </button>
    `)
    .join("");

  tabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      seleccionarFiltro(button.dataset.filter);
    });
  });
}


function seleccionarFiltro(filtro) {
  filtroActivo = filtro;

  document
    .querySelectorAll("#pizza-tabs button")
    .forEach((button) => {
      const activo = button.dataset.filter === filtro;

      button.classList.toggle("selected", activo);
      button.setAttribute("aria-pressed", String(activo));
    });

  renderPizzasHome();
}


/* =========================================================
   PIZZAS HOME
   ========================================================= */

function obtenerPizzasHome() {
  if (!cartaData) {
    return [];
  }

  if (filtroActivo === "all") {
    const destacadas = cartaData.pizzas.filter(
      (pizza) => pizza.destacada
    );

    if (destacadas.length) {
      return destacadas.slice(0, MAX_PIZZAS_HOME);
    }
  }

  return cartaData.pizzas
    .filter((pizza) =>
      pizzaPerteneceA(pizza, filtroActivo)
    )
    .slice(0, MAX_PIZZAS_HOME);
}


function renderPizzasHome() {
  const grid = document.querySelector("#pizza-grid");

  if (!grid) return;

  const pizzas = obtenerPizzasHome();

  if (!pizzas.length) {
    grid.innerHTML = `
      <p class="menu-load-error">
        No hay pizzas en esta categoría.
      </p>
    `;

    grid.setAttribute("aria-busy", "false");
    return;
  }

  grid.innerHTML = pizzas
    .map(crearPizzaCard)
    .join("");

  grid.setAttribute("aria-busy", "false");
}


/* =========================================================
   NOVEDADES EN PORTADA — MISMO carta.json
   ========================================================= */
function renderNovedades() {
  const contenedor = document.querySelector('#novedades-grid');
  if (!contenedor || !cartaData) return;

  const novedades = cartaData.pizzas.filter(pizza => pizza.categoria === 'novedades');
  contenedor.innerHTML = novedades.length ? novedades.map(pizza => {
    const ingredientes = Array.isArray(pizza.ingredientes)
      ? pizza.ingredientes.map(escapeHTML).join(', ')
      : '';
    return `<article class="novedad-card">
      <div class="novedad-card-top"><span class="novedad-label">NUEVA EN RÚSTICA</span><strong class="novedad-price">${formatoEuro(pizza.precio)}</strong></div>
      <h3>${escapeHTML(pizza.nombre)}</h3>
      <p>${ingredientes}.</p>
      ${crearAlergenos(pizza.alergenos)}
    </article>`;
  }).join('') : '<p class="menu-empty">Próximamente tendremos nuevas sugerencias.</p>';
  contenedor.setAttribute('aria-busy', 'false');
}


/* =========================================================
   CARGAR JSON
   ========================================================= */

async function cargarCarta() {
  const grid = document.querySelector("#pizza-grid");

  try {
    const response = await fetch(CARTA_URL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.pizzas)) {
      throw new Error(
        "carta.json no contiene una lista de pizzas válida."
      );
    }

    cartaData = data;

    renderTabs(data.categorias || []);
    renderPizzasHome();
    renderNovedades();
  } catch (error) {
    console.error("Error cargando carta.json:", error);

    if (grid) {
      grid.setAttribute("aria-busy", "false");
      grid.innerHTML = `
        <p class="menu-load-error">
          No se ha podido cargar la carta.
        </p>
      `;
    }
    const novedadesGrid = document.querySelector('#novedades-grid');
    if (novedadesGrid) {
      novedadesGrid.setAttribute('aria-busy', 'false');
      novedadesGrid.innerHTML = '<p class="menu-load-error">Ahora mismo no podemos mostrar las novedades. Llámanos para consultarlas.</p>';
    }
  }
}


/* =========================================================
   MENÚ MÓVIL
   ========================================================= */

function inicializarMenuMovil() {
  const menuButton = document.querySelector(".hamb");
  const mainNav = document.querySelector("#main-nav");

  if (!menuButton || !mainNav) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const abierto = mainNav.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(abierto));
    menuButton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });

  mainNav
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );
        menuButton.setAttribute("aria-label", "Abrir menú");
      });
    });

  // Cierra con Escape o al pulsar fuera del menú.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
      menuButton.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!mainNav.contains(event.target) && !menuButton.contains(event.target)) {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
    }
  });

}


/* =========================================================
   NAVEGACIÓN ACTIVA
   ========================================================= */

function inicializarNavActivo() {
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = document.querySelectorAll("main section[id]");

  if (!navLinks.length || !sections.length) {
    return;
  }

  const updateActiveLink = () => {
    let current = "inicio";

    sections.forEach((section) => {
      const top = section.offsetTop - 130;

      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  window.addEventListener(
    "scroll",
    updateActiveLink,
    { passive: true }
  );

  updateActiveLink();
}


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    inicializarMenuMovil();
    inicializarNavActivo();
    cargarCarta();
  }
);
