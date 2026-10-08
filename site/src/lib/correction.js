/* ============================================================
   correction.js — data for blocks 55–56 (08/10, the paint
   correction rebuild: Fender asked for a QC of the page and a rebuild
   from everything learned on the earlier pages).

     55 tools   three instruments side by side, each with its own
                picture (a photo, or the paint under the microscope,
                drawn in code)
     56 scope   the five levels on one panel of paint seen under a
                light: pick a level and the defects it removes fade;
                the level's own words beside it (phones: a row of
                cards to swipe under the panel)

   Same rule as lib/shared.js: every key a template could ask for is
   set (null when empty), because render.js looks a missing key up in
   the outer context.
   ============================================================ */
'use strict';

const has = a => Array.isArray(a) ? a.length > 0 : !!a;
const fill = (o, keys) => { const c = Object.assign({}, o); keys.forEach(k => { if (c[k] === undefined) c[k] = null; }); return c; };
const paras = p => (p == null ? [] : Array.isArray(p) ? p : [p]);

/* ---------- 55 · tools ----------
   { id, eyebrow, title, intro, light,
     items: [{ n, name, paras, img, cap, scope }] }
   scope = true: the picture is the paint under the microscope (canvas) */
function tools(o) {
  const c = fill(o, ['eyebrow', 'title', 'light']);
  c.intro = paras(o.intro); c.hasIntro = has(c.intro);
  c.items = (o.items || []).map(it => Object.assign({ n: null, img: null, cap: null, scope: false }, it, { paras: paras(it.paras) }));
  return c;
}

/* ---------- 56 · scope ----------
   { id, eyebrow, title, light, fig, figCap, book: { href, label },
     levels: [{ n, kicker, name, paras, removal, f, price, hi }] }
   removal = Paul's words ("up to 65–75%"); f = the share of defects the
   panel takes away at that level (0–1). The readout shows "up to" small
   and the figures large. */
function scope(o) {
  const c = fill(o, ['eyebrow', 'title', 'light', 'fig', 'figCap', 'book']);
  const lv = o.levels || [];
  c.levels = lv.map((l, i) => {
    const m = /^(up to\s+)?(.*)$/i.exec(l.removal || '');
    return {
      n: l.n, kicker: l.kicker, name: l.name, paras: paras(l.paras), price: l.price || null, hi: !!l.hi,
      removal: l.removal, upTo: m[1] ? m[1].trim() : null, figure: m[2], f: String(l.f), on: i === 0
    };
  });
  c.first = c.levels[0] || {};
  c.total = String(c.levels.length).padStart(2, '0');
  return c;
}

module.exports = { tools, scope };
