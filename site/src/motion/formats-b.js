/* ============================================================
   formats-b.js — how blocks 51–52 behave (07/10, the ceramic page;
   the data side is lib/formats-b.js).

     benches   51: a painted panel, unprotected on the left, coated on
               the right; each point plays its own test on it (canvas)
     chooses   52: a button per version sets the scale and the list

   Every tier: the controls work without motion. Reduced motion: each
   test is drawn at its end, nothing turns by itself.
   ============================================================ */
import { ScrollTrigger, env, whenSeen, $, $$ } from './core.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = p => p * p * (3 - 2 * p);
const outCubic = p => 1 - Math.pow(1 - p, 3);
/* the same scratches and drops every time (mulberry32) */
const rng = seed => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* ---------- 51 · test panel ---------- */
export function benches() {
  $$('[data-bench]').forEach(bench);
}

/* the strip lights lie at this angle across the panel */
const ANG = -0.22;
const TAN = Math.tan(ANG);

function bench(sec) {
  const pts = $$('[data-pt]', sec);
  const panel = $('[data-bench-panel]', sec);
  const cv = $('[data-bench-cv]', sec);
  const g = cv && cv.getContext && cv.getContext('2d');
  if (!pts.length || !panel || !g) return;
  const capBox = $('.sbench__cap', sec), cap = $('[data-bench-cap]', sec), capN = $('[data-bench-n]', sec);
  const meter = $('[data-bench-meter]', sec);
  const desk = window.matchMedia('(min-width: 1024px)');
  const TURN = 8000;
  sec.style.setProperty('--turn', TURN + 'ms');
  sec.classList.add('is-live');

  let W = 1, H = 1, D = 1;
  let lit = null, bare = null;
  let cur = -1, demo = null, t = 0, last = 0, raf = 0;
  let inView = false, held = false, over = false, timer = 0, capT = 0;
  let ptr = null;

  /* ----- the paint: midnight purple, metallic flake, two strip lights ----- */
  const strip = (x, u, w, peak, warm) => {
    x.save();
    x.translate(W / 2, H * u);
    x.rotate(ANG);
    const hw = Math.max(0.6, w * H), L = W + H;
    const gr = x.createLinearGradient(0, -hw, 0, hw);
    const c = warm ? '255,236,205' : '255,255,255';
    gr.addColorStop(0, `rgba(${c},0)`);
    gr.addColorStop(0.3, `rgba(${c},${peak * 0.08})`);
    gr.addColorStop(0.45, `rgba(${c},${peak * 0.5})`);
    gr.addColorStop(0.5, `rgba(${c},${peak})`);
    gr.addColorStop(0.55, `rgba(${c},${peak * 0.5})`);
    gr.addColorStop(0.7, `rgba(${c},${peak * 0.08})`);
    gr.addColorStop(1, `rgba(${c},0)`);
    x.fillStyle = gr;
    x.fillRect(-L, -hw, 2 * L, 2 * hw);
    x.restore();
  };
  const vignette = x => {
    const v = x.createRadialGradient(W * 0.42, H * 0.38, Math.min(W, H) * 0.2, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.62);
    v.addColorStop(0, 'rgba(4,3,9,0)');
    v.addColorStop(1, 'rgba(4,3,9,.55)');
    x.fillStyle = v;
    x.fillRect(0, 0, W, H);
  };
  const paint = withStrips => {
    const c = document.createElement('canvas');
    c.width = cv.width; c.height = cv.height;
    const x = c.getContext('2d');
    x.setTransform(D, 0, 0, D, 0, 0);
    /* the panel's curve: lighter where it faces the ceiling */
    const lg = x.createLinearGradient(0, 0, W * 0.22, H);
    lg.addColorStop(0, '#2A2142'); lg.addColorStop(0.45, '#161127'); lg.addColorStop(1, '#08070D');
    x.fillStyle = lg; x.fillRect(0, 0, W, H);
    const rg = x.createRadialGradient(W * 0.3, H * 0.04, 0, W * 0.3, H * 0.04, Math.max(W, H));
    rg.addColorStop(0, 'rgba(150,132,206,.2)'); rg.addColorStop(0.55, 'rgba(96,80,160,.06)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
    /* flake: a fine grain, catching light only near a strip */
    const r = rng(7), n = Math.round(W * H / 7);
    for (let i = 0; i < n; i++) {
      const px = r() * W, py = r() * H;
      const d = withStrips ? Math.min(Math.abs(py - (H * 0.3 + (px - W / 2) * TAN)), Math.abs(py - (H * 0.76 + (px - W / 2) * TAN)) * 1.6) : H;
      const near = Math.exp(-(d * d) / (2 * Math.pow(H * 0.07, 2)));
      const a = 0.012 + Math.pow(r(), 4) * 0.07 + near * Math.pow(r(), 2) * 0.5;
      x.fillStyle = r() < 0.6 ? `rgba(214,200,255,${a.toFixed(3)})` : `rgba(255,255,255,${a.toFixed(3)})`;
      x.fillRect(px, py, 0.6, 0.6);
    }
    /* a swage line across the panel: a lit edge over a soft shadow */
    const cy = k => H * 0.6 + (k - 0.5) * W * TAN * 0.6;
    x.beginPath(); x.moveTo(0, cy(0)); x.quadraticCurveTo(W / 2, cy(0.5) - H * 0.02, W, cy(1));
    x.strokeStyle = 'rgba(255,255,255,.1)'; x.lineWidth = 1; x.stroke();
    x.save();
    x.beginPath(); x.moveTo(0, cy(0)); x.quadraticCurveTo(W / 2, cy(0.5) - H * 0.02, W, cy(1)); x.lineTo(W, H); x.lineTo(0, H); x.closePath();
    x.clip();
    const sh = x.createLinearGradient(0, cy(0.5) - H * 0.02, 0, cy(0.5) + H * 0.1);
    sh.addColorStop(0, 'rgba(0,0,0,.42)'); sh.addColorStop(1, 'rgba(0,0,0,.12)');
    x.fillStyle = sh; x.fillRect(0, 0, W, H);
    x.restore();
    if (withStrips) {
      x.globalCompositeOperation = 'screen';
      strip(x, 0.3, 0.16, 0.12);
      strip(x, 0.3, 0.035, 0.85);
      strip(x, 0.76, 0.1, 0.06);
      strip(x, 0.76, 0.02, 0.32);
      x.globalCompositeOperation = 'source-over';
    }
    vignette(x);
    return c;
  };

  const half = (side, fn) => {
    g.save();
    g.beginPath();
    if (side === 'l') g.rect(0, 0, W / 2, H); else g.rect(W / 2, 0, W / 2, H);
    g.clip();
    fn();
    g.restore();
  };
  const base = c => { g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.drawImage(c, 0, 0); g.setTransform(D, 0, 0, D, 0, 0); };

  /* a bead of water standing up on a coated surface */
  const bead = (x, y, r, k = 1) => {
    r *= k;
    if (r < 0.6) return;
    const sh = g.createRadialGradient(x + r * 0.2, y + r * 0.32, 0, x + r * 0.2, y + r * 0.32, r * 1.15);
    sh.addColorStop(0, 'rgba(0,0,0,.42)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sh;
    g.beginPath(); g.arc(x + r * 0.2, y + r * 0.32, r * 1.15, 0, Math.PI * 2); g.fill();
    const body = g.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.1, x, y, r);
    body.addColorStop(0, 'rgba(70,52,120,.05)'); body.addColorStop(0.72, 'rgba(18,12,36,.28)'); body.addColorStop(1, 'rgba(4,2,10,.62)');
    g.fillStyle = body;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    const ca = g.createRadialGradient(x + r * 0.22, y + r * 0.4, 0, x + r * 0.22, y + r * 0.4, r * 0.62);
    ca.addColorStop(0, 'rgba(215,200,255,.5)'); ca.addColorStop(1, 'rgba(215,200,255,0)');
    g.fillStyle = ca;
    g.beginPath(); g.arc(x, y, r * 0.96, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.32)'; g.lineWidth = 0.8;
    g.beginPath(); g.arc(x, y, r * 0.93, Math.PI * 1.08, Math.PI * 1.62); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.92)';
    g.beginPath(); g.ellipse(x - r * 0.36, y - r * 0.42, r * 0.22, r * 0.13, -0.6, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,.45)';
    g.beginPath(); g.arc(x + r * 0.34, y + r * 0.12, r * 0.07, 0, Math.PI * 2); g.fill();
  };
  /* water lying flat on bare paint: wide, irregular, barely there */
  const blob = (x, y, r, shape) => {
    /* a smooth closed curve through the midpoints of an uneven ring */
    const P = shape.map((k, i) => {
      const an = i / shape.length * Math.PI * 2;
      return [x + Math.cos(an) * r * k, y + Math.sin(an) * r * k * 0.9];
    });
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const n = P.length;
    g.beginPath();
    const m0 = mid(P[n - 1], P[0]);
    g.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i++) { const m = mid(P[i], P[(i + 1) % n]); g.quadraticCurveTo(P[i][0], P[i][1], m[0], m[1]); }
    g.closePath();
  };

  /* ----- the four tests ----- */
  const DEMOS = {
    /* I · swirls; gentle heat passes over both halves, the coated half's close */
    heal() {
      const r = rng(11), S = [];
      /* swirls ring the light, as they do under a lamp: concentric arcs,
         brightest where the strip falls */
      for (let i = 0; i < 150; i++) S.push({ arc: true, rad: 0.03 + Math.pow(r(), 0.9) * 0.62, a0: r() * Math.PI * 2, len: 0.05 + r() * 0.2, w: 0.45 + r() * 0.6, a: 0.25 + r() * 0.4, h: 0 });
      for (let i = 0; i < 6; i++) S.push({ arc: false, x0: r(), y0: 0.15 + r() * 0.4, ang: (r() - 0.5) * 0.7, l: 0.08 + r() * 0.16, w: 0.6 + r() * 0.4, a: 0.3 + r() * 0.2, h: 0 });
      const lightAt = (x, y) => { const d = y - (H * 0.3 + (x - W / 2) * TAN); return 0.18 + 0.82 * Math.exp(-(d * d) / (2 * Math.pow(H * 0.17, 2))); };
      S.forEach(s => { s.lit = null; });
      const path = (s, k) => {
        const R = Math.max(W, H) * s.rad;
        if (s.arc) { const an = s.a0 + s.len * k; return [W * 0.5 + Math.cos(an) * R, H * 0.3 + Math.sin(an) * R]; }
        const L = s.l * W;
        return [s.x0 * W + Math.cos(s.ang) * L * k, s.y0 * H + Math.sin(s.ang) * L * k];
      };
      const autoAt = () => {
        const q = smooth(clamp((t - 0.5) / 4.2));
        return [(-0.18 + 1.36 * q) * W, H * (0.5 + 0.18 * Math.sin(q * Math.PI * 2.2))];
      };
      const autoOn = () => clamp((t - 0.3) / 0.6) * clamp((5 - t) / 0.6);
      /* the glow and its place ease towards the pointer, or the path */
      let on = 0, hx = -W, hy = H / 2;
      const line = (s, alpha) => {
        if (s.lit == null || s.litW !== W) { const [x, y] = path(s, 0.5); s.lit = lightAt(x, y); s.litW = W; }
        alpha *= s.lit;
        if (alpha < 0.01) return;
        g.strokeStyle = `rgba(232,226,255,${alpha.toFixed(3)})`;
        g.lineWidth = s.w;
        g.beginPath();
        if (s.arc) g.arc(W * 0.5, H * 0.3, Math.max(W, H) * s.rad, s.a0, s.a0 + s.len);
        else { const [x0, y0] = path(s, 0), [x1, y1] = path(s, 1); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + 6, x1, y1); }
        g.stroke();
      };
      return {
        dur: 6.2, ptr: true,
        busy: () => Math.abs((ptr ? 1 : autoOn()) - on) > 0.01,
        step(dt) {
          on += ((ptr ? 1 : autoOn()) - on) * Math.min(1, dt * 7);
          if (ptr) { const k = Math.min(1, dt * 12); hx += (ptr.x - hx) * k; hy += (ptr.y - hy) * k; }
          else if (t < this.dur) [hx, hy] = autoAt();
          const R = Math.max(W, H) * 0.3;
          S.forEach(s => {
            if (s.h >= 1) return;
            let d = Infinity;
            for (let k = 0; k <= 1; k += 0.25) { const [x, y] = path(s, k); if (x > W / 2) d = Math.min(d, Math.hypot(x - hx, y - hy)); }
            if (d < R && on > 0.1) s.h = Math.min(1, s.h + dt * 1.9 * Math.sqrt(1 - d / R));
            if (!ptr && t > 4.9 && d < Infinity) s.h = Math.min(1, s.h + dt * 1.4);
          });
        },
        end() { S.forEach(s => { s.h = 1; }); t = this.dur; on = 0; },
        draw() {
          base(lit);
          half('l', () => S.forEach(s => line(s, s.a)));
          half('r', () => S.forEach(s => line(s, s.a * (1 - smooth(s.h)))));
          if (env.motion && on > 0.01) {
            const R = Math.max(W, H) * 0.34;
            g.globalCompositeOperation = 'screen';
            const gl = g.createRadialGradient(hx, hy, 0, hx, hy, R);
            gl.addColorStop(0, `rgba(255,160,84,${(0.34 * on).toFixed(3)})`);
            gl.addColorStop(0.45, `rgba(255,118,52,${(0.12 * on).toFixed(3)})`);
            gl.addColorStop(1, 'rgba(255,100,40,0)');
            g.fillStyle = gl;
            g.fillRect(0, 0, W, H);
            g.globalCompositeOperation = 'source-over';
          }
        }
      };
    },

    /* II · fallout lands on both halves: it beads and runs off the coated
       half; on the bare half it sits, dries and leaves its mark */
    chem() {
      const r = rng(23), P = [];
      for (let i = 0; i < 10; i++) {
        const shape = Array.from({ length: 9 }, () => 0.84 + r() * 0.3);
        P.push({ fx: 0.07 + r() * 0.34, fy: 0.12 + r() * 0.62, s: 0.6 + r() * 0.6, tl: 0.25 + i * 0.19 + r() * 0.12, go: 0.7 + r() * 0.7, acc: 0.8 + r() * 0.9, wob: r() * 6, shape, y: 0, v: 0 });
      }
      const size = p => p.s * Math.min(W, H) * 0.03;
      return {
        dur: 7.2, ptr: false,
        step(dt) {
          P.forEach(p => {
            if (t < p.tl + p.go) return;
            p.v += p.acc * H * dt;
            p.y += p.v * dt;
          });
        },
        end() { t = this.dur; P.forEach(p => { p.y = H * 2; }); },
        draw() {
          base(lit);
          half('l', () => P.forEach(p => {
            const x = p.fx * W, y = p.fy * H, rr = size(p) * 1.7;
            const dry = clamp((t - p.tl - 2.4) / 2);
            if (dry > 0) {
              blob(x, y, rr * (1 - 0.06 * dry), p.shape);
              g.fillStyle = `rgba(206,196,226,${(0.07 * dry).toFixed(3)})`; g.fill();
              g.strokeStyle = `rgba(232,224,246,${(0.22 * dry).toFixed(3)})`; g.lineWidth = 1.4; g.stroke();
            }
            const k = clamp((t - p.tl) / 0.22);
            const a = k * (1 - dry);
            if (a <= 0.01) return;
            blob(x, y, rr * (0.6 + 0.4 * outCubic(k)) * (1 - 0.1 * dry), p.shape);
            g.fillStyle = `rgba(255,255,255,${(0.045 * a).toFixed(3)})`; g.fill();
            g.strokeStyle = `rgba(255,255,255,${(0.16 * a).toFixed(3)})`; g.lineWidth = 0.9; g.stroke();
            g.fillStyle = `rgba(255,255,255,${(0.35 * a).toFixed(3)})`;
            g.beginPath(); g.ellipse(x - rr * 0.4, y - rr * 0.35, rr * 0.12, rr * 0.06, -0.5, 0, Math.PI * 2); g.fill();
          }));
          half('r', () => P.forEach(p => {
            const k = clamp((t - p.tl) / 0.3);
            if (k <= 0) return;
            const pop = k < 1 ? 1 + Math.sin(k * Math.PI) * 0.18 : 1;
            const x = (p.fx + 0.5) * W + Math.sin(p.y / H * 9 + p.wob) * 1.5, y = p.fy * H + p.y;
            if (p.y > 2) {
              const tr = g.createLinearGradient(0, p.fy * H, 0, y);
              tr.addColorStop(0, 'rgba(255,255,255,0)'); tr.addColorStop(1, 'rgba(255,255,255,.05)');
              g.strokeStyle = tr; g.lineWidth = size(p) * 0.5; g.lineCap = 'round';
              g.beginPath(); g.moveTo((p.fx + 0.5) * W, Math.max(p.fy * H, y - H * 0.25)); g.lineTo(x, y); g.stroke();
            }
            if (y - size(p) < H) bead(x, y, size(p), k * pop);
          }));
        }
      };
    },

    /* III · years of sun: the bare half fades and chalks, the coated half keeps its colour */
    uv() {
      const r = rng(31), B = [];
      for (let i = 0; i < 26; i++) B.push({ x: r() * 0.5, y: r(), s: 0.05 + r() * 0.14, a: 0.4 + r() * 0.6 });
      const year = () => smooth(clamp((t - 0.5) / 4.6));
      let shown = '';
      const say = k => {
        const s = k < 0.04 ? 'New paint' : `Year ${Math.max(1, Math.ceil(k * 5 - 0.001))}`;
        if (meter && s !== shown) { meter.textContent = s; shown = s; }
      };
      return {
        dur: 5.6, ptr: false, meter: true,
        step() {},
        end() { t = this.dur; },
        draw() {
          const k = year();
          say(k);
          base(lit);
          /* the sun, from the top right, on both halves */
          g.globalCompositeOperation = 'screen';
          for (let i = 0; i < 3; i++) {
            g.save();
            g.translate(W * (0.95 - i * 0.22), -H * 0.1);
            g.rotate(0.55 + i * 0.06);
            const w = H * (0.06 + i * 0.03), L = W + H;
            const sg = g.createLinearGradient(-w, 0, w, 0);
            const a = (0.05 + 0.02 * Math.sin(t * 1.3 + i * 2)) * (env.motion ? 1 : 0.8);
            sg.addColorStop(0, 'rgba(255,226,170,0)'); sg.addColorStop(0.5, `rgba(255,226,170,${a.toFixed(3)})`); sg.addColorStop(1, 'rgba(255,226,170,0)');
            g.fillStyle = sg;
            g.fillRect(-w, 0, 2 * w, L);
            g.restore();
          }
          g.globalCompositeOperation = 'source-over';
          if (k <= 0.001) return;
          half('l', () => {
            g.globalCompositeOperation = 'saturation';
            g.fillStyle = `rgba(128,128,128,${(0.62 * k).toFixed(3)})`;
            g.fillRect(0, 0, W / 2, H);
            g.globalCompositeOperation = 'source-over';
            g.fillStyle = `rgba(168,150,186,${(0.19 * k).toFixed(3)})`;
            g.fillRect(0, 0, W / 2, H);
            g.globalCompositeOperation = 'screen';
            B.forEach(b => {
              const R = b.s * Math.max(W, H);
              const bg = g.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, R);
              bg.addColorStop(0, `rgba(200,190,210,${(0.09 * b.a * k).toFixed(3)})`); bg.addColorStop(1, 'rgba(200,190,210,0)');
              g.fillStyle = bg;
              g.fillRect(b.x * W - R, b.y * H - R, 2 * R, 2 * R);
            });
            g.globalCompositeOperation = 'source-over';
          });
        }
      };
    },

    /* IV · one strip light across both halves: soft and grey on bare
       paint, sharp and deep on the coating */
    gloss() {
      const autoAt = () => -0.2 + 0.62 * outCubic(clamp((t - 0.3) / 4.2));
      const at = () => clamp((ptr.y - (ptr.x - W / 2) * TAN) / H, -0.1, 1.1);
      /* the light eases to the pointer and stays where it was left */
      let u = autoAt();
      return {
        dur: 4.8, ptr: true,
        busy: () => !!ptr && Math.abs(at() - u) > 0.002,
        step(dt) {
          if (ptr) u += (at() - u) * Math.min(1, dt * 9);
          else if (t < this.dur) u = autoAt();
        },
        end() { t = this.dur; u = autoAt(); },
        draw() {
          base(bare);
          half('l', () => {
            g.fillStyle = 'rgba(150,140,175,.1)';
            g.fillRect(0, 0, W / 2, H);
            g.globalCompositeOperation = 'screen';
            strip(g, u, 0.3, 0.12);
            strip(g, u, 0.13, 0.26);
            strip(g, u + 0.42, 0.18, 0.08);
            g.globalCompositeOperation = 'source-over';
          });
          half('r', () => {
            g.globalCompositeOperation = 'multiply';
            g.fillStyle = 'rgba(150,128,205,.55)';
            g.fillRect(W / 2, 0, W / 2, H);
            g.globalCompositeOperation = 'screen';
            strip(g, u, 0.12, 0.1);
            strip(g, u, 0.028, 0.95);
            strip(g, u, 0.006, 1);
            strip(g, u + 0.42, 0.012, 0.42);
            g.globalCompositeOperation = 'source-over';
          });
          vignette(g);
        }
      };
    }
  };

  /* ----- drawing and the loop ----- */
  const draw = () => {
    if (!demo) { base(lit); return; }
    demo.draw();
  };
  const running = () => inView && env.motion && demo && (t < demo.dur || (ptr && demo.ptr) || (demo.busy && demo.busy()));
  const loop = now => {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (t < demo.dur || ptr) t += dt;
    demo.step(dt);
    draw();
    if (running()) raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf && running()) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };

  const size = () => {
    const r = panel.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    const d = Math.min(2, window.devicePixelRatio || 1);
    if (w === W && h === H && d === D && lit) return;
    W = w; H = h; D = d;
    cv.width = Math.round(W * D); cv.height = Math.round(H * D);
    lit = paint(true); bare = paint(false);
    g.setTransform(D, 0, 0, D, 0, 0);
    draw();
  };

  /* ----- the points ----- */
  const set = (i, replay) => {
    if (i === cur && !replay) return;
    const changed = i !== cur;
    cur = i;
    pts.forEach((p, j) => {
      p.classList.toggle('is-on', j === i);
      $('.sbench__btn', p).setAttribute('aria-expanded', String(j === i));
    });
    const p = pts[i];
    demo = DEMOS[p.dataset.demo] ? DEMOS[p.dataset.demo]() : null;
    t = 0;
    if (meter) meter.classList.toggle('is-on', !!(demo && demo.meter));
    if (changed && cap) {
      capBox.classList.add('is-out');
      clearTimeout(capT);
      capT = setTimeout(() => {
        cap.textContent = p.dataset.cap || '';
        if (capN) capN.textContent = $('.sbench__n', p).textContent;
        capBox.classList.remove('is-out');
      }, env.motion ? 220 : 0);
    }
    if (!env.motion && demo) demo.end();
    draw();
    kick();
  };
  const auto = () => env.motion && env.fine && desk.matches && !held && !over && inView;
  const tick = () => {
    clearTimeout(timer);
    sec.classList.toggle('is-auto', auto());
    if (!auto()) return;
    timer = setTimeout(() => { set((cur + 1) % pts.length); tick(); }, TURN);
  };

  size();
  set(0);
  if ('ResizeObserver' in window) new ResizeObserver(() => size()).observe(panel);
  else window.addEventListener('resize', size);

  pts.forEach((p, i) => {
    $('.sbench__btn', p).addEventListener('click', () => {
      if (desk.matches && env.fine) held = true;
      set(i, true);
      tick();
      ScrollTrigger.refresh();
      /* tablets and phones: the panel is above the list; bring it in view */
      if (!desk.matches) {
        requestAnimationFrame(() => {
          const top = panel.getBoundingClientRect().top;
          if (top < 110) window.scrollBy({ top: top - 118, behavior: env.motion ? 'smooth' : 'auto' });
        });
      }
    });
  });

  if (env.fine) {
    const list = $('.sbench__pts', sec);
    [list, panel].forEach(el => {
      if (!el) return;
      el.addEventListener('pointerenter', () => { over = true; tick(); });
      el.addEventListener('pointerleave', () => { over = false; tick(); });
    });
    if (env.motion) {
      panel.addEventListener('pointermove', e => {
        const r = panel.getBoundingClientRect();
        ptr = { x: e.clientX - r.left, y: e.clientY - r.top };
        if (demo && demo.ptr) { kick(); if (!raf) draw(); }
      });
      panel.addEventListener('pointerleave', () => {
        ptr = null;
        if (demo && demo.ptr) { kick(); draw(); }
      });
    }
  }

  const io = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
    const was = inView;
    inView = e.isIntersecting;
    if (inView && !was) size();
    kick();
    tick();
  }), { rootMargin: '-8% 0px' });
  if (io) io.observe(panel);
  else { inView = true; kick(); tick(); }
}

/* ---------- 52 · choose one ---------- */
export function chooses() {
  $$('[data-choose]').forEach(sec => {
    const opts = $$('[data-opt]', sec), panels = $$('[data-panel]', sec);
    const scale = $('.schoose__scale', sec), ticks = $$('.schoose__ticks li', sec);
    if (!opts.length) return;
    sec.classList.add('is-live');
    let cur = 0, shown = false;
    const fillScale = () => {
      if (!scale || !shown) return;
      const a = opts[cur].dataset.a, b = opts[cur].dataset.b;
      scale.style.setProperty('--a', a);
      scale.style.setProperty('--b', b);
      sec.toggleAttribute('data-span', parseFloat(b) > parseFloat(a) + 0.01);
      const end = parseFloat(b) / 100 * (ticks.length - 1);
      ticks.forEach((li, j) => li.classList.toggle('is-in', j > 0 && j <= end + 0.001));
    };
    const set = i => {
      cur = i;
      opts.forEach((o, j) => o.setAttribute('aria-pressed', String(j === i)));
      panels.forEach((p, j) => p.classList.toggle('is-on', j === i));
      fillScale();
    };
    opts.forEach((o, i) => o.addEventListener('click', () => set(i)));
    set(0);
    /* the scale fills the first time it is seen */
    const show = () => { shown = true; fillScale(); };
    if (env.motion && scale) whenSeen(scale, () => setTimeout(show, 250), 0.15);
    else show();
  });
}
