/* assets/js/main.js */

(function () {
  // ====== Config ======
  const WHATSAPP_NUMBER = "5511912214610"; // formato: 55 + DDD + número (sem +)
  const DEFAULT_WPP_TEXT = "Olá! Quero um orçamento com a A&E.";

  // ====== Helpers ======
  function buildWhatsAppUrl(number, text) {
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${number}?text=${encoded}`;
  }

  // ====== Footer year ======
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ====== Waves parallax on scroll (sem brigar com CSS) ======
const wave1 = document.querySelector(".wave1");
const wave2 = document.querySelector(".wave2");
let ticking = false;

function applyWaveScroll() {
  const y = window.scrollY || 0;

  // valores bem sutis (fica premium, não “enjoa”)
  if (wave1) {
    wave1.style.setProperty("--sx", `${y * 0.02}px`);
    wave1.style.setProperty("--sy", `${y * -0.03}px`);
  }
  if (wave2) {
    wave2.style.setProperty("--sx", `${y * -0.015}px`);
    wave2.style.setProperty("--sy", `${y * 0.02}px`);
  }
}

window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    applyWaveScroll();
    ticking = false;
  });
}, { passive: true });

applyWaveScroll();


    // Movimento sutil (não enjoa)
    if (wave1) {
      wave1.style.transform = `translate3d(${y * 0.02}px, ${y * -0.03}px, 0) scale(1.02)`;
    }
    if (wave2) {
      wave2.style.transform = `translate3d(${y * -0.015}px, ${y * 0.02}px, 0) scale(1.03)`;
    }
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Roda uma vez no load
  onScroll();

  // ====== WhatsApp links fix (caso tenha "SEU_WHATSAPP" em algum lugar) ======
  const wppLinks = document.querySelectorAll('a[href*="wa.me/"]');
  wppLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.includes("SEU_WHATSAPP")) {
      a.setAttribute("href", buildWhatsAppUrl(WHATSAPP_NUMBER, DEFAULT_WPP_TEXT));
    }
  });

  // ====== Form placeholder -> abre WhatsApp com mensagem pronta ======
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = (form.elements["nome"]?.value || "").trim();
      const empresa = (form.elements["empresa"]?.value || "").trim();
      const whatsapp = (form.elements["whatsapp"]?.value || "").trim();
      const mensagem = (form.elements["mensagem"]?.value || "").trim();

      const parts = [];
      if (nome) parts.push(`Nome: ${nome}`);
      if (empresa) parts.push(`Empresa: ${empresa}`);
      if (whatsapp) parts.push(`WhatsApp: ${whatsapp}`);
      if (mensagem) parts.push(`Mensagem: ${mensagem}`);

      const text = parts.length ? parts.join("\n") : DEFAULT_WPP_TEXT;

      window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, text), "_blank", "noopener");
    });
  }

  // ====== Mobile menu (simples) ======
  // Obs: seu CSS hoje esconde nav/header-cta no mobile.
  // Aqui a gente só faz um "toggle" básico se você depois quiser mostrar um menu.
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  const cta = document.querySelector(".header-cta");

  if (menuBtn && nav && cta) {
    menuBtn.addEventListener("click", function () {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));

      // Toggle inline (sem depender de CSS extra)
      if (!expanded) {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.gap = "12px";
        nav.style.padding = "12px 0";

        cta.style.display = "flex";
        cta.style.flexDirection = "column";
        cta.style.gap = "10px";
        cta.style.paddingBottom = "12px";

        // Cria container dropdown se não existir
        let drop = document.querySelector(".mobile-drop");
        if (!drop) {
          drop = document.createElement("div");
          drop.className = "mobile-drop";
          drop.style.borderTop = "1px solid rgba(15, 23, 42, 0.10)";
          drop.style.marginTop = "10px";
          drop.style.paddingTop = "10px";

          // move nav e cta pra dentro
          const headerInner = document.querySelector(".header-inner");
          headerInner.appendChild(drop);
          drop.appendChild(nav);
          drop.appendChild(cta);
        }

        drop.style.display = "block";
      } else {
        const drop = document.querySelector(".mobile-drop");
        if (drop) drop.style.display = "none";
      }
    });

    // Fecha ao clicar em algum link do menu
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        const drop = document.querySelector(".mobile-drop");
        if (drop) drop.style.display = "none";
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
