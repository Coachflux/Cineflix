export const TMDB_API_KEY = 'becc030248ec01bad5e0a45c4239fac3';
export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const IMG = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP = 'https://image.tmdb.org/t/p/original';

export async function api(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export function imageUrl(path, type = 'poster') {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${type === 'backdrop' ? BACKDROP : IMG}${path}`;
}

export function formatTitle(item) {
  return item.title || item.name || 'Untitled';
}

export function formatYear(item) {
  const raw = item.release_date || item.first_air_date || '';
  return raw ? raw.slice(0, 4) : '—';
}

export function mediaTypeOf(item, fallback = 'movie') {
  return item.media_type === 'tv' || fallback === 'tv' ? 'tv' : (item.media_type || fallback);
}

export function minutesToText(mins = 0) {
  if (!mins) return 'N/A';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function setPageMeta(title, subtitle = '') {
  const titleEl = document.getElementById('pageTitle');
  const subEl = document.getElementById('pageSubtitle');
  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = subtitle;
}
