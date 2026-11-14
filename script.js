(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-principal");
  const year = document.getElementById("year");
  const form = document.getElementById("form-contacto");
  const status = document.getElementById("form-status");
  const hero = document.querySelector(".hero");
  const heroImg = document.querySelector(".hero-img");

  if (year) year.textContent = String(new Date().getFullYear());

  /* —— Header —— */
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* —— Nav móvil —— */
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  /* —— Hero entrada —— */
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
    window.setTimeout(() => {
      document.querySelectorAll(".hero-anim").forEach((el) => {
        const delay = Number(el.dataset.delay || 0);
        el.style.setProperty("--d", `${480 + delay * 220}ms`);
        el.classList.add("is-in");
      });
    }, 280);
  });

  /* —— Parallax hero —— */
  if (!reduceMotion && hero && heroImg) {
    let ticking = false;
    const updateParallax = () => {
      const y = window.scrollY;
      const h = hero.offsetHeight || 1;
      if (y < h * 1.2) {
        const p = Math.min(y / h, 1);
        document.body.classList.toggle("is-scrolling-hero", y > 8);
        if (y > 8) {
          heroImg.style.transform = `scale(${1.08 + p * 0.12}) translate3d(0, ${p * 14}%, 0)`;
        } else {
          heroImg.style.transform = "";
        }
        const veil = hero.querySelector(".hero-veil");
        if (veil) veil.style.opacity = String(0.85 + p * 0.35);
        const content = hero.querySelector(".hero-content");
        if (content) {
          content.style.transform = `translate3d(0, ${p * 40}px, 0)`;
          content.style.opacity = String(1 - p * 0.85);
        }
        const hint = hero.querySelector(".scroll-hint");
        if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 2.2));
      }
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* —— Scroll reveals con variantes —— */
  const revealMap = [
    { sel: ".section .eyebrow, .section > .container > h2, .section > .container > .lead, .section .container.narrow > h2, .section .container.narrow > .lead, .section .container.narrow > .eyebrow", type: "fade-up" },
    { sel: ".identidad-block:not(.reverse)", type: "slide-left" },
    { sel: ".identidad-block.reverse", type: "slide-right" },
    { sel: ".mv-card", type: "zoom-fade", stagger: true },
    { sel: ".valor-row", type: "clip-up", stagger: true },
    { sel: ".equipo-photo", type: "slide-left" },
    { sel: ".equipo-copy", type: "slide-right" },
    { sel: ".servicio", type: "fade-up", stagger: true },
    { sel: ".caso", type: "zoom-fade", stagger: true },
    { sel: ".alianzas-list li", type: "slide-left", stagger: true },
    { sel: ".novedad", type: "fade-up", stagger: true },
    { sel: ".contacto-intro", type: "slide-left" },
    { sel: ".contacto-form", type: "slide-right" },
    { sel: ".footer-grid > *", type: "fade-up", stagger: true },
  ];

  const observed = [];
  revealMap.forEach(({ sel, type, stagger }) => {
    const nodes = document.querySelectorAll(sel);
    nodes.forEach((el, i) => {
      el.classList.add("anim", `anim-${type}`);
      if (stagger) el.style.setProperty("--stagger", `${i * 110}ms`);
      observed.push(el);
    });
  });

  /* Títulos con línea dorada */
  document.querySelectorAll(".section h2").forEach((h2) => {
    if (!h2.querySelector(".title-line")) {
      const line = document.createElement("span");
      line.className = "title-line";
      line.setAttribute("aria-hidden", "true");
      h2.appendChild(line);
    }
    h2.classList.add("anim-title");
    observed.push(h2);
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );
    observed.forEach((el) => io.observe(el));
  } else {
    observed.forEach((el) => el.classList.add("is-visible"));
  }

  /* —— Animaciones de imágenes —— */
  const imgFrames = [
    ...document.querySelectorAll(
      ".identidad-visual, .identidad-logo-wrap, .valor-img, .equipo-photo, .novedad-media, .caso"
    ),
  ];

  imgFrames.forEach((frame) => {
    frame.classList.add("img-frame");
    const img = frame.querySelector("img");
    if (img) img.classList.add("img-anim");
  });

  if ("IntersectionObserver" in window) {
    const imgIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-img-on");
          imgIo.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    imgFrames.forEach((frame) => imgIo.observe(frame));
  } else {
    imgFrames.forEach((frame) => frame.classList.add("is-img-on"));
  }

  /* Sin parallax en fotos de contenido: evita recortes */

  const isTouchUI = window.matchMedia("(max-width: 960px), (hover: none)").matches;

  /* —— Imágenes con tilt suave al hover (solo desktop) —— */
  if (!reduceMotion && !isTouchUI) {
    document.querySelectorAll(".identidad-visual, .equipo-photo, .caso, .novedad-media").forEach((box) => {
      box.classList.add("tilt-host");
      box.addEventListener("pointermove", (e) => {
        const r = box.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
        box.style.setProperty("--tilt-x", `${-y}deg`);
        box.style.setProperty("--tilt-y", `${x}deg`);
      });
      box.addEventListener("pointerleave", () => {
        box.style.setProperty("--tilt-x", "0deg");
        box.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  /* —— Botones magnéticos (solo desktop) —— */
  if (!reduceMotion && !isTouchUI) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* —— Contador / énfasis en valores al entrar —— */
  document.querySelectorAll(".valor-text").forEach((el) => {
    el.addEventListener(
      "animationstart",
      () => {},
      { once: true }
    );
  });

  /* —— Formulario —— */
  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Por favor completa los campos obligatorios.";
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const email = String(data.get("email") || "").trim();
      const telefono = String(data.get("telefono") || "").trim();
      const area = String(data.get("area") || "").trim();
      const mensaje = String(data.get("mensaje") || "").trim();

      const texto = [
        "Nuestra firma jurídica te da la bienvenida y tu atención será personalizada. En un momento te brindamos la atención que mereces.",
        "",
        `Nombre: ${nombre}`,
        `Correo: ${email}`,
        telefono ? `Teléfono: ${telefono}` : "",
        area ? `Área: ${area}` : "",
        `Mensaje: ${mensaje}`,
      ]
        .filter(Boolean)
        .join("\n");

      const url = `https://api.whatsapp.com/send?phone=573108765469&text=${encodeURIComponent(texto)}`;
      status.textContent = "Abriendo WhatsApp para enviar tu mensaje…";
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }
})();
