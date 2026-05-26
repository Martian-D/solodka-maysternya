let currentProduct = null;

export function openOrderModal(product) {
  currentProduct = product;

  document.getElementById('orderForm').style.display = 'block';
  document.getElementById('successMsg').style.display = 'none';

  document.getElementById('nameInput').value = '';
  document.getElementById('phoneInput').value = '';
  document.getElementById('commentInput').value = '';

  document.getElementById('orderSubtitle').textContent =
    `${product.name} — ${product.price}`;

  document.getElementById('overlay2').classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeOrderModal() {
  document.getElementById('overlay2').classList.remove('active');
  document.body.style.overflow = '';
}

export function handleOverlayClick(e) {
  if (e.target.id === 'overlay2') {
    closeOrderModal();
  }
}

export function submitOrder() {
  const name = document.getElementById('nameInput');
  const phone = document.getElementById('phoneInput');
  const comment = document.getElementById('commentInput');

  let valid = true;

  [name, phone, comment].forEach(el => {
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });

  if (!valid) return;

  document.getElementById('orderForm').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';
}

function handleEsc(e) {
  if (e.key === 'Escape') {
    closeOrderModal();
  }
}

export function initOrderModal() {
  document.addEventListener('keydown', handleEsc);
}
