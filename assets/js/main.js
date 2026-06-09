// HEADER BURGER MENU
document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.burger-btn');
  const navMenu = document.querySelector('.nav-link-wrapper');
  const rightMenu = document.querySelector('.header-right');
  const body = document.body;

  burgerBtn.addEventListener('click', () => {
    // Переключаем класс active для анимации крестика и открытия меню
    burgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    rightMenu.classList.toggle('active');
    
    // Отключаем скролл сайта при открытом меню
    body.classList.toggle('no-scroll');
  });

  // Закрываем меню при клике на любую ссылку
  const menuLinks = document.querySelectorAll('.header-wrapper a, .header-wrapper button:not(.burger-btn)');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      rightMenu.classList.remove('active');
      body.classList.remove('no-scroll');
    });
  });
});
// ===================================================================================================================