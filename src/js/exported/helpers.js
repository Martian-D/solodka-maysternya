import { state } from './constants.js';
import { refs } from './refs.js';

export function getDessertsQueryParams() {
  const params = {};
  if (state.category !== 'all') {
    params.category = state.category;
  }
  return params;
}

export function getLoadedItemsCount() {
  return refs.sweetiesList ? refs.sweetiesList.children.length : 0;
}

export function updateLoadMoreButton() {
  if (!refs.loadMoreBtn) return;
  const loadedItems = getLoadedItemsCount();
  if (loadedItems >= state.totalItems) {
    refs.loadMoreBtn.style.display = 'none';
    return;
  }
  refs.loadMoreBtn.style.display = 'block';
  refs.loadMoreBtn.disabled = false;
}

export function setLoadMoreButtonLoading(isLoading) {
  if (!refs.loadMoreBtn) return;
  refs.loadMoreBtn.disabled = isLoading;
  refs.loadMoreBtn.textContent = isLoading ? 'Завантаження...' : 'Завантажити ще';
}