// Ano no footer
document.getElementById("year").textContent = new Date().getFullYear();

// Menu mobile (simples): alterna mostrar/esconder a navegação
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
const headerCta = document.querySelector(".header-cta");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));

    // No mobile, nav/cta estão display:none pelo CSS. Vamos forçar inline quando abrir.
    const show = expanded ? "none" : "flex";
    if (nav) nav.style.display = show;
    if (headerCta) headerCta.style.display = show;
  });
}

// Form placeholder (não envia ainda)
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Formulário pronto. Próximo passo: conectar no Formspree / Google Forms / RD Station.");
    leadForm.reset();
  });
}

// Waves parallax (suave) - reage ao scroll
(() => {
  const w1 = document.querySelector(".wave1");
  const w2 = document.querySelector(".wave2");
  if (!w1 || !w2) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const t = clamp(y / 900, 0, 1); // 0..1

      // Move levemente para criar sensação de "ondas acompanhando"
      w1.style.transform = `translate3d(${t * 30}px, ${t * 55}px, 0)`;
      w2.style.transform = `translate3d(${-t * 40}px, ${-t * 35}px, 0)`;

      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
