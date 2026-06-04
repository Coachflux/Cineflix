import { renderHome } from './home.js';
import { renderDiscover } from './discover.js';
import { renderSearch } from './search.js';
import { renderTv } from './tv.js';
import { renderNations } from './nations.js';
import { renderDetail } from './detail.js';
import { renderLibraryPage } from './library.js';
import { setPageMeta } from './utils.js';

const routes = {
  home: { run: renderHome, title: 'Home', subtitle: 'Trending movies and TV' },
  discover: { run: renderDiscover, title: 'Discover', subtitle: 'Now playing, top rated, upcoming' },
  tv: { run: renderTv, title: 'TV Shows', subtitle: 'Airing today and top TV picks' },
  search: { run: renderSearch, title: 'Search', subtitle: 'Find movies and shows fast' },
  library: { run: renderLibraryPage, title: 'Library', subtitle: 'Your saved watchlist' },
  nations: { run: renderNations, title: 'Nations', subtitle: 'Trending by origin country' }
};

export async function router() {
  const hash = location.hash.replace('#/', '') || 'home';
  const parts = hash.split('/');
  const navLinks = document.querySelectorAll('.side-nav a');
  navLinks.forEach(a => a.classList.remove('active'));

  if (parts[0] === 'detail' && parts[1] && parts[2]) {
    setPageMeta('Details', 'Movie or TV information');
    await renderDetail(parts[1], parts[2]);
    return;
  }

  const route = routes[parts[0]] || routes.home;
  const active = document.querySelector(`.side-nav a[href="#/${parts[0]}"]`) || document.querySelector('.side-nav a[href="#/home"]');
  if (active) active.classList.add('active');
  setPageMeta(route.title, route.subtitle);
  await route.run();
}
