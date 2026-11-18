/* og.js — one share image (Facebook, WhatsApp, LinkedIn, X) per page, 18/11.
   Reads the BUILT pages, takes each page's hero photo (the
   fetchpriority="high" <img>, largest width in its srcset) and crops it to
   1200x630 at assets/img/og/<key>.jpg (key = slug, 'home' for /).
   The crop follows the hero's desktop focus (--dpos) when the page sets one.
   build.js uses og/<key>.jpg when it exists, else the site-wide og.jpg;
   an image chosen in the CMS (seo.ogImage) still wins over both.

   Run after a build, then build again so the pages point at the new files:
     node build.js && node tools/og.js && node build.js
   Existing files are kept; --force remakes them all, --only=<key,...> some. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'img', 'og');
const FORCE = process.argv.includes('--force');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const W = 1200, H = 630;
const SKIP = new Set(['review', 'node_modules', 'assets', 'src', 'tools', 'content']);

function pages() {
  const list = [{ key: 'home', file: path.join(ROOT, 'index.html') }];
  for (const d of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!d.isDirectory() || SKIP.has(d.name) || d.name.startsWith('.')) continue;
    const f = path.join(ROOT, d.name, 'index.html');
    if (fs.existsSync(f)) list.push({ key: d.name, file: f });
  }
  return list;
}

const pct = v => Math.min(100, Math.max(0, parseFloat(v))) / 100;

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let made = 0;
  for (const { key, file } of pages()) {
    if (ONLY.length && !ONLY.includes(key)) continue;
    const dest = path.join(OUT, `${key}.jpg`);
    if (!FORCE && fs.existsSync(dest)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const img = (html.match(/<img[^>]*fetchpriority="high"[^>]*>/) || html.match(/<main[\s\S]*?(<img[^>]*>)/) || [])[0];
    const m = img && (img.match(/srcset="([^"]+)"/) || img.match(/src="([^"]+)"/));
    if (!m) { console.warn(`  ${key}: no hero image, keeps og.jpg`); continue; }
    const best = m[1].split(',').map(s => s.trim().split(/\s+/))
      .map(([u, w]) => ({ u: u.split('?')[0], w: parseInt(w, 10) || 0 }))
      .sort((a, b) => b.w - a.w)[0];
    const src = path.join(ROOT, best.u.replace(/^\//, ''));
    if (!fs.existsSync(src)) { console.warn(`  ${key}: ${best.u} missing, keeps og.jpg`); continue; }

    const dpos = (html.match(/--dpos:\s*([\d.]+)%\s+([\d.]+)%/) || []);
    const fx = dpos[1] ? pct(dpos[1]) : 0.5, fy = dpos[2] ? pct(dpos[2]) : 0.4;
    const meta = await sharp(src).metadata();
    const scale = Math.max(W / meta.width, H / meta.height);
    const rw = Math.round(meta.width * scale), rh = Math.round(meta.height * scale);
    await sharp(src).resize(rw, rh)
      .extract({ left: Math.round((rw - W) * fx), top: Math.round((rh - H) * fy), width: W, height: H })
      .jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
    made++;
    console.log(`  ${key}: ${best.u} (${meta.width}x${meta.height}, focus ${Math.round(fx * 100)}% ${Math.round(fy * 100)}%)`);
  }
  console.log(`og: ${made} made in assets/img/og/`);
}
main().catch(e => { console.error(e); process.exit(1); });
