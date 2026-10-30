/* =========================================================
   RÚSTICA — CARTA.JS
   Carta completa desde carta.json + animaciones
   ========================================================= */

const CARTA_URL = "carta.json";
const LOGO_PLACEHOLDER = "assets/logorustica.png";

let cartaData = null;
let filtroActivo = "all";


const ALERGENOS = {
  gluten: { nombre: "Gluten", icono: "assets/alergenos/gluten.svg" },
  lacteo: { nombre: "Leche", icono: "assets/alergenos/lacteo.svg" },
  pescado: { nombre: "Pescado", icono: "assets/alergenos/pescado.svg" }
};


const escapeHTML = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");


const formatoEuro = (precio) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(precio) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(precio);


function pizzaPerteneceA(pizza, filtro) {
  if (filtro === "all") return true;

  return (
    pizza.categoria === filtro ||
    (pizza.etiquetas || []).includes(filtro)
  );
}


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


function crearPizzaCard(pizza, index) {
  const ingredientes = Array.isArray(pizza.ingredientes)
    ? pizza.ingredientes.map(escapeHTML).join(", ")
    : "";

  return `
    <article
      class="pizza-card carta-card-animate"
      style="--card-delay: ${index * 55}ms"
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


function renderTabs(categorias = []) {
  const tabs = document.querySelector("#carta-tabs");
  if (!tabs) return;

  const botones = [
    { id: "all", nombre: "TODAS" },
    ...categorias
  ];

  tabs.innerHTML = botones
    .map((categoria, index) => `
      <button
        type="button"
        class="${categoria.id === filtroActivo ? "selected" : ""}"
        data-filter="${escapeHTML(categoria.id)}"
        aria-pressed="${categoria.id === filtroActivo ? "true" : "false"}"
      >
        ${escapeHTML(categoria.nombre)}
      </button>
    `)
    .join("");

  tabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const nuevoFiltro = button.dataset.filter;

      if (nuevoFiltro === filtroActivo) return;

      filtroActivo = nuevoFiltro;

      tabs.querySelectorAll("button").forEach((item) => {
        const activo = item.dataset.filter === filtroActivo;
        item.classList.toggle("selected", activo);
        item.setAttribute("aria-pressed", String(activo));
      });

      animarCambioFiltro();
    });
  });
}


function animarCambioFiltro() {
  const grid = document.querySelector("#carta-pizza-grid");
  if (!grid) return;

  grid.classList.add("is-filtering");

  setTimeout(() => {
    renderPizzas();
    requestAnimationFrame(() => {
      grid.classList.remove("is-filtering");
      activarAnimacionTarjetas();
    });
  }, 150);
}


function renderPizzas() {
  const grid = document.querySelector("#carta-pizza-grid");
  if (!grid || !cartaData) return;

  const pizzas = cartaData.pizzas.filter((pizza) =>
    pizzaPerteneceA(pizza, filtroActivo)
  );

  grid.innerHTML = pizzas
    .map((pizza, index) => crearPizzaCard(pizza, index))
    .join("");

  grid.setAttribute("aria-busy", "false");
}


function activarAnimacionTarjetas() {
  document
    .querySelectorAll(".carta-card-animate")
    .forEach((card) => {
      card.classList.remove("is-visible");

      requestAnimationFrame(() => {
        card.classList.add("is-visible");
      });
    });
}


function renderBebidas() {
  const contenedor = document.querySelector("#bebidas-list");
  if (!contenedor || !cartaData) return;

  contenedor.innerHTML = cartaData.bebidas
    .map((bebida, index) => `
      <div
        class="menu-row menu-row-animate"
        style="--row-delay: ${index * 45}ms"
      >
        <span>${escapeHTML(bebida.nombre)}</span>
        <strong>${formatoEuro(bebida.precio)}</strong>
      </div>
    `)
    .join("");
}


function renderPostres() {
  const tarros = document.querySelector("#postres-tarros");
  const porciones = document.querySelector("#postres-porciones");

  if (!cartaData || !tarros || !porciones) return;

  const precio = formatoEuro(cartaData.postres.precio);

  tarros.innerHTML = cartaData.postres.tarros
    .map((nombre, index) => `
      <div
        class="menu-row menu-row-animate"
        style="--row-delay: ${index * 40}ms"
      >
        <span>${escapeHTML(nombre)}</span>
        <strong>${precio}</strong>
      </div>
    `)
    .join("");

  porciones.innerHTML = cartaData.postres.porciones
    .map((nombre, index) => `
      <div
        class="menu-row menu-row-animate"
        style="--row-delay: ${index * 40}ms"
      >
        <span>${escapeHTML(nombre)}</span>
        <strong>${precio}</strong>
      </div>
    `)
    .join("");
}


function renderLeyendaAlergenos() {
  const contenedor = document.querySelector("#allergen-legend");
  if (!contenedor || !cartaData) return;

  const usados = [
    ...new Set(
      cartaData.pizzas.flatMap(
        (pizza) => pizza.alergenos || []
      )
    )
  ];

  contenedor.innerHTML = usados
    .map((codigo, index) => {
      const alergeno = ALERGENOS[codigo];
      if (!alergeno) return "";

      return `
        <div
          class="allergen-legend-item allergen-animate"
          style="--allergen-delay: ${index * 60}ms"
        >
          <span class="allergen-icon">
            <img
              src="${escapeHTML(alergeno.icono)}"
              alt=""
              aria-hidden="true"
            >
          </span>

          <span>${escapeHTML(alergeno.nombre)}</span>
        </div>
      `;
    })
    .join("");
}


function inicializarMenuMovil() {
  const menuButton = document.querySelector(".hamb");
  const mainNav = document.querySelector("#main-nav");

  if (!menuButton || !mainNav) return;

  menuButton.addEventListener("click", () => {
    const abierto = mainNav.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(abierto));
    menuButton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
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


function inicializarReveal() {
  const elementos = document.querySelectorAll(
    ".reveal-on-scroll"
  );

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    elementos.forEach((elemento) =>
      elemento.classList.add("is-revealed")
    );
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elementos.forEach((elemento) =>
    observer.observe(elemento)
  );
}


async function cargarCartaCompleta() {
  try {
    const response = await fetch(CARTA_URL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    cartaData = await response.json();

    // Permite abrir una categoría desde un enlace externo o desde la portada.
    const categoriaSolicitada = new URLSearchParams(window.location.search).get('categoria');
    const disponibles = new Set((cartaData.categorias || []).map(item => item.id));
    filtroActivo = categoriaSolicitada && disponibles.has(categoriaSolicitada) ? categoriaSolicitada : 'all';
    renderTabs(cartaData.categorias || []);
    renderPizzas();
    renderBebidas();
    renderPostres();
    renderLeyendaAlergenos();

    requestAnimationFrame(() => {
      activarAnimacionTarjetas();

      document
        .querySelectorAll(
          ".menu-row-animate, .allergen-animate"
        )
        .forEach((elemento) => {
          elemento.classList.add("is-visible");
        });
    });
  } catch (error) {
    console.error(
      "No se ha podido cargar carta.json:",
      error
    );

    const grid = document.querySelector("#carta-pizza-grid");

    if (grid) {
      grid.innerHTML = `
        <p class="menu-load-error">
          No se ha podido cargar la carta.
        </p>
      `;
    }
  }
}


document.addEventListener(
  "DOMContentLoaded",
  () => {
    inicializarMenuMovil();
    inicializarReveal();
    cargarCartaCompleta();
  }
);
