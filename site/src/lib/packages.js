/* ============================================================
   packages.js — data for blocks 53–54 (07/10, the packages page:
   Fender asked for it to be audited and made more appealing. The five
   levels were five long white cards stacked one on another, hard to
   tell apart; the wheel coating sat in a half-empty section).

     53 ladder   the five levels read one after another beside a held
                 panel: the level's photo, a step for each level, its
                 time, coating life, polishing stages and price
     54 addon    one service offered on its own or with any level: a
                 photo and Paul's words on one band

   Same rule as lib/shared.js: every key a template could ask for is
   set (null when empty), because render.js looks a missing key up in
   the outer context.
   ============================================================ */
'use strict';

const has = a => Array.isArray(a) ? a.length > 0 : !!a;
const fill = (o, keys) => { const c = Object.assign({}, o); keys.forEach(k => { if (c[k] === undefined) c[k] = null; }); return c; };
const paras = p => (p == null ? [] : Array.isArray(p) ? p : [p]);
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const pct = v => (Math.max(0, Math.min(1, v)) * 100).toFixed(2) + '%';

/* ---------- 53 · ladder ----------
   { id, eyebrow, title, intro, light, note, link: { label, href },
     book: { label, href },
     gauges: { time: { label, ticks }, life: { label, unit, max },
               stages: { label, max } },
     levels: [{ kicker, name, sub, paras, list, price, img,
                time: { text, from, to },     from/to: 0..1 on the track
                life: { text, from, to },     years; to = null: open end
                stages: { text, n, upTo } }] }
   A list line that starts with "+" is new at that level (the "+" is
   dropped); the others were already in the level below. */
function ladder(o) {
  const c = fill(o, ['eyebrow', 'title', 'light', 'link', 'book']);
  c.intro = paras(o.intro); c.hasIntro = has(c.intro);
  c.note = paras(o.note); c.hasNote = has(c.note);
  const g = o.gauges || {};
  const lifeMax = (g.life && g.life.max) || 7;
  const stageMax = (g.stages && g.stages.max) || 6;
  c.timeLabel = (g.time && g.time.label) || 'Time';
  c.timeTicks = (g.time && g.time.ticks) || [];
  c.lifeLabel = (g.life && g.life.label) || 'Durability';
  c.lifeUnit = (g.life && g.life.unit) || '';
  /* 0 … max, the last one open ("7+") */
  c.lifeTicks = Array.from({ length: lifeMax + 1 }, (_, i) => (i === lifeMax ? i + '+' : String(i)));
  c.lifeTicks = c.lifeTicks.map((t, i) => ({ t, at: pct(i / (lifeMax + 1)) }));
  c.timeTicks = c.timeTicks.map(t => ({ t: t.label, at: pct(t.at) }));
  c.stageLabel = (g.stages && g.stages.label) || 'Stages';
  c.stagePips = Array.from({ length: stageMax }, (_, i) => ({ k: i + 1 }));
  c.stageMax = stageMax;

  const total = (o.levels || []).length;
  c.levels = (o.levels || []).map((lv, i) => {
    const list = (lv.list || []).map(t => (t.charAt(0) === '+' ? { text: t.slice(1).trim(), fresh: true } : { text: t, fresh: false }));
    const life = lv.life || {}, time = lv.time || {}, st = lv.stages || {};
    const lifeTo = life.to == null ? lifeMax + 1 : life.to;
    return {
      n: i + 1, roman: ROMAN[i], total,
      kicker: lv.kicker || `Level ${i + 1}`, name: lv.name, sub: lv.sub || null,
      paras: paras(lv.paras), list, hasList: list.length > 0,
      /* the first level has nothing below it: every line is its own */
      marks: i > 0 && list.some(l => l.fresh),
      price: lv.price || null, img: lv.img || null, hi: !!lv.hi, anchor: lv.anchor || null,
      timeText: time.text || null, timeA: pct(time.from || 0), timeB: pct(time.to == null ? time.from || 0 : time.to),
      lifeText: life.text || null, lifeNone: life.from == null,
      lifeA: pct(life.from == null ? 0 : life.from / (lifeMax + 1)), lifeB: pct(life.from == null ? 0 : lifeTo / (lifeMax + 1)),
      lifeOpen: life.from != null && life.to == null,
      stageText: st.text || null, stageN: st.n || 0,
      rungs: Array.from({ length: total }, (_, j) => ({ on: j <= i, cur: j === i })),
      pips: Array.from({ length: stageMax }, (_, j) => ({ on: j < (st.n || 0) }))
    };
  });
  c.count = total;
  c.total = String(total).padStart(2, '0');
  c.first = c.levels[0] || null;
  return c;
}

/* ---------- 54 · addon ----------
   { id, eyebrow, title, paras, img, light, links: [{ label, href }] } */
function addon(o) {
  const c = fill(o, ['eyebrow', 'title', 'img', 'light']);
  c.paras = paras(o.paras);
  c.links = o.links || []; c.hasLinks = has(c.links);
  return c;
}

module.exports = { ladder, addon };
