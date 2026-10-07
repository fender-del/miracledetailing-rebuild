/* ============================================================
   formats.js — how blocks 45–49 behave (07/10, the window tint
   rebuild; the data side is lib/formats.js).

     shows      45: points take turns, each sets a look on the photo;
                the colour of a shift region follows the pointer
     gauges     46: the slider darkens the zones and says pass / fail
     lenses     47: the lens follows the pointer, drags on touch,
                drifts when left alone, sweeps once on arrival
     layers     48: the item in the middle of the screen sets the drawing
     indexes    49: one row open at a time (hover intent on a mouse)
     cardMore   37 with cards.compact: Read more opens a card on phones

   Each works in every tier: without motion the turns, drifts and
   sweeps stop but the controls still do their job.
   ============================================================ */
import { gsap, ScrollTrigger, env, whenSeen, $, $$ } from './core.js';

const seen = (el, on, off, margin = '0px') => {
  if (!('IntersectionObserver' in window)) { on(); return; }
  new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? on() : off && off())), { rootMargin: margin }).observe(el);
};

/* ---------- 45 · showcase ---------- */
export function shows() {
  $$('[data-show]').forEach(fig => {
    const sec = fig.closest('.sshow');
    const media = $('.sshow__media', fig);
    const pts = $$('[data-pt]', sec);
    if (!pts.length) return;
    const fills = $$('[data-fill]', fig), lines = $$('[data-line]', fig);
    const TURN = 4200;
    let cur = -1, held = false, hovering = false, inView = false, timer = 0;

    const set = i => {
      if (i === cur) return;
      cur = i;
      pts.forEach((p, j) => {
        p.classList.toggle('is-on', j === i);
        $('button', p).setAttribute('aria-pressed', String(j === i));
      });
      const p = pts[i];
      fig.setAttribute('data-look', p.dataset.look || '');
      const rg = (p.dataset.rg || '').split(/\s+/);
      fills.forEach(f => f.classList.toggle('is-lit', rg.includes(f.dataset.fill)));
      lines.forEach(l => l.classList.toggle('is-lit', rg.includes(l.dataset.line)));
    };
    const auto = () => env.motion && !held && !hovering && inView;
    const tick = () => {
      clearTimeout(timer);
      sec.classList.toggle('is-auto', auto());
      if (!auto()) return;
      timer = setTimeout(() => { set((cur + 1) % pts.length); restartBar(); tick(); }, TURN);
    };
    const restartBar = () => {
      const bar = $('.sshow__bar i', pts[cur]);
      if (!bar) return;
      bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    };
    sec.style.setProperty('--turn', TURN + 'ms');
    cur = -1; set(0);

    pts.forEach((p, i) => {
      $('button', p).addEventListener('click', () => { held = true; set(i); tick(); });
      if (env.fine) p.addEventListener('pointerenter', () => { set(i); });
    });
    const list = $('.sshow__pts', sec);
    if (env.fine && list) {
      list.addEventListener('pointerenter', () => { hovering = true; tick(); });
      list.addEventListener('pointerleave', () => { hovering = false; tick(); });
    }
    seen(sec, () => { if (!inView) { inView = true; restartBar(); tick(); } }, () => { inView = false; tick(); });

    /* the colour follows the pointer; otherwise it drifts by itself */
    if (!env.motion) return;
    fig.classList.add('is-drift');
    if (env.fine) {
      media.addEventListener('pointermove', e => {
        const r = media.getBoundingClientRect();
        fig.classList.remove('is-drift');
        fig.classList.add('is-pointer');
        media.style.setProperty('--hx', ((e.clientX - r.left) / r.width).toFixed(3));
        media.style.setProperty('--hy', ((e.clientY - r.top) / r.height).toFixed(3));
      });
      media.addEventListener('pointerleave', () => { fig.classList.remove('is-pointer'); fig.classList.add('is-drift'); });
    }
  });
}

/* ---------- 46 · gauge ---------- */
export function gauges() {
  $$('[data-gauge]').forEach(sec => {
    const input = $('[data-gauge-in]', sec);
    const data = $('[data-gauge-data]', sec);
    if (!input || !data) return;
    const out = $('[data-gauge-v]', sec);
    const pass = sec.dataset.pass || 'Pass', fail = sec.dataset.fail || 'Fail';
    const media = $('[data-gauge-media]', sec);
    const zones = JSON.parse(data.textContent).map(z => Object.assign(z, {
      line: $(`[data-zl="${z.id}"]`, sec),
      pin: $(`[data-zp="${z.id}"]`, sec), row: $(`[data-zr="${z.id}"]`, sec)
    }));
    let touched = false;
    const upd = v => {
      out.textContent = Math.round(v);
      if (media) media.style.setProperty('--d', (1 - v / 100).toFixed(3));
      zones.forEach(z => {
        const ok = v >= z.min;
        const was = z.row && !z.row.classList.contains('is-fail');
        [z.line, z.pin, z.row].forEach(e => e && e.classList.toggle('is-fail', !ok));
        if (z.row && was !== ok) {
          $('[data-st]', z.row).textContent = ok ? pass : fail;
          z.row.classList.remove('is-flip'); void z.row.offsetWidth; z.row.classList.add('is-flip');
        }
      });
    };
    input.addEventListener('input', () => { touched = true; upd(+input.value); });
    /* a row or a pin points at its glass */
    zones.forEach(z => {
      if (!z.row || !z.line) return;
      z.row.addEventListener('pointerenter', () => z.line.classList.add('is-hot'));
      z.row.addEventListener('pointerleave', () => z.line.classList.remove('is-hot'));
    });
    input.addEventListener('focus', () => zones.forEach(z => z.line && z.line.classList.add('is-hot')));
    input.addEventListener('blur', () => zones.forEach(z => z.line && z.line.classList.remove('is-hot')));

    /* on arrival the film darkens once and comes back, so the slider
       explains itself */
    if (!env.motion) return;
    whenSeen(sec.querySelector('.sgauge__tool') || sec, () => {
      if (touched) return;
      const start = +input.value, p = { v: +input.max };
      const tl = gsap.timeline({ delay: 0.5, onUpdate: () => { if (touched) { tl.kill(); return; } input.value = p.v; upd(p.v); } });
      tl.to(p, { v: +input.min + 15, duration: 1.6, ease: 'power2.inOut' })
        .to(p, { v: start, duration: 1.3, ease: 'power3.out' });
    }, 0.25);
  });
}

/* ---------- 47 · lens ---------- */
export function lenses() {
  $$('[data-lens]').forEach(fig => {
    const stage = $('.slens__stage', fig), win = $('.slens__win', fig);
    if (!stage || !win) return;
    const [rx, ry] = fig.dataset.rest.split(',').map(Number);
    let x = rx, y = ry, tx = rx, ty = ry, raf = 0, drag = false, inView = false, t0 = 0, driftRaf = 0, over = false;
    const paint = () => { stage.style.setProperty('--lx', x.toFixed(2)); stage.style.setProperty('--ly', y.toFixed(2)); };
    const loop = () => {
      x += (tx - x) * 0.16; y += (ty - y) * 0.16;
      paint();
      raf = Math.abs(tx - x) > 0.03 || Math.abs(ty - y) > 0.03 ? requestAnimationFrame(loop) : 0;
    };
    const go = (nx, ny) => { tx = Math.max(2, Math.min(98, nx)); ty = Math.max(2, Math.min(98, ny)); if (!raf) raf = requestAnimationFrame(loop); };
    const at = e => { const r = stage.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100]; };
    const used = () => fig.classList.add('is-used');

    win.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse') { over = true; used(); go(...at(e)); return; }
      if (drag) { e.preventDefault(); go(...at(e)); }
    });
    win.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { over = false; go(rx, ry); } });
    win.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      drag = true; used(); go(...at(e));
      try { win.setPointerCapture(e.pointerId); } catch (_) { /* ok */ }
    });
    const end = () => { drag = false; };
    win.addEventListener('pointerup', end); win.addEventListener('pointercancel', end);

    if (!env.motion) return;
    /* left alone on a touch screen, the lens wanders over the glass */
    const drift = now => {
      if (!inView) { driftRaf = 0; return; }
      if (!drag && !over && !env.fine) {
        const t = (now - t0) / 1000;
        /* keep the wander inside the window (phones show a crop) */
        const ax = Math.min(17, 28 * win.clientWidth / Math.max(1, stage.clientWidth));
        go(rx + Math.sin(t * 0.45) * ax, ry + Math.sin(t * 0.73 + 1) * 13);
      }
      driftRaf = requestAnimationFrame(drift);
    };
    seen(win, () => { inView = true; if (!driftRaf && !env.fine) { t0 = performance.now(); driftRaf = requestAnimationFrame(drift); } }, () => { inView = false; });
    /* the first time it is seen, the lens sweeps across the glass */
    if (env.fine) whenSeen(win, () => {
      if (over) return;
      const p = { x: rx - 32, y: ry + 8 };
      x = p.x; y = p.y; paint();
      gsap.timeline({ delay: 0.3, onUpdate: () => { if (over) return; x = tx = p.x; y = ty = p.y; paint(); } })
        .to(p, { x: rx + 26, y: ry - 6, duration: 1.8, ease: 'power2.inOut' })
        .to(p, { x: rx, y: ry, duration: 1.1, ease: 'power3.out' });
    }, 0.3);
  });
}

/* ---------- 48 · layers ---------- */
export function layers() {
  $$('[data-layers]').forEach(box => {
    const fig = $('.slay__fig', box);
    const items = $$('[data-lay-it]', box);
    if (!fig || !items.length) return;
    let cur = 0;
    const set = k => {
      if (k === cur) return;
      cur = k;
      fig.setAttribute('data-state', String(k));
      items.forEach(it => {
        const on = +it.dataset.layIt === k;
        it.classList.toggle('is-on', on);
        $('button', it).setAttribute('aria-pressed', String(on));
      });
    };
    items.forEach(it => $('button', it).addEventListener('click', () => set(+it.dataset.layIt)));
    if (!('IntersectionObserver' in window)) { set(1); return; }
    /* the item crossing the middle band of the screen sets the state */
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(+e.target.dataset.layIt); }),
      { rootMargin: '-42% 0px -42% 0px' });
    items.forEach(it => io.observe(it));
  });
}

/* ---------- 49 · index ---------- */
export function indexes() {
  $$('[data-idx]').forEach(sec => {
    const rows = $$('[data-row]', sec);
    const open = (row, on) => {
      rows.forEach(r => {
        const o = r === row ? on : false;
        r.classList.toggle('is-open', o);
        $('.sidx__bar', r).setAttribute('aria-expanded', String(o));
      });
    };
    rows.forEach(row => {
      const bar = $('.sidx__bar', row);
      bar.addEventListener('click', () => open(row, !row.classList.contains('is-open')));
      if (env.fine) {
        let t = 0;
        bar.addEventListener('pointerenter', () => { clearTimeout(t); t = setTimeout(() => { if (!row.classList.contains('is-open')) open(row, true); }, 160); });
        bar.addEventListener('pointerleave', () => clearTimeout(t));
      }
    });
  });
}

/* ---------- 37 · compact cards (phones): Read more opens a card ---------- */
export function cardMore() {
  $$('[data-cmore]').forEach(btn => {
    const card = btn.closest('.card');
    if (!card) return;
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.firstChild.textContent = open ? 'Read less' : 'Read more';
      setTimeout(() => ScrollTrigger.refresh(), 600);
    });
  });
}
