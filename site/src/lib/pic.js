/* ============================================================
   pic.js — one <picture> per image id from images.json.

   pic(id, { alt, sizes, eager, priority, cls, art })
     art: [{ media, id }] — art-directed sources tried first
          (the hero's square phone crop).

   Returns { html, lqip }. The frame (.media) carries the lqip as its
   background so the blur-up needs nothing but opacity.
   ============================================================ */
'use strict';
const images = require('./images.json');
const { esc } = require('./render.js');

/* ?v= is the file's content hash (tools/images.js): a re-encoded image
   under the same name is fetched again despite the year-long cache */
const ver = id => (images[id].v ? `?v=${images[id].v}` : '');
const set = (id, ext) => images[id].widths.map(w => `/assets/img/${id}-${w}.${ext}${ver(id)} ${w}w`).join(', ');

function pic(id, o = {}) {
  const im = images[id];
  if (!im) throw new Error(`pic(): no image '${id}' — run node tools/images.js`);
  const sizes = o.sizes || '100vw';
  const largest = im.widths[im.widths.length - 1];
  const h = Math.round(largest * im.h / im.w);
  const lazy = o.eager || o.priority ? '' : ' loading="lazy" decoding="async"';
  const prio = o.priority ? ' fetchpriority="high"' : '';
  const cls = ['lz', o.cls].filter(Boolean).join(' ');

  let sources = '';
  for (const a of o.art || []) {
    sources += `<source media="${a.media}" type="image/avif" srcset="${set(a.id, 'avif')}" sizes="${a.sizes || sizes}">`
             + `<source media="${a.media}" type="image/webp" srcset="${set(a.id, 'webp')}" sizes="${a.sizes || sizes}">`;
  }
  sources += `<source type="image/avif" srcset="${set(id, 'avif')}" sizes="${sizes}">`;

  const html = `<picture>${sources}<img class="${o.priority ? (o.cls || '') : cls}" src="/assets/img/${id}-${im.widths[Math.min(1, im.widths.length - 1)]}.webp${ver(id)}" `
    + `srcset="${set(id, 'webp')}" sizes="${sizes}" width="${largest}" height="${h}" alt="${esc(o.alt || '')}"${lazy}${prio}></picture>`;

  return { html, lqip: im.lqip, ratio: `${im.w} / ${im.h}` };
}

/* Media frame with the placeholder painted underneath. */
function frame(id, o = {}) {
  const p = pic(id, o);
  const style = `--lq:url(${p.lqip})` + (o.ratio === false ? '' : `;aspect-ratio:${o.ratio || p.ratio}`);
  const credit = o.credit ? `<span class="credit">Photo: ${esc(o.credit)}</span>` : '';
  const attrs = o.attrs ? ' ' + o.attrs : '';
  return `<div class="media ${o.frameCls || ''}" style="${style}"${attrs}>${p.html}${credit}</div>`;
}

module.exports = { pic, frame, images, ver };
