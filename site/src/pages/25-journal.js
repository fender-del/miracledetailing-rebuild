/* ============================================================
   Journal (06/10). v0.5's /journal/ is empty; Fender: build it with
   placeholder text. Every word below is a stand-in, marked as such,
   for Paul's articles (REQUESTS.md). The cards reuse archive photos.
   noindex until it has real articles.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs, cards } = require('../lib/shared.js');

const SLUG = 'journal';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Journal', href: `/${SLUG}/` }
  ]);
  const img = (id, alt) => frame(id, { alt, sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 30vw', ratio: '4 / 3' });
  const post = (id, alt, kicker) => ({
    img: img(id, alt), kicker,
    name: 'Article title placeholder',
    paras: 'Placeholder summary. One or two lines about the article will go here once Paul has written it.',
    links: [{ label: 'Read article', href: '#', ext: null }]
  });

  return {
    slug: SLUG,
    noindex: true,
    title: 'Journal | Miracle Detail',
    description: 'Articles from Paul Dalton and the Miracle Detail studio in Lingfield, Surrey.',
    preload: [
      { id: 'jn-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'jn-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header', '20-svc-hero',
      { block: '37-svc-cards', with: { cards: cards({
        id: 'articles', cols: 3, rail: false,
        eyebrow: 'Placeholder',
        title: 'Latest articles <span class="gold">(placeholder)</span>',
        items: [
          post('car-enzo', 'A red Ferrari Enzo in the studio', 'Category · Date'),
          post('car-f40', 'A red Ferrari F40', 'Category · Date'),
          post('car-ccxr', 'A carbon Koenigsegg', 'Category · Date'),
          post('car-zonda', 'A Pagani Zonda in the studio', 'Category · Date'),
          post('car-458', 'A yellow Ferrari 458 Speciale', 'Category · Date'),
          post('car-porsche', 'A white classic Porsche', 'Category · Date')
        ]
      }) } },
      '12-book', '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,
      hero: {
        stats: true,
        h1: 'Journal',
        line: 'Journal headline <span class="gold">placeholder.</span>',
        lede: 'Placeholder introduction. A line or two about what the journal covers will go here once the first articles are written.',
        img: frame('jn-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Inside the Miracle Detail studio',
          art: [{ media: '(max-width: 900px)', id: 'jn-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [nav.schema]
  };
};
