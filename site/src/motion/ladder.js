/* ============================================================
   ladder.js — how block 53 behaves (07/10, the packages page; the
   data side is lib/packages.js).

   Desktop (1024+ wide, 640+ tall): the panel shows the level whose
   words cross the line 45% down the screen: its photo and name, the
   steps up to it, the gauges and the price. A step goes to its level.
   Smaller or shorter screens: nothing held (Fender 07/10: the pinned
   staircase was ugly). The levels are a row of cards to swipe, with a
   count, a bar and arrows; "What's included" opens a sheet from the
   bottom with that level's words and list (copied from the level).
   Every tier: it is how the page reads. Reduced motion: no tweening
   (the CSS turns the transitions off).
   ============================================================ */
import { ScrollTrigger, env, whenSeen, $, $$ } from './core.js';

const DESK = '(min-width: 1024px) and (min-height: 640px)';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const CLOSE = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6"/></svg>';

export function ladders() {
  $$('[data-ladder]').forEach(ladder);
}

function ladder(sec) {
  const items = $$('[data-lv]', sec);
  const panel = $('[data-pkl-panel]', sec);
  const list = $('[data-pkl-list]', sec);
  const deck = $('[data-pkl-deck]', sec);
  if (!items.length || !panel) return;
  const pics = $$('[data-pic]', panel), names = $$('[data-nm]', panel), steps = $$('[data-go]', panel);
  const roman = $('[data-roman]', panel), price = $('[data-price]', panel);
  const gt = $('[data-g=time]', panel), gl = $('[data-g=life]', panel), gs = $('[data-g=stages]', panel);
  const pips = gs ? $$('.pkl__pips li', gs) : [];
  const prices = items.map(li => { const p = $('.pkl__p', li); return p ? p.innerHTML : ''; });
  const mq = window.matchMedia(DESK);
  let cur = -1, desk = false, hold = 0, raf = 0, t = 0;

  const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 120); };
  const swap = (el, fn) => {
    if (!el) return;
    if (!env.motion) { fn(); return; }
    el.classList.add('is-swap');
    setTimeout(() => { fn(); el.classList.remove('is-swap'); }, 200);
  };
  const gauge = (el, a, b, text) => {
    if (!el) return;
    el.style.setProperty('--a', a);
    el.style.setProperty('--b', b);
    $('[data-gv]', el).textContent = text || '—';
  };

  /* ---------- desktop: the panel shows level i ---------- */
  const set = i => {
    if (i === cur) return;
    cur = i;
    const d = items[i].dataset;
    items.forEach((li, j) => li.classList.toggle('is-on', j === i));
    pics.forEach((p, j) => p.classList.toggle('is-on', j === i));
    names.forEach((p, j) => p.classList.toggle('is-on', j === i));
    steps.forEach((s, j) => {
      s.classList.toggle('is-on', j === i);
      s.classList.toggle('is-done', j < i);
      if (j === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
    });
    swap(roman, () => { roman.textContent = ROMAN[i] || String(i + 1); });
    swap(price, () => { price.innerHTML = prices[i]; });
    gauge(gt, d.ta, d.tb, d.tv);
    gauge(gl, d.la, d.lb, d.lvLife);
    if (gl) { gl.toggleAttribute('data-open', 'lopen' in d); gl.toggleAttribute('data-none', 'lnone' in d); }
    if (gs) {
      $('[data-gv]', gs).textContent = d.sv || '—';
      pips.forEach((p, j) => p.classList.toggle('on', j < +(d.sn || 0)));
    }
  };

  /* the level whose words cross the line */
  const track = () => {
    raf = 0;
    if (!desk || Date.now() < hold) return;
    const line = window.innerHeight * 0.45;
    let i = 0;
    items.forEach((li, j) => { if (li.getBoundingClientRect().top <= line) i = j; });
    set(i);
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(track); };

  /* a step: to its level (its scroll-margin clears the header and bar) */
  steps.forEach(s => s.addEventListener('click', () => {
    const i = +s.getAttribute('data-go');
    const el = items[i];
    if (!el) return;
    hold = Date.now() + 1500;
    set(i);
    const off = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (env.lenis) env.lenis.scrollTo(el, { offset: -off, duration: 1.2 });
    else el.scrollIntoView({ behavior: env.motion ? 'smooth' : 'auto', block: 'start' });
  }));

  /* ---------- smaller screens: the card row ---------- */
  const row = deck && $('[data-pkl-cards]', deck);
  const cards = row ? $$('.pkc', row) : [];
  const nEl = deck && $('[data-pkl-n]', deck), prog = deck && $('[data-pkl-prog]', deck);
  const prev = deck && $('[data-pkl-prev]', deck), next = deck && $('[data-pkl-next]', deck);
  let at = 0, rq = 0;
  const pitch = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : row.clientWidth);
  const count = () => {
    rq = 0;
    if (!row) return;
    const max = row.scrollWidth - row.clientWidth;
    at = row.scrollLeft >= max - 4 ? cards.length - 1 : Math.round(row.scrollLeft / pitch());
    if (nEl) nEl.textContent = String(at + 1).padStart(2, '0');
    if (prog) { prog.parentNode.style.setProperty('--n', cards.length); prog.parentNode.style.setProperty('--p', at); }
    if (prev) prev.disabled = row.scrollLeft < 4;
    if (next) next.disabled = row.scrollLeft >= max - 4;
  };
  const go = d => row && row.scrollBy({ left: d * pitch(), behavior: env.motion ? 'smooth' : 'auto' });
  if (row) {
    row.addEventListener('scroll', () => { if (!rq) rq = requestAnimationFrame(count); }, { passive: true });
    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
  }

  /* the sheet: one for the page, filled from the level asked for */
  let sheet = null, opener = null;
  const close = () => {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('is-open');
    document.documentElement.classList.remove('pks-lock');
    if (env.lenis) env.lenis.start();
    setTimeout(() => { sheet.hidden = true; }, env.motion ? 450 : 0);
    if (opener) opener.focus({ preventScroll: true });
  };
  const build = () => {
    sheet = document.createElement('div');
    sheet.className = 'pks';
    sheet.setAttribute('data-theme', 'light');
    sheet.hidden = true;
    sheet.innerHTML = '<div class="pks__bg" data-close></div><div class="pks__panel" role="dialog" aria-modal="true" aria-labelledby="pks-t">'
      + '<div class="pks__top" data-grab><p class="pks__kick"></p><h3 class="pks__name" id="pks-t"></h3>'
      + `<button class="pks__x" type="button" data-close aria-label="Close">${CLOSE}</button></div><div class="pks__body"></div></div>`;
    document.body.appendChild(sheet);
    $$('[data-close]', sheet).forEach(el => el.addEventListener('click', close));
    sheet.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    /* the words' own Book link: close, then let the page go to the form */
    sheet.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) close(); });
    /* a pull down on the top closes it */
    const top = $('[data-grab]', sheet), pane = $('.pks__panel', sheet);
    let y0 = null;
    top.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, { passive: true });
    top.addEventListener('touchmove', e => {
      if (y0 == null) return;
      const dy = Math.max(0, e.touches[0].clientY - y0);
      pane.style.transition = 'none';
      pane.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    top.addEventListener('touchend', e => {
      if (y0 == null) return;
      const dy = e.changedTouches[0].clientY - y0;
      y0 = null;
      pane.style.transition = ''; pane.style.transform = '';
      if (dy > 90) close();
    }, { passive: true });
  };
  const open = (i, btn) => {
    const li = items[i];
    if (!li) return;
    if (!sheet) build();
    opener = btn;
    const k = $('.pkl__kick', li), n = $('.pkl__name', li), bi = $('.pkl__bi', li);
    $('.pks__kick', sheet).innerHTML = k ? k.textContent : '';
    $('.pks__name', sheet).innerHTML = n ? n.innerHTML : '';
    const body = $('.pks__body', sheet);
    body.innerHTML = '';
    const sub = $('.pkl__sub', li);
    if (sub) body.appendChild(sub.cloneNode(true));
    if (bi) {
      const c = bi.cloneNode(true);
      $$('[data-reveal],[id]', c).forEach(el => { el.removeAttribute('data-reveal'); el.removeAttribute('id'); });
      $$('img', c).forEach(img => img.removeAttribute('loading'));
      body.appendChild(c);
    }
    body.scrollTop = 0;
    sheet.hidden = false;
    document.documentElement.classList.add('pks-lock');
    if (env.lenis) env.lenis.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
    $('.pks__x', sheet).focus({ preventScroll: true });
  };
  if (deck) $$('[data-open]', deck).forEach(b => b.addEventListener('click', () => open(+b.getAttribute('data-open'), b)));

  /* ---------- which layout ---------- */
  const fit = () => {
    desk = mq.matches;
    sec.classList.toggle('is-desk', desk);
    sec.classList.toggle('is-tabs', !desk);
    panel.hidden = !desk;
    if (list) list.hidden = !desk;
    if (deck) deck.hidden = desk;
    if (desk) { close(); track(); } else count();
    refresh();
  };
  set(0);
  fit();
  if (mq.addEventListener) mq.addEventListener('change', fit);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { onScroll(); if (!desk) count(); }, { passive: true });

  /* the gauges fill the first time they are seen */
  const seen = (el, box) => {
    if (!el) return;
    if (env.motion) whenSeen(el, () => setTimeout(() => box.classList.add('is-seen'), 200), 0.2);
    else box.classList.add('is-seen');
  };
  if (desk) { seen(panel, sec); if (deck) deck.classList.add('is-seen'); }
  else { seen(deck, deck); sec.classList.add('is-seen'); }
}
