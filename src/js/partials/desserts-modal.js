import axios from 'axios';
import { BASE_URL } from '../exported/constants.js';
import { hideLoader, showLoader } from '../exported/loader.js';
import iziToast from 'izitoast';
let currentDessertId = null;

const modalDessert = document.querySelector('.modal-dessert');
const closeBtn = document.querySelector('.modal-close');
const orderBtn = document.querySelector('.modal-order-btn');

export function openModal() {
  modalDessert.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onEscapePress);
}

export function closeModal() {
  modalDessert.classList.add('is-hidden');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onEscapePress);
}

export async function openDessertModal(id) {
  currentDessertId = id;
  try {
    showLoader();
    const dessert = await fetchDessertById(id);
    renderDessertModal(dessert);
    openModal();
  } catch (error) {
    iziToast.error({
      title: 'Упс!',
      message: 'Не вдалося завантажити інформацію. Спробуйте пізніше!',
      position: 'topRight',
      timeout: 4000,
      transitionIn: 'bounceInLeft',
      theme: 'dark',
      backgroundColor: '#f19898',
      titleColor: '#080c0c',
      messageColor: '#080c0c',
      iconColor: '#080c0c',
    });
  } finally {
    hideLoader();
  }
}
closeBtn.addEventListener('click', closeModal);

function onEscapePress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

modalDessert.addEventListener('click', event => {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal();
  }
});

orderBtn.addEventListener('click', () => {
  closeModal();
  // openOrderModal(currentDessertId);
});

async function fetchDessertById(id) {
  const response = await axios.get(`${BASE_URL}/desserts/${id}`);
  return response.data;
}

function renderDessertModal(dessert) {
  document.querySelector('.modal-img').src = dessert.image;
  document.querySelector('.modal-img').alt = dessert.name;
  document.querySelector('.modal-title').textContent = dessert.name;
  document.querySelector('.modal-price').textContent = `${dessert.price} грн`;
  document.querySelector('.modal-description').textContent =
    dessert.description;
  document.querySelector('.modal-ingredients').innerHTML =
    `<span class="modal-ingredients-title">Склад</span>: ${dessert.composition}`;
  document.querySelector('.modal-rating').innerHTML = renderStars(dessert.rate);
}
function renderStars(rate) {
  const normalizedRating = Math.round(Number(rate) * 2) / 2;
  const fullStars = Math.floor(normalizedRating);
  const hasHalf = normalizedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return `
    <div class="modal-stars">
      ${'<span class="modal-star modal-star-full">★</span>'.repeat(fullStars)}
      ${hasHalf ? '<span class="modal-star modal-star-half">★</span>' : ''}
      ${'<span class="modal-star modal-star-empty">★</span>'.repeat(emptyStars)}
    </div>
  `;
}
