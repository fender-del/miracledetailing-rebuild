/* ============================================================
   gallery.js — the archive page: filter chips + a lightbox.
   Always on (every tier): this is how the page works.
     ?make=<key>  preselect a make (old /vehiclemake/<make>/ links)
     ?job=<slug>  open that job (old /gallery/<job>/ links)
   ============================================================ */
import { env, $, $$, ScrollTrigger } from './core.js';

export function gallery() {
  const sec = $('[data-gallery]');
  if (!sec) return;
  const data = JSON.parse($('[data-gal-data]', sec).textContent);
  const chips = $$('.gal__chip', sec);
  const items = $$('.gal__it', sec);
  const status = $('[data-gal-status]', sec);
  const params = new URLSearchParams(location.search);

  /* ---------- filter ---------- */
  const filter = (key, push) => {
    if (!chips.some(c => c.dataset.make === key)) key = 'all';
    let n = 0;
    chips.forEach(c => { const on = c.dataset.make === key; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
    items.forEach(li => { const show = key === 'all' || li.dataset.make === key; li.hidden = !show; if (show) n++; });
    if (status) status.textContent = `${n} cars`;
    if (push) {
      const u = new URL(location.href);
      if (key === 'all') u.searchParams.delete('make'); else u.searchParams.set('make', key);
      u.searchParams.delete('job');
      history.replaceState(null, '', u);
    }
    ScrollTrigger.refresh();
  };
  chips.forEach(c => c.addEventListener('click', () => {
    filter(c.dataset.make, true);
    const bar = c.parentElement;
    bar.scrollTo({ left: c.offsetLeft - bar.clientWidth / 2 + c.offsetWidth / 2, behavior: 'smooth' });
  }));
  if (params.get('make')) filter(params.get('make').toLowerCase(), false);

  /* ---------- lightbox ---------- */
  const lb = $('[data-lb]', sec);
  if (!lb || typeof lb.showModal !== 'function') return;
  const img = $('[data-lb-img]', lb);
  const stage = $('[data-lb-stage]', lb);
  let job = null, i = 0, opener = null;
  const src = (slug, n) => `/assets/gallery/${slug}/${n}-1400.webp`;

  const show = k => {
    const files = job.d.f;
    i = (k + files.length) % files.length;
    const [w, h] = job.d.p[i];
    img.classList.add('is-loading');
    img.width = w; img.height = h;
    img.alt = `${job.d.t}, photo ${i + 1} of ${files.length}`;
    img.onload = () => img.classList.remove('is-loading');
    img.src = src(job.slug, files[i]);
    $('[data-lb-count]', lb).textContent = `${String(i + 1).padStart(2, '0')} / ${String(files.length).padStart(2, '0')}`;
    /* warm the next one */
    const pre = new Image();
    pre.src = src(job.slug, files[(i + 1) % files.length]);
  };
  const open = (slug, from) => {
    const d = data[slug];
    if (!d) return;
    job = { slug, d };
    opener = from || null;
    $('[data-lb-meta]', lb).textContent = d.m;
    $('[data-lb-title]', lb).textContent = d.t;
    $('[data-lb-text]', lb).textContent = d.x || '';
    show(0);
    lb.showModal();
    document.documentElement.classList.add('lb-open');
    if (env.lenis) env.lenis.stop();
    const u = new URL(location.href);
    u.searchParams.set('job', slug);
    history.replaceState(null, '', u);
  };
  const close = () => { if (lb.open) lb.close(); };
  lb.addEventListener('close', () => {
    document.documentElement.classList.remove('lb-open');
    if (env.lenis) env.lenis.start();
    img.removeAttribute('src');
    const u = new URL(location.href);
    u.searchParams.delete('job');
    history.replaceState(null, '', u);
    if (opener) opener.focus();
  });

  $$('[data-job]', sec).forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    open(a.dataset.job, a);
  }));
  $('[data-lb-prev]', lb).addEventListener('click', () => show(i - 1));
  $('[data-lb-next]', lb).addEventListener('click', () => show(i + 1));
  $('[data-lb-close]', lb).addEventListener('click', close);
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
  });
  /* a click on the dark around the photo closes it */
  lb.addEventListener('click', e => { if (e.target === lb || e.target === stage) close(); });
  /* swipe */
  let x0 = null;
  stage.addEventListener('pointerdown', e => { x0 = e.clientX; });
  stage.addEventListener('pointerup', e => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
  });

  const want = params.get('job');
  if (want && data[want]) {
    const card = $(`[data-job="${CSS.escape(want)}"]`, sec);
    if (card) card.closest('.gal__it').scrollIntoView({ block: 'center' });
    open(want, card);
  }
}
