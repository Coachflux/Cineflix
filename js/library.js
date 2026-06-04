const KEY = 'neumoflix_library';

import { mediaGrid, sectionTemplate, bindCommonActions } from './components.js';

export function getLibrary() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveLibrary(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToLibrary(item) {
  const items = getLibrary();
  if (!items.find(x => x.id === item.id && x.type === item.type)) {
    items.unshift(item);
    saveLibrary(items);
  }
}

export function removeFromLibrary(type, id) {
  saveLibrary(getLibrary().filter(x => !(x.type === type && x.id === id)));
}

export function inLibrary(type, id) {
  return getLibrary().some(x => x.type === type && x.id === id);
}

export async function renderLibraryPage() {
  const view = document.getElementById('view');
  const heroMount = document.getElementById('heroMount');
  heroMount.innerHTML = '';
  const items = getLibrary();
  view.innerHTML = sectionTemplate('My Library', mediaGrid(items, 'movie'));
  bindCommonActions(document);
}
