/* ============================================================
   Miracle Detail · website review board.
   Paul opens one file, sees every page, clicks anywhere and writes
   what he would like there. Notes stay on his computer
   (localStorage) until he presses "Save my notes", which saves one
   small Excel file for him to email back. Opening that file here
   again ("Open a notes file") puts the pins back on the pages.
   ============================================================ */
(() => {
'use strict';
const B = window.BOARD;
const PAGES = B.pages;
const byId = Object.fromEntries(PAGES.map(p => [p.id, p]));
const KEY = 'miracle-review-' + B.key;
const VIEW_NAME = { d: 'Computer', m: 'Phone' };
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clip = (s, m) => { s = String(s || '').replace(/\s+/g, ' '); return s.length > m ? s.slice(0, m - 1) + '…' : s; };
const ICON = {
  d: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
  m: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></svg>'
};

/* ---------- saved state ---------- */
let S = { name: '', notes: [], seq: 0, view: 'd', mode: 'cards', zoom: 'fit' };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { /* private window: notes live until the tab closes */ }
let storeOK = true;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); storeOK = true; } catch (e) { storeOK = false; }
  paintBar();
}
const notesOf = id => S.notes.filter(n => n.page === id);
const numOf = n => notesOf(n.page).indexOf(n) + 1;

/* ---------- pictures (base64 in the file, decoded on demand) ---------- */
const urls = {};
function imgURL(file) {
  if (urls[file]) return urls[file];
  const el = document.getElementById('f:' + file);
  if (!el) return (urls[file] = 'out/shots/' + file); /* working copy, served from disk */
  const bin = atob(el.textContent.trim());
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return (urls[file] = URL.createObjectURL(new Blob([buf], { type: 'image/jpeg' })));
}
const loaded = {};
function loadImg(file) {
  if (!loaded[file]) loaded[file] = new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = imgURL(file); });
  return loaded[file];
}

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
function route() {
  closeTip();
  window.scrollTo(0, 0);
  const h = location.hash.replace(/^#\/?/, '');
  if (!S.name) return renderWelcome();
  const parts = h.split('/');
  if (parts[0] === 'page' && byId[parts[1]]) return renderPage(parts[1], parts[2] === 'm' ? 'm' : (parts[2] === 'd' ? 'd' : S.view), parts[3]);
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
    <p class="lead">This shows all ${PAGES.length} pages of the new Miracle Detail website, as they look on a computer and on a phone.</p>
    <ol class="steps">
      <li><b>1</b><div><strong>Open a page</strong><p>Pick any page from the overview.</p></div></li>
      <li><b>2</b><div><strong>Click wherever you want something changed</strong><p>A box opens: write what you would like there. A gold pin marks each note. Where a part of the page changes when you click or swipe it (tabs, before and after photos), a gold <em>“more views”</em> button shows each version.</p></div></li>
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

/* ---------- overview ---------- */
function viewSwitch(cur, attr) {
  return `<div class="seg" role="group" aria-label="Computer or phone">${['d', 'm'].map(v =>
    `<button ${attr}="${v}" aria-pressed="${v === cur}">${ICON[v]}${VIEW_NAME[v]}</button>`).join('')}</div>`;
}
/* gold dots on a thumbnail, placed in % of its width and height */
function dotsFor(p, v) {
  const L = p[v], H = L.shotH / L.scale;
  return notesOf(p.id).filter(n => n.view === v && n.kind !== 'page').map(n =>
    `<i class="dot" style="left:${(n.x / L.w * 100).toFixed(2)}%;top:${(n.y / H * 100).toFixed(3)}%"></i>`).join('');
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
        <p>Click a page to open it, then click anywhere on it you would like something changed. ${total ? `You have <strong class="gold">${total} note${total > 1 ? 's' : ''}</strong> so far.` : ''}</p>
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
  /* every thumbnail at once (they are small): nothing waits for a scroll */
  main.querySelectorAll('img[data-file]').forEach(i => { i.src = imgURL(i.dataset.file); });
  /* cards: hovering glides down the whole page */
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
  const n = notesOf(p.id).length;
  const L = p[v], w = v === 'm' ? 120 : 240;
  return `<a class="card" href="#/page/${p.id}/${v}">
    <div class="card__win"><div class="strip"><img data-file="${L.thumb}" alt="" width="${w}" height="${Math.round(L.shotH / L.scale / L.w * w)}"><div style="position:absolute;inset:0">${dotsFor(p, v)}</div></div></div>
    <div class="card__meta"><strong>${esc(p.name)}</strong>${n ? `<span class="count">${n}</span>` : '<span class="card__go">Open →</span>'}</div>
  </a>`;
}
function wallHTML(v, groups) {
  const W = v === 'm' ? 120 : 200;
  return `<p class="hint" style="margin:0 0 12px">Every page, top to bottom, side by side. Drag to move around, click a page to open it.</p>
  <div class="wall ${v === 'm' ? 'wall--m' : ''}"><div class="wall__row">
  ${groups.map((g, gi) => (gi ? '<span class="wall__group"></span>' : '') + PAGES.filter(p => p.group === g).map(p => {
    const L = p[v];
    return `<div class="wall__col"><h3><a href="#/page/${p.id}/${v}">${esc(p.name)}</a></h3>
      <a class="wall__pic" href="#/page/${p.id}/${v}" draggable="false"><img data-file="${L.thumb}" alt="" width="${W}" height="${Math.round(L.shotH / L.scale / L.w * W)}">
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

/* ---------- one page ---------- */
let cur = null; /* { p, v, L, k (display px per css px), paper, stage } */
function renderPage(id, v, focusNote) {
  const p = byId[id];
  if (S.view !== v) { S.view = v; save(); }
  const L = p[v];
  paintBar(p.name);
  const groups = [...new Set(PAGES.map(q => q.group))];
  main.innerHTML = `
  <div class="pv">
    <nav class="rail" aria-label="Pages">
      <a class="back" href="#/">← All pages</a>
      ${groups.map(g => `<h4>${esc(g)}</h4>` + PAGES.filter(q => q.group === g).map(q => {
        const n = notesOf(q.id).length;
        return `<a href="#/page/${q.id}/${v}" ${q.id === id ? 'aria-current="page"' : ''}><span>${esc(q.name)}</span>${n ? `<span class="count">${n}</span>` : ''}</a>`;
      }).join('')).join('')}
    </nav>
    <div class="stage" id="stage">
      <div class="stage__tools">
        <div class="grp">${viewSwitch(v, 'data-pv')}${v === 'd' ? `<div class="seg" role="group" aria-label="Size"><button data-zoom="fit" aria-pressed="${S.zoom !== 'big'}">Fit</button><button data-zoom="big" aria-pressed="${S.zoom === 'big'}">Bigger</button></div>` : ''}</div>
        <span class="tip"><b>Click</b> wherever you would like something changed.</span>
        <button class="btn" data-act="pagenote">Note about this whole page</button>
      </div>
      <div class="paper ${v === 'm' ? 'paper--m' : ''}" id="paper"></div>
    </div>
    <aside class="side">
      <div class="side__head"><h3>Notes on this page</h3></div>
      <div class="side__body" id="sidebody"></div>
      <div class="side__foot">${nextPrev(id, v)}</div>
    </aside>
  </div>`;
  const stage = $('#stage'), paper = $('#paper');
  const avail = stage.clientWidth - 48;
  const k = v === 'm' ? 1 : (S.zoom === 'big' ? 1 : Math.min(1, avail / L.w));
  paper.style.width = Math.round(L.w * k) + 'px';
  paper.style.height = (L.shotH / L.scale * k).toFixed(1) + 'px';
  /* every picture of the page at once: nothing waits for the scroll */
  paper.innerHTML = L.tiles.map(t => `<img class="tile" src="${imgURL(t.file)}" decoding="async" alt="" style="height:${(t.h / L.scale * k).toFixed(2)}px">`).join('') +
    '<div id="ovl"></div><div class="hl" id="hl" hidden></div><div id="pins"></div><div id="sbars"></div>';
  cur = { p, v, L, k, paper, stage, state: null };
  paintStates();

  main.querySelectorAll('[data-pv]').forEach(b => b.onclick = () => { location.hash = `#/page/${id}/${b.dataset.pv}`; });
  main.querySelectorAll('[data-zoom]').forEach(b => b.onclick = () => {
    const at = stage.scrollTop / k;
    S.zoom = b.dataset.zoom; save(); renderPage(id, v);
    cur.stage.scrollTop = at * cur.k;
  });
  main.querySelector('[data-act=pagenote]').onclick = () => openEditor({ page: id, view: v, kind: 'page' });
  paper.addEventListener('mousemove', onHover);
  paper.addEventListener('mouseleave', () => { $('#hl').hidden = true; closeTip(); });
  paper.addEventListener('click', onPaperClick);
  $('#sbars').addEventListener('click', onBarClick);
  paintPins();
  paintSide();
  if (focusNote) { const n = S.notes.find(x => x.id === focusNote); if (n) setTimeout(() => showNote(n, true), 80); }
}
function nextPrev(id, v) {
  const i = PAGES.findIndex(p => p.id === id);
  const prev = PAGES[i - 1], next = PAGES[i + 1];
  return `<div style="display:flex;gap:10px;justify-content:space-between">
    ${prev ? `<a class="btn" href="#/page/${prev.id}/${v}" title="${esc(prev.name)}">← Previous page</a>` : '<span></span>'}
    ${next ? `<a class="btn btn--gold" href="#/page/${next.id}/${v}" title="${esc(next.name)}">Next page →</a>` : '<button class="btn btn--gold" data-act="finish2">Save my notes</button>'}
  </div>`;
}
document.addEventListener('click', e => { if (e.target.closest('[data-act=finish2]')) openFinish(); });

/* what is under the pointer: the smallest block of words, else the
   smallest photo, else just that spot */
function hitIn(L, cx, cy) {
  let best = null, area = Infinity;
  for (const kind of ['t', 'i']) {
    for (const it of L.items) {
      if (it.k !== kind || !it.v) continue;
      if (cx >= it.x && cx <= it.x + it.w && cy >= it.y && cy <= it.y + it.h) {
        const a = it.w * it.h;
        if (a < area) { area = a; best = it; }
      }
    }
    if (best) return best;
  }
  return null;
}
function cssPoint(e) {
  const r = cur.paper.getBoundingClientRect();
  return { x: (e.clientX - r.left) / cur.k, y: (e.clientY - r.top) / cur.k };
}
function boxStyle(el, it, pad = 4) {
  const k = cur.k;
  Object.assign(el.style, { left: (it.x * k - pad) + 'px', top: (it.y * k - pad) + 'px', width: (it.w * k + pad * 2) + 'px', height: (it.h * k + pad * 2) + 'px' });
}
let tipEl = null;
function showTip(text, e) {
  if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'tipbox'; document.body.appendChild(tipEl); }
  tipEl.textContent = text;
  tipEl.style.left = Math.min(e.clientX + 16, innerWidth - tipEl.offsetWidth - 10) + 'px';
  tipEl.style.top = (e.clientY + 18) + 'px';
}
function closeTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
function onHover(e) {
  if (e.target.closest('.sbar')) { $('#hl').hidden = true; closeTip(); return; }
  if (e.target.closest('.pin')) { $('#hl').hidden = true; showTip('Open this note', e); return; }
  const pt = cssPoint(e);
  const it = hitAt(cur.L, pt.x, pt.y, cur.state);
  const hl = $('#hl');
  if (it) { hl.hidden = false; boxStyle(hl, it); } else hl.hidden = true;
  showTip('Click to leave a note here', e);
}
function sectionAt(L, y) {
  let s = null;
  for (const x of L.sections) if (x.name !== 'header' && x.name !== 'footer' && x.y <= y) s = x;
  const ft = L.sections.find(x => x.name === 'footer');
  if (ft && y >= ft.y) s = ft;
  if (!s || y < 90) s = L.sections.find(x => x.name === 'header') || s;
  return s ? s.label : '';
}
const pick = it => ({ x: it.x, y: it.y, w: it.w, h: it.h });
/* the other view of a block on show, if the point falls on it */
function stateUnder(L, x, y, si) {
  const st = si == null || !L.states ? null : L.states[si];
  return st && y >= st.at && y <= st.at + st.h && x <= st.w ? st : null;
}
function hitAt(L, x, y, si) {
  const st = stateUnder(L, x, y, si);
  if (!st) return hitIn(L, x, y);
  const it = hitIn({ items: st.items }, x, y - st.at);
  return it ? Object.assign({}, it, { y: it.y + st.at, s: st.sec }) : null;
}
function targetOf(L, x, y, si) {
  const st = stateUnder(L, x, y, si);
  const it = hitAt(L, x, y, si);
  const sec = it && L.sections[it.s] ? L.sections[it.s].label : sectionAt(L, y);
  const extra = st ? { state: si, stLabel: st.label } : {};
  if (it && it.k === 't') return Object.assign({ kind: 'text', box: pick(it), orig: it.t, sec }, extra);
  if (it) return Object.assign({ kind: 'photo', box: pick(it), photo: it.src, alt: it.alt, pkind: it.kind, sec }, extra);
  return Object.assign({ kind: 'spot', box: null, sec }, extra);
}
function onPaperClick(e) {
  if (e.target.closest('.sbar')) return;
  const pin = e.target.closest('.pin');
  if (pin) { const n = S.notes.find(x => x.id === pin.dataset.id); if (n) { showNote(n, false); openEditor(n); } return; }
  const pt = cssPoint(e);
  openEditor(Object.assign({ page: cur.p.id, view: cur.v, x: Math.round(pt.x), y: Math.round(pt.y) }, targetOf(cur.L, pt.x, pt.y, cur.state)));
}

/* ---------- blocks that look different after a click or a swipe ----------
   Each such block gets a gold button at its top right: "3 more views
   of this part". Picking one lays that photo over the block. */
function stateGroups(L) {
  const groups = new Map();
  (L.states || []).forEach((st, i) => {
    const key = st.sec >= 0 ? 's' + st.sec : 'a' + st.at;
    if (!groups.has(key)) groups.set(key, { key, at: st.at, list: [] });
    const g = groups.get(key);
    g.at = Math.min(g.at, st.at);
    g.list.push(i);
  });
  return [...groups.values()];
}
const LAYERS = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>';
function paintStates(openKey) {
  const L = cur.L, k = cur.k;
  const st = cur.state == null ? null : L.states[cur.state];
  $('#ovl').innerHTML = st ? `<div class="ovl ${st.popup ? 'ovl--pop' : ''}" style="top:${st.at * k}px;width:${st.w * k}px;height:${st.h * k}px"><img src="${imgURL(st.file)}" alt=""></div>` : '';
  $('#sbars').innerHTML = stateGroups(L).map(g => {
    const on = g.list.includes(cur.state);
    const n = g.list.length;
    return `<div class="sbar" data-g="${g.key}" style="top:${g.at * k + 12}px">
      ${on ? `<div class="sbar__row"><span class="sbar__now">Showing: ${esc(st.label)}</span><button class="sbar__back" data-back>× Back to the page</button></div>` : ''}
      <button class="sbar__btn" data-open aria-expanded="${openKey === g.key}">${LAYERS}${on ? 'Other views' : `${n} more view${n > 1 ? 's' : ''} of this part`} ▾</button>
      <div class="sbar__menu" ${openKey === g.key ? '' : 'hidden'}>
        <p>How this part looks after a click or a swipe:</p>
        <button data-s="" aria-current="${!on}">As on the page</button>
        ${g.list.map(i => `<button data-s="${i}" aria-current="${cur.state === i}">${esc(L.states[i].label)}${L.states[i].popup ? ' <em>(opens on top)</em>' : ''}</button>`).join('')}
      </div></div>`;
  }).join('');
}
function onBarClick(e) {
  e.stopPropagation();
  const bar = e.target.closest('.sbar');
  if (!bar) return;
  if (e.target.closest('[data-back]')) return setState(null);
  if (e.target.closest('[data-open]')) {
    const open = bar.querySelector('.sbar__menu').hidden;
    return paintStates(open ? bar.dataset.g : null);
  }
  const b = e.target.closest('[data-s]');
  if (b) setState(b.dataset.s === '' ? null : +b.dataset.s);
}
function setState(i) {
  cur.state = i;
  paintStates();
  paintPins();
  $('#hl').hidden = true;
}

function paintPins() {
  const k = cur.k;
  const shown = n => {
    if (n.kind === 'page' || n.view !== cur.v) return false;
    if (n.state != null) return n.state === cur.state;
    return !stateUnder(cur.L, n.x, n.y, cur.state); /* hidden under the other view on show */
  };
  $('#pins').innerHTML = notesOf(cur.p.id).filter(shown).map(n =>
    `<button class="pin" data-id="${n.id}" style="left:${n.x * k}px;top:${n.y * k}px" aria-label="Note ${numOf(n)}">${numOf(n)}</button>`).join('');
}
function showNote(n, scroll) {
  if (n.view !== cur.v && n.kind !== 'page') { location.hash = `#/page/${n.page}/${n.view}/${n.id}`; return; }
  if (n.kind !== 'page') {
    const want = n.state != null ? n.state : (stateUnder(cur.L, n.x, n.y, cur.state) ? null : cur.state);
    if (want !== cur.state) setState(want);
  }
  cur.paper.querySelectorAll('.pin').forEach(p => p.classList.toggle('is-on', p.dataset.id === n.id));
  document.querySelectorAll('.note').forEach(p => p.classList.toggle('is-on', p.dataset.id === n.id));
  const hl = $('#hl');
  if (n.box) { hl.hidden = false; boxStyle(hl, n.box); }
  if (scroll && n.kind !== 'page') cur.stage.scrollTo({ top: Math.max(0, n.y * cur.k - cur.stage.clientHeight / 3), behavior: 'smooth' });
}

const KIND_LABEL = { text: 'Words', photo: 'Photo', spot: 'Spot', page: 'Whole page' };
function aboutLine(n) {
  if (n.kind === 'text') return '“' + clip(n.orig, 70) + '”';
  if (n.kind === 'photo') return n.pkind === 'video' ? 'The video' : n.pkind === 'drawing' ? 'The picture' : 'The photo';
  return '';
}
function noteCard(n, tag, attrs) {
  const about = aboutLine(n);
  return `<${tag} class="note" data-id="${n.id}" ${attrs || ''}><span class="pin">${numOf(n)}</span><span>
    <small>${n.kind === 'page' ? 'Whole page' : VIEW_NAME[n.view] + (n.sec ? ' · ' + esc(clip(n.sec, 44)) : '') + (n.stLabel ? ' · view: ' + esc(clip(n.stLabel, 30)) : '')}</small>
    ${about ? `<p class="was">${esc(about)}</p>` : ''}<p>${esc(clip(n.note, 220))}</p></span></${tag}>`;
}
function paintSide() {
  const body = $('#sidebody');
  const ns = notesOf(cur.p.id);
  body.innerHTML = ns.length ? ns.map(n => noteCard(n, 'button')).join('')
    : `<div class="empty"><strong>No notes on this page yet.</strong><br>Click anywhere on the page to add one.</div>`;
  body.querySelectorAll('.note').forEach(b => {
    const n = S.notes.find(x => x.id === b.dataset.id);
    b.onmouseenter = () => { if (n.view === cur.v) showNote(n, false); };
    b.onclick = () => { showNote(n, true); openEditor(n); };
  });
}

/* ---------- the note box ---------- */
function openEditor(n) {
  closeTip();
  const isNew = !n.id;
  const pageName = n.page === '_site' ? 'The whole website' : byId[n.page].name;
  const title = n.kind === 'page' ? (n.page === '_site' ? 'About the whole website' : 'About this whole page') : 'What would you like here?';
  const veil = document.createElement('div');
  veil.className = 'veil';
  veil.innerHTML = `
  <div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT">
    <div class="dlg__head"><h2 id="dlgT">${title}</h2><p>${esc(pageName)}${n.kind !== 'page' ? ' · ' + VIEW_NAME[n.view] + ' view' : ''}${n.sec ? ' · ' + esc(n.sec) : ''}${n.stLabel ? ' · view: ' + esc(n.stLabel) : ''}</p></div>
    <div class="dlg__body">
      ${n.kind !== 'page' ? '<canvas class="snip" id="snip" width="10" height="10"></canvas>' : ''}
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
  const snip = $('#snip', veil);
  if (snip) drawSnip(snip, n, isNew ? '+' : String(numOf(n))).catch(() => snip.remove());
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
    if (isNew) { out.id = 'n' + (++S.seq) + '-' + Date.now().toString(36); S.notes.push(out); }
    else S.notes[S.notes.findIndex(x => x.id === n.id)] = out;
    save(); close(); toast(isNew ? 'Note saved' : 'Note updated'); refresh();
  };
}
function refresh() {
  if (cur && document.getElementById('paper')) {
    paintPins(); paintSide();
    main.querySelectorAll('.rail a[href^="#/page/"]').forEach(a => {
      const id = a.getAttribute('href').split('/')[2], n = notesOf(id).length, c = a.querySelector('.count');
      if (n && c) c.textContent = n; else if (n) a.insertAdjacentHTML('beforeend', `<span class="count">${n}</span>`); else if (c) c.remove();
    });
  } else route();
}
let toastT;
function toast(t) {
  let el = $('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = t; clearTimeout(toastT); toastT = setTimeout(() => el.remove(), 1800);
}

/* a cut of the page around the spot, with the pin, so Paul sees where */
async function drawSnip(cv, n, label) {
  const L = byId[n.page][n.view];
  const want = Math.min(L.h, n.view === 'm' ? 700 : 760);
  const top = Math.round(Math.max(0, Math.min(L.h - want, n.y - want / 2)));
  const sc = L.scale, srcW = L.w * sc, srcTop = top * sc, srcH = want * sc;
  const outW = n.view === 'm' ? 560 : 1320;
  const k = Math.min(outW / srcW, 1.5);
  cv.width = Math.round(srcW * k); cv.height = Math.round(srcH * k);
  if (n.view === 'm') cv.style.maxWidth = '280px';
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
  for (const t of L.tiles) {
    if (t.y + t.h < srcTop || t.y > srcTop + srcH) continue;
    const img = await loadImg(t.file);
    ctx.drawImage(img, 0, (t.y - srcTop) * k, srcW * k, t.h * k);
  }
  const f = sc * k;
  const st = n.state != null && L.states ? L.states[n.state] : null;
  if (st) {
    const img = await loadImg(st.file);
    ctx.drawImage(img, 0, (st.at - top) * f, st.w * f, st.h * f);
  }
  if (n.box) {
    ctx.strokeStyle = '#C9A84D'; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(201,168,77,.14)';
    const r = [n.box.x * f - 6, (n.box.y - top) * f - 6, n.box.w * f + 12, n.box.h * f + 12];
    ctx.fillRect(...r); ctx.strokeRect(...r);
  }
  const px = n.x * f, py = (n.y - top) * f, R = 20;
  ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI * 2);
  ctx.fillStyle = '#C9A84D'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#111'; ctx.stroke();
  ctx.fillStyle = '#111'; ctx.font = '600 21px Jost, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, px, py + 1);
}

/* ---------- every note ---------- */
function renderAllNotes() {
  paintBar('My notes');
  const groups = [{ id: '_site', name: 'The whole website' }].concat(PAGES).map(p => ({ p, ns: notesOf(p.id) })).filter(g => g.ns.length);
  main.innerHTML = `<section class="over" style="max-width:980px;margin:0 auto">
    <div class="over__head"><div><div class="eyebrow">${esc(S.name)}</div><h1>My notes</h1>
    <p>${S.notes.length ? `${S.notes.length} note${S.notes.length > 1 ? 's' : ''} on ${groups.length} page${groups.length > 1 ? 's' : ''}. Click one to see it on the page.` : 'No notes yet. Open a page and click wherever you would like something changed.'}</p></div>
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
  closeTip();
  const n = S.notes.length;
  const pages = new Set(S.notes.map(x => x.page)).size;
  const veil = document.createElement('div');
  veil.className = 'veil';
  veil.innerHTML = `<div class="dlg finish" role="dialog" aria-modal="true" aria-labelledby="fT">
    <div class="dlg__head"><h2 id="fT">${n ? 'Save your notes' : 'No notes yet'}</h2>
      <p>${n ? 'Save the file, then email it to ' + esc(B.sendTo) + '.' : 'Open a page and click wherever you would like something changed. Your notes will appear here.'}</p></div>
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
    R.push([
      '', id === '_site' ? 'The whole website' : p.name, n.kind === 'page' ? '' : VIEW_NAME[n.view], (n.sec || '') + (n.stLabel ? ` (view: ${n.stLabel})` : ''),
      n.kind === 'text' ? 'Words: ' + n.orig : n.kind === 'photo' ? (n.pkind === 'video' ? 'Video' : n.pkind === 'drawing' ? 'Picture' : 'Photo') + (n.photo ? ': ' + n.photo : '') + (n.alt ? ' (' + n.alt + ')' : '') : n.kind === 'page' ? 'The whole page' : 'This spot',
      n.note, '', n.ts ? new Date(n.ts).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '', id === '_site' ? '' : '/' + p.path,
      [id, n.view, n.x | 0, n.y | 0, n.kind, n.state == null ? '' : n.state].join('|')
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
  const last = `${col(HEAD.length - 1)}${R.length + 3}`;
  sheet += `</sheetData><autoFilter ref="A3:${last}"/><pageSetup orientation="landscape"/></worksheet>`;
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
      const val = c => { const t = c.getAttribute('t'); if (t === 's') return shared[+c.textContent] || ''; return c.textContent; };
      const table = rowsX.map(r => { const o = {}; [...r.getElementsByTagName('c')].forEach(c => { o[c.getAttribute('r').replace(/\d+/g, '')] = val(c); }); return o; });
      const hi = table.findIndex(r => r.A === 'No.');
      const who = (table[0] && table[0].A || '').replace(/^.*notes from /, '') || 'notes file';
      const notes = [];
      for (const r of table.slice(hi + 1)) {
        const pin = String(r.J || '').split('|');
        const note = r.F || '';
        if (!note) continue;
        const base = { id: 'f' + notes.length + '-' + Date.now().toString(36), note, ts: '' };
        if (!pin[0] || pin[0] === '_site' || !byId[pin[0]]) { notes.push(Object.assign(base, { page: '_site', view: 'd', kind: 'page' })); continue; }
        const [pid, view, x, y, kind] = [pin[0], pin[1] === 'm' ? 'm' : 'd', +pin[2], +pin[3], pin[4]];
        const si = pin[5] === undefined || pin[5] === '' ? null : +pin[5];
        if (kind === 'page') { notes.push(Object.assign(base, { page: pid, view, kind: 'page' })); continue; }
        notes.push(Object.assign(base, { page: pid, view, x, y }, targetOf(byId[pid][view], x, y, si)));
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
