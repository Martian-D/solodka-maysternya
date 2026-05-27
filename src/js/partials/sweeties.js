import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';
import { openDessertModal } from './desserts-modal.js';

// ===== SWEETIES: REFS - додає посилання  desktop-категоріi, select для mobile/tablet
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

          <button class="sweeties-card-btn" type="button" data-id="${_id}" aria-label="Open dessert details">
          <svg id="icon-arrow_outward" width="32" height="32" viewBox="0 0 32 32" x="432" y="0">
<path d="M21.72 10.4l-12.795 12.804c-0.202 0.209-0.484 0.339-0.797 0.339-0.001 0-0.002 0-0.003 0h0c-0.001 0-0.002 0-0.004 0-0.311 0-0.591-0.133-0.786-0.346l-0.001-0.001c-0.213-0.201-0.345-0.485-0.347-0.8v-0q0-0.452 0.347-0.8l12.795-12.793h-11.267c-0.008 0-0.017 0-0.027 0-0.308 0-0.587-0.126-0.788-0.33l-0-0c-0.203-0.201-0.328-0.479-0.328-0.787 0-0.009 0-0.019 0-0.028l-0 0.001q0-0.483 0.328-0.805c0.202-0.2 0.481-0.324 0.788-0.324 0.010 0 0.020 0 0.029 0l-0.001-0h14q0.48 0 0.808 0.328c0.202 0.199 0.327 0.475 0.327 0.78 0 0.010-0 0.020-0 0.030l0-0.001v14q0 0.48-0.328 0.808c-0.201 0.203-0.479 0.328-0.787 0.328-0.009 0-0.019-0-0.028-0l0.001 0c-0.010 0-0.021 0-0.032 0-0.306 0-0.583-0.126-0.781-0.328l-0-0c-0.2-0.2-0.324-0.477-0.324-0.783 0-0.009 0-0.018 0-0.027l-0 0.001z"></path>
</svg>
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
    `<option value="all" ${state.category === 'all' ? 'selected' : ''}>Всі десерти</option>`,
    ...categories.map(
      category =>
        `<option value="${category._id}" ${
          state.category === category._id ? 'selected' : ''
        }>${category.name}</option>`
    ),
  ];

  refs.categorySelect.innerHTML = options.join('');

  if (refs.categorySelect.tomselect) {
    refs.categorySelect.tomselect.destroy();
  }

  initTomSelect();
}

//===== SWEETIES: Init TomSelect - Ініціалізує TomSelect для mobile/tablet.
function initTomSelect() {
  if (!refs.categorySelect) return;

  const tomSelect = new TomSelect(refs.categorySelect, {
    create: false,
    allowEmptyOption: false,
    controlInput: null,
    maxOptions: 20,
    dropdownClass: 'ts-dropdown sweeties-ts-dropdown',
  });

  tomSelect.on('change', () => {
    setTimeout(() => {
      tomSelect.blur();
    }, 0);
  });
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
    const categories = await
    fetchCategories();
    renderCategories(categories);
    renderCategoryOptions(categories);
    syncCategorySelect();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
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
  syncCategorySelect();
  await loadInitialDesserts();
}
//==== SWEETIES: select category change - Обробляє зміну категорії через select на mobile/tablet.
// ===== Винести в /exported/handlers.js

async function onCategorySelectChange(event) {
  state.category = event.target.value;
  syncCategorySelect();
  await loadInitialDesserts();
}

// ====== SWEETIES: Sync category select - Синхронізує вибір категорії між desktop radio-кнопками та mobile/tablet select.

function syncCategorySelect() {
  if (refs.categoriesBox) {
    const activeRadio = refs.categoriesBox.querySelector(
      `input[name="dessert-category"][value="${state.category}"]`
    );

    if (activeRadio) {
      activeRadio.checked = true;
    }
  }

  if (refs.categorySelect) {
    refs.categorySelect.value = state.category;

    if (refs.categorySelect.tomselect) {
      refs.categorySelect.tomselect.setValue(state.category, true);
    }
  }
}

// ==== SWEETIES: Card button click - Обробляє клік по кнопці картки, передаємо id назовні.
// ===== Винести в /exported/handlers.js

function onSweetiesListClick(event) {
  const button = event.target.closest('.sweeties-card-btn');
  if (!button) return;

  const dessertId = button.dataset.id;
  if (!dessertId) {
    console.warn('Dessert id is missing on button');
    return;
  }
  openDessertModal(dessertId);
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