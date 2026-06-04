import { api } from './utils.js';
import { mediaGrid, sectionTemplate, nationsTemplate, bindCommonActions } from './components.js';

const countries = [
  { code: 'US', label: 'USA' },
  { code: 'KR', label: 'Korea' },
  { code: 'IN', label: 'India' },
  { code: 'JP', label: 'Japan' },
  { code: 'NG', label: 'Nigeria' },
  { code: 'GB', label: 'UK' }
];

export async function renderNations() {
  const view = document.getElementById('view');
  const heroMount = document.getElementById('heroMount');
  heroMount.innerHTML = '';
  let current = 'US';

  async function load() {
    view.innerHTML = `
      <section class="section-block">
        <div class="section-head">
          <h3 class="section-title">Trending by nationality</h3>
        </div>
        ${nationsTemplate(countries, current)}
        <div id="nationResults" class="top-gap"><div class="loading-state">Loading…</div></div>
      </section>
    `;

    const data = await api('/discover/movie', { with_origin_country: current, sort_by: 'popularity.desc' });
    document.getElementById('nationResults').innerHTML = mediaGrid((data.results || []).slice(0, 18), 'movie');

    document.querySelectorAll('[data-nation]').forEach(btn => {
      btn.addEventListener('click', () => {
        current = btn.dataset.nation;
        load();
      });
    });

    bindCommonActions(document);
  }

  await load();
}
