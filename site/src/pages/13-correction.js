/* ============================================================
   Paint correction (06/10, v0.5 pages only, PPF rules).

   v0.5 /paint-correction/, in its order:
     hero (headline, intro, three figures) · a diagnosis · before/after
     · the instruments (3) · five levels · the process (4) · Paul's quote
     · Gallardo, Alfa, F40 · Google reviews · book
   v0.5 heads the process with the levels' heading again ("Before a pad
   is lifted / Five levels. One standard." and the Rolls-Royce caption
   on a photo of a Pagani): a paste slip. The process carries no
   heading of its own here, only its bar label (REQUESTS.md).
   Prices: v0.5 says "From £???" for every level; kept as written
   (Fender 06/10).
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose, quote, steps } = require('../lib/shared.js');

const SLUG = 'paint-correction-and-polishing';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Paint correction', href: `/${SLUG}/` }
  ]);
  const workSizes = w => (w ? '(max-width: 767px) 92vw, 58vw' : '(max-width: 767px) 92vw, 34vw');

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'paint', arrive: 'diagnosis:beam',
    title: 'Paint Correction in Surrey | Five Levels | Miracle Detail',
    description: 'Paint correction in Lingfield, Surrey, by Paul Dalton: five levels from enhancement polish to concours perfect, every car measured with a paint depth gauge, gloss meter and digital microscope first.',
    preload: [
      { id: 'pc-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'pc-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'diagnosis',
        eyebrow: 'The beginning',
        title: 'Paint correction isn’t a service. <span class="gold">It’s a diagnosis.</span>',
        img: frame('pc-split', { alt: 'A dark metallic panel half corrected: clear and deep on the left, swirled on the right', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '3 / 2' }),
        tagL: 'After correction', tagR: 'Before correction',
        paras: [
          'Every car that arrives at Miracle Detail is assessed before a single pad touches the paint. Paint depth is measured. The surface is examined under specialist lighting. The level of correction, and what is realistically achievable, is established before any work begins.',
          'The five levels provide a clear framework, but the recommendation is always based on what the paint actually needs, not what sells.',
          'This is the difference between a detailer who sells correction and one who understands it.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'instruments', graphite: true, variant: 'points', cols: 3,
        eyebrow: 'Before a pad is lifted',
        title: 'The instruments <span class="gold">most detailers don’t own.</span>',
        intro: [
          'Paint correction at this level begins with information. Paul uses a set of instruments that, collectively, very few detailers in the world possess, giving him an understanding of the paint’s condition that makes every decision more precise and every result more predictable.',
          'This isn’t about equipment for its own sake. It’s about not guessing with someone else’s paintwork.'
        ],
        items: [
          { n: 'I', name: 'Paint Depth Gauge', img: frame('pc-gauge', { alt: 'A paint depth gauge reading on an orange panel', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '16 / 9' }),
            kicker: 'Paint depth gauge: assessing clear coat before correction',
            paras: 'Measures the thickness of paint and clear coat across the panel. Tells Paul exactly how much correction is safe, and where the limits are.' },
          { n: 'II', name: 'Gloss &amp; Orange Peel Instrument', paras: 'One of the most advanced paint analysis instruments in the detailing industry. Measures gloss level and orange peel texture with laboratory precision. Almost no other detailer in the UK is known to own one. This is what separates assessment from assumption.' },
          { n: 'III', name: 'Digital Microscope', paras: 'Reveals defects invisible to the naked eye: fine swirl marks, micro-marring, contamination. What you can’t see, you can’t correct properly.' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'levels', light: true, cols: 5, fx: 'rail',
        eyebrow: 'Before a pad is lifted',
        title: 'Five levels. <span class="gold">One standard.</span>',
        fig: frame('pc-rolls', { alt: 'A Rolls-Royce Silver Shadow before and after its full paint correction', sizes: '(max-width: 767px) 92vw, 44vw', ratio: '16 / 9' }),
        figCap: 'Rolls-Royce Silver Shadow, full paint correction',
        items: [
          { n: 'I', kicker: 'Level One', name: 'Enhancement Polish', paras: 'For paint in good overall condition that has lost its clarity. Light surface haze, minor wash marks and superficial swirling are refined. An excellent preparation step before protective coatings are applied.',
            facts: [{ k: 'Defect removal', v: 'up to 65–75%' }], price: 'From £???' },
          { n: 'II', kicker: 'Level Two', name: 'Light Correction', paras: 'For paint showing visible swirl marks, light scratches and minor water etching. A single corrective stage removes the majority of surface defects and restores genuine depth and gloss to the finish.',
            facts: [{ k: 'Defect removal', v: 'up to 75–85%' }], price: 'From £???' },
          { n: 'III', kicker: 'Level Three', name: 'Full Correction', paras: 'For paint carrying moderate to heavy defects: swirl marks, scratches, oxidation and water etching. A multi-stage process that cuts and refines the surface to deliver results that turn heads under any light.',
            facts: [{ k: 'Defect removal', v: 'up to 85–90%' }], price: 'From £???' },
          { n: 'IV', kicker: 'Level Four', name: 'Advanced Correction', paras: 'For heavily neglected or damaged paint requiring maximum intervention. Every available stage of correction is applied to take the paint as close to its original manufactured state as the clear coat will safely allow.',
            facts: [{ k: 'Defect removal', v: 'up to 95%' }], price: 'From £???' },
          { n: 'V', kicker: 'Level Five', name: 'Concours Perfect', hi: true, paras: 'The ultimate standard. Paint corrected to concours specification: every panel taken to absolute perfection under multiple light sources. The level Paul prepares cars to for concours events. Every car he has entered has won its class.',
            facts: [{ k: 'Defect removal', v: '99–100%' }], price: 'From £???' }
        ]
      }) } },
      { block: '23-svc-steps', with: steps({
        id: 'process',
        steps: [
          { name: 'Assessment', text: 'Paint depth measured. Gloss and orange peel analysed. Surface examined under controlled lighting and digital microscope. The condition of the paint is understood before anything else happens.' },
          { name: 'Decontamination', text: 'The paint is fully decontaminated before correction begins: iron fallout, bonded contamination and surface debris removed. Correcting contaminated paint is correcting the wrong thing.' },
          { name: 'Correction', text: 'Machine polishing by hand, panel by panel, under specialist lighting throughout. The process is methodical, unhurried and done by one person: Paul. No apprentices, no rushing, no shortcuts.' },
          { name: 'Inspection', text: 'Every panel checked under multiple light sources before the job is considered complete. The standard is set by what the paint can achieve, not by what’s quick.' }
        ]
      }) },
      { block: '38-svc-quote', with: { quote: quote({
        id: 'concours',
        img: frame('pc-pagani', { alt: '', sizes: '100vw', ratio: false }),
        text: '“Every car I have ever prepared for a concours event has won its category. <span class="gold">The paint doesn’t lie, and neither does the process.</span>”',
        cite: 'Paul Dalton · Miracle Detail, Est. 1994'
      }) } },
      '24-svc-work',
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        h1: 'Paint Correction',
        line: 'The art of <span class="gold">reading paint.</span>',
        lede: 'Most people see a scratch. Paul sees a story: how deep it goes, what the paint can give, and exactly what it will take to make it right. Thirty-seven years of that instinct don’t lie.',
        img: frame('pc-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Paul Dalton machine polishing the wing of a black car beside a carbon wheel',
          art: [{ media: '(max-width: 900px)', id: 'pc-hero-m', sizes: '100vw' }]
        }),
        facts: [
          { k: 'Years correcting paint', v: '37', big: true },
          { k: 'Levels of correction', v: '5' },
          { k: 'Detailer. Every car.', v: '1' }
        ]
      },

      snav: [
        { id: 'diagnosis', label: 'Diagnosis' },
        { id: 'instruments', label: 'Instruments' },
        { id: 'levels', label: 'Five levels' },
        { id: 'process', label: 'Process' },
        { id: 'work', label: 'Work' },
        { id: 'reviews', label: 'Reviews' }
      ],

      work: [
        { img: frame('pc-gallardo', { alt: 'An orange Lamborghini Gallardo Superleggera on the studio lift', sizes: workSizes(true), ratio: '4 / 3' }), cap: 'Lamborghini Gallardo Superleggera', wide: true },
        { img: frame('pc-alfa', { alt: 'A red Alfa Romeo GT Junior on the studio lift', sizes: workSizes(false), ratio: '4 / 3' }), cap: 'Alfa Romeo GT Junior' },
        { img: frame('pc-f40', { alt: 'A red Ferrari F40 in a private garage in Monaco', sizes: '(max-width: 767px) 92vw, 92vw', ratio: '21 / 9' }), cap: 'Ferrari F40, Monaco', full: true }
      ],

      stars, reviews,
      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      bookTitle: 'Ready to talk <span class="gold">about your car?</span>',
      bookLede: 'Every conversation starts honestly. Paul will tell you what the car needs and what he recommends, before any commitment is made.',
      formServices: site.picks('Paint correction'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Paint correction', serviceType: 'Paint correction',
        description: 'Five levels of machine paint correction, from enhancement polish to concours perfect, after measuring paint depth, gloss and orange peel.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
