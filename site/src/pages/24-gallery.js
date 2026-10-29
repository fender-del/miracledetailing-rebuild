/* ============================================================
   Gallery (06/10, Fender: "one Gallery page, filter + lightbox").
   v0.5's /gallery/ is an empty page; the jobs are the old site's
   project pages (tools/gallery.js -> lib/gallery.json): every job with
   a photo, the first 24 photos of each (22/10). Titles and
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
/* single-photo jobs whose one photo shows no car (a garden, loose wheels):
   hidden until Paul sends photos (22/10) */
const HIDE = new Set(['bmw-3-series', '1992-porsche-964-turbo-midnight-blue']);
const key = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: `/${SLUG}/` }
  ]);

  const list = jobs.filter(j => !HIDE.has(j.slug)).map(j => {
    const skip = SKIP[j.slug] || [];
    /* the main photo (src/lib/covers.json, tools/covers.js) goes first: the card shows it, the lightbox opens on it */
    const cover = j.cover.n || 1;
    const files = j.photos.map((p, i) => i + 1).filter(n => !skip.includes(n))
      .sort((a, b) => (b === cover) - (a === cover) || a - b);
    return {
      slug: j.slug, title: j.title, make: j.make, makeKey: key(j.make), year: j.year || null,
      text: j.text || '', count: files.length, cover: files[0], lqip: j.cover.lqip,
      countLabel: files.length === 1 ? '1 photo' : files.length + ' photos',
      files, sizes: files.map(n => [j.photos[n - 1].w, j.photos[n - 1].h])
    };
  });

  /* makes A to Z, "Other" last (Paul 21/10); the grid follows the same order */
  list.sort((a, b) => (a.make === 'Other') - (b.make === 'Other') || a.make.localeCompare(b.make) || a.title.localeCompare(b.title));
  const counts = {};
  list.forEach(j => { counts[j.make] = (counts[j.make] || 0) + 1; });
  const makes = Object.keys(counts)
    .sort((a, b) => (a === 'Other') - (b === 'Other') || a.localeCompare(b))
    .map(name => ({ name, key: key(name), count: counts[name] }));

  /* what the lightbox needs, keyed by job */
  const json = JSON.stringify(Object.fromEntries(list.map(j => [j.slug, {
    t: j.title, m: j.make + (j.year ? ` · ${j.year}` : ''), x: j.text, f: j.files, p: j.sizes
  }]))).replace(/</g, '\\u003c');

  return {
    slug: SLUG,
    title: `Gallery | ${list.length} Cars Detailed by Paul Dalton | Miracle Detail`,
    description: `The Miracle Detail archive: Ferrari, Porsche, Bugatti, Koenigsegg, Pagani and more, detailed by Paul Dalton in Surrey and beyond. ${list.length} cars, filter by make.`,
    preload: [
      { id: 'gl-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'gl-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: ['01-header', '20-svc-hero', '41-gallery', '12-book', '13-footer', '14-sticky'],

    data: {
      crumbs: nav.html,
      hero: {
        stats: true,
        /* phones: where the poster crop is held (08/10) */
        mfit: true,
        h1: 'Gallery',
        /* Paul 22/10 (board note 68); 28/10 (requests #35): only "Speaks" in italic, and his new lede */
        line: 'The Work <span class="gold it">Speaks</span>',
        lede: 'Three decades of exceptional cars, meticulous craftsmanship and results that speak for themselves. Explore a selection of vehicles personally prepared by Paul Dalton.',
        img: frame('gl-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'A Ferrari 599 GTO in the Miracle Detail studio',
          art: [{ media: '(max-width: 900px)', id: 'gl-hero-m', sizes: '100vw' }]
        }),
        /* Paul 22/10 (board note 69): three figures in place of the Cars / Makes / Photos counts, his words as written */
        facts: [
          { k: 'Years of documented work', v: '30+' },
          { k: 'Concours wins by cars Paul prepared', v: '100%' },
          { k: 'Standard. Perfection.', v: '1' }
        ]
      },
      gal: { total: list.length, makes, jobs: list, json },
      bookTitle: 'The studio is ready.<br> <span class="gold it">Is your car?</span>',
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [nav.schema]
  };
};
