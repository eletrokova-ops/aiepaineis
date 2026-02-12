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
