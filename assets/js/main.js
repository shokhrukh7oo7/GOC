// HEADER BURGER MENU
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.querySelector(".burger-btn");
  const navMenu = document.querySelector(".nav-link-wrapper");
  const rightMenu = document.querySelector(".header-right");
  const body = document.body;

  burgerBtn.addEventListener("click", () => {
    // Переключаем класс active для анимации крестика и открытия меню
    burgerBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    rightMenu.classList.toggle("active");

    // Отключаем скролл сайта при открытом меню
    body.classList.toggle("no-scroll");
  });

  // Закрываем меню при клике на любую ссылку
  const menuLinks = document.querySelectorAll(
    ".header-wrapper a, .header-wrapper button:not(.burger-btn)",
  );
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("active");
      navMenu.classList.remove("active");
      rightMenu.classList.remove("active");
      body.classList.remove("no-scroll");
    });
  });
});
// ===================================================================================================================
(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const totalSlides = slides.length;
  let current = 0;
  let autoTimer = null;

  // ── Go to slide ────────────────────────────────────
  function goTo(index) {
    const prev = current;
    current = (index + totalSlides) % totalSlides;
    if (prev === current) return;

    slides[prev].classList.remove("active");
    slides[current].classList.add("active");

    // Pause video on outgoing, play on incoming
    const outVideo = slides[prev].querySelector("video");
    const inVideo = slides[current].querySelector("video");
    if (outVideo) outVideo.pause();
    if (inVideo) {
      inVideo.currentTime = 0;
      inVideo.play().catch(() => {});
    }

    updateNav();
    resetAuto();
  }

  // ── Update all nav instances ───────────────────────
  function updateNav() {
    document.querySelectorAll(".nav-dot").forEach((dot) => {
      const i = parseInt(dot.dataset.index, 10);
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-selected", i === current);
    });
  }

  // ── Wire primary nav (slide 1 nav is the real control) ──
  document
    .getElementById("prev")
    .addEventListener("click", () => goTo(current - 1));
  document
    .getElementById("next")
    .addEventListener("click", () => goTo(current + 1));
  document
    .getElementById("dots")
    .querySelectorAll(".nav-dot")
    .forEach((dot) => {
      dot.addEventListener("click", () =>
        goTo(parseInt(dot.dataset.index, 10)),
      );
    });

  // ── Wire secondary navs (inside slides 2, 3) ──────
  slides.forEach((slide, si) => {
    if (si === 0) return;
    const nav = slide.querySelector(".slider-nav");
    if (!nav) return;
    const [prevBtn, nextBtn] = nav.querySelectorAll(".nav-arrow");
    const dots = nav.querySelectorAll(".nav-dot");
    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));
    dots.forEach((dot) =>
      dot.addEventListener("click", () =>
        goTo(parseInt(dot.dataset.index, 10)),
      ),
    );
  });

  // ── Keyboard ───────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  // ── Touch / swipe ──────────────────────────────────
  let touchX = null;
  document.getElementById("slider").addEventListener(
    "touchstart",
    (e) => {
      touchX = e.touches[0].clientX;
    },
    { passive: true },
  );
  document.getElementById("slider").addEventListener(
    "touchend",
    (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
      touchX = null;
    },
    { passive: true },
  );

  // ── Autoplay every 6 s ─────────────────────────────
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }
  resetAuto();

  // ── Play first video immediately ───────────────────
  const firstVideo = slides[0].querySelector("video");
  if (firstVideo) firstVideo.play().catch(() => {});
})();
