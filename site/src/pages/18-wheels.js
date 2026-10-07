/* ============================================================
   Wheel refurbishment (06/10, v0.5 pages only, PPF rules).

   v0.5 /wheel-refurbishment/, in its order:
     hero · the finishing touch · what's available (4) · why it matters
     (3) · book
   v0.5 shows no photos on this page: the old site's wheel photos
   (Paul's own) carry the four services.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs, cards, prose } = require('../lib/shared.js');

const SLUG = 'wheel-refurbishment';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Wheel refurbishment', href: `/${SLUG}/` }
  ]);
  const cardImg = (id, alt) => frame(id, { alt, sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 24vw', ratio: '4 / 3' });

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'restore',
    title: 'Wheel Refurbishment in Surrey | Diamond Cut & Powder Coat | Miracle Detail',
    description: 'Wheel refurbishment through Miracle Detail, Lingfield, Surrey: diamond cut, powder coat, colour change and crack and buckle repair, coordinated alongside your detail.',
    preload: [
      { id: 'wr-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'wr-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'overview', zoom: { focus: '37% 30%', rot: 14 },
        title: 'The finishing touch that <span class="gold">ties a detail together.</span>',
        img: frame('wr-stands', { alt: 'Refurbished alloy wheels on stands in the workshop', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: [
          'A car that has received paint correction, ceramic coating and PPF deserves wheels that match. Corroded, kerbed or faded wheels undermine a detail no matter how good the paintwork looks, and they’re often the first thing people notice.',
          'Wheel refurbishment is available through Miracle Detail as part of your detail. Whether it’s a light refresh or full structural repair and colour change, the work is coordinated alongside your detail so the car leaves the studio complete, not almost complete.',
          'Pricing and timescales are confirmed at the point of enquiry based on the condition and specification of your wheels.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'available', light: true, cols: 4, fx: 'samples',
        eyebrow: 'What’s available',
        title: 'Four services. <span class="gold">Every wheel covered.</span>',
        items: [
          { n: 'I', name: 'Diamond Cut', sub: 'Lathe-finished face, powder-coated barrel', img: cardImg('wr-face', 'A diamond cut alloy wheel face catching the light'),
            paras: 'The factory finish on many prestige wheels. The face of the wheel is machined on a CNC lathe to produce a precise, reflective cut surface, with the barrel and spokes powder-coated in the original or chosen colour. The most sought-after finish for OEM-specification restoration.',
            list: ['CNC lathe machining of wheel face', 'Powder-coated barrel and spokes', 'Lacquer sealed finish', 'Colour-matched or custom colour'],
            price: 'Pricing confirmed at enquiry' },
          { n: 'II', name: 'Powder Coat', sub: 'Full wheel, any colour', img: cardImg('wr-audi', 'A refurbished Audi alloy wheel with an Audi Sport valve cap'),
            paras: 'Full powder coat refinishing of the entire wheel: the most durable and versatile wheel finish available. Suitable for any alloy and available in virtually any colour. Original colour restoration or complete colour change: the choice is yours.',
            list: ['Full strip and sandblast preparation', 'Powder coat in any colour', 'High-gloss, satin or matte finish', 'Significantly more durable than painted finishes'],
            price: 'Pricing confirmed at enquiry' },
          { n: 'III', name: 'Colour Change', sub: 'Transform the look of the car', img: cardImg('wr-bronze', 'Bronze wheels on a black car in the studio'),
            paras: 'Change the colour of your wheels entirely, from standard silver to gloss black, gunmetal, bronze, gold or any custom specification. A wheel colour change is one of the most cost-effective ways to transform the appearance of a car without touching the bodywork.',
            list: ['Any colour, standard or custom', 'Powder coat or painted finish', 'Gloss, satin or matte available', 'Coordinated with overall detail specification'],
            price: 'Pricing confirmed at enquiry' },
          { n: 'IV', name: 'Crack &amp; Buckle Repair', sub: 'Structural restoration', img: cardImg('wr-spoke', 'A multi-spoke alloy wheel after repair and refinishing'),
            paras: 'Cracked or buckled wheels are a safety issue as well as a cosmetic one. Structural repair (crack welding and buckle correction) is available before refinishing, restoring the wheel to safe, serviceable condition before it goes back on the car.',
            list: ['Crack repair by specialist welding', 'Buckle correction on specialist rollers', 'Safety inspection post-repair', 'Combined with any refinishing option'],
            price: 'Pricing confirmed at enquiry' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'why', variant: 'points', cols: 3,
        eyebrow: 'Why it matters',
        title: 'Wheels that match <span class="gold">the standard of the detail.</span>',
        items: [
          { n: 'I', name: 'Completed, Not Compromised', paras: 'A full detail with tired or kerbed wheels is an incomplete job. Coordinating wheel refurbishment alongside the detail means the car leaves looking exactly as it should, from every angle.' },
          { n: 'II', name: 'Residual Value', paras: 'Kerbed or corroded wheels are one of the most visible indicators of a car’s history and care. Restored wheels meaningfully improve the perceived condition and value of the vehicle at point of sale.' },
          { n: 'III', name: 'One Point of Contact', paras: 'Arranged through Miracle Detail, coordinated around your detail. You don’t need to manage multiple suppliers or work around separate collections and drop-offs. Paul handles the coordination.' }
        ]
      }) } },
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        h1: 'Wheel Refurbishment',
        line: 'Your wheels. <span class="gold">Restored to perfect.</span>',
        lede: 'Kerbed, corroded, faded or simply in need of a refresh: wheel refurbishment is available through Miracle Detail as part of a full detail package. Diamond cut, powder coat, colour change and structural repair all covered.',
        img: frame('wr-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Gold wheels on a black and blue Pagani in the studio',
          art: [{ media: '(max-width: 900px)', id: 'wr-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'available', label: 'What’s available' },
        { id: 'why', label: 'Why it matters' }
      ],

      bookTitle: 'Wheels restored. <span class="gold">Detail complete.</span>',
      bookLede: 'Mention wheel refurbishment when you get in touch and Paul will include it in the assessment and quote for your detail.',
      formServices: site.picks('Leather, wheels or bodywork'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Wheel refurbishment', serviceType: 'Alloy wheel refurbishment',
        description: 'Diamond cut, powder coat, colour change and crack and buckle repair, coordinated through Miracle Detail.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
