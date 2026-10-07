/* ============================================================
   ui.js — behaviour that has to work with motion off too:
   phone menu and the three-step form.
   ============================================================ */
import { gsap, env, $, $$ } from './core.js';

const root = document.documentElement;

/* ---------- Phone menu ----------
   No JS: the burger is a link to #menu and :target opens it.
   With JS: a dialog with a mask-slide open, focus kept inside. */
export function menu() {
  const openBtn = $('[data-menu-open]'), m = $('[data-menu]'), closeBtn = $('[data-menu-close]');
  if (!openBtn || !m) return;
  const items = $$('[data-menu-item]', m);
  let isOpen = false, back = null;

  const set = on => {
    if (on === isOpen) return;
    isOpen = on;
    openBtn.setAttribute('aria-expanded', String(on));
    if (on) {
      back = document.activeElement;
      m.classList.add('is-open');
      root.classList.add('menu-open');
      if (env.lenis) env.lenis.stop();
      if (env.motion) {
        gsap.fromTo(m, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut', clearProps: 'clipPath' });
        gsap.fromTo(items, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.3 });
      }
      closeBtn.focus();
    } else {
      const done = () => {
        m.classList.remove('is-open');
        root.classList.remove('menu-open');
        if (env.lenis) env.lenis.start();
      };
      if (env.motion) gsap.to(m, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: () => { gsap.set(m, { clearProps: 'clipPath' }); done(); } });
      else done();
      if (back && back.focus) back.focus();
    }
  };

  openBtn.addEventListener('click', e => { e.preventDefault(); set(true); });
  closeBtn.addEventListener('click', e => { e.preventDefault(); set(false); });
  m.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (a && !a.hasAttribute('data-menu-close')) {
      /* release the page first so an in-page link can scroll */
      m.classList.remove('is-open'); root.classList.remove('menu-open');
      if (env.lenis) env.lenis.start();
      isOpen = false; openBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', e => {
    if (!isOpen) return;
    if (e.key === 'Escape') { set(false); return; }
    if (e.key === 'Tab') {
      const f = $$('a[href],button:not([disabled])', m);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  /* If the page was opened on #menu (no-JS link shared), start closed. */
  if (location.hash === '#menu') history.replaceState(null, '', location.pathname);
}

/* ---------- Three-step form ----------
   No JS: three fieldsets stacked into one ordinary form that posts to
   Netlify. With JS: one step at a time, each checked before the next. */
export function form() {
  const f = $('[data-qform]');
  if (!f) return;
  const steps = $$('[data-qstep]', f);
  const prog = $$('.qf__prog li', f);
  const status = $('[data-qstatus]', f);
  const err = $('[data-qerr]', f);
  let cur = 0;
  f.classList.add('is-stepped');

  const show = (i, dirn) => {
    steps.forEach((s, j) => s.classList.toggle('is-on', j === i));
    prog.forEach((p, j) => { p.classList.toggle('is-on', j === i); p.classList.toggle('is-done', j < i); });
    if (env.motion && dirn) gsap.fromTo(steps[i], { autoAlpha: 0, x: 36 * dirn }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'expo.out' });
    status.textContent = `Step ${i + 1} of ${steps.length}: ${$('legend', steps[i]).textContent}`;
    cur = i;
  };

  const bad = (el, on) => { el.setAttribute('aria-invalid', on ? 'true' : 'false'); };
  const check = i => {
    const s = steps[i];
    let first = null;
    $$('input[required]', s).forEach(inp => {
      let ok = inp.value.trim().length > 0;
      if (ok && inp.type === 'tel') ok = inp.value.replace(/\D/g, '').length >= 10;
      bad(inp, !ok);
      if (!ok && !first) first = inp;
    });
    const year = $('#q-year', s);
    if (year && year.value.trim()) {
      const y = +year.value.trim();
      const ok = /^\d{4}$/.test(year.value.trim()) && y >= 1900 && y <= new Date().getFullYear() + 1;
      bad(year, !ok); if (!ok && !first) first = year;
    }
    const email = $('#q-email', s);
    if (email && email.value.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      bad(email, !ok); if (!ok && !first) first = email;
    }
    const picks = $$('input[name=work]', s);
    if (picks.length) {
      const ok = picks.some(p => p.checked);
      err.hidden = ok;
      if (!ok && !first) first = picks[0];
    }
    const files = $('[data-qfiles]', s);
    if (files && files.files.length) {
      const total = Array.from(files.files).reduce((n, x) => n + x.size, 0);
      const ok = files.files.length <= 4 && total <= 8 * 1024 * 1024;
      bad(files, !ok);
      if (!ok) $('[data-qfiles-out]', s).textContent = 'Up to 4 photos and 8 MB in total, please. Larger sets are easiest on WhatsApp.';
      if (!ok && !first) first = files;
    }
    if (first) { first.focus(); return false; }
    return true;
  };

  $$('[data-qnext]', f).forEach(b => b.addEventListener('click', () => {
    if (!check(cur)) return;
    show(cur + 1, 1);
    $('legend', steps[cur]).focus({ preventScroll: true });
  }));
  $$('[data-qback]', f).forEach(b => b.addEventListener('click', () => {
    show(cur - 1, -1);
    $('legend', steps[cur]).focus({ preventScroll: true });
  }));
  $$('input[name=work]', f).forEach(p => p.addEventListener('change', () => { if (p.checked) err.hidden = true; }));

  const files = $('[data-qfiles]', f);
  if (files) files.addEventListener('change', () => {
    const n = files.files.length;
    bad(files, false);
    $('[data-qfiles-out]', f).textContent = n
      ? `${n} photo${n === 1 ? '' : 's'} ready: ${Array.from(files.files).map(x => x.name).join(', ')}`
      : 'Photos help Paul see the paint before he calls. You can also send them on WhatsApp.';
  });

  /* Enter in a text field moves to the next step instead of submitting early. */
  f.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('input') && cur < steps.length - 1) {
      e.preventDefault();
      $('[data-qnext]', steps[cur]).click();
    }
  });

  f.addEventListener('submit', e => {
    e.preventDefault();
    if (!check(cur)) return;
    const btn = $('button[type=submit]', f);
    btn.disabled = true;
    fetch('/', { method: 'POST', body: new FormData(f) })
      .then(r => { if (!r.ok) throw new Error(r.status); done(true); })
      .catch(() => done(false));
  });

  const done = ok => {
    const box = $('[data-qdone]', f);
    if (!ok) {
      /* the phone link already in the box comes from site.js */
      const p = $('p:last-child', box), tel = $('a[href^="tel:"]', box);
      $('.qf__done-h', box).textContent = 'That did not send.';
      p.textContent = 'This preview is not connected to the inbox yet. Please call or WhatsApp Paul on ';
      p.appendChild(tel); p.append('.');
    }
    f.classList.add('is-sent');
    box.hidden = false;
    if (env.motion) gsap.from(box, { autoAlpha: 0, y: 20, duration: 0.8, ease: 'expo.out' });
    box.focus();
  };

  show(0, 0);
  status.textContent = '';
}
