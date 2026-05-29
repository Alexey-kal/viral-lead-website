import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function runPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const logo = document.getElementById('preloader-logo');
  const countEl = document.getElementById('preloader-count');
  const bar = document.getElementById('preloader-bar-fill');
  const splits = document.querySelectorAll('.preloader-split');
  const center = document.querySelector('.preloader-center');

  if (!preloader || !logo) {
    onComplete?.();
    return;
  }

  gsap.set(logo, { letterSpacing: '1em' });
  gsap.to(logo, {
    letterSpacing: '0.2em',
    duration: 2.4,
    ease: 'power3.out',
  });

  const progress = { value: 0 };

  gsap.to(progress, {
    value: 100,
    duration: 2.6,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.floor(progress.value);
      if (countEl) countEl.textContent = String(v);
      if (bar) bar.style.width = `${progress.value}%`;
    },
    onComplete: exitPreloader,
  });

  function exitPreloader() {
    if (!splits[0] || !splits[1]) {
      preloader?.remove();
      onComplete?.();
      return;
    }

    gsap.to(center, {
      opacity: 0,
      y: -24,
      duration: 0.45,
      ease: 'power2.in',
    });

    gsap.to(splits[0], {
      x: '-100%',
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.25,
    });

    gsap.to(splits[1], {
      x: '100%',
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.25,
      onComplete: () => {
        preloader.classList.add('is-done');
        preloader.setAttribute('aria-busy', 'false');
        preloader.remove();
        onComplete?.();
      },
    });
  }
}

export function initHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.hero-title .word', {
    y: 0,
    duration: 1.35,
    stagger: 0.09,
  })
    .to('.hero-label', { opacity: 1, duration: 0.8 }, '-=0.6')
    .to('.hero-foot', { opacity: 1, duration: 0.8 }, '-=0.4')
    .to('.scroll-hint', { opacity: 1, duration: 0.7 }, '-=0.3');

  setTimeout(countStats, 1200);
}

function countStats() {
  document.querySelectorAll('.stat-num[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = String(target).includes('.');

    const counter = { val: 0 };
    gsap.to(counter, {
      val: target,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate() {
        el.textContent =
          prefix +
          (isDecimal ? counter.val.toFixed(1) : Math.floor(counter.val)) +
          suffix;
      },
      onComplete() {
        el.textContent = prefix + target + suffix;
      },
    });
  });
}

export function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter() {
        el.classList.add('is-in');
      },
      once: true,
    });
  });

  ScrollTrigger.create({
    trigger: '#statement',
    start: 'top 70%',
    onEnter() {
      gsap.to('.statement-title .wi', {
        y: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.04,
      });
    },
    once: true,
  });

  const pinContainer = document.querySelector('#pin .pin-spacer');
  const words = ['Every', 'king', 'deserves', 'a', 'unique', 'haircut'];
  const wordEls = [...document.querySelectorAll('#pin .pw')];
  const pinCounter = document.getElementById('pin-counter');
  const totalWords = words.length;
  const pad2 = (n) => String(n).padStart(2, '0');

  if (pinContainer && wordEls.length === totalWords) {
    ScrollTrigger.create({
      trigger: pinContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate(self) {
        const progress = self.progress;

        wordEls.forEach((w, i) => {
          w.classList.toggle('on', progress >= i / totalWords);
        });

        const litCount = wordEls.filter((_, i) => progress >= i / totalWords).length;
        if (pinCounter) {
          pinCounter.textContent = `${pad2(litCount)} / ${pad2(totalWords)}`;
        }
      },
    });
  }

  gsap.to('.craft-video', {
    scale: 1.08,
    ease: 'none',
    scrollTrigger: {
      trigger: '#craft',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
    },
  });

  initServicePreview();
}

function initServicePreview() {
  const preview = document.getElementById('service-preview');
  if (!preview) return;
  const img = preview.querySelector('img');
  let mx = 0;
  let my = 0;
  let fx = 0;
  let fy = 0;
  let visible = false;

  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) return;
    fx += (mx + 28 - fx) * 0.12;
    fy += (my - 100 - fy) * 0.12;
    preview.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  document.querySelectorAll('.service-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      img.src = row.dataset.img || '/barber-shave.jpg';
      preview.style.opacity = '1';
      visible = true;
    });
    row.addEventListener('mouseleave', () => {
      preview.style.opacity = '0';
      visible = false;
    });
  });
}
