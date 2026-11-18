/* ============================================================
   rich.js (18/11): Paul's formatted text from the DMI CMS (Journal posts).
   A small Markdown: paragraphs, ## heading, ### small heading, **bold**,
   *italic*, [text](link), "- " or "1. " lists, "> " quote. Anything else,
   HTML included, comes out as plain text.
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

function blocks(src) {
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
    if ((m = line.match(/^###\s+(.*)$/))) push('h3', m[1]);
    else if ((m = line.match(/^##\s+(.*)$/))) push('h2', m[1]);
    else if ((m = line.match(/^>\s?(.*)$/))) push('quote', m[1]);
    else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) push('ul', m[1]);
    else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) push('ol', m[1]);
    else push('p', line.trim());
  }
  return out;
}

function renderRich(src) {
  if (typeof src !== 'string' || !src.trim()) return '';
  return blocks(src).map((b) => {
    const lines = b.lines.map(inline);
    switch (b.kind) {
      case 'h2': return `<h2>${lines[0]}</h2>`;
      case 'h3': return `<h3>${lines[0]}</h3>`;
      case 'quote': return `<blockquote><p>${lines.join('<br>')}</p></blockquote>`;
      case 'ul': case 'ol': return `<${b.kind}>\n${lines.map((l) => `<li>${l}</li>`).join('\n')}\n</${b.kind}>`;
      default: return `<p>${lines.join('<br>')}</p>`;
    }
  }).join('\n');
}

/** Link sai (site không dùng được) → báo lỗi trước khi Publish. */
function richIssues(src) {
  if (typeof src !== 'string') return [];
  const out = [];
  for (const m of src.matchAll(/\[([^\]\n]+)\]\(([^)\s]+)\)/g)) {
    if (!SAFE_URL.test(m[2])) out.push({ message: `The link "${m[1]}" needs a full address (https://…) or a site path (/page/)` });
  }
  return out;
}

module.exports = { renderRich, richIssues };
