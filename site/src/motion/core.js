/* ============================================================
   core.js — shared plumbing for the motion modules.
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, Draggable };

const mq = q => window.matchMedia(q).matches;
const root = document.documentElement;

export const env = {
  /* motion allowed at all */
  motion: !mq('(prefers-reduced-motion: reduce)'),
  /* a real mouse: cursor, tilt, magnetic, Lenis, drag strip */
  fine: mq('(hover: hover) and (pointer: fine)'),
  /* the head script armed the hidden pre-states and the watchdog has not
     disarmed them, so entrance animations may start from hidden */
  entrance: root.classList.contains('js-motion'),
  /* first view of the session: the preloader is on screen */
  loader: root.classList.contains('show-ld'),
  lenis: null
};

export const $ = (s, c) => (c || document).querySelector(s);
export const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

/* One-shot entrances: run fn(el) the first time el is on screen.
   IntersectionObserver, not ScrollTrigger: the story pin is built after
   the fonts load and pushes everything below it ~2 screens down, and a
   page opened at #book or #projects left those one-shot triggers never
   firing (the form stayed hidden). An observer only asks "is it on
   screen now?", so where the page started does not matter.
   `bottom` = how far up from the bottom edge it must come (fraction). */
export function whenSeen(els, fn, bottom = 0.1) {
  const list = Array.isArray(els) ? els : [els];
  if (!('IntersectionObserver' in window)) { list.forEach(fn); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      fn(e.target);
    });
  }, { rootMargin: `0px 0px -${Math.round(bottom * 100)}% 0px` });
  list.forEach(el => io.observe(el));
}

/* A damped spring on one numeric value, stepped on GSAP's ticker.
   Under-damped on purpose: things settle with a small overshoot, the
   way a sprung part does, never with a hard stop. */
export function spring(apply, { k = 170, c = 16 } = {}) {
  let x = 0, v = 0, target = 0, on = false;
  const tick = (t, dt) => {
    const s = Math.min(dt / 1000, 1 / 30);
    v += (-k * (x - target) - c * v) * s;
    x += v * s;
    if (Math.abs(v) < 0.002 && Math.abs(x - target) < 0.002) {
      x = target; v = 0; on = false; gsap.ticker.remove(tick);
    }
    apply(x);
  };
  return to => {
    target = to;
    if (!on) { on = true; gsap.ticker.add(tick); }
  };
}
