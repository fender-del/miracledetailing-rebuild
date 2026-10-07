/* ============================================================
   deck.js — the projects as a deck of cards (HB Body reference),
   white and gold cards alternating (Fender 02/10).

   Moved by two arrow buttons under the deck (Ed 06/10: "rather than
   drag, a simple button that goes left to right"):
     next     the top card slides off to the right, drops behind the
              deck and slides in under the last card while the rest
              step forward;
     back     the last card comes back from the right onto the top.
   A click during a move is kept and played straight after, so quick
   clicks are never lost. Arrow keys do the same. On touch screens the
   card can still be swiped (a phone user expects it): it follows the
   finger, turning round the point it is held by, and is filed when
   thrown past a quarter of its width. Links on the top card stay
   clickable. The deck deals itself in the first time it is seen.

   Base CSS (no JS, reduced motion) shows a swipeable row instead.
   ============================================================ */
import { gsap, Draggable, env, whenSeen, $, $$ } from './core.js';
import { sfx, rubbing } from './sound.js';

const SHADOW = '0 30px 70px rgba(0,0,0,.45)';
const LIFTED = '0 60px 110px rgba(0,0,0,.6)';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function deck() {
  const root = $('[data-deck]');
  if (!root) return;
  const sec = root.closest('section');
  let cards = $$('[data-card]', root);
  if (cards.length < 2) return;

  root.classList.add('is-stack');
  sec && sec.classList.add('is-deck');
  gsap.set(cards, { transformPerspective: 1400, boxShadow: SHADOW });

  const mobile = () => window.matchMedia('(max-width: 767px)').matches;
  /* Waiting cards fan out to the right, each a little smaller and
     turned a little more. From the fourth on they share the last place,
     so a filed card visibly slides in at the back. */
  const slot = i => {
    const k = Math.min(i, 3), m = mobile();
    return { x: k * (m ? 14 : 64), y: k * (m ? 10 : 8), rotation: k * (m ? 2.4 : 3.5), rotationY: 0, scale: 1 - k * 0.04, autoAlpha: 1 };
  };
  const mix = (a, b, t) => {
    const o = {};
    for (const key of ['x', 'y', 'rotation', 'scale']) o[key] = a[key] + (b[key] - a[key]) * t;
    return o;
  };

  const order = () => {
    cards.forEach((c, i) => {
      gsap.set(c, { zIndex: cards.length - i });
      c.toggleAttribute('inert', i !== 0);
      c.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });
  };
  const layout = animate => {
    order();
    cards.forEach((c, i) => gsap.to(c, Object.assign(slot(i), {
      duration: animate ? 0.9 : 0, ease: 'elastic.out(1, 0.75)', overwrite: 'auto'
    })));
  };
  /* While the top card is dragged clear (t 0→1), the ones below move
     up the deck by up to half a place. */
  const peek = t => {
    for (let i = 1; i < Math.min(cards.length, 5); i++) {
      gsap.set(cards[i], mix(slot(i), slot(i - 1), t * 0.5));
    }
  };

  let drag = null, busy = false, queued = null;
  const status = document.createElement('p');
  status.className = 'sr';
  status.setAttribute('aria-live', 'polite');
  root.appendChild(status);
  const all = cards.slice();
  const nav = sec && $('[data-deck-nav]', sec);
  const count = nav && $('[data-deck-n]', nav);
  const announce = () => {
    status.textContent = cards[0].getAttribute('aria-label') || '';
    if (count) count.textContent = String(all.indexOf(cards[0]) + 1).padStart(2, '0');
  };
  /* After a move: play a click that came in during it. */
  const done = () => {
    busy = false; bind(); announce();
    const q = queued; queued = null;
    if (q) q();
  };

  /* File the top card at the back. dir: -1 out to the left, 1 to the
     right; v: its speed at release (px/ms), so a flick keeps going. */
  const next = (dir = 1, v = { x: 0, y: 0 }) => {
    if (busy) { queued = () => next(dir); return; }
    busy = true;
    const top = cards[0];
    const w = top.offsetWidth, m = mobile();
    const cur = gsap.getProperty(top);
    const speed = Math.min(2.2, Math.abs(v.x));
    const back = slot(Math.min(cards.length - 1, 3));
    sfx('whoosh', speed / 1.4 + 0.3);
    /* the new top card answers straight away (Fender 06/10: on a phone
       a swipe during the old card's flight was lost); the old one keeps
       flying to the back on its own */
    gsap.timeline()
      .to(top, {
        x: dir * w * (m ? 0.78 : 0.86), y: cur('y') + clamp(v.y * 140, -90, 90) - (m ? 14 : 28),
        rotation: cur('rotation') + dir * (8 + speed * 6), rotationY: 0, scale: 1.02, boxShadow: LIFTED,
        duration: 0.42 - speed * 0.06, ease: 'power2.out', overwrite: 'auto'
      })
      .add(() => {
        cards.push(cards.shift());
        order();
        cards.slice(0, -1).forEach((c, i) => gsap.to(c, Object.assign(slot(i), {
          duration: 0.9, ease: 'elastic.out(1, 0.8)', overwrite: 'auto'
        })));
        done();
      })
      .to(top, Object.assign({}, back, { boxShadow: SHADOW, duration: 0.72, ease: 'power3.inOut' }), '>-0.02')
      .add(() => sfx('land'), '>-0.12');
  };
  /* Bring the back card to the front, from the right (where the cards
     go out). */
  const prev = () => {
    if (busy) { queued = prev; return; }
    busy = true;
    sfx('whoosh', 0.4);
    const back = cards[cards.length - 1];
    cards.unshift(cards.pop());
    gsap.set(back, { zIndex: cards.length + 1, autoAlpha: 1 });
    gsap.fromTo(back, { x: back.offsetWidth * 0.7, y: -28, rotation: 10 }, {
      x: 0, y: 0, rotation: 0, scale: 1, duration: 0.75, ease: 'expo.out',
      onComplete: () => { sfx('settle'); layout(true); done(); }
    });
    cards.slice(1).forEach((c, i) => gsap.to(c, Object.assign(slot(i + 1), { duration: 0.7, ease: 'expo.out' })));
  };

  /* Swipe: touch screens only (a mouse uses the buttons). */
  function bind() {
    if (drag) { drag.kill(); drag = null; }
    if (env.fine) return;
    const card = cards[0];
    const proxy = document.createElement('div');
    const set = {
      x: gsap.quickSetter(card, 'x', 'px'), y: gsap.quickSetter(card, 'y', 'px'),
      r: gsap.quickSetter(card, 'rotation', 'deg'), ry: gsap.quickSetter(card, 'rotationY', 'deg')
    };
    let w = 1, grab = 0, lastX = 0, lastY = 0, lastT = 0, vx = 0, vy = 0, lean = 0;
    drag = Draggable.create(proxy, {
      trigger: card, type: 'x', allowContextMenu: true, minimumMovement: 4,
      onPress(e) {
        if (busy) return;
        gsap.killTweensOf(card);
        const r = card.getBoundingClientRect();
        w = r.width;
        const py = e.touches ? e.touches[0].clientY : e.clientY;
        grab = clamp((py - r.top) / r.height - 0.5, -0.5, 0.5);   // -.5 top … .5 bottom
        gsap.set(proxy, { x: 0, y: 0 });
        this.update();
        lastX = 0; lastY = 0; lastT = performance.now(); vx = 0; vy = 0; lean = 0;
        gsap.to(card, { scale: 1.035, boxShadow: LIFTED, duration: 0.35, ease: 'power3.out' });
        sfx('lift');
      },
      onDrag() {
        if (busy) return;
        const t = performance.now(), dt = Math.max(1, t - lastT);
        vx = vx * 0.5 + 0.5 * (this.x - lastX) / dt;
        vy = vy * 0.5 + 0.5 * (this.y - lastY) / dt;
        lastX = this.x; lastY = this.y; lastT = t;
        const x = this.x, y = this.y * 0.35;
        lean += (clamp(vx * 14, -16, 16) - lean) * 0.25;
        set.x(x); set.y(y - Math.abs(x) * 0.03);
        /* turns round the point it is held by */
        set.r(x / w * 18 * (grab < 0 ? 1 : -1) * (0.35 + Math.abs(grab) * 1.3));
        set.ry(lean);
        peek(clamp(Math.abs(x) / (w * 0.6), 0, 1));
        rubbing(Math.hypot(vx, vy));
      },
      onRelease() {
        rubbing(0);
        if (busy) return;
        const x = this.x;
        if (Math.abs(x) > w * 0.26 || Math.abs(vx) > 0.55) {
          next(x < 0 || (x === 0 && vx < 0) ? -1 : 1, { x: vx, y: vy });
        } else {
          gsap.to(card, {
            x: 0, y: 0, rotation: 0, rotationY: 0, scale: 1, boxShadow: SHADOW,
            duration: 1.1, ease: 'elastic.out(1, 0.5)', overwrite: 'auto'
          });
          sfx('settle');
          cards.slice(1, 5).forEach((c, i) => gsap.to(c, Object.assign(slot(i + 1), { duration: 0.8, ease: 'power3.out', overwrite: 'auto' })));
        }
      }
    })[0];
  }

  root.addEventListener('keydown', e => {
    if (e.target.closest('a') && (e.key === 'Enter' || e.key === ' ')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  if (nav) {
    nav.hidden = false;
    $('[data-deck-next]', nav).addEventListener('click', () => next(1));
    $('[data-deck-prev]', nav).addEventListener('click', prev);
  }

  /* Deal in: the cards land one by one from the right, last card first,
     then the top card gives a small tug to show it moves. */
  order();
  cards.forEach((c, i) => gsap.set(c, Object.assign(slot(i), { x: window.innerWidth * 0.6, y: -40, rotation: 14, autoAlpha: 0 })));
  busy = true;
  let dealt = false;
  const deal = () => {
    if (dealt) return;
    dealt = true;
    const tl = gsap.timeline({ onComplete: done });
    cards.slice().reverse().forEach((c, n) => {
      const i = cards.length - 1 - n;
      tl.to(c, Object.assign(slot(i), { duration: 0.9, ease: 'expo.out' }), n * 0.07)
        .call(() => sfx('deal', n), null, n * 0.07 + 0.12);
    });
    if (!mobile()) {
      tl.to(cards[0], { x: -46, rotation: -2.5, duration: 0.45, ease: 'power2.out' }, '+=0.15')
        .to(cards[0], { x: 0, rotation: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)' });
    }
  };
  whenSeen(root, deal, 0.22);

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (!busy) layout(false); }, 200); });
}
