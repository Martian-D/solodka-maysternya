import { refs } from './refs.js';
import { state } from './constants.js';
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';

// ===== SWEETIES: Create Category and Card Markup
// Генерує картки десертiв та одну radio-кнопку категорії для desktop-версії

export function createSweetiesCardMarkup({
  _id,
  name,
  description,
  price,
  category,
  image,
}) {
  return `
    <li class="sweeties-card" data-id="${_id}">
      <img
        class="sweeties-card-image"
        src="${image}"
        alt="${name}"
        width="303"
        height="228"
        loading="lazy"
      />
      <div class="sweeties-card-text">
        <p class="sweeties-card-category">${category.name}</p>
        <h3 class="sweeties-card-title">${name}</h3>
        <p class="sweeties-card-description">${description}</p>
        <div class="sweeties-card-bottom">
          <p class="sweeties-card-price">${price} грн</p>
          <button class="sweeties-card-btn" type="button" data-id="${_id}" aria-label="Відкрити деталі десерту">
            <svg id="icon-arrow_outward" width="32" height="32" viewBox="0 0 32 32">
              <path d="M21.72 10.4l-12.795 12.804c-0.202 0.209-0.484 0.339-0.797 0.339-0.001 0-0.002 0-0.003 0h0c-0.001 0-0.002 0-0.004 0-0.311 0-0.591-0.133-0.786-0.346l-0.001-0.001c-0.213-0.201-0.345-0.485-0.347-0.8v-0q0-0.452 0.347-0.8l12.795-12.793h-11.267c-0.008 0-0.017 0-0.027 0-0.308 0-0.587-0.126-0.788-0.33l-0-0c-0.203-0.201-0.328-0.479-0.328-0.787 0-0.009 0-0.019 0-0.028l-0 0.001q0-0.483 0.328-0.805c0.202-0.2 0.481-0.324 0.788-0.324 0.010 0 0.020 0 0.029 0l-0.001-0h14q0.48 0 0.808 0.328c0.202 0.199 0.327 0.475 0.327 0.78 0 0.010-0 0.020-0 0.030l0-0.001v14q0 0.48-0.328 0.808c-0.201 0.203-0.479 0.328-0.787 0.328-0.009 0-0.019-0-0.028-0l0.001 0c-0.010 0-0.021 0-0.032 0-0.306 0-0.583-0.126-0.781-0.328l-0-0c-0.2-0.2-0.324-0.477-0.324-0.783 0-0.009 0-0.018 0-0.027l-0 0.001z"></path>
            </svg>
          </button>
        </div>
      </div>
    </li>
  `;
}

export function renderSweetiesCards(items, append = false) {
  if (!refs.sweetiesList) return;

  const markup = items.map(createSweetiesCardMarkup).join('');

  if (append) {
    refs.sweetiesList.insertAdjacentHTML('beforeend', markup);
    return;
  }
  refs.sweetiesList.innerHTML = markup;
}

//===== SWEETIES: render categories - Відмальовує desktop-категорії в fieldset.sweeties-categories.
export function createCategoryMarkup(category, checked = false) {
  return `
    <label>
      <input
        class="visually-hidden"
        type="radio"
        name="dessert-category"
        value="${category._id}"
        ${checked ? 'checked' : ''}
      />
      <span class="sweeties-category-name">${category.name}</span>
    </label>
  `;
}
export function renderCategories(categories) {
  if (!refs.categoriesBox) return;

  const allCategoryMarkup = `
    <label>
      <input
        class="visually-hidden"
        type="radio"
        name="dessert-category"
        value="all"
        checked
      />
      <span class="sweeties-category-name">Всі десерти</span>
    </label>
  `;

  const markup =
    allCategoryMarkup +
    categories.map(category => createCategoryMarkup(category)).join('');
  refs.categoriesBox.innerHTML = markup;
}

//==== SWEETIES: Render category options - Наповнює select категоріями для mobile/tablet.
export function renderCategoryOptions(categories) {
  if (!refs.categorySelect) return;

  const options = [
    `<option value="all" ${state.category === 'all' ? 'selected' : ''}>Всі десерти</option>`,
    ...categories.map(
      category =>
        `<option value="${category._id}" ${
          state.category === category._id ? 'selected' : ''
        }>${category.name}</option>`
    ),
  ];

  refs.categorySelect.innerHTML = options.join('');

  if (refs.categorySelect.tomselect) {
    refs.categorySelect.tomselect.destroy();
  }

  initTomSelect();
}

function initTomSelect() {
  if (!refs.categorySelect) return;

  refs.categorySelect.tomselect = new TomSelect(refs.categorySelect, {
    create: false,
    allowEmptyOption: false,
    controlInput: null,
    maxOptions: 20,
    dropdownClass: 'ts-dropdown sweeties-ts-dropdown',
  });

  refs.categorySelect.tomselect.on('change', () => {
    setTimeout(() => {
      refs.categorySelect.tomselect.blur();
    }, 0);
  });
}