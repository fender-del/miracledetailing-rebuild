/* ============================================================
   svc.js — the service pages' own motion (06/10).

   cold()   dry ice, "−78.5°C": one drawing (gun, pellets, grime on a
            metal surface) played by the scroll while the three beats
            pass beside it (CSS sticky keeps it in view, no pin):
              I   kinetic energy  the pellets fly and strike
              II  thermal shock   frost spreads, the grime cracks,
                                  the readout falls to −78.5°C
              III sublimation     the pellets turn to gas, the grime
                                  flakes off, the bare edge shines
            The beat beside the drawing lights up; the dots follow.
   steps()  the gold line along "How a job runs" draws with the scroll.

   Reduced motion never gets here (index.js): the drawing stays the
   still frame the HTML ships, every beat lit.
   ============================================================ */
import { gsap, $, $$ } from './core.js';
import { sfx } from './sound.js';

/* where the pellets leave the gun (its tip, in SVG units) */
const TIP = { x: 172, y: 150 };
const PHASES = ['Impact', 'On contact', 'Solid to gas'];

export function cold() {
  const sec = $('[data-cold]');
  if (!sec) return;
  const svg = $('.cold__svg', sec);
  const pellets = $$('.cold__pellets rect', svg);
  const chunks = $$('.cold__grime path', svg);
  const cracks = $$('.cold__cracks path', svg);
  const puffs = $$('.cold__vapour circle', svg);
  const vapour = $('.cold__vapour', svg);
  const frost = $('.cold__frost', svg);
  const shine = $('.cold__shine', svg);
  const edge = $('.cold__edge', svg);
  const gun = $('.cold__gun', svg);
  const lblDirt = $('.cold__lbl-dirt', svg);
  const deg = $('[data-cold-deg]', sec);
  const phase = $('[data-cold-phase]', sec);
  const beats = $$('[data-cold-beat]', sec);
  const dots = $$('.cold__dots li', sec);
  const list = $('.cold__beats', sec);

  sec.classList.add('is-live');

  /* the still frame the HTML ships becomes the start of the film */
  gsap.set(pellets, { x: TIP.x, y: TIP.y, rotation: 38, opacity: 0, transformOrigin: '50% 50%' });
  gsap.set(cracks, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1 });
  gsap.set(frost, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });
  gsap.set(vapour, { opacity: 0 });
  gsap.set(puffs, { scale: 0.3, transformOrigin: '50% 50%' });
  gsap.set(chunks, { transformOrigin: '50% 100%' });

  /* each pellet strikes its own spot along the grime */
  const hit = i => ({ x: 232 + i * 20, y: 309 + (i % 3) * 3 });
  /* a little scatter, fixed so it plays the same both ways */
  const rnd = i => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  /* I · the stream: one pellet after another, gun kicking slightly */
  tl.fromTo(gun, { x: -10 }, { x: 0, duration: 0.25, ease: 'power2.out' }, 0);
  pellets.forEach((p, i) => {
    const at = 0.04 + i * 0.055;
    tl.to(p, { opacity: 1, duration: 0.03 }, at)
      .to(p, { x: hit(i).x, y: hit(i).y, rotation: 38 + (rnd(i) - 0.5) * 50, duration: 0.34, ease: 'power1.in' }, at);
  });
  tl.to(chunks, { y: 1.2, duration: 0.08, stagger: { each: 0.05, from: 'start' }, yoyo: true, repeat: 1 }, 0.4);
  /* II · the cold: frost spreads, the grime cracks */
  tl.to(frost, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 1.0)
    .to(pellets, { scale: 0.85, duration: 0.4 }, 1.05)
    .to(cracks, { strokeDashoffset: 0, duration: 0.3, stagger: 0.07 }, 1.15)
    .to(chunks, { opacity: 0.9, duration: 0.4 }, 1.3);
  /* III · solid to gas: the pellets vanish into vapour, the grime goes */
  tl.to(pellets, { scale: 0, opacity: 0, duration: 0.3, stagger: 0.02 }, 2.0)
    .to(vapour, { opacity: 0.75, duration: 0.25 }, 2.0)
    .fromTo(puffs, { scale: 0.3, y: 0 }, { scale: 1.7, y: -95, duration: 0.8, stagger: 0.03, ease: 'power1.out' }, 2.0)
    .to(vapour, { opacity: 0, duration: 0.35 }, 2.6)
    .to(cracks, { opacity: 0, duration: 0.2 }, 2.15)
    .to(chunks, {
      x: i => (i - 4) * (6 + rnd(i) * 10), y: i => -50 - rnd(i + 3) * 110, rotation: i => (rnd(i + 7) - 0.5) * 90,
      opacity: 0, duration: 0.55, stagger: { each: 0.03, from: 'center' }, ease: 'power2.out'
    }, 2.12)
    .to(lblDirt, { opacity: 0, duration: 0.25 }, 2.2)
    .to(frost, { opacity: 0.12, duration: 0.4 }, 2.35)
    .to(edge, { attr: { 'stroke-opacity': 1 }, duration: 0.3 }, 2.5)
    .fromTo(shine, { x: 0, opacity: 1 }, { x: 860, duration: 0.45, ease: 'power1.inOut' }, 2.55)
    .to({}, { duration: 0.05 }, 2.95);

  /* the readout: room temperature down to −78.5°C over the first half */
  const fmt = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(1);
  let beat = -1;
  const setBeat = b => {
    if (b === beat) return;
    if (beat !== -1) sfx('beat');
    beat = b;
    beats.forEach((el, i) => el.classList.toggle('is-on', i === b));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === b));
    if (phase) phase.textContent = PHASES[b];
  };
  const paint = p => {
    tl.progress(p);
    const t = Math.min(1, p / 0.45);
    deg.textContent = fmt(20 - 98.5 * (1 - Math.pow(1 - t, 2)));
    setBeat(Math.min(2, Math.floor(p * 3)));
  };
  paint(0);

  /* a proxy scrubbed by the scroll (smoothed), painting the film */
  const state = { p: 0 };
  gsap.to(state, {
    p: 1, ease: 'none', onUpdate: () => paint(state.p),
    scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: 0.6 }
  });
}

export function steps() {
  const line = $('[data-steps-line]');
  if (!line) return;
  gsap.fromTo(line, { scaleX: 0 }, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: line.closest('.ssteps__track'), start: 'top 78%', end: 'bottom 55%', scrub: 0.6 }
  });
}

/* "To confirm" notes open towards the page when the label sits near
   the right edge (any tier: these are for Paul and Ed, not motion). */
export function tbcs() {
  const flip = e => {
    const t = e.target.closest && e.target.closest('.tbc');
    if (t) t.classList.toggle('is-right', t.getBoundingClientRect().left + 270 > document.documentElement.clientWidth);
  };
  document.addEventListener('mouseover', flip);
  document.addEventListener('focusin', flip);
}
