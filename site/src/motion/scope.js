/* ============================================================
   scope.js — paint under a light (08/10, the paint correction
   rebuild; data side lib/correction.js, markup blocks 55–56).

     scopes()   every [data-scope] canvas:
                  levels  block 56: a panel of black paint; the five
                          levels take away their share of the defects
                  micro   block 55: the same paint in a microscope's
                          ring, magnified, untouched

   How the paint is drawn: fine scratches run every way across it, but
   a scratch only catches the light where it lies across the line to
   the light (that is why swirls look like rings round a lamp on a real
   car). So each scratch is cut into short segments, and each segment's
   brightness = how square it sits to the light × how near the light it
   is. Every defect has a depth; a level that removes 70% of defects
   removes the shallowest 70%, the deepest go last. The haze lifts and
   the light's reflection sharpens as the paint clears.

   Painted only while on screen. Reduced motion: the light stays put,
   a level changes at once. Without JS the CSS still shows a panel.
   ============================================================ */
import { gsap, ScrollTrigger, env, whenSeen, $, $$ } from './core.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = p => p * p * (3 - 2 * p);
/* the same scratches every time (mulberry32) */
const rng = seed => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function scopes() {
  $$('[data-scope="micro"]').forEach(micro);
  $$('[data-scope-sec]').forEach(levels);
}

/* ---------- the defects, in units of the panel's longer side ---------- */
function defects(seed, cx, cy, h, n) {
  const r = rng(seed), list = [];
  const at = () => [cx + (r() * 2 - 1) * h, cy + (r() * 2 - 1) * h];
  const line = (x, y, th, len, curve, steps) => {
    const pts = [[x, y]], st = len / steps;
    for (let i = 0; i < steps; i++) { th += curve * st; x += Math.cos(th) * st; y += Math.sin(th) * st; pts.push([x, y]); }
    return pts;
  };
  /* swirls: short fine arcs, every direction (the pad's marks) */
  for (let i = 0; i < n.swirl; i++) {
    const [x, y] = at();
    list.push({ pts: line(x, y, r() * Math.PI * 2, (0.015 + r() * r() * 0.06) * n.len, (r() - 0.5) * 18 / n.len, 4),
      w: 0.5 + r() * 0.45, a: 0.5 + r() * 0.5, k: 4, depth: r() * 0.72 });
  }
  /* light scratches: longer, nearly straight, seen from wider angles */
  for (let i = 0; i < n.scratch; i++) {
    const [x, y] = at();
    list.push({ pts: line(x, y, r() * Math.PI * 2, (0.1 + r() * 0.22) * n.len, (r() - 0.5) * 1.6 / n.len, 12),
      w: 0.8 + r() * 0.5, a: 0.5 + r() * 0.3, k: 3, depth: 0.55 + r() * 0.38 });
  }
  /* water etching: small rings */
  for (let i = 0; i < n.etch; i++) {
    const [x, y] = at(), R = (0.005 + r() * 0.011) * n.len, pts = [];
    for (let j = 0; j <= 14; j++) { const an = j / 14 * Math.PI * 2; pts.push([x + Math.cos(an) * R, y + Math.sin(an) * R * (0.8 + r() * 0.25)]); }
    list.push({ pts, w: 0.8, a: 0.55, k: 1.5, depth: 0.5 + r() * 0.42 });
  }
  /* one or two deep ones: what only the last levels take out */
  for (let i = 0; i < n.deep; i++) {
    const [x, y] = at();
    list.push({ pts: line(x, y, r() * Math.PI * 2, (0.28 + r() * 0.16) * n.len, (r() - 0.5) * 0.6 / n.len, 18),
      w: 1.5, a: 0.75, k: 2, depth: 0.985 + r() * 0.015 });
  }
  /* rank = place in depth order, 0–1: removing a share f of the defects
     removes exactly those ranked under f */
  list.sort((p, q) => p.depth - q.depth);
  list.forEach((d, i) => { d.rank = (i + 0.5) / list.length; });
  return list;
}

/* ---------- one canvas of paint ---------- */
function surface(box, cv, o) {
  const g = cv.getContext && cv.getContext('2d');
  if (!g) return null;
  const MAG = o.micro ? 2.6 : 1;
  const list = o.micro
    ? defects(o.seed, 0.5, 0.5, 0.62 / MAG, { swirl: 700, scratch: 5, etch: 3, deep: 1, len: 1 / MAG * 1.4 })
    : defects(o.seed, 0.5, 0.5, 0.62, { swirl: 5200, scratch: 16, etch: 12, deep: 2, len: 1 });
  /* flakes in the clear coat that glint near the light */
  const fr = rng(o.seed + 5), flakes = [];
  for (let i = 0; i < (o.micro ? 900 : 2600); i++) flakes.push([fr(), fr(), 0.3 + fr() * 0.7]);

  let W = 1, H = 1, D = 1, S = 1, base = null;
  const st = { f: 0, lx: o.lx || 0.44, ly: o.ly || 0.4 };
  /* unit point -> canvas px (magnified round the centre) */
  const px = u => (u - 0.5) * S * MAG + W / 2;
  const py = v => (v - 0.5) * S * MAG + H / 2;

  const size = () => {
    const r = box.getBoundingClientRect();
    if (o.micro) {
      const c = cv.getBoundingClientRect();
      W = H = Math.max(1, Math.round(c.width));
    } else { W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height)); }
    D = Math.min(2, window.devicePixelRatio || 1);
    S = Math.max(W, H);
    cv.width = Math.round(W * D); cv.height = Math.round(H * D);
    base = paint();
    segs = null;
  };

  /* the paint itself: black, a little blue in the metallic, the studio
     ceiling faintly across the top */
  const paint = () => {
    const c = document.createElement('canvas');
    c.width = cv.width; c.height = cv.height;
    const x = c.getContext('2d');
    x.setTransform(D, 0, 0, D, 0, 0);
    const lg = x.createLinearGradient(0, 0, W * 0.3, H);
    lg.addColorStop(0, '#1A1C22'); lg.addColorStop(0.5, '#0C0D10'); lg.addColorStop(1, '#050506');
    x.fillStyle = lg; x.fillRect(0, 0, W, H);
    const band = x.createLinearGradient(0, H * 0.02, 0, H * 0.3);
    band.addColorStop(0, 'rgba(170,185,210,.07)'); band.addColorStop(1, 'rgba(170,185,210,0)');
    x.fillStyle = band; x.fillRect(0, 0, W, H);
    const r = rng(3), n = Math.round(W * H / (o.micro ? 5 : 9));
    for (let i = 0; i < n; i++) {
      const a = 0.015 + Math.pow(r(), 5) * 0.06;
      x.fillStyle = r() < 0.5 ? `rgba(170,190,230,${a.toFixed(3)})` : `rgba(255,255,255,${a.toFixed(3)})`;
      const s = o.micro ? 1 : 0.7;
      x.fillRect(r() * W, r() * H, s, s);
    }
    return c;
  };

  /* segments in canvas px, made once per size */
  let segs = null;
  const build = () => {
    segs = [];
    list.forEach((d, di) => {
      for (let i = 1; i < d.pts.length; i++) {
        const x1 = px(d.pts[i - 1][0]), y1 = py(d.pts[i - 1][1]), x2 = px(d.pts[i][0]), y2 = py(d.pts[i][1]);
        const L = Math.hypot(x2 - x1, y2 - y1) || 1;
        segs.push({ x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2, dx: (x2 - x1) / L, dy: (y2 - y1) / L, d: di });
      }
    });
  };

  const BK = 14;
  const draw = () => {
    if (!base) size();
    if (!segs) build();
    const f = st.f;
    const lx = st.lx * W, ly = st.ly * H;
    const clear = clamp(f / 0.9);
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, cv.width, cv.height);
    g.save();
    if (o.micro) { g.beginPath(); g.arc(cv.width / 2, cv.height / 2, cv.width / 2, 0, Math.PI * 2); g.clip(); }
    g.drawImage(base, 0, 0);
    g.setTransform(D, 0, 0, D, 0, 0);

    /* haze: a milky veil and a wide bloom round the light, gone by level one */
    const haze = 1 - smooth(clamp(f / 0.55));
    g.globalCompositeOperation = 'lighter';
    if (haze > 0.01) {
      g.fillStyle = `rgba(150,158,172,${(0.06 * haze).toFixed(3)})`;
      g.fillRect(0, 0, W, H);
      const hb = g.createRadialGradient(lx, ly, 0, lx, ly, S * 0.42);
      hb.addColorStop(0, `rgba(210,215,225,${(0.2 * haze).toFixed(3)})`); hb.addColorStop(1, 'rgba(210,215,225,0)');
      g.fillStyle = hb; g.fillRect(0, 0, W, H);
    }

    /* flakes glint near the light */
    const fs = S * (o.micro ? 0.16 : 0.2);
    for (let i = 0; i < flakes.length; i++) {
      const fx = flakes[i][0] * W, fy = flakes[i][1] * H;
      const dx = fx - lx, dy = fy - ly, q = (dx * dx + dy * dy) / (fs * fs);
      if (q > 4) continue;
      const a = flakes[i][2] * Math.exp(-q) * 0.55;
      if (a < 0.02) continue;
      g.fillStyle = `rgba(225,235,255,${a.toFixed(3)})`;
      g.fillRect(fx, fy, o.micro ? 1.4 : 1, o.micro ? 1.4 : 1);
    }

    /* the defects: bucketed by brightness and width, one stroke each */
    const paths = [];
    const fall = S * (o.micro ? 0.55 : 0.5);
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i], d = list[s.d];
      const vis = clamp((d.rank - f) / 0.035);
      if (vis <= 0) continue;
      let ux = lx - s.mx, uy = ly - s.my;
      const dist = Math.hypot(ux, uy) || 1;
      ux /= dist; uy /= dist;
      const c = 1 - Math.abs(s.dx * ux + s.dy * uy);
      let tan = c;
      for (let j = 1; j < d.k; j++) tan *= c;
      const q = dist / fall, near = 0.1 + 0.9 * Math.exp(-q * q);
      const a = d.a * vis * tan * near;
      if (a < 0.03) continue;
      const b = Math.min(BK - 1, Math.floor(a * BK)), wk = d.w > 1.05 ? 1 : 0, key = b * 2 + wk;
      const p = paths[key] || (paths[key] = new Path2D());
      p.moveTo(s.x1, s.y1); p.lineTo(s.x2, s.y2);
    }
    g.lineCap = 'round';
    for (let k = 0; k < paths.length; k++) {
      if (!paths[k]) continue;
      const b = k >> 1, wide = k & 1;
      g.strokeStyle = `rgba(236,240,250,${((b + 0.6) / BK).toFixed(3)})`;
      g.lineWidth = (wide ? 1.4 : 0.75) * (o.micro ? 1.8 : 1);
      g.stroke(paths[k]);
    }

    /* the light's reflection: wide and soft on hazy paint, a crisp disc
       on corrected paint */
    const rc = S * (o.micro ? 0.05 : 0.016) * (1.6 - 0.6 * clear);
    const rg = S * (0.06 + 0.12 * (1 - clear));
    const glow = g.createRadialGradient(lx, ly, 0, lx, ly, rg);
    glow.addColorStop(0, `rgba(255,255,255,${(0.32 - 0.1 * clear).toFixed(3)})`); glow.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = glow; g.fillRect(lx - rg, ly - rg, rg * 2, rg * 2);
    const core = g.createRadialGradient(lx, ly, 0, lx, ly, rc);
    const edge = 0.45 + 0.4 * clear;
    core.addColorStop(0, 'rgba(255,255,255,1)'); core.addColorStop(edge, 'rgba(255,255,255,.95)'); core.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = core; g.beginPath(); g.arc(lx, ly, rc, 0, Math.PI * 2); g.fill();

    /* edges fall away into the dark */
    g.globalCompositeOperation = 'source-over';
    const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.hypot(W, H) * 0.6);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${o.micro ? 0.6 : 0.45})`);
    g.fillStyle = v; g.fillRect(0, 0, W, H);
    g.restore();
  };

  /* ---- running: ease the level and the light, only while seen ---- */
  let fT = 0, lxT = st.lx, lyT = st.ly, follow = false, raf = 0, last = 0, t = o.seed, seen = false;
  const drift = !!env.motion;
  const frame = now => {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    t += dt;
    if (drift && !follow) {
      lxT = 0.5 + (o.micro ? 0.16 : 0.27) * Math.sin(t * 0.21);
      lyT = 0.46 + (o.micro ? 0.14 : 0.2) * Math.sin(t * 0.29 + 1.3);
    }
    const kf = env.motion ? 1 - Math.exp(-dt * 2.6) : 1, kl = env.motion ? 1 - Math.exp(-dt * 7) : 1;
    st.f += (fT - st.f) * kf;
    if (Math.abs(fT - st.f) < 0.0005) st.f = fT;
    st.lx += (lxT - st.lx) * kl; st.ly += (lyT - st.ly) * kl;
    draw();
    if (seen && (drift || st.f !== fT || Math.abs(lxT - st.lx) > 0.001 || Math.abs(lyT - st.ly) > 0.001)) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => {
      seen = e.isIntersecting;
      if (seen) kick();
    }), { rootMargin: '80px 0px' }).observe(box);
  } else { seen = true; kick(); }
  if ('ResizeObserver' in window) {
    let w0 = 0, h0 = 0;
    new ResizeObserver(() => {
      const r = box.getBoundingClientRect();
      if (Math.abs(r.width - w0) < 1 && Math.abs(r.height - h0) < 1) return;
      w0 = r.width; h0 = r.height;
      size(); draw();
    }).observe(box);
  }
  size(); draw();
  box.classList.add('is-live');

  return {
    setF(v) { fT = clamp(v); if (!env.motion) st.f = fT; kick(); },
    light(x, y) { follow = true; lxT = clamp(x, 0.04, 0.96); lyT = clamp(y, 0.06, 0.94); kick(); },
    release() { follow = false; kick(); }
  };
}

/* ---------- 55 · the microscope ---------- */
function micro(box) {
  const cv = $('[data-scope-cv]', box);
  if (cv) surface(box, cv, { seed: 21, micro: true, lx: 0.4, ly: 0.36 });
}

/* ---------- 56 · the five levels ---------- */
function levels(sec) {
  const panel = $('[data-scope="levels"]', sec);
  const cv = panel && $('[data-scope-cv]', panel);
  const cards = $$('[data-card]', sec);
  const stops = $$('[data-go]', sec);
  if (!cv || !cards.length) return;
  const paint = surface(panel, cv, { seed: 9, lx: 0.42, ly: 0.4 });
  if (!paint) return;

  const row = $('[data-scope-cards]', sec);
  const group = $('[data-scope-stops]', sec);
  const fill = $('[data-scope-fill]', sec);
  const lvEl = $('[data-scope-lv]', sec), rk = $('[data-scope-rk]', sec), rv = $('[data-scope-val]', sec);
  const nEl = $('[data-scope-n]', sec), prog = $('[data-scope-prog]', sec);
  const prev = $('[data-scope-prev]', sec), next = $('[data-scope-next]', sec);
  const before = $('[data-scope-before]', sec);
  const isRow = window.matchMedia('(max-width: 1023px)');
  const N = cards.length;
  let cur = 0, held = false, started = false;

  group.hidden = false;
  before.hidden = false;
  sec.classList.add('is-live');

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const readout = (kick, rkText, html) => {
    const swap = () => { lvEl.textContent = kick; rk.textContent = rkText; rv.innerHTML = html; rv.classList.remove('is-out'); lvEl.classList.remove('is-out'); };
    if (!env.motion) { swap(); return; }
    rv.classList.add('is-out'); lvEl.classList.add('is-out');
    setTimeout(swap, 220);
  };
  const show = () => {
    const c = cards[cur];
    if (held || !started) { readout(c.dataset.kick, '', 'Before correction'); paint.setF(0); return; }
    const up = c.dataset.up;
    readout(c.dataset.kick, 'Defect removal', (up ? `<small>${esc(up)}</small> ` : '') + esc(c.dataset.fig));
    paint.setF(+c.dataset.f);
  };

  const rowTo = (i, behavior) => {
    if (!isRow.matches || !row) return;
    const pad = parseFloat(getComputedStyle(row).scrollPaddingLeft) || 0;
    const left = row.scrollLeft + cards[i].getBoundingClientRect().left - row.getBoundingClientRect().left - pad;
    row.scrollTo({ left, behavior: env.motion ? behavior || 'smooth' : 'auto' });
  };
  let lock = 0;
  const go = (i, from) => {
    i = clamp(i, 0, N - 1);
    const changed = i !== cur;
    cur = i;
    cards.forEach((c, k) => { c.classList.toggle('is-on', k === i); c.classList.toggle('is-prev', k < i); });
    stops.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-past', k < i); s.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    if (fill) fill.parentNode.style.setProperty('--p', (i / (N - 1)).toFixed(3));
    if (nEl) nEl.textContent = String(i + 1).padStart(2, '0');
    if (prog) prog.parentNode.style.setProperty('--p', ((i + 1) / N).toFixed(3));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === N - 1;
    if (from !== 'scroll' && from !== 'pin') { lock = Date.now() + 700; if (pinTo(i)) return; rowTo(i); }
    if (changed || from === 'init') show();
  };

  stops.forEach((s, k) => s.addEventListener('click', () => { started = true; go(k); }));
  group.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    started = true;
    go(cur + (e.key === 'ArrowRight' ? 1 : -1));
    stops[cur].focus();
  });
  if (prev) prev.addEventListener('click', () => { started = true; go(cur - 1); });
  if (next) next.addEventListener('click', () => { started = true; go(cur + 1); });

  /* the swipe moves the panel too */
  if (row) {
    let tick = 0;
    row.addEventListener('scroll', () => {
      if (tick || !isRow.matches) return;
      tick = requestAnimationFrame(() => {
        tick = 0;
        if (Date.now() < lock) return;
        const x0 = row.getBoundingClientRect().left + (parseFloat(getComputedStyle(row).scrollPaddingLeft) || 0);
        let best = 0, bd = Infinity;
        cards.forEach((c, k) => { const d = Math.abs(c.getBoundingClientRect().left - x0); if (d < bd) { bd = d; best = k; } });
        if (best !== cur) { started = true; go(best, 'scroll'); }
      });
    }, { passive: true });
  }

  /* hold to see before */
  const down = e => { if (e) e.preventDefault(); if (held) return; held = true; before.classList.add('is-down'); show(); };
  const up = () => { if (!held) return; held = false; before.classList.remove('is-down'); show(); };
  before.addEventListener('pointerdown', e => { down(e); try { before.setPointerCapture(e.pointerId); } catch (_) {} });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => before.addEventListener(t, up));
  before.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down(e); });
  before.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') up(); });
  before.addEventListener('blur', up);
  before.addEventListener('contextmenu', e => e.preventDefault());

  /* the light: the mouse carries it; a finger can drag it sideways */
  let dragging = false;
  const toLight = e => { const r = panel.getBoundingClientRect(); paint.light((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); };
  panel.addEventListener('pointermove', e => {
    if (e.target.closest('[data-scope-before]')) return;
    if (e.pointerType === 'mouse' || dragging) toLight(e);
  });
  panel.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') paint.release(); });
  panel.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' && !e.target.closest('[data-scope-before]')) { dragging = true; toLight(e); } });
  ['pointerup', 'pointercancel'].forEach(t => panel.addEventListener(t, () => { if (dragging) { dragging = false; paint.release(); } }));

  /* desktop (08/10, Fender: "đổi sang thao tác cuộn xuống"): the body
     holds still under the page bar while the scroll walks the five
     levels; a stop or an arrow key scrolls to its level. One fixed top
     (never the header's state, see About). Phones keep the swipe row. */
  let pin = null;
  gsap.matchMedia().add('(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', () => {
    const body = $('.pscope__body', sec);
    pin = ScrollTrigger.create({
      trigger: body, start: 'top 84px', end: () => '+=' + Math.round(window.innerHeight * 0.55 * N),
      pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      onEnter: () => { if (!started) { started = true; show(); } },
      onUpdate: self => {
        const i = Math.min(N - 1, Math.floor(self.progress * N));
        if (i !== cur) { started = true; go(i, 'pin'); }
      }
    });
    sec.classList.add('is-pinned');
    return () => { pin.kill(); pin = null; sec.classList.remove('is-pinned'); };
  });
  function pinTo(i) {
    if (!pin) return false;
    const y = Math.round(pin.start + (i + 0.5) / N * (pin.end - pin.start));
    if (env.lenis) env.lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
    return true;
  }

  go(0, 'init');
  /* the panel arrives as the car does, then level one clears it */
  whenSeen(panel, () => setTimeout(() => { if (!started) { started = true; show(); } }, env.motion ? 700 : 0), 0.3);
}
