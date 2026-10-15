/* ============================================================
   review/paul-board/capture.js — photographs every page of the
   local site (computer 1440 + phone 390, reduced motion so every
   block sits still and complete) and records where each piece of
   text and each photo sits, for the review board Paul comments on.

     node review/paul-board/capture.js [slug,slug...]

   Needs the preview server on :8765 (launch "miracle-site").
   Writes review/paul-board/out/{shots,data}/.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const SITE = path.resolve(__dirname, '../../site');
const puppeteer = require(path.join(SITE, 'node_modules/puppeteer-core'));
const sharp = require(path.join(SITE, 'node_modules/sharp'));
const PAGES = require('./pages');

const BASE = 'http://localhost:8765/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = path.join(__dirname, 'out');
const ONLY = process.argv[2] ? process.argv[2].split(',') : null;

const VIEWS = {
  d: { vp: { width: 1440, height: 900, deviceScaleFactor: 1 }, keep: 1, tile: 2400, thumb: 240 },
  m: { vp: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, keep: 1.5, tile: 3000, thumb: 120 }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* Runs inside the page: every text block and every picture, with its
   place on the page in CSS pixels. */
function survey() {
  const PRIMARY = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd,td,th,label,summary,caption,legend,option';
  const SKIP = 'script,style,noscript,template,head,title';
  const sy = window.scrollY;
  const owner = node => {
    let el = node.nodeType === 1 ? node : node.parentElement;
    for (let e = el; e && e !== document.body; e = e.parentElement) if (e.matches(PRIMARY)) return e;
    for (let e = el; e && e !== document.body; e = e.parentElement) if (e.matches('a,button')) return e;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const d = getComputedStyle(e).display;
      if (!/^(inline|contents)/.test(d)) return e;
    }
    return el;
  };
  const shown = el => el.getClientRects().length > 0 &&
    el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true });

  /* sections: named blocks of main, plus header and footer */
  const secEls = [];
  const secs = [];
  const addSec = (el, name, label) => {
    const r = el.getBoundingClientRect();
    secEls.push(el);
    secs.push({ name, label: label.replace(/\s+/g, ' ').trim().slice(0, 70), y: Math.round(r.top + sy) });
  };
  const hd = document.querySelector('header');
  if (hd) addSec(hd, 'header', 'Header (on every page)');
  document.querySelectorAll('main section[data-section], main > section').forEach(s => {
    if (secEls.includes(s)) return;
    const h = s.querySelector('h1,h2,h3');
    addSec(s, s.dataset.section || 'section', h ? h.textContent : (s.dataset.section || 'Section'));
  });
  const ft = document.querySelector('footer');
  if (ft) addSec(ft, 'footer', 'Footer (on every page)');
  const secOf = el => {
    let best = -1;
    secEls.forEach((s, i) => { if (s.contains(el)) best = i; });
    return best;
  };

  /* text */
  const groups = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === 1) {
      if (n.matches(SKIP)) { /* skip subtree */
        let nx = n; while (nx && !nx.nextSibling) nx = nx.parentNode; if (!nx) break;
        walker.currentNode = nx; continue;
      }
      if (n.tagName === 'BR') { const o = owner(n); if (groups.has(o)) groups.get(o).push('\n'); }
      continue;
    }
    if (!n.nodeValue.trim()) continue;
    if (n.parentElement.closest(SKIP + ',svg defs,[aria-hidden="true"],.skip,.skip-link')) continue;
    const o = owner(n);
    if (!groups.has(o)) groups.set(o, []);
    const g = groups.get(o), pe = n.parentElement;
    /* words in separate boxes (a numeral, a name, a price) get a line each */
    if (g.length && g.lastEl !== pe && !/\s$/.test(g[g.length - 1]) && !/^\s/.test(n.nodeValue) &&
        (!/^inline$/.test(getComputedStyle(pe).display) || (g.lastEl && !/^inline$/.test(getComputedStyle(g.lastEl).display)))) g.push('\n');
    g.lastEl = pe;
    g.push(n.nodeValue);
  }
  const items = [];
  for (const [el, parts] of groups) {
    const t = parts.join('').replace(/[ \t\r\f\v\u00a0]+/g, ' ').replace(/ *\n */g, '\n').trim();
    if (!t || !/[A-Za-z0-9£%]/.test(t)) continue;
    const r = el.getBoundingClientRect();
    const vis = shown(el) && r.width > 2 && r.height > 2 && r.bottom + sy > 0;
    if (!vis && (r.width <= 2 || r.height <= 2) && el.closest('.sr,.sr-only,.visually-hidden')) continue;
    items.push({ k: 't', t, v: vis ? 1 : 0, x: Math.round(r.left), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height), s: secOf(el), tag: el.tagName.toLowerCase() });
  }

  /* pictures */
  const name = u => {
    const f = decodeURIComponent(String(u).split('?')[0].split('/').pop() || '');
    return f.replace(/-(\d{2,4})w?(?=\.)/, '').replace(/\.(avif|webp|jpe?g|png|svg|gif)$/i, '');
  };
  const seen = new Set();
  document.querySelectorAll('body *').forEach(el => {
    if (el.closest('header nav li, .sr')) return;
    let src = null, kind = 'photo';
    if (el.tagName === 'IMG') {
      src = el.currentSrc || el.src;
      if (/^data:/.test(src)) src = (el.getAttribute('srcset') || el.dataset.srcset || el.dataset.src || '').split(/[\s,]/)[0] || null;
    }
    else if (el.tagName === 'VIDEO') { src = el.poster || (el.querySelector('source') || {}).src || el.currentSrc; kind = 'video'; }
    else if (el.tagName === 'CANVAS') { src = 'drawing'; kind = 'drawing'; }
    else {
      const bg = getComputedStyle(el).backgroundImage;
      const m = bg && bg !== 'none' && bg.match(/url\(["']?([^"')]+)/);
      if (m && !/^data:/.test(m[1])) src = m[1];
    }
    if (!src) return;
    const r = el.getBoundingClientRect();
    if (r.width < 60 || r.height < 40) return;
    const key = [Math.round(r.left), Math.round(r.top + sy), Math.round(r.width), Math.round(r.height)].join();
    if (seen.has(key)) return;
    seen.add(key);
    const vis = shown(el);
    if (!vis) return;
    items.push({ k: 'i', kind, src: kind === 'drawing' ? '' : name(src), alt: (el.getAttribute('alt') || '').trim().slice(0, 140), v: 1, x: Math.round(r.left), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height), s: secOf(el) });
  });

  /* a hidden copy of text that is also on show (phone menu, repeated
     labels) is noise: keep the one Paul can see */
  const visibleTexts = new Set(items.filter(i => i.k === 't' && i.v).map(i => i.t));
  const seenHidden = new Set();
  const kept = items.filter(i => {
    if (i.k !== 't' || i.v) return true;
    if (visibleTexts.has(i.t) || seenHidden.has(i.t)) return false;
    seenHidden.add(i.t);
    return true;
  });
  return {
    w: document.documentElement.clientWidth,
    h: document.documentElement.scrollHeight,
    title: document.title,
    sections: secs,
    items: kept
  };
}

/* fallback for a page whose long bands hang Chrome (About's timeline):
   scroll a screen at a time and stack the screens; the fixed header
   is hidden after the first band so it is not repeated */
async function scrollBand(page, y, h, w, vh, dpr, i) {
  if (i === 1) await page.addStyleTag({ content: 'header,.hd,[class*=sticky]{visibility:hidden!important}' });
  const parts = [];
  for (let sub = y; sub < y + h; sub += vh) {
    const real = await page.evaluate(v => { window.scrollTo(0, v); return window.scrollY; }, sub);
    await sleep(260);
    const shot = await page.screenshot({ type: 'png' });
    const off = Math.round((sub - real) * dpr), take = Math.round(Math.min(vh, y + h - sub) * dpr);
    parts.push(await sharp(shot).extract({ left: 0, top: off, width: Math.round(w * dpr), height: Math.min(take, Math.round(vh * dpr) - off) }).png().toBuffer({ resolveWithObject: true }));
  }
  const H = parts.reduce((a, p) => a + p.info.height, 0);
  let t = 0;
  return sharp({ create: { width: Math.round(w * dpr), height: H, channels: 3, background: '#111' } })
    .composite(parts.map(p => { const c = { input: p.data, top: t, left: 0 }; t += p.info.height; return c; })).png().toBuffer();
}

/* ---------- blocks that change when clicked or swiped ----------
   Tabs, choosers, before/after jobs, "What's included" sheets and
   swipe rows: each other look of the block is photographed on its own
   ("states"), so the board can show it over the page. */
const SKIP_SECTIONS = /^(gallery|check)$/;
const SKIP_LABEL = /^(Read (more|less)|Copy code|Hold here|Previous|Next|Step \d+ done)/i;

function markControls(SKIP_SECTIONS_SRC, SKIP_LABEL_SRC) {
  const skipSec = new RegExp(SKIP_SECTIONS_SRC), skipLab = new RegExp(SKIP_LABEL_SRC, 'i');
  const secs = Array.from(document.querySelectorAll('main section[data-section], main > section'));
  const groups = [];
  const label = el => {
    const raw = (el.getAttribute('aria-label') || el.innerText || el.textContent || '').trim();
    let t = raw.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 2).join(' · ').replace(/\s+/g, ' ').slice(0, 48);
    if (t.length < 6) { /* a bare numeral: take the whole button's words */
      const all = (el.getAttribute('title') || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (all.length > t.length) t = all.replace(/^([IVX]+)(?=[A-Z])/, '$1 · ').slice(0, 48);
    }
    if (t.length > 5 && !/[a-z]/.test(t)) t = t.charAt(0) + t.slice(1).toLowerCase(); /* WHAT’S INCLUDED → What’s included */
    /* a button that only says "What's included" or "Details" is named after its card */
    if (/^(what.s included|details|read step)/i.test(t)) {
      const card = el.closest('li,article,[data-sheet-card]');
      const name = card && card.querySelector('h3,h4,[data-sheet-name]');
      if (name) t = name.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) + ' · ' + t.replace(/:.*$/, '');
    }
    return t;
  };
  secs.forEach(s => {
    if (skipSec.test(s.dataset.section || '')) return;
    const r = s.getBoundingClientRect();
    if (r.height < 40) return;
    const ctl = Array.from(new Set(s.querySelectorAll('button,[role=tab],[aria-pressed],[aria-controls],[data-sheet-open]'))).filter(e => {
      const b = e.getBoundingClientRect();
      if (!b.width || !b.height || e.closest('form,[hidden]')) return false;
      if (e.type === 'submit' || e.closest('a[href]:not([href^="#"])')) return false;
      return !skipLab.test(label(e)) && !skipLab.test(e.getAttribute('aria-label') || '');
    });
    const scrollers = Array.from(s.querySelectorAll('*')).filter(e => {
      const cs = getComputedStyle(e);
      return /(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 40 && e.clientWidth > 120 && e.getBoundingClientRect().height > 60;
    }).filter((e, i, arr) => !arr.some(o => o !== e && o.contains(e)));
    if (!ctl.length && !scrollers.length) return;
    const g = { gi: groups.length, sec: s.dataset.section || 'section', heading: ((s.querySelector('h1,h2,h3') || {}).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70), controls: [], scrollers: [] };
    s.setAttribute('data-pbs', g.gi);
    ctl.forEach((e, ci) => {
      e.setAttribute('data-pb', g.gi + '-' + ci);
      g.controls.push({ id: g.gi + '-' + ci, label: label(e), on: e.getAttribute('aria-pressed') === 'true' || e.getAttribute('aria-selected') === 'true' || e.getAttribute('aria-expanded') === 'true' });
    });
    scrollers.forEach((e, k) => { e.setAttribute('data-pbx', g.gi + '-' + k); g.scrollers.push({ id: g.gi + "-" + k, pages: 1 + Math.ceil((e.scrollWidth - e.clientWidth - 4) / e.clientWidth) }); });
    groups.push(g);
  });
  return groups;
}

async function tiny(buf) {
  return sharp(buf, { limitInputPixels: false }).resize({ width: 320 }).greyscale().raw().toBuffer({ resolveWithObject: true });
}
/* two photos of a block count as the same look when almost no pixel moved */
function same(a, b) {
  if (!a || !b || a.info.width !== b.info.width || Math.abs(a.info.height - b.info.height) > 2) return false;
  const n = Math.min(a.data.length, b.data.length);
  let moved = 0;
  for (let i = 0; i < n; i++) if (Math.abs(a.data[i] - b.data[i]) > 24) moved++;
  return moved / n < 0.0015;
}

async function captureStates(page, pg, vkey, V, data) {
  const groups = await page.evaluate(markControls, SKIP_SECTIONS.source, SKIP_LABEL.source);
  if (!groups.length) return [];
  /* the header, the "on this page" bar and the phone's sticky bar would
     land on top of a block photographed on its own: hidden meanwhile
     (sheets are built on first open, so they stay visible) */
  await page.evaluate(() => {
    document.querySelectorAll('body *').forEach(e => {
      if (getComputedStyle(e).position === 'fixed' || e.matches('header,.snav')) e.setAttribute('data-pbhide', '');
    });
    const st = document.createElement('style');
    st.textContent = '[data-pbhide]{visibility:hidden!important}';
    document.head.appendChild(st);
  });
  const states = [];
  const keep = V.keep;
  const secRect = gi => page.evaluate(g => {
    const s = document.querySelector(`[data-pbs="${g}"]`), r = s.getBoundingClientRect();
    return { x: 0, y: Math.round(r.top + window.scrollY), width: document.documentElement.clientWidth, height: Math.round(r.height) };
  }, gi);
  const dialogOpen = () => page.evaluate(() => Array.from(document.querySelectorAll('[aria-modal="true"],[role="dialog"],dialog[open]'))
    .some(d => d.getClientRects().length && d.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && !d.closest('[hidden]')));
  const save = async (buf, meta, rect) => {
    const n = states.length;
    const file = `${pg.id}-${vkey}-s${n}.jpg`;
    const out = await sharp(buf, { limitInputPixels: false }).resize({ width: Math.round(rect.width * keep) }).jpeg({ quality: 64, mozjpeg: true }).toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(OUT, 'shots', file), out.data);
    const all = await page.evaluate(survey);
    const items = all.items.filter(i => i.v && i.y + i.h > rect.y && i.y < rect.y + rect.height && i.x < rect.x + rect.width && i.x + i.w > rect.x)
      .map(i => Object.assign({}, i, { x: i.x - rect.x, y: i.y - rect.y }));
    states.push(Object.assign({ file, w: rect.width, h: rect.height, ih: out.info.height, items }, meta));
  };
  for (const g of groups) {
    const secIndex = data.sections.findIndex(s => s.name === g.sec && s.label.slice(0, 40) === g.heading.slice(0, 40));
    const base = await secRect(g.gi);
    if (base.height > 4200) continue;
    const seen = [await tiny(await page.screenshot({ type: 'png', clip: base, captureBeyondViewport: true }))];
    const orig = g.controls.find(c => c.on) || g.controls[0];
    for (const c of g.controls) {
      if (c === orig && c.on) continue; /* that is how the page already shows it */
      try {
        await page.evaluate(id => { const e = document.querySelector(`[data-pb="${id}"]`); e.scrollIntoView({ block: 'center' }); e.click(); }, c.id);
        await sleep(650);
        if (await dialogOpen()) {
          const vp = await page.evaluate(() => ({ x: 0, y: Math.round(window.scrollY), width: document.documentElement.clientWidth, height: window.innerHeight }));
          const buf = await page.screenshot({ type: 'png' });
          await save(buf, { sec: secIndex, label: c.label, popup: true, at: base.y }, vp);
          await page.keyboard.press('Escape');
          await sleep(500);
          continue;
        }
        const r = await secRect(g.gi);
        const buf = await page.screenshot({ type: 'png', clip: r, captureBeyondViewport: true });
        const t = await tiny(buf);
        if (seen.some(x => same(x, t))) continue;
        seen.push(t);
        await save(buf, { sec: secIndex, label: c.label, at: r.y }, r);
      } catch (e) { console.error('  state skipped', pg.id, vkey, c.label, e.message.slice(0, 60)); }
    }
    if (orig && g.controls.length) {
      await page.evaluate(id => { const e = document.querySelector(`[data-pb="${id}"]`); if (e) e.click(); }, orig.id).catch(() => {});
      await sleep(400);
      if (await dialogOpen()) { await page.keyboard.press('Escape'); await sleep(400); }
    }
    for (const sc of g.scrollers) {
      for (let k = 1; k < Math.min(sc.pages, 12); k++) {
        await page.evaluate((id, k) => { const e = document.querySelector(`[data-pbx="${id}"]`); e.style.scrollBehavior = 'auto'; e.scrollLeft = k * e.clientWidth; }, sc.id, k);
        await sleep(350);
        const r = await secRect(g.gi);
        const buf = await page.screenshot({ type: 'png', clip: r, captureBeyondViewport: true });
        const t = await tiny(buf);
        if (seen.some(x => same(x, t))) continue;
        seen.push(t);
        await save(buf, { sec: secIndex, label: `Swiped along · ${k + 1} of ${sc.pages}`, at: r.y }, r);
      }
      await page.evaluate(id => { const e = document.querySelector(`[data-pbx="${id}"]`); e.scrollLeft = 0; }, sc.id);
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return states;
}

async function capturePage(browser, pg, vkey, scrollMode) {
  const V = VIEWS[vkey];
  const page = await browser.newPage();
  await page.setViewport(V.vp);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE + pg.path, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(800);
  /* walk down so every lazy picture loads */
  let H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += Math.round(V.vp.height * 0.7)) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await sleep(110);
    H = await page.evaluate(() => document.documentElement.scrollHeight);
  }
  await page.evaluate(async () => {
    const imgs = Array.from(document.images).filter(i => !i.complete);
    await Promise.race([Promise.all(imgs.map(i => new Promise(r => { i.onload = i.onerror = r; }))), new Promise(r => setTimeout(r, 8000))]);
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  if (pg.css) await page.addStyleTag({ content: pg.css });
  /* text folded behind "Read more" (phones) is opened, so Paul reads it all */
  await page.evaluate(() => document.querySelectorAll('main button[aria-expanded="false"]').forEach(b => {
    if (/^\s*Read more/i.test(b.textContent) && !b.matches('[data-sheet-open],[aria-haspopup]')) b.click();
  }));
  await sleep(1200);

  const data = await page.evaluate(survey);
  /* photographed a band at a time (one huge shot fails on long pages),
     each band scaled to what we keep and saved as a tile */
  const dpr = V.vp.deviceScaleFactor;
  const keepW = Math.round(data.w * V.keep);
  const bandCss = Math.round(V.tile / V.keep);
  const tiles = [];
  const thumbs = [];
  let fullH = 0;
  for (let y = 0, i = 0; y < data.h; y += bandCss, i++) {
    const h = Math.min(bandCss, data.h - y);
    process.env.DBG && console.log(pg.id, vkey, 'band', i, y);
    const buf = scrollMode ? await scrollBand(page, y, h, data.w, V.vp.height, dpr, i)
      : await page.screenshot({ type: 'png', clip: { x: 0, y, width: data.w, height: h }, captureBeyondViewport: true });
    const file = `${pg.id}-${vkey}-${i}.jpg`;
    const out = await sharp(buf, { limitInputPixels: false }).resize({ width: keepW }).jpeg({ quality: vkey === 'd' ? 62 : 64, mozjpeg: true }).toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(OUT, 'shots', file), out.data);
    tiles.push({ file, y: fullH, h: out.info.height });
    thumbs.push(await sharp(buf, { limitInputPixels: false }).resize({ width: V.thumb }).png().toBuffer({ resolveWithObject: true }));
    fullH += out.info.height;
  }
  data.states = await captureStates(page, pg, vkey, V, data);
  await page.close();
  const thumbH = thumbs.reduce((a, t) => a + t.info.height, 0);
  let ty = 0;
  const thumb = `${pg.id}-${vkey}-thumb.jpg`;
  await sharp({ create: { width: V.thumb, height: thumbH, channels: 3, background: '#111' } })
    .composite(thumbs.map(t => { const c = { input: t.data, top: ty, left: 0 }; ty += t.info.height; return c; }))
    .jpeg({ quality: 60, mozjpeg: true }).toFile(path.join(OUT, 'shots', thumb));

  data.scale = keepW / data.w;        /* tile pixels per CSS pixel */
  data.shotH = fullH;
  data.tiles = tiles;
  data.thumb = thumb;
  data.dpr = dpr;
  fs.writeFileSync(path.join(OUT, 'data', `${pg.id}-${vkey}.json`), JSON.stringify(data));
  const nt = data.items.filter(i => i.k === 't');
  console.log(`${pg.id}-${vkey}: ${data.w}x${data.h}, ${tiles.length} tiles, ${nt.length} texts, ${data.items.length - nt.length} pictures, ${data.states.length} other views${data.states.length ? ': ' + data.states.map(x => x.label).join(' / ') : ''}`);
}

(async () => {
  fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });
  const jobs = [];
  for (const pg of PAGES) if (!ONLY || ONLY.includes(pg.id)) for (const v of Object.keys(VIEWS)) jobs.push([pg, v]);
  /* one browser per worker: a page in a background tab of a shared
     browser is not painted, and its screenshots hang */
  const N = 2;
  let next = 0;
  await Promise.all(Array.from({ length: N }, async () => {
    const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'], protocolTimeout: 60000 });
    while (next < jobs.length) {
      const [pg, v] = jobs[next++];
      try { await capturePage(browser, pg, v, pg.scroll); }
      catch (e) {
        console.error('retrying by scrolling:', pg.id, v, e.message.slice(0, 60));
        try { await capturePage(browser, pg, v, true); } catch (e2) { console.error('FAILED', pg.id, v, e2.message); }
      }
    }
    await browser.close();
  }));
})().catch(e => { console.error(e); process.exit(1); });
