import { router } from './router.js';
import { api } from './utils.js';

const body = document.body;
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const refreshBtn = document.getElementById('refreshBtn');
const sidebar = document.querySelector('.sidebar');
const watchModal = document.getElementById('watchModal');
const watchContent = document.getElementById('watchContent');

function initTheme() {
  const saved = localStorage.getItem('neumoflix_theme') || 'dark';
  body.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', current);
  localStorage.setItem('neumoflix_theme', current);
}

function closeModal() {
  watchModal.classList.add('hidden');
  watchContent.innerHTML = '';
}

async function openWatchModal({ id, type, trailerKey }) {
  watchModal.classList.remove('hidden');
  watchContent.innerHTML = '<div class="loading-state">Loading player…</div>';

  let key = trailerKey;
  if (!key) {
    try {
      const data = await api(`/${type}/${id}/videos`);
      const trailer = (data.results || []).find(v => v.site === 'YouTube' && /trailer|official/i.test(v.name));
      key = trailer?.key;
    } catch (e) {}
  }

  if (key) {
    watchContent.innerHTML = `
      <h2>Now Watching</h2>
      <p class="subtle">Embedded YouTube trailer / teaser preview</p>
      <div class="video-wrap">
        <iframe src="https://www.youtube.com/embed/${key}" allowfullscreen></iframe>
      </div>
    `;
  } else {
    watchContent.innerHTML = `
      <h2>Watch Preview</h2>
      <p class="subtle">No direct trailer was found for this title right now. You can still use the detail page and continue browsing similar titles.</p>
    `;
  }
}

function bindGlobalActions() {
  document.addEventListener('click', e => {
    const watchEl = e.target.closest('[data-watch]');
    if (watchEl) {
      e.stopPropagation();
      const payload = JSON.parse(watchEl.dataset.watch);
      openWatchModal(payload);
      return;
    }

    const closeEl = e.target.closest('[data-close]');
    if (closeEl) {
      closeModal();
      return;
    }
  });
}

function bindChrome() {
  menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
  themeToggle?.addEventListener('click', toggleTheme);
  refreshBtn?.addEventListener('click', () => router());
  window.addEventListener('hashchange', router);
}

initTheme();
bindGlobalActions();
bindChrome();
router();
