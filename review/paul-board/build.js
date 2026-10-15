/* ============================================================
   review/paul-board/build.js — puts the review board together.

     node review/paul-board/build.js

   Writes:
     index.html                     working copy (reads out/shots/)
     Miracle-Website-Review.html    the one file for Paul: every
                                    picture, font and script inside
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const PAGES = require('./pages');

const DIR = __dirname;
const SITE = path.resolve(DIR, '../../site');
const OUT = path.join(DIR, 'out');
const SETTINGS = {
  key: 'v1',                 /* keep: a new key starts Paul's notes afresh */
  sendTo: 'Ed',
  defaultName: 'Paul'
};

const b64 = f => fs.readFileSync(f).toString('base64');
const made = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const pages = PAGES.map(p => {
  const o = { id: p.id, name: p.name, group: p.group, path: p.path };
  for (const v of ['d', 'm']) {
    const d = JSON.parse(fs.readFileSync(path.join(OUT, 'data', `${p.id}-${v}.json`), 'utf8'));
    o[v] = {
      w: d.w, h: d.h, scale: +d.scale.toFixed(4), shotH: d.shotH, tiles: d.tiles, thumb: d.thumb,
      sections: d.sections,
      /* only what can be pointed at: visible words and pictures */
      items: d.items.filter(i => i.v).map(i => i.k === 't'
        ? { k: 't', v: 1, t: i.t, x: i.x, y: i.y, w: i.w, h: i.h, s: i.s }
        : { k: 'i', v: 1, kind: i.kind, src: i.src, alt: i.alt, x: i.x, y: i.y, w: i.w, h: i.h, s: i.s }),
      /* other looks of a block after a click or a swipe */
      states: (d.states || []).map(st => ({
        file: st.file, label: st.label, popup: !!st.popup, sec: st.sec, at: st.at, w: st.w, h: st.h,
        items: st.items.map(i => i.k === 't' ? { k: 't', v: 1, t: i.t, x: i.x, y: i.y, w: i.w, h: i.h }
          : { k: 'i', v: 1, kind: i.kind, src: i.src, alt: i.alt, x: i.x, y: i.y, w: i.w, h: i.h })
      }))
    };
  }
  return o;
});

const fonts = `
@font-face{font-family:"Fraunces";font-weight:500;font-display:block;src:url(data:font/woff2;base64,${b64(path.join(SITE, 'assets/fonts/fraunces.woff2'))}) format("woff2")}
@font-face{font-family:"Jost";font-weight:300 600;font-display:block;src:url(data:font/woff2;base64,${b64(path.join(SITE, 'assets/fonts/jost.woff2'))}) format("woff2")}`;
const css = fs.readFileSync(path.join(DIR, 'app/app.css'), 'utf8');
const js = fs.readFileSync(path.join(DIR, 'app/app.js'), 'utf8');
const logo = 'data:image/png;base64,' + b64(path.join(SITE, 'assets/img/logo-240.png'));
const board = Object.assign({ made, logo, pages }, SETTINGS);

function html(inline) {
  const files = [];
  if (inline) for (const p of pages) for (const v of ['d', 'm']) {
    files.push(p[v].thumb, ...p[v].tiles.map(t => t.file), ...p[v].states.map(s => s.file));
  }
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Miracle Detail · Website review</title>
<style>${fonts}
${css}</style>
</head>
<body>
<header class="bar" id="bar"></header>
<main id="main"></main>
<script>window.BOARD = ${JSON.stringify(board).replace(/</g, '\\u003c')};</script>
${files.map(f => `<script type="text/plain" id="f:${f}">${b64(path.join(OUT, 'shots', f))}</script>`).join('\n')}
<script>${js}</script>
</body>
</html>`;
}

fs.writeFileSync(path.join(DIR, 'index.html'), html(false));
const final = path.join(DIR, 'Miracle-Website-Review.html');
fs.writeFileSync(final, html(true));
const mb = f => (fs.statSync(f).size / 1048576).toFixed(1) + ' MB';
console.log('index.html', mb(path.join(DIR, 'index.html')), '·', path.basename(final), mb(final));
