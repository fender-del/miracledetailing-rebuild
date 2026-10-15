/* review/paul-board/live/qa.js — drives the live board on the local
   server like Paul would. node qa.js <out-dir> */
'use strict';
const fs = require('fs');
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '../../../site/node_modules/puppeteer-core'));
const OUT = path.resolve(process.argv[2] || 'qa-out');
const BASE = 'http://localhost:8765/review/';
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
  const shot = n => p.screenshot({ path: path.join(OUT, n + '.jpg'), type: 'jpeg', quality: 70 });
  const frame = () => p.frames().find(f => f.url().startsWith('http://localhost:8765/') && !f.url().includes('/review/'));
  /* point in the board for a selector inside the page */
  const at = async (sel, fx = 0.3, fy = 0.5) => {
    const off = await p.evaluate(() => { const r = document.getElementById('site').getBoundingClientRect(); const ifr = document.getElementById('site'); const k = r.width / ifr.offsetWidth; return { x: r.left, y: r.top, k }; });
    const r = await frame().evaluate((s, fx, fy) => { const e = document.querySelector(s); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width * fx, y: b.top + b.height * fy }; }, sel, fx, fy);
    await sleep(500);
    const r2 = await frame().evaluate((s, fx, fy) => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.left + b.width * fx, y: b.top + b.height * fy }; }, sel, fx, fy);
    return { x: off.x + r2.x * off.k, y: off.y + r2.y * off.k };
  };

  await p.goto(BASE, { waitUntil: 'load' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'load' });
  await p.click('button[form=who]'); await sleep(1200);
  await shot('01-home');

  /* PPF on a phone: real tab click, then a note on the Matte words */
  await p.evaluate(() => { location.hash = '#/page/ppf/m'; }); await sleep(4000);
  await shot('02-ppf-phone');
  const tab = await frame().evaluate(() => { const t = [...document.querySelectorAll('[role=tab]')].find(e => /Matte/.test(e.textContent)); t.setAttribute('data-qa', 'matte'); return !!t; });
  let pt = await at('[data-qa=matte]', 0.5, 0.5);
  await p.mouse.click(pt.x, pt.y); await sleep(900);
  await shot('03-ppf-matte-tab');
  await frame().evaluate(() => { const e = [...document.querySelectorAll('p')].find(x => /^For matte and satin/.test(x.textContent.trim())); e.setAttribute('data-qa', 'mattep'); });
  await p.click('[data-act=note]'); await sleep(300);
  pt = await at('[data-qa=mattep]', 0.3, 0.3);
  await p.mouse.move(pt.x, pt.y); await sleep(300);
  await shot('04-noting-hover');
  await p.mouse.click(pt.x, pt.y); await sleep(700);
  await shot('05-dialog');
  await p.type('#nt', 'Shorten the matte text');
  await p.click('[data-x=save]'); await sleep(800);
  await shot('06-pin');

  /* About on a computer: the timeline after 2008 */
  await p.evaluate(() => { location.hash = '#/page/about/d'; }); await sleep(4500);
  await frame().evaluate(() => window.scrollTo(0, 9000)); await sleep(1500);
  await shot('07-about-2008');

  /* Correction on a computer: level IV, note on its text */
  await p.evaluate(() => { location.hash = '#/page/correction/d'; }); await sleep(4500);
  const lv = await frame().evaluate(() => { const t = [...document.querySelectorAll('button')].find(e => /Advanced Correction/.test(e.textContent)); if (t) t.setAttribute('data-qa', 'lv4'); return !!t; });
  if (lv) { pt = await at('[data-qa=lv4]', 0.5, 0.5); await p.mouse.click(pt.x, pt.y); await sleep(1200); }
  await shot('08-correction-level4');
  await frame().evaluate(() => window.scrollTo(0, document.querySelector('[data-section=steps], .steps, section:nth-of-type(6)') ? 0 : 0));

  /* Ceramic: Why Feynlab choices */
  await p.evaluate(() => { location.hash = '#/page/ceramic/d'; }); await sleep(4500);
  const ch = await frame().evaluate(() => { const t = [...document.querySelectorAll('button')].find(e => /UV Protection/.test(e.textContent)); if (t) t.setAttribute('data-qa', 'uv'); return !!t; });
  if (ch) { pt = await at('[data-qa=uv]', 0.5, 0.5); await p.mouse.click(pt.x, pt.y); await sleep(1200); }
  await shot('09-ceramic-uv');

  /* link inside the page moves the board along */
  await frame().evaluate(() => { const a = [...document.querySelectorAll('a')].find(x => x.getAttribute('href') === '/paint-protection-film-ppf/'); a && a.click(); });
  await sleep(4000);
  console.log('after link inside:', await p.evaluate(() => location.hash));
  await shot('10-followed-link');

  /* back on the PPF phone page the pin is on the matte words when that tab is open */
  await p.evaluate(() => { location.hash = '#/page/ppf/m'; }); await sleep(4000);
  console.log('pin visible before tab:', await frame().evaluate(() => { const x = document.querySelector('.rv-pin'); return !!x && x.style.display !== 'none'; }));
  await frame().evaluate(() => { const t = [...document.querySelectorAll('[role=tab]')].find(e => /Matte/.test(e.textContent)); t.click(); });
  await sleep(800);
  console.log('pin visible after tab:', await frame().evaluate(() => { const x = document.querySelector('.rv-pin'); return !!x && x.style.display !== 'none'; }));

  /* save and open again */
  await p.click('.bar [data-act=finish]'); await sleep(400);
  await p.click('[data-x=save]'); await sleep(1500);
  const x = fs.readdirSync(OUT).find(f => f.endsWith('.xlsx'));
  console.log('downloaded', x);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'load' }); await sleep(600);
  await p.click('button[form=who]'); await sleep(600);
  const [chooser] = await Promise.all([p.waitForFileChooser(), p.click('[data-act=open]')]);
  await chooser.accept([path.join(OUT, x)]);
  await sleep(1200);
  console.log('imported', await p.evaluate(() => JSON.parse(localStorage.getItem('miracle-review-' + BOARD.key)).notes.map(n => [n.page, n.view, n.kind, n.sel, n.note].join(' | '))));
  await shot('11-imported');
  console.log('errors', errs);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
