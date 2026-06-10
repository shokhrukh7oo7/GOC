// HEADER BURGER MENU
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.querySelector(".burger-btn");
  const navMenu = document.querySelector(".nav-link-wrapper");
  const rightMenu = document.querySelector(".header-right");

  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    rightMenu.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });

  document
    .querySelectorAll(".header-wrapper a, .header-wrapper button:not(.burger-btn)")
    .forEach((el) => {
      el.addEventListener("click", () => {
        burgerBtn.classList.remove("active");
        navMenu.classList.remove("active");
        rightMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      });
    });
});

// SLIDER
(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;
  let current = 0;
  let timer = null;

  function goTo(index) {
    const prev = current;
    current = (index + total) % total;
    if (prev === current) return;

    slides[prev].classList.remove("active");
    slides[current].classList.add("active");

    slides[prev].querySelector("video")?.pause();
    const nextVideo = slides[current].querySelector("video");
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }

    updateDots();
    resetTimer();
  }

  function updateDots() {
    document.querySelectorAll(".nav-dot").forEach((dot) => {
      const i = parseInt(dot.dataset.index, 10);
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-selected", i === current);
    });
  }

  document.getElementById("prev").addEventListener("click", () => goTo(current - 1));
  document.getElementById("next").addEventListener("click", () => goTo(current + 1));
  document.getElementById("dots").querySelectorAll(".nav-dot").forEach((dot) => {
    dot.addEventListener("click", () => goTo(parseInt(dot.dataset.index, 10)));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  let touchX = null;
  const slider = document.getElementById("slider");
  slider.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
    touchX = null;
  }, { passive: true });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }
  resetTimer();

  slides[0].querySelector("video")?.play().catch(() => {});
})();
