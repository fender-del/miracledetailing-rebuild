/* ============================================================
   Paintless dent removal (06/10, v0.5 pages only, PPF rules).

   v0.5 /paintless-dent-removal/, in its order:
     hero · original paint, no dent · how it works (+5 steps)
     · why PDR over traditional repair (two lists) · what PDR is right
     for (3 + the limits) · book (+ v0.5's "Bodyshop & Paint Repair")
   09/10 (Fender: QC + rebuild): the page had one photo and four blocks
   of words. Now: the overview beside Paul's other PDR photo (the E30
   M3 with the light board); the five steps beside a panel under a light
   board that tells them (block 59; first drawn in code, then, Fender
   the same day, one realistic close-up per step, AI renders until
   Paul has his own); the comparison under one switch on phones; "Right for" with
   a drawing of each kind of dent, one row each on phones.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose } = require('../lib/shared.js');

const SLUG = 'paintless-dent-removal';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Paintless dent removal', href: `/${SLUG}/` }
  ]);

  /* 09/10 (Fender): realistic close-ups (AI renders, assets-src/pdr/)
     in place of the panel drawn in code: one per step, one per kind */
  const ALT = {
    s1: 'A gloved hand holding an inspection light beside a door dent, the light board’s lines bending round it',
    s2: 'A technician guiding a PDR rod down through the window slot of a black car door',
    s3: 'A gloved hand on a black door as the dent is worked out from behind, the reflected lines almost straight',
    s4: 'A handheld inspection lamp raking across a black door, the light board’s lines straight',
    s5: 'Paul polishing the bonnet of a black BMW M3, the studio lights mirrored in the paint'
  };
  const stepPics = k => ({
    pic: frame(`pd-${k}`, { alt: '', sizes: '(min-width: 1024px) 460px, 1px', ratio: '4 / 5' }),
    img: frame(`pd-${k}m`, { alt: ALT[k], sizes: '(max-width: 767px) 80vw, (max-width: 1023px) 560px, 1px', ratio: '16 / 10' })
  });
  const kindImg = (id, alt) => frame(id, { alt, sizes: '(max-width: 767px) 82px, 30vw', ratio: '16 / 9' });

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'process', arrive: 'how:cut',
    title: 'Paintless Dent Removal (PDR) in Surrey | Miracle Detail',
    description: 'Paintless dent removal through Miracle Detail, Lingfield, Surrey: car park dents, hail damage and larger dents removed from behind the panel. No filler, no respray, the original paint intact.',
    preload: [
      { id: 'pd-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'pd-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'overview', light: true,
        img: frame('pd-e30', { alt: 'A PDR rod in at the tail light of a silver BMW E30 M3, the light board standing beside the rear quarter', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        title: 'Original paint. No dent. <span class="gold">No compromise.</span>',
        paras: [
          'A dent in a panel used to mean one thing: filler, primer and a respray. The original paint disturbed, the factory finish lost, and a repair that, however good, will never be quite the same as what came before it.',
          'Paintless dent removal changes that entirely. The paint is never touched. The dent is removed from behind the panel using specialist tools (massaged, not forced) until the metal returns to exactly where it started. No filler. No primer. No paint. The original factory finish, intact.',
          'PDR is available through Miracle Detail as part of your detail package: coordinated by Paul, carried out by a technician whose work he trusts completely, after 37 years of working with everything from daily drivers to Bugattis and Koenigseggs.'
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'how', graphite: true,
        eyebrow: 'How it works',
        title: 'The art of <span class="gold">reading metal.</span>',
        paras: [
          'Paintless dent removal is as much a craft as paint correction. The technician uses specialist rods, picks and lighting to assess the dent from behind the panel, understanding the shape, depth and tension of the metal before a tool is moved.',
          'Working from the inside out, the dent is gradually and precisely pushed back to its original position. The process is methodical and unhurried. Rush it and the metal moves wrong. Take the time and it disappears completely.',
          'The paint flex required for PDR means the process works best on dents where the paint surface is unbroken: no cracking, no chips at the dent’s edge. Paul will assess the damage first and advise on whether PDR is the right solution or whether bodyshop repair is more appropriate.'
        ]
      }) } },
      { block: '59-pd-read', with: { read: {
        id: 'how-steps', total: '05',
        steps: [
          { ...stepPics('s1'), name: 'Assessment', text: 'The dent is assessed under specialist lighting: size, depth, location and paint condition all evaluated before any tools are used.' },
          { ...stepPics('s2'), name: 'Access', text: 'The technician gains access behind the panel (through door apertures, boot openings or by removing trim) to reach the back of the dent.' },
          { ...stepPics('s3'), name: 'Manipulation', text: 'Specialist rods and picks are used to gradually work the metal back into position, reading the panel’s response at every stage and adjusting accordingly.' },
          { ...stepPics('s4'), name: 'Inspection', text: 'The repair is inspected under multiple light sources: the same rigour applied to paint correction. The dent is gone or the job isn’t finished.' },
          { ...stepPics('s5'), name: 'Detailing follows', text: 'Once PDR is complete, paint correction and protection can follow: the panel is as good as it can be, and the finish is preserved for years.' }
        ]
      } } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'why-pdr', light: true, variant: 'versus',
        eyebrow: 'Why PDR over traditional repair',
        title: 'The original finish is always <span class="gold">the best finish.</span>',
        items: [
          { name: 'Paintless Dent Removal', sub: 'The preferred method', hi: true,
            list: ['Original factory paint preserved completely', 'No filler, ever', 'No colour matching required', 'No risk of respray mismatch with adjacent panels', 'Faster than traditional bodyshop repair', 'More cost effective in most cases', 'Residual value of the car protected', 'Result is invisible, not just improved'] },
          { name: 'Traditional Body Repair', sub: 'Where PDR isn’t possible', no: true,
            list: ['Original paint disturbed or removed', 'Filler used to build back shape', 'Colour matching, never exact', 'Longer repair time', 'Higher cost in most cases', 'Repair history affects residual value', 'Result is improved, not invisible'] }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'right-for', variant: 'points', cols: 3, graphite: true, brief: true,
        eyebrow: 'What PDR is right for',
        title: 'Most dents. <span class="gold">One solution.</span>',
        items: [
          { n: 'I', img: kindImg('pd-ding', 'A small car park ding under a door handle, shown up by the light board’s lines'), name: 'Car Park Dents', paras: 'The most common PDR job. Door dings and car park impacts (typically small, sharp dents with unbroken paint) are exactly what PDR is designed for. Often removed in hours.' },
          { n: 'II', img: kindImg('pd-hail', 'Hail dents across a dark blue bonnet, each one a wobble in the reflected lines'), name: 'Hail Damage', paras: 'Multiple small dents across panels from hail storms. PDR is the only method that can address hail damage without respraying multiple panels, preserving the original finish across the whole car.' },
          { n: 'III', img: kindImg('pd-large', 'A larger, shallow dent above a rear wheel arch, the paint unbroken'), name: 'Larger Dents', paras: 'Larger dents (minor accident damage, reversing impacts, shopping trolley strikes) can often be removed by PDR provided the paint hasn’t cracked or chipped at the impact point.' }
        ],
        note: ['PDR is not suitable for dents where the paint has cracked, where the metal is creased sharply, or where the panel cannot be accessed from behind. Paul will assess and advise honestly on what’s achievable.']
      }) } },
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        /* phones: where the poster crop is held (08/10) */
        mpos: '28% 50%',
        h1: 'Paintless Dent Removal',
        line: 'The dent is gone. <span class="gold">The paint stays.</span>',
        lede: 'Paintless dent removal is the only method that removes a dent without disturbing the original paint. No filler, no respray, no risk to the original finish. Available through Miracle Detail, carried out by a technician Paul trusts completely.',
        img: frame('pd-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'A technician working a dent out of a black Audi’s door by hand, a PDR light board beside him',
          art: [{ media: '(max-width: 900px)', id: 'pd-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      stars, reviews,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'how', label: 'How it works' },
        { id: 'why-pdr', label: 'PDR vs repair' },
        { id: 'right-for', label: 'Right for' },

        { id: 'reviews', label: 'Reviews' }
      ],

      bookTitle: 'The dent removed. <span class="gold">The paint untouched.</span>',
      bookMore: { href: '/bodyshop-repair/', label: 'Bodyshop & Paint Repair' },
      bookLede: 'Tell Paul about the dent: size, location, whether the paint is broken. He’ll tell you whether PDR is the right solution and what the process involves.',
      formServices: site.picks('Leather, wheels or bodywork'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Paintless dent removal', serviceType: 'Paintless dent removal (PDR)',
        description: 'Dents removed from behind the panel with no filler and no respray, coordinated through Miracle Detail.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
