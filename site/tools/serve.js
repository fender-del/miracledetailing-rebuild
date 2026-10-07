/* ============================================================
   tools/serve.js — local preview that behaves like Netlify for
   speed tests: gzip for text, long cache for /assets/, the
   X-Robots-Tag noindex header. Forms are NOT wired here (POST
   returns 501, and the page says so honestly).

     node tools/serve.js [port]      default 8765
   ============================================================ */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const PORT = +process.argv[2] || 8765;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.avif': 'image/avif', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml'
};
const TEXT = /^(text\/|application\/(json|xml)|image\/svg)/;

http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(501); return res.end('Forms are not connected in the local preview.'); }
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || /[\\/](src|tools|node_modules)[\\/]/.test(file.slice(ROOT.length))) { res.writeHead(404); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not built yet: ' + p); }
    const type = TYPES[path.extname(file)] || 'application/octet-stream';
    const head = {
      'Content-Type': type,
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': p.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache'
    };
    if (TEXT.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      buf = zlib.gzipSync(buf, { level: 9 });
      head['Content-Encoding'] = 'gzip';
      head.Vary = 'Accept-Encoding';
    }
    head['Content-Length'] = buf.length;
    res.writeHead(200, head);
    res.end(req.method === 'HEAD' ? undefined : buf);
  });
}).listen(PORT, () => console.log(`preview on http://localhost:${PORT}/`));
