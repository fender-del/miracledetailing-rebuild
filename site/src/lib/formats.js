/* ============================================================
   formats.js — data for blocks 45–50 (07/10, the window tint
   rebuild: Fender asked for new block shapes so the library has
   more than "heading left, text right" and "a row of cards", and so
   other pages can borrow them).

     45 show      a photo held large, an effect painted on part of it,
                  numbered points that each light a part
     46 gauge     a slider that sets a value, read against a photo and
                  a set of limits (pass / fail per zone)
     47 lens      a wide photo with a hidden layer seen through a lens
                  that follows the pointer (drifts by itself on touch)
     48 layers    an exploded drawing of what a part is made of; the
                  item in the middle of the screen sets its state
     49 index     an editorial list: large rows that open one at a time
                  onto a paragraph and a photo
     50 note      a closing note on a dark photo, centred, the first
                  paragraph lit word by word, a call button

   Same rule as lib/shared.js: every key a template could ask for is
   set (null when empty), because render.js looks a missing key up in
   the outer context.

   Regions on photos: `poly` = "x,y x,y …" in % of the image as it is
   cropped (tools/images-pages.js). It becomes both an SVG outline
   (viewBox 0 0 100 100) and a CSS clip-path for the fills.
   ============================================================ */
'use strict';

const has = a => Array.isArray(a) ? a.length > 0 : !!a;
const fill = (o, keys) => { const c = Object.assign({}, o); keys.forEach(k => { if (c[k] === undefined) c[k] = null; }); return c; };
const paras = p => (p == null ? [] : Array.isArray(p) ? p : [p]);

/* "x,y x,y" -> { points, clip, cx, cy } */
function region(poly) {
  const pts = poly.trim().split(/\s+/).map(p => p.split(',').map(Number));
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return {
    points: pts.map(p => p.join(',')).join(' '),
    clip: 'polygon(' + pts.map(p => `${p[0]}% ${p[1]}%`).join(',') + ')',
    cx: +cx.toFixed(2), cy: +cy.toFixed(2)
  };
}

/* Re-measure a polygon taken on the whole source for a crop of it:
   crop = { l, t, w, h } as fractions (as in images-pages.js). */
function inCrop(poly, crop) {
  return poly.trim().split(/\s+/).map(p => {
    const [x, y] = p.split(',').map(Number);
    return `${(((x / 100) - crop.l) / crop.w * 100).toFixed(2)},${(((y / 100) - crop.t) / crop.h * 100).toFixed(2)}`;
  }).join(' ');
}

/* ---------- 45 · show ----------
   { id, eyebrow, title, intro, img, light, graphite,
     regions: [{ id, poly, fx: 'shift'|'hatch'|null }],
     points:  [{ n, name, paras, region, look }] }
   look = what the photo does while the point is active: the block's
   CSS reads [data-look] (shift · clear · outline · pair, more can be
   added per page). */
function show(o) {
  const c = fill(o, ['eyebrow', 'title', 'light', 'graphite', 'cap']);
  c.intro = paras(o.intro); c.hasIntro = has(c.intro);
  c.regions = (o.regions || []).map(r => Object.assign({ fx: null }, r, region(r.poly)));
  c.points = (o.points || []).map(p => Object.assign({ n: null, region: null, look: null }, p, { paras: paras(p.paras) }));
  c.cols = c.points.length;
  c.first = (c.points[0] && c.points[0].look) || '';
  c.firstRegion = (c.points[0] && c.points[0].region) || '';
  return c;
}

/* ---------- 46 · gauge ----------
   { id, eyebrow, title, paras, img, listTitle, list, price,
     range: { label, min, max, step, value, unit, darker },
     zones: [{ id, name, poly, min, minLabel }],
     pass, fail }
   Without JS the page shows the default value, worked out here. */
function gauge(o) {
  const c = fill(o, ['eyebrow', 'title', 'listTitle', 'price', 'light', 'graphite']);
  c.paras = paras(o.paras);
  c.list = o.list || []; c.hasList = has(c.list);
  c.range = Object.assign({ label: 'Value', min: 0, max: 100, step: 1, value: 50, unit: '%' }, o.range);
  const v = c.range.value;
  c.pass = o.pass || 'Pass'; c.fail = o.fail || 'Fail';
  c.zones = (o.zones || []).map(z => {
    const ok = v >= (z.min || 0);
    return Object.assign({ minLabel: z.min ? `${z.min}% min` : null }, z, region(z.poly), {
      ok, status: ok ? c.pass : c.fail
    });
  });
  c.dark = (1 - v / 100).toFixed(3);
  /* the limits marked on the scale, highest first */
  c.marks = [...new Set(c.zones.map(z => z.min).filter(Boolean))].sort((a, b) => b - a)
    .map(m => ({ m, at: (((c.range.max - m) / (c.range.max - c.range.min)) * 100).toFixed(2) }));
  c.data = JSON.stringify(c.zones.map(z => ({ id: z.id, min: z.min || 0 })));
  return c;
}

/* ---------- 47 · lens ----------
   { id, eyebrow, title, lead, paras, img, img2, regions: [{ id, poly }],
     rest: [x, y] (where the lens waits, % of the photo), hint,
     ar (the photo's width / height), focus,
     tag (a label that rides under the lens) } */
function lens(o) {
  const c = fill(o, ['eyebrow', 'title', 'lead', 'hint', 'tag', 'light', 'graphite']);
  c.paras = paras(o.paras);
  /* layers: the glass outline stepped inwards, like the plies of a
     laminate, so the lens finds them wherever it looks */
  const plies = o.plies || 9;
  c.regions = (o.regions || []).map(r => Object.assign({}, r, region(r.poly), {
    layers: Array.from({ length: plies }, (_, i) => ({ k: (1 - (i + 1) * 0.085).toFixed(3), o: (0.75 - i * 0.06).toFixed(2) }))
  }));
  const rest = o.rest || [50, 50];
  c.restX = rest[0]; c.restY = rest[1];
  /* phones crop the wide photo round `focus` (x %); the layers move as
     one stage so the regions stay on the glass */
  c.ar = o.ar || 2.333; c.focus = o.focus == null ? 50 : o.focus;
  return c;
}

/* ---------- 48 · layers ----------
   { id, eyebrow, title, label (the drawing, for screen readers),
     glass, film (the two labels on the drawing), plies (count),
     items: [{ n, name, sub, paras }] }   item k sets state k */
function layers(o) {
  const c = fill(o, ['eyebrow', 'title', 'light', 'graphite', 'label', 'glass', 'film']);
  const n = o.plies || 4;
  /* drawn back to front; the back ply carries the film label */
  c.plies = Array.from({ length: n }, (_, k) => ({ i: n - k, lab: k === 0 }));
  c.items = (o.items || []).map(i => Object.assign({ n: null, sub: null }, i, { paras: paras(i.paras) }));
  return c;
}

/* ---------- 49 · index ----------
   { id, eyebrow, title, intro, items: [{ n, name, sub, paras, img }] } */
function index(o) {
  const c = fill(o, ['eyebrow', 'title', 'light', 'graphite']);
  c.intro = paras(o.intro); c.hasIntro = has(c.intro);
  c.items = (o.items || []).map((i, k) => Object.assign({ n: null, sub: null, img: null }, i, {
    paras: paras(i.paras), open: k === 0, pid: `${o.id}-p${k + 1}`, bid: `${o.id}-b${k + 1}`
  }));
  return c;
}

/* ---------- 50 · note ----------
   { id, eyebrow, title, lead, paras, img, cta: { href, label } } */
function note(o) {
  const c = fill(o, ['eyebrow', 'title', 'lead', 'img', 'cta']);
  c.paras = paras(o.paras);
  return c;
}

module.exports = { region, inCrop, show, gauge, lens, layers, index, note };
