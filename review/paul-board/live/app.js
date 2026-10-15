/* ============================================================
   Miracle Detail · website review board, live edition.
   Each page is the real website inside a phone (or a computer
   screen), working exactly as it does for a visitor: scroll, tabs,
   before and after, pop-ups. "+ Add a note", then a click on the
   page, opens a note box; the note is pinned to the words or photo
   under the click and follows it as the page moves. Notes stay on
   this computer (localStorage) until "Save my notes" saves one
   Excel file; "open a notes file" puts its pins back.
   Served from /review/ on the same site, so the board can look
   inside the page.
   ============================================================ */
(() => {
'use strict';
const B = window.BOARD;
const PAGES = B.pages;
const byId = Object.fromEntries(PAGES.map(p => [p.id, p]));
const byPath = Object.fromEntries(PAGES.map(p => ['/' + p.path, p]));
const KEY = 'miracle-review-' + B.key;
const VIEW_NAME = { d: 'Computer', m: 'Phone' };
const PHONE = { w: 390, h: 844 };
const DESK = 1440;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clip = (s, m) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > m ? s.slice(0, m - 1) + '…' : s; };
const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
const ICON = {
  d: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
  m: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></svg>'
};

/* ---------- saved state ---------- */
let S = { name: '', notes: [], seq: 0, view: 'm', mode: 'cards' };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { /* private window */ }
let storeOK = true;
/* localStorage keeps plain data only (not the page elements a pin follows) */
const replacer = (k, v) => (k === '_el' || k === '_doc' ? undefined : v);
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S, replacer)); storeOK = true; } catch (e) { storeOK = false; }
  paintBar();
}
const notesOf = id => S.notes.filter(n => n.page === id);
const numOf = n => notesOf(n.page).indexOf(n) + 1;

/* ---------- top bar ---------- */
const bar = $('#bar');
function paintBar(title) {
  const n = S.notes.length;
  if (title !== undefined) bar.dataset.title = title;
  const t = bar.dataset.title || '';
  bar.innerHTML = `
    <a class="bar__brand" href="#/"><img src="${B.logo}" alt="Miracle Detail"><span>Website review</span></a>
    <div class="bar__mid">${t ? `<div class="bar__title">${esc(t)}</div>` : ''}</div>
    <div class="bar__right">
      ${S.name ? `${n && storeOK ? '<span class="saved" title="Your notes are kept on this computer as you go"><i></i>Kept on this computer</span>' : ''}
      <a class="btn" href="#/notes">My notes <span class="count ${n ? '' : 'count--dim'}">${n}</span></a>
      <button class="btn btn--gold" data-act="finish">Save my notes</button>` : ''}
    </div>`;
}
bar.addEventListener('click', e => { if (e.target.closest('[data-act=finish]')) openFinish(); });

/* ---------- router ---------- */
const main = $('#main');
let quietHash = false; /* the page inside navigated by itself: no rebuild */
function route() {
  if (quietHash) { quietHash = false; return; }
  stopPins();
  window.scrollTo(0, 0);
  const h = location.hash.replace(/^#\/?/, '');
  if (!S.name) return renderWelcome();
  const parts = h.split('/');
  if (parts[0] === 'page' && byId[parts[1]]) return renderPage(parts[1], parts[2] === 'd' ? 'd' : parts[2] === 'm' ? 'm' : S.view, parts[3]);
  if (parts[0] === 'notes') return renderAllNotes();
  return renderHome();
}
window.addEventListener('hashchange', route);

/* ---------- welcome ---------- */
function renderWelcome() {
  paintBar('');
  main.innerHTML = `
  <section class="welcome"><div class="welcome__box">
    <div class="eyebrow">The new website</div>
    <h1>Every page, in one place. <span class="gold">Tell us what you would like.</span></h1>
    <p class="lead">This is the new Miracle Detail website, all ${PAGES.length} pages, working just as it will for your customers.</p>
    <ol class="steps">
      <li><b>1</b><div><strong>Open a page and use it as normal</strong><p>Scroll, click the tabs, try the before and after photos, open the pop-ups.</p></div></li>
      <li><b>2</b><div><strong>Press “+ Add a note”, then click the spot</strong><p>A box opens: write what you would like there. A gold pin marks each note and stays on that spot.</p></div></li>
      <li><b>3</b><div><strong>Press “Save my notes”</strong><p>It saves one file. Email it back to ${esc(B.sendTo)}.</p></div></li>
    </ol>
    <form class="field" id="who" style="max-width:420px">
      <label for="nm">Your name</label>
      <input id="nm" name="nm" autocomplete="name" value="${esc(B.defaultName)}" required>
    </form>
    <button class="btn btn--gold btn--big" form="who">Start</button>
    <p class="hint" style="margin-top:18px">Your notes are kept on this computer as you go, so you can close this and carry on later. Please use the same browser each time.</p>
  </div></section>`;
  $('#who').addEventListener('submit', e => {
    e.preventDefault();
    S.name = $('#nm').value.trim() || B.defaultName;
    save();
    location.hash = '#/';
    route();
  });
}

/* ---------- overview (pictures of every page) ---------- */
function viewSwitch(curV, attr) {
  return `<div class="seg" role="group" aria-label="Phone or computer">${['m', 'd'].map(v =>
    `<button ${attr}="${v}" aria-pressed="${v === curV}">${ICON[v]}${VIEW_NAME[v]}</button>`).join('')}</div>`;
}
function dotsFor(p, v) {
  return notesOf(p.id).filter(n => n.view === v && n.kind !== 'page' && n.dh).map(n =>
    `<i class="dot" style="left:${(n.dx / n.dw * 100).toFixed(2)}%;top:${(n.dy / n.dh * 100).toFixed(3)}%"></i>`).join('');
}
function renderHome() {
  paintBar('');
  const v = S.view;
  const groups = [...new Set(PAGES.map(p => p.group))];
  const total = S.notes.length;
  main.innerHTML = `
  <section class="over">
    <div class="over__head">
      <div>
        <div class="eyebrow">Hello ${esc(S.name)}</div>
        <h1>All ${PAGES.length} pages</h1>
        <p>Click a page to open the real thing. Use it as normal; press <strong class="gold">+ Add a note</strong> whenever you want something changed. ${total ? `You have <strong class="gold">${total} note${total > 1 ? 's' : ''}</strong> so far.` : ''}</p>
      </div>
      <div class="over__tools">
        ${viewSwitch(v, 'data-v')}
        <div class="seg" role="group" aria-label="How to show the pages">
          <button data-mode="cards" aria-pressed="${S.mode === 'cards'}">Page cards</button>
          <button data-mode="wall" aria-pressed="${S.mode === 'wall'}">Whole site at once</button>
        </div>
        <button class="btn" data-act="general">Note about the whole website</button>
      </div>
    </div>
    ${S.mode === 'wall' ? wallHTML(v, groups) : groups.map(g => `
      <h2 class="group">${esc(g)}</h2>
      <div class="grid ${v === 'm' ? 'grid--m' : ''}">
        ${PAGES.filter(p => p.group === g).map(p => cardHTML(p, v)).join('')}
      </div>`).join('')}
    <p class="hint" style="margin-top:48px">For the Miracle team: <button class="linkbtn" data-act="open">open a notes file</button> to see its pins on the pages.</p>
  </section>`;
  main.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { S.view = b.dataset.v; save(); renderHome(); });
  main.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { S.mode = b.dataset.mode; save(); renderHome(); });
  main.querySelector('[data-act=general]').onclick = () => openEditor({ page: '_site', view: v, kind: 'page' });
  main.querySelector('[data-act=open]').onclick = openNotesFile;
  main.querySelectorAll('.card').forEach(c => {
    const strip = c.querySelector('.strip'), win = c.querySelector('.card__win');
    c.addEventListener('mouseenter', () => {
      const d = Math.max(0, strip.offsetHeight - win.offsetHeight);
      strip.style.transitionDuration = Math.max(1.2, d / 320) + 's';
      strip.style.transform = `translateY(${-d}px)`;
    });
    c.addEventListener('mouseleave', () => { strip.style.transitionDuration = '1s'; strip.style.transform = ''; });
  });
  const wall = main.querySelector('.wall');
  if (wall) dragToPan(wall);
}
function cardHTML(p, v) {
  const n = notesOf(p.id).length, T = p[v], w = v === 'm' ? 120 : 240;
  return `<a class="card" href="#/page/${p.id}/${v}">
    <div class="card__win"><div class="strip"><img src="${T.thumb}" alt="" width="${w}" height="${Math.round(T.h / T.w * w)}"><div style="position:absolute;inset:0">${dotsFor(p, v)}</div></div></div>
    <div class="card__meta"><strong>${esc(p.name)}</strong>${n ? `<span class="count">${n}</span>` : '<span class="card__go">Open →</span>'}</div>
  </a>`;
}
function wallHTML(v, groups) {
  const W = v === 'm' ? 120 : 200;
  return `<p class="hint" style="margin:0 0 12px">Every page, top to bottom, side by side. Drag to move around, click a page to open it.</p>
  <div class="wall ${v === 'm' ? 'wall--m' : ''}"><div class="wall__row">
  ${groups.map((g, gi) => (gi ? '<span class="wall__group"></span>' : '') + PAGES.filter(p => p.group === g).map(p => {
    const T = p[v];
    return `<div class="wall__col"><h3><a href="#/page/${p.id}/${v}">${esc(p.name)}</a></h3>
      <a class="wall__pic" href="#/page/${p.id}/${v}" draggable="false"><img src="${T.thumb}" alt="" width="${W}" height="${Math.round(T.h / T.w * W)}">
      <span style="position:absolute;inset:0">${dotsFor(p, v)}</span></a></div>`;
  }).join('')).join('')}
  </div></div>`;
}
function dragToPan(el) {
  let sx, sy, sl, st, moved = false, down = false;
  el.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sy = e.clientY; sl = el.scrollLeft; st = el.scrollTop; });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) { moved = true; el.classList.add('is-drag'); }
    if (moved) { el.scrollLeft = sl - dx; el.scrollTop = st - dy; }
  });
  window.addEventListener('pointerup', () => { down = false; el.classList.remove('is-drag'); });
  el.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* ---------- one page: the real thing ---------- */
let cur = null; /* { p, v, frame, win, doc, noting } */
function renderPage(id, v, focusNote) {
  const p = byId[id];
  if (S.view !== v) { S.view = v; save(); }
  paintBar(p.name);
  const groups = [...new Set(PAGES.map(q => q.group))];
  main.innerHTML = `
  <div class="pv">
    <nav class="rail" aria-label="Pages">
      <a class="back" href="#/">← All pages</a>
      ${groups.map(g => `<h4>${esc(g)}</h4>` + PAGES.filter(q => q.group === g).map(q =>
        `<a href="#/page/${q.id}/${v}" data-id="${q.id}"><span>${esc(q.name)}</span></a>`).join('')).join('')}
    </nav>
    <div class="stage" id="stage">
      <div class="stage__tools">
        <div class="grp">${viewSwitch(v, 'data-pv')}</div>
        <button class="btn btn--gold btn--note" data-act="note" aria-pressed="false">+ Add a note</button>
        <span class="noting-tip">Now click the spot you want to comment on · Esc to cancel</span>
        <button class="btn" data-act="pagenote">Note about this whole page</button>
      </div>
      <div class="frame-wrap" id="fwrap"><div class="frame ${v === 'm' ? 'frame--m' : ''}" id="frame">
        <iframe id="site" title="${esc(p.name)}" src="/${p.path}"></iframe>
      </div></div>
    </div>
    <aside class="side">
      <div class="side__head"><h3>Notes on this page</h3></div>
      <div class="side__body" id="sidebody"></div>
      <div class="side__foot" id="sidefoot"></div>
    </aside>
  </div>`;
  const frame = $('#frame'), ifr = $('#site');
  cur = { p, v, frame, ifr, win: null, doc: null, noting: false, focus: focusNote };
  sizeFrame();
  main.querySelectorAll('[data-pv]').forEach(b => b.onclick = () => { location.hash = `#/page/${cur.p.id}/${b.dataset.pv}`; });
  main.querySelector('[data-act=note]').onclick = () => setNoting(!cur.noting);
  main.querySelector('[data-act=pagenote]').onclick = () => openEditor({ page: cur.p.id, view: cur.v, kind: 'page' });
  ifr.addEventListener('load', onFrameLoad);
  paintRail(); paintSide();
}
function sizeFrame() {
  if (!cur) return;
  const wrap = $('#fwrap'), ifr = cur.ifr;
  const availW = wrap.clientWidth - 36, availH = wrap.clientHeight - 36;
  if (cur.v === 'm') {
    const h = Math.max(560, Math.min(PHONE.h, availH - 24));
    Object.assign(ifr.style, { width: PHONE.w + 'px', height: h + 'px', transform: '' });
    Object.assign(cur.frame.style, { width: '', height: '' });
  } else {
    const k = Math.min(1, availW / DESK);
    const h = Math.round(availH / k);
    Object.assign(ifr.style, { width: DESK + 'px', height: h + 'px', transform: `scale(${k})` });
    Object.assign(cur.frame.style, { width: Math.round(DESK * k) + 'px', height: Math.round(h * k) + 'px' });
  }
}
window.addEventListener('resize', () => { if (cur && $('#site')) sizeFrame(); });
function paintRail() {
  main.querySelectorAll('.rail a[data-id]').forEach(a => {
    const id = a.dataset.id, n = notesOf(id).length;
    if (id === cur.p.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    let c = a.querySelector('.count');
    if (n) { if (!c) { c = document.createElement('span'); c.className = 'count'; a.appendChild(c); } c.textContent = n; }
    else if (c) c.remove();
  });
  const i = PAGES.indexOf(cur.p), prev = PAGES[i - 1], next = PAGES[i + 1];
  $('#sidefoot').innerHTML = `<div style="display:flex;gap:10px;justify-content:space-between">
    ${prev ? `<a class="btn" href="#/page/${prev.id}/${cur.v}" title="${esc(prev.name)}">← Previous page</a>` : '<span></span>'}
    ${next ? `<a class="btn btn--gold" href="#/page/${next.id}/${cur.v}" title="${esc(next.name)}">Next page →</a>` : '<button class="btn btn--gold" data-act="finish2">Save my notes</button>'}
  </div>`;
}
document.addEventListener('click', e => { if (e.target.closest('[data-act=finish2]')) openFinish(); });

/* the page inside has loaded (first time, or after a link inside it) */
function onFrameLoad() {
  let win, doc;
  try { win = cur.ifr.contentWindow; doc = win.document; doc.body; } catch (e) { return; } /* another site: nothing to do */
  cur.win = win; cur.doc = doc;
  const p = byPath[win.location.pathname];
  if (p && p !== cur.p) {
    cur.p = p;
    paintBar(p.name);
    quietHash = true;
    location.hash = `#/page/${p.id}/${cur.v}`;
    paintRail(); paintSide();
  }
  const st = doc.createElement('style');
  st.textContent = `
    html{scrollbar-width:none}::-webkit-scrollbar{display:none}
    #rv-layer{position:fixed;inset:0;z-index:2147483646;pointer-events:none}
    #rv-catch{position:fixed;inset:0;z-index:2147483647;cursor:crosshair;display:none}
    #rv-catch.on{display:block}
    .rv-hl{position:fixed;pointer-events:none;border:2px solid #C9A84D;border-radius:4px;background:rgba(201,168,77,.14);box-shadow:0 0 0 2px rgba(0,0,0,.35);display:none;z-index:2147483646}
    .rv-pin{position:fixed;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50% 50% 50% 4px;display:grid;place-items:center;background:#C9A84D;color:#111;
      font:600 14px/1 Jost,Arial,sans-serif;border:2px solid #111;box-shadow:0 4px 14px rgba(0,0,0,.55);cursor:pointer;pointer-events:auto;padding:0}
    .rv-pin:hover,.rv-pin.on{background:#fff;transform:scale(1.12)}
    .rv-tip{position:fixed;pointer-events:none;background:#C9A84D;color:#111;font:500 13px/1.2 Jost,Arial,sans-serif;padding:6px 10px;border-radius:6px;white-space:nowrap;display:none;z-index:2147483647}`;
  doc.head.appendChild(st);
  const layer = doc.createElement('div'); layer.id = 'rv-layer';
  layer.innerHTML = '<div class="rv-hl"></div>';
  const catcher = doc.createElement('div'); catcher.id = 'rv-catch';
  const tip = doc.createElement('div'); tip.className = 'rv-tip'; tip.textContent = 'Click to leave a note here';
  doc.body.append(layer, catcher, tip);
  catcher.addEventListener('mousemove', e => {
    const t = pickAt(e.clientX, e.clientY);
    showBox(t && t.el);
    tip.style.display = 'block';
    tip.style.left = Math.min(e.clientX + 14, win.innerWidth - tip.offsetWidth - 8) + 'px';
    tip.style.top = (e.clientY + 16) + 'px';
  });
  catcher.addEventListener('mouseleave', () => { showBox(null); tip.style.display = 'none'; });
  catcher.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const draft = draftAt(e.clientX, e.clientY);
    setNoting(false);
    if (draft) openEditor(draft);
  });
  layer.addEventListener('click', e => {
    const b = e.target.closest('.rv-pin');
    if (b) { const n = S.notes.find(x => x.id === b.dataset.id); if (n) openEditor(n); }
  });
  doc.addEventListener('keydown', e => { if (e.key === 'Escape' && cur && cur.noting) setNoting(false); });
  setNoting(cur.noting);
  startPins();
  if (cur.focus) { const n = S.notes.find(x => x.id === cur.focus); cur.focus = null; if (n) setTimeout(() => goToNote(n), 600); }
}
function setNoting(on) {
  if (!cur) return;
  cur.noting = on;
  const b = main.querySelector('[data-act=note]');
  if (b) { b.setAttribute('aria-pressed', on); b.textContent = on ? 'Cancel' : '+ Add a note'; }
  main.querySelector('.stage__tools') && main.querySelector('.stage__tools').classList.toggle('is-noting', on);
  cur.frame.classList.toggle('is-noting', on);
  if (cur.doc) {
    const c = cur.doc.getElementById('rv-catch');
    if (c) c.classList.toggle('on', on);
    if (!on) { showBox(null); const t = cur.doc.querySelector('.rv-tip'); if (t) t.style.display = 'none'; }
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && cur && cur.noting && !$('.veil')) setNoting(false); });
function showBox(el) {
  const hl = cur.doc && cur.doc.querySelector('.rv-hl');
  if (!hl) return;
  if (!el) { hl.style.display = 'none'; return; }
  const r = el.getBoundingClientRect();
  Object.assign(hl.style, { display: 'block', left: (r.left - 4) + 'px', top: (r.top - 4) + 'px', width: (r.width + 8) + 'px', height: (r.height + 8) + 'px' });
}

/* what is under the click: a block of words, else a photo, else that spot */
const WORDS = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd,td,th,label,summary,button,a,cite,small';
function pickAt(x, y) {
  const doc = cur.doc;
  const els = doc.elementsFromPoint(x, y).filter(e => !e.closest('#rv-layer,#rv-catch,.rv-tip') && e !== doc.documentElement && e !== doc.body);
  if (!els.length) return null;
  for (const e of els.slice(0, 3)) {
    const w = e.closest(WORDS);
    if (w && norm(w.textContent).length > 1 && w.getBoundingClientRect().height < doc.defaultView.innerHeight * 0.9) return { kind: 'text', el: w };
  }
  for (const e of els) {
    if (/^(IMG|VIDEO|CANVAS|PICTURE)$/.test(e.tagName)) return { kind: 'photo', el: e.tagName === 'PICTURE' ? (e.querySelector('img') || e) : e };
    const bg = doc.defaultView.getComputedStyle(e).backgroundImage;
    if (bg && /url\(/.test(bg) && !/data:image\/svg/.test(bg)) return { kind: 'photo', el: e };
    if (e.tagName === 'SECTION' || e.tagName === 'FOOTER' || e.tagName === 'HEADER') break;
  }
  return { kind: 'spot', el: els[0] };
}
/* a path to an element that survives a reload of the page */
function pathOf(el) {
  const parts = [];
  for (let e = el; e && e.nodeType === 1 && e.tagName !== 'BODY'; e = e.parentElement) {
    if (e.id && !/^rv-/.test(e.id)) { parts.unshift('#' + CSS.escape(e.id)); break; }
    const sibs = Array.from(e.parentElement ? e.parentElement.children : []).filter(s => s.tagName === e.tagName);
    parts.unshift(e.tagName.toLowerCase() + (sibs.length > 1 ? `:nth-of-type(${sibs.indexOf(e) + 1})` : ''));
  }
  return parts.join(' > ');
}
function sectionLabel(el) {
  if (el.closest('header')) return 'Header (on every page)';
  if (el.closest('footer')) return 'Footer (on every page)';
  const s = el.closest('section,[role=dialog]');
  if (!s) return '';
  if (s.matches('[role=dialog]')) return 'Pop-up: ' + clip((s.querySelector('h2,h3') || s).textContent, 50);
  const h = s.querySelector('h1,h2,h3');
  return clip(h ? h.textContent : (s.dataset.section || ''), 70);
}
function mediaName(el) {
  const u = el.tagName === 'IMG' ? (el.currentSrc || el.src) : el.tagName === 'VIDEO' ? (el.poster || el.currentSrc) :
    ((cur.doc.defaultView.getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)/) || [])[1] || '');
  const f = decodeURIComponent(String(u).split('?')[0].split('/').pop() || '');
  return { src: u && !/^data:/.test(u) ? u : '', name: f.replace(/-(\d{2,4})w?(?=\.)/, '').replace(/\.(avif|webp|jpe?g|png|gif)$/i, '') };
}
function draftAt(x, y) {
  const t = pickAt(x, y);
  if (!t) return null;
  const el = t.el, r = el.getBoundingClientRect(), win = cur.win, de = cur.doc.documentElement;
  const n = {
    page: cur.p.id, view: cur.v, kind: t.kind, sel: pathOf(el),
    ox: r.width ? +((x - r.left) / r.width).toFixed(3) : 0, oy: r.height ? +((y - r.top) / r.height).toFixed(3) : 0,
    dx: Math.round(x + win.scrollX), dy: Math.round(y + win.scrollY), dw: de.clientWidth, dh: de.scrollHeight,
    sec: sectionLabel(el), check: clip(el.textContent, 80)
  };
  if (t.kind === 'text') n.orig = clip(el.textContent, 400);
  if (t.kind === 'photo') { const m = mediaName(el); n.photo = m.name; n.photoURL = m.src; n.alt = (el.getAttribute('alt') || '').trim(); n.pkind = el.tagName === 'VIDEO' ? 'video' : el.tagName === 'CANVAS' ? 'drawing' : 'photo'; }
  return n;
}
/* find a note's element again (by its path; by its words if the page changed) */
function findEl(n) {
  const doc = cur.doc;
  if (!doc || !n.sel) return null;
  let el = null;
  try { el = doc.querySelector(n.sel); } catch (e) { el = null; }
  const want = norm(n.check).replace(/…$/, '');
  if (el && (!want || norm(el.textContent).startsWith(want.slice(0, 40)))) return el;
  if (want.length > 8) {
    const tag = (n.sel.split('>').pop().trim().match(/^[a-z0-9]+/) || ['*'])[0];
    for (const c of doc.querySelectorAll(tag)) if (norm(c.textContent).startsWith(want.slice(0, 40))) return c;
  }
  return el && !want ? el : null;
}
const visible = el => {
  if (!el || !el.isConnected) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
};

/* pins follow their element every frame (tabs, slides and pop-ups move things) */
let pinRAF = 0;
function stopPins() { cancelAnimationFrame(pinRAF); pinRAF = 0; }
function startPins() {
  stopPins();
  const tick = () => {
    pinRAF = requestAnimationFrame(tick);
    if (!cur || !cur.doc || !cur.doc.getElementById('rv-layer')) return;
    const layer = cur.doc.getElementById('rv-layer');
    const ns = notesOf(cur.p.id).filter(n => n.kind !== 'page' && n.view === cur.v);
    const seen = new Set();
    for (const n of ns) {
      if (!n._el || !n._el.isConnected || n._doc !== cur.doc) { n._el = findEl(n); n._doc = cur.doc; }
      let pin = layer.querySelector(`.rv-pin[data-id="${n.id}"]`);
      const el = n._el;
      if (!visible(el)) { if (pin) pin.style.display = 'none'; continue; }
      const r = el.getBoundingClientRect();
      if (!pin) { pin = cur.doc.createElement('button'); pin.className = 'rv-pin'; pin.dataset.id = n.id; layer.appendChild(pin); }
      pin.textContent = numOf(n);
      pin.style.display = 'grid';
      pin.style.left = (r.left + n.ox * r.width) + 'px';
      pin.style.top = (r.top + n.oy * r.height) + 'px';
      seen.add(n.id);
    }
    layer.querySelectorAll('.rv-pin').forEach(p => { if (!ns.some(n => n.id === p.dataset.id)) p.remove(); });
  };
  tick();
}
function goToNote(n) {
  if (n.view !== cur.v || n.page !== cur.p.id) { location.hash = `#/page/${n.page}/${n.view}/${n.id}`; return; }
  if (n.kind === 'page') return openEditor(n);
  const el = findEl(n);
  if (!visible(el)) { toast('That spot is hidden right now: open the tab, slide or pop-up it is on'); return; }
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  setTimeout(() => { showBox(el); setTimeout(() => showBox(null), 1600); }, 500);
  cur.doc.querySelectorAll('.rv-pin').forEach(p => p.classList.toggle('on', p.dataset.id === n.id));
}

/* ---------- notes list ---------- */
function aboutLine(n) {
  if (n.kind === 'text') return '“' + clip(n.orig, 70) + '”';
  if (n.kind === 'photo') return n.pkind === 'video' ? 'The video' : n.pkind === 'drawing' ? 'The picture' : 'The photo';
  return '';
}
function noteCard(n, tag, attrs) {
  const about = aboutLine(n);
  return `<${tag} class="note" data-id="${n.id}" ${attrs || ''}><span class="pin">${numOf(n)}</span><span>
    <small>${n.kind === 'page' ? 'Whole page' : VIEW_NAME[n.view] + (n.sec ? ' · ' + esc(clip(n.sec, 44)) : '')}</small>
    ${about ? `<p class="was">${esc(about)}</p>` : ''}<p>${esc(clip(n.note, 220))}</p></span></${tag}>`;
}
function paintSide() {
  const body = $('#sidebody');
  if (!body) return;
  const ns = notesOf(cur.p.id);
  body.innerHTML = ns.length ? ns.map(n => noteCard(n, 'button')).join('')
    : `<div class="empty"><strong>No notes on this page yet.</strong><br>Use the page as normal. When you want something changed, press <strong class="gold">+ Add a note</strong> and click the spot.</div>`;
  body.querySelectorAll('.note').forEach(b => {
    const n = S.notes.find(x => x.id === b.dataset.id);
    b.onclick = () => goToNote(n);
    b.ondblclick = () => openEditor(n);
  });
}

/* ---------- the note box ---------- */
function openEditor(n) {
  const isNew = !n.id;
  const pageName = n.page === '_site' ? 'The whole website' : byId[n.page].name;
  const title = n.kind === 'page' ? (n.page === '_site' ? 'About the whole website' : 'About this whole page') : 'What would you like here?';
  const veil = document.createElement('div');
  veil.className = 'veil';
  veil.innerHTML = `
  <div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT">
    <div class="dlg__head"><h2 id="dlgT">${title}</h2><p>${esc(pageName)}${n.kind !== 'page' ? ' · ' + VIEW_NAME[n.view] : ''}${n.sec ? ' · ' + esc(n.sec) : ''}</p></div>
    <div class="dlg__body">
      ${n.kind === 'text' ? `<div class="field"><label>You pointed at</label><div class="now">${esc(n.orig)}</div></div>` : ''}
      ${n.kind === 'photo' && n.photoURL ? `<div class="field"><label>You pointed at this ${n.pkind === 'video' ? 'video' : 'photo'}</label><img class="preview" src="${esc(n.photoURL)}" alt=""></div>` : ''}
      <div class="field"><label for="nt">Your note</label>
        <textarea id="nt" rows="5" placeholder="For example: change this wording to…, use a different photo, add the price here, move this further up">${esc(n.note || '')}</textarea></div>
    </div>
    <div class="dlg__foot">
      ${isNew ? '<span></span>' : '<button class="btn btn--quiet btn--danger" data-x="del">Delete this note</button>'}
      <div class="r"><button class="btn" data-x="cancel">Cancel</button><button class="btn btn--gold" data-x="save">Save note</button></div>
    </div>
  </div>`;
  document.body.appendChild(veil);
  const close = () => { veil.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  veil.addEventListener('mousedown', e => { if (e.target === veil) close(); });
  const ta = $('#nt', veil);
  setTimeout(() => { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 30);
  veil.querySelector('[data-x=cancel]').onclick = close;
  const del = veil.querySelector('[data-x=del]');
  if (del) del.onclick = () => {
    if (!confirm('Delete this note?')) return;
    S.notes = S.notes.filter(x => x.id !== n.id);
    save(); close(); toast('Note deleted'); refresh();
  };
  veil.querySelector('[data-x=save]').onclick = () => {
    const note = ta.value.trim();
    if (!note) { ta.focus(); ta.placeholder = 'Please write your note here first'; return; }
    const out = Object.assign({}, n, { note, ts: new Date().toISOString() });
    delete out._el; delete out._doc;
    if (isNew) { out.id = 'n' + (++S.seq) + '-' + Date.now().toString(36); S.notes.push(out); }
    else S.notes[S.notes.findIndex(x => x.id === n.id)] = out;
    save(); close(); toast(isNew ? 'Note saved' : 'Note updated'); refresh();
  };
}
function refresh() {
  if (cur && $('#site')) { paintRail(); paintSide(); }
  else route();
}
let toastT;
function toast(t) {
  let el = $('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = t; clearTimeout(toastT); toastT = setTimeout(() => el.remove(), 2600);
}

/* ---------- every note ---------- */
function renderAllNotes() {
  cur = null;
  paintBar('My notes');
  const groups = [{ id: '_site', name: 'The whole website' }].concat(PAGES).map(p => ({ p, ns: notesOf(p.id) })).filter(g => g.ns.length);
  main.innerHTML = `<section class="over" style="max-width:980px;margin:0 auto">
    <div class="over__head"><div><div class="eyebrow">${esc(S.name)}</div><h1>My notes</h1>
    <p>${S.notes.length ? `${S.notes.length} note${S.notes.length > 1 ? 's' : ''} on ${groups.length} page${groups.length > 1 ? 's' : ''}. Click one to see it on the page.` : 'No notes yet. Open a page and press “+ Add a note”.'}</p></div>
    <div class="over__tools"><a class="btn" href="#/">← All pages</a>${S.notes.length ? '<button class="btn btn--gold" data-act="finish3">Save my notes</button>' : ''}</div></div>
    ${groups.map(({ p, ns }) => `<h2 class="group">${esc(p.name)}</h2>${ns.map(n =>
      noteCard(n, 'a', `href="${p.id === '_site' ? '#/notes' : `#/page/${p.id}/${n.view}/${n.id}`}" style="text-decoration:none"`)).join('')}`).join('')}
  </section>`;
  const f = main.querySelector('[data-act=finish3]');
  if (f) f.onclick = openFinish;
  main.querySelectorAll('a.note[href="#/notes"]').forEach(a => a.onclick = e => { e.preventDefault(); openEditor(S.notes.find(x => x.id === a.dataset.id)); });
}

/* ---------- save: one Excel file ---------- */
function stamp() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function fileName() { return `Miracle website notes - ${S.name.replace(/[^\w ]+/g, '').trim() || 'notes'} - ${stamp()}.xlsx`; }
function openFinish() {
  if (cur) setNoting(false);
  const n = S.notes.length;
  const pages = new Set(S.notes.map(x => x.page)).size;
  const veil = document.createElement('div');
  veil.className = 'veil';
  veil.innerHTML = `<div class="dlg finish" role="dialog" aria-modal="true" aria-labelledby="fT">
    <div class="dlg__head"><h2 id="fT">${n ? 'Save your notes' : 'No notes yet'}</h2>
      <p>${n ? 'Save the file, then email it to ' + esc(B.sendTo) + '.' : 'Open a page, press “+ Add a note” and click the spot. Your notes will appear here.'}</p></div>
    ${n ? `<div class="dlg__body">
      <div class="sum"><div><strong>${n}</strong>note${n > 1 ? 's' : ''}</div><div><strong>${pages}</strong>page${pages > 1 ? 's' : ''}</div></div>
      <ol>
        <li><b>1</b><div><button class="btn btn--gold btn--big" data-x="save">Save my notes</button><span class="ok" data-ok></span><p>It goes to your <strong>Downloads</strong> folder as “${esc(fileName())}”.</p></div></li>
        <li><b>2</b><div><strong style="color:#fff;font-weight:500">Email that file to ${esc(B.sendTo)}</strong><p>Attach it to an email, like a photo or a document.</p></div></li>
      </ol>
      <p class="hint">Your notes stay here too, so you can come back, add more and save again.</p>
    </div>` : ''}
    <div class="dlg__foot">${n ? '<button class="btn btn--quiet btn--danger" data-x="wipe">Clear all notes and start again</button>' : '<span></span>'}<div class="r"><button class="btn" data-x="close">${n ? 'Keep going' : 'OK'}</button></div></div>
  </div>`;
  document.body.appendChild(veil);
  const close = () => veil.remove();
  veil.addEventListener('mousedown', e => { if (e.target === veil) close(); });
  veil.querySelector('[data-x=close]').onclick = close;
  const wipe = veil.querySelector('[data-x=wipe]');
  if (wipe) wipe.onclick = () => {
    if (!confirm('This deletes all ' + n + ' notes from this computer. Have you already sent the file?\n\nPress OK to delete them.')) return;
    S.notes = []; S.seq = 0; save(); close(); route();
  };
  const sb = veil.querySelector('[data-x=save]');
  if (sb) sb.onclick = () => {
    download(buildXLSX(), fileName(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    veil.querySelector('[data-ok]').textContent = '✓ Saved';
  };
}
function download(bytes, name, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([bytes], { type }));
  a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}

/* ---------- a small XLSX writer (stored zip, inline strings) ---------- */
const enc = new TextEncoder();
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function concat(arr) { const n = arr.reduce((a, b) => a + b.length, 0); const o = new Uint8Array(n); let p = 0; for (const a of arr) { o.set(a, p); p += a.length; } return o; }
function zip(files) {
  const parts = [], central = []; let off = 0;
  for (const [name, data] of files) {
    const nb = enc.encode(name), d = enc.encode(data), c = crc32(d);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint16(12, 0x21, true); h.setUint32(14, c, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, nb.length, true);
    parts.push(new Uint8Array(h.buffer), nb, d);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
    ch.setUint16(14, 0x21, true); ch.setUint32(16, c, true); ch.setUint32(20, d.length, true); ch.setUint32(24, d.length, true);
    ch.setUint16(28, nb.length, true); ch.setUint32(42, off, true);
    central.push(new Uint8Array(ch.buffer), nb);
    off += 30 + nb.length + d.length;
  }
  const cs = central.reduce((a, b) => a + b.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cs, true); e.setUint32(16, off, true);
  return concat(parts.concat(central, [new Uint8Array(e.buffer)]));
}
const xe = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
const HEAD = ['No.', 'Page', 'Seen on', 'Part of the page', 'Pointing at', 'Note', 'Done?', 'Saved', 'Page address', 'Pin (for the board)'];
function buildXLSX() {
  const widths = [6, 24, 11, 32, 46, 64, 9, 17, 34, 30];
  const order = ['_site'].concat(PAGES.map(p => p.id));
  const R = [];
  for (const id of order) for (const n of notesOf(id)) {
    const p = byId[id];
    const pin = n.kind === 'page' ? { page: id, kind: 'page' } : { page: id, view: n.view, kind: n.kind, sel: n.sel, ox: n.ox, oy: n.oy, check: n.check, dx: n.dx, dy: n.dy, dw: n.dw, dh: n.dh };
    R.push([
      '', id === '_site' ? 'The whole website' : p.name, n.kind === 'page' ? '' : VIEW_NAME[n.view], n.sec || '',
      n.kind === 'text' ? 'Words: ' + n.orig : n.kind === 'photo' ? (n.pkind === 'video' ? 'Video' : n.pkind === 'drawing' ? 'Picture' : 'Photo') + (n.photo ? ': ' + n.photo : '') + (n.alt ? ' (' + n.alt + ')' : '') : n.kind === 'page' ? 'The whole page' : 'This spot',
      n.note, '', n.ts ? new Date(n.ts).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '', id === '_site' ? '' : '/' + p.path,
      JSON.stringify(pin)
    ]);
  }
  const col = i => String.fromCharCode(65 + i);
  const cell = (r, c, v, s) => `<c r="${col(c)}${r}" t="inlineStr" s="${s}"><is><t xml:space="preserve">${xe(v)}</t></is></c>`;
  let sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>`;
  sheet += `<row r="1" ht="26" customHeight="1">${cell(1, 0, 'Miracle Detail · website notes from ' + S.name, 3)}</row>`;
  sheet += `<row r="2">${cell(2, 0, `${R.length} notes · saved ${new Date().toLocaleString('en-GB')} · review board of ${B.made}`, 4)}</row>`;
  sheet += `<row r="3" ht="22" customHeight="1">${HEAD.map((h, i) => cell(3, i, h, 1)).join('')}</row>`;
  R.forEach((vals, i) => {
    vals[0] = String(i + 1);
    sheet += `<row r="${i + 4}">${vals.map((v, c) => cell(i + 4, c, v, c === 5 ? 5 : c === 9 ? 4 : 2)).join('')}</row>`;
  });
  sheet += `</sheetData><autoFilter ref="A3:${col(HEAD.length - 1)}${R.length + 3}"/><pageSetup orientation="landscape"/></worksheet>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="15"/><name val="Calibri"/></font><font><sz val="10"/><color rgb="FF8A857B"/><name val="Calibri"/></font></fonts>
<fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF111111"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFBF3DC"/></patternFill></fill></fills>
<borders count="2"><border/><border><bottom style="thin"><color rgb="FFD9D6CF"/></bottom></border></borders>
<cellStyleXfs count="1"><xf/></cellStyleXfs>
<cellXfs count="6"><xf/>
<xf fontId="1" fillId="2" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf fontId="2" applyFont="1"/>
<xf fontId="3" applyFont="1"/>
<xf fillId="3" borderId="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
</cellXfs></styleSheet>`;
  return zip([
    ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`],
    ['_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Notes" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">Notes!$A$3:$${col(HEAD.length - 1)}$${R.length + 3}</definedName></definedNames></workbook>`],
    ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/worksheets/sheet1.xml', sheet],
    ['xl/styles.xml', styles]
  ]);
}

/* ---------- open a notes file (the team, to see Paul's pins) ---------- */
async function unzip(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let e = buf.length - 22;
  while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error('not a zip');
  const count = dv.getUint16(e + 10, true);
  let p = dv.getUint32(e + 16, true);
  const out = {};
  for (let i = 0; i < count; i++) {
    const method = dv.getUint16(p + 10, true), size = dv.getUint32(p + 20, true);
    const nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(buf.subarray(p + 46, p + 46 + nl));
    const start = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
    const raw = buf.subarray(start, start + size);
    out[name] = method === 0 ? raw : new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
    p += 46 + nl + xl + cl;
  }
  return out;
}
function openNotesFile() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.xlsx';
  inp.onchange = async () => {
    try {
      const files = await unzip(new Uint8Array(await inp.files[0].arrayBuffer()));
      const td = new TextDecoder();
      const dom = s => new DOMParser().parseFromString(td.decode(s), 'application/xml');
      const shared = files['xl/sharedStrings.xml'] ? [...dom(files['xl/sharedStrings.xml']).getElementsByTagName('si')].map(si => si.textContent) : [];
      const sheetName = Object.keys(files).find(f => /^xl\/worksheets\/sheet\d+\.xml$/.test(f));
      const rowsX = [...dom(files[sheetName]).getElementsByTagName('row')];
      const val = c => (c.getAttribute('t') === 's' ? shared[+c.textContent] || '' : c.textContent);
      const table = rowsX.map(r => { const o = {}; [...r.getElementsByTagName('c')].forEach(c => { o[c.getAttribute('r').replace(/\d+/g, '')] = val(c); }); return o; });
      const hi = table.findIndex(r => r.A === 'No.');
      const who = (table[0] && table[0].A || '').replace(/^.*notes from /, '') || 'notes file';
      const notes = [];
      for (const r of table.slice(hi + 1)) {
        if (!r.F) continue;
        let pin = {};
        try { pin = JSON.parse(r.J || '{}'); } catch (e) { pin = {}; }
        const base = { id: 'f' + notes.length + '-' + Date.now().toString(36), note: r.F, ts: '', sec: r.D || '' };
        if (!pin.page || !byId[pin.page]) { notes.push(Object.assign(base, { page: '_site', view: 'm', kind: 'page' })); continue; }
        const words = (r.E || '').replace(/^Words: /, '');
        notes.push(Object.assign(base, pin, pin.kind === 'text' ? { orig: words } : {}, pin.kind === 'photo' ? { photo: (r.E || '').replace(/^\w+: /, '') } : {}));
      }
      if (S.notes.length && !confirm(`Show the ${notes.length} notes from ${who}?\n\nThe notes on this computer (${S.notes.length}) will be replaced. Save them first if you need them.`)) return;
      S.notes = notes; S.name = S.name || who; save(); toast(`${notes.length} notes from ${who}`); location.hash = '#/notes'; route();
    } catch (e) { console.error(e); alert('Sorry, that file could not be read. Please choose the Excel file saved from this board.'); }
  };
  inp.click();
}

/* go */
paintBar('');
route();
})();
