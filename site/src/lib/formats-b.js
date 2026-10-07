/* ============================================================
   formats-b.js — data for blocks 51–52 (07/10, the ceramic page:
   Fender asked for "Why Feynlab" and the wheel coating to read and
   behave better than a row of points and two look-alike cards).

     51 bench    a painted panel split down the middle, unprotected
                 and coated; each point plays its own test on it
     52 choose   versions of one service that differ in one measure:
                 a button per version, a scale, the picked one's list

   Same rule as lib/shared.js: every key a template could ask for is
   set (null when empty), because render.js looks a missing key up in
   the outer context.
   ============================================================ */
'use strict';

const has = a => Array.isArray(a) ? a.length > 0 : !!a;
const fill = (o, keys) => { const c = Object.assign({}, o); keys.forEach(k => { if (c[k] === undefined) c[k] = null; }); return c; };
const paras = p => (p == null ? [] : Array.isArray(p) ? p : [p]);

/* ---------- 51 · bench ----------
   { id, eyebrow, title, left, right, light, graphite,
     items: [{ n, name, paras, demo: heal|chem|uv|gloss, cap }] } */
function bench(o) {
  const c = fill(o, ['eyebrow', 'title', 'light', 'graphite']);
  c.left = o.left || 'Unprotected';
  c.right = o.right || 'Coated';
  c.items = (o.items || []).map(it => Object.assign({ n: null, cap: null, demo: null }, it, { paras: paras(it.paras) }));
  c.firstN = (c.items[0] && c.items[0].n) || '';
  c.firstCap = (c.items[0] && c.items[0].cap) || '';
  return c;
}

/* ---------- 52 · choose ----------
   { id, eyebrow, title, intro, img, label, light, graphite,
     scale: { label, unit, max },
     options: [{ kicker, name, price, list, from, to }] }
   from / to = where the version sits on the scale (to > from: a span,
   "3–5 years"). A list line is bright when another version does not
   carry the same words in the same place. */
function choose(o) {
  const c = fill(o, ['eyebrow', 'title', 'img', 'light', 'graphite']);
  c.intro = paras(o.intro); c.hasIntro = has(c.intro);
  c.label = o.label || 'Choose a version';
  const s = o.scale || {};
  const max = s.max || 5;
  c.scaleLabel = s.label || '';
  c.scaleUnit = s.unit || '';
  c.ticks = Array.from({ length: max + 1 }, (_, i) => String(i));
  const opts = o.options || [];
  c.options = opts.map(op => {
    const pct = v => (v / max * 100).toFixed(2) + '%';
    const from = op.from == null ? op.to : op.from;
    return {
      kicker: op.kicker || null, name: op.name, price: op.price || null,
      a: pct(from), b: pct(op.to),
      rows: (op.list || []).map((text, i) => ({ text, diff: opts.some(q => q !== op && (q.list || [])[i] !== text) }))
    };
  });
  c.count = c.options.length;
  return c;
}

module.exports = { bench, choose };
