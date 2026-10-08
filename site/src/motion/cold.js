/* ============================================================
   cold.js — dry ice, "−78.5°C", redrawn (07/10, Fender: "vẽ lại cho
   hẳn hoi xịn xò"). One canvas, painted every frame while it is on
   screen; the scroll sets where the story is (p 0→1), time keeps the
   pellets flying and the vapour moving.

     I   impact      0.00–0.33  the stream starts, pellets strike the
                                crust, it shivers
     II  cold        0.33–0.66  frost spreads from the strike zone,
                                crystals grow, the readout falls to
                                −78.5°C, the crust cracks
     III sublimation 0.66–1.00  pellets turn straight to gas (CO2 is
                                heavier than air: the vapour rolls
                                along the surface and spills over the
                                edge), the crust flakes off from the
                                centre out, the bare machined metal
                                is left, a light runs along its edge

   Scene in fixed units (1600 × 1000), scaled to the stage. Seeded
   random, so every visit draws the same block and the same crust.
   Desktop: the stage holds still beside the three beats. Phones (07/10:
   held again, but small): a band under the page bar, ~28% of the
   screen, the beats pass beneath it. Reduced motion: one still frame,
   every beat lit.
   ============================================================ */
import { gsap, env, $, $$ } from './core.js';
import { sfx } from './sound.js';

const W = 1600, H = 1000;
const TOP_BACK = 455, EDGE = 650;       /* top face of the block: back edge, front edge */
const HIT = { x: 900, y: 600 };         /* centre of the strike zone */
const TIP = { x: 470, y: 268 };         /* the nozzle's mouth */
const PHASES = ['Impact', 'On contact', 'Solid to gas'];

/* ---------- seeded random ---------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- the crust: chunks along the top face ---------- */
function makeCrust() {
  const r = rng(7);
  const chunks = [];
  let x = 300;
  while (x < 1500) {
    const w = 70 + r() * 80;
    const x0 = x, x1 = Math.min(1510, x + w);
    const h = 44 + r() * 52 * (1 - Math.abs((x0 + x1) / 2 - HIT.x) / 1500);
    const top = [];
    const n = 8 + Math.floor(r() * 5);
    const ph = r() * 6;
    for (let i = 0; i <= n; i++) {
      const k = i / n;
      const tx = lerp(x0 - 6, x1 + 6, k);
      /* a lump: high in the middle, sloping to its neighbours */
      const bump = Math.pow(Math.sin(Math.PI * k), 0.42);
      const grain = 0.82 + 0.18 * Math.sin(ph + k * 9) + (r() - 0.5) * 0.16;
      top.push([tx, EDGE - 6 - h * (0.3 + 0.7 * bump) * grain]);
    }
    const cx = (x0 + x1) / 2, cy = EDGE - 6 - h / 2;
    const side = Math.sign(cx - HIT.x) || 1;
    const order = clamp(Math.abs(cx - HIT.x) / 640 + r() * 0.18);
    /* cracks: one or two jagged lines from the top down */
    const cracks = [];
    const nc = 1 + (r() > 0.5 ? 1 : 0);
    for (let k = 0; k < nc; k++) {
      let px = lerp(x0 + 8, x1 - 8, r()), py = EDGE - 6 - h * 0.9;
      const pts = [[px, py]];
      while (py < EDGE - 6) { px += (r() - 0.5) * 9; py += 5 + r() * 7; pts.push([px, Math.min(py, EDGE - 5)]); }
      cracks.push(pts);
    }
    /* small bits that break away with it */
    const bits = [];
    for (let k = 0; k < 6; k++) bits.push({ x: lerp(x0, x1, r()), y: EDGE - 8 - r() * h, s: 3 + r() * 6, vx: side * (40 + r() * 260), vy: 160 + r() * 360, vr: (r() - 0.5) * 14 });
    chunks.push({
      x0, x1, h, top, cx, cy, cracks, bits,
      shade: 0.75 + r() * 0.35,
      tD: 0.68 + order * 0.2,
      vx: side * (50 + r() * 200), vy: 140 + r() * 260, vr: (r() - 0.5) * 3.2,
      spots: Array.from({ length: 9 }, () => [lerp(x0 + 4, x1 - 4, r()), EDGE - 8 - r() * h * 0.8, 1 + r() * 3])
    });
    x = x1 - 2 - r() * 6;
  }
  return chunks;
}

/* a smooth line through the contour points (midpoint quadratics) */
function contour(g, pts, dy = 0, move = true) {
  const [fx, fy] = pts[0];
  if (move) g.moveTo(fx, fy + dy); else g.lineTo(fx, fy + dy);
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i], [nx, ny] = pts[i + 1];
    g.quadraticCurveTo(x, y + dy, (x + nx) / 2, (y + ny) / 2 + dy);
  }
  const [lx, ly] = pts[pts.length - 1];
  g.lineTo(lx, ly + dy);
}

/* ---------- frost crystals: short branching strokes ---------- */
function makeFrost() {
  const r = rng(21);
  const list = [];
  for (let i = 0; i < 46; i++) {
    const sx = HIT.x + (r() - 0.5) * 1150, sy = lerp(EDGE - 70, EDGE - 6, r());
    const segs = [];
    const grow = (x, y, a, len, depth) => {
      const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len;
      segs.push([x, y, nx, ny]);
      if (depth > 0) {
        grow(nx, ny, a + (r() - 0.5) * 0.6, len * 0.82, depth - 1);
        if (r() > 0.45) grow(nx, ny, a + (r() > 0.5 ? 1 : -1) * (0.7 + r() * 0.5), len * 0.6, depth - 2);
      }
    };
    grow(sx, sy, r() * Math.PI * 2, 4 + r() * 5, 2);
    list.push({ d: Math.hypot(sx - HIT.x, (sy - HIT.y) * 2.2), segs, dots: Array.from({ length: 4 }, () => [sx + (r() - 0.5) * 40, sy + (r() - 0.5) * 16]) });
  }
  return list;
}

/* ---------- the machined block, painted once per size ---------- */
function paintBlock(c) {
  const g = c.getContext('2d');
  /* front face: brushed aluminium, a soft key light from the top left */
  let gr = g.createLinearGradient(0, EDGE, 0, H);
  gr.addColorStop(0, '#5d6268'); gr.addColorStop(0.18, '#3c4046'); gr.addColorStop(1, '#16181b');
  g.fillStyle = gr; g.fillRect(0, EDGE, W, H - EDGE);
  /* cooling ribs: machined, running along the casing */
  for (let k = 0; k < 6; k++) {
    const y = EDGE + 70 + k * 52;
    let fg = g.createLinearGradient(0, y, 0, y + 30);
    fg.addColorStop(0, 'rgba(255,255,255,.16)'); fg.addColorStop(0.12, 'rgba(255,255,255,.05)'); fg.addColorStop(0.75, 'rgba(0,0,0,.1)'); fg.addColorStop(1, 'rgba(0,0,0,.55)');
    g.fillStyle = fg; g.fillRect(0, y, W, 30);
    fg = g.createLinearGradient(0, y + 30, 0, y + 52);
    fg.addColorStop(0, 'rgba(0,0,0,.5)'); fg.addColorStop(1, 'rgba(0,0,0,.15)');
    g.fillStyle = fg; g.fillRect(0, y + 30, W, 22);
  }
  /* brushing */
  const r = rng(3);
  for (let i = 0; i < 900; i++) {
    const y = EDGE + r() * (H - EDGE), x = r() * W, l = 60 + r() * 380;
    g.strokeStyle = `rgba(${r() > 0.5 ? '255,255,255' : '0,0,0'},${(0.015 + r() * 0.04).toFixed(3)})`;
    g.lineWidth = 0.6 + r() * 0.8;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y); g.stroke();
  }
  /* a broad reflection running down the face */
  gr = g.createLinearGradient(300, 0, 1300, 0);
  gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.45, 'rgba(255,255,255,.05)'); gr.addColorStop(0.55, 'rgba(255,255,255,.09)'); gr.addColorStop(0.62, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, EDGE, W, H - EDGE);
  /* two bolt heads */
  [[150, 930], [1450, 930]].forEach(([x, y]) => {
    g.save(); g.translate(x, y);
    const bg = g.createRadialGradient(-8, -10, 2, 0, 0, 34);
    bg.addColorStop(0, '#9aa0a7'); bg.addColorStop(0.5, '#4a4e54'); bg.addColorStop(1, '#1b1d20');
    g.fillStyle = bg; g.beginPath();
    for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; g.lineTo(Math.cos(a) * 30, Math.sin(a) * 30); }
    g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1.5; g.stroke();
    g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fill();
    g.restore();
  });
  /* the top face, receding: lighter, catching the overhead light */
  gr = g.createLinearGradient(0, TOP_BACK, 0, EDGE);
  gr.addColorStop(0, '#1f2226'); gr.addColorStop(0.55, '#4b5056'); gr.addColorStop(1, '#7d838a');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(0, TOP_BACK + 10); g.lineTo(W, TOP_BACK - 10); g.lineTo(W, EDGE); g.lineTo(0, EDGE); g.closePath(); g.fill();
  for (let i = 0; i < 420; i++) {
    const y = lerp(TOP_BACK, EDGE, r()), x = r() * W, l = 80 + r() * 300;
    g.strokeStyle = `rgba(255,255,255,${(0.015 + r() * 0.045).toFixed(3)})`; g.lineWidth = 0.7;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y - l * 0.0125); g.stroke();
  }
  /* two softboxes reflected in the machined top */
  [[TOP_BACK + 52, 26, 0.16], [TOP_BACK + 128, 14, 0.1]].forEach(([y, h, a]) => {
    const sg = g.createLinearGradient(0, y - h, 0, y + h);
    sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, `rgba(255,255,255,${a})`); sg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sg; g.fillRect(0, y - h, W, h * 2);
  });
  /* the back wall: barely there, a cool falloff */
  gr = g.createLinearGradient(0, 0, 0, TOP_BACK);
  gr.addColorStop(0, 'rgba(18,20,24,0)'); gr.addColorStop(1, 'rgba(40,46,56,.35)');
  g.fillStyle = gr; g.fillRect(0, 0, W, TOP_BACK + 8);
  /* the chamfer along the front edge: one bright line, a dark one under it */
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(0, EDGE - 2, W, 2);
  g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(0, EDGE, W, 3);
}

/* ---------- the lance and its fan nozzle ---------- */
function drawGun(g, p, t) {
  const ang = Math.atan2(HIT.y - TIP.y, HIT.x - TIP.x);
  g.save();
  g.translate(TIP.x, TIP.y);
  g.rotate(ang);
  g.scale(1.35, 1.35);
  /* lance: stainless tube running back out of frame */
  let gr = g.createLinearGradient(0, -15, 0, 15);
  gr.addColorStop(0, '#2b2e32'); gr.addColorStop(0.3, '#c9ced4'); gr.addColorStop(0.45, '#f4f6f8'); gr.addColorStop(0.62, '#7d838a'); gr.addColorStop(1, '#1d1f22');
  g.fillStyle = gr; g.fillRect(-760, -13, 700, 26);
  /* collar and grip */
  gr = g.createLinearGradient(0, -24, 0, 24);
  gr.addColorStop(0, '#0d0e10'); gr.addColorStop(0.35, '#3a3d42'); gr.addColorStop(0.5, '#55595f'); gr.addColorStop(1, '#090a0b');
  g.fillStyle = gr; g.beginPath(); g.roundRect(-640, -24, 150, 48, 8); g.fill();
  for (let k = 0; k < 9; k++) { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-630 + k * 15, -24, 3, 48); }
  g.fillStyle = gr; g.beginPath(); g.roundRect(-130, -18, 34, 36, 4); g.fill();
  /* fan nozzle: flares out to a slot */
  gr = g.createLinearGradient(0, -26, 0, 26);
  gr.addColorStop(0, '#202326'); gr.addColorStop(0.28, '#aab0b7'); gr.addColorStop(0.42, '#eef1f4'); gr.addColorStop(0.7, '#6e747b'); gr.addColorStop(1, '#141618');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(-96, -14); g.lineTo(-4, -26); g.quadraticCurveTo(6, -26, 6, -18); g.lineTo(6, 18); g.quadraticCurveTo(6, 26, -4, 26); g.lineTo(-96, 14); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1; g.stroke();
  g.fillStyle = '#050607'; g.fillRect(2, -19, 5, 38);
  /* rime: the nozzle frosts over as the cold builds */
  const rime = clamp(p * 1.6) * 0.75;
  if (rime > 0.01) {
    const r = rng(5);
    g.globalAlpha = rime;
    gr = g.createLinearGradient(-96, 0, 6, 0);
    gr.addColorStop(0, 'rgba(220,235,255,0)'); gr.addColorStop(1, 'rgba(230,242,255,.55)');
    g.fillStyle = gr; g.fillRect(-96, -26, 102, 52);
    g.fillStyle = 'rgba(245,250,255,.9)';
    for (let k = 0; k < 16; k++) g.fillRect(-90 + r() * 96, -24 + r() * 48, 1.2, 1.2);
    g.globalAlpha = 1;
  }
  /* a breath of vapour at the mouth */
  g.restore();
}

/* ---------- vapour sprite ---------- */
function makeSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(232,240,250,.85)'); gr.addColorStop(0.45, 'rgba(225,235,248,.35)'); gr.addColorStop(1, 'rgba(220,232,246,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return c;
}

export function cold() {
  const sec = $('[data-cold]');
  if (!sec) return;
  const stage = $('.cold__stage', sec);
  const deg = $('[data-cold-deg]', sec);
  const phase = $('[data-cold-phase]', sec);
  const beats = $$('[data-cold-beat]', sec);
  const dots = $$('.cold__dots li', sec);
  const list = $('.cold__beats', sec);

  const cv = document.createElement('canvas');
  cv.className = 'cold__cv';
  stage.prepend(cv);
  sec.classList.add('is-live', 'is-canvas');
  const g = cv.getContext('2d');
  const block = document.createElement('canvas');
  const sprite = makeSprite();
  const crust = makeCrust();
  const frost = makeFrost();
  let scale = 1, dpr = 1;

  const size = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = stage.clientWidth;
    scale = w / W;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(w * H / W * dpr);
    block.width = cv.width; block.height = cv.height;
    const bg = block.getContext('2d');
    bg.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    paintBlock(block);
  };
  size();

  /* ---------- particles ---------- */
  const pellets = [], fog = [], sparks = [], jet = [];
  const R = rng(99);
  const surfaceY = (x, p) => {
    for (const c of crust) if (x >= c.x0 && x <= c.x1 && p < c.tD + 0.02) {
      /* along this chunk's top contour */
      const tp = c.top; let y = EDGE - 6;
      for (let i = 1; i < tp.length; i++) if (x <= tp[i][0]) { const k = (x - tp[i - 1][0]) / (tp[i][0] - tp[i - 1][0] || 1); y = lerp(tp[i - 1][1], tp[i][1], k); break; }
      return y;
    }
    return EDGE - 3;
  };
  /* 08/10 (Fender: the stream read as a water jet): dry ice blasting
     leaves the nozzle as a dense white plume of cold air and CO2 that
     billows and widens on its way, the pellets only small specks inside
     it, and it spreads sideways along the surface where it lands */
  const spawnPellet = p => {
    const tx = HIT.x + (R() + R() + R() - 1.5) * 300;
    pellets.push({ t: 0, d: 0.22 + R() * 0.1, sx: TIP.x + (R() - 0.5) * 8, sy: TIP.y + (R() - 0.5) * 12, tx, ty: surfaceY(tx, p), s: 1.6 + R() * 1.8 });
  };
  const spawnJet = p => {
    /* lands across the strike zone, densest in the middle */
    const tx = HIT.x + (R() + R() - 1) * 330;
    jet.push({ t: 0, d: 0.42 + R() * 0.22, sx: TIP.x + (R() - 0.5) * 10, sy: TIP.y + (R() - 0.5) * 10, tx, ty: surfaceY(tx, p) - 6,
      r0: 5 + R() * 6, r1: 46 + R() * 46, a: 0.16 + R() * 0.12, wob: R() * 6.28, sw: (R() - 0.5) * 2 });
  };
  const puff = (x, y, big, vx) => fog.push({
    x, y, t: 0, life: big ? 2.2 + R() * 1.6 : 1.1 + R() * 0.9,
    r0: big ? 30 + R() * 30 : 18 + R() * 14, r1: big ? 120 + R() * 110 : 70 + R() * 50,
    vx: vx != null ? vx : (R() - 0.5) * (big ? 90 : 60), vy: big ? (R() < 0.6 ? 14 + R() * 26 : -20 - R() * 30) : -6 - R() * 18, a: big ? 0.26 + R() * 0.14 : 0.16 + R() * 0.1
  });

  /* ---------- the frame ---------- */
  let pT = 0, pS = 0, last = 0, acc = 0, accJ = 0, time = 0;
  const draw = (p, dt) => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
    /* studio: deep, a warm key top left, a cold haze low right */
    let gr = g.createRadialGradient(cv.width * 0.2, cv.height * 0.05, 0, cv.width * 0.2, cv.height * 0.05, cv.width * 0.9);
    gr.addColorStop(0, '#1b1a19'); gr.addColorStop(1, '#07080a');
    g.fillStyle = gr; g.fillRect(0, 0, cv.width, cv.height);
    g.drawImage(block, 0, 0);
    g.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

    const f = ease(clamp((p - 0.3) / 0.32));          /* frost */
    const ck = clamp((p - 0.5) / 0.14);                /* cracks */
    const live = p > 0.03 && p < 0.97;
    const shiver = p > 0.05 && p < 0.7 ? 1 : 0;

    const clean = clamp((p - 0.72) / 0.22);
    /* frost on the metal around the strike */
    if (f > 0) {
      const fr = 120 + f * 780;
      gr = g.createRadialGradient(HIT.x, EDGE + 20, 0, HIT.x, EDGE + 20, fr);
      const ff = f * (1 - clean * 0.85);
      gr.addColorStop(0, `rgba(205,226,250,${(0.26 * ff).toFixed(3)})`); gr.addColorStop(0.7, `rgba(190,215,245,${(0.08 * ff).toFixed(3)})`); gr.addColorStop(1, 'rgba(190,215,245,0)');
      g.fillStyle = gr; g.fillRect(0, TOP_BACK - 10, W, H - TOP_BACK);
    }
    /* the film of old grime the chunks sit in, and the smudge where it
       ran over the edge: both go once the surface is clean */
    if (clean < 1) {
      g.globalAlpha = 1 - clean;
      gr = g.createLinearGradient(0, EDGE - 20, 0, EDGE + 2);
      gr.addColorStop(0, '#1d150e'); gr.addColorStop(1, '#0d0a07');
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(290, EDGE);
      for (let x = 290; x <= 1520; x += 20) g.lineTo(x, EDGE - 12 - Math.sin(x * 0.031) * 4 - Math.sin(x * 0.11) * 2);
      g.lineTo(1520, EDGE); g.closePath(); g.fill();
      gr = g.createLinearGradient(0, EDGE, 0, EDGE + 60);
      gr.addColorStop(0, 'rgba(28,20,13,.7)'); gr.addColorStop(1, 'rgba(28,20,13,0)');
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(290, EDGE);
      for (let x = 290; x <= 1520; x += 20) g.lineTo(x, EDGE + 18 + Math.sin(x * 0.019) * 10 + Math.max(0, Math.sin(x * 0.047)) * 16);
      g.lineTo(1520, EDGE); g.closePath(); g.fill();
      g.globalAlpha = 1;
    }

    /* the crust */
    for (let i = 0; i < crust.length; i++) {
      const c = crust[i];
      const d = clamp((p - c.tD) / 0.09);
      if (d >= 1) continue;
      const tau = d;
      const ox = c.vx * tau * 0.6 + (shiver ? Math.sin(time * 47 + i * 1.7) * 0.7 : 0);
      const oy = -c.vy * tau * 0.6 + 420 * tau * tau;
      g.save();
      g.globalAlpha = 1 - Math.pow(tau, 1.4);
      g.translate(c.cx + ox, c.cy + oy); g.rotate(c.vr * tau); g.translate(-c.cx, -c.cy);
      g.beginPath();
      g.moveTo(c.x0 - 6, EDGE - 3);
      contour(g, c.top, 0, false);
      g.lineTo(c.x1 + 6, EDGE - 3);
      g.closePath();
      gr = g.createLinearGradient(0, EDGE - 6 - c.h, 0, EDGE);
      gr.addColorStop(0, `rgba(${Math.round(64 * c.shade)},${Math.round(48 * c.shade)},${Math.round(34 * c.shade)},1)`);
      gr.addColorStop(0.55, `rgba(${Math.round(34 * c.shade)},${Math.round(25 * c.shade)},${Math.round(18 * c.shade)},1)`);
      gr.addColorStop(1, '#0b0806');
      g.fillStyle = gr; g.fill();
      /* oil catching the light along the top */
      g.strokeStyle = 'rgba(255,214,160,.22)'; g.lineWidth = 1.6;
      g.beginPath(); contour(g, c.top.slice(2, -2), 1.5); g.stroke();
      g.fillStyle = 'rgba(0,0,0,.45)';
      c.spots.forEach(([x, y, s]) => { g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill(); });
      /* frost over the crust, strongest where it was hit first */
      const dist = Math.abs(c.cx - HIT.x);
      const fa = clamp((f * 760 - dist) / 200) * 0.7;
      if (fa > 0) {
        gr = g.createLinearGradient(0, EDGE - 6 - c.h, 0, EDGE);
        gr.addColorStop(0, `rgba(236,244,255,${fa.toFixed(3)})`); gr.addColorStop(1, `rgba(200,222,250,${(fa * 0.35).toFixed(3)})`);
        g.fillStyle = gr; g.fill();
        g.strokeStyle = `rgba(255,255,255,${(fa * 0.9).toFixed(3)})`; g.lineWidth = 1.2;
        g.beginPath(); contour(g, c.top.slice(1, -1)); g.stroke();
      }
      /* cracks */
      if (ck > 0 && dist < 520) {
        c.cracks.forEach(pts => {
          const n = Math.max(2, Math.round(pts.length * ck));
          g.strokeStyle = 'rgba(0,0,0,.85)'; g.lineWidth = 2.2;
          g.beginPath(); pts.slice(0, n).forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
          g.strokeStyle = 'rgba(230,240,255,.35)'; g.lineWidth = 0.9;
          g.beginPath(); pts.slice(0, n).forEach(([x, y], k) => (k ? g.lineTo(x + 1.4, y) : g.moveTo(x + 1.4, y))); g.stroke();
        });
      }
      g.restore();
      /* the bits that break away with it */
      if (d > 0) c.bits.forEach(b => {
        const bx = b.x + b.vx * tau * 0.8, by = b.y - b.vy * tau * 0.8 + 520 * tau * tau;
        g.globalAlpha = 1 - tau;
        g.fillStyle = '#2a1f16';
        g.save(); g.translate(bx, by); g.rotate(b.vr * tau); g.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * 0.7); g.restore();
        g.globalAlpha = 1;
      });
    }

    /* crystals on the metal */
    if (f > 0) {
      g.lineWidth = 1.1;
      frost.forEach(cr => {
        const a = clamp((f * 900 - cr.d) / 160) * (1 - clean);
        if (a <= 0) return;
        g.fillStyle = `rgba(255,255,255,${(a * 0.8).toFixed(3)})`;
        cr.dots.forEach(([x, y]) => g.fillRect(x, y, 1.8, 1.8));
        g.strokeStyle = `rgba(238,246,255,${(a * 0.4).toFixed(3)})`;
        g.beginPath();
        cr.segs.forEach(([x0, y0, x1, y1]) => { g.moveTo(x0, y0); g.lineTo(lerp(x0, x1, a), lerp(y0, y1, a)); });
        g.stroke();
      });
    }

    /* the light along the clean edge, at the very end */
    const sh = clamp((p - 0.88) / 0.12);
    if (sh > 0 && sh < 1) {
      const sx = lerp(250, 1550, ease(sh));
      gr = g.createRadialGradient(sx, EDGE - 1, 0, sx, EDGE - 1, 220);
      gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(0.25, 'rgba(255,250,236,.35)'); gr.addColorStop(1, 'rgba(255,250,236,0)');
      g.fillStyle = gr; g.fillRect(sx - 230, TOP_BACK, 460, 90);
    }

    /* the blast: a plume of cold vapour that widens and billows */
    const flow = live ? clamp(p < 0.08 ? (p - 0.03) / 0.05 : p > 0.86 ? (0.97 - p) / 0.11 : 1) : 0;
    if (dt > 0 && flow > 0) {
      accJ += flow * 170 * dt;
      while (accJ > 1) { spawnJet(p); accJ -= 1; }
      acc += flow * 70 * dt;
      while (acc > 1) { spawnPellet(p); acc -= 1; }
    }
    /* a soft glow along the axis, so the plume reads as one body of air */
    if (flow > 0) {
      g.save();
      g.globalAlpha = 0.55 * flow;
      gr = g.createLinearGradient(TIP.x, TIP.y, HIT.x, HIT.y);
      gr.addColorStop(0, 'rgba(236,243,252,.34)'); gr.addColorStop(0.5, 'rgba(226,236,248,.14)'); gr.addColorStop(1, 'rgba(226,236,248,.05)');
      g.fillStyle = gr;
      [1, 0.7, 0.42].forEach(w => {
        g.beginPath(); g.moveTo(TIP.x + 8 * w, TIP.y - 16 * w); g.lineTo(HIT.x + 300 * w, EDGE - 46); g.lineTo(HIT.x - 260 * w, EDGE - 34); g.lineTo(TIP.x - 10 * w, TIP.y + 16 * w); g.closePath(); g.fill();
      });
      g.restore();
    }
    for (let i = jet.length - 1; i >= 0; i--) {
      const q = jet[i];
      q.t += dt;
      const k = q.t / q.d;
      if (k >= 1) {
        jet.splice(i, 1);
        /* it lands and rolls out sideways along the surface */
        if (R() < 0.42) puff(q.tx, q.ty, false, Math.sign(q.tx - HIT.x || 1) * (70 + R() * 150));
        continue;
      }
      /* fast out of the slot, slowing as it spreads; a little turbulence */
      const e = 1 - Math.pow(1 - k, 1.7);
      const turb = Math.sin(time * 9 + q.wob) * 14 * k + q.sw * 30 * k;
      const ang = Math.atan2(q.ty - q.sy, q.tx - q.sx);
      const x = lerp(q.sx, q.tx, e) - Math.sin(ang) * turb, y = lerp(q.sy, q.ty, e) + Math.cos(ang) * turb;
      const r = lerp(q.r0, q.r1, Math.pow(k, 0.8));
      g.globalAlpha = q.a * (k < 0.12 ? k / 0.12 : 1) * (1 - Math.pow(k, 3) * 0.6);
      g.drawImage(sprite, x - r, y - r * 0.8, r * 2, r * 1.6);
    }
    g.globalAlpha = 1;
    /* the pellets: small hard specks carried in it */
    for (let i = pellets.length - 1; i >= 0; i--) {
      const q = pellets[i];
      q.t += dt;
      const k = q.t / q.d;
      if (k >= 1) {
        pellets.splice(i, 1);
        if (R() < 0.35) sparks.push({ x: q.tx, y: q.ty, t: 0, a: R() * Math.PI - Math.PI, l: 5 + R() * 9 });
        if (R() < (p > 0.62 ? 0.4 : 0.1)) puff(q.tx, q.ty - 4, false);
        continue;
      }
      const x = lerp(q.sx, q.tx, k), y = lerp(q.sy, q.ty, k);
      const dx = (q.tx - q.sx) * 0.035, dy = (q.ty - q.sy) * 0.035;
      g.strokeStyle = 'rgba(245,250,255,.55)'; g.lineWidth = q.s;
      g.beginPath(); g.moveTo(x - dx, y - dy); g.lineTo(x, y); g.stroke();
    }
    /* strike sparks */
    g.lineWidth = 1.2;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.t += dt;
      if (s.t > 0.22) { sparks.splice(i, 1); continue; }
      const k = s.t / 0.22;
      g.strokeStyle = `rgba(240,248,255,${(1 - k).toFixed(3)})`;
      g.beginPath(); g.moveTo(s.x + Math.cos(s.a) * s.l * k * 0.4, s.y + Math.sin(s.a) * s.l * k * 0.4); g.lineTo(s.x + Math.cos(s.a) * s.l * k, s.y + Math.sin(s.a) * s.l * k); g.stroke();
    }

    /* vapour: CO2 sinks, rolls along the surface and spills over the edge */
    const subl = clamp((p - 0.6) / 0.08) * (1 - clamp((p - 0.95) / 0.05));
    if (dt > 0 && subl > 0) { acc2 += subl * 26 * dt; while (acc2 > 1) { puff(HIT.x + (R() - 0.5) * 900, EDGE - 20 - R() * 50, true); acc2 -= 1; } }
    for (let i = fog.length - 1; i >= 0; i--) {
      const m = fog[i];
      m.t += dt;
      const k = m.t / m.life;
      if (k >= 1) { fog.splice(i, 1); continue; }
      if (m.vy > 0 && m.y > EDGE - 6) { m.vy += 30 * dt; m.vx *= 0.995; }
      m.x += m.vx * dt; m.y += m.vy * dt;
      const r = lerp(m.r0, m.r1, Math.sqrt(k));
      g.globalAlpha = m.a * Math.sin(Math.PI * Math.min(1, k * 1.15)) * (k < 0.15 ? k / 0.15 : 1);
      g.drawImage(sprite, m.x - r, m.y - r * 0.62, r * 2, r * 1.24);
    }
    g.globalAlpha = 1;

    drawGun(g, p, time);

    /* labels: the two words the old drawing carried */
    g.font = '500 17px Jost, Helvetica, Arial, sans-serif';
    if ('letterSpacing' in g) g.letterSpacing = '4px';
    g.textAlign = 'right';
    g.fillStyle = `rgba(255,255,255,${(0.5 * (1 - clean)).toFixed(3)})`;
    g.fillText('CONTAMINATION', 1560, 420);
    g.fillStyle = 'rgba(255,255,255,.45)';
    g.fillText('SURFACE', 1560, 740);
    g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1;
    if (clean < 1) { g.beginPath(); g.moveTo(1390, 413); g.lineTo(1320, 413); g.lineTo(1320, 560); g.stroke(); }
    g.beginPath(); g.moveTo(1455, 733); g.lineTo(1380, 733); g.lineTo(1380, 610); g.stroke();

    /* vignette */
    g.setTransform(1, 0, 0, 1, 0, 0);
    gr = g.createRadialGradient(cv.width / 2, cv.height / 2, cv.width * 0.3, cv.width / 2, cv.height / 2, cv.width * 0.75);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.55)');
    g.fillStyle = gr; g.fillRect(0, 0, cv.width, cv.height);
  };
  let acc2 = 0;

  /* ---------- the readout and the beats ---------- */
  const fmt = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(1);
  let beat = -1;
  const setBeat = b => {
    if (b === beat) return;
    if (beat !== -1) sfx('beat');
    beat = b;
    beats.forEach((el, i) => el.classList.toggle('is-on', i === b));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === b));
    if (phase) phase.textContent = PHASES[b];
  };
  const read = p => {
    const t = Math.min(1, p / 0.5);
    if (deg) deg.textContent = fmt(20 - 98.5 * (1 - Math.pow(1 - t, 2)));
    setBeat(Math.min(2, Math.floor(p * 3)));
  };

  /* reduced motion: one still frame, mid-story, every beat lit */
  if (!env.motion) {
    sec.classList.add('is-still');
    for (let k = 0; k < 30; k++) spawnPellet(0.5);
    pellets.forEach((q, i) => { q.t = q.d * ((i * 0.37) % 1); });
    for (let k = 0; k < 90; k++) spawnJet(0.5);
    jet.forEach((q, i) => { q.t = q.d * ((i * 0.618) % 1); });
    for (let k = 0; k < 14; k++) puff(HIT.x + (R() - 0.5) * 600, EDGE - 10, false, (R() - 0.5) * 200);
    fog.forEach(m => { m.t = m.life * (0.2 + R() * 0.5); });
    draw(0.52, 0);
    if (deg) deg.textContent = fmt(-78.5);
    window.addEventListener('resize', () => { size(); draw(0.52, 0); });
    return;
  }

  /* the scroll sets the story: the beats passing the stage */
  const target = { p: 0 };
  gsap.to(target, {
    p: 1, ease: 'none',
    scrollTrigger: {
      trigger: list,
      start: () => (window.matchMedia('(max-width: 767px)').matches ? 'top 70%' : 'top 62%'),
      end: () => (window.matchMedia('(max-width: 767px)').matches ? 'bottom 70%' : 'bottom 62%'),
      scrub: true, invalidateOnRefresh: true
    }
  });

  let on = false, raf = 0;
  const loop = now => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now; time += dt;
    pS += (target.p - pS) * Math.min(1, dt * 7);
    draw(pS, dt);
    read(pS);
    raf = on ? requestAnimationFrame(loop) : 0;
  };
  const io = new IntersectionObserver(([e]) => {
    on = e.isIntersecting && !document.hidden;
    if (on && !raf) { last = 0; raf = requestAnimationFrame(loop); }
  }, { rootMargin: '80px 0px' });
  io.observe(stage);
  document.addEventListener('visibilitychange', () => {
    on = !document.hidden && stage.getBoundingClientRect().bottom > 0 && stage.getBoundingClientRect().top < window.innerHeight;
    if (on && !raf) { last = 0; raf = requestAnimationFrame(loop); }
  });
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
  read(0);
  draw(0, 0);
}
