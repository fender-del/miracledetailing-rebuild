/* ============================================================
   social.js — the WhatsApp chat (block 14) and the Instagram feed
   (block 64), Paul 09/11.
     waChat()    the bubble (computers) or the bar's WhatsApp button
                 (phones) opens the chat; Paul "types" for a moment, then
                 the greeting lands with "Start chat" under it (the steps
                 of his Elfsight bubble on the old site). Esc, the cross or
                 a press outside closes it. The bubble steps aside while
                 the form or the footer is on screen.
     instagram() Paul's own Elfsight Instagram feed: its script loads
                 only when the block comes near, so no page waits for it.
   ============================================================ */
import { $, $$ } from './core.js';

export function waChat() {
  const box = $('[data-wa]');
  if (!box) return;
  const panel = $('.wa__panel', box), bubble = $('.wa__bubble', box);
  const openers = $$('[data-wa-open]');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer, from = null;

  const open = o => {
    clearTimeout(timer);
    from = o;
    box.classList.remove('is-said');
    panel.hidden = false;
    box.classList.add('is-open', 'is-seen');
    openers.forEach(x => x.setAttribute('aria-expanded', 'true'));
    const t = $('[data-wa-time]', box);
    if (t) t.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    timer = setTimeout(() => box.classList.add('is-said'), still ? 0 : 1300);
    $('.wa__x', panel).focus({ preventScroll: true });
  };
  const close = () => {
    clearTimeout(timer);
    panel.hidden = true;
    box.classList.remove('is-open', 'is-said');
    openers.forEach(x => x.setAttribute('aria-expanded', 'false'));
    if (from && from.offsetParent) from.focus({ preventScroll: true });
  };

  openers.forEach(o => o.addEventListener('click', e => {
    e.preventDefault();
    if (panel.hidden) open(o); else close();
  }));
  $('[data-wa-close]', box).addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
  document.addEventListener('pointerdown', e => {
    if (!panel.hidden && !panel.contains(e.target) && !e.target.closest('[data-wa-open]')) close();
  });

  /* the bubble steps aside over the form and the footer */
  if (bubble && 'IntersectionObserver' in window) {
    const seen = new Set();
    const io = new IntersectionObserver(es => {
      es.forEach(e => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      box.classList.toggle('is-away', seen.size > 0);
    }, { threshold: 0.15 });
    [$('[data-qform]'), $('#site-footer')].filter(Boolean).forEach(el => io.observe(el));
  }
}

export function instagram() {
  const feed = $('[data-ig]');
  if (!feed) return;
  const load = () => {
    if (document.querySelector('script[src*="elfsightcdn.com/platform.js"]')) return;
    const s = document.createElement('script');
    s.src = 'https://elfsightcdn.com/platform.js';
    s.async = true;
    document.head.append(s);
  };
  if (!('IntersectionObserver' in window)) { load(); return; }
  const io = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { io.disconnect(); load(); }
  }, { rootMargin: '900px 0px' });
  io.observe(feed);
}
