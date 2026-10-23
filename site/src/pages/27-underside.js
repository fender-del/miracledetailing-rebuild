/* ============================================================
   Underside coating (23/10, Paul's board notes 22/10, note 1: "Need a
   new page for underside coating"). Until now the homepage card opened
   the Industrial Coating card on the ceramic page.

   v0.5 has no underside page, so the words are Paul's own where he has
   written them (the Industrial Coating card on the ceramic page, "10
   year protection" on the homepage card, the studio's underside bay)
   and a DRAFT from us for the rest, for Paul to approve (Fender 23/10:
   "dựa trên những gì có sẵn + triển khai thêm"). Every drafted line is
   marked DRAFT below; Paul's lines are marked PAUL.

   hero · overview · what it is · where it goes · prepared with dry ice
   (the real BMW underbody pair) · how it works · price · reviews · book
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose, steps, pairs } = require('../lib/shared.js');

const SLUG = 'underside-coating';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Underside coating', href: `/${SLUG}/` }
  ]);
  const svc = site.services.find(s => s.key === 'underside');
  const pairImg = (id, alt) => frame(id, { alt, sizes: '(max-width: 767px) 46vw, (max-width: 1023px) 45vw, 370px', ratio: '3 / 4' });

  return {
    slug: SLUG,
    cluster: 'process',
    title: 'Underside Coating in Surrey | Feynlab Industrial V2 | Miracle Detail',
    description: 'Feynlab Industrial V2 underside coating in Lingfield, Surrey: underbody, suspension, arches, metals and plastics cleaned with dry ice, then protected for up to 10 years by Paul Dalton.',
    preload: [
      { id: 'us-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'us-hero', media: '(min-width: 901px)', sizes: '66vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      '32-svc-statement',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'what', light: true,
        eyebrow: 'What it is',
        /* DRAFT */
        title: 'Feynlab Industrial V2. <span class="gold">Ten years underneath.</span>',
        img: frame('dx-66', { alt: 'Vapour rolling off a red Ferrari as dry ice is blasted under its engine cover', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        cap: 'Dry ice cleaning comes first',
        paras: [
          /* PAUL (ceramic page, Industrial Coating card) */
          'Not for paint: for the parts nobody else protects. Underbody, suspension components, arches, metals and plastics. UV-resistant, chemical-resistant, highly hydrophobic. Reduces cleaning intervals and eliminates the need to repaint. Applied to the underside of trains in Norway. On your car, it means the areas most exposed to damage get the best protection available.',
          /* DRAFT */
          'Traditional underseal covers what is underneath and, as it ages and cracks, can hold moisture against the metal. A clear coating keeps every component in view, so the underside can still be inspected at every service.',
          /* PAUL (studio, About 2026), shortened into one line: DRAFT */
          'The new studio in Lingfield has a dedicated dry ice and industrial underside coating bay, so the car is cleaned, coated and cured under one roof.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'where', variant: 'points', cols: 4, brief: true,
        eyebrow: 'Where it goes',
        /* DRAFT (the four areas are Paul's list) */
        title: 'Everything <span class="gold">under the car.</span>',
        items: [
          { n: 'I', name: 'Underbody', paras: 'Floor pans, sills, chassis rails and subframes: the surfaces road spray reaches first.' },
          { n: 'II', name: 'Suspension', paras: 'Arms, springs, dampers and hubs, coated so salt and road grime cannot take hold.' },
          { n: 'III', name: 'Wheel Arches', paras: 'The arches and the metal behind the liners, where grit and water collect.' },
          { n: 'IV', name: 'Metals &amp; Plastics', paras: 'Brackets, fixings, undertrays and plastic trims, protected by the same coating.' }
        ]
      }) } },
      { block: '57-svc-pairs', with: { pairs: pairs({
        id: 'prepared', light: true,
        eyebrow: 'Prepared with dry ice',
        /* DRAFT */
        title: 'Clean metal <span class="gold">before any coating.</span>',
        /* Paul's real BMW underbody pair (Drive, the only real dry ice pair) */
        items: [
          { before: pairImg('dx-b3', 'Before dry ice cleaning: a BMW underbody panel, slick with oil and road grime'),
            after: pairImg('dx-a3', 'After dry ice cleaning: the same BMW underbody panel, clean, with its bolts and exhaust shield visible'), thumb: '', al: 'After dry ice' }
        ]
      }) } },
      { block: '23-svc-steps', with: steps({
        id: 'process', graphite: true,
        eyebrow: 'How it works',
        /* DRAFT: the four steps */
        title: 'Cleaned, coated, <span class="gold">cured.</span>',
        steps: [
          { name: 'On the Lift', text: 'The car goes up on the lift in the studio and Paul inspects the underside: corrosion, old underseal, damage and anything that needs attention before a coating goes on.' },
          { name: 'Dry Ice Cleaning', text: 'Road grime, oil and old deposits are blasted away with dry ice. No water and no chemicals, so nothing is left behind in seams or around wiring.',
            links: [{ label: 'Dry ice cleaning', href: '/dry-ice-blasting-and-laser-cleaning/' }] },
          { name: 'Feynlab Industrial V2', text: 'The coating is applied to the underbody, suspension components, arches, metals and plastics in the studio’s underside bay.' },
          { name: 'Cured and Checked', text: 'The coating cures before the car comes down, and Paul checks every area is covered before it goes home.' }
        ]
      }) },
      '39-svc-price',
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      /* ---------- Hero: Paul's photo of a coated Toyota underside on the
         studio lift (Drive, 21/10) ---------- */
      hero: {
        stats: true, shift: true, dpos: '50% 30%',
        h1: 'Underside Coating',
        /* PAUL */
        line: 'For the parts <span class="gold">nobody else protects.</span>',
        /* DRAFT */
        lede: 'Feynlab Industrial V2 on the underbody, suspension and arches: the parts of a car most exposed to damage. Cleaned with dry ice first, then coated in the studio for up to ten years of protection.',
        img: frame('us-hero', {
          priority: true, ratio: false, sizes: '(max-width: 900px) 100vw, 66vw',
          alt: 'The underside of a Toyota on the studio lift after coating: gloss black chassis, suspension arms and a coil spring',
          art: [{ media: '(max-width: 900px)', id: 'us-hero-m', sizes: '100vw' }]
        }),
        facts: [
          /* PAUL: "Feynlab Industrial V2, 10 year protection" */
          { k: 'Years of protection', v: '10', big: true },
          { k: 'Water used to clean it first', v: '0' },
          { k: 'Dry ice cleaning since', v: '2014' }
        ]
      },

      stars, reviews,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'what', label: 'What it is' },
        { id: 'where', label: 'Where it goes' },
        { id: 'prepared', label: 'Dry ice first' },
        { id: 'process', label: 'How it works' },
        { id: 'price', label: 'Price' },
        { id: 'reviews', label: 'Reviews' }
      ],

      statement: {
        id: 'overview',
        /* DRAFT, closing on Paul's own words */
        text: 'Salt, grit and water reach the underside of a car every time it is driven. Feynlab Industrial V2 means <span class="gold">the areas most exposed to damage</span> get the best protection available.'
      },

      band: {
        id: 'price',
        /* like dry ice's "by the hour": a short key, so the figure has room */
        k: 'Underside coating, <span class="gold">from</span>',
        amount: svc.price.replace(/^From /, ''),
        /* DRAFT */
        note: 'Every car is assessed on the lift before the price is confirmed.'
      },

      /* DRAFT */
      bookTitle: 'Protect <span class="gold">what you can’t see.</span>',
      bookLede: 'Tell Paul about the car and how it is used. He will tell you what the underside needs, how long it takes and what it costs, before any work begins.',
      formServices: site.picks('Underside coating'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Underside coating', serviceType: 'Underbody protection coating',
        description: 'Feynlab Industrial V2 coating of the underbody, suspension, arches, metals and plastics, after dry ice cleaning. Up to 10 years of protection.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London'],
        offers: { '@type': 'Offer', priceCurrency: 'GBP', price: String(svc.from), priceSpecification: { '@type': 'PriceSpecification', minPrice: String(svc.from), priceCurrency: 'GBP', valueAddedTaxIncluded: false } }
      }
    ]
  };
};
