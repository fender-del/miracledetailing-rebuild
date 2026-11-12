/* ============================================================
   worker/index.js — the only server code on the site.

   wrangler.jsonc sends /api/* here first (run_worker_first); every
   other path is a static asset, so site/_redirects works as before.

   POST /api/book  the booking form (site/src/blocks/12-book.html):
     1. honeypot (bot-field) + Cloudflare Turnstile
     2. one mail to BOOK_TO through Resend: every field in a table,
        Reply-To = the client's email, photos attached (10 MB in all)
     3. JSON { ok } back to the form (ui.js); a no-JS post gets a
        plain page instead.

   Variables and Secrets (Cloudflare dashboard, or .dev.vars locally):
     RESEND_API_KEY    secret
     TURNSTILE_SECRET  secret
     BOOK_TO           where the mail goes (comma-separated for several)
     BOOK_FROM         "Miracle Detail website <booking@send.miracledetail.co.uk>"
   ============================================================ */
import site from '../site/content/site.json';
import form from '../site/content/form.json';

const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // same as MAX_BYTES in ui.js
const MAX_PHOTOS = 4;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif|avif|tiff?|bmp)$/i;

/* Every field of the form, in the order Paul reads it. */
const FIELDS = [
  ['car', 'Make & model'],
  ['year', 'Year'],
  ['colour', 'Colour'],
  ['work', 'Work wanted'],
  ['notes', 'Notes'],
  ['name', 'Name'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['contact_by', 'Best way to reach'],
  ['heard', 'Heard about Paul from']
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/book' || url.pathname === '/api/book/') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });
      return book(request, env);
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  }
};

async function book(request, env) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const reply = (status, body) => wantsJson ? json(body, status) : page(status, body);

  let data;
  try {
    data = await request.formData();
  } catch (e) {
    return reply(400, { ok: false, error: 'invalid', message: 'The form could not be read.' });
  }

  /* 1. Bots: a filled honeypot gets a quiet "ok" and no mail. */
  if (String(data.get('bot-field') || '').trim()) return reply(200, { ok: true });

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await turnstileOk(env, data.get('cf-turnstile-response'), ip))) {
    return reply(403, { ok: false, error: 'captcha', message: 'The spam check did not pass. Please try again.' });
  }

  /* 2. Fields: the same checks the form makes in the browser. */
  const val = k => String(data.get(k) || '').trim().slice(0, k === 'notes' ? 5000 : 300);
  const f = Object.fromEntries(FIELDS.map(([k]) => [k, val(k)]));
  f.work = data.getAll('work').map(String).filter(w => form.formServices.includes(w)).join(', ');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const missing = [];
  if (!f.car) missing.push('make & model');
  if (!f.work) missing.push('the work');
  if (!f.name) missing.push('name');
  if (f.phone.replace(/\D/g, '').length < 10) missing.push('phone');
  if (f.email && !emailOk) missing.push('a valid email');
  if (missing.length) {
    return reply(400, { ok: false, error: 'invalid', message: `Please fill in ${missing.join(', ')}.` });
  }

  /* Photos: images only, 4 at most, 10 MB in all. */
  const photos = data.getAll('photos').filter(p => typeof p === 'object' && p && p.size > 0);
  const total = photos.reduce((n, p) => n + p.size, 0);
  if (photos.length > MAX_PHOTOS || total > MAX_PHOTO_BYTES) {
    return reply(413, {
      ok: false, error: 'too_big',
      message: `Up to ${MAX_PHOTOS} photos and 10 MB in total, please (you sent ${photos.length}, ${(total / 1048576).toFixed(1)} MB). Remove some below, or send them on WhatsApp.`
    });
  }
  const attachments = [];
  const skipped = [];
  for (const p of photos) {
    if (!((p.type || '').startsWith('image/') || IMAGE_EXT.test(p.name || ''))) { skipped.push(p.name); continue; }
    attachments.push({ filename: fileName(p.name, attachments.length + 1), content: b64(await p.arrayBuffer()) });
  }

  /* 3. The mail. */
  if (!env.RESEND_API_KEY || !env.BOOK_TO || !env.BOOK_FROM) {
    console.error('book: RESEND_API_KEY, BOOK_TO or BOOK_FROM is not set');
    return reply(500, { ok: false, error: 'send' });
  }
  const from = request.headers.get('Referer') || '';
  const rows = FIELDS.map(([k, label]) => [label, f[k]]);
  rows.push(['Photos', attachments.length ? attachments.map(a => a.filename).join(', ') : 'none']);
  if (skipped.length) rows.push(['Not attached (not images)', skipped.join(', ')]);
  rows.push(['Sent from', from]);

  const subject = oneLine(`New booking: ${f.name} – ${f.car}`).slice(0, 200);
  const msg = {
    from: env.BOOK_FROM,
    to: env.BOOK_TO.split(',').map(s => s.trim()).filter(Boolean),
    subject,
    html: mailHtml(rows, f),
    text: rows.map(([k, v]) => `${k}: ${v || '-'}`).join('\n'),
    attachments
  };
  if (f.email && emailOk) msg.reply_to = f.email;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(msg)
  });
  if (!r.ok) {
    console.error('book: Resend', r.status, (await r.text()).slice(0, 500));
    return reply(502, { ok: false, error: 'send' });
  }
  return reply(200, { ok: true });
}

async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) { console.error('book: TURNSTILE_SECRET is not set'); return false; }
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', String(token));
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const j = await r.json();
    if (!j.success) console.log('book: turnstile failed', JSON.stringify(j['error-codes'] || []));
    return !!j.success;
  } catch (e) {
    console.error('book: turnstile', e.message);
    return false;
  }
}

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const oneLine = s => String(s).replace(/[\r\n\t]+/g, ' ').trim();

function fileName(name, n) {
  const clean = String(name || '').replace(/[^\w.\- ]+/g, '_').replace(/^[._ ]+/, '').slice(-80);
  return clean || `photo-${n}.jpg`;
}

function b64(buf) {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function mailHtml(rows, f) {
  const tr = rows.map(([k, v]) =>
    `<tr><th align="left" valign="top" style="padding:8px 16px 8px 0;border-bottom:1px solid #e5e5e5;color:#666;font-weight:normal;white-space:nowrap">${esc(k)}</th>` +
    `<td style="padding:8px 0;border-bottom:1px solid #e5e5e5;white-space:pre-wrap">${v ? esc(v) : '<span style="color:#aaa">–</span>'}</td></tr>`
  ).join('');
  const tel = f.phone.replace(/[^\d+]/g, '');
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:640px">
<p style="font-size:18px;margin:0 0 16px">New booking request from the website</p>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">${tr}</table>
<p style="margin:16px 0 0;color:#666;font-size:13px">Call <a href="tel:${esc(tel)}">${esc(f.phone)}</a>${f.email ? ` or reply to this email to write to ${esc(f.email)}` : ''}.</p>
</div>`;
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }
  });
}

/* JS off: a plain page, same words as the form's own boxes. */
function page(status, body) {
  const tel = 'tel:+' + site.phone.replace(/\D/g, '');
  const head = body.ok ? 'Thank you. Paul has your enquiry.' : 'That did not send.';
  const text = body.ok
    ? `He will call or message you on the number you gave. If it is urgent, call <a href="${tel}">${esc(site.phone)}</a>.`
    : `${body.message ? esc(body.message) + ' ' : ''}Please call or WhatsApp Paul on <a href="${tel}">${esc(site.phone)}</a>.`;
  return new Response(`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(head)} · Miracle Detail</title>
<style>body{margin:0;font:17px/1.6 Arial,Helvetica,sans-serif;background:#111;color:#eee}main{max-width:560px;margin:15vh auto;padding:0 16px}a{color:#d4b06a}</style></head>
<body><main><h1>${esc(head)}</h1><p>${text}</p><p><a href="/">Back to Miracle Detail</a></p></main></body></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
