/* ============================================================
   coverage.js — the counties run past (Fender 02/10, round 5).

   The block holds the screen while the names travel from right to
   left; the one crossing the middle turns gold and its distance from
   Lingfield lights up; the studio card arrives last, in the middle.
   Each scrolled pixel moves the names ~1.7 px; the run takes about a
   screen and three quarters on a desktop, 1.3 on a phone.
   Reduced motion / no JS: the names wrap as a list.
   ============================================================ */
import { gsap, ScrollTrigger, env, $, $$ } from './core.js';
import { sfx } from './sound.js';

export function coverage() {
  const rail = $('[data-cov]');
  if (!rail || !env.motion) return;
  const sec = rail.closest('section');
  const track = $('[data-cov-track]', rail);
  const stops = $$('[data-cov-stop]', rail);
  const names = stops.map(s => $('.cov__name', s));
  const card = $('.cov__card', rail);
  sec.classList.add('is-rail');

  /* The first name starts in the middle of the screen, the card ends
     there. */
  const pad = () => gsap.set(track, {
    paddingLeft: Math.max(0, innerWidth / 2 - names[0].offsetWidth / 2),
    paddingRight: Math.max(0, innerWidth / 2 - card.offsetWidth / 2)
  });
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);

  /* Name centres along the track, measured once per refresh; each
     frame only reads the track's x. */
  let centres = [], base = 0, cur = -1;
  const measure = () => {
    const t = track.getBoundingClientRect();
    base = t.left - gsap.getProperty(track, 'x');
    centres = names.map(n => { const r = n.getBoundingClientRect(); return r.left - t.left + r.width / 2; });
  };
  const light = () => {
    const x = base + gsap.getProperty(track, 'x'), mid = innerWidth / 2, span = innerWidth * 0.36;
    let best = -1, top = 0.5;
    centres.forEach((c, i) => {
      const a = Math.max(0, 1 - Math.abs(x + c - mid) / span);
      stops[i].style.setProperty('--a', a.toFixed(3));
      if (a > top) { top = a; best = i; }
    });
    if (best !== cur) { cur = best; if (best > -1) sfx('note', best); }
  };

  pad();
  ScrollTrigger.addEventListener('refreshInit', pad);
  gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: sec, start: 'top top', end: () => '+=' + Math.round(dist() * 0.6),
      pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
      onRefresh: () => { measure(); light(); }
    },
    onUpdate: light
  });
  measure(); light();
  /* triggers made earlier further down the page refresh after this pin */
  ScrollTrigger.sort();
}
