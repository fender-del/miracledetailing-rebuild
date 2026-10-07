/* ============================================================
   Miracle Detail — one deferred bundle (esbuild): GSAP 3.13
   (ScrollTrigger, SplitText, Draggable, InertiaPlugin) + Lenis +
   these modules. No framework.

   Three tiers, decided once at boot:
     always        menu, form, sticky bar, header state, blur-up
     motion        hero video, entrances, story beats, project deck,
                   counters, marquees, reviews loop
     motion+mouse  Lenis, cursor, tilt cards, parallax
   Sound (Web Audio) in every tier: off until the first click or tap.
   Reduced motion = the first tier only. No JS = every word still there.
   ============================================================ */
import { env, ScrollTrigger } from './core.js';
import { smooth, anchors, header, sticky, bands, lightBands, rehash } from './scroll.js';
import { cursor, tilt } from './pointer.js';
import { lines, fadeUps, counters, parallax, blurUp, shine, photoBgs } from './reveal.js';
import { marquees, reviews } from './loops.js';
import { story } from './story.js';
import { deck } from './deck.js';
import { heroVideo } from './video.js';
import { coverage } from './coverage.js';
import { sound } from './sound.js';
import { menu, form } from './ui.js';
import { cold, steps, tbcs } from './svc.js';
import { snav, more, tabs, lit, filmHero, compare, coverage as ppfCoverage } from './ppf.js';
import { gallery } from './gallery.js';
import { transitions, heroFrame, rails, stacks, samples, zooms, collages, stages, odometer, railMeta, accordions, progress } from './kit.js';

const root = document.documentElement;
const safe = fn => { try { fn(); } catch (e) { if (window.console) console.warn('[motion]', fn.name, e); } };

/* tells the head watchdog the bundle arrived (straight away: boot itself
   waits for the page to load) */
root.setAttribute('data-motion', env.motion ? (env.fine ? 'full' : 'touch') : 'off');

function boot() {

  /* First screen: what the visitor can see or reach straight away. */
  safe(smooth);
  safe(anchors);
  safe(menu);
  safe(header);
  safe(blurUp);
  safe(sound);
  safe(tbcs);
  /* long service pages (PPF, 06/10): how the page works, every tier */
  safe(snav); safe(tabs); safe(more); safe(compare); safe(ppfCoverage);
  /* the archive (06/10): filter + lightbox, every tier */
  safe(gallery);
  /* the scroll kit (07/10): how the inner pages read, every tier */
  safe(accordions); safe(railMeta); safe(odometer);
  if (env.motion) {
    safe(heroVideo);
    safe(filmHero);
    if (env.entrance) {
      safe(lines); safe(fadeUps); safe(bands); safe(lightBands);
      safe(transitions); safe(heroFrame);
      /* the story splits its manifesto into words: wait for Saira */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { safe(story); ScrollTrigger.refresh(); safe(rehash); });
      else { safe(story); safe(rehash); }
    }
    safe(counters);
    safe(shine);
    if (env.fine) { safe(cursor); safe(parallax); }
  } else {
    safe(counters); /* shows the real figures, no count */
  }

  /* Below the fold: set up once the browser is idle, so the hero paints
     and responds first. Everything here sits at least a screen down. */
  idle(() => {
    safe(form);
    safe(sticky);
    if (env.motion) {
      safe(deck);
      safe(coverage);
      safe(photoBgs);
      safe(marquees);
      safe(reviews);
      /* service pages (06/10) */
      safe(cold);
      safe(steps);
      /* the scroll kit (07/10) */
      safe(rails); safe(stacks); safe(samples); safe(zooms); safe(collages);
      if (env.entrance) safe(lit);
      if (env.fine) safe(tilt);
    }
    safe(stages); safe(progress);
    /* the pins above were made after the triggers below them: put the
       triggers back in page order before measuring */
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    /* the deck and the coverage pin change the height above #book;
       land on the hash again */
    safe(rehash);
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function idle(fn) {
  if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1200 });
  else setTimeout(fn, 300);
}

/* Let the browser load and paint the hero (the poster is the LCP)
   before any of this runs: after `load`, one frame, then a task. The
   hero's own entrance is CSS, so nothing on screen waits for this. */
const start = () => requestAnimationFrame(() => setTimeout(boot, 0));
if (document.readyState === 'complete') start();
else window.addEventListener('load', start, { once: true });
