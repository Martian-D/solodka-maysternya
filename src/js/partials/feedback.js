import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'css-star-rating/css/star-rating.min.css';

const reviewsList = document.querySelector('.reviews-list');

const BASE_URL = 'https://deserts-store.b.goit.study/api';

async function getFeedbacks() {
  const response = await fetch(`${BASE_URL}/feedbacks`);

  if (!response.ok) {
    throw new Error('Failed to fetch feedbacks');
  }

  return response.json();
}

function createRatingStars(rating) {
  const normalizedRating = Math.round(Number(rating) * 2) / 2;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return `
    <div class="reviews-rating rating" aria-label="Рейтинг ${normalizedRating} з 5">
      ${'<span class="reviews-star reviews-star-full">★</span>'.repeat(fullStars)}
      ${hasHalfStar ? '<span class="reviews-star reviews-star-half">★</span>' : ''}
      ${'<span class="reviews-star reviews-star-empty">★</span>'.repeat(emptyStars)}
    </div>
  `;
}

function createReviewCard(review) {
  const rating = review.rating || review.rate || 5;
  const text =
    review.text ||
    review.review ||
    review.comment ||
    review.message ||
    review.description ||
    review.descr ||
    review.feedback ||
    '';

  const name = review.name || review.author || review.user || 'Користувач';

  return `
    <li class="swiper-slide reviews-card">
      ${createRatingStars(rating)}

      <p class="reviews-card-text">
        "${text}"
      </p>

      <h3 class="reviews-card-name">
        ${name}
      </h3>
    </li>
  `;
}

function renderReviews(reviews) {
  reviewsList.innerHTML = reviews.map(createReviewCard).join('');
}

function initReviewsSwiper() {
  new Swiper('.reviews-swiper', {
    modules: [Navigation, Pagination],

    slidesPerView: 1,
    spaceBetween: 16,
    grabCursor: true,
    watchOverflow: true,

    navigation: {
      nextEl: '.reviews-btn-next',
      prevEl: '.reviews-btn-prev',
    },

    pagination: {
      el: '.reviews-pagination',
      clickable: true,
      dynamicBullets: true,
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
      1158: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}

async function initReviewsSection() {
  try {
      const data = await getFeedbacks();
      
    console.log(data);


      const feedbacks = Array.isArray(data) ? data : data.feedbacks;
    
    if (!feedbacks) {
      throw new Error('Feedbacks not found');
      }
      
    const firstTenFeedbacks = feedbacks.slice(0, 10);

    renderReviews(firstTenFeedbacks);
    initReviewsSwiper();
  } catch (error) {
    console.error(error);

    reviewsList.innerHTML = `
      <li class="reviews-error">
        Не вдалося завантажити відгуки. Спробуйте пізніше.
      </li>
    `;
  }
}

initReviewsSection();