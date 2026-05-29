import { registerCursorTick } from './lenis-scroll.js';

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) {
    document.body.classList.add('is-touch');
    return { destroy: () => {} };
  }

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return { destroy: () => {} };

  const mouse = { x: 0, y: 0 };
  const dotPos = { x: 0, y: 0 };
  const ringPos = { x: 0, y: 0 };

  const onMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const hoverables = document.querySelectorAll(
    'a, button, .service-row, .gl-card, .marquee-track span, .magnetic'
  );
  const onEnter = () => document.body.classList.add('cursor-hover');
  const onLeave = () => document.body.classList.remove('cursor-hover');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });

  registerCursorTick(() => {
    dotPos.x += (mouse.x - dotPos.x) * 0.45;
    dotPos.y += (mouse.y - dotPos.y) * 0.45;
    dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;

    ringPos.x += (mouse.x - ringPos.x) * 0.14;
    ringPos.y += (mouse.y - ringPos.y) * 0.14;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
  });

  return {
    destroy() {
      registerCursorTick(null);
      window.removeEventListener('pointermove', onMove);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    },
  };
}

export function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.32;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
