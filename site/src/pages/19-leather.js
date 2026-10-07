/* ============================================================
   Leather restoration (06/10, v0.5 pages only, PPF rules).

   v0.5 /leather-restoration/, in its order:
     hero · the interior is half the car · what's covered (3) · areas
     covered (4) · "A car detailed to perfection…" · book
   v0.5 slip: three of the four "Areas covered" carry the PPF page's
   film-brand lines (SunTek, Profilm, STEK). Only the areas' names show
   for those three until Paul sends their lines (REQUESTS.md).
   Photos: the old site's leather jobs (Paul's own).
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs, cards, prose, quote } = require('../lib/shared.js');

const SLUG = 'leather-restoration';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Leather restoration', href: `/${SLUG}/` }
  ]);
  const cardImg = (id, alt) => frame(id, { alt, sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 30vw', ratio: '4 / 3' });

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'restore',
    title: 'Leather Restoration in Surrey | Miracle Detail',
    description: 'Car leather restoration through Miracle Detail, Lingfield, Surrey: colour restoration, scuff and scratch repair and full interior restoration, to the same standard as the paintwork.',
    preload: [
      { id: 'lr-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'lr-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'overview', zoom: { focus: '48% 62%' },
        title: 'The interior is half the car. <span class="gold">It deserves the same attention.</span>',
        img: frame('lr-fixed', { alt: 'A cream leather seat after colour restoration', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        paras: [
          'Paint correction and ceramic coating transform the exterior of a car. But if the leather is faded, scuffed or showing its age, the overall impression suffers, no matter how good the paintwork looks.',
          'Leather restoration is available through Miracle Detail as part of a full detail package. Colour restoration, scuff and scratch repair, and surface conditioning, delivered to the same standard as the rest of the work on your car.',
          'Every leather restoration job is assessed on its own merits. The condition of the leather, the extent of the damage and the result required all determine the approach. Paul will advise on what’s achievable before any work begins.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'covered', light: true, cols: 3, fx: 'samples',
        eyebrow: 'What’s covered',
        title: 'Colour. Repair. <span class="gold">Restoration.</span>',
        items: [
          { n: 'I', name: 'Colour Restoration', sub: 'Faded and worn leather', img: cardImg('lr-worn', 'A worn cream leather seat before colour restoration'),
            paras: 'Leather colour fades over time, from UV exposure, body oils and general wear. Colour restoration brings the leather back to its original shade or any chosen colour, applied in thin, flexible layers that move and breathe with the leather rather than cracking and peeling.',
            list: ['Original colour matching or colour change', 'Thin, flexible colour application', 'UV-resistant finish', 'Seats, bolsters, door cards and dash'],
            price: 'Pricing confirmed at enquiry' },
          { n: 'II', name: 'Scuff &amp; Scratch Repair', sub: 'Surface damage restored', img: cardImg('lr-red', 'A scuffed grey leather bolster with red piping during repair'),
            paras: 'Scuffs, light scratches and surface abrasion (the kind that accumulates on bolsters, armrests and high-contact areas) are filled, smoothed and colour-matched to blend seamlessly with the surrounding leather. Results that are invisible under normal viewing conditions.',
            list: ['Surface abrasion and scuff treatment', 'Filler and colour blend', 'Seamless finish under normal light', 'High-contact areas prioritised'],
            price: 'Pricing confirmed at enquiry' },
          { n: 'III', name: 'Full Interior Restoration', sub: 'Complete leather transformation', img: cardImg('lr-seat', 'A cream leather seat restored in full'),
            paras: 'For interiors requiring comprehensive attention, combining colour restoration, repair work and conditioning into a full treatment of every leather surface in the car. Seats, door cards, dash, steering wheel, centre console. The complete interior, brought back to the same standard as the rest of the detail.',
            list: ['All leather surfaces treated', 'Colour restoration and repair combined', 'Deep conditioning post-treatment', 'Steering wheel and centre console included'],
            price: 'Pricing confirmed at enquiry' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'areas', variant: 'points', cols: 4, rail: false,
        eyebrow: 'Areas covered',
        title: 'Every leather surface <span class="gold">in the car.</span>',
        items: [
          { n: 'I', name: 'Seats &amp; Bolsters', paras: 'The highest-wear surfaces in any interior. Bolsters fade and scuff first: colour restoration and repair returns them to the condition of the rest of the seat.' },
          { n: 'II', name: 'Door Cards' },
          { n: 'III', name: 'Dashboard &amp; Steering Wheel' },
          { n: 'IV', name: 'Centre Console &amp; Armrests' }
        ]
      }) } },
      { block: '38-svc-quote', with: { quote: quote({
        id: 'story',
        img: frame('lr-hero', { alt: '', sizes: '100vw', ratio: false }),
        text: 'A car detailed to perfection on the outside deserves an interior that <span class="gold">tells the same story.</span>'
      }) } },
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        h1: 'Leather Restoration',
        line: 'Leather that looks <span class="gold">the way it should.</span>',
        lede: 'Faded, scuffed, cracked or discoloured leather doesn’t have to stay that way. Leather colour restoration and repair is available through Miracle Detail, so the interior of your car matches the standard of the exterior.',
        img: frame('lr-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Tan leather seats being cleaned by hand with a microfibre cloth',
          art: [{ media: '(max-width: 900px)', id: 'lr-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'covered', label: 'What’s covered' },
        { id: 'areas', label: 'Areas' }
      ],

      bookTitle: 'Interior restored. <span class="gold">Detail complete.</span>',
      bookLede: 'Mention leather restoration when you get in touch and Paul will include it in the assessment and quote for your detail.',
      formServices: site.picks('Leather, wheels or bodywork'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Leather restoration', serviceType: 'Car leather restoration',
        description: 'Leather colour restoration, scuff and scratch repair and full interior restoration, coordinated through Miracle Detail.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
