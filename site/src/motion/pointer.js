/* ============================================================
   pointer.js — what follows a real mouse: tilt cards. (Magnetic
   buttons and the hero lamp were dropped 02/10: calmer, Fender
   found them fussy. The gold dot + trailing ring went 13/10, Ed
   and Paul: the pointer is now the system's own, in gold, CSS.)
   None of it runs on touch or with reduced motion.
   ============================================================ */
import { gsap, spring, $, $$ } from './core.js';

/* Cards tilt up to ±6° on a spring, lift a little, and an inspection-
   lamp glint tracks the pointer across the paint. */
export function tilt() {
  $$('[data-tilt]').forEach(card => {
    const img = $('[data-tilt-img]', card), shine = $('[data-tilt-shine]', card);
    gsap.set(card, { transformPerspective: 1000 });
    const q = (n, p, u) => gsap.quickSetter(n, p, u);
    /* critically damped (c = 2√k): the card eases into place without
       wobbling past it (06/10: the bounce read as the picture jumping) */
    const rx = spring(q(card, 'rotationX', 'deg'), { k: 140, c: 24 });
    const ry = spring(q(card, 'rotationY', 'deg'), { k: 140, c: 24 });
    const ly = spring(q(card, 'y', 'px'), { k: 140, c: 24 });
    const ix = img && spring(q(img, 'x', 'px'), { k: 90, c: 19 });
    const iy = img && spring(q(img, 'y', 'px'), { k: 90, c: 19 });
    const sx = shine && gsap.quickTo(shine, 'x', { duration: 0.4, ease: 'power3' });
    const sy = shine && gsap.quickTo(shine, 'y', { duration: 0.4, ease: 'power3' });
    let box = null;
    /* Fender 06/10: pictures "jumped" under the pointer before settling.
       The card lifts and tilts away from the pointer, so near an edge the
       pointer fell off it, it dropped back, the pointer was on it again…
       The pointer is now read on the card's slot (the <li>, which never
       moves), so the card can lean without losing it. */
    const hit = card.parentElement || card;

    hit.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'mouse') return;
      box = hit.getBoundingClientRect();
      if (shine) gsap.set(shine, { x: e.clientX - box.left, y: e.clientY - box.top });
    });
    hit.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      box = box || hit.getBoundingClientRect();
      const px = (e.clientX - box.left) / box.width, py = (e.clientY - box.top) / box.height;
      /* a wide card leans less (13/10: the work photos tilt too; at the
         service card's ±6° a full-width photo swung far out at its edge) */
      const k = Math.min(1, 420 / box.width);
      rx((0.5 - py) * 12 * k); ry((px - 0.5) * 12 * k); ly(-8);
      if (img) { ix((0.5 - px) * 16); iy((0.5 - py) * 16); }
      if (shine) { sx(e.clientX - box.left); sy(e.clientY - box.top); }
    });
    hit.addEventListener('pointerleave', () => {
      box = null;
      rx(0); ry(0); ly(0);
      if (img) { ix(0); iy(0); }
    });
  });
}
