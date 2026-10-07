/* ============================================================
   Gallery (06/10, Fender: "one Gallery page, filter + lightbox").
   v0.5's /gallery/ is an empty page; the jobs are the old site's
   project pages (tools/gallery.js -> lib/gallery.json): 133 jobs with
   three or more photos, the first twelve photos of each. Titles and
   the few descriptions are the old site's own words.
   Old-site slug /car-detail-gallery/ kept; nav label "Projects".
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs } = require('../lib/shared.js');
const jobs = require('../lib/gallery.json');

const SLUG = 'car-detail-gallery';

/* photos the old pages show twice, or a screenshot (1-based files) */
const SKIP = {
  'bentley-continental-convertible': [11],
  'jaguar-f-type-400': [4],
  'lotus-elise-s': [10],
  'porsche-997-turbo-carrera-white': [10],
  'vw-golf-r-modesta-bc-04': [8, 11],
  'ferrari-458-speciale-in-yellow': [5, 6]
};
const key = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: `/${SLUG}/` }
  ]);

  const list = jobs.map(j => {
    const skip = SKIP[j.slug] || [];
    const files = j.photos.map((p, i) => i + 1).filter(n => !skip.includes(n));
    return {
      slug: j.slug, title: j.title, make: j.make, makeKey: key(j.make), year: j.year || null,
      text: j.text || '', count: files.length, lqip: j.cover.lqip,
      files, sizes: files.map(n => [j.photos[n - 1].w, j.photos[n - 1].h])
    };
  });

  /* makes, most cars first; "Other" last */
  const counts = {};
  list.forEach(j => { counts[j.make] = (counts[j.make] || 0) + 1; });
  const makes = Object.keys(counts)
    .sort((a, b) => (a === 'Other') - (b === 'Other') || counts[b] - counts[a] || a.localeCompare(b))
    .map(name => ({ name, key: key(name), count: counts[name] }));

  /* what the lightbox needs, keyed by job */
  const json = JSON.stringify(Object.fromEntries(list.map(j => [j.slug, {
    t: j.title, m: j.make + (j.year ? ` · ${j.year}` : ''), x: j.text, f: j.files, p: j.sizes
  }]))).replace(/</g, '\\u003c');

  return {
    slug: SLUG,
    title: 'Gallery | 133 Cars Detailed by Paul Dalton | Miracle Detail',
    description: 'The Miracle Detail archive: Ferrari, Porsche, Bugatti, Koenigsegg, Pagani and more, detailed by Paul Dalton in Surrey and beyond. 133 cars, filter by make.',
    preload: [
      { id: 'gl-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'gl-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: ['01-header', '20-svc-hero', '41-gallery', '12-book', '13-footer', '14-sticky'],

    data: {
      crumbs: nav.html,
      hero: {
        stats: true,
        h1: 'Gallery',
        line: 'From the <span class="gold">archive.</span>',
        img: frame('gl-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'A Bugatti in the Miracle Detail studio',
          art: [{ media: '(max-width: 900px)', id: 'gl-hero-m', sizes: '100vw' }]
        }),
        facts: [
          { k: 'Cars', v: String(list.length), big: true },
          { k: 'Makes', v: String(makes.filter(m => m.name !== 'Other').length) },
          { k: 'Photos', v: String(list.reduce((n, j) => n + j.count, 0)) }
        ]
      },
      gal: { total: list.length, makes, jobs: list, json },
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [nav.schema]
  };
};
