/* assets/js/main.js */

(() => {
  // Atualiza o ano no footer automaticamente
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== Menu Mobile =====
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  const headerCta = document.querySelector(".header-cta");

  if (menuBtn && nav && headerCta) {
    const setMenuState = (open) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      const show = open ? "flex" : "none";
      nav.style.display = show;
      headerCta.style.display = show;
    };

    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      setMenuState(!expanded);
    });

    const mobileMq = window.matchMedia("(max-width: 920px)");

    const syncMenuLayout = () => {
      // Quando volta pro desktop, remove o display inline que foi aplicado no mobile
      if (!mobileMq.matches) {
        nav.style.removeProperty("display");
        headerCta.style.removeProperty("display");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    };

    // Compatibilidade
    if (typeof mobileMq.addEventListener === "function") {
      mobileMq.addEventListener("change", syncMenuLayout);
    } else if (typeof mobileMq.addListener === "function") {
      mobileMq.addListener(syncMenuLayout);
    }

    window.addEventListener("resize", syncMenuLayout);
    syncMenuLayout();
  }

  // ===== Animações de Scroll (Ondas e Progresso) =====
  const waves = Array.from(document.querySelectorAll(".background-waves .wave"));
  const progress = document.querySelector(".progress-line");

  function updateScrollVisuals() {
    const doc = document.documentElement;
    const scrollY = window.scrollY || 0;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = clamp(scrollY / maxScroll, 0, 1);

    // Barra de progresso superior
    if (progress) {
      progress.style.width = `${(p * 100).toFixed(2)}%`;
    }

    // Movimento sutil das ondas de fundo
    if (waves.length && !prefersReducedMotion) {
      const x1 = (p * 40 - 20).toFixed(1);
      const y1 = (p * 26 - 13).toFixed(1);
      const x2 = (p * -34 + 17).toFixed(1);
      const y2 = (p * 22 - 11).toFixed(1);

      if (waves[0]) {
        waves[0].style.setProperty("--sx", `${x1}px`);
        waves[0].style.setProperty("--sy", `${y1}px`);
      }
      if (waves[1]) {
        waves[1].style.setProperty("--sx", `${x2}px`);
        waves[1].style.setProperty("--sy", `${y2}px`);
      }
    }
  }

  let ticking = false;
  const onScrollLike = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateScrollVisuals();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScrollLike, { passive: true });
  window.addEventListener("resize", onScrollLike);

  // roda uma vez ao carregar
  updateScrollVisuals();

  // ===== Efeito Reveal (Surgir ao rolar) =====
  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealEls.forEach((el) => obs.observe(el));
    }
  }

  // ===== Integração Formulário -> WhatsApp =====
  const leadForm = document.getElementById("leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Proteção contra SPAM (Honeypot)
      const botCheck = (leadForm.querySelector('[name="website"]')?.value || "").trim();
      if (botCheck) return;

      const data = new FormData(leadForm);

      const nome = String(data.get("nome") || "").trim();
      const whatsapp = String(data.get("whatsapp") || "").trim();
      const email = String(data.get("email") || "").trim();
      const mensagem = String(data.get("mensagem") || "").trim();

      if (!nome || !whatsapp || !mensagem) {
        alert("Por favor, preencha Nome, WhatsApp e Mensagem.");
        return;
      }

      const texto = [
        "*Solicitação de Proposta Técnica - A&E Painéis*",
        "",
        `*Nome:* ${nome}`,
        `*WhatsApp:* ${whatsapp}`,
        email ? `*E-mail:* ${email}` : "",
        "",
        "*Mensagem:*",
        mensagem
      ].filter(Boolean).join("\n");

      const phone = "5511912214610";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank", "noopener");
    });
  }
})();
