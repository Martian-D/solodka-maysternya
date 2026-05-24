document.addEventListener('DOMContentLoaded', () => {
    // Пошук елементів інтерфейсу
    const burgerBtn = document.getElementById('js-burger-toggle');
    const navMenu = document.getElementById('js-nav-menu');
    const body = document.body;
    const navLinks = document.querySelectorAll('.header__menu-link, .header__btn');

    // Безпечний захист: якщо елементів немає на сторінці, скрипт тихо зупиняється без помилок в консолі
    if (!burgerBtn || !navMenu) return;

    // Функція відкриття/закриття меню
    function toggleMenu() {
        const isOpen = burgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Заборона скролу сторінки
    
        // Атрибут доступності для скрінрідерів
        burgerBtn.setAttribute('aria-expanded', isOpen);
        burgerBtn.setAttribute(
            'aria-label', 
            isOpen ? 'Закрити меню навігації' : 'Відкрити меню навігації'
        );
    }

    // Функція примусового закриття меню
    function closeMenu() {
        if (navMenu.classList.contains('active')) {
            burgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('no-scroll');
            burgerBtn.setAttribute('aria-expanded', 'false');
            burgerBtn.setAttribute('aria-label', 'Відкрити меню навігації');
        }
    }

    // 1. Клік на бургер-іконку або хрестик
    burgerBtn.addEventListener('click', toggleMenu);

    // 2. Автозакриття меню при виборі будь-якого пункту (плавний якірний перехід)
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 3. Закриття меню при натисканні клавіші Escape (Глобальне відстеження)
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    // 4. Контроль ресайзу: якщо екран розтягнули до планшета (768px), закриваємо мобільний бургер
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMenu();
        }
    });
});

