/* ============================================================
   cold.js — the dry ice page's three mechanisms (block 30, page
   src/pages/10-dry-ice.js).

     colds()   [data-cold]   Paul's before/after jobs turn over, one
                             after another, as the beats are read

   13/10 (Fender): "use all four photos; scrolling down, the photos
   change over too". The reading line runs down the beats; the stretch
   from the first beat's top to the last beat's bottom is cut into one
   share per job. Desktop: the line sits a little above the middle of
   the screen (the pair is beside the beats), so the first turn waits
   until the pair is held; tablets and phones: just under the held
   pair. Every tier; reduced motion just drops the fades.
   ============================================================ */
import { $, $$ } from './core.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = n => String(n).padStart(2, '0');

export function colds() {
  $$('[data-cold]').forEach(pair => {
    const sec = pair.closest('.cold');
    const beats = sec && $('.cold__beats', sec);
    const halves = $$('.cold__ph', pair).map(ph => $$('.cold__f', ph));
    const caps = $$('.cold__c', pair), ticks = $$('.cold__ticks i', pair);
    const digits = $('[data-cold-n]', pair);
    const N = caps.length;
    if (!beats || N < 2) return;
    const side = window.matchMedia('(min-width: 1024px)');

    let cur = 0;
    const show = i => {
      if (i === cur) return;
      cur = i;
      halves.forEach(fs => fs.forEach((f, j) => f.classList.toggle('is-on', j === i)));
      caps.forEach((c, j) => c.classList.toggle('is-on', j === i));
      ticks.forEach((t, j) => t.classList.toggle('is-on', j === i));
      if (digits) digits.textContent = pad(i + 1);
    };

    const where = () => {
      const vh = window.innerHeight, b = beats.getBoundingClientRect();
      const line = side.matches ? vh * 0.42 : Math.min(vh * 0.8, pair.getBoundingClientRect().bottom + 0.1 * vh);
      return clamp((line - b.top) / b.height, 0, 0.9999);
    };
    let raf = 0;
    const update = () => { raf = 0; show(Math.floor(where() * N)); };
    const ask = () => { if (!raf) raf = requestAnimationFrame(update); };

    /* only listen while the section is near the screen */
    let on = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting === on) return;
      on = e.isIntersecting;
      if (on) { window.addEventListener('scroll', ask, { passive: true }); window.addEventListener('resize', ask); ask(); }
      else { window.removeEventListener('scroll', ask); window.removeEventListener('resize', ask); }
    }, { rootMargin: '25% 0px' }).observe(sec);

    /* the photos further down the queue load as soon as the first job is
       near, so a turn never shows an empty frame */
    new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      $$('img[loading="lazy"]', pair).forEach(img => { img.loading = 'eager'; });
    }, { rootMargin: '100% 0px' }).observe(pair);
  });
}
