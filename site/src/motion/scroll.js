/* ============================================================
   scroll.js — Lenis (desktop only), anchor links, header, sticky
   bar, background bands, light sections.
   ============================================================ */
import Lenis from 'lenis';
import { gsap, ScrollTrigger, env, $, $$ } from './core.js';

/* Lenis on a real mouse only. Phones keep native iOS/Android momentum,
   which already behaves like the real thing. */
export function smooth() {
  if (!env.fine || !env.motion) return null;
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  env.lenis = lenis;
  return lenis;
}

/* In-page links glide (Lenis) or jump (reduced motion), then hand focus
   to the target so keyboard users land where they clicked. */
export function anchors() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || a.hasAttribute('data-menu-open') || a.hasAttribute('data-menu-close')) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    const hd = $('[data-hd]');
    const offset = -((hd && hd.offsetHeight) || 0) - 12;
    if (env.lenis) env.lenis.scrollTo(el, { offset, duration: 1.5 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: env.motion ? 'smooth' : 'auto' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  });
}

/* A page opened at /#book lands on #book. The browser jumps to the
   anchor before the story pin exists; the pin then adds ~2 screens
   above, so after it is built (story, after fonts) we jump again —
   unless the visitor has already started scrolling. */
let touched = false;
['wheel', 'touchstart', 'keydown'].forEach(t => window.addEventListener(t, () => { touched = true; }, { once: true, passive: true }));
export function rehash() {
  const id = location.hash.slice(1);
  const el = id && id !== 'menu' && document.getElementById(id);
  if (!el || touched) return;
  const hd = $('[data-hd]');
  const top = el.getBoundingClientRect().top + window.scrollY - ((hd && hd.offsetHeight) || 0) - 12;
  /* Lenis caps a jump at the page length it last measured (it re-reads
     it 250 ms after a change): the pins have just made the page longer */
  if (env.lenis) { env.lenis.resize(); env.lenis.scrollTo(top, { immediate: true, force: true }); }
  else window.scrollTo(0, top);
}

/* Header: solid once scrolled; hides going down, returns going up. */
export function header() {
  const hd = $('[data-hd]');
  if (!hd) return;
  let last = window.scrollY;
  const update = y => {
    hd.classList.toggle('is-scrolled', y > 24);
    if (!env.motion) return;
    if (y > last + 6 && y > 200 && !hd.contains(document.activeElement) && !hd.classList.contains('is-inviting')) hd.classList.add('is-hidden');
    else if (y < last - 6 || y < 200) hd.classList.remove('is-hidden');
    last = y;
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => update(self.scroll()) });
  hd.addEventListener('focusin', () => hd.classList.remove('is-hidden'));
  update(window.scrollY);
}

/* Phone bar steps aside while the form or footer is on screen. */
export function sticky() {
  const bar = $('[data-sticky]');
  if (!bar || !('IntersectionObserver' in window)) return;
  const seen = new Set();
  const io = new IntersectionObserver(es => {
    es.forEach(e => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
    bar.classList.toggle('is-away', seen.size > 0);
  }, { threshold: 0.15 });
  [$('[data-qform]'), $('#site-footer')].filter(Boolean).forEach(el => io.observe(el));
}

/* Black <-> graphite: one fixed layer behind the page fades in while a
   graphite section holds the middle of the screen. Opacity only. */
export function bands() {
  if (!env.entrance) return;
  const fx = $('.bgfx');
  $$('[data-bg=graphite]').forEach(s => ScrollTrigger.create({
    trigger: s, start: 'top 55%', end: 'bottom 45%',
    onToggle: self => gsap.to(fx, { opacity: self.isActive ? 1 : 0, duration: 0.8, ease: 'power2.out', overwrite: true })
  }));
}

/* Light sections (Fender 02/10, round 5: "so visitors don't get lost").
   The section paints its own paper colour, so text on it is always on
   the right ground; the motion is in its edges: it rises as a narrower
   panel with rounded top corners that opens out to the full width as
   it takes the screen, and closes in again as it leaves. While it holds
   the middle of the screen the page is "on light" (cursor ring). */
export function lightBands() {
  if (!env.entrance) return;
  const root = document.documentElement;
  /* the section a page arrives on with a light lays its paper down
     behind it instead (kit.js arrival); neighbouring ivory sections
     read as one */
  const arrive = (document.body.getAttribute('data-arrive') || '').split(':');
  const light = el => !!el && el.getAttribute('data-bg') === 'light';
  $$('[data-bg=light]').forEach(s => {
    ScrollTrigger.create({
      trigger: s, start: 'top 50%', end: 'bottom 50%',
      onToggle: self => root.classList.toggle('on-light', self.isActive)
    });
    if (s.id === arrive[0] && arrive[1] !== 'cut') return;
    if (!light(s.previousElementSibling)) gsap.fromTo(s, { '--cx': '5%', '--rt': '56px' }, {
      '--cx': '0%', '--rt': '0px', ease: 'none',
      scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 25%', scrub: true }
    });
    /* a pinned row (kit.js rails, scope.js levels) holds the section: its bottom edge
       would close in while it is still on screen */
    const pinned = (s.getAttribute('data-fx') === 'rail' || s.hasAttribute('data-scope-sec')) && window.matchMedia('(min-width: 1024px)').matches;
    if (!light(s.nextElementSibling) && !pinned) gsap.fromTo(s, { '--cx2': '0%', '--rb': '0px' }, {
      '--cx2': '5%', '--rb': '56px', ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: s, start: 'bottom 75%', end: 'bottom top', scrub: true }
    });
  });
}
