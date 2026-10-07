/* ============================================================
   ppf-car.js — the PPF page's coverage drawing, built at build time.

   Two views of one mid-engined car, as a technical drawing:
     side()  side elevation, traced from a side-on photo of a
             McLaren MP4-12C (tools/ppf-side-trace.py -> ppf-side.json)
     plan()  top view, drawn to the same length and wheel positions;
             the upper half is drawn, the lower half is its mirror
   Every panel the film can cover is a zone: <path class="z"
   data-z="bonnet">. Zones are clipped to the body, so a zone only has
   to be right along the panel lines it shares with its neighbours.
   The page's motion (motion/ppf.js) lights the zones of a package,
   sweeps a sheen across them and draws the callouts.

   `on` = the zones lit in the HTML (the first package), so the drawing
   says the right thing before (and without) any script.
   ============================================================ */
'use strict';
const S = require('./ppf-side.json');

const M = 250; /* the plan's centre line */
const n = v => +(+v).toFixed(1);

/* ---------- plan view helpers ---------- */
const half = (start, segs) => ({ start, segs });
function dOpen(h) {
  let d = `M${h.start[0]} ${h.start[1]}`;
  for (const s of h.segs) d += s[0] === 'C' ? ` C${s.slice(1).join(' ')}` : ` L${s[1]} ${s[2]}`;
  return d;
}
/* upper half forward, its mirror back: one closed symmetric shape */
function dSym(h) {
  let d = dOpen(h);
  const pts = [h.start, ...h.segs.map(s => (s[0] === 'C' ? [s[5], s[6]] : [s[1], s[2]]))];
  for (let i = h.segs.length - 1; i >= 0; i--) {
    const s = h.segs[i], p = pts[i];
    d += s[0] === 'C'
      ? ` C${s[3]} ${n(2 * M - s[4])} ${s[1]} ${n(2 * M - s[2])} ${p[0]} ${n(2 * M - p[1])}`
      : ` L${p[0]} ${n(2 * M - p[1])}`;
  }
  return d + ' Z';
}
/* a path and its mirror (pairs: wings, doors, mirrors...) */
const both = d => [d, d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${x} ${n(2 * M - +y)}`)];

const P = {
  outline: half([100, 250], [
    ['C', 100, 204, 104, 168, 116, 138], ['C', 130, 104, 165, 78, 215, 60], ['C', 255, 48, 295, 44, 330, 44],
    ['C', 390, 44, 450, 56, 520, 60], ['C', 620, 64, 720, 62, 820, 50], ['C', 870, 42, 910, 38, 950, 38],
    ['C', 1010, 38, 1062, 50, 1086, 72], ['C', 1098, 90, 1100, 140, 1100, 250]]),
  bonnet: half([170, 250], [['C', 170, 200, 168, 150, 182, 116], ['C', 240, 104, 300, 100, 360, 106], ['C', 380, 110, 394, 116, 406, 124], ['C', 392, 150, 388, 200, 388, 250]]),
  bumperF: half([40, 250], [['L', 40, 0], ['L', 224, 0], ['L', 224, 56], ['C', 206, 74, 192, 96, 182, 116], ['C', 168, 150, 170, 200, 170, 250]]),
  screen: half([388, 250], [['C', 388, 200, 394, 150, 410, 122], ['C', 450, 114, 490, 110, 526, 108], ['C', 520, 160, 518, 200, 518, 250]]),
  roof: half([518, 250], [['C', 518, 200, 520, 160, 526, 108], ['C', 600, 106, 700, 110, 764, 118], ['C', 770, 160, 772, 200, 772, 250]]),
  roofEdge: half([518, 250], [['C', 518, 200, 520, 160, 526, 108], ['L', 558, 108], ['C', 552, 160, 550, 200, 550, 250]]),
  cover: half([772, 250], [['C', 772, 200, 770, 160, 764, 120], ['C', 840, 128, 920, 150, 990, 186], ['C', 1000, 210, 1002, 230, 1002, 250]]),
  boot: half([772, 250], [['L', 768, 122], ['C', 860, 116, 970, 116, 1040, 132], ['C', 1050, 170, 1054, 210, 1054, 250]]),
  bumperR: half([1054, 250], [['C', 1054, 210, 1050, 170, 1040, 132], ['L', 1040, 0], ['L', 1160, 0], ['L', 1160, 250]])
};
const PAIRS = {
  wingF: 'M182 116 C240 104 300 100 360 106 C380 110 394 116 406 124 L410 122 L432 52 L432 0 L224 0 L224 56 C206 74 192 96 182 116 Z',
  door: 'M410 122 L432 52 L432 0 L700 0 L700 62 L690 118 C640 112 580 108 526 108 C490 110 450 114 410 122 Z',
  rearQ: 'M700 0 L1040 0 L1040 132 C970 116 860 116 768 122 L690 118 L700 62 Z',
  apillar: 'M402 114 C450 102 492 98 532 98 L528 116 C490 116 452 120 414 130 Z',
  headlight: 'M120 132 C138 100 170 78 214 64 C218 70 214 76 206 79 C172 92 146 112 130 140 Z',
  taillight: 'M1080 66 C1092 80 1098 100 1100 124 L1093 124 C1091 104 1085 88 1074 74 Z'
};
const MIRROR = 'M434 54 L442 46 C446 34 458 26 472 26 C484 26 488 34 484 42 C478 52 462 56 442 58 Z';

/* where a callout points to, per view (drawing units) */
const PLAN_AT = {
  bumperF: [138, 250], bonnet: [282, 250], wingF: [300, 76], door: [560, 74], rearQ: [900, 74], apillar: [468, 108],
  roofEdge: [536, 250], roof: [650, 250], boot: [920, 250], bumperR: [1076, 250], headlight: [168, 92],
  taillight: [1088, 100], mirror: [470, 34]
};

const LN = (d, c, delay) => `<path class="ln ${c}" pathLength="1" style="--d:${delay}" d="${d}"/>`;
const Z = (z, d, on, extra = '') => `<path class="z${on.includes(z) ? ' a' : ''}${extra}" data-z="${z}" d="${d}"/>`;

/* the defs both views share (they live in the side view) */
const DEFS = `
<linearGradient id="pc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1f21"/><stop offset=".55" stop-color="#141415"/><stop offset="1" stop-color="#0b0b0c"/></linearGradient>
<linearGradient id="pc-bodyP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0d0e"/><stop offset=".5" stop-color="#1d1d1f"/><stop offset="1" stop-color="#0d0d0e"/></linearGradient>
<linearGradient id="pc-film" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6CC85" stop-opacity=".30"/><stop offset="1" stop-color="#C9A84D" stop-opacity=".09"/></linearGradient>
<linearGradient id="pc-filmHi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3DFA4" stop-opacity=".7"/><stop offset="1" stop-color="#C9A84D" stop-opacity=".32"/></linearGradient>
<linearGradient id="pc-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2a2d"/><stop offset=".45" stop-color="#0c0c0d"/><stop offset=".62" stop-color="#1a1a1c"/><stop offset="1" stop-color="#070708"/></linearGradient>
<radialGradient id="pc-rim" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1c1c1e"/><stop offset=".8" stop-color="#101011"/><stop offset="1" stop-color="#161617"/></radialGradient>
<radialGradient id="pc-shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="pc-floor" x1="0" x2="1"><stop offset="0" stop-color="#C9A84D" stop-opacity="0"/><stop offset=".5" stop-color="#C9A84D" stop-opacity=".5"/><stop offset="1" stop-color="#C9A84D" stop-opacity="0"/></linearGradient>
<pattern id="pc-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 V7" stroke="#E6CC85" stroke-opacity=".32" stroke-width="1"/></pattern>
<linearGradient id="pc-sheen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="260" y2="0" gradientTransform="translate(-500 0) skewX(-18)"><stop offset="0" stop-color="#FFF4D6" stop-opacity="0"/><stop offset=".5" stop-color="#FFF4D6" stop-opacity=".75"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/></linearGradient>`;

const CALLOUT = `<g class="co" aria-hidden="true"><path class="co__l" pathLength="1"/><circle class="co__ring" r="9"/><circle class="co__dot" r="3.2"/><text class="co__t"></text></g>`;

/* twin five-spoke wheel at (cx, cy) */
function wheel([cx, cy], rt, rr) {
  const pt = (a, r) => `${n(Math.cos(a * Math.PI / 180) * r)} ${n(Math.sin(a * Math.PI / 180) * r)}`;
  const r = rr - 3;
  let spokes = '';
  for (let i = 0; i < 5; i++) {
    const a = i * 72 - 90;
    spokes += `<path class="sp-f" d="M${pt(a - 6, 13)} L${pt(a - 7.5, r)} A${r} ${r} 0 0 1 ${pt(a + 7.5, r)} L${pt(a + 6, 13)} Z"/>`
      + `<path class="sp" d="M${pt(a - 6, 13)} L${pt(a - 7.5, r)} M${pt(a + 6, 13)} L${pt(a + 7.5, r)}"/>`;
  }
  const rd = n(rr * 0.68);
  return `<g class="wh" transform="translate(${cx} ${cy})"><circle class="wh__tyre" r="${rt}"/><circle class="wh__rim" r="${rr}"/>${spokes}`
    + `<circle class="wh__disc" r="${rd}"/><path class="wh__cal" d="M${pt(-140, rd)} A${rd} ${rd} 0 0 1 ${pt(-70, rd)}"/>`
    + `<circle class="wh__hub" r="9"/><circle class="wh__lip" r="${rr}"/></g>`;
}

function side(on) {
  const z = S.z;
  let d = 0;
  const L = (path, c) => LN(path, c, (d += 30));
  return `<svg class="pc__svg pc__svg--side" viewBox="60 28 1080 362" role="img" aria-labelledby="pc-side-t" data-view="side">
<title id="pc-side-t">Side view of a mid-engined car showing where the film goes</title>
<defs>${DEFS}
<path id="pc-sbody" d="${S.body}"/>
<clipPath id="pc-sclip"><use href="#pc-sbody"/></clipPath>
<mask id="pc-smask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="420"></mask>
</defs>
<ellipse cx="600" cy="372" rx="540" ry="16" fill="url(#pc-shadow)"/>
<path d="M70 370 H1130" stroke="url(#pc-floor)" stroke-width="1" vector-effect="non-scaling-stroke"/>
<use href="#pc-sbody" fill="url(#pc-body)"/>
<g class="zones" clip-path="url(#pc-sclip)">
${['bumperF', 'wingF', 'door', 'rearQ', 'bumperR', 'sill', 'roof', 'roofEdge', 'apillar', 'boot', 'headlight', 'fog', 'taillight'].map(k => Z(k, z[k], on)).join('\n')}
</g>
<rect class="pc__hatch" width="1200" height="420" fill="url(#pc-hatch)" mask="url(#pc-smask)"/>
<rect class="pc__sheen" width="1200" height="420" fill="url(#pc-sheen)" mask="url(#pc-smask)"/>
<path clip-path="url(#pc-sclip)" d="${S.shoulder}" fill="none" stroke="#fff" stroke-opacity=".05" stroke-width="16" stroke-linecap="round"/>
<path class="glass" d="${S.dlo}"/>
<path d="${S.bpillar}" fill="#141415"/>
<path class="glass" d="${S.intake}" fill-opacity=".92"/>
<g class="drawn">
<use class="ln o" href="#pc-sbody" pathLength="1" style="--d:0"/>
${L(S.dlo, 'p')}${L(S.bpillar, 'd')}${L(S.doorF, 'p')}${L(S.doorR, 'p')}${L(S.bumperF, 'p')}${L(S.bumperR, 'p')}
${L(S.sill, 'p')}${L(S.intake, 'p')}${L(S.lip, 'd')}${L(S.head, 'p')}${L(S.headIn, 'd')}${L(S.markF, 'd')}
${L(S.fog, 'p')}${L(S.split, 'd')}${L(S.tail, 'p')}${L(S.markR, 'd')}${L(S.diff, 'd')}${L(S.spoiler, 'd')}${L(S.vents, 'd')}
</g>
${Z('mirror', S.mirror, on, ' zm')}
<g class="drawn">${LN(S.mirror, 'p', 600)}${LN(S.mirrorStalk, 'p', 620)}</g>
${wheel(S.FW, S.r_tyre, S.r_rim)}${wheel(S.RW, S.r_tyre, S.r_rim)}
${CALLOUT}
</svg>`;
}

function plan(on) {
  const bodyD = dSym(P.outline);
  let d = 0;
  const L = (path, c) => LN(path, c, (d += 25));
  const zs = [];
  zs.push(Z('bumperF', dSym(P.bumperF), on), Z('bonnet', dSym(P.bonnet), on));
  for (const [k, v] of Object.entries(PAIRS)) both(v).forEach(dd => zs.push(Z(k, dd, on)));
  zs.push(Z('boot', dSym(P.boot), on), Z('bumperR', dSym(P.bumperR), on), Z('roof', dSym(P.roof), on), Z('roofEdge', dSym(P.roofEdge), on));

  let lines = L(bodyD, 'o') + L(dSym(P.bonnet), 'p') + L(dSym(P.screen), 'p') + L(dSym(P.roof), 'p') + L(dSym(P.cover), 'd');
  ['M224 56 C206 74 192 96 182 116', 'M432 52 L410 122', 'M700 62 L690 118', 'M768 122 C860 116 970 116 1040 132', PAIRS.headlight]
    .forEach(p => both(p).forEach(dd => { lines += L(dd, 'p'); }));
  both('M196 150 C250 138 310 134 372 140').forEach(dd => { lines += L(dd, 'd'); });
  both(PAIRS.taillight).forEach(dd => { lines += L(dd, 'd'); });
  lines += L('M1040 132 C1050 170 1054 210 1054 250 C1054 290 1050 330 1040 368', 'p');
  both('M1040 132 L1068 92').forEach(dd => { lines += L(dd, 'd'); });
  for (let x = 790; x <= 980; x += 17) { const e = 120 + (x - 764) * 0.29 + 10; lines += L(`M${x} ${n(e)} L${x} ${n(500 - e)}`, 'd'); }
  lines += L('M106 196 C103 226 103 274 106 304', 'd');
  both('M258 44 H390 Q398 44 398 52 V90 Q398 98 390 98 H258 Q250 98 250 90 V52 Q250 44 258 44 Z').forEach(dd => { lines += L(dd, 'h'); });
  both('M876 40 H1016 Q1024 40 1024 48 V100 Q1024 108 1016 108 H876 Q868 108 868 100 V48 Q868 40 876 40 Z').forEach(dd => { lines += L(dd, 'h'); });
  lines += L('M78 250 H1122', 'c');

  return `<svg class="pc__svg pc__svg--plan" viewBox="60 -36 1080 572" role="img" aria-labelledby="pc-plan-t" data-view="plan">
<title id="pc-plan-t">Top view of the same car showing where the film goes</title>
<defs><clipPath id="pc-pclip"><path d="${bodyD}"/></clipPath>
<mask id="pc-pmask" maskUnits="userSpaceOnUse" x="0" y="-40" width="1200" height="580"></mask></defs>
<path d="${bodyD}" fill="url(#pc-bodyP)"/>
<g class="zones" clip-path="url(#pc-pclip)">
${zs.join('\n')}
</g>
<rect class="pc__hatch" y="-40" width="1200" height="580" fill="url(#pc-hatch)" mask="url(#pc-pmask)"/>
<rect class="pc__sheen" y="-40" width="1200" height="580" fill="url(#pc-sheen)" mask="url(#pc-pmask)"/>
<path class="glass" d="${dSym(P.screen)}"/>
<path d="M404 170 C400 210 400 290 404 330" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="6" stroke-linecap="round"/>
<g class="drawn">${lines}</g>
${both(MIRROR).map(dd => Z('mirror', dd, on, ' zm')).join('')}
<g class="drawn">${both(MIRROR).map(dd => LN(dd, 'p', 500)).join('')}</g>
${CALLOUT}
</svg>`;
}

/* callout anchors, for the motion: { side: {zone: [x,y]}, plan: {...} } */
const anchors = { side: S.anchors, plan: PLAN_AT };

module.exports = { side, plan, anchors };
