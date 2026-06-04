import { api } from './utils.js';
import { detailTemplate, bindCommonActions } from './components.js';

export async function renderDetail(type, id) {
  const view = document.getElementById('view');
  const heroMount = document.getElementById('heroMount');
  heroMount.innerHTML = '';
  view.innerHTML = '<div class="loading-state">Loading details…</div>';

  const [item, videosRes, similarRes] = await Promise.all([
    api(`/${type}/${id}`),
    api(`/${type}/${id}/videos`),
    api(`/${type}/${id}/similar`)
  ]);

  const { mediaGrid, sectionTemplate } = await import('./components.js');

  view.innerHTML = `
    ${detailTemplate(item, type, videosRes.results || [])}
    ${sectionTemplate('More Like This', mediaGrid((similarRes.results || []).slice(0, 12), type))}
  `;

  bindCommonActions(document);
}
