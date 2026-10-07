/* ============================================================
   about.js — About Paul (rebuilt 07/10).

   timeline()   every tier with JS (it is how the story is read):
                  - the entry crossing a line 45% down the screen is the
                    one "in view": its diamond lights, the odometer rolls
                    to its year, its year is lit in the year bar
                  - the gold runs down the line as the story is read
                  - a year in the bar scrolls to its first entry
                desktop (1024+): in each run of entries with photos, the
                photos move into one stage held beside the text and change
                with the entry in view. Entries without photos are their
                own runs and read across the page (Ed 07/10: no title
                placards, no photos borrowed from another entry).
   timelinePics()  motion: each entry's words rise as they arrive; below
                desktop its photos open on a curtain (the stage has its own).
                Also the Fifth Gear cutting (pressDrift).
   ============================================================ */
import { gsap, ScrollTrigger, env, $, $$ } from './core.js';
import { sfx } from './sound.js';

const DESK = '(min-width: 1024px)';
const pad = n => String(n).padStart(2, '0');

export function timeline() {
  const tl = $('.tl');
  const list = tl && $('[data-tl]', tl);
  if (!list) return;
  const items = $$('.tl__it', list);
  const runs = $$('.tl__seg', list).filter(seg => $('[data-panels]', seg));
  const links = $$('[data-ya]', tl);
  const years = $('[data-years]', tl);
  const count = $('[data-odo-n]', tl);
  const odo = $('[data-odo]', tl);
  const word = odo && $('[data-odo-w]', odo);
  const strips = odo ? $$('.odo__d', odo).map(c => {
    c.innerHTML = '<span class="odo__s">' + '0123456789'.split('').map(d => `<span>${d}</span>`).join('') + '</span>';
    return c.firstElementChild;
  }) : [];

  let cur = -1, hold = 0, staged = false;
  const linkFor = i => {
    let best = links[0];
    links.forEach(a => { if (+a.getAttribute('data-ya') <= i) best = a; });
    return best;
  };
  const set = (i, quiet) => {
    if (i === cur || i < 0) return;
    const first = cur === -1;
    cur = i;
    items.forEach((li, j) => { li.classList.toggle('is-on', j === i); li.classList.toggle('is-past', j < i); });
    const y = items[i].getAttribute('data-label') || '';
    if (odo) {
      const isYear = /^\d{4}$/.test(y);
      odo.classList.toggle('is-word', !isYear);
      if (word) word.textContent = isYear ? '' : y;
      if (isYear) strips.forEach((s, j) => {
        s.style.transitionDelay = env.motion && !first ? (j * 0.06) + 's' : '0s';
        s.style.transitionDuration = env.motion && !first ? '' : '0s';
        s.style.setProperty('--v', y[j]);
      });
    }
    if (count) count.textContent = pad(i + 1);
    const a = linkFor(i);
    links.forEach(l => { const on = l === a; l.classList.toggle('is-on', on); if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
    /* keep the lit year in view inside the bar, without moving the page */
    if (a && years) {
      const vertical = years.scrollHeight > years.clientHeight + 2 && years.scrollWidth <= years.clientWidth + 2;
      if (vertical) years.scrollTo({ top: a.offsetTop - years.clientHeight / 2 + a.offsetHeight / 2, behavior: env.motion ? 'smooth' : 'auto' });
      else years.scrollTo({ left: a.offsetLeft - years.offsetLeft - 12, behavior: env.motion ? 'smooth' : 'auto' });
    }
    if (staged) sync(i);
    if (!first && !quiet) sfx('tap');
  };

  /* the entry crossing 45% of the screen */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && Date.now() > hold) set(items.indexOf(e.target));
    }), { rootMargin: '-45% 0px -54% 0px' });
    items.forEach(li => io.observe(li));
  }
  set(0, true);

  /* the gold down the line, the bar under the years (transforms set on
     the two lines themselves: a variable on the section would restyle
     every entry each frame) */
  const fill = $('.tl__fill', tl), bar = $('.tl__bar i', tl);
  const prog = p => {
    if (fill) fill.style.transform = `scaleY(${p.toFixed(4)})`;
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };
  ScrollTrigger.create({
    trigger: list, start: 'top 45%', end: 'bottom 45%',
    onUpdate: self => prog(self.progress), onLeave: () => prog(1), onLeaveBack: () => prog(0)
  });

  /* a year: to its first entry (the entry's scroll-margin clears the bars) */
  links.forEach(a => a.addEventListener('click', e => {
    const i = +a.getAttribute('data-ya');
    const el = items[i];
    if (!el) return;
    e.preventDefault();
    hold = Date.now() + 1600;
    set(i, true);
    const off = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (env.lenis) env.lenis.scrollTo(el, { offset: -off, duration: 1.4 });
    else el.scrollIntoView({ behavior: env.motion ? 'smooth' : 'auto', block: 'start' });
    history.replaceState(null, '', '#' + el.id);
  }));

  /* every stage shows what its run would show at this point of the
     story: the entry's own photos in its run, the first set in the runs
     still to come, the last set in the runs already read (a jump by
     year never lands beside a stage left on another entry) */
  const sync = i => runs.forEach(run => {
    const its = run._items;
    if (!its || !its.length) return;
    const a = items.indexOf(its[0]), b = items.indexOf(its[its.length - 1]);
    show((i < a ? its[0] : i > b ? its[its.length - 1] : items[i])._panel);
  });

  /* ---------- desktop: a stage per run of entries with photos ---------- */
  if (!runs.length) return;
  gsap.matchMedia().add(DESK, () => {
    const moved = [], made = [];
    runs.forEach(run => {
      const stage = $('[data-panels]', run);
      run._items = $$('.tl__it', run);
      run._items.forEach((li, k) => {
        const pics = $('[data-pics]', li);
        const ul = pics && $('.tl__photos', pics);
        if (!ul) return;
        const p = document.createElement('div');
        p.className = 'tl__panel' + (k === 0 ? ' is-on' : ' is-near');
        moved.push([ul, pics]);
        p.appendChild(ul);
        stage.appendChild(p);
        made.push(p);
        li._panel = p;
      });
    });
    staged = true;
    tl.classList.add('is-stage');
    sync(Math.max(cur, 0));
    ScrollTrigger.refresh();
    return () => {
      moved.forEach(([ul, pics]) => pics.prepend(ul));
      made.forEach(p => p.remove());
      items.forEach(li => { li._panel = null; });
      staged = false;
      tl.classList.remove('is-stage');
    };
  });
}

/* in its own stage: this panel on, the two either side mounted (their
   photos start loading) */
function show(p) {
  const all = [...p.parentNode.children];
  const i = all.indexOf(p);
  all.forEach((q, j) => {
    q.classList.toggle('is-on', j === i);
    q.classList.toggle('is-near', Math.abs(j - i) <= 2 && j !== i);
  });
}

/* ---------- entrances: words rise, photos open ----------
   ScrollTrigger.batch, not an observer: a quick flick past an entry
   still fires its onEnter, so nothing is left hidden. */
export function timelinePics() {
  pressDrift();
  const words = $$('.tl [data-tlr]');
  if (!words.length) return;
  ScrollTrigger.batch(words, {
    start: 'top 94%', once: true,
    onEnter: b => gsap.fromTo(b, { autoAlpha: 0, y: 30, filter: 'blur(8px)' }, {
      autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'filter,transform'
    })
  });
  /* below desktop the photos sit in the entries (the stage has its own) */
  if (window.matchMedia(DESK).matches) return;
  ScrollTrigger.batch($$('.tl [data-pics] .tl__ph'), {
    start: 'top 96%', once: true,
    onEnter: b => b.forEach((li, n) => {
      const img = $('img', li);
      gsap.fromTo(li, { clipPath: 'inset(100% 0% 0% 0% round 10px)', y: 36 }, {
        clipPath: 'inset(0% 0% 0% 0% round 10px)', y: 0, duration: 1.15, ease: 'expo.out', delay: n * 0.09, clearProps: 'clipPath,transform'
      });
      if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out', delay: n * 0.09, clearProps: 'transform' });
    })
  });
}

/* ---------- Fifth Gear: the Sunday Mirror cutting ----------
   It lies over the MC12's corner and rides a little slower than the
   page, so it reads as paper on top of the photo. Its tilt is CSS
   (rotate), so the transform here is only the drift. */
function pressDrift() {
  const el = $('[data-press]');
  if (!el) return;
  /* the drift where it lies over the photo (900+); on a phone it sits
     in the flow above the caption, where drifting would cover it */
  gsap.matchMedia().add('(min-width: 900px)', () => {
    gsap.fromTo(el, { y: 70 }, {
      y: -30, ease: 'none',
      scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  });
  /* it lands once, after the photo has opened */
  gsap.set(el, { autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: el.parentNode, start: 'top 80%', once: true,
    onEnter: () => gsap.to(el, { autoAlpha: 1, duration: 0.9, delay: 0.35, ease: 'power2.out' })
  });
}
