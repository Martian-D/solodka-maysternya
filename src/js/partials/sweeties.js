// ===== SWEETIES: REFS - додає посилання на блок desktop-категорій та select для mobile/tablet
// ===== Винести до /exported/refs.js
const refs = {
  sweetiesList: document.querySelector('.sweeties-list'),
  loadMoreBtn: document.querySelector('.sweeties-load-more-btn'),
  categoriesBox: document.querySelector('.sweeties-categories'),
  categorySelect: document.querySelector('.sweeties-select'),
};

// ===== SWEETIES: STATE - зберігає активну категорію для фільтрації.
// ===== Винести до /exported/constants.js або state module 
const state = {
  page: 1,
  limit: 8,
  totalItems: 0,
  isLoading: false,
  category: 'all',
};
// ===== SWEETIES: FETCH categories, desserts - oтримує список категорій та десертiв з API.
// ===== Винести в /exported/api.js

async function fetchDesserts(params = {}) {
  const searchParams = new URLSearchParams({
    page: state.page,
    limit: state.limit,
    ...params,
  });

  const response = await fetch(
    `https://deserts-store.b.goit.study/api/desserts?${searchParams}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(
    'https://deserts-store.b.goit.study/api/categories'
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ===== SWEETIES: Create Category and Card Markup - Генерує картки десертiв та одну radio-кнопку категорії для desktop-версії.
// ===== Винести в exported/render-functions.js

function createSweetiesCardMarkup({
  _id,
  name,
  description,
  price,
  category,
  image,
}) {
  return `
    <li class="sweeties-card" data-id="${_id}">
      <img
        class="sweeties-card-image"
        src="${image}"
        alt="${name}"
        width="303"
        height="228"
        loading="lazy"
      />

      <div class="sweeties-card-text">
        <p class="sweeties-card-category">${category.name}</p>
        <h3 class="sweeties-card-title">${name}</h3>
        <p class="sweeties-card-description">${description}</p>

        <div class="sweeties-card-bottom">
          <p class="sweeties-card-price">${price} грн</p>

          <button
            class="sweeties-card-btn"
            type="button"
            data-id="${_id}"
            aria-label="Open dessert details"
          >
            →
          </button>
        </div>
      </div>
    </li>
  `;
}

function renderSweetiesCards(items, append = false) {
  if (!refs.sweetiesList) return;

  const markup = items.map(createSweetiesCardMarkup).join('');

  if (append) {
    refs.sweetiesList.insertAdjacentHTML('beforeend', markup);
    return;
  }

  refs.sweetiesList.innerHTML = markup;
}

function createCategoryMarkup(category, checked = false) {
  return `
    <label>
      <input
        class="visually-hidden"
        type="radio"
        name="dessert-category"
        value="${category._id}"
        ${checked ? 'checked' : ''}
      />
      <span class="sweeties-category-name">${category.name}</span>
    </label>
  `;
}
//===== SWEETIES: render categories - Відмальовує desktop-категорії в fieldset.sweeties-categories.
// ===== Винести до /exported/render-functions.js

function renderCategories(categories) {
  if (!refs.categoriesBox) return;

  const allCategoryMarkup = `
    <label>
      <input
        class="visually-hidden"
        type="radio"
        name="dessert-category"
        value="all"
        checked
      />
      <span class="sweeties-category-name">Всі десерти</span>
    </label>
  `;

  const markup =
    allCategoryMarkup +
    categories.map(category => createCategoryMarkup(category)).join('');

  refs.categoriesBox.innerHTML = markup;
}

//===== SWEETIES: Render category options - Наповнює select категоріями для mobile/tablet.
// ===== Винести до /exported/render-functions.js

function renderCategoryOptions(categories) {
  if (!refs.categorySelect) return;

  const options = [
    '<option value="all" selected>Всі десерти</option>',
    ...categories.map(
      category => `<option value="${category._id}">${category.name}</option>`
    ),
  ];

  refs.categorySelect.innerHTML = options.join('');
}

function getLoadedItemsCount() {
  return refs.sweetiesList ? refs.sweetiesList.children.length : 0;
}

function updateLoadMoreButton() {
  if (!refs.loadMoreBtn) return;

  const loadedItems = getLoadedItemsCount();

  if (loadedItems >= state.totalItems) {
    refs.loadMoreBtn.style.display = 'none';
    return;
  }

  refs.loadMoreBtn.style.display = 'block';
  refs.loadMoreBtn.disabled = false;
}

function setLoadMoreButtonLoading(isLoading) {
  if (!refs.loadMoreBtn) return;

  refs.loadMoreBtn.disabled = isLoading;
  refs.loadMoreBtn.textContent = isLoading
    ? 'Завантаження...'
    : 'Завантажити ще';
}

//===== SWEETIES: Load categories - Завантажує категорії з API та рендерить: radio-кнопки для desktop, 
// options для select на mobile/tablet
// ===== Винести до /exported/handlers.js

async function loadCategories() {
  try {
    const categories = await fetchCategories();

    renderCategories(categories);
    renderCategoryOptions(categories);
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
  console.log();
  }

async function loadInitialDesserts() {
  try {
    state.page = 1;
    state.isLoading = true;
    setLoadMoreButtonLoading(true);

    const data = await fetchDesserts(getDessertsQueryParams());

    state.totalItems = data.totalItems ?? 0;

    renderSweetiesCards(data.desserts ?? []);
    updateLoadMoreButton();
  } catch (error) {
    console.error('Failed to load initial desserts:', error);
  } finally {
    state.isLoading = false;
    setLoadMoreButtonLoading(false);
  }
}

async function onLoadMoreClick() {
  if (state.isLoading) return;

  try {
    state.page += 1;
    state.isLoading = true;
    setLoadMoreButtonLoading(true);

    const data = await fetchDesserts(getDessertsQueryParams());

    renderSweetiesCards(data.desserts ?? [], true);
    updateLoadMoreButton();
  } catch (error) {
    console.error('Failed to load more desserts:', error);
    state.page -= 1;
  } finally {
    state.isLoading = false;
    setLoadMoreButtonLoading(false);
  }
}

// ===== SWEETIES: query params -  Формує параметри для запиту десертів.
// ===== Винести в /exported/helpers.js або /exported/api.js

function getDessertsQueryParams() {
  const params = {};

  if (state.category !== 'all') {
    params.category = state.category;
  }

  return params;
}

// ===== SWEETIES: desktop category change - Обробляє зміну категорії через radio-кнопки у desktop-версії.
// ===== Винести в /exported/handlers.js

async function onCategoryChange(event) {
  const target = event.target;

  if (target.type !== 'radio') return;

  state.category = target.value;
  await loadInitialDesserts();
}
//==== SWEETIES: select category change - Обробляє зміну категорії через select на mobile/tablet.
// ===== Винести в /exported/handlers.js

async function onCategorySelectChange(event) {
  state.category = event.target.value;
  await loadInitialDesserts();
}

// ==== SWEETIES: Card button click - Обробляє клік по кнопці картки, передаємо id назовні.
// ===== Винести в /exported/handlers.js

function onSweetiesListClick(event) {
  const button = event.target.closest('.sweeties-card-btn');
  if (!button) return;

  const dessertId = button.dataset.id;

  if (typeof window.openDessertModal === 'function') {
    window.openDessertModal(dessertId);
  }
}

// ===== SWEETIES: Init - Ініціалізує всю секцію sweeties:
// 1. завантажує категорії;
// 2. завантажує першу сторінку десертів;
// 3. підключає кнопку "Завантажити ще";
// 4. підключає фільтрацію через desktop radio-категорії;
// 5. підключає фільтрацію через mobile/tablet select;
// 6. підключає клік по кнопці картки для відкриття модалки.
// Залишити в partials/sweeties.js

function initSweeties() {

  loadCategories();

  loadInitialDesserts();

  if (refs.loadMoreBtn) {
    refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
  }

  if (refs.categoriesBox) {
    refs.categoriesBox.addEventListener('change', onCategoryChange);
  }

  if (refs.categorySelect) {
    refs.categorySelect.addEventListener('change', onCategorySelectChange);
  }

    if (refs.sweetiesList) {
    refs.sweetiesList.addEventListener('click', onSweetiesListClick);
  }
}

initSweeties();