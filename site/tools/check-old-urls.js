#!/usr/bin/env node
/* ============================================================
   check-old-urls.js — do the old WordPress URLs still land?

     node tools/check-old-urls.js <base> [list] [--out result.json]
       base  https://miracledetailing-rebuild.fender-aa2.workers.dev
             (or a branch preview URL, or https://miracledetail.co.uk)
       list  tools/old-urls.txt (default): "path source" per line, # = comment

   Each path is asked for once without following redirects, like
     curl -s -o /dev/null -w "%{http_code} %{redirect_url}" <base><path>
   Sitemap paths are asked for a second time without the closing slash.

   PASS  200, or a 301 straight to a page that answers 200.
   FAIL  404 / 5xx, a 302/307/308, a 301 that leads to another redirect,
         a 301 to the bare homepage (only the old shop pages may), or a
         gallery ?job= / ?make= that the new gallery does not have.
   Exit code 1 when anything fails.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outFile = outIdx >= 0 ? args.splice(outIdx, 2)[1] : null;
const [baseArg, listArg] = args;
if (!baseArg) {
  console.error('usage: node tools/check-old-urls.js <base-url> [old-urls.txt] [--out result.json]');
  process.exit(2);
}
const BASE = baseArg.replace(/\/+$/, '');
const LIST = listArg || path.join(__dirname, 'old-urls.txt');

/* Old pages with no counterpart at all: the homepage is the right place. */
const HOME_OK = new Set(['/', '/basket/', '/my-account/', '/products/', '/thank-you/']);

const entries = [];
for (const raw of fs.readFileSync(LIST, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const [p, source = ''] = line.split(/\s+/);
  entries.push({ path: p, source });
  if (source === 'sitemap' && p !== '/' && p.endsWith('/')) entries.push({ path: p.slice(0, -1), source: 'sitemap (no slash)' });
}

const ask = async url => {
  for (let tryNo = 0; ; tryNo++) {
    try {
      const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'check-old-urls' } });
      const loc = r.headers.get('location');
      await r.body?.cancel().catch(() => {});
      return { status: r.status, location: loc ? new URL(loc, url).href : '' };
    } catch (e) {
      if (tryNo >= 2) return { status: 0, location: '', error: e.message };
      await new Promise(res => setTimeout(res, 500 * (tryNo + 1)));
    }
  }
};

/* The new gallery's jobs and make filters, read off the page itself. */
async function galleryKeys() {
  const r = await fetch(BASE + '/car-detail-gallery/');
  const html = await r.text();
  const m = html.match(/data-gal-data>([\s\S]*?)<\/script>/);
  const jobs = new Set(m ? Object.keys(JSON.parse(m[1])) : []);
  const makes = new Set([...html.matchAll(/data-make="([^"]+)"/g)].map(x => x[1]));
  return { jobs, makes };
}

async function check(e, gal, cache) {
  const url = BASE + e.path;
  const first = await ask(url);
  const row = { path: e.path, source: e.source, status: first.status, target: '', final: '', ok: false, note: '' };
  if (first.error) { row.note = 'request failed: ' + first.error; return row; }
  if (first.status === 200) { row.ok = true; row.note = 'page kept'; return row; }
  if (first.status === 404) { row.note = '404'; return row; }
  if (![301, 302, 303, 307, 308].includes(first.status)) { row.note = 'unexpected status'; return row; }

  const t = new URL(first.location);
  row.target = t.origin === new URL(BASE).origin ? t.pathname + t.search + t.hash : t.href;
  if (first.status !== 301) { row.note = `${first.status}, not 301`; return row; }
  if (t.origin !== new URL(BASE).origin) { row.note = 'leaves the site'; return row; }

  const key = t.pathname + t.search;
  if (!cache.has(key)) cache.set(key, ask(t.origin + key));
  const second = await cache.get(key);
  row.final = second.status;
  if (second.status !== 200) {
    row.note = second.status >= 300 && second.status < 400 ? `more than one hop (then ${second.status} → ${second.location})` : `target answers ${second.status}`;
    return row;
  }
  if (t.pathname === '/' && !t.hash && !HOME_OK.has(e.path.endsWith('/') ? e.path : e.path + '/')) {
    row.note = 'bare homepage: is there a closer page?';
    return row;
  }
  const job = t.searchParams.get('job');
  const make = t.searchParams.get('make');
  if (job && !gal.jobs.has(job)) { row.note = `job "${job}" is not in the gallery`; return row; }
  if (make && !gal.makes.has(make.toLowerCase())) { row.note = `make "${make}" is not a gallery filter`; return row; }
  row.ok = true;
  row.note = job ? 'gallery job' : make ? 'gallery make filter' : t.hash ? `homepage ${t.hash}` : 'one 301';
  return row;
}

(async () => {
  const gal = await galleryKeys();
  if (!gal.jobs.size) console.warn('warning: could not read the gallery jobs from ' + BASE + '/car-detail-gallery/');
  const cache = new Map();
  const rows = [];
  const queue = entries.slice();
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const e = queue.shift();
      rows.push(await check(e, gal, cache));
    }
  });
  await Promise.all(workers);
  const order = new Map(entries.map((e, i) => [e.path + '|' + e.source, i]));
  rows.sort((a, b) => order.get(a.path + '|' + a.source) - order.get(b.path + '|' + b.source));

  const bad = rows.filter(r => !r.ok);
  for (const r of rows) {
    if (!r.ok || process.env.VERBOSE) {
      console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${String(r.status).padEnd(3)} ${r.path.padEnd(60)} ${r.target ? '→ ' + r.target : ''}  ${r.note}`);
    }
  }
  const by = {};
  rows.forEach(r => { const s = r.source.replace(/ \(no slash\)/, ''); by[s] = by[s] || [0, 0]; by[s][r.ok ? 0 : 1]++; });
  console.log(`\n${BASE}: ${rows.length - bad.length}/${rows.length} pass`);
  Object.entries(by).forEach(([s, [p, f]]) => console.log(`  ${s.padEnd(14)} ${p} pass, ${f} fail`));
  if (outFile) fs.writeFileSync(outFile, JSON.stringify({ base: BASE, checked: new Date().toISOString(), rows }, null, 1));
  process.exit(bad.length ? 1 : 0);
})();
