/* ============================================================
   Dry ice cleaning, rebuilt in full (Fender 06/10, after PPF).

   Same rule as PPF: Paul's v0.5 text word for word, the em dash the
   only edit (comma, colon or full stop). New words are UI labels only.
   The lean version's FAQ (written by Claude) and comparison table are
   gone; the −78.5°C drawing (30) stays, now carrying v0.5's own three
   mechanisms in full.

   v0.5 /dry-ice-cleaning/, in its order:
     hero (headline, intro, three figures) · first in the UK, 2014
     · the science · three mechanisms · over a decade ahead
     · where it is used · by the hour · book
   v0.5 repeats "First, kinetic energy…" inside "Experience that
   matters" (a paste slip): shown once, under the science. Listed in
   REQUESTS.md for Paul.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs, cards, prose } = require('../lib/shared.js');

const SLUG = 'dry-ice-blasting-and-laser-cleaning';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Dry ice cleaning', href: `/${SLUG}/` }
  ]);
  const price = site.vatMode === 'inc' ? '£240 inc. VAT' : '£200+VAT';
  const workSizes = w => (w ? '(max-width: 767px) 92vw, 58vw' : '(max-width: 767px) 92vw, 34vw');

  return {
    slug: SLUG,
    title: 'Dry Ice Cleaning in Surrey | First in the UK, 2014 | Miracle Detail',
    description: 'Dry ice cleaning in Lingfield, Surrey, by Paul Dalton, the first detailer in the UK to offer it, in 2014. Engine bays, underbodies, interiors and restoration. £200 + VAT per hour.',
    preload: [
      { id: 'dx-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'dx-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      '32-svc-statement',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'science',
        eyebrow: 'What it actually is',
        title: 'The science behind <span class="gold">dry ice cleaning.</span>',
        img: frame('di-pellets', { alt: 'A hopper full of dry ice pellets', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        cap: 'Dry ice pellets, solid CO2 at -78.5°C',
        paras: [
          'Dry ice cleaning uses solid carbon dioxide pellets, frozen CO2 at -78.5°C, accelerated at high speed through a specialised gun onto the surface being cleaned. Three things happen simultaneously, and together they achieve results nothing else can replicate.',
          'First, kinetic energy. The pellets impact the surface at high velocity, breaking the bond between the contaminant and the surface beneath it.',
          'Second, thermal shock. At -78.5°C, the pellets cause the contaminant to contract rapidly and become brittle, fracturing it away from the substrate.',
          'Third, sublimation. Dry ice converts directly from solid to gas: it never becomes liquid. This means no moisture, no water damage to electronics or wiring, and zero residue. The contaminant is blasted away and the CO2 simply disappears into the air.',
          'The result is a level of cleanliness that steam, pressure washing and chemical cleaning cannot achieve, in places those methods cannot safely reach.'
        ]
      }) } },
      '30-dry-cold',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'experience', reverse: true, graphite: true,
        eyebrow: 'Experience that matters',
        title: 'Over a decade ahead <span class="gold">of the industry.</span>',
        img: frame('dx-exp', { alt: 'Paul Dalton dry ice cleaning the engine bay of a red Ferrari, the vapour rolling off', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        cap: 'Paul Dalton, dry ice cleaning a Ferrari engine bay',
        paras: [
          'When Paul started using dry ice cleaning in 2014, it was virtually unknown in automotive detailing in the UK. There was no manual to follow, no training course to take. The learning came from doing, on some of the most valuable cars in private ownership.',
          'A decade of experience working with this technology on engine bays, interiors, underbodies, restoration projects and concours-standard cars has produced a depth of knowledge about what dry ice cleaning can achieve, and how to use it correctly, that simply cannot be replicated quickly.',
          'When Paul uses dry ice on your car, it’s being done by the person who has been doing it longer than almost anyone in the country.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'applications', light: true, cols: 4,
        eyebrow: 'Where dry ice cleaning is used',
        title: 'Every application <span class="gold">assessed individually.</span>',
        items: [
          { n: 'I', name: 'Engine Bays', img: frame('dx-65', { alt: 'Dry ice blasting into the engine bay of a red Ferrari', sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 24vw', ratio: '4 / 3' }),
            paras: 'The most common application. Decades of oil, grease and grime removed without water touching a single sensor or electrical connector. Results that pressure washing can never safely achieve.' },
          { n: 'II', name: 'Underbody &amp; Arches', img: frame('dx-66', { alt: 'Vapour rolling off a red Ferrari as dry ice is blasted under its engine cover', sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 24vw', ratio: '4 / 3' }),
            paras: 'Road tar, underseal, corrosion deposits and compacted grime blasted from suspension components, sills and wheel arches. Surfaces prepared for coating or inspection without compromise.' },
          { n: 'III', name: 'Interiors', img: frame('dx-64', { alt: 'Dry ice pellets poured into the blasting machine', sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 24vw', ratio: '4 / 3' }),
            paras: 'Deep cleaning of door shuts, hinges, seals and interior panels. Removes ingrained dirt from areas that are impossible to reach with conventional cleaning methods.' },
          { n: 'IV', name: 'Restoration Work', img: frame('dx-67', { alt: 'Dry ice cleaning under the raised engine cover of a red Ferrari', sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 24vw', ratio: '4 / 3' }),
            paras: 'Removing old underseal, paint preparation, stripping contamination from restoration projects where chemical methods are inappropriate or damaging. Bespoke to every car and every requirement.' }
        ]
      }) } },
      '39-svc-price',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      /* ---------- Hero (v0.5's own background photo) ---------- */
      hero: {
        stats: true,
        h1: 'Dry Ice Cleaning',
        line: 'No water. No chemicals. <span class="gold">No compromise.</span>',
        lede: 'Dry ice cleaning removes contamination that nothing else can touch, without a single drop of water, without chemicals, and without any risk to the surfaces being cleaned. Paul was the first detailer in the UK to offer it, in 2014.',
        img: frame('dx-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Dry ice cleaning the engine bay of a red Ferrari in the studio, vapour rolling over the bodywork',
          art: [{ media: '(max-width: 900px)', id: 'dx-hero-m', sizes: '100vw' }]
        }),
        facts: [
          { k: 'First in the UK', v: '2014', big: true },
          { k: 'Water used', v: '0' },
          { k: 'Chemical residue left', v: '0' }
        ]
      },

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'science', label: 'The science' },
        { id: 'mechanisms', label: 'Why it works' },
        { id: 'experience', label: 'Experience' },
        { id: 'applications', label: 'Where it’s used' },
        { id: 'price', label: 'Price' }
      ],

      statement: {
        id: 'overview',
        text: 'Paul Dalton was the first detailer in the United Kingdom to use dry ice cleaning, <span class="gold">in 2014.</span> What is now becoming more widely known in the industry, Paul has been offering for <span class="gold">over a decade.</span>'
      },

      /* ---------- Why it works: v0.5's three mechanisms, in full ---------- */
      coldId: 'mechanisms',
      coldEyebrow: 'Why it works',
      coldTitle: 'Three mechanisms. <span class="gold">One result nothing else achieves.</span>',
      beats: [
        { n: 'I', name: 'Kinetic Energy', sub: 'Impact at high velocity',
          text: 'Dry ice pellets travelling at high speed physically dislodge contamination (grease, oil, road grime, underbody deposits), breaking its bond with the surface beneath without any abrasion or chemical action.' },
        { n: 'II', name: 'Thermal Shock', sub: '-78.5°C on contact',
          text: 'The extreme cold causes contaminants to contract rapidly, becoming brittle and fracturing away from the substrate. It reaches into crevices and gaps that brushes and cloths cannot access, removing deposits that have been there for years.' },
        { n: 'III', name: 'Sublimation', sub: 'Solid to gas, no liquid',
          text: 'Dry ice skips the liquid phase entirely, converting directly from solid to gas. No moisture is introduced to the surface. No chemical residue is left behind. Wiring, electronics, sensors and delicate surfaces are completely safe.' }
      ],

      /* ---------- By the hour ---------- */
      band: {
        id: 'price',
        k: 'Dry ice cleaning, <span class="gold">by the hour</span>',
        amount: price,
        note: 'Per hour. Minimum of 2 hours.'
      },

      /* ---------- Book ---------- */
      bookTitle: 'Clean what <span class="gold">nothing else</span> can reach.',
      bookLede: 'Every dry ice cleaning job is assessed individually. Paul will tell you what’s achievable, what the process involves and what the result will look like, before any work begins.',
      formServices: site.picks('Dry ice cleaning'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Dry ice cleaning', serviceType: 'Dry ice cleaning',
        description: 'Dry ice cleaning of engine bays, underbodies, interiors and restoration work. No water, no chemicals, no residue.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London'],
        offers: { '@type': 'Offer', priceCurrency: 'GBP', price: '200', priceSpecification: { '@type': 'UnitPriceSpecification', price: '200', priceCurrency: 'GBP', unitText: 'hour', valueAddedTaxIncluded: false } }
      }
    ]
  };
};
