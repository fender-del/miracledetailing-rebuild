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

   Rebuilt 08/10 (Fender: QC the page, rebuild it from what the other
   pages taught). Paul's words unchanged; what changed:
     - the instruments (block 55): heading centred over three equal
       instruments, each with a picture: the depth gauge photo, Paul's
       own gloss & orange peel meter (Drive), the paint under the
       microscope drawn in code. Was heading-left / text-right like the
       diagnosis above it, with one photo in three cards.
     - the five levels (block 56): one panel of black paint under a
       light; a level takes away its share of the defects (PLAN-
       interactions idea 1). Phones: panel, five stops, a row of cards
       to swipe (was a tap-to-open price list).
     - the process on a stage, each step its own photo (round 2).
     - the quote over a photo of Paul at work, sunk in behind (round 2;
       the Pagani photo behind it read as a second copy of the hero).
     - six more of Paul's cars under the work (round 2).
     - Gallardo and Alfa side by side on phones too; "View Packages"
       under the booking lede, as v0.5 has it.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, prose, quote, steps } = require('../lib/shared.js');
const { tools, scope } = require('../lib/correction.js');

const SLUG = 'paint-correction-and-polishing';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Paint correction', href: `/${SLUG}/` }
  ]);
  const workSizes = () => '(max-width: 767px) 46vw, 46vw';

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
      { block: '55-pc-tools', with: { tools: tools({
        id: 'instruments', light: true,
        eyebrow: 'Before a pad is lifted',
        title: 'The instruments <span class="gold">most detailers don’t own.</span>',
        intro: [
          'Paint correction at this level begins with information. Paul uses a set of instruments that, collectively, very few detailers in the world possess, giving him an understanding of the paint’s condition that makes every decision more precise and every result more predictable.',
          'This isn’t about equipment for its own sake. It’s about not guessing with someone else’s paintwork.'
        ],
        items: [
          { n: 'I', name: 'Paint Depth Gauge',
            img: frame('pc-gauge', { alt: 'A paint depth gauge held to a blue bonnet, its screen showing a reading', sizes: '(max-width: 767px) 116px, 30vw', ratio: false }),
            cap: 'Paint depth gauge: assessing clear coat before correction',
            paras: 'Measures the thickness of paint and clear coat across the panel. Tells Paul exactly how much correction is safe, and where the limits are.' },
          { n: 'II', name: 'Gloss &amp; Orange Peel Instrument',
            img: frame('pc-gloss', { alt: 'Paul’s gloss and orange peel meter on a carbon panel, showing its readings', sizes: '(max-width: 767px) 116px, 30vw', ratio: false }),
            paras: 'One of the most advanced paint analysis instruments in the detailing industry. Measures gloss level and orange peel texture with laboratory precision. Almost no other detailer in the UK is known to own one. This is what separates assessment from assumption.' },
          { n: 'III', name: 'Digital Microscope', scope: true,
            paras: 'Reveals defects invisible to the naked eye: fine swirl marks, micro-marring, contamination. What you can’t see, you can’t correct properly.' }
        ]
      }) } },
      { block: '56-pc-scope', with: { scope: scope({
        id: 'levels', light: true,
        eyebrow: 'Before a pad is lifted',
        title: 'Five levels. <span class="gold">One standard.</span>',
        /* 08/10: the Rolls-Royce photo and its caption dropped (Fender) */
        book: { href: '#book', label: 'Book a consultation' },
        levels: [
          { n: 'I', kicker: 'Level One', name: 'Enhancement Polish', f: 0.7, removal: 'up to 65–75%', price: 'From £???',
            paras: 'For paint in good overall condition that has lost its clarity. Light surface haze, minor wash marks and superficial swirling are refined. An excellent preparation step before protective coatings are applied.' },
          { n: 'II', kicker: 'Level Two', name: 'Light Correction', f: 0.8, removal: 'up to 75–85%', price: 'From £???',
            paras: 'For paint showing visible swirl marks, light scratches and minor water etching. A single corrective stage removes the majority of surface defects and restores genuine depth and gloss to the finish.' },
          { n: 'III', kicker: 'Level Three', name: 'Full Correction', f: 0.875, removal: 'up to 85–90%', price: 'From £???',
            paras: 'For paint carrying moderate to heavy defects: swirl marks, scratches, oxidation and water etching. A multi-stage process that cuts and refines the surface to deliver results that turn heads under any light.' },
          { n: 'IV', kicker: 'Level Four', name: 'Advanced Correction', f: 0.95, removal: 'up to 95%', price: 'From £???',
            paras: 'For heavily neglected or damaged paint requiring maximum intervention. Every available stage of correction is applied to take the paint as close to its original manufactured state as the clear coat will safely allow.' },
          { n: 'V', kicker: 'Level Five', name: 'Concours Perfect', hi: true, f: 0.995, removal: '99–100%', price: 'From £???',
            paras: 'The ultimate standard. Paint corrected to concours specification: every panel taken to absolute perfection under multiple light sources. The level Paul prepares cars to for concours events. Every car he has entered has won its class.' }
        ]
      }) } },
      { block: '23-svc-steps', with: steps({
        id: 'process', graphite: true,
        /* 08/10: each step its own picture (Fender: "lựa ảnh phù hợp với các step") */
        stage: { pics: true },
        steps: [
          { name: 'Assessment', pic: frame('pc-s1', { alt: '', sizes: '(max-width: 1023px) 1px, 34vw', ratio: false }), img: frame('pc-s1', { alt: 'Fine swirl marks in dark paint, picked out by an inspection light', sizes: '(max-width: 1023px) 84vw, 1px', ratio: false }),
            text: 'Paint depth measured. Gloss and orange peel analysed. Surface examined under controlled lighting and digital microscope. The condition of the paint is understood before anything else happens.' },
          { name: 'Decontamination', pic: frame('pc-s2', { alt: '', sizes: '(max-width: 1023px) 1px, 34vw', ratio: false }), img: frame('pc-s2', { alt: 'A Mercedes C63 AMG on a jack in the studio, its wheels off', sizes: '(max-width: 1023px) 84vw, 1px', ratio: false }),
            text: 'The paint is fully decontaminated before correction begins: iron fallout, bonded contamination and surface debris removed. Correcting contaminated paint is correcting the wrong thing.' },
          { name: 'Correction', pic: frame('pc-polish', { alt: '', sizes: '(max-width: 1023px) 1px, 34vw', ratio: false }), img: frame('pc-polish', { alt: 'Paul machine polishing the bonnet of a black BMW M3 under hexagon lights', sizes: '(max-width: 1023px) 84vw, 1px', ratio: false }),
            text: 'Machine polishing by hand, panel by panel, under specialist lighting throughout. The process is methodical, unhurried and done by one person: Paul. No apprentices, no rushing, no shortcuts.' },
          { name: 'Inspection', pic: frame('pc-s4', { alt: '', sizes: '(max-width: 1023px) 1px, 34vw', ratio: false }), img: frame('pc-s4', { alt: 'An inspection light held to a black panel, the polishing pads below it', sizes: '(max-width: 1023px) 84vw, 1px', ratio: false }),
            text: 'Every panel checked under multiple light sources before the job is considered complete. The standard is set by what the paint can achieve, not by what’s quick.' }
        ]
      }) },
      { block: '38-svc-quote', with: { quote: quote({
        id: 'concours', side: true,
        img: frame('pc-seat', { alt: '', sizes: '(max-width: 899px) 100vw, 60vw', ratio: false }),
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
        /* phones: where the poster crop is held (08/10) */
        mpos: '38% 50%',
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
        { img: frame('pc-gallardo', { alt: 'An orange Lamborghini Gallardo Superleggera on the studio lift', sizes: workSizes(true), ratio: '4 / 3' }), cap: 'Lamborghini Gallardo Superleggera', half: true },
        { img: frame('pc-alfa', { alt: 'A red Alfa Romeo GT Junior on the studio lift', sizes: workSizes(false), ratio: '4 / 3' }), cap: 'Alfa Romeo GT Junior', half: true },
        { img: frame('pc-f40', { alt: 'A red Ferrari F40 in a private garage in Monaco', sizes: '(max-width: 767px) 92vw, 92vw', ratio: '21 / 9' }), cap: 'Ferrari F40, Monaco', full: true },
        /* 08/10: more of Paul's cars (Fender: "cho thêm nhiều xe"), his Drive set */
        { img: frame('pc-w-enzo', { alt: 'A red Ferrari Enzo on a showroom floor', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari Enzo', third: true },
        { img: frame('pc-w-zonda', { alt: 'A blue carbon Pagani Zonda with gold wheels', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'Pagani Zonda', third: true },
        { img: frame('pc-w-monza', { alt: 'A grey Ferrari Monza SP in a dark studio', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari Monza SP', third: true },
        { img: frame('pc-w-f1', { alt: 'A purple McLaren F1 in the studio', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'McLaren F1', third: true },
        { img: frame('pc-w-911', { alt: 'A white classic Porsche 911 Carrera in the studio', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'Porsche 911 Carrera', third: true },
        { img: frame('pc-w-458', { alt: 'A yellow Ferrari 458 Speciale beside the Miracle Detail van', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari 458 Speciale', third: true }
      ],

      stars, reviews,
      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      bookTitle: 'Ready to talk <span class="gold">about your car?</span>',
      bookLede: 'Every conversation starts honestly. Paul will tell you what the car needs and what he recommends, before any commitment is made.',
      bookMore: { href: '/car-detailing-studio/', label: 'View Packages' },
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
