/* ============================================================
   journal.js — the YouTube film in a post (block 61): a poster until
   pressed, then the player (youtube-nocookie, playing). Nothing from
   YouTube loads before the press. Without JS the link opens YouTube.
   ============================================================ */
import { $$ } from './core.js';

export function youtube() {
  $$('[data-yt]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1&rel=0`;
    f.title = a.dataset.ytTitle || 'YouTube video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    const box = document.createElement('div');
    box.className = 'yt';
    box.appendChild(f);
    a.replaceWith(box);
    f.focus();
  }));
}
