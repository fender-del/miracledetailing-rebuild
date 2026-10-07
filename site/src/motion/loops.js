/* ============================================================
   loops.js — infinite rows (place names, car names, reviews).

   Every loop: clones its first set until the row is overfull, moves
   on GSAP's ticker, wraps seamlessly. Marquees speed up with scroll
   velocity and turn with scroll direction; the reviews loop can be
   thrown with inertia. All stop on hover and while off screen.
   ============================================================ */
import { gsap, ScrollTrigger, Draggable, env, $, $$ } from './core.js';

function makeLoop(root, track, { speed = 0.5, velocity = false, draggable = false }) {
  const originals = Array.from(track.children);
  const firstClone = () => track.children[originals.length];

  /* Clone whole sets until there is at least one viewport of spare row. */
  const fill = () => {
    let guard = 0;
    while ((track.scrollWidth < root.clientWidth * 2 + 200 || track.children.length < originals.length * 2) && guard++ < 12) {
      originals.forEach(n => {
        const c = n.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        /* a row of links (the makes, 06/10) stays tappable in every copy,
           out of the tab order; anything else is inert */
        const links = c.querySelectorAll('a');
        if (links.length) links.forEach(a => { a.tabIndex = -1; });
        else c.setAttribute('inert', '');
        track.appendChild(c);
      });
    }
  };
  root.classList.add('is-running');
  root.scrollLeft = 0;
  fill();

  let setW = 0;
  const measure = () => { setW = firstClone().offsetLeft - originals[0].offsetLeft; };
  measure();

  let x = 0, dir = -1, boost = 0, paused = false, hover = false, dragging = false, visible = true;
  const wrap = v => gsap.utils.wrap(-setW, 0, v);
  const setX = gsap.quickSetter(track, 'x', 'px');

  gsap.ticker.add((t, dt) => {
    if (!visible) return;
    const f = dt / 16.67;
    if (!paused && !hover && !dragging) x += dir * speed * f * (1 + boost);
    boost *= Math.pow(0.9, f);
    setX(wrap(x));
  });

  if (velocity) {
    ScrollTrigger.create({
      trigger: root, start: 'top bottom', end: 'bottom top',
      onUpdate(self) {
        const v = self.getVelocity();
        boost = Math.max(boost, Math.min(Math.abs(v) / 260, 9));
        if (Math.abs(v) > 40) dir = v > 0 ? -1 : 1;
      }
    });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { rootMargin: '100px 0px' }).observe(root);
  }

  if (env.fine) {
    root.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
    root.addEventListener('pointerleave', () => { hover = false; });
  }

  if (draggable) {
    const proxy = document.createElement('div');
    let start = 0;
    Draggable.create(proxy, {
      type: 'x', trigger: root, inertia: true, dragClickables: true,
      onPressInit() { gsap.set(proxy, { x: 0 }); },
      onPress() { start = x; dragging = true; root.classList.add('is-dragging'); },
      onDrag() { x = start + this.x; },
      onThrowUpdate() { x = start + this.x; },
      onRelease() { root.classList.remove('is-dragging'); if (!this.isThrowing) dragging = false; },
      onThrowComplete() { dragging = false; }
    });
  }

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fill(); measure(); }, 200); });
}

export function marquees() {
  $$('[data-marquee]').forEach(root => {
    const track = $('.mq__track', root);
    makeLoop(root, track, {
      speed: +root.dataset.speed || 0.5,
      velocity: root.hasAttribute('data-velocity')
    });
  });
}

export function reviews() {
  $$('[data-loop]').forEach(root => {
    makeLoop(root, $('.loop__track', root), {
      speed: +root.dataset.speed || 0.4,
      draggable: root.hasAttribute('data-draggable')
    });
  });
}
