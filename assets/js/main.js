/* assets/js/main.js */

(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== Menu mobile =====
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

    // Evita nav "sumir" no desktop após interação no mobile
    const mobileMq = window.matchMedia("(max-width: 920px)");
    const syncMenuLayout = () => {
      if (!mobileMq.matches) {
        nav.style.removeProperty("display");
        headerCta.style.removeProperty("display");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    };

    if (typeof mobileMq.addEventListener === "function") {
      mobileMq.addEventListener("change", syncMenuLayout);
    } else if (typeof mobileMq.addListener === "function") {
      mobileMq.addListener(syncMenuLayout);
    }

    window.addEventListener("resize", syncMenuLayout);
    syncMenuLayout();
  }

  // ===== Ondas + barra de progresso =====
  const waves = Array.from(document.querySelectorAll(".background-waves .wave"));
  const progress = document.querySelector(".progress-line");

  function updateWaves() {
    if (!waves.length || prefersReducedMotion) return;

    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = clamp(window.scrollY / maxScroll, 0, 1);

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

  function updateProgress() {
    if (!progress) return;

    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = clamp((window.scrollY / maxScroll) * 100, 0, 100);
    progress.style.width = `${pct}%`;
  }

  let ticking = false;
  const onScrollLike = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateWaves();
      updateProgress();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScrollLike, { passive: true });
  window.addEventListener("resize", onScrollLike);
  updateWaves();
  updateProgress();

  // ===== Reveal =====
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
        { threshold: 0.18 }
      );

      revealEls.forEach((el) => obs.observe(el));
    }
  }

  // ===== Contadores =====
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  const animateCount = (el) => {
    const target = Number(el.getAttribute("data-count") || 0);
    const duration = 1100;
    const start = performance.now();

    const frame = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  if (counters.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach((counter) => {
        counter.textContent = counter.getAttribute("data-count") || "0";
      });
    } else {
      const cObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              cObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );

      counters.forEach((counter) => cObs.observe(counter));
    }
  }

  // ===== Form -> WhatsApp =====
  const leadForm = document.getElementById("leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = String(leadForm.querySelector('[name="nome"]')?.value || "").trim();
      const whatsapp = String(leadForm.querySelector('[name="whatsapp"]')?.value || "").trim();
      const email = String(leadForm.querySelector('[name="email"]')?.value || "").trim();
      const mensagem = String(leadForm.querySelector('[name="mensagem"]')?.value || "").trim();

      if (!nome || !whatsapp || !email || !mensagem) return;

      const texto = [
        "Olá! Quero uma proposta técnica da A&E Painéis.",
        "",
        `Nome: ${nome}`,
        `WhatsApp: ${whatsapp}`,
        `E-mail: ${email}`,
        "",
        "Mensagem:",
        mensagem,
      ].join("\n");

      const phone = "5511912214610";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank", "noopener");
    });
  }
})();

// ===== Soluções estilo jornal (auto-slide robusto + loop) =====
(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = document.querySelector(".solutions-track");
  const viewport = document.querySelector(".solutions-carousel");
  if (!track || !viewport) return;

  let cards = Array.from(track.querySelectorAll(".s-card"));
  if (cards.length < 2) return;

  const cloneFragment = document.createDocumentFragment();
  cards.forEach((card) => cloneFragment.appendChild(card.cloneNode(true)));
  track.appendChild(cloneFragment);

  cards = Array.from(track.querySelectorAll(".s-card"));

  let index = 0;
  let step = 0;
  let timer = null;

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
    return Number.isFinite(gap) ? gap : 0;
  };

  const measure = () => {
    const first = track.querySelector(".s-card");
    if (!first) return;
    step = first.getBoundingClientRect().width + getGap();
  };

  const moveTo = (i) => {
    if (!step) measure();
    track.style.transform = `translate3d(${-i * step}px, 0, 0)`;
  };

  const next = () => {
    index += 1;
    moveTo(index);

    const originalCount = cards.length / 2;
    if (index >= originalCount) {
      window.setTimeout(() => {
        track.style.transition = "none";
        index = 0;
        moveTo(index);
        track.getBoundingClientRect();
        track.style.transition = "transform .6s cubic-bezier(.4,0,.2,1)";
      }, 650);
    }
  };

  const start = () => {
    if (prefersReducedMotion) return;
    if (timer) clearInterval(timer);
    timer = setInterval(next, 5000);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", start);
  viewport.addEventListener("touchstart", stop, { passive: true });
  viewport.addEventListener("touchend", start, { passive: true });

  window.addEventListener("resize", () => {
    measure();
    moveTo(index);
  });

  measure();
  moveTo(index);
  start();
})();
// ===== Intro splash =====
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  if (!intro) return;

  // remove do DOM depois da animação
  setTimeout(() => {
    intro.remove();
  }, 3600);
});
document.body.classList.add("intro-lock");

setTimeout(() => {
  document.body.classList.remove("intro-lock");
}, 3600);
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  if (!intro) return;

  setTimeout(() => {
    intro.remove();
  }, 3200); // tem que ser maior que o delay+animação do CSS
});
