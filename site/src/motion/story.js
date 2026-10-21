/* ============================================================
   story.js — "The man behind the work".

   Paul 19/10 (notes 2, 3, 4, 10): the pinned, scrubbed version made
   him scroll several times per section and wait for words to light
   up. Nothing pins or holds the page any more, on any screen: the
   figures count the moment the first beat is seen, the sentences are
   fully lit, beat 2 and the Sunday Mirror cutting ease in as they
   arrive, and the closing line fades up as it enters and is simply
   scrolled past.
   Reduced motion never reaches this file (index.js), and without JS
   the CSS shows everything.
   ============================================================ */
import { gsap, whenSeen, $, $$ } from './core.js';
import { countUp } from './reveal.js';

export function story() {
  const sec = $('[data-story]');
  if (!sec) return;
  const beats = $$('[data-beat]', sec);
  const paper = $('[data-story-paper]', sec);
  const line = $('[data-story-line]', sec);
  let counted = false;
  const count = () => {
    if (counted) return;
    counted = true;
    sec.classList.add('is-counted');
    $$('[data-count]', beats[0]).forEach((el, n) => countUp(el, n * 0.15));
  };

  whenSeen(beats[0], count, 0.2);
  const b2 = gsap.from(beats[1], { autoAlpha: 0, x: 80, duration: 1.1, ease: 'expo.out', paused: true });
  whenSeen(beats[1], () => { b2.play(); }, 0.14);
  const pp = gsap.from(paper, { xPercent: 30, rotation: 12, autoAlpha: 0, duration: 1.2, ease: 'expo.out', paused: true });
  whenSeen(paper, () => pp.play(), 0.2);
  const ln = gsap.from(line, { autoAlpha: 0, scale: 0.8, duration: 1.1, ease: 'expo.out', paused: true });
  whenSeen(line, () => ln.play(), 0.3);
}
