/* ============================================================
   ppf.js — the long service pages (PPF first, 06/10: Paul's text kept
   whole, so the page has to carry it well).

   Always (any tier, these are how the page works):
     snav()      the "on this page" bar lights the section on screen
     more()      phones: long text folds after a few lines + Read more
     tabs()      options as tabs ([data-tabs]: PPF's three finishes)
     coverage()  the PPF drawing: packages, panels, callouts
   Motion only:
     lit()       the statement's words light up as it scrolls through
     (coverage's line work drawing in and the sheen over the film)
   ============================================================ */
import { gsap, ScrollTrigger, env, $, $$ } from './core.js';

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
      /* fold only what is clearly longer than the fold (13.5em of text) */
      const fold = parseFloat(getComputedStyle(body).fontSize) * 13.5;
      if (body.scrollHeight > fold * 1.35) {
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
  $$('[data-lit]').forEach(p => {
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

/* ---------- PPF coverage ---------- */
export function coverage() {
  const sec = $('[data-pc]');
  if (!sec) return;
  const D = JSON.parse($('[data-pc-data]', sec).textContent);
  const svgs = $$('.pc__svg', sec);
  const byView = { side: $('[data-view=side]', sec), plan: $('[data-view=plan]', sec) };
  const zones = svgs.flatMap(s => $$('.z', s));
  zones.forEach(z => z.style.setProperty('--i', Math.max(0, D.order.indexOf(z.dataset.z))));
  let pkg = null;

  /* the hatch and the sheen only fall on lit film: a mask per view made
     of copies of the lit panels, clipped to the body like the panels */
  const masks = active => svgs.forEach(svg => {
    const m = $('mask', svg), g = $('.zones', svg);
    m.replaceChildren();
    const grp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    grp.setAttribute('clip-path', g.getAttribute('clip-path'));
    $$('.z', g).forEach(z => {
      if (!active.includes(z.dataset.z)) return;
      const c = z.cloneNode();
      c.removeAttribute('class'); c.removeAttribute('style'); c.setAttribute('fill', '#fff');
      grp.appendChild(c);
    });
    m.appendChild(grp);
  });

  const sheen = $('#pc-sheen');
  let sweepId = 0;
  const sweep = () => {
    if (!env.motion || !sheen) return;
    const id = ++sweepId, t0 = performance.now(), dur = 1500;
    const tick = t => {
      if (id !== sweepId) return;
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      sheen.setAttribute('gradientTransform', `translate(${(-500 + e * 2100).toFixed(1)} 0) skewX(-18)`);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ----- callouts ----- */
  const co = view => $('.co', byView[view]);
  const hideCallouts = () => svgs.forEach(s => $('.co', s).classList.remove('is-on'));
  const callout = (label, zone) => {
    hideCallouts();
    const view = D.prefer[zone] || 'side';
    const at = D.anchors[view][zone];
    if (!at || !label) return;
    const [x, y] = at;
    const g = co(view);
    const dir = x < 640 ? 1 : -1;
    const ly = view === 'side' ? 50 : (y <= 250 ? -12 : 514);
    $('.co__l', g).setAttribute('d', `M${x} ${y} V${ly} h${dir * 22}`);
    $('.co__dot', g).setAttribute('cx', x); $('.co__dot', g).setAttribute('cy', y);
    $('.co__ring', g).setAttribute('cx', x); $('.co__ring', g).setAttribute('cy', y);
    const t = $('.co__t', g);
    t.textContent = label;
    t.setAttribute('x', x + dir * 30); t.setAttribute('y', ly + 5);
    t.setAttribute('text-anchor', dir > 0 ? 'start' : 'end');
    void g.getBoundingClientRect();
    g.classList.add('is-on');
  };

  /* ----- highlight: some panels bright, the rest of the film dimmed ----- */
  const items = () => $$('.pc__panel:not([hidden]) .pc__item', sec);
  const hl = (list, li) => {
    svgs.forEach(s => s.classList.toggle('hl', !!list));
    zones.forEach(z => z.classList.toggle('k', !!list && list.includes(z.dataset.z)));
    $$('.pc__item', sec).forEach(x => x.classList.toggle('is-on', !!list && (li ? x === li : x.dataset.zs.split(' ').some(z => list.includes(z)) && x.dataset.zs.split(' ').length < 6)));
  };
  const clear = () => { hl(null); hideCallouts(); };

  /* ----- packages ----- */
  const show = tablist(sec, '[data-pc-tab]', '[data-pc-panel]', i => {
    const p = D.packages[i];
    if (p.key === pkg) return;
    pkg = p.key;
    clear();
    zones.forEach(z => z.classList.toggle('a', p.zones.includes(z.dataset.z)));
    svgs.forEach(s => { s.classList.remove('is-on'); void s.getBoundingClientRect(); s.classList.add('is-on'); });
    masks(p.zones);
    sweep();
  });
  show(0);

  /* list -> car */
  const fromItem = li => {
    const zs = li.dataset.zs.split(' ');
    hl(zs, li);
    if (zs.length < 6) callout(li.textContent.trim(), zs.find(z => D.prefer[z] === 'plan' && zs.length === 1) || zs[0]);
    else hideCallouts();
  };
  sec.addEventListener('pointerover', e => { const li = e.target.closest('.pc__item'); if (li) fromItem(li); });
  sec.addEventListener('focusin', e => { const li = e.target.closest('.pc__item'); if (li) fromItem(li); });
  $$('.pc__panel', sec).forEach(p => p.addEventListener('pointerleave', clear));
  sec.addEventListener('focusout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('.pc__item')) clear(); });

  /* car -> list */
  svgs.forEach(svg => {
    svg.addEventListener('pointerover', e => {
      const z = e.target.closest('.z');
      if (!z || !z.classList.contains('a')) return;
      const zone = z.dataset.z;
      const li = items().find(x => x.dataset.zs.split(' ').includes(zone) && x.dataset.zs.split(' ').length < 6);
      hl([zone], li);
      callout(li ? li.textContent.trim() : '', zone);
    });
    svg.addEventListener('pointerleave', clear);
  });

  /* the line work draws itself once the sheet is seen, then the sheen */
  const sheet = $('[data-pc-sheet]', sec);
  const draw = () => { svgs.forEach(s => s.classList.add('is-drawn')); setTimeout(sweep, 900); };
  if (!env.entrance || !('IntersectionObserver' in window)) { svgs.forEach(s => s.classList.add('is-drawn')); return; }
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); draw(); } }, { threshold: 0.2 });
  io.observe(sheet);
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
