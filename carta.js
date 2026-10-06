/* =========================================================
   RÚSTICA — CARTA.JS
   Carta completa desde carta.json + animaciones
   ========================================================= */

const CARTA_URL = "carta.json";
const LOGO_PLACEHOLDER = "assets/logorustica.png";

let cartaData = null;
let filtroActivo = "all";


const ALERGENOS = {
  gluten: {
    nombre: "Gluten",
    icono: "assets/alergenos/gluten.svg"
  },
  crustaceo: {
    nombre: "Crustáceos",
    icono: "assets/alergenos/crustaceo.svg"
  },
  huevo: {
    nombre: "Huevo",
    icono: "assets/alergenos/huevo.svg"
  },
  pescado: {
    nombre: "Pescado",
    icono: "assets/alergenos/pescado.svg"
  },
  cacahuete: {
    nombre: "Cacahuete",
    icono: "assets/alergenos/cacahuete.svg"
  },
  soja: {
    nombre: "Soja",
    icono: "assets/alergenos/soja.svg"
  },
  lacteo: {
    nombre: "Lácteos",
    icono: "assets/alergenos/lacteo.svg"
  },
  "frutos-secos": {
    nombre: "Frutos secos",
    icono: "assets/alergenos/frutos secos.svg"
  },
  apio: {
    nombre: "Apio",
    icono: "assets/alergenos/apio.svg"
  },
  mostaza: {
    nombre: "Mostaza",
    icono: "assets/alergenos/mostaza.svg"
  },
  sesamo: {
    nombre: "Sésamo",
    icono: "assets/alergenos/sesamo.svg"
  },
  sulfitos: {
    nombre: "Sulfitos",
    icono: "assets/alergenos/sulfitos.svg"
  },
  altramuces: {
    nombre: "Altramuces",
    icono: "assets/alergenos/altramuces.svg"
  },
  moluscos: {
    nombre: "Moluscos",
    icono: "assets/alergenos/moluscos.svg"
  }
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

  return lista
    .map((codigo) => {
      const alergeno = ALERGENOS[codigo];
      if (!alergeno) return "";

      return `
        <span
          class="allergen-icon"
          title="${escapeHTML(alergeno.nombre)}"
          aria-label="${escapeHTML(alergeno.nombre)}"
        >
          <img
            src="${escapeHTML(alergeno.icono)}"
            alt=""
            aria-hidden="true"
            loading="lazy"
          >
        </span>
      `;
    })
    .join("");
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

        <strong class="pizza-price">
          ${formatoEuro(pizza.precio)}
        </strong>

        <div
          class="allergens"
          aria-label="Alérgenos"
        >
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
        class="${index === 0 ? "selected" : ""}"
        data-filter="${escapeHTML(categoria.id)}"
        aria-selected="${index === 0 ? "true" : "false"}"
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
        item.setAttribute("aria-selected", String(activo));
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

    menuButton.setAttribute(
      "aria-expanded",
      String(abierto)
    );
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
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
