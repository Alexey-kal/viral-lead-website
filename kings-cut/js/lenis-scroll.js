import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let cursorTick = null;
let stSyncScheduled = false;
let tickerFn = null;

export function initLenis() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }

  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    wheelMultiplier: 1.1,
  });

  lenis.on('scroll', scheduleScrollTriggerSync);

  tickerFn = (time) => {
    if (!lenis) return;
    lenis.raf(time * 1000);
    cursorTick?.();
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (!lenis) return 0;
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
        return;
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  let resizeTimer;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      }, 200);
    },
    { passive: true }
  );

  ScrollTrigger.refresh();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target || !lenis) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    });
  });

  return lenis;
}

function scheduleScrollTriggerSync() {
  if (stSyncScheduled) return;
  stSyncScheduled = true;
  requestAnimationFrame(() => {
    ScrollTrigger.update();
    stSyncScheduled = false;
  });
}

export function registerCursorTick(fn) {
  cursorTick = fn;
}

export function getLenis() {
  return lenis;
}

export function stopLenis() {
  lenis?.stop();
}

export function startLenis() {
  lenis?.start();
}

export function destroyLenis() {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  lenis?.destroy();
  lenis = null;
}
