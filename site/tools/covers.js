/* ============================================================
   tools/covers.js — the main (cover) photo of every Gallery job.
   src/lib/covers.json = { slug: photo number (1-based) } chosen by eye
   (21/10, Paul: "a good full view picture as the main picture").
   Writes cover.n + a new 16 px LQIP for that photo into gallery.json.
   Re-run after tools/gallery.js (which rewrites gallery.json).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const LIB = path.resolve(__dirname, '..', 'src/lib');
const OUT = path.resolve(__dirname, '..', 'assets/gallery');
const jobs = JSON.parse(fs.readFileSync(path.join(LIB, 'gallery.json'), 'utf8'));
const covers = JSON.parse(fs.readFileSync(path.join(LIB, 'covers.json'), 'utf8'));

(async () => {
  for (const j of jobs) {
    const n = covers[j.slug] || 1;
    const buf = await sharp(path.join(OUT, j.slug, `${n}-480.webp`)).resize(16).webp({ quality: 40 }).toBuffer();
    j.cover = { n, lqip: 'data:image/webp;base64,' + buf.toString('base64') };
  }
  fs.writeFileSync(path.join(LIB, 'gallery.json'), JSON.stringify(jobs, null, 1) + '\n');
  console.log(jobs.length + ' covers');
})();
