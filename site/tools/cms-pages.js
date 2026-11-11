/* ============================================================
   cms-pages.js — keep the DMI CMS in step with the page list.

   For every page build.js makes, ensure content/pages/<slug>.json
   exists (SEO fields the CMS edits) and that ../cms.schema.json has a
   matching "Pages" entry. Existing content files are never touched,
   so nothing Paul or the SEO person typed in the CMS is lost.

     node tools/cms-pages.js     run after adding or removing a page
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = path.join(ROOT, 'src/pages');
const CONTENT = path.join(ROOT, 'content/pages');
const SCHEMA = path.join(ROOT, '..', 'cms.schema.json');

const site = require(path.join(ROOT, 'src/site.js'));
const pages = fs.readdirSync(PAGES).filter(f => f.endsWith('.js')).sort()
  .flatMap(f => {
    const mod = require(path.join(PAGES, f));
    return (Array.isArray(mod) ? mod : [mod]).flatMap(p => (typeof p === 'function' ? p(site) : p));
  });

const key = p => (p.slug ? p.slug.replace(/\/+$/, '') : 'home');
const label = p => (p.slug ? p.title.split(' | ')[0].replace(/ in Surrey$/, '').trim().slice(0, 60) : 'Home page');

fs.mkdirSync(CONTENT, { recursive: true });
let added = 0;
for (const p of pages) {
  const f = path.join(CONTENT, key(p) + '.json');
  if (fs.existsSync(f)) continue;
  const seo = { title: p.title, description: p.description, ogImage: { src: '', alt: '' }, noindex: Boolean(p.noindex) };
  fs.writeFileSync(f, JSON.stringify({ seo }, null, 2) + '\n');
  added++;
}

const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));
const others = schema.docs.filter(d => !d.key.startsWith('page-'));
const pageDocs = pages.map(p => ({
  key: 'page-' + key(p),
  label: label(p),
  file: `pages/${key(p)}.json`,
  group: 'Pages',
  path: p.slug ? `/${key(p)}/` : '/',
  fields: [{ name: 'seo', type: 'seo', help: 'Leave the title or description empty to use the one written in the page.' }]
}));
schema.docs = [...others, ...pageDocs];
fs.writeFileSync(SCHEMA, JSON.stringify(schema, null, 2) + '\n');

const orphans = fs.readdirSync(CONTENT).filter(f => !pages.some(p => key(p) + '.json' === f));
console.log(`${pages.length} pages · ${added} content file(s) added · schema has ${pageDocs.length} page entries`);
if (orphans.length) console.log(`content files with no page (delete if the page is gone): ${orphans.join(', ')}`);
