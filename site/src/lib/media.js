/* ============================================================
   media.js (20/11): photos uploaded in the DMI CMS.
   The CMS keeps them in R2 (bucket cms-media), public at MEDIA_URL,
   one file per width: <key>-<w>.<ext> (webp, or jpg from Safari).
   An image field from the CMS reads { src, alt, media: { key, ext,
   widths, w, h } }; content keeps the key, so moving the photo domain
   only means changing MEDIA_URL here (or in the build's env).
   ============================================================ */
'use strict';
const { esc } = require('./render.js');

const MEDIA_URL = (process.env.MEDIA_URL || 'https://media.detailersmovement.com').replace(/\/+$/, '');
const KEY = /^media\/[a-z0-9][a-z0-9-]{0,63}\/[a-z0-9]{12}$/;

/* a usable media reference, or null (a bad one falls back to src) */
function ref(m) {
  if (!m || typeof m !== 'object' || !KEY.test(m.key || '') || !['webp', 'jpg'].includes(m.ext)) return null;
  const widths = Array.isArray(m.widths) ? m.widths.filter(w => Number.isInteger(w) && w > 0) : [];
  if (!widths.length || !(m.w > 0) || !(m.h > 0)) return null;
  return { key: m.key, ext: m.ext, widths, w: m.w, h: m.h };
}

const url = (m, w) => `${MEDIA_URL}/${m.key}-${w}.${m.ext}`;
/* the width used when one URL is needed (share image, JSON-LD) */
const largest = (m, max = 1600) => [...m.widths].reverse().find(w => w <= max) || m.widths[0];

/* <picture> with every uploaded width, in the same .media frame as the
   built photos (no blur-up: there is no lqip for an uploaded photo) */
function mediaFrame(m, o = {}) {
  const srcset = m.widths.map(w => `${url(m, w)} ${w}w`).join(', ');
  const ratio = o.ratio === false ? '' : `aspect-ratio:${o.ratio || `${m.w} / ${m.h}`}`;
  const load = o.priority ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
  return `<div class="media ${o.frameCls || ''}" style="${ratio}"><picture><img src="${url(m, largest(m, 1200))}" srcset="${srcset}" sizes="${o.sizes || '100vw'}" width="${m.w}" height="${m.h}" alt="${esc(o.alt || '')}"${load}></picture></div>`;
}

module.exports = { MEDIA_URL, ref, url, largest, mediaFrame };
