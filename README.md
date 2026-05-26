# Sweet workshop

Landing page / каталог для **Солодкої Майстерні**: адаптивний сайт магазину
десертів із динамічним завантаженням товарів, фільтрацією за категоріями,
відгуками клієнтів, FAQ, слайдерами та модальним вікном деталей десерту.


## Можливості

- Адаптивна верстка для mobile, tablet і desktop.
- Каталог десертів із завантаженням даних з API.
- Фільтрація за категоріями та пагінація через кнопку "Завантажити ще".
- Модальне вікно десерту із зображенням, ціною, описом, складом і рейтингом.
- Слайдер відгуків клієнтів.
- Слайдер зображень у секції "Про нас".
- FAQ-акордеон.
- Мобільне burger-меню з обробкою Escape і resize.
- Production-збірка налаштована для деплою під `/team-dev/`.


## Repository
https://github.com/Anastasiia-S100306/team-dev

## Pages
https://anastasiia-s100306.github.io/team-dev/

## Технології

- Vite
- Vanilla JavaScript modules
- HTML partials через `vite-plugin-html-inject`
- CSS-файли, зібрані через `src/css/styles.css`
- Axios
- Swiper
- Tom Select
- Accordion JS
- iziToast

## Запуск

Встановити залежності:

```bash
npm ci
```

Запустити dev-сервер:

```bash
npm run dev
```

Зібрати production-версію:

```bash
npm run build
```

Локально переглянути production-збірку:

```bash
npm run preview
```

## Структура проєкту

```text
src/
  index.html              Головна сторінка, зібрана з HTML partials
  main.js                 JavaScript entry point
  css/
    common/               Reset, base, container, animations, loader
    sections/             Стилі окремих секцій
    styles.css            Головний файл імпортів CSS
  js/
    exported/             Спільні constants, API та loader helpers
    partials/             Скрипти секцій і UI-поведінка
  partials/               HTML partials для секцій і модалок
  public/                 Статичні public assets
  img/                    Зображення та SVG sprite
```
## API

Застосунок використовує:

```js
https://deserts-store.b.goit.study/api
```

Основні endpoints:

- `GET /categories` - категорії десертів.
- `GET /desserts` - список десертів з пагінацією та опційною фільтрацією.
- `GET /desserts/:id` - деталі десерту для модального вікна.
- `GET /feedbacks` - відгуки клієнтів.
- `POST /orders` - відгуки клієнтів.

## Корисні скрипти

- `npm run dev` - запускає Vite у режимі розробки.
- `npm run build` - створює production-збірку в `dist/`.
- `npm run preview` - локально запускає production-збірку.


