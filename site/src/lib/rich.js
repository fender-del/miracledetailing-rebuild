/* ============================================================
   rich.js (18/11): Paul's formatted text from the DMI CMS (Journal posts).
   A small Markdown: paragraphs, ## heading, ### small heading, **bold**,
   *italic*, [text](link), "- " or "1. " lists, "> " quote. Anything else,
   HTML included, comes out as plain text.
   Photos (26/11, only when the caller passes { photos: true }): a line of
   its own ![alt](src "caption"); src is an upload
   media/<site>/<id>.<webp|jpg>?w=<widths>&size=<W>x<H> (the key only, the
   photo domain is added here from mediaUrl) or a photo already on the web
   (/path, https://...).
   COPY of dmi-cms shared/rich.ts (the CMS preview uses the same code).
   Change it there first, then copy here.
   ============================================================ */
'use strict';

const SAFE_URL = /^(https?:\/\/[^\s]+|\/[^\s]*|#[^\s]*|mailto:[^\s]+|tel:[^\s]+)$/i;

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Định dạng trong một dòng. Chữ đã escape trước, nên chỉ thẻ do hàm này tạo ra mới là HTML. */
function inline(text) {
  let s = esc(text);
  // [chữ](link): link không an toàn thì chỉ còn chữ (bước kiểm trước Publish đã báo lỗi)
  s = s.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_all, label, url) => {
    const raw = url.replace(/&amp;/g, '&');
    if (!SAFE_URL.test(raw)) return label;
    const ext = /^https?:\/\//i.test(raw) ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${url}"${ext}>${label}</a>`;
  });
  s = s.replace(/\*\*(?=\S)([^*\n]*?\S)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*(?=\S)([^*\n]*?\S)\*(?![*\w])/g, '$1<em>$2</em>');
  return s;
}

/* ---------- Ảnh ---------- */
const PHOTO_LINE = /^!\[([^\]\n]*)\]\(([^)\s"]+)(?:\s+"([^"\n]*)")?\)$/;
const MEDIA_SRC = /^(media\/[a-z0-9][a-z0-9-]{0,63}\/[a-z0-9]{12})\.(webp|jpg)\?w=(\d{1,5}(?:,\d{1,5}){0,5})&size=(\d{1,5})x(\d{1,5})$/;
const PHOTO_URL = /^(https?:\/\/[^\s]+|\/[^\s]*)$/i;
const MAX_PX = 10000;
const NO_ALT = 'A photo needs a description (alt text)';
const BAD_SRC = "A photo's address is not valid. Remove it and add it again with the Photo button.";

function photoOf(line) {
  const m = line.trim().match(PHOTO_LINE);
  return m ? { alt: m[1], src: m[2], cap: (m[3] ?? '').trim() } : null;
}

function readSrc(src) {
  const m = src.match(MEDIA_SRC);
  if (m) {
    const widths = m[3].split(',').map(Number);
    const w = Number(m[4]), h = Number(m[5]);
    const px = (n) => n >= 1 && n <= MAX_PX;
    if (!widths.every((x, i) => px(x) && (i === 0 || x > widths[i - 1])) || !px(w) || !px(h)) return null;
    return { media: { key: m[1], ext: m[2], widths, w, h } };
  }
  if (/^media\//.test(src)) return null;
  return PHOTO_URL.test(src) && !/^\/\//.test(src) ? { url: src } : null;
}

function renderPhoto(p, o) {
  const s = readSrc(p.src);
  if (!s) return '';
  const alt = esc(p.alt.trim());
  const cap = p.cap ? `<figcaption>${esc(p.cap)}</figcaption>` : '';
  if ('url' in s) return `<figure><img src="${esc(s.url)}" alt="${alt}" loading="lazy" decoding="async">${cap}</figure>`;
  const m = s.media;
  const base = esc((o.mediaUrl ?? '').replace(/\/+$/, ''));
  const url = (w) => `${base}/${m.key}-${w}.${m.ext}`;
  const main = [...m.widths].reverse().find((w) => w <= 1200) ?? m.widths[0];
  const srcset = m.widths.map((w) => `${url(w)} ${w}w`).join(', ');
  return `<figure><div class="media" style="aspect-ratio:${m.w} / ${m.h}"><picture><img src="${url(main)}" srcset="${srcset}" sizes="${esc(o.sizes || '100vw')}" width="${m.w}" height="${m.h}" alt="${alt}" loading="lazy" decoding="async"></picture></div>${cap}</figure>`;
}

function blocks(src, photos = false) {
  const out = [];
  let cur = null;
  const push = (kind, line) => {
    if (!cur || cur.kind !== kind || kind === 'h2' || kind === 'h3') { cur = { kind, lines: [] }; out.push(cur); }
    cur.lines.push(line);
  };
  for (const raw of src.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trimEnd();
    if (!line.trim()) { cur = null; continue; }
    let m;
    const photo = photos ? photoOf(line) : null;
    if (photo) { out.push({ kind: 'img', photo }); cur = null; }
    else if ((m = line.match(/^###\s+(.*)$/))) push('h3', m[1]);
    else if ((m = line.match(/^##\s+(.*)$/))) push('h2', m[1]);
    else if ((m = line.match(/^>\s?(.*)$/))) push('quote', m[1]);
    else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) push('ul', m[1]);
    else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) push('ol', m[1]);
    else push('p', line.trim());
  }
  return out;
}

function renderRich(src, o = {}) {
  if (typeof src !== 'string' || !src.trim()) return '';
  return blocks(src, o.photos === true).map((b) => {
    if (b.kind === 'img') return renderPhoto(b.photo, o);
    const lines = b.lines.map(inline);
    switch (b.kind) {
      case 'h2': return `<h2>${lines[0]}</h2>`;
      case 'h3': return `<h3>${lines[0]}</h3>`;
      case 'quote': return `<blockquote><p>${lines.join('<br>')}</p></blockquote>`;
      case 'ul': case 'ol': return `<${b.kind}>\n${lines.map((l) => `<li>${l}</li>`).join('\n')}\n</${b.kind}>`;
      default: return `<p>${lines.join('<br>')}</p>`;
    }
  }).filter(Boolean).join('\n');
}

/** Link sai (site không dùng được) → báo lỗi trước khi Publish. */
function richIssues(src, o = {}) {
  if (typeof src !== 'string') return [];
  const out = [];
  if (o.photos === true) {
    // Dòng ảnh kiểm riêng (alt, địa chỉ) và không bị coi là link
    src = src.replace(/\r\n?/g, '\n').split('\n').filter((line) => {
      const p = photoOf(line);
      if (!p) return true;
      if (!readSrc(p.src)) out.push({ message: BAD_SRC });
      else if (!p.alt.trim()) out.push({ message: NO_ALT });
      return false;
    }).join('\n');
  }
  for (const m of src.matchAll(/\[([^\]\n]+)\]\(([^)\s]+)\)/g)) {
    if (!SAFE_URL.test(m[2])) out.push({ message: `The link "${m[1]}" needs a full address (https://…) or a site path (/page/)` });
  }
  return out;
}

module.exports = { renderRich, richIssues };
