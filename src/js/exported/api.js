import axios from 'axios';
import { BASE_URL, state } from './constants.js';

// ===== SWEETIES: FETCH categories, desserts - oтримує список категорій та десертiв з API.
export async function fetchDesserts(params = {}) {
  const searchParams = new URLSearchParams({
    page: state.page,
    limit: state.limit,
    ...params,
  });

  const response = await fetch(
    `${BASE_URL}/desserts?${searchParams}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}