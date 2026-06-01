import { state } from './constants.js';
import { refs } from './refs.js';
import { fetchCategories, fetchDesserts } from './api.js';
import { renderCategories, renderCategoryOptions, renderSweetiesCards } from './render-functions.js';
import { getDessertsQueryParams, updateLoadMoreButton, setLoadMoreButtonLoading } from './helpers.js';
import { openDessertModal } from '../partials/desserts-modal.js';

//===== SWEETIES: Load categories - Завантажує категорії з API та рендерить: radio-кнопки для desktop, 
// options для select на mobile/tablet
export async function loadCategories() {
  try {
    const categories = await fetchCategories();
    renderCategories(categories);
    renderCategoryOptions(categories);
    syncCategorySelect();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

export async function loadInitialDesserts() {
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

export async function onLoadMoreClick() {
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
// ===== SWEETIES: desktop category change - Обробляє зміну категорії через radio-кнопки у desktop-версії.
// ===== Винести в /exported/handlers.js


export async function onCategoryChange(event) {
  const target = event.target;
  if (target.type !== 'radio') return;
  state.category = target.value;
  syncCategorySelect();
  await loadInitialDesserts();
}
//== SWEETIES: select category change - Обробляє зміну категорії через select на mobile/tablet.
export async function onCategorySelectChange(event) {
  state.category = event.target.value;
  syncCategorySelect();
  await loadInitialDesserts();
}
// == SWEETIES: Sync category select - Синхронізує вибір категорії між desktop radio-кнопками та mobile/tablet select.
export function syncCategorySelect() {
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
export function onSweetiesListClick(event) {
  const button = event.target.closest('.sweeties-card-btn');
  if (!button) return;

  const dessertId = button.dataset.id;
  if (!dessertId) {
    console.warn('Dessert id is missing on button');
    return;
  }
  openDessertModal(dessertId);
}