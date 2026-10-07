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
    return (Array.isArray(mod) ? mod : [mod]).map(p => (typeof p === 'function' ? p(site) : p))
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
const version = Date.now().toString(36);
const jsonld = o => JSON.stringify(o).replace(/</g, '\\u003c');
const abs = href => site.origin + (href.startsWith('/') ? href : '/' + href);
const written = [];

/* LCP preload, one tag per art-direction band: page.preload =
   [{ id, media, sizes }]. */
/* Videos get the same ?v= content hash as images, for the same reason. */
function versionVideos(html) {
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
    ogImage: abs('/assets/img/og.jpg'),
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

fs.writeFileSync(path.join(ROOT, '_redirects'), [
  '# Old site (miracledetail.co.uk): pages that merge into another (PLAN.md §5.3).',
  '# 06/10: only the v0.5 pages are rebuilt, so the area pages land on the',
  '# homepage (coverage + booking) and the 153 project pages on the gallery.',
  '/surrey-car-detailing/            /                               301',
  '/sussex-car-detailing/            /                               301',
  '/kent-car-detailing/              /                               301',
  '/london-car-detailing/            /                               301',
  '/essex-car-detailing/             /                               301',
  '/hampshire-car-detailing/         /                               301',
  '/hertfordshire-car-detailing/     /                               301',
  '/oxfordshire-car-detailing/       /                               301',
  '/buckinghamshire-car-detailing/   /                               301',
  '/contact-us/                      /#book                          301',
  '/studio-car-valeting/             /car-detailing-studio/          301',
  '/car-detail-faqs/                 /car-detailing-studio/          301',
  '/after-care-with-feynlab/         /aftercare-washing-guide/       301',
  '/videos/                          /car-detail-gallery/            301',
  '/blog/                            /journal/                       301',
  '/category/uncategorized/          /journal/                       301',
  '/facebook-competition/            /journal/                       301',
  '/new-product-launch/              /ceramic-coatings/              301',
  '/gallery/:job/                    /car-detail-gallery/?job=:job   301',
  '/gallery/                         /car-detail-gallery/            301',
  '/vehiclemake/:make/               /car-detail-gallery/?make=:make 301',
  '',
  '# v0.5 staging slugs (WordPress) -> the kept old-site slugs',
  '/paint-correction/                /paint-correction-and-polishing/       301',
  '/paint-protection-film/           /paint-protection-film-ppf/            301',
  '/dry-ice-cleaning/                /dry-ice-blasting-and-laser-cleaning/  301',
  '/window-tinting-protection/       /window-tinting/                       301',
  '/bodyshop-paint-repair/           /bodyshop-repair/                      301',
  '/mobile-detailing/                /mobile-car-detailing/                 301',
  '/packages/                        /car-detailing-studio/                 301',
  '/about-paul/                      /about-paul-dalton-car-detailing/      301',
  '/services/                        /car-care-services/                    301',
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
