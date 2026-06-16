// ===================================== HEADER BURGER MENU ==================================================
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
    .querySelectorAll(
      ".header-wrapper a, .header-wrapper button:not(.burger-btn)",
    )
    .forEach((el) => {
      el.addEventListener("click", () => {
        burgerBtn.classList.remove("active");
        navMenu.classList.remove("active");
        rightMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      });
    });
});

// ===================================== SLIDER ==================================================
(() => {
  // Находим слайдер. Если его нет — сразу выходим из функции и не ломаем скрипт!
  const slider = document.getElementById("slider");
  if (!slider) return; 

  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;
  if (total === 0) return; // На всякий случай, если слайдер есть, а слайдов внутри нет

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

  // Безопасно вешаем клики (проверяем существование кнопок через «?» или if)
  document.getElementById("prev")?.addEventListener("click", () => goTo(current - 1));
  document.getElementById("next")?.addEventListener("click", () => goTo(current + 1));
  
  const dotsContainer = document.getElementById("dots");
  if (dotsContainer) {
    dotsContainer.querySelectorAll(".nav-dot").forEach((dot) => {
      dot.addEventListener("click", () =>
        goTo(parseInt(dot.dataset.index, 10)),
      );
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  let touchX = null;
  slider.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.touches[0].clientX;
    },
    { passive: true },
  );
  slider.addEventListener(
    "touchend",
    (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
      touchX = null;
    },
    { passive: true },
  );

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }
  resetTimer();

  slides[0]
    .querySelector("video")
    ?.play()
    .catch(() => {});
})();

// ===================================== configuration ==================================================
const pricing = {
  energy: {
    ground: 420,
    air: 310,
    pipe: 370,
    water: 890,
    explosive: 750,
    corrosive: 680,
    indoor: 280,
  },
  control: {
    ground: 180,
    air: 140,
    pipe: 160,
    water: 420,
    explosive: 390,
    corrosive: 310,
    indoor: 120,
  },
  data: {
    ground: 220,
    air: 170,
    pipe: 200,
    water: 560,
    explosive: 480,
    corrosive: 400,
    indoor: 150,
  },
  industrial: {
    ground: 350,
    air: 270,
    pipe: 310,
    water: 720,
    explosive: 640,
    corrosive: 570,
    indoor: 240,
  },
  transport: {
    ground: 490,
    air: 390,
    pipe: 450,
    water: 950,
    explosive: 820,
    corrosive: 740,
    indoor: 330,
  },
  construction: {
    ground: 290,
    air: 210,
    pipe: 250,
    water: 600,
    explosive: 530,
    corrosive: 460,
    indoor: 190,
  },
};

function fmt(n) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n));
}

function getState() {
  return {
    type: document.getElementById("project-type").value,
    cond: document.getElementById("conditions").value,
    length: parseFloat(document.getElementById("length").value) || 0,
  };
}

function updateEstimate() {
  const { type, cond, length } = getState();
  const el = document.getElementById("estimate-value");
  if (type && cond && length > 0) {
    const rate = pricing[type]?.[cond] ?? 300;
    const total = rate * length;
    el.textContent = `от ${fmt(total)} ₽`;
    el.classList.add("has-value");
  } else {
    el.textContent = "—";
    el.classList.remove("has-value");
  }
}

function onSelect(el) {
  el.classList.toggle("filled", !!el.value);
  updateEstimate();
}

function onLengthInput(el) {
  el.classList.toggle("filled", !!el.value);
  updateEstimate();
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

function showSolution() {
  const { type, cond, length } = getState();
  if (!type) return showToast("Выберите тип проекта");
  if (!cond) return showToast("Укажите условия прокладки");
  if (!length) return showToast("Введите длину кабеля");

  const rate = pricing[type]?.[cond] ?? 300;
  const total = rate * length;
  const labels = {
    energy: "энергоснабжения",
    control: "управления",
    data: "передачи данных",
    industrial: "автоматизации",
    transport: "транспорта",
    construction: "строительства",
  };
  showToast(`Решение для ${labels[type]} · ${fmt(total)} ₽`);
}

// ===================================== tabs (cotalog) ==================================================
/* Static version: cards live in the HTML above.
   JS only switches the active tab and shows/hides cards
   based on each card's data-cats attribute. */
(function () {
  var tabs = document.querySelectorAll(".tab");
  var cards = document.querySelectorAll(".card");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var cat = tab.dataset.cat;

      // active tab state
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active);
      });

      // show / hide cards
      var visibleIndex = 0;
      cards.forEach(function (card) {
        var show =
          cat === "all" || card.dataset.cats.split(" ").indexOf(cat) !== -1;
        card.classList.toggle("is-hidden", !show);
        if (show) {
          // restart the small fade-in, staggered
          card.style.animation = "none";
          void card.offsetWidth; // force reflow
          card.style.animation = "";
          card.style.animationDelay = visibleIndex * 45 + "ms";
          visibleIndex++;
        }
      });
    });
  });
})();
