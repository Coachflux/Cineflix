import { api } from './utils.js';
import { mediaGrid, sectionTemplate, bindCommonActions } from './components.js';

export async function renderTv() {
  const view = document.getElementById('view');
  const heroMount = document.getElementById('heroMount');
  heroMount.innerHTML = '';
  view.innerHTML = '<div class="loading-state">Loading TV shows…</div>';
  const [airingToday, onTheAir, topRated] = await Promise.all([
    api('/tv/airing_today'),
    api('/tv/on_the_air'),
    api('/tv/top_rated')
  ]);
  view.innerHTML = [
    sectionTemplate('Airing Today', mediaGrid(airingToday.results.slice(0, 12), 'tv')),
    sectionTemplate('On The Air', mediaGrid(onTheAir.results.slice(0, 12), 'tv')),
    sectionTemplate('Top Rated TV', mediaGrid(topRated.results.slice(0, 12), 'tv'))
  ].join('');
  bindCommonActions(document);
}
