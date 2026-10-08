/* ============================================================
   pairs.js — block 57, before & after (08/10, leather).
     The small photos pick the job on the stage; a sideways swipe
     across the stage on a phone goes to the next or previous one;
     arrow keys move along the picker. The first time the stage is on
     screen the section gets .is-seen and the "after" opens (CSS).
     Every tier: with reduced motion the pairs simply swap.
   ============================================================ */
import { $, $$, whenSeen } from './core.js';

export function pairs() {
  $$('[data-pairs]').forEach(sec => {
    const pick = $('[data-pairs-pick]', sec);
    const stage = $('[data-pairs-stage]', sec);
    const items = $$('[data-pair]', sec);
    const btns = pick ? $$('button', pick) : [];
    const n = $('[data-pairs-n]', sec);
    if (!pick || items.length < 2) return;
    pick.hidden = false;
    let cur = 0;

    const go = (i, focus) => {
      i = (i + items.length) % items.length;
      if (i === cur) return;
      cur = i;
      items.forEach((it, k) => it.classList.toggle('is-on', k === i));
      btns.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', String(k === i)); });
      if (n) n.textContent = String(i + 1).padStart(2, '0');
      if (focus) btns[i].focus();
    };

    btns.forEach((b, k) => {
      b.addEventListener('click', () => go(k));
      b.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(cur + 1, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(cur - 1, true); }
      });
    });

    /* a sideways swipe on the photos (a vertical one still scrolls) */
    let x0 = null, y0 = 0;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) go(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    whenSeen(stage, () => sec.classList.add('is-seen'), 0.2);
  });
}
