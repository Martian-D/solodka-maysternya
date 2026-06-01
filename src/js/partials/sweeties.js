import { refs } from '../exported/refs.js';
import {
  loadCategories,
  loadInitialDesserts,
  onLoadMoreClick,
  onCategoryChange,
  onCategorySelectChange,
  onSweetiesListClick,
} from '../exported/handlers.js';


// ===== SWEETIES: Init - Ініціалізує всю секцію sweeties:
// 1. завантажує категорії;
// 2. завантажує першу сторінку десертів;
// 3. підключає кнопку "Завантажити ще";
// 4. підключає фільтрацію через desktop radio-категорії;
// 5. підключає фільтрацію через mobile/tablet select;
// 6. підключає клік по кнопці картки для відкриття модалки.


async function initSweeties() {
  await loadCategories();
  await loadInitialDesserts();

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