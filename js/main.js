document.addEventListener("DOMContentLoaded", () => {
  /* Carrusel principal */
  const images = [...document.querySelectorAll(".hero-carousel > img")];
  let current = 0;

  function updateCarousel() {
    if (!images.length) return;

    images.forEach((image, index) => {
      image.classList.remove("active", "prev", "next", "rear");
      const position = (index - current + images.length) % images.length;

      if (position === 0) image.classList.add("active");
      else if (position === 1) image.classList.add("next");
      else if (position === 2) image.classList.add("rear");
      else image.classList.add("prev");
    });
  }

  if (images.length) {
    updateCarousel();

    if (images.length > 1) {
      window.setInterval(() => {
        current = (current + 1) % images.length;
        updateCarousel();
      }, 5000);
    }
  }

  /* Menú responsive */
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
      menu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* Estado de la cabecera */
  const nav = document.querySelector(".site-nav");

  function updateNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  /* Año del pie de página */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

