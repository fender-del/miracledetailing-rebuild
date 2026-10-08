/* ============================================================
   tools/images.js — source photos -> AVIF + WebP at fixed widths.

   Sources stay untouched in ../assets-src/ (Drive originals and the
   v0.5 uploads). Each entry names one crop of one source; the crop
   is in fractions of the source so it survives a re-export at a
   different resolution.

   Writes:
     assets/img/<id>-<w>.avif / .webp
     src/lib/images.json   { id: { w, h, widths, lqip } }

   Only re-encodes a file that is missing, so a second run is quick.
     node tools/images.js          build missing files
     node tools/images.js --force  re-encode everything
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');
/* first 8 hex of a file's md5: appended as ?v= so a re-encoded image
   under the same name beats the year-long cache on /assets/ */
const hashOf = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8);

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, '..', 'assets-src');
const OUT = path.join(ROOT, 'assets', 'img');
const MAP = path.join(ROOT, 'src', 'lib', 'images.json');
const FORCE = process.argv.includes('--force');

sharp.cache(false);
sharp.concurrency(2);

/* crop: { l, t, w, h } as fractions of the source. */
const IMAGES = [
  /* Hero posters: the first frame of each loop (tools/video.js), so the
     photo the visitor sees first is exactly where the video starts. */
  { id: 'hero-v',      src: 'video/hero-1920-poster.png', widths: [960, 1440, 1920], q: 56 },
  { id: 'hero-vm',     src: 'video/hero-1080-poster.png', widths: [480, 720, 1080], q: 56 },

  /* The story block: Paul, face in frame (4:5 desktop, square on phones). */
  { id: 'paul',        src: 'drive/18-paul-portrait.png', crop: { l: 0, t: .165, w: .9, h: .633 }, widths: [480, 760, 847] },
  { id: 'paul-sq',     src: 'drive/18-paul-portrait.png', crop: { l: 0, t: .17, w: .8, h: .45 }, widths: [480, 752] },
  { id: 'mirror',      src: 'v05/download-3.jpg', widths: [600, 900] },

  /* Service cards, 4:5. Correction: Pexels 37809561, cropped to the
     polisher on red paint (the detailer's face is left out: Paul works
     alone). Ceramic: Fender's SF90 Spider photo (02/10). */
  { id: 'svc-correction', src: 'stock/pexels-37809561.jpg',        crop: { l: .289, t: .40, w: .711, h: .50 }, widths: [440, 660, 868] },
  { id: 'svc-ceramic',    src: 'Ferrari-SF90-Spider-ceramic.jpg',   crop: { l: .083, t: 0, w: .5, h: 1 }, widths: [440, 540] },
  { id: 'svc-ppf',        src: 'drive/07-ppf-squeegee.png',         crop: { l: 0, t: .03, w: 1, h: .937 }, widths: [440, 660, 900] },
  { id: 'svc-dryice',     src: 'drive/09-engine-bay.png',           crop: { l: .17, t: 0, w: .534, h: 1 }, widths: [440, 660, 818] },

  /* The other eight service cards, 4:5 (a hover list until 06/10) */
  { id: 'svc-studio',     src: 'drive/15-mclaren-studio.png',       crop: { l: .2, t: 0, w: .6, h: 1 }, widths: [360, 560, 720] },
  { id: 'svc-packages',   src: 'drive/04-gfw-red-detail.jpg',       crop: { l: .3, t: 0, w: .534, h: 1 }, widths: [360, 560, 720] },
  { id: 'svc-bodyshop',   src: 'drive/05-detail-gold-macro.png',    crop: { l: 0, t: .05, w: 1, h: .9 }, widths: [360, 560, 720] },
  { id: 'svc-pdr',        src: 'drive/02-gfw-red-macro-dark.jpg',   crop: { l: .36, t: .3, w: .374, h: .7 }, widths: [360, 560, 720] },
  { id: 'svc-wheels',     src: 'drive/20-gfw-458-speciale.jpg',     crop: { l: 0, t: .38, w: 1, h: .53 }, widths: [360, 560, 720] },
  /* Pexels (free licence): 37163499 Testarossa on a lift, 11968579 red
     quilted leather, 20036216 dark glass on a black saloon. */
  { id: 'svc-underside',  src: 'stock/pexels-37163499.jpg',         crop: { l: .22, t: .08, w: .279, h: .62 }, widths: [360, 560, 720] },
  { id: 'svc-leather',    src: 'stock/pexels-11968579.jpg',         crop: { l: .10, t: 0, w: .533, h: 1 }, widths: [360, 560, 720] },
  { id: 'svc-tint',       src: 'stock/pexels-20036216.jpg',         crop: { l: .30, t: 0, w: .533, h: 1 }, widths: [360, 560, 720] },

  /* Project card stack, 4:3 */
  { id: 'car-laferrari', src: 'drive/01-hero-red-supercar-spray.jpg', crop: { l: .1, t: .1, w: .8, h: .9 }, widths: [600, 1120], q: 48 },
  { id: 'car-enzo',      src: 'drive/13-ferrari-enzo.png',         crop: { l: .05, t: 0, w: .889, h: 1 }, widths: [600, 1120] },
  { id: 'car-ccxr',      src: 'drive/11-koenigsegg-carbon.png',    crop: { l: .03, t: 0, w: .938, h: 1 }, widths: [600, 1120] },
  { id: 'car-zonda',     src: 'drive/10-zonda-studio.png',         crop: { l: .06, t: 0, w: .889, h: 1 }, widths: [600, 1120] },
  { id: 'car-f40',       src: 'drive/14-ferrari-f40.png',          crop: { l: .1, t: 0, w: .75, h: 1 }, widths: [600, 1120] },
  { id: 'car-458',       src: 'drive/20-gfw-458-speciale.jpg',     crop: { l: 0, t: .3, w: 1, h: .5 }, widths: [600, 1120] },
  { id: 'car-porsche',   src: 'drive/19-porsche-classic.png',      widths: [600, 1120] },
  { id: 'car-db11',      src: 'v05/766890108_939359575876836_3422640734629086612_n.jpeg', widths: [600, 1120] },

  /* Dry ice page (06/10). Paul's own photos: a Ferrari engine bay in
     the studio (v0.5 download-61/62 and the old site's three dry ice
     shots, assets-src/dryice) and the Drive engine bay. Uses without a
     dry ice photo of their own borrow the archive and the Pexels stock
     already on the homepage (README: Paul's photos to replace them). */
  { id: 'di-hero',     src: 'dryice/download-62.webp', widths: [960, 1440, 2048], q: 56 },
  { id: 'di-hero-m',   src: 'dryice/download-62.webp', crop: { l: 0, t: 0, w: .8, h: .95 }, widths: [480, 720, 1080], q: 56 },
  /* 08/10 (Fender: "lệch quá"): cropped to the mound, without the
     hopper's arm and the agitator ball cutting in from the corners */
  { id: 'di-pellets',  src: 'dryice/download-61.webp', crop: { l: .233, t: .1625, w: .667, h: .625 }, widths: [700, 1200], q: 52 },
  { id: 'di-pour',     src: 'dryice/Dry-ice-blasting-service-in-Lingfield-Surrey-miracle-detail-3.jpg', widths: [600, 1200] },
  { id: 'di-gun',      src: 'dryice/Dry-ice-blasting-service-in-Lingfield-Surrey-miracle-detail.jpg', widths: [600, 1200] },
  { id: 'di-bay',      src: 'drive/09-engine-bay.png', widths: [600, 1100, 1535] },
  { id: 'di-use-bay',   src: 'drive/09-engine-bay.png',       crop: { l: .25, t: 0, w: .75, h: 1 }, widths: [440, 720] },
  { id: 'di-use-under', src: 'stock/pexels-37163499.jpg',     crop: { l: .12, t: .1, w: .42, h: .56 }, widths: [440, 720] },
  { id: 'di-use-int',   src: 'stock/pexels-11968579.jpg',     crop: { l: .05, t: 0, w: .75, h: 1 }, widths: [440, 720] },
  { id: 'di-use-resto', src: 'drive/19-porsche-classic.png',  widths: [440, 720] },

  /* PPF page (06/10, round 2: "better photos than v0.5's"). Hero: GF
     Williams' LaFerrari under the studio lights (7360 px), the film
     sweeps across it. Peace of mind: GF Williams' water off a wheel.
     Installation: Paul's own job photos, the four cleanest (no teal
     floor). Finishes: one GF Williams 458 Speciale, its matte and
     colour versions and a worn "before" made with AI from that photo
     (assets-src/finishes/, FLUX 3, 06/10). */
  /* Hero, round 3 (Fender 06/10: "a stock photo that fits PPF", ref =
     subject on the right, copy left): Unsplash dlJelFmdpOc, film being
     trimmed round a Mercedes headlight; cropped to the hands so the
     fitter's face (not Paul) is out of frame. */
  /* Hero video poster (round 4): the first frame of the PPF clip. The
     clip in place is Adobe Stock 594907552's watermarked preview (comp,
     for review only): license it and swap the file before going live. */
  { id: 'ppf-hero-v',  src: 'video/ppf-hero-comp-poster.png', widths: [700] },
  /* Hero, round 5 (Fender 06/10: back to the LaFerrari film sweep, with
     the round-3/4 copy layout): GF Williams' LaFerrari, full width. */
  { id: 'ppf-hero',    src: 'drive/04-gfw-red-detail.jpg', widths: [960, 1440, 2048, 2560], q: 54 },
  { id: 'ppf-hero-m',  src: 'drive/04-gfw-red-detail.jpg', crop: { l: .2, t: 0, w: .52, h: 1 }, widths: [480, 720, 1080], q: 54 },
  { id: 'ppf-beads',   src: 'drive-paul/5C4C0AE2-BDFF-4B50-9379-D4BE4FB7A3F1 2.PNG', crop: { l: .2, t: .24, w: .8, h: .375 }, widths: [700, 1100, 1600] },
  { id: 'ppf-door',    src: 'drive/07-ppf-squeegee.png', crop: { l: 0, t: .22, w: 1, h: .5 }, widths: [600, 900, 1086] },
  { id: 'ppf-stretch', src: 'ppf/Paint-Protection-Film-in-Lingfield-Surrey-Miracle-Detail-3.jpg', widths: [600, 900, 1200] },
  { id: 'ppf-lamp',    src: 'ppf/Paint-Protection-Film-in-Lingfield-Surrey-Miracle-Detail.jpg', widths: [600, 900, 1200] },
  { id: 'ppf-edge',    src: 'ppf/PPF-Paint-Protection-Film-in-Lingfield-Surrey-Miracle-DetaiL-6.jpg', widths: [600, 900, 1200] },
  { id: 'fin-gloss',   src: 'finishes/458-gloss.jpg',  widths: [700, 1100, 1600] },
  /* Gloss and matte, round 3 (Fender 06/10: "close on the paint; no
     scratches, PPF does not repair paint"): GF Williams' LaFerrari bonnet.
     Bare = an AI pass made flatter in code (less contrast and colour,
     softer reflections): the depth the film adds. Matte = AI satin. */
  { id: 'fin-bare',    src: 'finishes/laf-bare-final.jpg', widths: [700, 1100, 1600] },
  { id: 'fin-film',    src: 'finishes/laf-gloss.jpg',      widths: [700, 1100, 1600] },
  /* Gloss tab: strip-light reflections, bare (orange peel) vs film. GPT Image 2.5 on Higgsfield from laf-gloss, 08/10. */
  { id: 'fin-led-bare',  src: 'finishes/laf-led-bare.png',  widths: [700, 1024] },
  { id: 'fin-led-gloss', src: 'finishes/laf-led-gloss.png', widths: [700, 1024] },
  { id: 'fin-satin',   src: 'finishes/laf-matte.jpg',      widths: [700, 1100, 1600] },
  { id: 'fin-colour',  src: 'finishes/458-colour.jpg', widths: [700, 1100, 1600] },

  /* Social card */
  /* Reviews ground (Fender 02/10, round 5): GF Williams, water on a
     tail light. Mostly black, so it compresses hard. */
  { id: 'bg-reviews',    src: 'drive/03-gfw-water-beading.jpg', widths: [800, 1400, 2200], q: 46 },
  { id: 'og',            src: 'drive/01-hero-red-supercar-spray.jpg', crop: { l: .04, t: .2, w: .92, h: .7 }, og: true }
].concat(require('./images-pages.js'));

/* Logo: white on transparent, so it keeps its alpha (WebP + PNG).
   'logo' = the script mark only; 'logo-full' adds the tagline.
   Source: logo-bold.png = logo.png with every stroke thickened by about
   4 px of 2000 (Ed 06/10: "make the logo a bit thicker"; a rounded
   dilation of the alpha, so the brush ends stay soft). */
const LOGOS = [
  { id: 'logo',      crop: { top: 0, bottom: 960 }, widths: [240, 360, 480] },
  { id: 'logo-full', crop: { top: 0, bottom: 1414 }, widths: [640, 1200] }
];

/* Logos for the press strip and the makes band (Fender 02/10: the real
   marks, not names). Whatever colour the source, one white mark comes
   out: coloured or dark shapes turn white, white shapes inside them are
   cut out (RTL's letters, the knock-outs in a crest); a logo that is
   already white on transparent keeps its shape. Sources (SVG/PNG/JPEG):
   ../assets-src/logos/press/ and /cars/, licences in SOURCES.md there.
   Writes assets/img/mark-<name>.webp, 120px tall, trimmed. */
const MARK_H = 120;
const LOGO_DIRS = ['press', 'cars', 'films'];

async function whiteMark(file, dest) {
  /* SVGs rasterise at whatever density gives ~2× the final height, so a
     tiny viewBox stays crisp and a huge one stays within limits */
  const meta = await sharp(file, { limitInputPixels: false }).metadata();
  const density = meta.format === 'svg'
    ? Math.max(24, Math.min(2400, Math.round(72 * (MARK_H * 2.5) / Math.min(meta.height, meta.width * 4))))
    : undefined;
  const { data, info } = await sharp(file, { density, limitInputPixels: false })
    .resize({ height: MARK_H * 2, fit: 'inside' })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let opaque = 0, white = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 128) { opaque++; if (Math.min(data[i], data[i + 1], data[i + 2]) > 225) white++; }
  }
  const whiteLogo = opaque && white / opaque > 0.85;
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const m = Math.min(data[i], data[i + 1], data[i + 2]);
    const knock = whiteLogo ? 0 : Math.max(0, Math.min(1, (m - 170) / 65));
    out[i] = out[i + 1] = out[i + 2] = 255;
    out[i + 3] = Math.round(data[i + 3] * (1 - knock));
  }
  const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 }).png().toBuffer();
  const t = await sharp(trimmed).resize({ height: MARK_H }).webp({ quality: 92, alphaQuality: 100 }).toBuffer({ resolveWithObject: true });
  fs.writeFileSync(dest, t.data);
  return { w: t.info.width, h: t.info.height };
}

function cropBox(meta, c) {
  if (!c) return null;
  const left = Math.round(meta.width * c.l), top = Math.round(meta.height * c.t);
  return {
    left, top,
    width: Math.min(meta.width - left, Math.round(meta.width * c.w)),
    height: Math.min(meta.height - top, Math.round(meta.height * c.h))
  };
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const map = fs.existsSync(MAP) && !FORCE ? JSON.parse(fs.readFileSync(MAP, 'utf8')) : {};
  let made = 0;

  for (const img of IMAGES) {
    const file = path.join(SRC, img.src);
    const meta = await sharp(file).metadata();
    const box = cropBox(meta, img.crop) || { left: 0, top: 0, width: meta.width, height: meta.height };
    const base = () => sharp(file).rotate().extract(box).removeAlpha();

    if (img.og) {
      const dest = path.join(OUT, 'og.jpg');
      if (FORCE || !fs.existsSync(dest)) {
        await base().resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 78, mozjpeg: true }).toFile(dest);
        made++;
      }
      continue;
    }

    const widths = img.widths.filter(w => w <= box.width);
    if (!widths.length) widths.push(box.width);
    for (const w of widths) {
      const a = path.join(OUT, `${img.id}-${w}.avif`);
      const b = path.join(OUT, `${img.id}-${w}.webp`);
      if (FORCE || !fs.existsSync(a)) { await base().resize(w).avif({ quality: img.q || 50, effort: 5 }).toFile(a); made++; }
      if (FORCE || !fs.existsSync(b)) { await base().resize(w).webp({ quality: (img.q || 50) + 22, effort: 5 }).toFile(b); made++; }
    }

    /* 24px-wide placeholder, inlined as the frame background: the blur
       is the browser upscaling it, so nothing animates but opacity. */
    const lq = await base().resize(24).webp({ quality: 40 }).toBuffer();
    map[img.id] = {
      w: box.width, h: box.height, widths,
      v: hashOf(path.join(OUT, `${img.id}-${widths[widths.length - 1]}.avif`)),
      lqip: 'data:image/webp;base64,' + lq.toString('base64')
    };
    process.stdout.write('.');
  }

  for (const lg of LOGOS) {
    const file = path.join(SRC, 'logo-bold.png');
    const meta = await sharp(file).metadata();
    /* extract first, then trim in a second pass: sharp runs trim before
       extract inside one pipeline */
    const cut = await sharp(file)
      .extract({ left: 0, top: lg.crop.top, width: meta.width, height: Math.min(meta.height, lg.crop.bottom) - lg.crop.top })
      .png().toBuffer();
    const band = await sharp(cut)
      .trim({ threshold: 1 })
      .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    const bm = await sharp(band).metadata();
    for (const w of lg.widths) {
      const a = path.join(OUT, `${lg.id}-${w}.webp`), b = path.join(OUT, `${lg.id}-${w}.png`);
      if (FORCE || !fs.existsSync(a)) { await sharp(band).resize(w).webp({ quality: 90, alphaQuality: 100 }).toFile(a); made++; }
      if (FORCE || !fs.existsSync(b)) { await sharp(band).resize(w).png({ compressionLevel: 9 }).toFile(b); made++; }
    }
    map[lg.id] = { w: bm.width, h: bm.height, widths: lg.widths, alpha: true };
  }

  for (const dir of LOGO_DIRS) {
    const from = path.join(SRC, 'logos', dir);
    if (!fs.existsSync(from)) continue;
    for (const f of fs.readdirSync(from).filter(n => /\.(svg|png|jpe?g|webp)$/i.test(n))) {
      const name = f.replace(/\.(svg|png|jpe?g|webp)$/i, '');
      const dest = path.join(OUT, `mark-${name}.webp`);
      if (FORCE || !fs.existsSync(dest) || !map[`mark-${name}`]) {
        map[`mark-${name}`] = Object.assign(await whiteMark(path.join(from, f), dest), { mark: true });
        made++;
      }
      map[`mark-${name}`].v = hashOf(dest);
    }
  }

  fs.writeFileSync(MAP, JSON.stringify(map, null, 1) + '\n');
  const bytes = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`\n${made} file(s) written · ${Object.keys(map).length} images · assets/img ${(bytes / 1048576).toFixed(1)} MB`);
}

run().catch(e => { console.error(e); process.exit(1); });
