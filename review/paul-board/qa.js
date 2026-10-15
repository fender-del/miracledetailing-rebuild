/* review/paul-board/qa.js — drives the built file the way Paul would:
   name, open a page, click words / a photo / a spot, save notes,
   save the Excel, open it again. node qa.js <out-dir> */
'use strict';
const fs = require('fs');
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '../../site/node_modules/puppeteer-core'));
const OUT = path.resolve(process.argv[2] || 'qa-out');
const FILE = 'file:///' + path.join(__dirname, 'Miracle-Website-Review.html').split(path.sep).join('/');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars'] });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.setViewport({ width: 1440, height: 900 });
  const cdp = await p.target().createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT });
  let t = Date.now();
  await p.goto(FILE, { waitUntil: 'load', timeout: 120000 });
  console.log('loaded in', Date.now() - t, 'ms');
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'load' });
  await sleep(800);
  await p.screenshot({ path: path.join(OUT, '01-welcome.jpg'), type: 'jpeg', quality: 70 });
  await p.click('button[form=who]');
  await sleep(1500);
  await p.screenshot({ path: path.join(OUT, '02-home.jpg'), type: 'jpeg', quality: 70 });
  await p.click('[data-mode=wall]'); await sleep(1500);
  await p.screenshot({ path: path.join(OUT, '03-wall.jpg'), type: 'jpeg', quality: 70 });
  await p.click('[data-mode=cards]');
  await p.evaluate(() => { location.hash = '#/page/ppf/d'; });
  await sleep(1800);
  /* words: the H1 */
  const h1 = await p.evaluate(() => {
    const L = BOARD.pages.find(x => x.id === 'ppf').d, it = L.items.find(i => i.t === 'Paint Protection Film' && i.k === 't');
    const r = document.getElementById('paper').getBoundingClientRect(), k = r.width / L.w;
    return { x: r.left + (it.x + it.w / 2) * k, y: r.top + (it.y + it.h / 2) * k };
  });
  await p.mouse.move(h1.x, h1.y); await sleep(300);
  await p.screenshot({ path: path.join(OUT, '04-hover.jpg'), type: 'jpeg', quality: 70 });
  await p.mouse.click(h1.x, h1.y); await sleep(900);
  await p.screenshot({ path: path.join(OUT, '05-dialog.jpg'), type: 'jpeg', quality: 70 });
  await p.type('#nt', 'Make this say "Paint Protection Film (PPF)" & bigger');
  await p.click('[data-x=save]'); await sleep(500);
  /* a photo further down */
  await p.evaluate(() => document.getElementById('stage').scrollTo(0, 1100)); await sleep(800);
  const ph = await p.evaluate(() => {
    const L = BOARD.pages.find(x => x.id === 'ppf').d, it = L.items.find(i => i.k === 'i' && i.src === 'ppf-beads');
    const r = document.getElementById('paper').getBoundingClientRect(), k = r.width / L.w;
    return { x: r.left + (it.x + 40) * k, y: r.top + (it.y + 40) * k };
  });
  await p.mouse.click(ph.x, ph.y); await sleep(800);
  await p.type('#nt', 'Use a photo with my face in it');
  await p.click('[data-x=save]'); await sleep(500);
  /* page note */
  await p.click('[data-act=pagenote]'); await sleep(400);
  await p.type('#nt', 'Prices need checking on this page');
  await p.click('[data-x=save]'); await sleep(600);
  await p.screenshot({ path: path.join(OUT, '06-pins.jpg'), type: 'jpeg', quality: 70 });
  /* another view of a block: the Matte PPF tab */
  const matte = await p.evaluate(() => {
    const L = BOARD.pages.find(x => x.id === 'ppf').d, i = L.states.findIndex(s => /Matte/.test(s.label));
    const g = [...document.querySelectorAll('.sbar')].find(b => b.dataset.g === 's' + L.states[i].sec);
    document.getElementById('stage').scrollTo(0, L.states[i].at * (document.getElementById('paper').getBoundingClientRect().width / L.w) - 80);
    return { i, g: g && g.dataset.g };
  });
  await sleep(500);
  await p.click(`.sbar[data-g="${matte.g}"] [data-open]`); await sleep(300);
  await p.screenshot({ path: path.join(OUT, '06b-views-menu.jpg'), type: 'jpeg', quality: 70 });
  await p.click(`.sbar[data-g="${matte.g}"] [data-s="${matte.i}"]`); await sleep(700);
  await p.screenshot({ path: path.join(OUT, '06c-matte.jpg'), type: 'jpeg', quality: 70 });
  const mt = await p.evaluate(i => {
    const L = BOARD.pages.find(x => x.id === 'ppf').d, st = L.states[i], it = st.items.find(t => t.k === 't' && /^For matte/.test(t.t));
    const r = document.getElementById('paper').getBoundingClientRect(), k = r.width / L.w;
    return { x: r.left + (it.x + 30) * k, y: r.top + (st.at + it.y + 10) * k };
  }, matte.i);
  await p.mouse.click(mt.x, mt.y); await sleep(800);
  await p.screenshot({ path: path.join(OUT, '06d-matte-dialog.jpg'), type: 'jpeg', quality: 70 });
  await p.type('#nt', 'Shorten the matte text');
  await p.click('[data-x=save]'); await sleep(500);
  await p.click(`.sbar__back`); await sleep(400);
  /* phone view of another page */
  await p.evaluate(() => { location.hash = '#/page/home/m'; }); await sleep(1800);
  const box = await p.evaluate(() => { const r = document.getElementById('paper').getBoundingClientRect(); return { x: r.left + 200, y: r.top + 300 }; });
  await p.mouse.click(box.x, box.y); await sleep(800);
  await p.screenshot({ path: path.join(OUT, '07-phone-dialog.jpg'), type: 'jpeg', quality: 70 });
  await p.type('#nt', 'Hero photo: show the Ferrari more');
  await p.click('[data-x=save]'); await sleep(600);
  await p.screenshot({ path: path.join(OUT, '08-phone.jpg'), type: 'jpeg', quality: 70 });
  /* survives a reload */
  await p.reload({ waitUntil: 'load' }); await sleep(1200);
  console.log('notes after reload', await p.evaluate(() => JSON.parse(localStorage.getItem('miracle-review-' + BOARD.key)).notes.length));
  await p.evaluate(() => { location.hash = '#/notes'; }); await sleep(800);
  await p.screenshot({ path: path.join(OUT, '09-notes.jpg'), type: 'jpeg', quality: 70 });
  await p.click('.bar [data-act=finish]'); await sleep(500);
  await p.screenshot({ path: path.join(OUT, '10-finish.jpg'), type: 'jpeg', quality: 70 });
  await p.click('[data-x=save]'); await sleep(2000);
  const x = fs.readdirSync(OUT).find(f => f.endsWith('.xlsx'));
  console.log('downloaded', x);
  /* the team opens it on a clean computer */
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'load' }); await sleep(800);
  await p.click('button[form=who]'); await sleep(800);
  const [chooser] = await Promise.all([p.waitForFileChooser(), p.click('[data-act=open]')]);
  await chooser.accept([path.join(OUT, x)]);
  await sleep(1500);
  await p.screenshot({ path: path.join(OUT, '11-imported.jpg'), type: 'jpeg', quality: 70 });
  console.log('imported', await p.evaluate(() => JSON.parse(localStorage.getItem('miracle-review-' + BOARD.key)).notes.map(n => [n.page, n.view, n.kind, n.x, n.y, (n.orig || n.photo || '').slice(0, 30), n.note, 'state=' + n.state + ' ' + (n.stLabel || '')].join(' | '))));
  await p.evaluate(() => { location.hash = '#/page/ppf/d'; }); await sleep(1500);
  await p.screenshot({ path: path.join(OUT, '12-imported-ppf.jpg'), type: 'jpeg', quality: 70 });
  console.log('errors', errs);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
