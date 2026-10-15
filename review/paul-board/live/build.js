/* ============================================================
   review/paul-board/live/build.js — the live review board.

     node review/paul-board/live/build.js

   Writes site/review/ (served with the site, so the board can look
   inside each page): index.html (styles, script and the page list
   inline) and thumbs/ (the overview pictures, taken by
   ../capture.js). Not linked from the site; the whole site is
   noindex (_headers).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const PAGES = require('../pages');

const DIR = __dirname;
const SITE = path.resolve(DIR, '../../../site');
const SHOTS = path.resolve(DIR, '../out/shots');
const DATA = path.resolve(DIR, '../out/data');
const OUT = path.join(SITE, 'review');
const SETTINGS = {
  key: 'live1',              /* keep: a new key starts Paul's notes afresh */
  sendTo: 'Ed',
  defaultName: 'Paul'
};

fs.mkdirSync(path.join(OUT, 'thumbs'), { recursive: true });
const pages = PAGES.map(p => {
  const o = { id: p.id, name: p.name, group: p.group, path: p.path };
  for (const v of ['d', 'm']) {
    const d = JSON.parse(fs.readFileSync(path.join(DATA, `${p.id}-${v}.json`), 'utf8'));
    fs.copyFileSync(path.join(SHOTS, d.thumb), path.join(OUT, 'thumbs', d.thumb));
    o[v] = { thumb: 'thumbs/' + d.thumb, w: d.w, h: d.h };
  }
  return o;
});

const b64 = f => fs.readFileSync(f).toString('base64');
const made = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const board = Object.assign({ made, logo: '/assets/img/logo-240.png', pages }, SETTINGS);
const css = fs.readFileSync(path.join(DIR, 'app.css'), 'utf8');
const js = fs.readFileSync(path.join(DIR, 'app.js'), 'utf8');

fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<title>Miracle Detail · Website review</title>
<style>
@font-face{font-family:"Fraunces";font-weight:500;font-display:swap;src:url(/assets/fonts/fraunces.woff2) format("woff2")}
@font-face{font-family:"Jost";font-weight:300 600;font-display:swap;src:url(/assets/fonts/jost.woff2) format("woff2")}
${css}</style>
</head>
<body>
<header class="bar" id="bar"></header>
<main id="main"></main>
<script>window.BOARD = ${JSON.stringify(board).replace(/</g, '\\u003c')};</script>
<script>${js}</script>
</body>
</html>`);
const kb = f => Math.round(fs.statSync(f).size / 1024) + ' KB';
console.log('site/review/index.html', kb(path.join(OUT, 'index.html')), '·', fs.readdirSync(path.join(OUT, 'thumbs')).length, 'thumbs');
