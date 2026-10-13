/* ============================================================
   ppf.js — the long service pages (PPF first, 06/10: Paul's text kept
   whole, so the page has to carry it well).

   Always (any tier, these are how the page works):
     snav()      the "on this page" bar lights the section on screen
     more()      phones: long text folds after a few lines + Read more
     tabs()      options as tabs ([data-tabs]: PPF's three finishes)
     coverage()  the PPF coverage photos: packages, panels, labels
   Motion only:
     lit()       the statement's words light up as it scrolls through
     (coverage's sheen over the film and the views' swap)
   ============================================================ */
import { gsap, ScrollTrigger, env, whenSeen, $, $$ } from './core.js';

const PHONE = '(max-width: 767px)';
const ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8"/></svg>';

/* ---------- On this page ---------- */
export function snav() {
  const bar = $('[data-snav]');
  if (!bar || !('IntersectionObserver' in window)) return;
  const links = $$('[data-snav-link]', bar);
  const secs = links.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  const list = $('.snav__list', bar);
  let cur = null;
  const light = id => {
    if (id === cur) return;
    cur = id;
    links.forEach(a => {
      const on = a.hash.slice(1) === id;
      a.classList.toggle('is-on', on);
      if (on) {
        a.setAttribute('aria-current', 'true');
        /* keep the lit one in view on a phone, without moving the page */
        const l = a.offsetLeft - list.offsetLeft, r = l + a.offsetWidth;
        if (l < list.scrollLeft || r > list.scrollLeft + list.clientWidth) list.scrollTo({ left: l - 16, behavior: 'smooth' });
      } else a.removeAttribute('aria-current');
    });
  };
  /* the section crossing a line a third of the way down the screen */
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) light(e.target.id); });
  }, { rootMargin: '-33% 0px -66% 0px' });
  secs.forEach(s => io.observe(s));
  /* above the first section: nothing lit */
  const top = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cur = null; links.forEach(a => { a.classList.remove('is-on'); a.removeAttribute('aria-current'); }); } });
  const hero = $('[data-hero]');
  if (hero) top.observe(hero);
}

/* ---------- Read more (phones) ---------- */
export function more() {
  const boxes = $$('[data-more]');
  if (!boxes.length) return;
  const mq = window.matchMedia(PHONE);
  boxes.forEach(box => {
    const body = $('.more__body', box);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'more__btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span>Read more</span>' + ARROW;
    box.appendChild(btn);
    btn.addEventListener('click', () => {
      const open = box.classList.toggle('is-folded') === false;
      btn.setAttribute('aria-expanded', String(open));
      btn.firstChild.textContent = open ? 'Read less' : 'Read more';
      if (!open) {
        const y = box.getBoundingClientRect().top;
        if (y < 0) window.scrollBy({ top: y - 120, behavior: 'smooth' });
      }
      ScrollTrigger.refresh();
    });
    box._fit = () => {
      box.classList.remove('is-foldable', 'is-folded');
      if (!mq.matches) return;
      /* fold only what is clearly longer than the fold: --fold per block
         (07/10: about three lines of Paul's prose, Fender 06/10) */
      const cs = getComputedStyle(body);
      const fold = parseFloat(cs.fontSize) * (parseFloat(cs.getPropertyValue('--fold')) || 13.5);
      /* …and only when it hides at least two and a half lines: a button
         that saves one line is noise */
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.65;
      if (body.scrollHeight > Math.max(fold * 1.3, fold + lh * 2.5)) {
        box.classList.add('is-foldable', 'is-folded');
        btn.setAttribute('aria-expanded', 'false');
        btn.firstChild.textContent = 'Read more';
      }
    };
    box._fit();
  });
  const refit = () => { boxes.forEach(b => b._fit()); ScrollTrigger.refresh(); };
  if (mq.addEventListener) mq.addEventListener('change', refit);
  /* a folded box inside a hidden tab measures 0: fit it when it shows */
  document.addEventListener('tabshown', e => { $$('[data-more]', e.target).forEach(b => b._fit()); });
}

/* ---------- Tabs ---------- */
function tablist(root, tabSel, panelSel, onShow) {
  const tabs = $$(tabSel, root);
  const panels = $$(panelSel, root);
  const show = (i, focus) => {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    panels.forEach((p, j) => { p.hidden = i !== j; });
    if (focus) tabs[i].focus();
    panels[i].dispatchEvent(new CustomEvent('tabshown', { bubbles: true }));
    if (onShow) onShow(i);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { if (t.getAttribute('aria-selected') !== 'true') show(i); });
    t.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); show(e.key === 'Home' ? 0 : tabs.length - 1, true); return; }
      if (!d) return;
      e.preventDefault();
      show((i + d + tabs.length) % tabs.length, true);
    });
  });
  panels.forEach((p, j) => { p.hidden = j !== 0; });
  return show;
}

export function tabs() {
  $$('[data-tabs]').forEach(sec => tablist(sec, '[role=tab]', '[role=tabpanel]', () => ScrollTrigger.refresh()));
}

/* ---------- Statement, lit word by word ---------- */
export function lit() {
  /* once per page (07/10, Fender: the same effect block after block
     reads cheap): the first statement or quote lights word by word, the
     others simply rise in */
  const all = $$('[data-lit]');
  all.slice(1).forEach(p => {
    if (p.getBoundingClientRect().top < window.innerHeight) return;
    gsap.set(p, { autoAlpha: 0, y: 30 });
    whenSeen(p, () => gsap.to(p, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' }), 0.1);
  });
  all.slice(0, 1).forEach(p => {
    /* wrap every word, keeping the gold spans around theirs */
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(p);
    p.classList.add('is-split');
    const words = $$('.w', p);
    let shown = -1;
    ScrollTrigger.create({
      trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: self => {
        const k = Math.round(self.progress * words.length);
        if (k === shown) return;
        shown = k;
        words.forEach((w, i) => w.classList.toggle('is-lit', i < k));
      }
    });
  });
}

/* ---------- PPF coverage ----------
   Two photos of an M3 Touring (13/10), the film keyed on each as
   paths (lib/ppf-m3.js): .z the film, .e its cut edges, one of each
   per panel per view. The big view takes the labels; the small one
   swaps in when tapped (and glows when the line pointed at is better
   seen from its side). */
export function coverage() {
  const sec = $('[data-pc]');
  if (!sec) return;
  const D = JSON.parse($('[data-pc-data]', sec).textContent);
  const stage = $('[data-pc-stage]', sec), slot = $('[data-pc-slot]', sec), tag = $('[data-pc-tag]', sec);
  const views = $$('.pc__view', sec);
  const main = () => $('.pc__view.is-main', sec);
  const thumb = () => $('.pc__view.is-thumb', sec);
  const prefer = z => D.prefer[z] || 'front';
  const paths = views.flatMap(v => $$('.z, .e', v));
  paths.forEach(p => p.style.setProperty('--i', Math.max(0, D.order.indexOf(p.dataset.z))));
  let pkg = null, active = [];

  /* the sheen only falls on lit film: a mask of copies of the lit panels */
  const masks = () => views.forEach(v => {
    const m = $('mask', v);
    m.replaceChildren(...$$('.z', v).filter(z => active.includes(z.dataset.z)).map(z => {
      const c = z.cloneNode();
      c.removeAttribute('class'); c.removeAttribute('style'); c.setAttribute('fill', '#fff');
      return c;
    }));
  });
  let sweepId = 0;
  const sweep = () => {
    if (!env.motion) return;
    const id = ++sweepId, t0 = performance.now(), dur = 1600;
    const runs = views.map(v => {
      const vb = $('.pc__fx', v).viewBox.baseVal;
      return { g: $('linearGradient', v), from: vb.x - 900, to: vb.x + vb.width + 400 };
    });
    const tick = t => {
      if (id !== sweepId) return;
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      runs.forEach(r => r.g.setAttribute('gradientTransform', `translate(${(r.from + e * (r.to - r.from)).toFixed(1)} 0) skewX(-18)`));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ----- the label on the big view ----- */
  const label = $('b', tag);
  const hideTag = () => { tag.classList.remove('is-on'); views.forEach(v => v.classList.remove('is-hint')); };
  const showTag = (text, zs) => {
    const mv = main().dataset.view, few = zs.length < 6;
    const shown = zs.filter(z => D.has[mv].includes(z));
    /* the small view glows when one of these panels is its side's */
    thumb().classList.toggle('is-hint', few && zs.some(z => prefer(z) !== mv || !shown.includes(z)));
    const z = shown.find(z => prefer(z) === mv) || shown[0];
    if (!z || !text || !few) { tag.classList.remove('is-on'); return; }
    const [x, y] = D.anchors[mv][z];
    tag.style.setProperty('--x', x + '%');
    tag.style.setProperty('--y', y + '%');
    tag.classList.toggle('is-l', x > 58);
    tag.classList.toggle('is-d', y < 24);
    label.textContent = text;
    tag.classList.remove('is-on');
    void tag.offsetWidth;
    tag.classList.add('is-on');
  };

  /* ----- highlight: some panels bright, the rest of the film dimmed ----- */
  const items = () => $$('.pc__panel:not([hidden]) .pc__item', sec);
  const zsOf = li => li.dataset.zs.split(' ');
  const hl = (list, li) => {
    views.forEach(v => v.classList.toggle('hl', !!list));
    paths.forEach(p => p.classList.toggle('k', !!list && list.includes(p.dataset.z)));
    $$('.pc__item', sec).forEach(x => x.classList.toggle('is-on', !!list && (li ? x === li : zsOf(x).some(z => list.includes(z)) && zsOf(x).length < 6)));
  };
  const clear = () => { hl(null); hideTag(); };

  /* ----- packages ----- */
  tablist(sec, '[data-pc-tab]', '[data-pc-panel]', i => {
    const p = D.packages[i];
    if (p.key === pkg) return;
    pkg = p.key;
    active = p.zones;
    clear();
    /* off, then on again: the panels light in fitting order every time */
    paths.forEach(z => z.classList.remove('a'));
    void sec.offsetWidth;
    paths.forEach(z => z.classList.toggle('a', active.includes(z.dataset.z)));
    masks();
    sweep();
  })(0);

  /* list -> car */
  const fromItem = li => { hl(zsOf(li), li); showTag(li.textContent.trim(), zsOf(li)); };
  sec.addEventListener('pointerover', e => { const li = e.target.closest('.pc__item'); if (li) fromItem(li); });
  sec.addEventListener('focusin', e => { const li = e.target.closest('.pc__item'); if (li) fromItem(li); });
  $$('.pc__panel', sec).forEach(p => p.addEventListener('pointerleave', clear));
  sec.addEventListener('focusout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('.pc__item')) clear(); });

  /* car -> list: the panels of the big view */
  stage.addEventListener('pointerover', e => {
    const z = e.target.closest('.z');
    if (!z || !z.classList.contains('a')) return;
    const zone = z.dataset.z;
    const li = items().find(x => zsOf(x).includes(zone) && zsOf(x).length < 6);
    hl([zone], li);
    showTag(li ? li.textContent.trim() : '', [zone]);
  });
  stage.addEventListener('pointerleave', clear);

  /* ----- swap the views ----- */
  const sizes = { main: $('img', main()).sizes, thumb: $('img', thumb()).sizes };
  const roles = () => {
    const t = thumb(), m = main();
    t.setAttribute('role', 'button');
    t.tabIndex = 0;
    t.setAttribute('aria-label', `Show the ${t.dataset.view} view`);
    m.removeAttribute('role'); m.removeAttribute('tabindex'); m.removeAttribute('aria-label');
    /* the photo that is now big asks for a bigger file */
    [[m, sizes.main], [t, sizes.thumb]].forEach(([v, s]) => $$('source, img', v).forEach(el => { el.sizes = s; }));
  };
  const swap = () => {
    const m = main(), t = thumb();
    const was = [m.getBoundingClientRect(), t.getBoundingClientRect()];
    clear();
    stage.insertBefore(t, tag);
    slot.appendChild(m);
    m.classList.replace('is-main', 'is-thumb');
    t.classList.replace('is-thumb', 'is-main');
    roles();
    if (!env.motion) return;
    /* each photo grows or shrinks from where it was (same shape: one scale) */
    [[m, was[0]], [t, was[1]]].forEach(([v, r]) => {
      const n = v.getBoundingClientRect();
      v.animate([
        { transformOrigin: '0 0', transform: `translate(${r.left - n.left}px, ${r.top - n.top}px) scale(${r.width / n.width})` },
        { transformOrigin: '0 0', transform: 'none' }
      ], { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
    setTimeout(sweep, 250);
  };
  roles();
  slot.addEventListener('click', e => { if (e.target.closest('.is-thumb')) swap(); });
  slot.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.is-thumb')) {
      e.preventDefault();
      swap();
      thumb().focus();
    }
  });

  /* the sheen sweeps the first time the photos are seen */
  if (!env.entrance || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { io.disconnect(); setTimeout(sweep, 300); }
  }, { threshold: 0.3 });
  io.observe($('[data-pc-sheet]', sec));
}

/* ---------- PPF hero: the film goes on ----------
   The edge runs across at a slant from left to right. Left of it: the
   glossy layer (clip-path), a hair-wide band of "refraction" right
   behind the edge, the bright edge itself and a glint chasing it over
   the fresh film. Once across, the edge and the glint fade and the bare
   layer is never seen again. Waits for the photo, so the sweep starts
   on a decoded image. */
export function filmHero() {
  const hero = $('.shero--film');
  if (!hero || !env.motion) return;
  const media = $('[data-hero-media]', hero);
  const top = $('.film__top', hero), band = $('.film__band', hero);
  const edge = $('.film__edge', hero), glint = $('.film__glint', hero);
  const img = $('img', media);
  const TILT = Math.tan(16 * Math.PI / 180); /* slant of the edge from upright */
  const BAND = 26;
  let W = 0, H = 0;
  const size = () => { W = media.clientWidth; H = media.clientHeight; edge.style.height = Math.hypot(H, H * TILT) + 'px'; };
  /* x = where the edge meets the top; it leans back towards the bottom */
  const paint = x => {
    const b = x - H * TILT;
    top.style.clipPath = `polygon(0 0, ${x}px 0, ${b}px ${H}px, 0 ${H}px)`;
    glint.style.clipPath = top.style.clipPath;
    band.style.clipPath = `polygon(${x - BAND}px 0, ${x}px 0, ${b}px ${H}px, ${b - BAND}px ${H}px)`;
    edge.style.transform = `translateX(${x}px) rotate(16deg)`;
    glint.style.transform = `translateX(${x - W * 0.42}px)`;
  };
  const run = () => {
    size();
    hero.classList.add('is-armed');
    const s = { x: -40 };
    paint(s.x);
    const tl = gsap.timeline({ delay: 0.35 });
    tl.to(s, { x: W + H * TILT + 60, duration: 2.6, ease: 'power2.inOut', onUpdate: () => paint(s.x) })
      .to([edge, band], { opacity: 0, duration: 0.5 }, '-=0.35')
      .to(glint, { opacity: 0, duration: 0.8 }, '-=0.3')
      .add(() => {
        hero.classList.remove('is-armed');
        [top, glint, band].forEach(el => { el.style.clipPath = ''; });
        [edge, band, glint].forEach(el => { el.style.opacity = ''; });
      });
  };
  const go = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(run);
  if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
}

/* ---------- Before / after slider ----------
   A range input covers the frame: drag, tap or arrow keys move the
   divide (works with or without motion). The first time a slider is
   seen, it sweeps once to show it can move (motion only). */
export function compare() {
  const all = $$('[data-ba]');
  if (!all.length) return;
  all.forEach(ba => {
    const r = $('.ba__range', ba);
    const set = v => ba.style.setProperty('--p', v + '%');
    r.addEventListener('input', () => set(r.value));
    ba._hint = () => {
      if (!env.motion || ba._hinted) return;
      ba._hinted = true;
      const s = { v: 50 };
      gsap.timeline({ delay: 0.3 })
        .to(s, { v: 74, duration: 0.8, ease: 'power2.inOut', onUpdate: () => set(s.v) })
        .to(s, { v: 30, duration: 1.1, ease: 'power2.inOut', onUpdate: () => set(s.v) })
        .to(s, { v: 50, duration: 0.8, ease: 'power2.inOut', onUpdate: () => { set(s.v); r.value = s.v; } });
    };
  });
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && e.target.offsetParent) { io.unobserve(e.target); e.target._hint(); }
  }), { threshold: 0.5 });
  all.forEach(ba => io.observe(ba));
  /* a slider in a tab that was hidden: hint when its tab opens */
  document.addEventListener('tabshown', e => $$('[data-ba]', e.target).forEach(ba => ba._hint && ba._hint()));
}
