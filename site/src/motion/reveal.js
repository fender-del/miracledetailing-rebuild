/* ============================================================
   reveal.js — entrances and scroll-linked motion: headings, eyebrows,
   text, cards and rows arriving, counters, parallax, image blur-up.
   ============================================================ */
import { gsap, ScrollTrigger, SplitText, env, whenSeen, $, $$ } from './core.js';

const EASE = 'expo.out';

/* Entrances (Fender 02/10: "make scrolling more fun"). Each kind of
   thing arrives its own way:
     headings   words flip up out of their line, one after another
     eyebrows   the diamond spins in, the words wipe in after it
     text       rises out of a soft blur
     cards      a curtain opens upwards while the photo settles
     rows       slide in from the right, one after another
   Everything is set up once, plays once, and leaves no inline styles
   behind that the CSS did not start with. */

/* Headings: split into lines (masks) and words; each word turns up
   from behind its line like a page being flipped. Split only when the
   heading reaches the screen: splitting all of them at load cost a
   phone ~1s of style and layout before the hero could paint. */
export function lines() {
  $$('[data-split]').forEach(el => {
    if (el.getAttribute('data-split') === 'hero') { heroLines(el); return; }
    whenSeen(el, () => SplitText.create(el, {
      type: 'lines,words', mask: 'lines', linesClass: 'ln', wordsClass: 'wd', autoSplit: true,
      /* whole words stay in each line, so screen readers read it as is
         (and a <p> may not carry the aria-label 'auto' would add) */
      aria: 'none',
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.words, {
          yPercent: 120, rotationX: -80, transformPerspective: 700, transformOrigin: '50% 100% -12px', opacity: 0,
          duration: 1.15, ease: EASE, stagger: 0.035
        });
      }
    }), 0.12);
  });
}

/* The hero slogan rises by lines: its "Perfection." is painted through
   the text (background-clip), which transformed words inside it would
   break. The CSS fallback fades it in at 1.5s; take over only if we are
   early enough for the reveal to look intended. */
function heroLines(el) {
  if (performance.now() > 1300) return;
  el.classList.add('is-split');
  SplitText.create(el, {
    type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true, aria: 'none',
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      return gsap.from(self.lines, {
        yPercent: 118, rotation: 2.5, transformOrigin: '0% 100%',
        duration: 1.3, ease: EASE, stagger: 0.1, delay: env.loader ? 0.85 : 0.3
      });
    }
  });
}

const kinds = {
  eyebrow(batch) {
    batch.forEach((el, n) => {
      const mark = $('.eyebrow__mark', el);
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(el, { clipPath: 'inset(-20% 100% -20% 0%)' }, {
        clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.2, ease: 'expo.inOut', delay: n * 0.08 + 0.1, clearProps: 'clipPath'
      });
      if (mark) gsap.fromTo(mark, { scale: 0, rotation: -135 }, { scale: 1, rotation: 45, duration: 1, ease: 'back.out(2)', delay: n * 0.08, clearProps: 'transform' });
    });
  },
  text(batch) {
    gsap.fromTo(batch, { autoAlpha: 0, y: 34, filter: 'blur(10px)' }, {
      autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: EASE, stagger: 0.09, overwrite: true, clearProps: 'filter,transform'
    });
  },
  card(batch) {
    batch.forEach((el, n) => {
      const img = $('img', el);
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 24px)', y: 70 }, {
        clipPath: 'inset(0% 0% 0% 0% round 24px)', y: 0, duration: 1.3, ease: 'expo.out', delay: n * 0.1, clearProps: 'clipPath,transform'
      });
      if (img) gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out', delay: n * 0.1, clearProps: 'transform' });
    });
  },
  row(batch) {
    gsap.fromTo(batch, { autoAlpha: 0, x: 80 }, {
      autoAlpha: 1, x: 0, duration: 1.1, ease: EASE, stagger: 0.06, overwrite: true, clearProps: 'transform'
    });
  }
};
const kindOf = el => (el.classList.contains('eyebrow') ? 'eyebrow' : (el.getAttribute('data-reveal') || 'text'));

/* Whatever comes on screen in the same frame arrives as one staggered
   batch (whenSeen: plays wherever the page was opened). */
export function fadeUps() {
  let queue = [], raf = 0;
  const flush = () => {
    raf = 0;
    const groups = {};
    queue.forEach(el => { (groups[kindOf(el)] = groups[kindOf(el)] || []).push(el); });
    queue = [];
    Object.keys(groups).forEach(k => (kinds[k] || kinds.text)(groups[k]));
  };
  whenSeen($$('[data-reveal]'), el => { queue.push(el); if (!raf) raf = requestAnimationFrame(flush); }, 0.08);
}

/* Count once, when the figure comes into view. The real number is
   already in the HTML; this only replays it. Figures inside the story
   block are counted by story.js, in step with its beats. */
const fmtFor = el => {
  const comma = el.hasAttribute('data-comma');
  return v => (comma ? Math.round(v).toLocaleString('en-GB') : String(Math.round(v)));
};
export function countUp(el, delay = 0.15) {
  const to = +el.dataset.count, from = +(el.dataset.from || 0), fmt = fmtFor(el);
  const o = { v: from };
  el.textContent = fmt(from);
  el.style.visibility = 'visible';
  gsap.to(o, {
    v: to, duration: to - from > 500 ? 2.4 : 1.8, ease: 'power3.out', delay,
    onUpdate: () => { el.textContent = fmt(o.v); },
    onComplete: () => { el.textContent = fmt(to); }
  });
}

export function counters() {
  $$('[data-count]').forEach(el => {
    if (!env.entrance) { el.style.visibility = 'visible'; return; }
    if (el.closest('[data-story]')) return;
    whenSeen(el, countUp, 0.06);
  });
}

/* Photos drift slower than their frame. Desktop only. */
export function parallax() {
  $$('[data-parallax]').forEach(w => {
    const img = $('img', w);
    if (!img) return;
    gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
      yPercent: 7, scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  const hero = $('[data-hero]');
  const media = hero && $('[data-hero-media]', hero);
  if (media) {
    /* scale pinned to 1: created while the CSS entrance (scale 1.07) is
       still running, GSAP would otherwise read and keep that scale */
    gsap.fromTo(media, { yPercent: 0, scale: 1 }, { yPercent: 12, scale: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    const copy = $('.hero__in, .shero__copy', hero);
    if (copy) gsap.to(copy, { yPercent: -14, autoAlpha: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: '30% top', end: 'bottom top', scrub: true } });
  }
}

/* Blur-up: the frame's placeholder shows until the real image decodes. */
export function blurUp() {
  $$('.media img.lz').forEach(img => {
    const m = img.closest('.media');
    const done = () => m.classList.add('is-loaded');
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
  });
}

/* "Perfection." gets a polishing pass after the intro, then now and again. */
export function shine() {
  const s = $('.shine');
  if (!s) return;
  const run = () => { s.classList.remove('is-on'); void s.offsetWidth; s.classList.add('is-on'); };
  gsap.delayedCall(env.loader ? 1.9 : 1.4, run);
  setInterval(() => { if (!document.hidden && window.scrollY < window.innerHeight) run(); }, 8000);
}

/* Photo grounds (reviews, Fender 02/10 round 5): the photo behind the
   section comes down from a slight zoom and drifts against the scroll
   while the section passes. The services' ghost logo drifts too
   (round 7). Transform only. */
export function photoBgs() {
  $$('[data-photo-bg] .media').forEach(m => {
    gsap.fromTo(m, { scale: 1.24, yPercent: -6 }, {
      scale: 1, yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: m.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  $$('[data-drift]').forEach(d => {
    gsap.fromTo(d, { yPercent: -14 }, {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: d.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}
