/* ============================================================
   svc.js — the service pages' own motion (06/10).

   (cold(), the dry ice drawing, moved to cold.js on 07/10)
   steps()  the gold line along "How a job runs" draws with the scroll.

   ============================================================ */
import { gsap, ScrollTrigger, $, $$ } from './core.js';

export function steps() {
  const line = $('[data-steps-line]');
  if (line) gsap.fromTo(line, { scaleX: 0 }, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: line.closest('.ssteps__track'), start: 'top 78%', end: 'bottom 55%', scrub: 0.6 }
  });
  /* phones (08/10, Fender: "cuộn không có hiệu ứng đường line chạy
     theo"): a gold line fills down the numbers, each lights when reached.
     Not on the swipe rows or the aftercare progress bar. */
  gsap.matchMedia().add('(max-width: 600px)', () => {
    const made = [];
    $$('.ssteps:not(.ssteps--rail):not([data-progress])').forEach(sec => {
      const ol = $('.ssteps__list', sec), items = $$('.ssteps__it', sec);
      if (!ol || items.length < 2) return;
      sec.classList.add('is-railed');
      made.push(ScrollTrigger.create({
        trigger: ol, start: 'top 62%', end: 'bottom 62%', scrub: true,
        onUpdate: self => ol.style.setProperty('--lp', self.progress.toFixed(4))
      }));
      items.forEach(li => made.push(ScrollTrigger.create({
        trigger: li, start: 'top 62%',
        onToggle: self => li.classList.toggle('is-past', self.isActive || self.progress > 0)
      })));
      made.push({ kill: () => { sec.classList.remove('is-railed'); items.forEach(li => li.classList.remove('is-past')); } });
    });
    return () => made.forEach(t => t.kill());
  });
}

/* "To confirm" notes open towards the page when the label sits near
   the right edge (any tier: these are for Paul and Ed, not motion). */
export function tbcs() {
  const flip = e => {
    const t = e.target.closest && e.target.closest('.tbc');
    if (t) t.classList.toggle('is-right', t.getBoundingClientRect().left + 270 > document.documentElement.clientWidth);
  };
  document.addEventListener('mouseover', flip);
  document.addEventListener('focusin', flip);
}
