/* ============================================================
   shared.js — page data used by more than one page: v0.5's Google
   reviews, the star row, the "To confirm" label and breadcrumbs.
   ============================================================ */
'use strict';
const { esc } = require('./render.js');
const site = require('../site.js');
const { images } = require('./pic.js');

const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z"/></svg>';
const color = ['#5E35B1', '#00796B', '#AD1457', '#3949AB', '#6D4C41', '#455A64'];

/* v0.5's six Google reviews, as published there. */
const reviews = [
  { text: 'I was thunderstruck by the effect Paul achieved. I am certain the car never looked, or felt, this good, not even the day it came out of the showroom. The depth of the shine has to be seen to be believed. I consider myself very fortunate to have discovered Paul.', name: 'Verified customer', car: 'Google review', initials: 'G' },
  { text: 'Paul did an awesome job on my TT and my Q7. The Q7 needed a lot of work and now looks like new. Really worthwhile investment in upgrading and protecting both cars.', name: 'Duncan Walker', car: 'Audi TT & Q7', initials: 'DW' },
  { text: 'I had my Mercedes paint corrected and ceramic coated and was blown away with how good the work is. The car looks better than brand new. I’ve seen other detailers’ work and they don’t come anywhere close.', name: 'Anjela Hitchcock', car: 'Mercedes', initials: 'AH' },
  { text: 'Completely blown away by the level of detail and care put into bringing my car back to better than new finish. Paul communicated with video and photos during the whole process. This guy is at the top of his game: he truly knows his craft and has made it an art form.', name: 'Verified customer', car: 'Google review', initials: 'G' },
  { text: 'I brought my 12 year old Audi TT to Paul in a sorry state. A week later the transformation was truly miraculous. A deep shine has been restored and the paintwork has a mirror-like finish. He makes the impossible seem possible.', name: 'William Sandeford', car: 'Audi TT', initials: 'WS' },
  { text: 'Paul Dalton has been the best known car detailer in this country for many, many years. I was somewhat honoured to partner with him on so many cars of all shapes, sizes and prices. Great guy and still the first call for detailing expertise.', name: 'Steve', car: 'Industry professional', initials: 'S' }
].map((r, i) => Object.assign(r, { color: color[i % color.length] }));

/* The gold "To confirm" label; `note` says what Paul has to check. */
const tbc = note => (site.tbc
  ? `<span class="tbc" tabindex="0" title="To confirm: ${esc(note)}">To confirm<span class="tbc__note" aria-hidden="true">${esc(note)}</span></span>`
  : '');

/* Breadcrumbs: [{ name, href }], the last one is the page itself. */
const crumbs = list => ({
  html: '<nav class="crumbs" aria-label="Breadcrumb"><ol>' + list.map((c, i) => (i === list.length - 1
    ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
    : `<li><a href="${c.href}">${esc(c.name)}</a></li>`)).join('') + '</ol></nav>',
  schema: {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: list.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: site.origin + c.href }))
  }
});

/* A logo from tools/images.js (white mark), or null so the template
   falls back to the name in type. `k` evens out how big the marks look
   (a long wordmark is drawn lower than a round badge). */
const mark = id => {
  const m = images['mark-' + id];
  if (!m) return null;
  const k = Math.max(0.36, Math.min(1.2, Math.sqrt(2.2 / (m.w / m.h)))).toFixed(2);
  return { src: `/assets/img/mark-${id}.webp${m.v ? `?v=${m.v}` : ''}`, w: m.w, h: m.h, k };
};

/* Data for block 37 (cards). Every key an item could carry is set, even
   when empty: the template engine looks a missing key up in the outer
   context, so an unset `price` would borrow the page's. */
const ITEM_KEYS = ['n', 'tag', 'kicker', 'name', 'sub', 'paras', 'list', 'facts', 'price', 'links', 'img', 'anchor', 'hi', 'no'];
const has = a => Array.isArray(a) ? a.length > 0 : !!a;
function cards(o) {
  const items = (o.items || []).map(it => {
    const c = {};
    ITEM_KEYS.forEach(k => { c[k] = it[k] == null ? null : it[k]; });
    if (typeof c.paras === 'string') c.paras = [c.paras];
    c.hasTop = has(c.n) || has(c.tag);
    c.hasText = has(c.paras);
    c.hasList = has(c.list);
    c.hasFacts = has(c.facts);
    c.hasFoot = has(c.price) || has(c.links);
    c.hasBody = c.hasText || c.hasList;
    c.hasEnd = c.hasFacts || c.hasFoot;
    return c;
  });
  const variant = o.variant || 'boxed';
  /* phones (07/10, Fender: "don't bury the packages, don't let it run
     on"): options that carry a price and no photo read as a price list,
     every one on screen, a tap opens the rest */
  const acc = o.acc === true || (o.acc !== false && variant === 'boxed' && items.length >= 3
    && items.every(i => !i.img && (has(i.price) || has(i.facts))));
  /* points: four or more become a row to swipe on phones too (07/10) */
  const rail = o.rail !== false && !acc && ((variant === 'boxed' && items.length >= 3) || (variant === 'points' && items.length >= 4));
  const fx = o.fx || null;
  return {
    id: o.id, variant, light: !!o.light, graphite: !!o.graphite,
    fx, acc,
    counted: rail || fx === 'rail',
    total: String(items.length).padStart(2, '0'),
    eyebrow: o.eyebrow || null, title: o.title || null,
    intro: o.intro || [], hasIntro: has(o.intro),
    hasHead: has(o.eyebrow) || has(o.title) || has(o.intro) || has(o.fig),
    cols: o.cols || Math.min(items.length, 3),
    rail,
    items,
    fig: o.fig || null, figCap: o.figCap || null,
    note: o.note || [], hasNote: has(o.note)
  };
}

/* Data for block 33 (prose) and 38 (quote), same rule: every key set. */
const fill = (o, keys) => { const c = Object.assign({}, o); keys.forEach(k => { if (c[k] === undefined) c[k] = null; }); return c; };
function prose(o) {
  const c = fill(o, ['eyebrow', 'img', 'cap', 'tagL', 'tagR', 'reverse', 'light', 'graphite', 'listTitle', 'list', 'listCols', 'after', 'price']);
  c.paras = c.paras || [];
  if (c.zoom) c.zoom = Object.assign({ focus: '50% 50%', rot: 0, glass: false }, c.zoom === true ? {} : c.zoom);
  else c.zoom = null;
  c.hasList = has(c.list); c.hasAfter = has(c.after);
  c.hasExtra = c.hasList || c.hasAfter || has(c.price) || has(c.listTitle);
  return c;
}
function quote(o) {
  const c = fill(o, ['eyebrow', 'title', 'cite', 'img', 'price', 'light']);
  c.paras = c.paras || []; c.hasParas = has(c.paras);
  /* 07/10: collage = [img, img, img] floating round the words; each
     gets a depth (how far it drifts) */
  const depths = [1.4, 0.8, 1.9];
  c.collage = (o.collage || []).map((img, i) => ({ img, depth: depths[i % 3] }));
  c.hasCollage = c.collage.length > 0;
  return c;
}

/* Block 23 (steps): { stepsId, stepsEyebrow, stepsTitle, steps, ... } */
function steps(o) {
  const list = o.steps.map(s => Object.assign({ num: null, links: null, tbc: null }, s, { hasLinks: has(s.links) }));
  const n = o.n || Math.min(list.length, 4);
  return {
    stepsId: o.id || null, stepsEyebrow: o.eyebrow || null, stepsTitle: o.title || null, stepsIntro: o.intro || null,
    steps: list, stepsN: n === 4 ? null : n, stepsLong: list.length > n,
    stepsBare: !(o.eyebrow || o.title || o.intro), stepsTight: !!o.tight,
    stepsLight: !!o.light, stepsGraphite: !!o.graphite,
    /* 07/10: stage = { img } or {} (the number in a ring); progress = the
       "Step n / N" bar */
    stepsStage: !!o.stage, stepsStageImg: (o.stage && o.stage.img) || null,
    stepsRail: !!o.railPhone,
    stepsProgress: !!o.progress, stepsCount: String(list.length).padStart(2, '0'), stepsTotal: list.length
  };
}

module.exports = { STAR, stars: STAR.repeat(5), reviews, tbc, crumbs, mark, cards, prose, quote, steps };
