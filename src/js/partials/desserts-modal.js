import axios from 'axios';
import { BASE_URL } from '../exported/constants.js';
import { hideLoader, showLoader } from '../exported/loader.js';
import { openOrderModal } from './order.js';
import iziToast from 'izitoast';
let currentDessert = null;

const modalDessert = document.querySelector('.modal-dessert');
const closeBtn = document.querySelector('.dessert-close');
const orderBtn = document.querySelector('.dessert-order-btn');

export function openModal() {
  modalDessert.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onEscapePress);
  closeBtn.addEventListener('click', closeModal);
  modalDessert.addEventListener('click', onBackdropClick);
  orderBtn.addEventListener('click', onOrderBtnClick);
}

export function closeModal() {
  modalDessert.classList.add('is-hidden');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onEscapePress);
  closeBtn.removeEventListener('click', closeModal);
  modalDessert.removeEventListener('click', onBackdropClick);
  orderBtn.removeEventListener('click', onOrderBtnClick);
}

function onOrderBtnClick() {
  closeModal();
  openOrderModal(currentDessert);
}

export async function openDessertModal(id) {
  document.querySelector('.dessert-img').src = '';
  document.querySelector('.dessert-img').alt = '';
  document.querySelector('.dessert-title').textContent = '';
  document.querySelector('.dessert-price').textContent = '';
  document.querySelector('.dessert-description').textContent = '';
  document.querySelector('.dessert-ingredients').innerHTML = '';
  document.querySelector('.dessert-rating').innerHTML = '';
  currentDessert = null;
  try {
    showLoader();
    const dessert = await fetchDessertById(id);
    currentDessert = dessert;
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

function onEscapePress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}
function onBackdropClick(event) {
  if (event.target.classList.contains('dessert-overlay')) {
    closeModal();
  }
}

async function fetchDessertById(id) {
  const response = await axios.get(`${BASE_URL}/desserts/${id}`);
  return response.data;
}

function renderDessertModal(dessert) {
  document.querySelector('.dessert-img').src = dessert.image;
  document.querySelector('.dessert-img').alt = dessert.name;
  document.querySelector('.dessert-title').textContent = dessert.name;
  document.querySelector('.dessert-price').textContent = `${dessert.price} грн`;
  document.querySelector('.dessert-description').textContent =
    dessert.description;
  document.querySelector('.dessert-ingredients').innerHTML =
    `<span class="dessert-ingredients-title">Склад</span>: ${dessert.composition}`;
  document.querySelector('.dessert-rating').innerHTML = renderStars(
    dessert.rate
  );
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
