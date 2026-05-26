import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

let swiper = null;

const mediaQuery = window.matchMedia('(min-width: 768px)');
mediaQuery.addEventListener('change', handleSwiper);

function handleSwiper(event) {
  if (event.matches) {
    if (!swiper) {
      swiper = new Swiper('.about-us-swiper', {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 2,
        spaceBetween: 24,
        navigation: {
          nextEl: '.swiper-container .swiper-button-next',
          prevEl: '.swiper-container .swiper-button-prev',
        },
        pagination: {
          el: '.about-us-swiper .swiper-pagination',
          dynamicBullets: true,
          clickable: true,
        },
        autoplay: {
          delay: 3000,
        },
        keyboard: true,
      });
    }
  } else {
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
  }
}

handleSwiper(mediaQuery);
