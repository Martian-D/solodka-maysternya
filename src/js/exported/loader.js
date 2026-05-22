export function showLoader() {
  const loader = document.querySelector('.loader-backdrop');
  loader.classList.remove('is-hidden');
}

export function hideLoader() {
  const loader = document.querySelector('.loader-backdrop');
  loader.classList.add('is-hidden');
}