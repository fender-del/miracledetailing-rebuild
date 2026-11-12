/* ============================================================
   Build: src/ -> a static site (DMI-2026 toolchain, Miracle blocks).

   One page = one file in src/pages/. One block = one .html + .css
   pair in src/blocks/ — still standalone on disk, which is what the
   WordPress template-parts get cut from later.

   Header, footer, sticky bar, form and schema read src/site.js, so
   NAP, prices and nav live in one place.

     node build.js              build every page + CSS + JS bundle
     node build.js --no-minify  readable CSS/JS for debugging
     node tools/images.js       (re)encode photos -> assets/img
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const BLOCKS = path.join(SRC, 'blocks');
const PAGES = path.join(SRC, 'pages');
const MINIFY = !process.argv.includes('--no-minify');

if (!fs.existsSync(BLOCKS)) {
  console.log('no src/blocks — using the committed HTML and assets/');
  process.exit(0);
}

const { render } = require('./src/lib/render.js');
const { images } = require('./src/lib/pic.js');
const site = require('./src/site.js');

const CHROME_TOP = new Set(['01-header']);
const CHROME_BOTTOM = new Set(['13-footer', '14-sticky']);
const read = f => fs.readFileSync(f, 'utf8');
const blockHtml = n => path.join(BLOCKS, n + '.html');
const blockCss = n => path.join(BLOCKS, n + '.css');
const gzKB = s => (zlib.gzipSync(s).length / 1024).toFixed(1);

/* ---------- Page map ---------- */
const pages = fs.readdirSync(PAGES).filter(f => f.endsWith('.js')).sort()
  .flatMap(f => {
    const mod = require(path.join(PAGES, f));
    return (Array.isArray(mod) ? mod : [mod])/* a page file may return several pages (07/10: the journal and its posts) */
      .flatMap(p => (typeof p === 'function' ? p(site) : p))
      .map(p => Object.assign({ _from: f }, p));
  });

const used = new Set();
for (const p of pages) {
  if (typeof p.slug !== 'string') throw new Error(`${p._from}: page needs a slug ('' for home)`);
  if (!p.title || !p.description) throw new Error(`/${p.slug}: title and description are required`);
  /* a block is a name, or { block, with } to use one block twice on a
     page with its own data (06/10: the long v0.5 pages repeat shapes) */
  p.blocks = p.blocks.map(b => (typeof b === 'string' ? { block: b } : b));
  for (const { block: b } of p.blocks) {
    if (!fs.existsSync(blockHtml(b))) throw new Error(`/${p.slug}: no such block '${b}'`);
    used.add(b);
  }
}

/* ---------- Per-page SEO from the CMS (11/11) ----------
   content/pages/<slug or home>.json = { seo: { title, description,
   ogImage: { src, alt }, noindex } }, edited in the DMI CMS by Paul or
   the SEO person. A value set there wins over the page file's own
   title/description; an empty one keeps the page file's. A new page
   with no content file still builds, but the CMS can't edit it yet:
   `node tools/cms-pages.js` adds the file and the CMS schema entry. */
const CONTENT = path.join(ROOT, 'content');
const pageKey = p => (p.slug ? p.slug.replace(/\/+$/, '') : 'home');
const noSeo = [];
for (const p of pages) {
  const f = path.join(CONTENT, 'pages', pageKey(p) + '.json');
  if (!fs.existsSync(f)) { noSeo.push('/' + p.slug); continue; }
  const seo = JSON.parse(read(f)).seo || {};
  if (seo.title && seo.title.trim()) p.title = seo.title.trim();
  if (seo.description && seo.description.trim()) p.description = seo.description.trim();
  if (seo.ogImage && seo.ogImage.src && seo.ogImage.src.trim()) p.ogImage = seo.ogImage.src.trim();
  if (typeof seo.noindex === 'boolean') p.noindex = seo.noindex;
}
if (noSeo.length) console.log(`no CMS content file for ${noSeo.join(', ')} (run node tools/cms-pages.js)`);

/* ---------- CSS ----------
   Each page inlines tokens + base + only the blocks it uses (06/10: the
   service pages brought their own blocks; the homepage should not carry
   them). assets/css/site.css = every used block, for the <link> option. */
/* 02-fx.css = the shared scroll kit (07/10, PLAN-interactions §1): small,
   and any page may use any of it, so it rides with the base */
const base = ['00-tokens.css', '01-base.css', '02-fx.css'].map(f => read(path.join(SRC, f))).join('\n');

/* Conservative: comments, whitespace, last semicolons. Refuses to ship
   if the declaration count changes (DMI-2026 rule). */
const declCount = s => (s.replace(/\/\*[\s\S]*?\*\//g, '').match(/:/g) || []).length;
function minifyCss(src) {
  const out = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .replace(/\n/g, '')
    .trim();
  if (declCount(out) !== declCount(src)) throw new Error('minifyCss changed the declaration count — refusing to ship it');
  return out;
}
/* The logo rides inside the CSS as a data URI (8 KB): header, menu and
   preloader paint it on first frame with no extra request. */
const logoUri = 'data:image/webp;base64,' + fs.readFileSync(path.join(ROOT, 'assets/img/logo-360.webp')).toString('base64');
function cssFor(blocks) {
  let c = base;
  for (const b of [...new Set(blocks)].sort().filter(b => fs.existsSync(blockCss(b)))) c += `\n\n/* ==== ${b} ==== */\n` + read(blockCss(b));
  if (MINIFY) c = minifyCss(c);
  return c.split('__LOGO__').join(logoUri);
}
const css = cssFor([...used]);
const cssBlocks = [...used].filter(b => fs.existsSync(blockCss(b)));
fs.mkdirSync(path.join(ROOT, 'assets/css'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets/css/site.css'), css);

/* ---------- JS: motion modules + GSAP + Lenis, one deferred file ---------- */
let jsBytes = null;
try {
  require('esbuild').buildSync({
    entryPoints: [path.join(SRC, 'motion/index.js')],
    bundle: true, minify: MINIFY, format: 'iife', target: ['es2019'],
    outfile: path.join(ROOT, 'assets/js/site.js'), legalComments: 'none', logLevel: 'warning'
  });
  jsBytes = read(path.join(ROOT, 'assets/js/site.js'));
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') console.log('esbuild not installed — keeping the committed assets/js/site.js');
  else throw e;
}

/* ---------- Favicon ---------- */
fs.writeFileSync(path.join(ROOT, 'assets/img/favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#111"/>'
  + '<path d="M14 46 22 18h7l3 14 9-14h7l-8 28h-6l5-17-10 15h-4l-3-15-5 17z" fill="#C9A84D"/></svg>\n');

/* ---------- Pages ---------- */
const shell = read(path.join(SRC, 'shell.html'));
/* BUILD_VERSION: fixed cache-buster for reproducible builds (CMS byte checks); default = build time */
const version = process.env.BUILD_VERSION || Date.now().toString(36);
const jsonld = o => JSON.stringify(o).replace(/</g, '\\u003c');
const abs = href => site.origin + (href.startsWith('/') ? href : '/' + href);
const written = [];

/* LCP preload, one tag per art-direction band: page.preload =
   [{ id, media, sizes }]. */
/* Videos get the same ?v= content hash as images, for the same reason. */
function versionVideos(html) {
  /* 07/10: also any image a block names by hand (the dry ice still) */
  html = html.replace(/\/assets\/img\/([\w.-]+\.(?:webp|png|jpg))(?![?\w.-])/g, (m, f) => {
    const file = path.join(ROOT, 'assets', 'img', f);
    if (!fs.existsSync(file)) return m;
    return `${m}?v=${require('crypto').createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8)}`;
  });
  return html.replace(/\/assets\/video\/([\w.-]+\.mp4)/g, (m, f) => {
    const file = path.join(ROOT, 'assets', 'video', f);
    if (!fs.existsSync(file)) return m;
    return `${m}?v=${require('crypto').createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8)}`;
  });
}

function preloadTags(list) {
  if (!list) return '';
  const set = id => images[id].widths.map(w => `/assets/img/${id}-${w}.avif${images[id].v ? `?v=${images[id].v}` : ''} ${w}w`).join(', ');
  return list.map(p => `<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="${p.media}" imagesrcset="${set(p.id)}" imagesizes="${p.sizes}">`).join('\n');
}

for (const page of pages) {
  const out = page.slug ? `${page.slug}/index.html` : 'index.html';
  const url = page.slug ? `/${page.slug.replace(/\/*$/, '/')}` : '/';
  const ctx = Object.assign({ site, year: new Date().getFullYear(), page }, page.data || {});

  const rendered = page.blocks.map(({ block: b, with: w }) => ({ name: b, html: render(read(blockHtml(b)), w ? Object.assign({}, ctx, w) : ctx, b).trimEnd() }));
  const firstMain = rendered.findIndex(r => !CHROME_TOP.has(r.name));
  const afterMain = rendered.findIndex(r => CHROME_BOTTOM.has(r.name));
  let html = '';
  rendered.forEach((r, i) => {
    if (i === firstMain) html += '\n<main id="main" tabindex="-1">\n';
    if (i === afterMain) html += '\n</main>\n';
    html += '\n' + r.html + '\n';
  });
  if (afterMain === -1) html += '\n</main>\n';

  const body = render(shell, Object.assign({}, ctx, {
    title: page.title,
    description: page.description,
    canonical: abs(url),
    robots: site.preview || page.noindex ? 'noindex,nofollow' : null,
    ogImage: abs(page.ogImage || '/assets/img/og.jpg'),
    preload: preloadTags(page.preload),
    /* Inline the page's own CSS (one round trip saved). Flip to the
       <link> once returning visitors matter more than first paint. */
    styles: page.inlineCss === false
      ? `<link rel="stylesheet" href="/assets/css/site.css?v=${version}">`
      : `<style>${cssFor(page.blocks.map(b => b.block))}</style>`,
    schema: (page.schema || []).map(jsonld),
    v: version,
    BLOCKS: html.trim()
  }), 'shell.html');

  const dest = path.join(ROOT, out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, versionVideos(body));
  written.push({ url, out, kb: (body.length / 1024).toFixed(0), gz: gzKB(body) });
}

/* ---------- Netlify: noindex while this is a demo, old-site 301s ---------- */
fs.writeFileSync(path.join(ROOT, 'netlify.toml'), [
  '# Generated by build.js. The site ships built (index.html + assets/),',
  '# so Netlify runs no build step: the deploy zip has no build.js.',
  '[build]',
  '  publish = "."',
  '',
  site.preview ? '# Demo: keep it out of the index (remove at launch)\n[[headers]]\n  for = "/*"\n  [headers.values]\n    X-Robots-Tag = "noindex, nofollow"\n' : '',
  '[[headers]]',
  '  for = "/assets/*"',
  '  [headers.values]',
  '    Cache-Control = "public, max-age=31536000, immutable"',
  ''
].join('\n'));

/* Cloudflare Pages ignores netlify.toml: same headers in its _headers file */
fs.writeFileSync(path.join(ROOT, '_headers'), [
  '# Generated by build.js (Cloudflare Pages). Mirrors netlify.toml.',
  site.preview ? '/*\n  X-Robots-Tag: noindex, nofollow\n' : '',
  '/assets/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  ''
].join('\n'));

/* Old-site 301s. Cloudflare reads _redirects top down and takes the first
   match, so every fixed line sits above the :param lines. Each fixed rule
   is written twice, with and without the closing slash, so an old link
   typed without it still lands in one hop. Check them all with
   tools/check-old-urls.js (list: tools/old-urls.txt). */
const GAL = '/car-detail-gallery/';
const R = (title, rules) => ({ title, rules });
const redirectGroups = [
  R('Old site (miracledetail.co.uk): pages that merge into another (PLAN.md §5.3).\n' +
    '# 12/11: the nine area pages land on the homepage Coverage block (#visit).', [
    ['/surrey-car-detailing/', '/#visit'],
    ['/sussex-car-detailing/', '/#visit'],
    ['/kent-car-detailing/', '/#visit'],
    ['/london-car-detailing/', '/#visit'],
    ['/essex-car-detailing/', '/#visit'],
    ['/hampshire-car-detailing/', '/#visit'],
    ['/hertfordshire-car-detailing/', '/#visit'],
    ['/oxfordshire-car-detailing/', '/#visit'],
    ['/buckinghamshire-car-detailing/', '/#visit'],
    ['/contact-us/', '/#book'],
    ['/studio-car-valeting/', '/car-detailing-studio/'],
    ['/after-care-with-feynlab/', '/aftercare-washing-guide/'],
    ['/videos/', GAL],
    ['/blog/', '/journal/'],
    ['/category/uncategorized/', '/journal/'],
    ['/car-audio-installation-fabrication-pssound/', '/car-care-services/']
  ]),
  R('Older URLs (Google site: search, Wayback Machine): the nearest page', [
    ['/car-detailer-surrey/', '/#visit'],
    ['/car-detailer-sussex/', '/#visit'],
    ['/car-detailer-services-in-petworth/', '/#visit'],
    ['/car-detailing-services-goodwood/', '/#visit'],
    ['/car-detailing-services-chelsea-london-hastings-kent/', '/#visit'],
    ['/contact/', '/#book'],
    ['/about/', '/about-paul-dalton-car-detailing/'],
    ['/paul-dalton/', '/about-paul-dalton-car-detailing/'],
    ['/events/', '/about-paul-dalton-car-detailing/'],
    ['/car-show-appearances/', '/about-paul-dalton-car-detailing/'],
    ['/car-show-appearances-detail/', '/about-paul-dalton-car-detailing/'],
    ['/miracle-presents-a-trip-through-time/', '/about-paul-dalton-car-detailing/'],
    ['/faq/', '/car-detail-faqs/'],
    ['/car-detailing-gallery/', GAL],
    ['/car-detail-studio/', '/car-detailing-studio/'],
    ['/car-detailing-studio-old/', '/car-detailing-studio/'],
    ['/car-detailing/', '/car-care-services/'],
    ['/car-detailing-services/', '/car-care-services/'],
    ['/car-detail-treatments/', '/car-care-services/'],
    ['/premium-car-detailing/', '/car-care-services/'],
    ['/car-detail-training/', '/car-care-services/'],
    ['/collect-detail-service/', '/car-care-services/'],
    ['/car-paintwork-restoration/', '/paint-correction-and-polishing/'],
    ['/glass-ceramic-nano-coatings/', '/ceramic-coatings/'],
    ['/interior-valeting/', '/interior-detailing/'],
    ['/interior-other/', '/interior-detailing/'],
    ['/mobile-vehicle-detailing/', '/mobile-car-detailing/'],
    ['/mobile-car-detailing-blog/', '/mobile-car-detailing/'],
    ['/new-car-detail/', '/new-car-detail-protection/'],
    ['/wrap-it-up-the-ultimate-guide-to-choosing-the-perfect-car-wrap/', '/paint-protection-film-ppf/'],
    ['/after-care-with-labocosmetica/', '/aftercare-washing-guide/'],
    ['/washing-procedures-for-modesta-coatings/', '/aftercare-washing-guide/'],
    ['/pd-shampoo-the-worlds-best-car-shampoo/', '/aftercare-washing-guide/'],
    ['/swissvax-episode-1-washing-how-to-series-car-detailing-with-paul-dalton-from-miracle-detail-uk/', '/aftercare-washing-guide/'],
    ['/swissvax-episode-4-quick-detailing-with-paul-dalton-miracle-detail-uk/', '/aftercare-washing-guide/'],
    ['/qs-tuning-cost-me-40k/', '/journal/'],
    ['/qs-tuning-picking-up-my-destroyed-vehicle/', '/journal/'],
    // old blog posts about one car: that make in the gallery
    ['/1965-mk-1-austin-cooper-s-miracle-detail-featuring-frank-the-french-bulldog/', GAL + '?make=mini'],
    ['/mini-restoration-and-miracle-detail-finishes-it-off/', GAL + '?make=mini'],
    ['/3000-mile-road-trip-uk-to-portugal-to-detail-a-ferrari-tdf-porsche-gtrs4-0-and-ferrari-599gto/', GAL + '?make=ferrari'],
    ['/aston-martin-vantage-4-day-detailing-results/', GAL + '?make=aston-martin'],
    ['/audi-r8-v10-spyder/', GAL + '?make=audi'],
    ['/bmw-m4-in-porsche-speed-yellow-with-modesta-bc08-coating-applied/', GAL + '?make=bmw'],
    ['/bmw-z4-gets-modesta-coating/', GAL + '?make=bmw'],
    ['/ford-mustang-coated-with-modesta/', GAL + '?make=ford'],
    ['/jaguar-xkr-convertible-full-detail-repaint/', GAL + '?make=jaguar'],
    ['/maserati-coated-with-modesta-now-onto-interior-detail-and-windows/', GAL + '?make=maserati'],
    ['/mercedes-s600-100-hour-resto-wet-sand-detail/', GAL + '?make=mercedes-benz'],
    ['/mercedes-s600-paint-job-and-detail/', GAL + '?make=mercedes-benz'],
    ['/miracle-detail-mercedes-s600-wins-every-competition/', GAL + '?make=mercedes-benz'],
    // the old shop and form pages
    ['/basket/', '/'],
    ['/my-account/', '/'],
    ['/products/', '/'],
    ['/thank-you/', '/']
  ]),
  R('Gallery: 150 of the 153 old jobs are in the new gallery; the three missing\n' +
    '# (one photo or none on the old site) go to their make. Then the old make\n' +
    '# slugs that differ from the new filter keys.', [
    ['/gallery/ford-focus-rs/', GAL + '?make=ford'],
    ['/gallery/bmw-3-series/', GAL + '?make=bmw'],
    ['/gallery/1992-porsche-964-turbo-midnight-blue/', GAL + '?make=porsche'],
    ['/vehiclemake/mercedes/', GAL + '?make=mercedes-benz'],
    ['/vehiclemake/vw/', GAL + '?make=volkswagen'],
    ['/gallery/', GAL],
    ['/vehiclemake/', GAL],
    ['/vehiclecolour/', GAL]
  ]),
  R('v0.5 staging slugs (WordPress) -> the kept old-site slugs', [
    ['/paint-correction/', '/paint-correction-and-polishing/'],
    ['/paint-protection-film/', '/paint-protection-film-ppf/'],
    ['/dry-ice-cleaning/', '/dry-ice-blasting-and-laser-cleaning/'],
    ['/window-tinting-protection/', '/window-tinting/'],
    ['/bodyshop-paint-repair/', '/bodyshop-repair/'],
    ['/mobile-detailing/', '/mobile-car-detailing/'],
    ['/packages/', '/car-detailing-studio/'],
    ['/about-paul/', '/about-paul-dalton-car-detailing/'],
    ['/services/', '/car-care-services/']
  ])
];
/* :param rules last (a fixed line above always wins) */
const paramRules = [
  ['/gallery/:job/', GAL + '?job=:job'],
  ['/vehiclemake/:make/', GAL + '?make=:make'],
  ['/vehiclecolour/:colour/', GAL]
];
/* Pages that exist: their no-slash form, in one 301 (not the asset
   server's 307). Read off the built pages. */
const keptPages = written.map(w => w.url).filter(u => u !== '/' && u.endsWith('/'));
const line = (from, to) => `${from.padEnd(50)} ${to.padEnd(46)} 301`;
const both = ([from, to]) => from.endsWith('/') && from !== '/'
  ? [line(from, to), line(from.slice(0, -1), to)] : [line(from, to)];
fs.writeFileSync(path.join(ROOT, '_redirects'), [
  '# Generated by build.js. Edit the lists there, not this file.',
  ...redirectGroups.flatMap(g => ['', '# ' + g.title, ...g.rules.flatMap(both)]),
  '',
  '# Pages that exist, typed without the closing slash',
  ...keptPages.map(u => line(u.slice(0, -1), u)),
  '',
  '# :param rules last',
  ...paramRules.flatMap(both),
  ''
].join('\n'));

fs.writeFileSync(path.join(ROOT, 'robots.txt'), site.preview
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);

/* ---------- Report ---------- */
console.log(`built ${written.length} page(s):`);
written.forEach(w => console.log(`  ${w.url.padEnd(42)} ${w.kb}KB (${w.gz}KB gz)  ${w.out}`));
console.log(`css (all blocks) ${(css.length / 1024).toFixed(0)}KB (${gzKB(css)}KB gz) from ${cssBlocks.length} blocks; each page inlines its own`);
if (jsBytes) console.log(`js  ${(jsBytes.length / 1024).toFixed(0)}KB (${gzKB(jsBytes)}KB gz)`);
