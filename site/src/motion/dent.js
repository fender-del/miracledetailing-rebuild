/* ============================================================
   dent.js — the PDR page (09/10; markup block 59, page
   src/pages/17-pdr.js).

     dents()   [data-dent-sec]   block 59: desktop, the picture beside
                                 the five steps changes with the step
                                 level with it, the number turns over
               .scards--versus   phones: one switch between the two lists

   First built the same day as a panel drawn in code (a light board's
   lines bending round a dent); Fender asked for realistic close-up
   photos instead, so the stage now crossfades one picture per step.
   ============================================================ */
import { gsap, env, $, $$ } from './core.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const pad = n => String(n).padStart(2, '0');
const DESK = '(min-width: 1024px)';

export function dents() {
  $$('[data-dent-sec]').forEach(reader);
  $$('.scards--versus').forEach(versus);
}

/* ---------- block 59: the five steps beside one picture ---------- */
function reader(sec) {
  const items = $$('.pdrd__it', sec);
  const pics = $$('[data-dent-pic]', sec);
  if (!items.length) return;
  const digits = $('[data-dent-n]', sec), name = $('[data-dent-name]', sec);
  const names = items.map(li => $('.pdrd__h', li).innerHTML);
  const N = items.length;
  const mq = window.matchMedia(DESK);
  sec.classList.add('is-live');
  if (digits && !digits.firstElementChild) digits.innerHTML = `<span>${digits.textContent}</span>`;

  let cur = -1, nameT = 0;
  const setStep = i => {
    if (i === cur) return;
    const dir = i > cur ? 1 : -1, first = cur === -1;
    cur = i;
    items.forEach((li, j) => { li.classList.toggle('is-on', j === i); li.classList.toggle('is-past', j < i); });
    pics.forEach((p, j) => p.classList.toggle('is-on', j === i));
    if (!digits || !name) return;
    const txt = pad(i + 1);
    if (first || !env.motion || !mq.matches) { digits.innerHTML = `<span>${txt}</span>`; name.innerHTML = names[i]; return; }
    const kids = [...digits.children], old = kids.pop();
    kids.forEach(k => { gsap.killTweensOf(k); k.remove(); });
    gsap.killTweensOf(old);
    gsap.set(old, { position: 'absolute', left: 0, top: 0 });
    const nu = document.createElement('span');
    nu.textContent = txt;
    digits.appendChild(nu);
    gsap.to(old, { yPercent: -110 * dir, duration: 0.6, ease: 'expo.inOut', onComplete: () => old.remove() });
    gsap.fromTo(nu, { yPercent: 110 * dir }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' });
    name.classList.add('is-out');
    clearTimeout(nameT);
    nameT = setTimeout(() => { name.innerHTML = names[i]; name.classList.remove('is-out'); }, 220);
  };

  /* where the reading line (a little above the middle of the screen)
     falls in the list: step i covers i → i+1 */
  const where = () => {
    const line = window.innerHeight * 0.55;
    if (line < items[0].getBoundingClientRect().top) return 0;
    for (let i = 0; i < N; i++) {
      const r = items[i].getBoundingClientRect();
      if (line < r.bottom || i === N - 1) return clamp(i + (line - r.top) / r.height, 0, N);
    }
    return N;
  };
  let raf = 0, on = false;
  const update = () => {
    raf = 0;
    if (!on) return;
    const t = where();
    setStep(Math.min(N - 1, Math.floor(clamp(t, 0, N - 0.001))));
    sec.style.setProperty('--dp', (t / N).toFixed(4));
  };
  const ask = () => { if (on && !raf) raf = requestAnimationFrame(update); };
  new IntersectionObserver(es => { on = es[0].isIntersecting; ask(); }, { rootMargin: '120px 0px' }).observe(sec);
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
}

/* ---------- phones: the comparison under one switch ---------- */
function versus(sec) {
  const cards = $$('.scards__grid > .card', sec);
  const track = $('.scards__track', sec);
  if (cards.length !== 2 || !track) return;
  const labels = (sec.getAttribute('data-vs-labels') || 'PDR|Traditional repair').split('|');
  const bar = document.createElement('div');
  bar.className = 'vs-tog';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Show one method');
  const btns = labels.map((l, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = l;
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => pick(i));
    bar.appendChild(b);
    return b;
  });
  track.parentNode.insertBefore(bar, track);
  sec.setAttribute('data-vs', '0');
  let cur = 0;
  const pick = i => {
    if (i === cur) return;
    cur = i;
    sec.setAttribute('data-vs', String(i));
    btns.forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
    /* the card kept out of sight never made its entrance: show it as is */
    [cards[i], ...$$('[data-reveal]', cards[i])].forEach(el => { el.style.visibility = 'visible'; el.style.opacity = ''; });
    if (env.motion) {
      const rows = $$('.card__h, .card__list li', cards[i]);
      gsap.fromTo(rows, { opacity: 0, x: i ? 14 : -14 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out', stagger: 0.035, clearProps: 'opacity,transform' });
    }
  };
  /* a sideways swipe on the list switches too */
  let sx = 0, sy = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && window.matchMedia('(max-width: 767px)').matches) pick(dx < 0 ? 1 : 0);
  }, { passive: true });
}
