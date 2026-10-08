/* ============================================================
   Services hub (06/10). v0.5's /services/ is an empty page with one
   heading, so this one carries no new copy: the homepage's twelve
   service cards and their v0.5 heading ("Everything available through
   Miracle Detail / Find what your car needs."), then the booking form.
   Old-site slug /car-care-services/ kept.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs } = require('../lib/shared.js');

const SLUG = 'car-care-services';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: `/${SLUG}/` }
  ]);
  const svcImg = s => frame(s.img, {
    alt: s.alt || '', sizes: '(max-width: 767px) 46vw, (max-width: 1100px) 31vw, 25vw', ratio: false, credit: s.credit
  });
  const groupOf = s => {
    const path = s.href.split('#')[0];
    const g = site.serviceGroups.find(g => g.links.some(l => l.href === path));
    return g ? g.name : '';
  };

  return {
    slug: SLUG,
    title: 'Car Care Services | Miracle Detail, Lingfield, Surrey',
    description: 'Every service available through Miracle Detail in Lingfield, Surrey: paint correction, ceramic coating, PPF, dry ice cleaning, packages, bodyshop, PDR, wheels, leather and window tinting.',
    preload: [
      { id: 'sv-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'sv-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: ['01-header', '20-svc-hero', '08-services', '12-book', '13-footer', '14-sticky'],

    data: {
      crumbs: nav.html,
      hero: {
        stats: true,
        /* phones: where the poster crop is held (08/10) */
        mpos: '50% 50%',
        h1: 'Services',
        line: 'Everything available through <span class="gold">Miracle Detail</span>',
        img: frame('sv-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'A McLaren under the lights in the Miracle Detail studio',
          art: [{ media: '(max-width: 900px)', id: 'sv-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },
      services: site.services.map(s => Object.assign({}, s, { badge: s.badge || groupOf(s), img: svcImg(s) })),
      priceNote: site.vatMode === 'inc'
        ? 'Prices include VAT. Every car is assessed before a final quote.'
        : 'Prices exclude VAT. Every car is assessed before a final quote.',
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [nav.schema]
  };
};
