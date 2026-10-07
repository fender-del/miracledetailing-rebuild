/* ============================================================
   render.js — the smallest template engine that keeps a block
   file readable as HTML.

   A block on disk stays a plain .html file with {{tokens}} in it,
   which is what the Elementor handoff is still cut from. No deps.

   Syntax
     {{key}}            escaped value            (dotted paths: {{site.phone}})
     {{&key}} {{{key}}} raw HTML — use for copy that carries markup
     {{#key}}…{{/key}}  array → loop · truthy → render once · falsy → skip
     {{^key}}…{{/key}}  inverted: render only when falsy or empty
     {{.}}              the current item inside a loop over scalars

   Inside a loop over objects these are injected per item:
     {{_n}}    1-based position        {{_idx}}  zero-padded "01"
     {{_i}}    0-based index           {{_first}} / {{_last}}
   ============================================================ */
'use strict';

const RE = /\{\{(\{)?\s*([#^\/&]?)\s*([\w.$-]+)\s*(\})?\}\}/g;

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s).replace(/[&<>"']/g, c => ESC[c]);

/* ---------- parse: template string -> node tree ---------- */
function parse(tpl, where) {
  const root = { children: [] };
  const stack = [root];
  const top = () => stack[stack.length - 1];
  let last = 0, m;

  RE.lastIndex = 0;
  while ((m = RE.exec(tpl))) {
    const [full, triple, sigil, name] = m;
    if (m.index > last) top().children.push({ t: 'text', v: tpl.slice(last, m.index) });
    last = m.index + full.length;

    if (sigil === '#' || sigil === '^') {
      const node = { t: sigil === '#' ? 'sec' : 'inv', name, children: [] };
      top().children.push(node);
      stack.push(node);
    } else if (sigil === '/') {
      if (stack.length < 2 || top().name !== name) {
        throw new Error(`${where}: {{/${name}}} does not close {{#${top().name || '(root)'}}}`);
      }
      stack.pop();
    } else {
      top().children.push({ t: triple || sigil === '&' ? 'raw' : 'var', name });
    }
  }
  if (tpl.length > last) top().children.push({ t: 'text', v: tpl.slice(last) });
  if (stack.length !== 1) throw new Error(`${where}: unclosed {{#${top().name}}}`);
  return root;
}

/* ---------- lookup: walk the context stack, innermost first ---------- */
function lookup(stack, name) {
  if (name === '.') return stack[stack.length - 1];
  const parts = name.split('.');
  for (let i = stack.length - 1; i >= 0; i--) {
    const frame = stack[i];
    if (frame == null || typeof frame !== 'object') continue;
    if (!(parts[0] in frame)) continue;
    let v = frame;
    for (const p of parts) {
      if (v == null) return undefined;
      v = v[p];
    }
    return v;
  }
  return undefined;
}

/* ---------- emit ---------- */
function emit(node, stack) {
  let out = '';
  for (const c of node.children) {
    if (c.t === 'text') { out += c.v; continue; }

    const v = lookup(stack, c.name);

    if (c.t === 'var') out += v == null || v === false ? '' : esc(v);
    else if (c.t === 'raw') out += v == null || v === false ? '' : String(v);
    else if (c.t === 'inv') {
      if (!v || (Array.isArray(v) && !v.length)) out += emit(c, stack);
    } else if (c.t === 'sec') {
      if (Array.isArray(v)) {
        v.forEach((item, i) => {
          const frame = item !== null && typeof item === 'object'
            ? Object.assign({}, item, {
                _i: i, _n: i + 1,
                _idx: String(i + 1).padStart(2, '0'),
                _first: i === 0, _last: i === v.length - 1
              })
            : item;
          out += emit(c, stack.concat([frame]));
        });
      } else if (v) {
        /* Push the value itself, scalar or not, so {{.}} inside a
           single-value section resolves to the value. lookup() skips
           non-object frames, so named keys still fall through outwards. */
        out += emit(c, stack.concat([v]));
      }
    }
  }
  return out;
}

function render(tpl, ctx, where) {
  return emit(parse(tpl, where || 'template'), [ctx]);
}

module.exports = { render, esc };
