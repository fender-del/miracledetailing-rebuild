/* ============================================================
   Bodyshop & paint repair (06/10, v0.5 pages only, PPF rules).

   v0.5 /bodyshop-paint-repair/, in its order:
     hero · the complete picture · what's available (4) · why through
     Miracle Detail (3) · how it works (4) · one call, no stress (the
     client story + 4 steps) · book
   v0.5 shows no photos on this page: the old site's bodyshop photo and
   the Mercedes 600 restoration from the About timeline stand in.
   "From £???" kept as written (Fender 06/10).
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs, cards, prose, quote, steps } = require('../lib/shared.js');

const SLUG = 'bodyshop-repair';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Bodyshop & paint repair', href: `/${SLUG}/` }
  ]);

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'process', arrive: 'process:cut',
    title: 'Bodyshop & Paint Repair in Surrey | Miracle Detail',
    description: 'Bodyshop and paint repair through Miracle Detail, Lingfield, Surrey: panel repair, single panel respray, full respray and full restoration, coordinated by Paul Dalton with correction and protection.',
    preload: [
      { id: 'bs-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'bs-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'overview',
        title: 'The complete picture. <span class="gold">Paint repair and detailing. Together.</span>',
        img: frame('bs-600', { alt: 'A Mercedes 600 before and after its full restoration, from bare metal to finished paint', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '1 / 1' }),
        paras: [
          'No detail, however thorough, can correct paint that needs repairing at a bodywork level. Stone chips that have broken through to bare metal, accident damage, faded single panels, or a car requiring a full respray: these need proper paint repair before detailing work begins.',
          'Bodyshop work is available through Miracle Detail as part of your overall package. Paul coordinates the repair work alongside the detail, so the car receives the right treatment in the right order, and leaves in the condition it should be in. No managing multiple suppliers, no gaps between what the bodyshop does and what the detailer expects.',
          'Every job is assessed individually. Paul will advise on what the car needs, what the repair involves and how it fits into the overall detail plan, before any commitment is made.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'available', light: true, cols: 4, fx: 'rail',
        eyebrow: 'What’s available',
        title: 'From single panels to <span class="gold">full restorations.</span>',
        items: [
          { n: 'I', name: 'Panel Repair', sub: 'Localised damage, one panel',
            paras: 'For stone chips, scuffs, minor accident damage or corrosion on a single panel. The affected area is repaired and refinished to match the surrounding paintwork: blended, colour-matched and lacquered to an invisible finish.',
            list: ['Stone chip and scratch repair', 'Scuff and impact damage', 'Corrosion and rust treatment', 'Colour-matched refinish', 'Blend into surrounding panels where required'],
            price: 'From £???' },
          { n: 'II', name: 'Single Panel Respray', sub: 'Full panel refinish',
            paras: 'Where repair alone isn’t sufficient, a full panel respray delivers a factory-quality finish across the entire panel. Correct preparation, accurate colour matching and a finish that holds up to paint correction and protective coating once cured.',
            list: ['Full panel strip and preparation', 'Factory-accurate colour matching', 'High-quality primer, base and lacquer', 'Blend into adjacent panels', 'Ready for detailing and protection'],
            price: 'From £???' },
          { n: 'III', name: 'Full Respray', sub: 'Complete paint refresh or colour change',
            paras: 'The entire car resprayed: original colour refreshed to concours standard, or a full colour change. For cars where the paint has aged beyond what correction can address, or where the owner wants a completely different finish. Coordinated with paint correction and protective coating once complete.',
            list: ['Full vehicle strip and preparation', 'Original colour or full colour change', 'All panels, shuts and edges', 'Primer, base, lacquer to factory standard', 'Followed by paint correction and protection'],
            price: 'From £???' },
          { n: 'IV', name: 'Full Restoration', sub: 'Classic, historic and neglected cars', hi: true,
            paras: 'For cars requiring comprehensive bodywork restoration: rust removal, panel repair or replacement, bare metal preparation and full refinishing. Coordinated with Paul’s detailing work to deliver a car that is mechanically sound, structurally solid and finished to concours standard. Classic cars, investment vehicles and long-term restoration projects welcome.',
            list: ['Rust and corrosion removal', 'Panel repair and replacement', 'Bare metal preparation', 'Full refinishing to specification', 'Detailing and protection to complete the job'],
            price: 'Price on assessment' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'why', variant: 'points', cols: 3,
        eyebrow: 'Why through Miracle Detail',
        title: 'One point of contact. <span class="gold">The right result.</span>',
        items: [
          { n: 'I', name: 'Repair Before Detail', paras: 'Detailing work must follow bodywork repair, not precede it. By coordinating both through Miracle Detail, the sequence is correct from the start. The paint goes on right. The correction follows. The protection goes on last. Nothing is wasted, nothing is done twice.' },
          { n: 'II', name: 'One Relationship', paras: 'Managing a bodyshop and a detailer separately means two sets of communications, two collection schedules and two different standards to reconcile. Through Miracle Detail, Paul manages the coordination: you deal with one person and receive one result.' },
          { n: 'III', name: 'The Full Package', paras: 'A car that has been repaired, corrected, coated and protected is a car that has been done properly, from the metal out. That is what Miracle Detail makes possible. Bodyshop, detailing and protection. Complete.' }
        ]
      }) } },
      { block: '23-svc-steps', with: steps({
        id: 'process', graphite: true,
        stage: { img: frame('bs-roma', { alt: '', sizes: '(max-width: 1023px) 1px, 36vw', ratio: false }) },
        eyebrow: 'How it works',
        title: 'The right order. <span class="gold">Every time.</span>',
        steps: [
          { name: 'Assessment', text: 'Paul assesses the car in full: bodywork condition, paint condition and what the client wants to achieve. A clear plan is agreed before anything starts.' },
          { name: 'Bodywork &amp; Repair', text: 'Panel repair, respray or restoration, completed first, to the correct standard, cured and ready for detailing work to follow.' },
          { name: 'Paint Correction', text: 'Once the bodywork is complete, paint correction brings the entire car (new and existing panels) to a consistent, perfect finish.' },
          { name: 'Protection', text: 'Ceramic coating, PPF or both, applied over corrected paint to preserve the result for years. The car leaves protected from the inside out.' }
        ]
      }) },
      { block: '38-svc-quote', with: { quote: quote({
        id: 'one-call', light: true,
        eyebrow: 'How it actually works',
        title: 'One call. <span class="gold">No stress.</span>',
        text: '“She crashed her car. She made one phone call. <span class="gold">That was all she had to do.</span>”',
        paras: [
          'A recent client came to Paul after an accident left her car badly damaged. She didn’t know where to start: which bodyshop to trust, how to get the car there, whether it would come back looking right. She made one call to Paul.',
          'Paul arranged covered transportation to collect the car from her door. It went directly to the bodyshop. Once the repair was complete, it was transported back to the Miracle Detail studio for final paint correction, polishing and ceramic coating.',
          'She never dealt with the bodyshop. She never arranged a transporter. She never chased anyone for an update. She made one call, and she collected a car that came back better than it was before the accident.'
        ]
      }) } },
      { block: '23-svc-steps', with: steps({
        id: 'one-call-steps', tight: true, light: true,
        steps: [
          { num: '1', name: 'One phone call to Paul', text: 'Describe the situation. Paul handles everything from there.' },
          { num: '2', name: 'Covered collection arranged', text: 'The car is collected from wherever it is, transported safely and securely to the bodyshop.' },
          { num: '3', name: 'Repair, then straight to detailing', text: 'Once the bodywork is complete, the car comes directly to Paul for correction, polishing and protection.' },
          { num: '4', name: 'Collect a better car', text: 'The car comes back corrected, protected and in better condition than before the accident. One call was all it took.' }
        ]
      }) },
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        h1: 'Bodyshop & Paint Repair',
        line: 'When the damage goes deeper <span class="gold">than the surface.</span>',
        lede: 'From a single scuffed panel to a full restoration, bodyshop and paint repair is available through Miracle Detail. One point of contact, coordinated around your detail, finished to the same standard as the detailing work that follows it.',
        img: frame('bs-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'A grey Ferrari Roma in the workshop on a red protective mat',
          art: [{ media: '(max-width: 900px)', id: 'bs-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'available', label: 'What’s available' },
        { id: 'why', label: 'Why us' },
        { id: 'process', label: 'How it works' },
        { id: 'one-call', label: 'One call' }
      ],

      bookTitle: 'Start with an <span class="gold">honest conversation.</span>',
      bookLede: 'Tell Paul about the car and what it needs. He’ll advise on the repair, the detail and what the full job involves, before any commitment is made.',
      formServices: site.picks('Leather, wheels or bodywork'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Bodyshop and paint repair', serviceType: 'Bodyshop and paint repair',
        description: 'Panel repair, single panel respray, full respray and full restoration, coordinated through Miracle Detail with correction and protection.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
