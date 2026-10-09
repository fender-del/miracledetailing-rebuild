/* ============================================================
   story.js — "The man behind the work" (Fender 02/10).

   Desktop (≥1024 wide, ≥680 tall): the block pins while the scroll
   plays one timeline —
     beat 1  Since 1988; the sentence lights up word by word, the
             figures count
     beat 2  slides in from the right as beat 1 leaves to the left:
             Fifth Gear and the press, with the Sunday Mirror cutting
             sliding onto Paul's photo; lit the same way
     close   the photo and the beats go; "One detailer. Every car.
             No exceptions." grows into the middle of the screen,
             holds briefly, then fades as the services arrive
   ~2.2 screens of scrolling; the page itself never stops.

   Elsewhere the beats stack and light up as they pass; the closing
   line holds the screen (CSS sticky) while it grows and fades.
   Reduced motion never reaches this file (index.js), and without JS
   the CSS shows everything.
   ============================================================ */
import { gsap, SplitText, whenSeen, $, $$ } from './core.js';
import { sfx } from './sound.js';
import { countUp } from './reveal.js';

export function story() {
  const sec = $('[data-story]');
  if (!sec) return;
  const beats = $$('[data-beat]', sec);
  const texts = $$('[data-words]', sec);
  const fig = $('[data-story-fig]', sec);
  const photo = $('.story__photo img', sec);
  const paper = $('[data-story-paper]', sec);
  const end = $('[data-story-end]', sec);
  const line = $('[data-story-line]', sec);
  const dots = $$('.story__dots li', sec);
  /* The figures count once. The mark sits on the section, not the
     figures: when the layout crosses the pin/flow line the word split
     is undone and the sentence's original HTML comes back with new
     (hidden) figure elements, which the mark keeps on screen. */
  let counted = false;
  const count = () => {
    if (counted) return;
    counted = true;
    sec.classList.add('is-counted');
    $$('[data-count]', beats[0]).forEach((el, n) => countUp(el, n * 0.15));
  };

  const mm = gsap.matchMedia();
  mm.add({
    pin: '(min-width: 1024px) and (min-height: 680px)',
    flow: '(max-width: 1023px), (max-height: 679px)'
  }, ctx => {
    /* Words of each sentence; the counting figures stay lit (gold, and
       their text is replaced as they count). */
    const words = texts.map(t => SplitText.create(t, { type: 'words', wordsClass: 'w', tag: 'span', aria: 'none' })
      .words.filter(w => !w.closest('.num')));

    if (ctx.conditions.pin) {
      sec.classList.add('is-pinned');
      gsap.set(beats[1], { autoAlpha: 0, x: 110 });
      gsap.set(paper, { xPercent: 70, yPercent: 30, rotation: 16, autoAlpha: 0 });
      gsap.set(line, { autoAlpha: 0, scale: 0.42 });

      /* Windows in timeline progress: beat 1 0–.35, beat 2 .35–.69,
         close .69–1 (3/4 of the scroll the close had before). */
      /* the close now holds longer (Fender 09/10): the timeline runs to
         1.24, so the beat marks are scaled to progress */
      const marks = [0, 0.35 / 1.24, 0.69 / 1.24, 1.01];
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sec, start: 'top top', end: '+=270%', pin: true, scrub: 0.7, anticipatePin: 1,
          /* refreshed first: everything below depends on this pin's spacer */
          refreshPriority: 1,
          onEnter: count, onEnterBack: count,
          onUpdate(self) {
            const p = self.progress;
            dots.forEach((d, i) => d.classList.toggle('is-on', p >= marks[i] && p < marks[i + 1]));
          }
        }
      });
      tl.fromTo(words[0], { opacity: 0.16 }, { opacity: 1, stagger: 0.0066, duration: 0.055 }, 0.01)
        /* beat 1 leaves to the left as beat 2 comes in from the right */
        .to(beats[0], { autoAlpha: 0, x: -110, duration: 0.07, ease: 'power2.in' }, 0.33)
        .to(beats[1], { autoAlpha: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.37)
        .call(() => sfx('beat'), null, 0.37)
        .to(paper, { xPercent: 0, yPercent: 0, rotation: -4, autoAlpha: 1, duration: 0.11, ease: 'power3.out' }, 0.38)
        .fromTo(words[1], { opacity: 0.16 }, { opacity: 1, stagger: 0.0058, duration: 0.055 }, 0.43)
        .to(beats[1], { autoAlpha: 0, x: -110, duration: 0.055, ease: 'power2.in' }, 0.685)
        .to(fig, { autoAlpha: 0, scale: 0.9, x: -40, duration: 0.088, ease: 'power2.in' }, 0.685)
        .to('.story__dots', { autoAlpha: 0, duration: 0.04 }, 0.7)
        .to(line, { autoAlpha: 1, scale: 1, duration: 0.15, ease: 'power2.out' }, 0.71)
        .call(() => sfx('swell'), null, 0.705)
        .to(line, { autoAlpha: 0, scale: 1.14, duration: 0.09, ease: 'power1.in' }, 1.15)
        .fromTo(photo, { scale: 1.1 }, { scale: 1, duration: 0.69 }, 0);
      dots[0] && dots[0].classList.add('is-on');

      return () => { sec.classList.remove('is-pinned'); };
    }

    /* Flow: each sentence lights up as it passes; beat 2 comes in from
       the right. */
    words.forEach((ws, i) => {
      gsap.fromTo(ws, { opacity: 0.16 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: texts[i], start: 'top 85%', end: 'bottom 50%', scrub: 0.6 }
      });
    });
    const b2 = gsap.from(beats[1], { autoAlpha: 0, x: 80, duration: 1.1, ease: 'expo.out', paused: true });
    whenSeen(beats[1], () => { b2.play(); sfx('beat'); }, 0.14);
    whenSeen(beats[0], count, 0.2);
    const pp = gsap.from(paper, { xPercent: 30, rotation: 12, autoAlpha: 0, duration: 1.2, ease: 'expo.out', paused: true });
    whenSeen(paper, () => pp.play(), 0.2);
    /* The closing line: grows while its sticky screen arrives, holds a
       moment, fades as it leaves. */
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: end, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
    })
      .call(() => sfx('swell'), null, 0.05)
      .fromTo(line, { autoAlpha: 0, scale: 0.28 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 0)
      .to(line, { autoAlpha: 1, duration: 0.6 })
      .to(line, { autoAlpha: 0, scale: 1.12, duration: 0.4, ease: 'power1.in' });
    return undefined;
  });
}
