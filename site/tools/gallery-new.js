/* ============================================================
   tools/gallery-new.js: Gallery jobs from photos Paul sends now
   (not from the old site, so tools/gallery.js never touches them).

   19/11 (Paul, WeTransfer "Flicker gallery pics and main gallery",
   Ed: before the long weekend): four cars in folders (HEIC, converted
   to jpg/ beside them) and 132 loose photos of eight more cars, in
   Paul's order. Each car becomes a job; the cover goes first.
   Left out: 2 bottle-only shots (04, 34), a 2025 red panel of no
   car in the set (64). 125-132 (red car, 2024): Paul 19/11 "this is
   for the ferrari 348", added to that job.

   Encodes like tools/gallery.js (<n>-480.webp q60, <n>-1400.webp q80, cover 1-800.webp)
   into site/assets/gallery/<slug>/ and writes src/lib/gallery-new.json
   (same shape as gallery.json; the Gallery page and the homepage read both).
     node tools/gallery-new.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(ROOT, 'assets-src/drive-paul/1811-wetransfer');
const OUT = path.join(ROOT, 'site/assets/gallery');
const JSON_OUT = path.join(ROOT, 'site/src/lib/gallery-new.json');

const loose = (a, b, skip = []) => {
  const all = fs.readdirSync(path.join(SRC, '_loose')).sort();
  const out = [];
  for (let n = a; n <= b; n++) {
    if (skip.includes(n)) continue;
    const f = all.find(x => x.startsWith('image' + String(n).padStart(5, '0') + '.'));
    if (f) out.push(path.join('_loose', f));
  }
  return out;
};
const folder = d => fs.readdirSync(path.join(SRC, d, 'jpg')).sort().map(f => path.join(d, 'jpg', f));

/* cover: a file name in the list, shown first */
const JOBS = [
  { slug: 'ferrari-360-red', title: 'Ferrari 360', make: 'Ferrari', model: '360', files: folder('Ferrari 360'), cover: 'IMG_4685.jpg' },
  { slug: 'ferrari-348-red', title: 'Ferrari 348', make: 'Ferrari', model: '348', files: folder('Ferrari 348').concat(loose(125, 132)), cover: 'IMG_3957.jpg' },
  { slug: 'honda-civic-type-r-white', title: 'Honda Civic Type R', make: 'Honda', model: 'Civic Type R', files: folder('Honda civic type-R'), cover: 'IMG_4936.jpg' },
  { slug: 'porsche-macan-turbo-blue', title: 'Porsche Macan Turbo', make: 'Porsche', model: 'Macan Turbo', files: folder('Porsche Macan Turbo'), cover: 'IMG_2007.jpg' },
  { slug: 'bmw-m3-touring', title: 'BMW M3 Touring', make: 'BMW', model: 'M3 Touring', files: loose(1, 10, [4]), cover: 'image00007.jpeg' },
  { slug: 'nissan-x-trail-black', title: 'Nissan X-Trail', make: 'Nissan', model: 'X-Trail', files: loose(11, 18), cover: 'image00012.png' },
  { slug: 'ford-transit-custom-ms-rt-blue', title: 'Ford Transit Custom MS-RT', make: 'Ford', model: 'Transit Custom MS-RT', files: loose(19, 28), cover: 'image00019.png' },
  { slug: 'tesla-roadster-red', title: 'Tesla Roadster', make: 'Tesla', model: 'Roadster', files: loose(29, 36, [34]), cover: 'image00030.jpeg' },
  { slug: 'audi-q8-red', title: 'Audi Q8', make: 'Audi', model: 'Q8', files: loose(37, 45), cover: 'image00045.jpeg' },
  { slug: 'hyundai-ioniq-5-n', title: 'Hyundai Ioniq 5 N', make: 'Hyundai', model: 'Ioniq 5 N', files: loose(46, 50), cover: 'image00046.jpeg' },
  { slug: 'volvo-xc90-blue', title: 'Volvo XC90', make: 'Volvo', model: 'XC90', files: loose(51, 63), cover: 'image00053.png' },
  { slug: 'bmw-e30-m3-silver', title: 'BMW E30 M3', make: 'BMW', model: 'M3 (E30)', files: loose(65, 124), cover: 'image00082.jpeg' }
];

(async () => {
  const out = [];
  for (const j of JOBS) {
    const ci = j.files.findIndex(f => path.basename(f) === j.cover);
    if (ci < 0) throw new Error(`${j.slug}: cover ${j.cover} not found`);
    const files = [j.files[ci], ...j.files.filter((f, i) => i !== ci)];
    const dir = path.join(OUT, j.slug);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
    const photos = [];
    for (let i = 0; i < files.length; i++) {
      const src = path.join(SRC, files[i]), n = i + 1;
      await sharp(src).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 60 }).toFile(path.join(dir, `${n}-480.webp`));
      const big = path.join(dir, `${n}-1400.webp`);
      await sharp(src).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80, smartSubsample: true }).toFile(big);
      if (n === 1) await sharp(src).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78, smartSubsample: true }).toFile(path.join(dir, '1-800.webp'));
      const md = await sharp(big).metadata();
      photos.push({ w: md.width, h: md.height });
    }
    const lq = await sharp(path.join(SRC, files[0])).rotate().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    out.push({
      slug: j.slug, title: j.title, make: j.make, model: j.model, year: null, text: '', url: null,
      cover: { lqip: 'data:image/webp;base64,' + lq.toString('base64'), n: 1 },
      photos, sent: '2026-11-18'
    });
    console.log(j.slug, photos.length);
  }
  fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1) + '\n');
})().catch(e => { console.error(e); process.exit(1); });
