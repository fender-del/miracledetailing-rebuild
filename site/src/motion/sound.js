/* ============================================================
   sound.js — the site's sound (Fender 02/10, round 5), made in the
   browser with Web Audio: nothing to download, nothing licensed.

   Browsers allow sound only after the visitor clicks, taps or presses
   a key, so it starts on that first touch (unless they switched it off
   on an earlier visit). The header switch turns it off and on; the
   choice is remembered. Silent while the tab is hidden.

     bed      a slow pad whose chord changes with the section in the
              middle of the screen, a soft bell now and then over it,
              and air that rises with the speed of the scroll
     touches  menu letters tick as they roll, buttons breathe, clicks
              tap; cards lift, rub, whoosh and land; the story's beats
              land low, the closing line swells, glass rings over a low
              bloom as the services arrive; each county rings a note
   ============================================================ */
import { $, $$ } from './core.js';

const KEY = 'md-sound';
const AC = window.AudioContext || window.webkitAudioContext;
let ctx = null, out, dry, wet, noise, padF, air, airF, rub, on = false;
let chord = '', voices = [], section = 'hero', bellT = 0;

const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const pref = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
const keep = v => { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } };

/* One chord per section, voiced low and close; the bells pick from the
   same notes two octaves up. */
const CHORDS = {
  hero:     [45, 52, 55, 59, 60],   // A minor 9
  story:    [41, 48, 52, 57, 59],   // F major 7 #11
  services: [48, 55, 59, 62, 64],   // C major 9
  projects: [38, 50, 57, 60, 64],   // D minor 9
  reviews:  [43, 50, 57, 59, 64],   // G 6/9
  coverage: [40, 47, 50, 55, 57],   // E minor 7 add 11
  book:     [45, 52, 55, 59, 60]
};
/* the counties' notes: E minor pentatonic, rising with the distance */
const SCALE = [64, 67, 69, 71, 74, 76, 79];

/* ---------- graph ---------- */
function build() {
  ctx = new AC({ latencyHint: 'interactive' });
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.008; comp.release.value = 0.3;
  out = ctx.createGain(); out.gain.value = 0;
  out.connect(comp); comp.connect(ctx.destination);
  dry = ctx.createGain(); dry.connect(out);
  const verb = ctx.createConvolver(); verb.buffer = impulse(3.2, 2.8);
  wet = ctx.createGain(); wet.gain.value = 0.45; wet.connect(verb); verb.connect(out);

  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  /* the pad: detuned saws through a lowpass that drifts slowly */
  padF = ctx.createBiquadFilter(); padF.type = 'lowpass'; padF.frequency.value = 760; padF.Q.value = 0.5;
  const lfo = ctx.createOscillator(), depth = ctx.createGain();
  lfo.frequency.value = 0.05; depth.gain.value = 240;
  lfo.connect(depth); depth.connect(padF.frequency); lfo.start();
  const padOut = ctx.createGain(); padOut.gain.value = 0.35;
  padF.connect(padOut); padOut.connect(dry); padOut.connect(wet);

  /* air: noise that opens with the scroll speed */
  air = ctx.createGain(); air.gain.value = 0;
  airF = ctx.createBiquadFilter(); airF.type = 'bandpass'; airF.frequency.value = 500; airF.Q.value = 0.7;
  loop().connect(airF); airF.connect(air); air.connect(dry); air.connect(wet);

  /* rub: a card sliding on the deck */
  rub = ctx.createGain(); rub.gain.value = 0;
  const rf = ctx.createBiquadFilter(); rf.type = 'bandpass'; rf.frequency.value = 1400; rf.Q.value = 0.9;
  loop().connect(rf); rf.connect(rub); rub.connect(dry);
}

function impulse(sec, decay) {
  const n = Math.round(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay);
  }
  return b;
}
function loop() {
  const s = ctx.createBufferSource();
  s.buffer = noise; s.loop = true; s.start();
  return s;
}

/* ---------- small parts ---------- */
const now = () => ctx.currentTime + 0.005;
function amp(dest, pan) {
  const g = ctx.createGain(); g.gain.value = 0.0001;
  let node = g;
  if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p; }
  [].concat(dest).forEach(x => node.connect(x));
  return g;
}
/* attack to peak, then an exponential fall over d seconds */
function env(g, t, a, peak, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}
function tone(type, f, t, len, g) {
  const o = ctx.createOscillator();
  o.type = type; o.frequency.setValueAtTime(f, t); o.connect(g);
  o.start(t); o.stop(t + len + 0.05);
  return o;
}
function hiss(t, len, type, f, q, g) {
  const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter();
  s.buffer = noise; fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
  s.connect(fl); fl.connect(g);
  s.start(t, Math.random() * 1.2); s.stop(t + len + 0.05);
  return fl;
}
/* a struck bell: three inharmonic partials, the high ones die first */
function bell(m, t, peak, len) {
  [[1, 1], [2.76, 0.32], [5.4, 0.1]].forEach(([r, k], i) => {
    const g = amp([dry, wet]);
    tone('sine', mtof(m) * r, t, len, g);
    env(g, t, 0.004, peak * k, len / (1 + i * 1.5));
  });
}
/* glass: two close partials beat slowly over a soft attack */
function glass(m, t, peak, len) {
  [[1, 1], [2.005, 0.32], [3.02, 0.08]].forEach(([r, k], i) => {
    const g = amp([dry, wet]);
    tone('sine', mtof(m) * r, t, len, g);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak * k, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len / (1 + i));
  });
}
function pluck(m, t, peak) {
  const g = amp([dry, wet]), lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.setValueAtTime(4200, t); lp.frequency.exponentialRampToValueAtTime(900, t + 1.2);
  lp.connect(g);
  tone('triangle', mtof(m), t, 1.8, lp);
  const g2 = amp([dry, wet]);
  tone('sine', mtof(m + 12), t, 1, g2);
  env(g, t, 0.003, peak, 1.7);
  env(g2, t, 0.003, peak * 0.25, 0.8);
}
function thud(t, f0, f1, peak, len) {
  const g = amp(dry), o = tone('sine', f0, t, len, g);
  o.frequency.exponentialRampToValueAtTime(f1, t + len * 0.7);
  env(g, t, 0.004, peak, len);
}

/* ---------- the touches ---------- */
const FX = {
  roll(n = 5) {
    const t = now();
    for (let i = 0; i < Math.min(n, 9); i++) {
      const g = amp(dry, -0.2 + i * 0.05);
      tone('triangle', 2100 + Math.random() * 400, t + i * 0.022, 0.04, g);
      env(g, t + i * 0.022, 0.002, 0.06, 0.035);
    }
  },
  breathe() {
    const t = now(), g = amp([dry, wet]);
    const f = hiss(t, 0.5, 'bandpass', 700, 1.4, g);
    f.frequency.exponentialRampToValueAtTime(2600, t + 0.42);
    env(g, t, 0.12, 0.12, 0.36);
  },
  tap() {
    const t = now();
    thud(t, 260, 120, 0.09, 0.12);
    const g = amp(dry);
    hiss(t, 0.03, 'highpass', 3200, 0.7, g);
    env(g, t, 0.002, 0.025, 0.025);
  },
  lift() {
    const t = now(), g = amp(dry);
    hiss(t, 0.08, 'highpass', 2200, 0.8, g);
    env(g, t, 0.004, 0.06, 0.06);
    thud(t, 640, 430, 0.04, 0.08);
  },
  whoosh(s = 1) {
    const t = now(), k = Math.min(1, s), g = amp([dry, wet], 0);
    const f = hiss(t, 0.6, 'bandpass', 420, 1.1, g);
    f.frequency.exponentialRampToValueAtTime(1800, t + 0.16);
    f.frequency.exponentialRampToValueAtTime(560, t + 0.55);
    env(g, t, 0.14, 0.14 + 0.16 * k, 0.42);
  },
  land() {
    const t = now();
    thud(t, 150, 62, 0.16, 0.22);
    const g = amp(dry);
    hiss(t, 0.06, 'lowpass', 1100, 0.7, g);
    env(g, t, 0.003, 0.07, 0.06);
  },
  settle() { thud(now(), 130, 70, 0.08, 0.18); },
  deal(i = 0) {
    const t = now(), g = amp(dry, 0.5 - Math.min(i, 5) * 0.08);
    hiss(t, 0.06, 'highpass', 2600, 0.8, g);
    env(g, t, 0.003, 0.08, 0.05);
  },
  beat() {
    const t = now();
    thud(t, 74, 40, 0.24, 1.3);
    bell(76, t + 0.02, 0.035, 2.6);
  },
  swell() {
    const t = now(), g = amp([dry, wet]);
    const f = hiss(t, 1.9, 'lowpass', 280, 0.9, g);
    f.frequency.exponentialRampToValueAtTime(3200, t + 1.3);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 1.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.85);
    const s = amp([dry, wet]);
    tone('sine', mtof(45), t, 2, s);
    s.gain.setValueAtTime(0.0001, t);
    s.gain.exponentialRampToValueAtTime(0.11, t + 1.2);
    s.gain.exponentialRampToValueAtTime(0.0001, t + 1.95);
  },
  /* entering the services (Fender 02/10, round 6, picked from three):
     two glass notes, E6 then C7, over a soft C3 + G3 bloom */
  bright() {
    const t = now();
    glass(88, t, 0.06, 2.2);
    glass(96, t + 0.1, 0.072, 2.8);
    [48, 55].forEach(m => {
      const g = amp([dry, wet]);
      tone('sine', mtof(m), t, 2.2, g);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.055, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2);
    });
  },
  note(i = 0) { pluck(SCALE[Math.min(i, SCALE.length - 1)], now(), 0.12); }
};
/* how close two of the same may come (ms) */
const GAP = { roll: 90, breathe: 140, tap: 50, lift: 80, whoosh: 120, land: 120, settle: 150, deal: 20, beat: 600, swell: 900, bright: 1500, note: 80 };
const last = {};

/* Other modules call these; they do nothing while the sound is off. */
export function sfx(name, arg) {
  if (!on || !ctx || ctx.state !== 'running') return;
  const t = performance.now();
  if (last[name] && t - last[name] < (GAP[name] || 40)) return;
  last[name] = t;
  try { FX[name](arg); } catch (e) { /* never break the page for a sound */ }
}
/* the card under the hand: v = its speed in px/ms */
export function rubbing(v) {
  if (!on || !ctx) return;
  const t = ctx.currentTime, k = Math.min(1, Math.abs(v) / 1.6);
  rub.gain.setTargetAtTime(k * 0.06, t, 0.05);
}

/* ---------- the bed ---------- */
function setChord(name) {
  const notes = CHORDS[name] || CHORDS.hero, id = notes.join();
  if (!ctx || id === chord) return;
  chord = id;
  const t = ctx.currentTime;
  voices.forEach(v => {
    v.g.gain.cancelScheduledValues(t);
    v.g.gain.setTargetAtTime(0, t, 1.1);
    v.o.forEach(o => o.stop(t + 7));
  });
  voices = notes.map((m, i) => {
    const g = ctx.createGain();
    g.gain.value = 0; g.connect(padF);
    const o = [-7, 7].map(c => {
      const x = ctx.createOscillator();
      x.type = 'sawtooth'; x.frequency.value = mtof(m); x.detune.value = c + Math.random() * 4 - 2;
      x.connect(g); x.start(t);
      return x;
    });
    if (i === 0) {
      const sub = ctx.createOscillator();
      sub.type = 'sine'; sub.frequency.value = mtof(m - 12); sub.connect(g); sub.start(t);
      o.push(sub);
    }
    g.gain.setTargetAtTime(i === 0 ? 0.05 : 0.03, t, 1.4);
    return { g, o };
  });
}
function bells() {
  clearTimeout(bellT);
  bellT = setTimeout(() => {
    if (on && !document.hidden && ctx && ctx.state === 'running') {
      const notes = CHORDS[section] || CHORDS.hero;
      bell(notes[1 + Math.floor(Math.random() * (notes.length - 1))] + 24, now(), 0.022, 3.4);
    }
    bells();
  }, 4200 + Math.random() * 5000);
}

/* ---------- switch, first touch, scroll, sections ---------- */
export function sound() {
  const btn = $('[data-sound]');
  if (!AC || !btn) return;
  btn.hidden = false;
  const mark = () => {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('is-on', on);
  };
  const start = () => {
    if (!ctx) build();
    if (ctx.state !== 'running') ctx.resume();
    if (on) return;
    on = true; mark();
    const t = ctx.currentTime;
    out.gain.cancelScheduledValues(t);
    out.gain.setTargetAtTime(0.9, t, 0.7);
    chord = '';
    setChord(section);
    bells();
  };
  const stop = () => {
    on = false; mark();
    if (!ctx) return;
    out.gain.cancelScheduledValues(ctx.currentTime);
    out.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    setTimeout(() => { if (!on) ctx.suspend(); }, 700);
  };
  btn.addEventListener('click', () => {
    if (on) { stop(); keep('off'); } else { start(); keep('on'); }
  });

  /* The first click, tap or key anywhere (the ones a browser accepts
     as permission to play); a touch that only scrolls does not count. */
  if (pref() !== 'off') {
    const evs = ['pointerdown', 'touchend', 'keydown'];
    const done = () => evs.forEach(n => window.removeEventListener(n, first, true));
    const first = e => {
      if (e.target.closest && e.target.closest('[data-sound]')) { done(); return; }
      if (e.type === 'pointerdown' && e.pointerType !== 'mouse') return;
      if (e.type === 'keydown' && e.key === 'Escape') return;
      start();
      if (ctx.state === 'running') done();
      else ctx.resume().then(() => { if (ctx.state === 'running') done(); });
    };
    evs.forEach(n => window.addEventListener(n, first, true));
  }

  /* A scroll cannot start sound (browsers count only a click, tap or
     key). The first time the visitor scrolls without one, the switch
     dances for three seconds as an invitation (Fender 02/10, round 6),
     and the header stays in view meanwhile. */
  if (pref() !== 'off') {
    const hd = btn.closest('[data-hd]');
    const invite = () => {
      if (window.scrollY < 40) return;
      window.removeEventListener('scroll', invite);
      if (on) return;
      btn.classList.add('is-invite');
      if (hd) hd.classList.add('is-inviting');
      setTimeout(() => { btn.classList.remove('is-invite'); if (hd) hd.classList.remove('is-inviting'); }, 3200);
    };
    window.addEventListener('scroll', invite, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (on) ctx.resume();
  });

  /* air follows the scroll speed, then settles */
  let y = window.scrollY, ts = performance.now();
  window.addEventListener('scroll', () => {
    const t = performance.now(), v = (window.scrollY - y) / Math.max(1, t - ts) * 1000;
    y = window.scrollY; ts = t;
    if (!on || !ctx) return;
    const c = ctx.currentTime, k = Math.min(1, Math.abs(v) / 4500);
    air.gain.cancelScheduledValues(c);
    air.gain.setTargetAtTime(k * 0.07, c, 0.06);
    air.gain.setTargetAtTime(0, c + 0.14, 0.35);
    airF.frequency.setTargetAtTime(380 + k * 1100, c, 0.1);
  }, { passive: true });

  /* the section crossing the middle of the screen sets the chord; the
     services chime as they arrive from the story */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const s = e.target.getAttribute('data-section');
      if (s === 'services' && section === 'story') sfx('bright');
      section = CHORDS[s] ? s : section;
      if (on) setChord(section);
    }), { rootMargin: '-50% 0px -50% 0px' });
    $$('main [data-section], section[data-section]').forEach(s => io.observe(s));
  }

  /* menu letters, buttons, clicks */
  $$('.hd__link').forEach(a => a.addEventListener('mouseenter', () => sfx('roll', $$('.roll__c', a).length)));
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const b = e.target.closest && e.target.closest('.btn, .svc, .more__row, .pcard__go, .link-arrow');
    if (b && !(e.relatedTarget && b.contains(e.relatedTarget))) sfx('breathe');
  });
  document.addEventListener('pointerdown', e => {
    if (e.target.closest && e.target.closest('a, button, label, summary, select')) sfx('tap');
  });

  /* debug: ?snd=meter exposes the parts for the level check (tools/) */
  if (/[?&]snd=meter/.test(location.search)) window.__snd = { fx: FX, get ctx() { return ctx; }, get out() { return out; }, get padF() { return padF; }, start, setChord };
}
