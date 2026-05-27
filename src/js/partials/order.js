import axios from 'axios';
import { BASE_URL } from '../exported/constants.js';
import iziToast from 'izitoast';

let currentDessertId = null;

const overlay2 = document.getElementById('overlay2');
const closeContactBtn = document.getElementById('closeContactBtn');
const submitOrderBtn = document.getElementById('submitOrderBtn');

export function openOrderModal(dessert) {
  currentDessertId = dessert._id;

  document.getElementById('nameInput').value = '';
  document.getElementById('phoneInput').value = '';
  document.getElementById('commentInput').value = '';

  document.getElementById('orderForm').style.display = 'block';
  document.getElementById('successMsg').style.display = 'none';

  overlay2.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onEscapePress);
}

export function closeOrderModal() {
  overlay2.classList.remove('active');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onEscapePress);
}

function onEscapePress(e) {
  if (e.key === 'Escape') closeOrderModal();
}

overlay2.addEventListener('click', e => {
  if (e.target === overlay2) closeOrderModal();
});

closeContactBtn.addEventListener('click', closeOrderModal);
submitOrderBtn.addEventListener('click', submitOrder);

async function submitOrder() {
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const commentInput = document.getElementById('commentInput');

  let valid = true;
  [nameInput, phoneInput, commentInput].forEach(el => {
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });

  if (!valid) {
    iziToast.warning({
      title: 'Увага!',
      message: 'Будь ласка, заповніть всі поля форми.',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  try {
    await axios.post(`${BASE_URL}/orders`, {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      comment: commentInput.value.trim(),
      dessertId: currentDessertId,
    });

    iziToast.success({
      title: 'Успішно!',
      message:
        'Ваше замовлення прийнято. Ми зателефонуємо вам найближчим часом.',
      position: 'topRight',
      timeout: 4000,
    });

    closeOrderModal();
  } catch (error) {
    iziToast.error({
      title: 'Помилка!',
      message: 'Не вдалося відправити замовлення. Спробуйте пізніше.',
      position: 'topRight',
      timeout: 4000,
    });
  }
}
