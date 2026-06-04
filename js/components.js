import { imageUrl, formatTitle, formatYear, mediaTypeOf, minutesToText } from './utils.js';
import { addToLibrary, removeFromLibrary, inLibrary } from './library.js';

export function heroTemplate(item, fallbackType = 'movie') {
  if (!item) return '';
  const type = mediaTypeOf(item, fallbackType);
  return `
    <article class="hero-card" style="background-image:url('${imageUrl(item.backdrop_path || item.poster_path, 'backdrop')}')">
      <div class="overlay"></div>
      <div class="hero-content">
        <div class="hero-tag">Featured ${type.toUpperCase()}</div>
        <h2 class="hero-title">${formatTitle(item)}</h2>
        <p>${item.overview ? item.overview.slice(0, 180) + '…' : 'A featured pick for your watchlist.'}</p>
        <div class="hero-actions">
          <button class="primary-btn" data-watch='${JSON.stringify({ id: item.id, type })}'>Watch</button>
          <button class="secondary-btn" data-route="#/detail/${type}/${item.id}">Details</button>
        </div>
      </div>
      <div class="hero-side">
        <img class="hero-poster" src="${imageUrl(item.poster_path)}" alt="${formatTitle(item)}" />
      </div>
    </article>
  `;
}

export function sectionTemplate(title, inner, action = '') {
  return `
    <section class="section-block">
      <div class="section-head">
        <h3 class="section-title">${title}</h3>
        ${action ? `<div>${action}</div>` : ''}
      </div>
      ${inner}
    </section>
  `;
}

export function chipsTemplate(list = [], active = '') {
  return `<div class="category-row">${list.map(item => `<button class="category-chip" data-chip="${item.value}" ${active === item.value ? 'data-active="1"' : ''}>${item.label}</button>`).join('')}</div>`;
}

export function nationsTemplate(list = [], active = '') {
  return `<div class="nation-row">${list.map(item => `<button class="nation-chip" data-nation="${item.code}" ${active === item.code ? 'data-active="1"' : ''}>${item.label}</button>`).join('')}</div>`;
}

export function mediaGrid(items = [], fallbackType = 'movie') {
  if (!items.length) return '<div class="empty-state">Nothing found here yet.</div>';
  return `<div class="media-grid">${items.map(item => mediaCard(item, fallbackType)).join('')}</div>`;
}

export function mediaCard(item, fallbackType = 'movie') {
  const type = mediaTypeOf(item, fallbackType);
  const isSaved = inLibrary(type, item.id);
  return `
    <article class="media-card" data-route="#/detail/${type}/${item.id}">
      <div class="poster-wrap">
        <img src="${imageUrl(item.poster_path)}" alt="${formatTitle(item)}" loading="lazy" />
        <span class="poster-badge">★ ${(item.vote_average || 0).toFixed(1)}</span>
      </div>
      <div class="media-info">
        <h3>${formatTitle(item)}</h3>
        <div class="media-meta">${formatYear(item)} • ${(type || 'movie').toUpperCase()}</div>
        <div class="media-actions">
          <button class="action-chip" data-watch='${JSON.stringify({ id: item.id, type })}'>Watch</button>
          <button class="action-chip" data-lib='${JSON.stringify({ id: item.id, type, title: formatTitle(item), poster_path: item.poster_path, vote_average: item.vote_average, release_date: item.release_date, first_air_date: item.first_air_date })}'>${isSaved ? 'Saved' : 'Save'}</button>
        </div>
      </div>
    </article>
  `;
}

export function detailTemplate(item, type = 'movie', videos = []) {
  const trailer = videos.find(v => v.site === 'YouTube' && /trailer|official/i.test(v.name));
  return `
    <article class="detail-layout">
      <div>
        <img class="detail-poster" src="${imageUrl(item.poster_path)}" alt="${formatTitle(item)}" />
      </div>
      <div>
        <div class="hero-tag">${type.toUpperCase()}</div>
        <h2 class="hero-title">${formatTitle(item)}</h2>
        <p class="detail-overview">${item.overview || 'No overview available.'}</p>
        <div class="detail-meta-list">
          <span>★ ${(item.vote_average || 0).toFixed(1)}</span>
          <span>${formatYear(item)}</span>
          <span>${minutesToText(item.runtime || (item.episode_run_time?.[0] || 0))}</span>
          <span>${(item.genres || []).map(g => g.name).slice(0,3).join(' • ') || 'Drama'}</span>
        </div>
        <div class="hero-actions">
          <button class="primary-btn" data-watch='${JSON.stringify({ id: item.id, type, trailerKey: trailer?.key || '' })}'>Watch</button>
          <button class="secondary-btn" data-lib='${JSON.stringify({ id: item.id, type, title: formatTitle(item), poster_path: item.poster_path, vote_average: item.vote_average, release_date: item.release_date, first_air_date: item.first_air_date })}'>${inLibrary(type, item.id) ? 'Saved' : 'Add to Library'}</button>
        </div>
        ${(item.production_companies || []).length ? `<p class="small-note">Studios: ${item.production_companies.slice(0,4).map(c => c.name).join(', ')}</p>` : ''}
      </div>
    </article>
  `;
}

export function bindCommonActions(root = document) {
  root.querySelectorAll('[data-route]').forEach(el => {
    if (el.dataset.boundRoute) return;
    el.dataset.boundRoute = '1';
    el.addEventListener('click', e => {
      const target = el.getAttribute('data-route');
      if (target) location.hash = target.replace(/^#/, '#');
      e.stopPropagation();
    });
  });

  root.querySelectorAll('[data-lib]').forEach(el => {
    if (el.dataset.boundLib) return;
    el.dataset.boundLib = '1';
    el.addEventListener('click', e => {
      e.stopPropagation();
      const payload = JSON.parse(el.dataset.lib);
      if (inLibrary(payload.type, payload.id)) {
        removeFromLibrary(payload.type, payload.id);
        el.textContent = 'Save';
      } else {
        addToLibrary(payload);
        el.textContent = 'Saved';
      }
    });
  });
}
