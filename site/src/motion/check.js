/* ============================================================
   check.js — block 58, the aftercare wash checklist (09/10), and the
   discount band's "Copy code" button.
     A ring per step ticks it off; the count, the bar and "Start again"
     follow. What is ticked is kept on this device (localStorage, read
     and written in try/catch: a private window simply forgets).
     Phones: the steps fold to one row each; ticking one folds it and
     opens the next step still to do.
     A product tag jumps to its card (on phones the card opens first)
     and the card glows once.
     Every tier: with reduced motion the same, without the easing.
   ============================================================ */
import { $, $$, env, ScrollTrigger } from './core.js';

const PHONE = '(max-width: 767px)';
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* not kept */ } }
};

export function checklists() {
  $$('[data-check]').forEach(sec => {
    const key = 'md-check:' + (sec.getAttribute('data-check') || sec.id);
    const items = $$('[data-check-it]', sec);
    const ticks = items.map(it => $('[data-check-tick]', it));
    const opens = items.map(it => $('[data-check-open]', it));
    const prog = $('[data-check-prog]', sec);
    const n = $('[data-check-n]', sec);
    const state = $('[data-check-state]', sec);
    const reset = $('[data-check-reset]', sec);
    const lede = $('[data-check-lede]', sec);
    if (!items.length) return;

    const saved = store.get(key);
    const done = items.map((_, i) => !!(Array.isArray(saved) && saved[i]));
    const mq = window.matchMedia(PHONE);
    let t = 0;
    const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 520); };

    sec.classList.add('is-live');
    ticks.forEach(b => { if (b) b.hidden = false; });
    opens.forEach(b => { if (b) b.hidden = false; });
    if (prog) prog.hidden = false;
    if (lede) lede.hidden = false;

    const nextTodo = from => {
      for (let k = 0; k < items.length; k++) { const j = (from + k) % items.length; if (!done[j]) return j; }
      return -1;
    };

    const paint = () => {
      const c = done.filter(Boolean).length;
      const next = nextTodo(0);
      items.forEach((it, i) => {
        it.classList.toggle('is-done', done[i]);
        it.classList.toggle('is-next', i === next && c > 0);
        if (ticks[i]) ticks[i].setAttribute('aria-pressed', String(done[i]));
      });
      if (n) n.textContent = String(c);
      sec.style.setProperty('--cp', (c / items.length).toFixed(3));
      sec.classList.toggle('is-done', c === items.length);
      if (state) state.textContent = c === items.length ? 'All done' : (c === 1 ? 'step done' : 'steps done');
      if (reset) reset.hidden = c === 0;
    };

    const open = (i, on) => {
      items.forEach((it, k) => {
        const o = on && k === i;
        it.classList.toggle('is-open', o);
        if (opens[k]) opens[k].setAttribute('aria-expanded', String(o));
      });
      refresh();
    };

    ticks.forEach((b, i) => b && b.addEventListener('click', () => {
      done[i] = !done[i];
      store.set(key, done);
      paint();
      /* phones: on to the next step still to do */
      if (mq.matches && done[i]) {
        const j = nextTodo(i + 1);
        open(j, j > -1);
        if (j > -1) requestAnimationFrame(() => setTimeout(() => {
          const r = items[j].getBoundingClientRect();
          const bottom = window.innerHeight - 96;
          if (r.top < 150 || r.top > bottom - 120) window.scrollBy({ top: r.top - 150, behavior: env.motion ? 'smooth' : 'auto' });
        }, 60));
      }
    }));

    opens.forEach((b, i) => b && b.addEventListener('click', () => open(i, !items[i].classList.contains('is-open'))));

    if (reset) reset.addEventListener('click', () => {
      done.fill(false);
      store.set(key, done);
      paint();
      if (mq.matches) open(0, true);
      if (ticks[0]) ticks[0].focus({ preventScroll: true });
    });

    const fit = () => {
      sec.classList.toggle('is-fold', mq.matches);
      if (mq.matches) { const j = nextTodo(0); open(j < 0 ? 0 : j, true); }
      else items.forEach(it => it.classList.remove('is-open'));
    };
    fit();
    if (mq.addEventListener) mq.addEventListener('change', () => { fit(); refresh(); });
    paint();

    /* product tags: open (phones), go to and light the card they point
       at. The page's own anchor jump is skipped: opening a card refreshes
       ScrollTrigger, which would stop a smooth scroll halfway. */
    $$('.ackl__links a[href^="#"]', sec).forEach(a => a.addEventListener('click', e => {
      const card = document.getElementById(a.getAttribute('href').slice(1));
      if (!card) return;
      e.preventDefault();
      const acc = $('.card__acc', card);
      const opening = !!(acc && card.closest('.acc-on') && !card.classList.contains('is-open'));
      if (opening) acc.click();
      card.classList.remove('is-flash');
      setTimeout(() => {
        if (env.lenis) env.lenis.scrollTo(card, { offset: -96, duration: 1.4 });
        else window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 96, behavior: env.motion ? 'smooth' : 'auto' });
        setTimeout(() => card.classList.add('is-flash'), env.motion ? 900 : 0);
        setTimeout(() => card.classList.remove('is-flash'), env.motion ? 3000 : 2000);
      }, opening ? 260 : 0);
    }));
  });
}

/* the discount band: copy the code, say so */
export function copies() {
  $$('[data-copy]').forEach(b => {
    const label = $('[data-copy-label]', b);
    const was = label ? label.textContent : '';
    b.hidden = false;
    let t = 0;
    b.addEventListener('click', () => {
      const text = b.getAttribute('data-copy');
      const ok = () => {
        b.classList.add('is-copied');
        if (label) label.textContent = 'Copied';
        clearTimeout(t);
        t = setTimeout(() => { b.classList.remove('is-copied'); if (label) label.textContent = was; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, () => fallback(text) && ok());
      else if (fallback(text)) ok();
    });
  });
}

function fallback(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  ta.remove();
  return ok;
}
