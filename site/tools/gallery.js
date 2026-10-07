/* ============================================================
   tools/gallery.js — builds the Gallery data + images from the old site.

   1. reads crawl/old/gallery-inventory.csv, keeps jobs with >= 3 full-size
      photos, fetches each old project page (max 6 at a time) and caches
      title / description / photo URLs in assets-src/gallery/_jobs.json
   2. downloads the first 12 photos per job to assets-src/gallery/<slug>/
      as NN-<original name> (skips files already there, retries once)
   3. encodes site/assets/gallery/<slug>/<i>-480.webp (q60) and
      <i>-1400.webp (max 1400 wide, no upscale, q66), EXIF auto-rotated;
      16 px LQIP for the cover only
   4. writes site/src/lib/gallery.json (sorted by make, then title)

   Re-runnable: every step skips what already exists.
     node tools/gallery.js            normal run
     node tools/gallery.js --refetch  re-read the old pages
     node tools/gallery.js --big 1200 --q 62 --force-big
                                      re-encode the large variant smaller
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const CSV = path.join(ROOT, 'crawl/old/gallery-inventory.csv');
const SRC = path.join(ROOT, 'assets-src/gallery');
const OUT = path.join(ROOT, 'site/assets/gallery');
const JSON_OUT = path.join(ROOT, 'site/src/lib/gallery.json');
const CACHE = path.join(SRC, '_jobs.json');

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const REFETCH = argv.includes('--refetch');
let BIG_W = +arg('--big', 1400);
let BIG_Q = +arg('--q', 66);
let FORCE_BIG = argv.includes('--force-big');
const BUDGET_MB = 180;
const MAX_PHOTOS = 12;
const MIN_PHOTOS = 3;
const UA = { 'User-Agent': 'Mozilla/5.0' };

const log = { other: [], fail: [], notes: [] };

/* ---------- helpers ---------- */
function parseCSV(text) {
  text = text.replace(/^﻿/, '');
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f.replace(/\r$/, '')); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] || ''])));
}

const NAMED = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', pound: '£' };
function unescape(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1));
    return NAMED[e.toLowerCase()] ?? m;
  });
}
/* the one allowed copy change: an em dash becomes a comma */
const noEm = s => s.replace(/\s*—\s*/g, ', ').replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim();

async function pool(items, n, fn) {
  const out = new Array(items.length); let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
  }));
  return out;
}

async function get(url, as = 'text') {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(60000) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return as === 'text' ? await r.text() : Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (attempt) throw e;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

/* ---------- 1. pages ---------- */
function parsePage(html) {
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
  const meta = name => {
    const m = html.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, 'i'));
    return m ? m[1] : '';
  };
  const desc = meta('description') || meta('dc.description');
  const seen = new Set(), photos = [], others = new Set();
  const re = /href="(https?:\/\/miracledetail\.co\.uk\/wp-content\/uploads\/\d{4}\/\d{2}\/([^"\/]+?\.(?:jpe?g|png|webp)))"/gi;
  let m;
  while ((m = re.exec(html))) {
    const [, url, file] = m;
    if (/-\d+x\d+\.\w+$/i.test(file) || /logo/i.test(file)) continue;
    if (seen.has(url)) continue;
    if (!/^gal-\d+-/i.test(file)) others.add(url); // newer jobs use camera names (IMG_, DSC, uuid)
    seen.add(url); photos.push(url);
  }
  return {
    title: noEm(unescape(h1.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ')),
    text: noEm(unescape(desc).replace(/\s+/g, ' ')),
    photos, others: [...others],
  };
}

/* ---------- 4. make / model ---------- */
const MAKES = [
  ['Aston Martin'], ['Alfa Romeo'], ['Austin Healey', /^austin[- ]healey\b/i], ['Mercedes-Benz', /^mercedes(?:[- ]benz)?\b/i],
  ['Land Rover', /^land rover\b/i], ['Land Rover', /^range rover\b/i, true], ['Rolls-Royce', /^rolls[- ]royce\b/i],
  ['Harley-Davidson', /^harley[- ]davidson\b/i], ['Volkswagen', /^(?:volkswagen|vw)\b/i],
  ['Ferrari'], ['Porsche'], ['Lamborghini'], ['McLaren'], ['Bentley'], ['BMW'], ['Audi'], ['Bugatti'],
  ['Koenigsegg'], ['Pagani'], ['Maserati'], ['Jaguar'], ['Lotus'], ['Morgan'], ['Nissan'], ['Ford'], ['Lexus'],
  ['Tesla'], ['Mini'], ['Honda'], ['Toyota'], ['Subaru'], ['Mitsubishi'], ['Vauxhall'], ['Jensen'], ['Spyker'],
  ['Noble'], ['TVR'], ['Caterham'], ['Ariel'], ['AC'], ['MG'], ['Triumph'], ['Lancia'], ['Fiat'],
  ['Citroen', /^citro[eë]n\b/i], ['Peugeot'], ['Renault'], ['Volvo'], ['Saab'], ['Dodge'], ['Chevrolet'],
  ['Corvette'], ['Cadillac'], ['Ducati'], ['Maybach'], ['Alpina'], ['Abarth'], ['Hummer'], ['Infiniti'],
  ['Jeep'], ['Kia'], ['Hyundai'], ['Mazda'], ['Seat'], ['Skoda'], ['Smart'], ['Suzuki'], ['DeLorean'],
  ['De Tomaso'], ['Datsun'], ['Lagonda'], ['Bristol'], ['Morris'], ['Austin'], ['Rover'], ['Daimler'],
  ['Shelby'], ['Plymouth'], ['Pontiac'], ['Buick'], ['Lincoln'], ['Chrysler'], ['Polestar'], ['Rimac'],
  ['Zenvo'], ['Hennessey'], ['Ruf'], ['Singer'], ['Brabus'], ['Mansory'], ['Cupra'], ['Genesis'], ['Alpine'],
  ['Ineos'], ['Lucid'], ['Rivian'], ['Kawasaki'], ['Yamaha'], ['Triumph'], ['BAC'], ['Radical'], ['Ultima'],
  ['Westfield'], ['Ginetta'], ['Marcos'], ['Reliant'], ['Sunbeam'], ['Wolseley'], ['Riley'], ['Hillman'],
  ['Ascari'], ['Gumpert'], ['Saleen'], ['Wiesmann'], ['Donkervoort'], ['Vector'], ['SSC'], ['W Motors'],
].map(([make, re, keepWord]) => ({
  make, keepWord: !!keepWord,
  re: re || new RegExp('^' + make.replace(/[-]/g, '[- ]').replace(/ /g, '[- ]') + '\\b', 'i'),
}));

function makeModel(title) {
  let t = title.trim();
  const ym = t.match(/^((?:19|20)\d{2})\s+/);
  const year = ym ? +ym[1] : null;
  if (ym) t = t.slice(ym[0].length);
  const tidy = s => s.split(/\s+[–—-]\s+|\s*\(|,|\s+(?:in|with|detailed)\s+|\s+(?:19|20)\d{2}\b|\s+\d{5,}\s/i)[0].replace(/[.\s]+$/, '').trim();
  if (/^la ?ferrari\b/i.test(t)) return { make: 'Ferrari', model: 'LaFerrari', year, guessed: false };
  const words = t.split(/\s+/);
  // try each word start (a make can follow "Brand new", "Stunning" ...)
  for (let w = 0; w < words.length; w++) {
    const rest = words.slice(w).join(' ');
    for (const k of MAKES) {
      const m = rest.match(k.re);
      if (!m) continue;
      let model = k.keepWord ? rest : rest.slice(m[0].length);
      model = tidy(model);
      return { make: k.make, model, year, guessed: w > 0 };
    }
  }
  return { make: 'Other', model: t, year, guessed: false };
}

/* ---------- 3. encode ---------- */
async function encodeJob(job) {
  const dir = path.join(OUT, job.slug);
  fs.mkdirSync(dir, { recursive: true });
  const photos = [];
  for (let i = 0; i < job.files.length; i++) {
    const src = job.files[i], n = i + 1;
    const small = path.join(dir, `${n}-480.webp`), big = path.join(dir, `${n}-1400.webp`);
    try {
      const t0 = fs.statSync(src).mtimeMs, fresh = f => fs.existsSync(f) && fs.statSync(f).mtimeMs >= t0;
      if (!fresh(small))
        await sharp(src).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 60 }).toFile(small);
      if (!fresh(big) || FORCE_BIG)
        await sharp(src).rotate().resize({ width: BIG_W, withoutEnlargement: true }).webp({ quality: BIG_Q }).toFile(big + '.tmp')
          .then(() => fs.renameSync(big + '.tmp', big));
      const md = await sharp(big).metadata();
      photos.push({ w: md.width, h: md.height });
    } catch (e) {
      log.fail.push(`encode ${job.slug} #${n}: ${e.message}`);
      for (const f of [small, big]) try { fs.unlinkSync(f); } catch {}
      photos.push(null);
    }
  }
  // outputs beyond the photo count are stale
  for (const f of fs.readdirSync(dir)) { const n = parseInt(f, 10); if (n > job.files.length) fs.unlinkSync(path.join(dir, f)); }
  return photos;
}

function dirMB(d) {
  let t = 0;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    t += e.isDirectory() ? dirMB(p) * 1048576 : fs.statSync(p).size;
  }
  return t / 1048576;
}

/* ---------- main ---------- */
(async () => {
  fs.mkdirSync(SRC, { recursive: true });
  const rows = parseCSV(fs.readFileSync(CSV, 'utf8')).filter(r => +r.full_res_links >= MIN_PHOTOS);
  const cache = !REFETCH && fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  const slugOf = u => u.replace(/\/+$/, '').split('/').pop();

  // 1. pages
  await pool(rows, 6, async r => {
    const slug = slugOf(r.url);
    if (cache[slug]) return;
    try {
      const p = parsePage(await get(r.url));
      cache[slug] = { slug, url: r.url, title: p.title || noEm(r.h1), text: p.text, photos: p.photos, others: p.others };
      process.stderr.write(`page ${Object.keys(cache).length}/${rows.length} ${slug}
`);
    } catch (e) { log.fail.push(`page ${r.url}: ${e.message}`); }
  });
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));

  const jobs = rows.map(r => cache[slugOf(r.url)]).filter(Boolean);
  for (const j of jobs) {
    if (j.others && j.others.length) log.notes.push(`${j.slug}: ${j.others.length} photo link(s) not named gal-*, included`);
  }
  const kept = jobs.filter(j => j.photos.length >= MIN_PHOTOS);
  for (const j of jobs) if (j.photos.length < MIN_PHOTOS) log.notes.push(`${j.slug}: only ${j.photos.length} photos on page, dropped`);

  // 2. downloads
  const tasks = [];
  for (const j of kept) {
    const dir = path.join(SRC, j.slug);
    fs.mkdirSync(dir, { recursive: true });
    j.files = [];
    j.photos.slice(0, MAX_PHOTOS).forEach((u, i) => {
      const file = path.join(dir, String(i + 1).padStart(2, '0') + '-' + decodeURIComponent(u.split('/').pop()));
      j.files.push(file);
      if (!(fs.existsSync(file) && fs.statSync(file).size > 0)) tasks.push({ u, file });
    });
  }
  let dl = 0;
  await pool(tasks, 6, async t => {
    try { fs.writeFileSync(t.file, await get(t.u, 'buf')); if (++dl % 50 === 0) process.stderr.write(`downloaded ${dl}/${tasks.length}
`); }
    catch (e) { log.fail.push(`download ${t.u}: ${e.message}`); }
  });
  for (const j of kept) j.files = j.files.filter(f => fs.existsSync(f) && fs.statSync(f).size > 0);
  // originals no longer in a job's list (order changed upstream) are removed
  for (const j of kept) {
    const want = new Set(j.files.map(f => path.basename(f)));
    for (const f of fs.readdirSync(path.join(SRC, j.slug))) if (!want.has(f)) fs.unlinkSync(path.join(SRC, j.slug, f));
  }

  // 3. encode (indexes follow the surviving files, so a dropped photo leaves no gap)
  const encodeAll = () => pool(kept, 4, async j => {
    const photos = await encodeJob(j);
    j.encoded = photos;
    process.stderr.write(`encoded ${j.slug}
`);
  });
  await encodeAll();
  let mb = dirMB(OUT);
  if (mb > BUDGET_MB && !FORCE_BIG) {
    log.notes.push(`assets/gallery was ${mb.toFixed(1)} MB at 1400/q66, re-encoded large variant at 1200/q62`);
    BIG_W = 1200; BIG_Q = 62; FORCE_BIG = true;
    await encodeAll();
    mb = dirMB(OUT);
  }

  // cover LQIP + json
  const out = [];
  for (const j of kept) {
    if (j.encoded.some(p => !p)) log.fail.push(`${j.slug}: photo(s) failed to encode, re-run after fixing`);
    const photos = j.encoded.filter(Boolean);
    if (photos.length < MIN_PHOTOS) { log.notes.push(`${j.slug}: fewer than ${MIN_PHOTOS} photos after failures, dropped`); continue; }
    const lq = await sharp(j.files[0]).rotate().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    const mm = makeModel(j.title);
    if (mm.make === 'Other') log.other.push(j.title);
    if (mm.guessed) log.notes.push(`make found mid-title: "${j.title}" -> ${mm.make}`);
    out.push({
      slug: j.slug, title: j.title, make: mm.make, model: mm.model, year: mm.year, text: j.text || '', url: j.url,
      cover: { lqip: 'data:image/webp;base64,' + lq.toString('base64') },
      photos,
    });
  }
  const coll = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  out.sort((a, b) => ((a.make === 'Other') - (b.make === 'Other')) || coll.compare(a.make, b.make) || coll.compare(a.title, b.title));
  fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1) + '\n');

  // 6. summary
  const counts = {};
  for (const j of out) counts[j.make] = (counts[j.make] || 0) + 1;
  console.log(`jobs in csv with >=3: ${rows.length}; fetched: ${jobs.length}; kept: ${out.length}`);
  console.log(`photos encoded: ${out.reduce((s, j) => s + j.photos.length, 0)}; downloaded this run: ${dl}`);
  console.log(`site/assets/gallery: ${mb.toFixed(1)} MB (large variant ${BIG_W}px q${BIG_Q})`);
  console.log('makes:', Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '));
  console.log('Other:', log.other.length ? '\n  ' + log.other.join('\n  ') : 'none');
  console.log('notes:', log.notes.length ? '\n  ' + log.notes.join('\n  ') : 'none');
  console.log('failures:', log.fail.length ? '\n  ' + log.fail.join('\n  ') : 'none');
})();
