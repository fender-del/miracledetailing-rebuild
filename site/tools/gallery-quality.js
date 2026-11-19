/* ============================================================
   tools/gallery-quality.js: re-encodes the old-site Gallery photos
   sharper, from the originals in assets-src/gallery/<slug>/.

   19/11 (Paul to Ed: "the quality isn't that good across the images in
   the gallery, they used to be a lot clearer"):
   - <n>-1400.webp (lightbox): q66 -> q80 with smart subsampling, same size
   - <cover>-800.webp (new): the grid card on a Retina screen draws the
     cover at 650-720 device pixels, the 480 file was being stretched
   tools/gallery.js and tools/gallery-new.js now encode the same way.
     node tools/gallery-quality.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(ROOT, 'assets-src/gallery');
const OUT = path.join(ROOT, 'site/assets/gallery');
const ONLY = process.argv.slice(2);
const jobs = require('../src/lib/gallery.json').filter(j => !ONLY.length || ONLY.includes(j.slug));

(async () => {
  let done = 0, bad = [];
  for (const j of jobs) {
    const files = fs.readdirSync(path.join(SRC, j.slug)).filter(f => !f.startsWith('.')).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    if (files.length !== j.photos.length) { bad.push(j.slug); continue; }
    for (let i = 0; i < files.length; i++) {
      const src = path.join(SRC, j.slug, files[i]), n = i + 1;
      const big = path.join(OUT, j.slug, `${n}-1400.webp`);
      await sharp(src).rotate().resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 80, smartSubsample: true }).toFile(big + '.tmp');
      fs.renameSync(big + '.tmp', big);
      const md = await sharp(big).metadata();
      if (md.width !== j.photos[i].w || md.height !== j.photos[i].h) bad.push(`${j.slug} #${n} size changed`);
      if (n === (j.cover.n || 1))
        await sharp(src).rotate().resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 78, smartSubsample: true }).toFile(path.join(OUT, j.slug, `${n}-800.webp`));
    }
    if (++done % 20 === 0) console.log(done, '/', jobs.length);
  }
  console.log('done', done, 'problems', bad);
})().catch(e => { console.error(e); process.exit(1); });
