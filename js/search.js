import { api } from './utils.js';
import { mediaGrid, sectionTemplate, bindCommonActions } from './components.js';

export async function renderSearch() {
  const view = document.getElementById('view');
  const heroMount = document.getElementById('heroMount');
  heroMount.innerHTML = '';
  view.innerHTML = `
    <section class="section-block">
      <div class="search-bar">
        <input id="searchInput" placeholder="Search movies or TV shows…" />
        <select id="searchType">
          <option value="multi">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <button class="primary-btn" id="searchBtn">Search</button>
      </div>
      <div id="searchResults" class="top-gap"></div>
    </section>
  `;

  const input = document.getElementById('searchInput');
  const type = document.getElementById('searchType');
  const btn = document.getElementById('searchBtn');
  const results = document.getElementById('searchResults');

  async function runSearch() {
    const q = input.value.trim();
    if (!q) {
      results.innerHTML = '<div class="empty-state">Type something to search.</div>';
      return;
    }
    results.innerHTML = '<div class="loading-state">Searching…</div>';
    const data = await api(`/search/${type.value}`, { query: q, include_adult: false });
    results.innerHTML = sectionTemplate(`Results for “${q}”`, mediaGrid((data.results || []).slice(0, 24), type.value === 'tv' ? 'tv' : 'movie'));
    bindCommonActions(results);
  }

  btn.addEventListener('click', runSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });
}
