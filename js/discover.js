import { api } from './utils.js';
import { mediaGrid, sectionTemplate, bindCommonActions } from './components.js';

export async function renderDiscover() {
  const view = document.getElementById('view');
  const heroMount = document.getElementById('heroMount');
  heroMount.innerHTML = '';
  view.innerHTML = '<div class="loading-state">Loading discover…</div>';
  const [nowPlaying, topRated, upcoming] = await Promise.all([
    api('/movie/now_playing'),
    api('/movie/top_rated'),
    api('/movie/upcoming')
  ]);
  view.innerHTML = [
    sectionTemplate('Now Playing', mediaGrid(nowPlaying.results.slice(0, 16), 'movie')),
    sectionTemplate('Top Rated', mediaGrid(topRated.results.slice(0, 16), 'movie')),
    sectionTemplate('Upcoming', mediaGrid(upcoming.results.slice(0, 16), 'movie'))
  ].join('');
  bindCommonActions(document);
}
