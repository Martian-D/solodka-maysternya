import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { openDessertModal } from './desserts-modal.js'; // 1. Імпортуємо функцію модалки

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const popularList = document.getElementById('popular-list');

async function fetchPopularDesserts() {
  try {
    const response = await fetch('https://deserts-store.b.goit.study/api/desserts?page=1&limit=8&type=popular');
    if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    const data = await response.json();
    return data.desserts || [];
  } catch (error) {
    console.error('Помилка API:', error);
    return [];
  }
}

function createCardMarkup(product) {
  return `
    <li class="swiper-slide">
      <div class="popular-card">
        <img src="${product.image}" alt="${product.name}" class="popular-card-image" />
        <div class="popular-card-text">
          <p class="popular-card-category">${product.category?.name || ''}</p>
          <h3 class="popular-card-title">${product.name}</h3>
          <p class="popular-card-description">${product.description}</p>
          <div class="popular-card-bottom">
            <span class="popular-card-price">${product.price} грн</span>
            
            <button type="button" class="sweeties-card-btn" data-id="${product._id}" aria-label="Open dessert details">
              <svg width="32" height="32" viewBox="0 0 32 32">
                <path d="M21.72 10.4l-12.795 12.804c-0.202 0.209-0.484 0.339-0.797 0.339-0.001 0-0.002 0-0.003 0h0c-0.001 0-0.002 0-0.004 0-0.311 0-0.591-0.133-0.786-0.346l-0.001-0.001c-0.213-0.201-0.345-0.485-0.347-0.8v-0q0-0.452 0.347-0.8l12.795-12.793h-11.267c-0.008 0-0.017 0-0.027 0-0.308 0-0.587-0.126-0.788-0.33l-0-0c-0.203-0.201-0.328-0.479-0.328-0.787 0-0.009 0-0.019 0-0.028l-0 0.001q0-0.483 0.328-0.805c0.202-0.2 0.481-0.324 0.788-0.324 0.010 0 0.020 0 0.029 0l-0.001-0h14q0.48 0 0.808 0.328c0.202 0.199 0.327 0.475 0.327 0.78 0 0.010-0 0.020-0 0.030l0-0.001v14q0 0.48-0.328 0.808c-0.201 0.203-0.479 0.328-0.787 0.328-0.009 0-0.019-0-0.028-0l0.001 0c-0.010 0-0.021 0-0.032 0-0.306 0-0.583-0.126-0.781-0.328l-0-0c-0.2-0.2-0.324-0.477-0.324-0.783 0-0.009 0-0.018 0-0.027l-0 0.001z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  `;
}

function initPopularSwiper() {
  new Swiper('.popular-swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.popular-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.popular-next-btn',
      prevEl: '.popular-prev-btn',
    },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 16 },
      1440: { slidesPerView: 3, spaceBetween: 24 }
    }
  });
}

function onPopularListClick(event) {
  const button = event.target.closest('.sweeties-card-btn');
  if (!button) return;

  const dessertId = button.dataset.id;
  if (!dessertId) {
    console.warn('Dessert id is missing on button');
    return;
  }
  openDessertModal(dessertId);
}

async function renderPopularSection() {
  const products = await fetchPopularDesserts();
  if (products.length === 0) return;

  if (popularList) {
    popularList.innerHTML = products.map(createCardMarkup).join('');
    
    popularList.addEventListener('click', onPopularListClick);
    
    initPopularSwiper();
  }
}

renderPopularSection();