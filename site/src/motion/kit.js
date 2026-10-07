/* ============================================================
   kit.js — the shared scroll kit for the inner pages (07/10,
   PLAN-interactions §1–4). Written once; a page picks a cluster
   (body[data-cluster]) and its blocks pick a kind (data-fx …).

   Motion only:
     transitions()  how a section arrives
                      paint    an inspection light sweeps across it and
                               lays an ivory section's paper down behind
                               it (Ceramic: data-sweep=ripple, a bead of
                               water spreading from one point)
                      process  a hairline cuts across, diamond at its tip
     heroFrame()    paint: the hero closes into a framed photo as it goes
     rails()        desktop: a row of cards runs past while the section
                    holds the screen ([data-fx=rail])
     stacks()       desktop: cards stick and slide over each other
                    ([data-fx=stack])
     samples()      material samples: photos pull back as they pass
     zooms()        a photo opens on a close-up and pulls back
                    ([data-zoom]; data-glass darkens it like tint)
     collages()     photos round a quote drift at their own depth
   Every tier with JS (they are how the page reads, not decoration):
     stages()       steps beside a picture that holds still ([data-stage])
     railMeta()     phones: the count under a row you swipe
     accordions()   phones: options as a price list ([data-acc])
     progress()     "Step n / N" while a long procedure is read

   Each desktop-only piece lives in a gsap.matchMedia context, so a
   window that crosses the breakpoint gets the other layout cleanly.
   ============================================================ */
import { gsap, ScrollTrigger, env, whenSeen, $, $$ } from './core.js';
import { sfx } from './sound.js';

const DESK = '(min-width: 1024px)';
const PHONE = '(max-width: 767px)';
const body = document.body;
const cluster = body.getAttribute('data-cluster');
const pad = n => String(n).padStart(2, '0');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---------- how ONE section arrives ----------
   07/10 (Fender: an effect repeated block after block reads cheap): each
   page names one section and one arrival, body[data-arrive="id:kind"].
     beam    an inspection light sweeps across it (an ivory section's
             paper is laid down behind the light)       Correction
     ripple  a bead of water spreads from one point    Ceramic
     cut     a hairline cuts across, diamond at its tip   process pages */
export function arrival() {
  const [id, kind] = (body.getAttribute('data-arrive') || '').split(':');
  const sec = id && document.getElementById(id);
  if (!sec) return;
  if (kind === 'cut') { cut(sec); return; }
  const ripple = kind === 'ripple';
  sec.setAttribute('data-arrive-on', ripple ? 'ripple' : 'beam');
  const fx = document.createElement('span');
  fx.className = 'fxb';
  fx.setAttribute('aria-hidden', 'true');
  fx.innerHTML = ripple ? '<i class="fxb__ring"></i>' : '<i class="fxb__beam"></i><i class="fxb__edge"></i>';
  sec.prepend(fx);
  const light = sec.getAttribute('data-bg') === 'light';
  let W = 1, H = 1;
  const measure = () => { W = sec.offsetWidth; H = sec.offsetHeight; };
  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);

  const paint = p => {
    if (ripple) {
      /* the bead spreads fast, then slows, like water on a coating */
      const e = 1 - Math.pow(1 - p, 2.2);
      const rr = e * 150;
      fx.style.setProperty('--rp', (rr / 100 * Math.hypot(W, H) / Math.SQRT2).toFixed(1) + 'px');
      fx.style.setProperty('--ro', (p <= 0 || p >= 1 ? 0 : Math.min(1, p * 6) * Math.pow(1 - p, 0.7)).toFixed(3));
      if (light) sec.style.setProperty('--rr', rr.toFixed(2) + '%');
    } else {
      /* the beam's centre runs from off the left to off the right; the
         paper's edge sits under it */
      const bx = -25 + p * 150;
      fx.style.setProperty('--bx', bx.toFixed(2) + '%');
      fx.style.setProperty('--bo', Math.sin(Math.PI * p).toFixed(3));
      if (light) sec.style.setProperty('--sw', (clamp(bx / 100) * 100).toFixed(2) + '%');
    }
  };
  const st = { p: 0 };
  gsap.to(st, {
    p: 1, ease: 'none', onUpdate: () => paint(st.p),
    scrollTrigger: { trigger: sec, start: 'top 94%', end: () => (window.matchMedia(PHONE).matches ? 'top 45%' : 'top 28%'), scrub: 0.6, invalidateOnRefresh: true }
  });
  /* start dark; the trigger then scrubs to wherever the page is */
  paint(0);
}

function cut(sec) {
  const l = document.createElement('span');
  l.className = 'fxl';
  l.setAttribute('aria-hidden', 'true');
  sec.prepend(l);
  gsap.fromTo(l, { '--lp': 0 }, {
    '--lp': 1, ease: 'power1.inOut',
    scrollTrigger: { trigger: sec, start: 'top 98%', end: 'top 42%', scrub: 0.5 }
  });
}

/* ---------- paint: the hero closes into a frame ---------- */
export function heroFrame() {
  if (cluster !== 'paint') return;
  const hero = $('[data-hero]');
  const media = hero && $('.shero__media', hero);
  if (!media) return;
  const st = { p: 0 };
  gsap.to(st, {
    p: 1, ease: 'none',
    onUpdate: () => {
      const e = 1 - Math.pow(1 - st.p, 2);
      media.style.setProperty('--hf-x', (e * 3.2).toFixed(3) + 'vw');
      media.style.setProperty('--hf-y', (e * 4).toFixed(3) + 'vh');
      media.style.setProperty('--hf-r', (e * 26).toFixed(1) + 'px');
    },
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: true }
  });
}

/* ---------- desktop: the row runs past, the header anchored ----------
   v2 (07/10): heading, the names of every item and a count stay on top
   while the cards travel; the name of the card in view is lit and a
   click on a name scrolls to it. Pins only when it all fits the screen
   (tries a tighter set first), else the plain grid stays. */
export function rails() {
  const list = $$('[data-fx=rail]');
  if (!list.length) return;
  gsap.matchMedia().add(`${DESK} and (min-height: 600px)`, () => {
    const undo = [];
    list.forEach(sec => {
      const grid = $('.scards__grid', sec), track = $('.scards__track', sec);
      const chipsEl = $('[data-rchips]', sec), rbar = $('.rbar', sec), meta = $('.rmeta', sec);
      const fig = $('.scards__head .scards__fig', sec);
      const metaHome = meta && meta.parentNode, metaNext = meta && meta.nextSibling;
      const figHome = fig && fig.parentNode, figNext = fig && fig.nextSibling;
      let figLi = null;

      sec.classList.add('is-pinrail');
      if (fig) {
        figLi = document.createElement('li');
        figLi.className = 'card--fig';
        figLi.setAttribute('aria-hidden', 'false');
        figLi.appendChild(fig);
        grid.prepend(figLi);
      }
      if (meta && rbar) rbar.appendChild(meta);
      const cards = $$('.card', grid);
      const fits = () => sec.scrollHeight <= window.innerHeight + 1
        && cards.every(c => c.scrollHeight <= c.clientHeight + 1);
      /* normal, then tighter, then wide cards (words beside the list) */
      if (!fits()) sec.classList.add('is-tight');
      if (!fits()) sec.classList.add('is-wide');
      const restore = () => {
        sec.classList.remove('is-pinrail', 'is-tight', 'is-wide');
        if (figLi) { figHome.insertBefore(fig, figNext); figLi.remove(); }
        if (meta && metaHome) metaHome.insertBefore(meta, metaNext);
        if (chipsEl) chipsEl.replaceChildren();
        gsap.set(grid, { clearProps: 'transform' });
        const n = meta && $('[data-rail-n]', meta);
        if (n) n.textContent = '01';
      };
      if (!fits()) { restore(); return; }

      /* the names, from the cards' own headings */
      const chips = cards.map((c, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'rchip';
        const num = $('.card__n', c);
        const nm = $('.card__name', c);
        b.innerHTML = (num ? `<span class="rchip__n">${num.textContent}</span>` : '') + `<span>${nm ? nm.innerHTML : pad(i + 1)}</span>`;
        li.appendChild(b);
        if (chipsEl) chipsEl.appendChild(li);
        return b;
      });

      const n = meta && $('[data-rail-n]', meta), bar = meta && $('.rmeta__bar', meta);
      const pad0 = parseFloat(getComputedStyle(grid).paddingLeft) || 0;
      const dist = () => Math.max(0, grid.scrollWidth - track.clientWidth);
      /* where each card's left edge sits along the row */
      let offs = [], wids = [];
      const measure = () => { offs = cards.map(c => c.offsetLeft - pad0); wids = cards.map(c => c.offsetWidth); };
      measure();
      let cur = -1;
      const light = i => {
        if (i === cur) return;
        cur = i;
        chips.forEach((c, j) => { c.classList.toggle('is-on', j === i); if (j === i) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current'); });
        if (n) n.textContent = pad(i + 1);
        const c = chips[i];
        if (c && chipsEl) {
          const l = c.parentNode.offsetLeft, r = l + c.parentNode.offsetWidth;
          if (l < chipsEl.scrollLeft || r > chipsEl.scrollLeft + chipsEl.clientWidth) chipsEl.scrollTo({ left: l - 12, behavior: 'smooth' });
        }
      };
      const tw = gsap.to(grid, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: sec, start: 'top top', end: () => '+=' + Math.max(dist() * 1.15, window.innerHeight * 0.6),
          pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          onRefresh: measure,
          onUpdate: self => {
            if (bar) bar.style.setProperty('--rm', self.progress.toFixed(3));
            const x = self.progress * dist();
            /* the card whose left edge has come nearest the start of the
               row; the last one once the row has run out */
            /* the card that fills most of the row right now */
            const W = track.clientWidth;
            let i = 0, best = -1;
            offs.forEach((o, j) => {
              const l = o + pad0 - x, r = l + wids[j];
              const seen = Math.max(0, Math.min(r, W) - Math.max(l, 0)) / Math.min(wids[j], W);
              if (seen > best + 0.02) { best = seen; i = j; }
            });
            if (self.progress > 0.985) i = cards.length - 1;
            light(i);
          }
        }
      });
      light(0);

      chips.forEach((b, i) => b.addEventListener('click', () => {
        const st = tw.scrollTrigger;
        const p = dist() ? Math.min(1, offs[i] / dist()) : 0;
        const y = st.start + p * (st.end - st.start) + 2;
        if (env.lenis) env.lenis.scrollTo(y, { duration: 1.2 });
        else window.scrollTo({ top: y, behavior: env.motion ? 'smooth' : 'auto' });
      }));

      undo.push(restore);
    });
    return () => undo.forEach(f => f());
  });
}

/* ---------- desktop: cards stack ---------- */
export function stacks() {
  const list = $$('[data-fx=stack]');
  if (!list.length) return;
  gsap.matchMedia().add(`${DESK} and (min-height: 700px)`, () => {
    const undo = [];
    list.forEach(sec => {
      sec.classList.add('is-stack');
      const cards = $$('.card', sec);
      const top = c => parseFloat(getComputedStyle(c).top) || 0;
      /* every card must fit under the bar, or its foot would be covered
         before it could be read */
      if (!cards.every(c => top(c) + c.offsetHeight + 24 <= window.innerHeight)) { sec.classList.remove('is-stack'); return; }
      cards.slice(0, -1).forEach((c, k) => {
        const next = cards[k + 1];
        gsap.fromTo(c, { '--cv': 0 }, {
          '--cv': 1, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: () => `top ${top(next)}px`, scrub: true, invalidateOnRefresh: true }
        });
      });
      undo.push(() => { sec.classList.remove('is-stack'); cards.forEach(c => c.style.removeProperty('--cv')); });
    });
    return () => undo.forEach(f => f());
  });
}

/* ---------- material samples: each photo pulls back as it passes ---------- */
export function samples() {
  $$('[data-fx=samples] .card__media .media').forEach(m => {
    gsap.fromTo(m, { scale: 1.22 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: m, start: 'top bottom', end: 'center 40%', scrub: 0.6 }
    });
  });
}

/* ---------- a photo opens on a close-up and pulls back ---------- */
export function zooms() {
  $$('[data-zoom]').forEach(fr => {
    const inner = fr.firstElementChild;
    if (!inner) return;
    fr.style.setProperty('--zf', fr.getAttribute('data-focus') || '50% 50%');
    const rot = parseFloat(fr.getAttribute('data-rot')) || 0;
    /* data-still: no pull-back, only the tint (one zoom per page, 07/10) */
    const S = fr.hasAttribute('data-still') ? 1 : 2.2;
    if (S === 1) fr.style.setProperty('--zi', '0%');
    const st = { p: 0 };
    const paint = () => {
      const k = 1 - st.p;
      inner.style.transform = `scale(${(1 + (S - 1) * k).toFixed(4)})` + (rot ? ` rotate(${(rot * k).toFixed(3)}deg)` : '');
      fr.style.setProperty('--zi', (10 * k).toFixed(3) + '%');
    };
    if (S > 1) paint();
    if (S > 1) gsap.to(st, {
      p: 1, ease: 'power2.out', onUpdate: paint,
      scrollTrigger: { trigger: fr, start: 'top 96%', end: 'center 48%', scrub: 0.7 }
    });
    /* tint: the glass darkens while the legal limits are read */
    if (fr.hasAttribute('data-glass')) {
      gsap.fromTo(inner, { filter: 'brightness(1.85) saturate(0.75) contrast(0.9)' }, {
        filter: 'brightness(1) saturate(1) contrast(1)', ease: 'none',
        scrollTrigger: { trigger: fr.closest('section'), start: 'top 70%', end: 'bottom 75%', scrub: 0.8 }
      });
    }
  });
}

/* ---------- photos round a quote, each at its own depth ---------- */
export function collages() {
  $$('[data-collage]').forEach(col => {
    const sec = col.closest('section');
    $$('.squote__ph', col).forEach((ph, i) => {
      const d = parseFloat(ph.getAttribute('data-depth')) || 1;
      const amp = () => (window.matchMedia(PHONE).matches ? 18 : 64) * d;
      gsap.fromTo(ph, { y: () => amp(), rotation: (i % 2 ? -1 : 1) * 0.8 * d }, {
        y: () => -amp(), rotation: 0, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
      });
      const m = $('.squote__phm', ph);
      if (!env.entrance || !m) return;
      gsap.set(m, { clipPath: 'inset(100% 0% 0% 0%)' });
      whenSeen(ph, () => gsap.to(m, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', delay: i * 0.12, clearProps: 'clipPath' }), 0.05);
    });
  });
}

/* ---------- steps beside a picture that holds still ---------- */
export function stages() {
  const list = $$('[data-stage]');
  if (!list.length) return;
  gsap.matchMedia().add(DESK, () => {
    const undo = [];
    list.forEach(sec => {
      const items = $$('.ssteps__it', sec);
      const ol = $('.ssteps__list', sec);
      const digits = $('[data-stage-n]', sec), name = $('[data-stage-name]', sec), arc = $('.stage__arc', sec);
      const names = items.map(li => $('.ssteps__name', li).innerHTML);
      if (!digits.firstElementChild) digits.innerHTML = `<span>${digits.textContent}</span>`;
      sec.classList.add('is-live');
      let cur = -1, nameT = 0;
      const set = i => {
        if (i === cur) return;
        const dir = i > cur ? 1 : -1;
        const first = cur === -1;
        cur = i;
        items.forEach((li, j) => li.classList.toggle('is-on', j === i));
        const txt = pad(i + 1);
        if (first || !env.motion) { digits.innerHTML = `<span>${txt}</span>`; name.innerHTML = names[i]; return; }
        sfx('beat');
        /* the number turns over: the old one leaves, the new one follows.
           A fast scroll can pass several steps at once: whatever is still
           leaving goes at once, so only one number is ever in flight. */
        const kids = [...digits.children];
        const old = kids.pop();
        kids.forEach(k => { gsap.killTweensOf(k); k.remove(); });
        gsap.killTweensOf(old);
        gsap.set(old, { position: 'absolute', left: 0, top: 0 });
        const nu = document.createElement('span');
        nu.textContent = txt;
        digits.appendChild(nu);
        gsap.to(old, { yPercent: -110 * dir, duration: 0.7, ease: 'expo.inOut', onComplete: () => old.remove() });
        gsap.fromTo(nu, { yPercent: 110 * dir }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' });
        name.classList.add('is-out');
        clearTimeout(nameT);
        nameT = setTimeout(() => { name.innerHTML = names[i]; name.classList.remove('is-out'); }, 260);
      };
      set(0);
      const made = items.map((li, i) => ScrollTrigger.create({
        trigger: li, start: 'top 58%', end: 'bottom 58%',
        onToggle: self => { if (self.isActive) set(i); }
      }));
      made.push(ScrollTrigger.create({
        trigger: ol, start: 'top 58%', end: 'bottom 58%',
        onUpdate: self => {
          sec.style.setProperty('--sp', self.progress.toFixed(4));
          if (arc) arc.style.strokeDashoffset = String(1 - self.progress);
        }
      }));
      undo.push(() => {
        made.forEach(t => t.kill());
        sec.classList.remove('is-live');
        items.forEach(li => li.classList.remove('is-on'));
      });
    });
    return () => undo.forEach(f => f());
  });
}

/* ---------- phones: the count under a row you swipe ---------- */
export function railMeta() {
  $$('[data-rail]').forEach(row => {
    const sec = row.closest('section');
    const meta = sec && $('.rmeta', sec);
    if (!meta) return;
    const items = [...row.children];
    /* the cards waiting off to the right are simply there when swiped
       to; only the first two (the ones on screen) make an entrance */
    if (window.matchMedia(PHONE).matches && row.scrollWidth > row.clientWidth + 4) {
      items.slice(2).forEach(it => { it.removeAttribute('data-reveal'); $$('[data-reveal]', it).forEach(x => x.removeAttribute('data-reveal')); });
    }
    const n = $('[data-rail-n]', meta), idx = $('[data-rail-i]', meta), bar = $('.rmeta__bar', meta);
    let raf = 0, cur = -1;
    const update = () => {
      raf = 0;
      const max = row.scrollWidth - row.clientWidth;
      if (max <= 0) return;
      const x = row.scrollLeft;
      if (bar) bar.style.setProperty('--rm', clamp(x / max).toFixed(3));
      /* the card nearest the row's left edge, the last one at the end */
      let i = x >= max - 4 ? items.length - 1 : 0;
      if (i === 0) {
        const edge = row.getBoundingClientRect().left + parseFloat(getComputedStyle(row).paddingLeft);
        let best = Infinity;
        items.forEach((it, j) => { const d = Math.abs(it.getBoundingClientRect().left - edge); if (d < best) { best = d; i = j; } });
      }
      if (i === cur) return;
      cur = i;
      const label = items[i].getAttribute('data-label');
      if (label && n) n.textContent = label;
      if (idx) idx.textContent = pad(i + 1);
      else if (!label && n) n.textContent = pad(i + 1);
    };
    row.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  });
}

/* ---------- phones: options as a price list ---------- */
const CHEV = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8"/></svg>';
export function accordions() {
  const list = $$('[data-acc]');
  if (!list.length) return;
  const mq = window.matchMedia(PHONE);
  let t = 0;
  const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 120); };
  list.forEach(sec => {
    const cards = $$('.card', sec);
    const btns = cards.map(card => {
      /* a card with nothing more to show stays as it is */
      if (!$('.card__b', card) && !$('.card__media', card)) return null;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card__acc';
      b.setAttribute('aria-expanded', 'false');
      const nm = $('.card__name', card);
      b.innerHTML = `<span class="sr">Details: ${nm ? nm.textContent : ''}</span><span class="card__chev">${CHEV}</span>`;
      card.appendChild(b);
      b.addEventListener('click', () => {
        const open = !card.classList.contains('is-open');
        cards.forEach((c, j) => { c.classList.remove('is-open'); if (btns[j]) btns[j].setAttribute('aria-expanded', 'false'); });
        if (open) {
          card.classList.add('is-open');
          b.setAttribute('aria-expanded', 'true');
          /* the card above may just have closed: keep this one's top in view */
          requestAnimationFrame(() => {
            const y = card.getBoundingClientRect().top;
            const hd = $('.snav') ? 64 : 12;
            if (y < hd) window.scrollBy({ top: y - hd - 8, behavior: env.motion ? 'smooth' : 'auto' });
          });
        }
        refresh();
      });
      return b;
    });
    const fit = () => {
      sec.classList.toggle('acc-on', mq.matches);
      if (!mq.matches) cards.forEach((c, j) => { c.classList.remove('is-open'); if (btns[j]) btns[j].setAttribute('aria-expanded', 'false'); });
    };
    fit();
    if (mq.addEventListener) mq.addEventListener('change', () => { fit(); refresh(); });
  });
}

/* ---------- "Step n / N" while a long procedure is read ---------- */
export function progress() {
  $$('[data-progress]').forEach(sec => {
    const items = $$('.ssteps__it', sec);
    const n = $('[data-prog-n]', sec), bar = $('[data-prog-bar]', sec);
    const ol = $('.ssteps__list', sec);
    ScrollTrigger.create({ trigger: ol, start: 'top 62%', end: 'bottom 40%', toggleClass: { targets: sec, className: 'is-reading' } });
    ScrollTrigger.create({
      trigger: ol, start: 'top 62%', end: 'bottom 62%',
      onUpdate: self => { if (bar) bar.style.setProperty('--pp', self.progress.toFixed(3)); }
    });
    items.forEach((li, i) => ScrollTrigger.create({
      trigger: li, start: 'top 62%', end: 'bottom 62%',
      onToggle: self => { if (self.isActive && n) n.textContent = String(i + 1); }
    }));
  });
}
