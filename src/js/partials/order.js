let currentProduct = null;

/* рендер звезд */
function renderStars(rating) {
  let html = '';

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<span>★</span>';
    } else if (i - 0.5 <= rating) {
      html += '<span style="opacity:.5">★</span>';
    } else {
      html += '<span class="empty">★</span>';
    }
  }

  return html;
}

/* открыть карточку товара */
function openModal1(product) {
  currentProduct = product;

  document.getElementById("modalImg").style.background = product.bg;
  document.getElementById("modalImg").textContent = product.emoji;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalPrice").textContent = product.price;
  document.getElementById("modalStars").innerHTML =
    renderStars(product.rating);
  document.getElementById("modalDesc").textContent = product.desc;
  document.getElementById("modalIngr").innerHTML =
    `<strong>Склад:</strong> ${product.ingredients}`;

  document.getElementById("overlay1").classList.add("active");
  document.body.style.overflow = "hidden";
}

/* закрыть первую модалку */
function closeModal1() {
  document.getElementById("overlay1").classList.remove("active");
  document.body.style.overflow = "";
}

/* клик по overlay */
function handleOverlay1Click(e) {
  if (e.target.id === "overlay1") {
    closeModal1();
  }
}

/* открыть форму заказа */
function openModal2() {
  closeModal1();

  document.getElementById("orderForm").style.display = "block";
  document.getElementById("successMsg").style.display = "none";

  document.getElementById("nameInput").value = "";
  document.getElementById("phoneInput").value = "";
  document.getElementById("commentInput").value = "";

  if (currentProduct) {
    document.getElementById("orderSubtitle").textContent =
      `${currentProduct.name} — ${currentProduct.price}`;
  }

  document.getElementById("overlay2").classList.add("active");
  document.body.style.overflow = "hidden";
}

/* закрыть форму */
function closeModal2() {
  document.getElementById("overlay2").classList.remove("active");
  document.body.style.overflow = "";
}

function handleOverlay2Click(e) {
  if (e.target.id === "overlay2") {
    closeModal2();
  }
}

/* отправка формы */
function submitOrder() {
  const name = document.getElementById("nameInput");
  const phone = document.getElementById("phoneInput");
  const comment = document.getElementById("commentInput");

  let valid = true;

  [name, phone, comment].forEach(el => {
    if (!el.value.trim()) {
      el.classList.add("error");
      valid = false;
    } else {
      el.classList.remove("error");
    }
  });

  if (!valid) return;

  document.getElementById("orderForm").style.display = "none";
  document.getElementById("successMsg").style.display = "block";
}

/* ESC */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal1();
    closeModal2();
  }
});