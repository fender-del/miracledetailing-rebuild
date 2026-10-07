/* ============================================================
   pointer.js — everything that follows a real mouse: cursor,
   tilt cards. (Magnetic buttons and the hero lamp were
   dropped 02/10: calmer, Fender found them fussy.)
   None of it runs on touch or with reduced motion.
   ============================================================ */
import { gsap, env, spring, $, $$ } from './core.js';

/* Dot + a hairline ring that trails it. States: link (the ring opens
   out and fades), label (from a data-cursor attribute, none at
   present), hidden over form fields. */
export function cursor() {
  const c = $('.cur');
  if (!c) return;
  const dot = $('.cur__dot', c), ring = $('.cur__ring', c), label = $('.cur__label', c);
  document.documentElement.classList.add('has-cursor', 'has-pointer');
  c.classList.add('is-hidden');

  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  let first = true;

  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (first) { gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); first = false; }
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
  }, { passive: true });

  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const t = e.target;
    const field = t.closest('input,textarea,select,iframe');
    const lab = t.closest('[data-cursor]');
    const link = t.closest('a,button,[role=tab],label,summary');
    c.classList.toggle('is-hidden', !!field);
    /* a link inside a labelled area (Explore on a project card) wins */
    if (lab && !field && !(link && link !== lab && lab.contains(link))) {
      label.textContent = lab.getAttribute('data-cursor');
      c.classList.add('is-label'); c.classList.remove('is-link');
    } else {
      c.classList.remove('is-label');
      c.classList.toggle('is-link', !!link);
    }
  });
  document.documentElement.addEventListener('mouseleave', () => c.classList.add('is-hidden'));
  document.documentElement.addEventListener('mouseenter', () => c.classList.remove('is-hidden'));
}

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
      rx((0.5 - py) * 12); ry((px - 0.5) * 12); ly(-8);
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
