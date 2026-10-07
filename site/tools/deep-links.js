/* ============================================================
   tools/deep-links.js — opening the page part-way down.

   A visitor arriving on /#book (the CTA on every other page) or
   /#projects never scrolls past the blocks above. Every block in view
   must still arrive and end up visible, the deck must deal itself in,
   and nothing may widen the page. Checks 1440 and 390.
     node tools/deep-links.js [url]
   ============================================================ */
'use strict';
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.argv[2] || 'http://localhost:8765/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  let bad = 0;
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]) {
    for (const hash of ['#book', '#projects', '#services']) {
      const page = await browser.newPage();
      await page.setViewport(vp);
      await page.goto(BASE + hash, { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(4500);
      const r = await page.evaluate(h => {
        const sec = document.querySelector(h);
        const inView = el => { const b = el.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight * 0.85; };
        const hidden = [...sec.querySelectorAll('[data-reveal],[data-split],[data-card]')]
          .filter(inView)
          .filter(el => { const cs = getComputedStyle(el); return cs.visibility === 'hidden' || +cs.opacity < 0.95; })
          .map(el => el.className || el.tagName);
        return { sy: Math.round(scrollY), top: Math.round(sec.getBoundingClientRect().top), hidden, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
      }, hash);
      const ok = !r.hidden.length && r.sw <= r.cw;
      if (!ok) bad++;
      console.log(`${vp.width} ${hash}`, ok ? 'ok' : 'FAIL', JSON.stringify(r));
      await page.close();
    }
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
