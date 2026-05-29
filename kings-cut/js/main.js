import { initLenis, startLenis, destroyLenis } from './lenis-scroll.js';
import { initCursor, initMagnetic } from './cursor.js';
import { runPreloader, initHeroEntrance, initScrollAnimations } from './animations.js';
import { initGallery } from './gallery.js';
import { initMedia } from './media.js';

const site = document.getElementById('site');

let cursor = null;
let gallery = null;

function unlockPage() {
  document.body.style.overflow = '';
  site?.classList.remove('is-loading');
  site?.classList.add('is-ready');
}

function onPreloaderComplete() {
  try {
    if (!site) {
      unlockPage();
      return;
    }

    site.classList.remove('is-loading');
    site.classList.add('is-ready');

    initLenis();
    initScrollAnimations();
    gallery = initGallery();
    initMedia();
    startLenis();
    initHeroEntrance();
    initMagnetic();

    unlockPage();
  } catch (err) {
    console.error('Kings Cut init failed:', err);
    unlockPage();
  }
}

document.body.style.overflow = 'hidden';

if (site) {
  cursor = initCursor();
  runPreloader(onPreloaderComplete);
} else {
  unlockPage();
}

window.addEventListener('beforeunload', () => {
  cursor?.destroy();
  gallery?.destroy();
  destroyLenis();
});
