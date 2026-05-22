export function showLoader() {
  document.querySelector('.loader-backdrop')?.classList.remove('hidden');
}

export function hideLoader() {
  document.querySelector('.loader-backdrop')?.classList.add('hidden');
}