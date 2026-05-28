import axios from 'axios';
import { BASE_URL } from '../exported/constants.js';
import iziToast from 'izitoast';

let currentDessertId = null;

const overlay2        = document.getElementById('overlay2');
const closeContactBtn = document.getElementById('closeContactBtn');
const form            = document.getElementById('orderForm');
const successMsg      = document.getElementById('successMsg');

const nameInput    = document.getElementById('nameInput');
const phoneInput   = document.getElementById('phoneInput');
const commentInput = document.getElementById('commentInput');

// ── Field-level error helpers (match CSS: .is-invalid + .has-error on group) ──

function setError(input, show) {
  // Group id convention: group-name, group-phone, group-comment
  const groupId = input.id.replace('Input', '');
  const group   = document.getElementById('group-' + groupId);

  if (show) {
    input.classList.add('is-invalid');
    group?.classList.add('has-error');
  } else {
    input.classList.remove('is-invalid');
    group?.classList.remove('has-error');
  }
}

function clearAllErrors() {
  [nameInput, phoneInput, commentInput].forEach(el => setError(el, false));
}

// Clear error as soon as the user starts correcting a field
[nameInput, phoneInput, commentInput].forEach(el => {
  el.addEventListener('input', () => setError(el, false));
});

// ── Validation ────────────────────────────────────────────────────────────────

function validatePhone(value) {
  // Accepts: +380XXXXXXXXX | 380XXXXXXXXX | 0XXXXXXXXX  (spaces/dashes/parens ignored)
  return /^(\+?38)?0\d{9}$/.test(value.replace(/[\s\-()+]/g, ''));
}

function validate() {
  let valid = true;

  if (!nameInput.value.trim()) {
    setError(nameInput, true);
    valid = false;
  }

  if (!validatePhone(phoneInput.value.trim())) {
    setError(phoneInput, true);
    valid = false;
  }

  if (!commentInput.value.trim()) {
    setError(commentInput, true);
    valid = false;
  }

  return valid;
}

// ── Modal open / close ────────────────────────────────────────────────────────

export function openOrderModal(dessert) {
  currentDessertId = dessert._id;

  // Reset form content and all error states
  form.reset();
  clearAllErrors();

  // Always show form, hide success screen
  form.style.display      = 'block';
  successMsg.style.display = 'none';

  overlay2.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus first field for accessibility
  closeContactBtn?.focus();

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

// ── Event listeners ───────────────────────────────────────────────────────────

overlay2.addEventListener('click', e => {
  if (e.target === overlay2) closeOrderModal();
});

closeContactBtn.addEventListener('click', closeOrderModal);

//  Listen on form submit, not button click — works with type="submit"
form.addEventListener('submit', async e => {
  e.preventDefault();

  if (!validate()) {
    // Move focus to the first invalid field
    const firstInvalid = form.querySelector('.is-invalid');
    firstInvalid?.focus();
    return;
  }

  // Disable button to prevent double-submit
  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;

  try {
    await axios.post(`${BASE_URL}/orders`, {
      name:      nameInput.value.trim(),
      phone:     phoneInput.value.trim(),
      comment:   commentInput.value.trim(),
      dessertId: currentDessertId,
    });

    //  Show in-modal success screen instead of closing immediately
    form.style.display       = 'none';
    successMsg.style.display = 'block';

  } catch {
    iziToast.error({
      title:    'Помилка!',
      message:  'Не вдалося відправити замовлення. Спробуйте пізніше.',
      position: 'topRight',
      timeout:  4000,
    });
  } finally {
    submitBtn.disabled = false;
  }
});
