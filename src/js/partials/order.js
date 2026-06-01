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

function showError(input, message) {
  const group = input.closest('.form-group');
  const errorText = group?.querySelector('.error-text');

  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  input.setAttribute('aria-invalid', 'true');
  group?.classList.add('has-error');

  if (errorText) {
    errorText.textContent = message;
  }
}

function clearError(input) {
  const group = input.closest('.form-group');
  const errorText = group?.querySelector('.error-text');

  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  group?.classList.remove('has-error');

  if (errorText) {
    errorText.textContent = '';
  }
}

function clearAllErrors() {
  [nameInput, phoneInput, commentInput].forEach(el => {
    el.classList.remove('is-valid');
    clearError(el);
  });
}

// Clear error as soon as the user starts correcting a field
[nameInput, phoneInput, commentInput].forEach(el => {
  el.addEventListener('input', () => {
    const value = el.value.trim();

    if (value === '') {
      el.classList.remove('is-valid');
      clearError(el);
      return;
    }

    if (el === nameInput) {
      if (value.length >= 2 && value.length <= 48) {
        clearError(el);
        el.classList.add('is-valid');
      } else {
        el.classList.remove('is-valid');
      }
    }

    if (el === phoneInput) {
      if (validatePhone(value)) {
        clearError(el);
        el.classList.add('is-valid');
      } else {
        el.classList.remove('is-valid');
      }
    }

    if (el === commentInput) {
      if (value.length >= 2 && value.length <= 256) {
        clearError(el);
        el.classList.add('is-valid');
      } else {
        el.classList.remove('is-valid');
      }
    }
  });
});
nameInput.addEventListener('blur', validate);
phoneInput.addEventListener('blur', validate);
commentInput.addEventListener('blur', validate);

// ── Validation ────────────────────────────────────────────────────────────────

function validatePhone(value) {
  // Accepts Ukrainian numbers after normalization: 380XXXXXXXXX or 0XXXXXXXXX
  return /^\d{12}$/.test(value.trim());
}

function validate() {
  let valid = true;

  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  const commentValue = commentInput.value.trim();

  if (nameValue.length < 2 || nameValue.length > 48) {
    showError(nameInput, "Ім'я повинно містити від 2 до 48 символів");
    valid = false;
  } else {
    nameInput.classList.add('is-valid');
    clearError(nameInput);
  }

  if (!validatePhone(phoneValue)) {
    showError(phoneInput, 'Номер телефону повинен містити 12 цифр');
    valid = false;
  } else {
    phoneInput.classList.add('is-valid');
    clearError(phoneInput);
  }

  if (commentValue.length < 2 || commentValue.length > 256) {
    showError(commentInput, 'Коментар повинен містити від 2 до 256 символів');
    valid = false;
  } else {
    commentInput.classList.add('is-valid');
    clearError(commentInput);
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
