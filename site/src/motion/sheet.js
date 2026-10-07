/* ============================================================
   sheet.js — "What's included" as a sheet from the bottom, for any
   card that asks (07/10, Fender on the mobile page: the package cards
   were taller than a phone screen; "nút what's included -> thông tin
   đầy đủ hiện thành 1 thẻ chèn thêm từ dưới lên", like the packages
   page). Same look as block 53's sheet (.pks).

     <li data-sheet-card>
       <p data-sheet-kick>…</p> <h3 data-sheet-name>…</h3>
       <div data-sheet-part>…</div>  (copied into the sheet, in order)
       <button data-sheet-open>What's included</button>
     </li>

   One sheet for the page. Closes on the ×, the backdrop, Escape or a
   pull down on its top; focus goes back to the button.
   ============================================================ */
import { env, $, $$ } from './core.js';

const CLOSE = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6"/></svg>';

export function sheets() {
  const btns = $$('[data-sheet-open]');
  if (!btns.length) return;
  let sheet = null, opener = null;

  const close = () => {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('is-open');
    document.documentElement.classList.remove('pks-lock');
    if (env.lenis) env.lenis.start();
    setTimeout(() => { sheet.hidden = true; }, env.motion ? 450 : 0);
    if (opener) opener.focus({ preventScroll: true });
  };

  const build = () => {
    sheet = document.createElement('div');
    sheet.className = 'pks';
    sheet.setAttribute('data-theme', 'light');
    sheet.hidden = true;
    sheet.innerHTML = '<div class="pks__bg" data-close></div><div class="pks__panel" role="dialog" aria-modal="true" aria-labelledby="sheet-t">'
      + '<div class="pks__top" data-grab><p class="pks__kick"></p><h3 class="pks__name" id="sheet-t"></h3>'
      + `<button class="pks__x" type="button" data-close aria-label="Close">${CLOSE}</button></div><div class="pks__body"></div></div>`;
    document.body.appendChild(sheet);
    $$('[data-close]', sheet).forEach(el => el.addEventListener('click', close));
    sheet.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    /* a pull down on the top closes it */
    const top = $('[data-grab]', sheet), pane = $('.pks__panel', sheet);
    let y0 = null;
    top.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, { passive: true });
    top.addEventListener('touchmove', e => {
      if (y0 == null) return;
      pane.style.transition = 'none';
      pane.style.transform = `translateY(${Math.max(0, e.touches[0].clientY - y0)}px)`;
    }, { passive: true });
    top.addEventListener('touchend', e => {
      if (y0 == null) return;
      const dy = e.changedTouches[0].clientY - y0;
      y0 = null;
      pane.style.transition = ''; pane.style.transform = '';
      if (dy > 90) close();
    }, { passive: true });
  };

  const open = btn => {
    const card = btn.closest('[data-sheet-card]');
    if (!card) return;
    if (!sheet) build();
    opener = btn;
    const k = $('[data-sheet-kick]', card), n = $('[data-sheet-name]', card);
    $('.pks__kick', sheet).textContent = k ? k.textContent.trim() : '';
    $('.pks__name', sheet).innerHTML = n ? n.innerHTML : '';
    const body = $('.pks__body', sheet);
    body.innerHTML = '';
    $$('[data-sheet-part]', card).forEach(p => {
      const c = p.cloneNode(true);
      [c, ...$$('[data-reveal],[id]', c)].forEach(el => { el.removeAttribute('data-reveal'); el.removeAttribute('id'); el.removeAttribute('style'); });
      body.appendChild(c);
    });
    body.scrollTop = 0;
    sheet.hidden = false;
    document.documentElement.classList.add('pks-lock');
    if (env.lenis) env.lenis.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
    $('.pks__x', sheet).focus({ preventScroll: true });
  };

  btns.forEach(b => b.addEventListener('click', () => open(b)));
}
