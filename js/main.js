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
  const hero = document.querySelector(".hero");
  const scrollCue = document.querySelector(".scroll-cue");
  const heroTitle = document.querySelector(".hero-title-wrap");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
    if (scrollCue) scrollCue.classList.toggle("is-hidden", window.scrollY > 60);
    if (hero && !reducedMotion) {
      const offset = `${-Math.min(window.scrollY, 360) * 0.075}px`;
      hero.style.setProperty("--hero-scroll", offset);
    }
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  /* Rastro de luz que sigue al cursor sobre el titular */
  if (heroTitle && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
    let targetX = 50;
    let targetY = 50;
    let lightX = targetX;
    let lightY = targetY;
    let lightFrame = 0;

    function moveLight() {
      lightX += (targetX - lightX) * 0.18;
      lightY += (targetY - lightY) * 0.18;
      heroTitle.style.setProperty("--light-x", `${lightX}%`);
      heroTitle.style.setProperty("--light-y", `${lightY}%`);

      if (Math.abs(targetX - lightX) > 0.15 || Math.abs(targetY - lightY) > 0.15) {
        lightFrame = window.requestAnimationFrame(moveLight);
      } else {
        lightFrame = 0;
      }
    }

    heroTitle.addEventListener("pointerenter", event => {
      const bounds = heroTitle.getBoundingClientRect();
      targetX = lightX = ((event.clientX - bounds.left) / bounds.width) * 100;
      targetY = lightY = ((event.clientY - bounds.top) / bounds.height) * 100;
      heroTitle.style.setProperty("--light-x", `${lightX}%`);
      heroTitle.style.setProperty("--light-y", `${lightY}%`);
      heroTitle.classList.add("is-lit");
    });

    heroTitle.addEventListener("pointermove", event => {
      const bounds = heroTitle.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width) * 100;
      targetY = ((event.clientY - bounds.top) / bounds.height) * 100;
      if (!lightFrame) lightFrame = window.requestAnimationFrame(moveLight);
    });

    heroTitle.addEventListener("pointerleave", () => {
      heroTitle.classList.remove("is-lit");
      if (lightFrame) window.cancelAnimationFrame(lightFrame);
      lightFrame = 0;
    });
  }

  /* Formulario contextual por servicio y envío por WhatsApp */
  const serviceOptions = {
    soporte: {
      title: "Soporte técnico",
      question: "¿Con qué necesitas ayuda?",
      options: [
        "Computadoras de escritorio", "Laptops", "Mantenimiento preventivo",
        "Reparación y diagnóstico", "Windows y controladores",
        "Microsoft Office / Microsoft 365", "Virus y seguridad informática",
        "Redes, Wi-Fi e impresoras", "Recuperación y respaldo de datos",
        "Instalación y configuración de software"
      ],
      other: "Otro problema técnico (especificar)"
    },
    venta: {
      title: "Venta de tecnología",
      question: "¿Qué equipos o productos buscas?",
      options: [
        "Computadoras de escritorio", "Laptops empresariales",
        "Workstations para diseño e ingeniería", "Servidores", "Monitores y pantallas",
        "Impresoras y escáneres", "Teclados, mouse y periféricos",
        "Discos, SSD y almacenamiento", "Componentes y repuestos",
        "Licencias de software", "Accesorios de conectividad",
        "Asesoría para equipamiento empresarial"
      ],
      other: "Otro producto (especificar)"
    },
    alquiler: {
      title: "Alquiler de equipos",
      question: "¿Qué equipos necesitas alquilar?",
      options: [
        "Laptops", "Computadoras de escritorio", "Workstations", "Monitores",
        "Impresoras", "Proyectores y pantallas", "Servidores y almacenamiento",
        "Equipos para capacitaciones", "Equipos para eventos",
        "Equipamiento temporal para oficinas", "Alquiler de equipos por proyecto",
        "Soporte técnico durante el alquiler"
      ],
      other: "Otro equipo o necesidad (especificar)"
    },
    desarrollo: {
      title: "Desarrollo de software",
      question: "¿Qué solución digital necesitas?",
      options: [
        "Páginas web corporativas", "Tiendas virtuales",
        "Sistemas de gestión empresarial", "Sistemas de inventario y ventas",
        "Aplicaciones web", "Aplicaciones móviles", "Automatización de procesos",
        "Sistemas de reservas y atención", "Dashboards e inteligencia de negocios",
        "Integración de sistemas y API", "Mantenimiento y mejora de software",
        "Desarrollo de una solución a medida"
      ],
      other: "Otra solución digital (especificar)"
    },
    infraestructura: {
      title: "Infraestructura y redes",
      question: "¿Qué proyecto de infraestructura necesitas?",
      options: [
        "Cableado estructurado", "Instalación de puntos de red",
        "Redes LAN empresariales", "Wi-Fi empresarial", "Fibra óptica",
        "Switches y routers", "Racks y gabinetes de comunicaciones",
        "Configuración de VLAN y segmentación", "Enlaces inalámbricos",
        "Servidores y centros de datos", "Certificación y diagnóstico de cableado",
        "Mantenimiento y ampliación de redes"
      ],
      other: "Otro proyecto (especificar)"
    },
    videovigilancia: {
      title: "Videovigilancia",
      question: "¿Qué solución de seguridad necesitas?",
      options: [
        "Cámaras IP", "Cámaras CCTV analógicas", "Cámaras con visión nocturna",
        "Cámaras con reconocimiento de placas", "Grabadores DVR y NVR",
        "Monitoreo remoto desde celular", "Almacenamiento y respaldo de video",
        "Control de acceso y videoporteros", "Instalación para viviendas y edificios",
        "Videovigilancia para empresas y comercios", "Cámaras para buses y transporte",
        "Mantenimiento y ampliación de sistemas"
      ],
      other: "Otra solución de seguridad (especificar)"
    },
    ciberseguridad: {
      title: "Ciberseguridad",
      question: "¿Qué aspecto de seguridad deseas fortalecer?",
      options: [
        "Evaluación de riesgos informáticos", "Auditoría de seguridad",
        "Protección de computadoras y servidores", "Antivirus y protección de endpoints",
        "Seguridad de redes y firewalls", "Control de accesos y autenticación multifactor",
        "Copias de seguridad y recuperación", "Seguridad del correo corporativo",
        "Protección de datos e información", "Evaluación de vulnerabilidades",
        "Capacitación y concientización", "Implementación de políticas de seguridad"
      ],
      other: "Otro aspecto de seguridad (especificar)"
    },
    cloud: {
      title: "Cloud y conectividad",
      question: "¿Qué servicio cloud o de conectividad necesitas?",
      options: [
        "Migración de servidores a la nube", "Servidores cloud y máquinas virtuales",
        "Almacenamiento en la nube", "Copias de seguridad cloud",
        "Microsoft 365 y correo corporativo", "Administración de usuarios y licencias",
        "Hosting y alojamiento web", "Dominios y certificados SSL",
        "Conectividad empresarial", "Internet satelital y Starlink",
        "VPN y acceso remoto seguro", "Recuperación ante desastres y continuidad operativa"
      ],
      other: "Otro servicio cloud o de conectividad (especificar)"
    }
  };

  const serviceDialog = document.getElementById("service-inquiry-modal");
  const serviceTriggers = document.querySelectorAll("[data-open-service-modal]");
  const serviceForm = document.getElementById("service-inquiry-form");
  const serviceClose = document.querySelector(".service-inquiry-close");
  const serviceTopic = document.getElementById("service-inquiry-topic");
  const serviceTopicLabel = document.getElementById("service-inquiry-topic-label");
  const serviceDescription = document.getElementById("service-inquiry-request");

  if (serviceDialog && serviceTriggers.length && serviceForm && serviceTopic && serviceTopicLabel && serviceDescription) {
    serviceTriggers.forEach(trigger => {
      trigger.addEventListener("click", event => {
        event.preventDefault();
        const serviceKey = trigger.dataset.service;
        const service = serviceOptions[serviceKey];
        if (!service) return;

        serviceDialog.dataset.service = serviceKey;
        document.getElementById("service-inquiry-kicker").textContent = service.title.toUpperCase();
        serviceTopicLabel.textContent = service.question;
        serviceTopic.replaceChildren(new Option("Elige una opción", "", true, true));
        service.options.forEach(option => serviceTopic.add(new Option(option, option)));
        serviceTopic.add(new Option(service.other, service.other));
        serviceDescription.placeholder = "Cuéntanos un poco más para orientarte mejor. Si elegiste «Otro», descríbelo aquí. Comparte solo lo que te resulte cómodo.";

        serviceDialog.showModal();
        document.getElementById("service-inquiry-name")?.focus();
      });
    });

    serviceClose?.addEventListener("click", () => serviceDialog.close());
    serviceDialog.addEventListener("click", event => {
      if (event.target === serviceDialog) serviceDialog.close();
    });

    serviceForm.addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(serviceForm);
      const service = serviceOptions[serviceDialog.dataset.service];
      const name = String(formData.get("name") || "").trim();
      const topic = String(formData.get("topic") || "").trim();
      const request = String(formData.get("request") || "").trim();
      const message = `Hola, soy ${name}. Quisiera hacer una consulta sin compromiso sobre ${service.title}.\n\nEstoy buscando: ${topic}\n\nDetalles: ${request}`;
      const whatsappUrl = `https://wa.me/51932268872?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      serviceDialog.close();
      serviceForm.reset();
    });
  }

  /* Año del pie de página */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
