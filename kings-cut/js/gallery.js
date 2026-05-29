import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Lusion-style featured work — staggered grid, scroll reveal, image parallax */
export function initGallery() {
  const cards = gsap.utils.toArray('.gl-card');
  if (!cards.length) return { destroy: () => {} };

  const triggers = [];

  cards.forEach((card) => {
    const img = card.querySelector('.gl-img');

    const revealTween = gsap.fromTo(
      card,
      { y: 80, scale: 0.85, opacity: 0, rotateX: 4 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    triggers.push(revealTween.scrollTrigger);

    if (img) {
      const parallaxTween = gsap.fromTo(
        img,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
      triggers.push(parallaxTween.scrollTrigger);

      const onEnter = () => {
        gsap.to(img, {
          scale: 1.06,
          filter: 'saturate(1.2)',
          duration: 0.8,
          ease: 'power2.out',
        });
      };
      const onLeave = () => {
        gsap.to(img, {
          scale: 1,
          filter: 'saturate(1)',
          duration: 0.8,
          ease: 'power2.out',
        });
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
    }
  });

  return {
    destroy() {
      triggers.forEach((t) => t?.kill());
    },
  };
}
