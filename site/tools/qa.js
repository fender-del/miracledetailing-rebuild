/* ============================================================
   tools/qa.js — headless checks at 390 / 768 / 1440 (+ reduced
   motion, + JS off) against the local preview server.

     node tools/qa.js <out-dir> [url]

   Per run: console errors, page errors, failed requests, H1 count,
   horizontal overflow (and the elements causing it), content left
   hidden after a full scroll, and one screenshot per section.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const OUT = process.argv[2] || 'qa-out';
const URL = process.argv[3] || 'http://localhost:8765/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ONLY = process.env.QA_ONLY ? process.env.QA_ONLY.split(',') : null;
const SHOTS = process.env.QA_SHOTS !== '0';

const RUNS = [
  { name: '390', vp: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  { name: '768', vp: { width: 768, height: 1024, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
  { name: '1440', vp: { width: 1440, height: 900, deviceScaleFactor: 1 } },
  { name: '390-reduced', vp: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, reduced: true },
  { name: '1440-reduced', vp: { width: 1440, height: 900, deviceScaleFactor: 1 }, reduced: true },
  { name: '1440-nojs', vp: { width: 1440, height: 900, deviceScaleFactor: 1 }, nojs: true },
  { name: '390-nojs', vp: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, nojs: true }
].filter(r => !ONLY || ONLY.includes(r.name));

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
  const report = {};

  for (const run of RUNS) {
    const page = await browser.newPage();
    const log = { console: [], pageErrors: [], failed: [] };
    page.on('console', m => { if (['error', 'warning', 'warn'].includes(m.type())) log.console.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => log.pageErrors.push(String(e)));
    page.on('requestfailed', r => {
      const u = r.url();
      if (!/google|gstatic/.test(u)) log.failed.push(`${r.failure() && r.failure().errorText} ${u}`);
    });
    await page.setViewport(run.vp);
    if (run.reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (run.nojs) await page.setJavaScriptEnabled(false);

    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(1600);

    /* Overflow before anything has been revealed (things waiting off to
       the side can widen the page on a phone). */
    const swAtLoad = await page.evaluate(() => document.documentElement.scrollWidth);

    /* Walk the page so every scroll-triggered entrance fires. */
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(run.vp.height * 0.6)) {
      await page.evaluate(v => window.scrollTo(0, v), y);
      await sleep(140);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await sleep(2400);

    const checks = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const over = [];
      document.querySelectorAll('body *:not(.cur):not(.cur *)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > W + 1 || r.left < -1)) {
          /* ignore anything inside a clipping ancestor (marquees, strips) */
          let p = el.parentElement, clipped = false;
          while (p && p !== document.body) {
            const o = getComputedStyle(p);
            if (/(hidden|clip|auto|scroll)/.test(o.overflowX) || /(hidden|clip)/.test(o.overflow)) { clipped = true; break; }
            p = p.parentElement;
          }
          if (!clipped) over.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
        }
      });
      const hidden = Array.from(document.querySelectorAll('main *')).filter(el => {
        const cs = getComputedStyle(el);
        return el.children.length === 0 && el.textContent.trim() && (cs.visibility === 'hidden' || +cs.opacity === 0)
          && !el.closest('[hidden],[aria-hidden=true],.sr,.qf__done,.story.is-pinned [data-beat],.story.is-pinned [data-story-fig],[data-story-line]');
      }).map(el => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)}: ${el.textContent.trim().slice(0, 40)}`);
      return {
        motion: document.documentElement.getAttribute('data-motion'),
        htmlClass: document.documentElement.className,
        h1: document.querySelectorAll('h1').length,
        h1Text: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
        scrollWidth: document.documentElement.scrollWidth, clientWidth: W,
        overflowing: over.slice(0, 12),
        hiddenText: hidden.slice(0, 20),
        zeroCounts: Array.from(document.querySelectorAll('[data-count]')).filter(e => e.textContent.trim() === '0').length,
        images: Array.from(document.images).filter(i => i.complete && !i.naturalWidth).map(i => i.src).slice(0, 5)
      };
    });
    checks.swAtLoad = swAtLoad;
    report[run.name] = Object.assign(checks, log);

    if (SHOTS) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(900);
      const secs = await page.evaluate(() => Array.from(document.querySelectorAll('header.hd, main section[data-section], footer'))
        .map(s => ({ top: s.getBoundingClientRect().top + window.scrollY, h: s.offsetHeight, name: s.dataset.section || s.className.split(' ')[0] })));
      let n = 0;
      for (const s of secs) {
        if (s.name === 'header') continue;
        const steps = Math.max(1, Math.ceil(s.h / run.vp.height));
        for (let i = 0; i < steps && i < 3; i++) {
          await page.evaluate(v => window.scrollTo(0, v), s.top + i * run.vp.height - (i ? 0 : 0));
          await sleep(run.nojs ? 150 : 1300);
          await page.screenshot({ path: path.join(OUT, `${run.name}-${String(++n).padStart(2, '0')}-${s.name}.jpg`), type: 'jpeg', quality: 70 });
        }
      }
    }
    await page.close();
    console.log(run.name, JSON.stringify({ h1: checks.h1, sw0: swAtLoad, sw: checks.scrollWidth, cw: checks.clientWidth, motion: checks.motion, over: checks.overflowing.length, hidden: checks.hiddenText.length, errs: log.console.length + log.pageErrors.length, failed: log.failed.length }));
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
