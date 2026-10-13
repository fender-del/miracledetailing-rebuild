/* ============================================================
   ppf-m3.js — the PPF page's coverage views (13/10, Fender: the drawn
   McLaren read badly; a real-looking car, the film keyed on it).

   Two photos of one white BMW M3 Touring, front and rear three-quarter
   (assets-src/ppf-m3/, GPT Image 2.5). Every panel the film can cover
   is a path traced on the photo's own pixels by tools/ppf-m3/key.py:
   the edge between two panels runs down the middle of the real panel
   gap, lights and mirrors stop at the body's edge. Paths are in the
   source image's pixels; the photo is the CROP of that image, so the
   SVG's viewBox is the same CROP and nothing has to be scaled.

   Per view, over the photo:
     .pc__film  the film, multiplied into the paint (white paint turns
                gold, shadows stay shadows)
     .pc__fx    the film's cut edges and the sheen that sweeps it
   `on` = the zones lit in the HTML (the first package), so the photo
   says the right thing before (and without) any script.
   ============================================================ */
'use strict';
const { frame } = require('./pic.js');
const DATA = { front: require('./ppf-m3-front.json'), rear: require('./ppf-m3-rear.json') };

/* must match the crop of ppfm3-front / ppfm3-rear in tools/images.js */
const CROP = { x: 64, y: 150, w: 2560, h: 1180 };
const VB = `${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`;

const DARK = ['headlight', 'fog', 'mirror', 'taillight'];

const ALT = {
  front: 'A white BMW M3 Touring from the front three-quarter, the film panels marked in gold',
  rear: 'The same M3 Touring from the rear three-quarter, the film panels marked in gold'
};

function view(name, on, o = {}) {
  const D = DATA[name];
  const zones = Object.keys(D.zones);
  const paths = cls => zones.map(z =>
    `<path class="${cls}${on.includes(z) ? ' a' : ''}" data-z="${z}" fill-rule="evenodd" d="${D.zones[z]}"/>`).join('');
  /* lights and mirrors are dark: multiplying gold into black shows
     nothing, so their film is also laid over them, faintly */
  const dark = zones.filter(z => DARK.includes(z)).map(z =>
    `<path class="z zd${on.includes(z) ? ' a' : ''}" data-z="${z}" fill-rule="evenodd" d="${D.zones[z]}"/>`).join('');
  const photo = frame(`ppfm3-${name}`, { alt: ALT[name], sizes: o.sizes, frameCls: 'pc__ph' });
  return `<div class="pc__view${o.main ? ' is-main' : ' is-thumb'}" data-view="${name}">`
    + photo
    + `<svg class="pc__svg pc__film" viewBox="${VB}" aria-hidden="true" focusable="false"><g class="zones">${paths('z')}</g></svg>`
    + `<svg class="pc__svg pc__fx" viewBox="${VB}" aria-hidden="true" focusable="false">`
    +   `<defs>`
    +     `<linearGradient id="pc-sh-${name}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="520" y2="0" gradientTransform="translate(-900 0) skewX(-18)">`
    +       `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>`
    +     `</linearGradient>`
    +     `<mask id="pc-mk-${name}" maskUnits="userSpaceOnUse" x="${CROP.x}" y="${CROP.y}" width="${CROP.w}" height="${CROP.h}"></mask>`
    +   `</defs>`
    +   `<g class="dark">${dark}</g><g class="edges">${paths('e')}</g>`
    +   `<rect class="pc__sheen" x="${CROP.x}" y="${CROP.y}" width="${CROP.w}" height="${CROP.h}" fill="url(#pc-sh-${name})" mask="url(#pc-mk-${name})"/>`
    + `</svg>`
    + `<span class="pc__cap" aria-hidden="true">${name === 'front' ? 'Front' : 'Rear'}</span>`
    + `</div>`;
}

/* where a callout points, per view, in % of the photo */
const pct = ([x, y]) => [+((x - CROP.x) / CROP.w * 100).toFixed(2), +((y - CROP.y) / CROP.h * 100).toFixed(2)];
const anchors = Object.fromEntries(Object.entries(DATA).map(([v, D]) =>
  [v, Object.fromEntries(Object.entries(D.anchors).map(([z, p]) => [z, pct(p)]))]));
/* the zones each view shows */
const has = Object.fromEntries(Object.entries(DATA).map(([v, D]) => [v, Object.keys(D.zones)]));

module.exports = { view, anchors, has };
