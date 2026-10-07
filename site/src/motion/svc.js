/* ============================================================
   svc.js — the service pages' own motion (06/10).

   (cold(), the dry ice drawing, moved to cold.js on 07/10)
   steps()  the gold line along "How a job runs" draws with the scroll.

   ============================================================ */
import { gsap, $ } from './core.js';

export function steps() {
  const line = $('[data-steps-line]');
  if (!line) return;
  gsap.fromTo(line, { scaleX: 0 }, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: line.closest('.ssteps__track'), start: 'top 78%', end: 'bottom 55%', scrub: 0.6 }
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
