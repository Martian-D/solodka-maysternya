// ===== SWEETIES: STATE - зберігає активну категорію для фільтрації.
export const BASE_URL = 'https://deserts-store.b.goit.study/api';
export const state = {
  page: 1,
  limit: 8,
  totalItems: 0,
  isLoading: false,
  category: 'all',
};