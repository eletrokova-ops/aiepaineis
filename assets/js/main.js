/* assets/js/main.js */

(() => {
  // Ano automático
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu mobile (se você usar depois)
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  const headerCta = document.querySelector(".header-cta");

  if (menuBtn && nav && headerCta) {
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));

      // Toggle simples: mostra/esconde nav + cta no mobile
      const show = expanded ? "none" : "flex";
      nav.style.display = show;
      headerCta.style.display = show;
    });
  }

  // Ondas discretas reagindo ao scroll (parallax suave)
  const waves = Array.from(document.querySelectorAll(".background-waves .wave"));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function updateWaves() {
    if (!waves.length) return;
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = clamp(window.scrollY / maxScroll, 0, 1);

    // Movimento bem discreto (ajuste se quiser mais)
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

  window.addEventListener("scroll", updateWaves, { passive: true });
  window.addEventListener("resize", updateWaves);
  updateWaves();

  // Intro full screen (se existir)
  window.addEventListener("load", () => {
    const intro = document.getElementById("intro");
    if (!intro) return;

    // remove após animação (bate com CSS ~3.2s)
    setTimeout(() => {
      intro.style.display = "none";
    }, 3200);
  });
})();
