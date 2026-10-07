/* ============================================================
   video.js — the hero loop. Loaded only after the page has painted
   (the poster is the LCP), never with reduced motion or Save-Data,
   paused while off screen. If autoplay is refused (iOS Low Power
   Mode, some in-app browsers) the poster simply stays.

   Three files: the 5:4 loop up to 900px wide (phones, portrait
   tablets), 1920 for ordinary screens, 2560 when the screen has the
   pixels for it. data-start (optional) skips into the loop on the
   first play.
   ============================================================ */
import { env, $ } from './core.js';

const pick = v => {
  if (window.matchMedia('(max-width: 900px)').matches) return v.dataset.srcM;
  return window.innerWidth * (window.devicePixelRatio || 1) > 2000 ? v.dataset.srcD : v.dataset.srcT;
};

export function heroVideo() {
  const v = $('.hero__video');
  if (!v || !env.motion) return;
  const c = navigator.connection;
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;

  v.muted = true;
  v.playsInline = true;
  let started = false;

  const start = () => {
    if (started) return;
    started = true;
    v.src = pick(v);
    const at = parseFloat(v.dataset.start) || 0;
    if (at) v.addEventListener('loadedmetadata', () => { v.currentTime = at; }, { once: true });
    v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };
  const later = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 400));
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (!started) return;
      if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else v.pause();
    }).observe(v);
  }
}
