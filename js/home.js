import { api } from './utils.js';
import { heroTemplate, mediaGrid, sectionTemplate, chipsTemplate, bindCommonActions } from './components.js';

export async function renderHome() {
  const view = document.getElementById('view');
  const heroMount = document.getElementById('heroMount');
  view.innerHTML = '<div class="loading-state">Loading home…</div>';
  const [trending, popularMovies, popularTv] = await Promise.all([
    api('/trending/all/week'),
    api('/movie/popular'),
    api('/tv/popular')
  ]);

  heroMount.innerHTML = heroTemplate(trending.results[0], trending.results[0]?.media_type || 'movie');
  view.innerHTML = [
    sectionTemplate('Trending This Week', mediaGrid(trending.results.slice(0, 12), 'movie')),
    sectionTemplate('Popular Movies', mediaGrid(popularMovies.results.slice(0, 12), 'movie')),
    sectionTemplate('Top TV Picks', mediaGrid(popularTv.results.slice(0, 12), 'tv'))
  ].join('');
  bindCommonActions(document);
}
