/* ============================================================
   Paint Protection Film — the sample service page (Fender 06/10).

   The rule for every service page from here on (Ed 06/10, Fender):
   Paul's v0.5 text stays word for word; only the layout and the UX are
   new. The one edit allowed is the em dash, replaced by a comma, colon
   or full stop. New words are interface labels only (the "on this
   page" bar, buttons, Read more, alt text, meta). No FAQ was added
   (v0.5 has none on this page) and no "To confirm" labels.

   v0.5 /paint-protection-film/, in its order:
     hero (headline, intro, three figures) · since 2006 · peace of mind
     · coverage options · film finishes · the films · the process
     · installation in progress · Google reviews · book
   Its own block: 34-ppf-coverage, the three packages beside a drawing
   of a car that lights the panels each one covers.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, mark } = require('../lib/shared.js');
const car = require('../lib/ppf-car.js');

const SLUG = 'paint-protection-film-ppf';

/* ---------- Coverage: v0.5's three packages ----------
   zs = the panels each line of the list lights on the drawing. */
const FRONT = ['bumperF', 'headlight', 'fog', 'bonnet', 'wingF', 'apillar', 'mirror', 'roofEdge'];
const ALL = ['bumperF', 'headlight', 'fog', 'bonnet', 'wingF', 'apillar', 'mirror', 'roofEdge', 'sill', 'door', 'roof', 'rearQ', 'boot', 'bumperR', 'taillight'];
const frontItems = [
  { t: 'Full bonnet and wings', zs: ['bonnet', 'wingF'] },
  { t: 'Full front bumper', zs: ['bumperF'] },
  { t: 'Headlights and fog lights', zs: ['headlight', 'fog'] },
  { t: 'A-pillars', zs: ['apillar'] },
  { t: 'Door mirror caps and faces', zs: ['mirror'] },
  { t: 'Roof leading edge', zs: ['roofEdge'] }
];

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Paint protection film', href: `/${SLUG}/` }
  ]);
  const from = n => site.price({ from: n });
  const short = n => '£' + (site.vatMode === 'inc' ? Math.round(n * 1.2) : n).toLocaleString('en-GB');

  const packages = [
    { key: 'front', n: 'I', name: 'Full Front End', sub: 'Maximum front protection', price: from(1500), priceShort: short(1500), zones: FRONT,
      desc: 'Complete protection for every surface that faces the road. The most popular starting point, covering the panels that take the most punishment from stone chips, road debris and motorway driving.',
      items: frontItems },
    { key: 'track', n: 'II', name: 'Track Pack', sub: 'Full front end + sills', price: from(2000), priceShort: short(2000), zones: [...FRONT, 'sill'],
      desc: 'Everything in the Full Front End, plus sill protection. For drivers who use their cars hard: on track, on motorways, or in conditions where road debris finds every low-down edge. A significant step up in real-world coverage.',
      items: [...frontItems, { t: 'Full sills', zs: ['sill'] }] },
    { key: 'full', n: 'III', name: 'Full Car', sub: 'Complete protection', price: from(4000), priceShort: short(4000), zones: ALL,
      desc: 'Every panel wrapped. Every surface protected. For clients who want their car preserved in its current condition, or better, indefinitely. The ultimate investment in a car you intend to keep, drive and love for years to come.',
      items: [
        { t: 'All body panels', zs: ['bumperF', 'bonnet', 'wingF', 'door', 'rearQ', 'bumperR', 'sill', 'roof', 'boot'] },
        { t: 'Full bonnet, roof and boot lid', zs: ['bonnet', 'roof', 'roofEdge', 'boot'] },
        { t: 'Doors, sills and pillars', zs: ['door', 'sill', 'apillar'] },
        { t: 'Bumpers front and rear', zs: ['bumperF', 'bumperR'] },
        { t: 'Mirrors and lights', zs: ['mirror', 'headlight', 'fog', 'taillight'] },
        { t: 'Bespoke coverage on request', zs: ALL }
      ] }
  ].map((p, i) => Object.assign(p, { first: i === 0, items: p.items.map(it => ({ t: it.t, zs: it.zs.join(' ') })) }));

  /* what the motion needs: lighting order, each package's panels, where
     each callout points, and which view shows a panel best */
  const pcData = JSON.stringify({
    order: ALL,
    packages: packages.map(p => ({ key: p.key, zones: p.zones })),
    anchors: car.anchors,
    prefer: { bonnet: 'plan', roof: 'plan', roofEdge: 'plan', boot: 'plan' }
  }).replace(/</g, '\\u003c');

  const workSizes = w => (w ? '(max-width: 767px) 92vw, 58vw' : '(max-width: 767px) 92vw, 34vw');

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'paint',
    title: 'Paint Protection Film (PPF) in Surrey | Miracle Detail',
    description: 'Paint protection film fitted by Paul Dalton in Lingfield, Surrey, since 2006: XPEL, SunTek, Profilm and STEK in gloss, matte and colour. Full front end from £1,500 + VAT.',
    preload: [
      { id: 'ppf-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'ppf-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      '32-svc-statement', '33-svc-prose',
      '34-ppf-coverage', '35-svc-tabs', '36-svc-brands',
      '23-svc-steps', '24-svc-work', '10-reviews', '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      /* ---------- Hero ---------- */
      hero: {
        /* round 5 (Fender 06/10): back to the LaFerrari film sweep, the
           figures kept as the gold row under the buttons */
        film: true,
        stats: true,
        /* phones: where the poster crop is held (08/10) */
        mpos: '58% 50%',
        h1: 'Paint Protection Film',
        line: 'The strongest <span class="gold">shield</span> paint has ever had.',
        lede: 'Paint Protection Film is an invisible armour: a self-healing urethane film that absorbs stone chips, abrasion and environmental damage so your paint never has to. Paul has been installing PPF since 2006. Longer than any other detailer in the UK.',
        img: frame('ppf-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'A red LaFerrari in the studio, the strip lights reflected in its bonnet and wings',
          art: [{ media: '(max-width: 900px)', id: 'ppf-hero-m', sizes: '100vw' }]
        }),
        facts: [
          { k: 'Installing PPF since', v: '2006', big: true },
          { k: 'Premium film brands', v: '4' },
          { k: 'Finishes available', v: '3' }
        ]
      },

      /* ---------- On this page ---------- */
      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'coverage', label: 'Coverage' },
        { id: 'finishes', label: 'Finishes' },
        { id: 'films', label: 'Films' },
        { id: 'process', label: 'Process' },
        { id: 'reviews', label: 'Reviews' }
      ],

      /* ---------- Since 2006 ---------- */
      statement: {
        id: 'overview',
        text: 'Paul has been installing Paint Protection Film <span class="gold">since 2006</span>, longer than any other detailer in the United Kingdom. Nearly two decades of experience fitting film to everything from daily drivers to Bugattis and Koenigseggs. Paired with his trusted PPF installer, that’s a combined <span class="gold">30+ years</span> of film installation experience behind every job.'
      },

      /* ---------- Peace of mind ---------- */
      prose: {
        id: 'protection',
        title: 'PPF isn’t just protection. <span class="gold">It’s peace of mind.</span>',
        img: frame('ppf-beads', { alt: 'Clear film being laid wet over the mirror of a red car, a pink squeegee in hand', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: [
          'Paint Protection Film is a virtually invisible urethane film applied directly to your car’s paintwork. It absorbs impacts, resists abrasion, deflects stone chips and shields against environmental contamination, all without altering the appearance of the paint beneath it.',
          'Modern PPF films are self-healing. Minor surface scratches and swirl marks disappear with the application of gentle heat, keeping the film, and the paint beneath it, looking perfect for years. Applied correctly, PPF stops physical damage that ceramic coating alone cannot prevent.',
          'The condition of the paint before the film goes on matters as much as the film itself. Paul corrects the paint to the required standard first, ensuring that what goes under the film is as good as it can be, because PPF is permanent protection, not a way to hide problems.'
        ]
      },

      /* ---------- Coverage ---------- */
      pcEyebrow: 'What’s right for your car',
      pcTitle: 'Coverage options. <span class="gold">Bespoke</span> to every car.',
      packages,
      pcNote: 'Every installation is assessed individually. Paul will advise on coverage based on how you use the car and what you want to protect.',
      pcSide: car.side(FRONT),
      pcPlan: car.plan(FRONT),
      pcData,

      /* ---------- Film finishes ---------- */
      tabs: {
        id: 'finishes',
        eyebrow: 'Film finishes',
        title: 'Three finishes. <span class="gold">Every car catered for.</span>',
        label: 'Film finishes',
        items: [
          { key: 'gloss', first: true, name: 'Gloss PPF', sub: 'Invisible protection',
            ba: { bl: 'Bare paint', al: 'Gloss PPF', pre: frame('fin-led-bare', { alt: 'The red bonnet of a LaFerrari under studio strip lights, the reflections broken by orange peel', sizes: '(max-width: 900px) 92vw, 52vw', ratio: false }), post: frame('fin-led-gloss', { alt: 'The same bonnet under gloss film, the strip lights reflected straight and sharp', sizes: '(max-width: 900px) 92vw, 52vw', ratio: false }) },
            
            paras: ['The standard choice. A virtually invisible film that enhances the depth and gloss of the paint beneath it while providing complete protection from stone chips, abrasion and environmental contamination. Self-healing under gentle heat.'] },
          { key: 'matte', name: 'Matte PPF', sub: 'Satin and matte finishes protected',
            ba: { bl: 'Gloss', al: 'Matte PPF', pre: frame('fin-film', { alt: 'The red bonnet of a LaFerrari in gloss paint', sizes: '(max-width: 900px) 92vw, 52vw', ratio: false }), post: frame('fin-satin', { alt: 'The same bonnet in a satin matte finish, no mirror reflections', sizes: '(max-width: 900px) 92vw, 52vw', ratio: false }) },
            
            paras: [
              'For matte and satin-finish vehicles, or for clients who want to convert a gloss car to a matte appearance. Matte PPF delivers the same level of protection as gloss film while preserving or creating the flat finish that makes these cars so distinctive.',
              'Matte and satin paintwork is uniquely vulnerable. A single stone chip on a gloss car can often be touched in. On a matte or satin finish, it cannot: the entire panel needs repainting to match. If that panel is a wing, the colour spread means the full side of the car may need to be repainted to achieve a consistent finish.'
            ],
            pull: ['The cost of one chip can run to thousands.'],
            after: ['PPF on a matte or satin car isn’t a luxury. It’s the only way to protect an investment that cannot be repaired, only replaced.'] },
          { key: 'colour', name: 'Colour PPF', sub: 'Change the colour, protect the paint',
            ba: { bl: 'Original', al: 'Colour PPF', pre: frame('fin-gloss', { alt: 'A yellow Ferrari 458 Speciale', sizes: '(max-width: 900px) 92vw, 52vw', ratio: false }), post: frame('fin-colour', { alt: 'The same 458 Speciale in gloss emerald green', sizes: '(max-width: 900px) 92vw, 52vw', ratio: false }) },
            
            paras: ['A colour change and a fully protected car in a single installation. Colour PPF films allow you to transform the appearance of your vehicle while the original paint beneath remains in perfect, protected condition, fully reversible at any time.'] }
        ]
      },

      /* ---------- The films ---------- */
      brands: {
        id: 'films',
        eyebrow: 'The films Paul installs',
        title: 'Four of the world’s best <span class="gold">PPF brands.</span>',
        intro: [
          'Not every car is the same, and not every film is right for every application. Paul works with four of the leading PPF manufacturers, selecting the right product for each car, each client and each coverage requirement.',
          'Whether it’s computer-cut patterns for a perfect factory fit or hand-cut installation for complex curves and bespoke coverage, the method is chosen based on what gives the best result for that car, not what’s quickest.'
        ],
        items: [
          { name: 'XPEL', mark: mark('xpel'), text: 'The world’s leading PPF brand. Self-healing, optically clear and available in gloss, matte and colour finishes. The benchmark for premium paint protection. XPEL film comes with a 10-year manufacturer’s warranty.' },
          { name: 'SunTek', mark: mark('suntek'), text: 'High-clarity film with excellent self-healing properties and strong chemical resistance. A trusted choice for full-car installations.' },
          { name: 'Profilm', mark: mark('profilm'), text: 'Premium European film with outstanding optical clarity and durability. Favoured for its performance on complex curves and challenging panel geometry.' },
          { name: 'Stek', mark: mark('stek'), text: 'A strong range including gloss, matte and colour films. Known for deep gloss and excellent longevity across a wide range of applications.' }
        ]
      },

      /* ---------- The process ---------- */
      stepsEyebrow: 'How every PPF job is done',
      stepsTitle: 'The process behind a <span class="gold">perfect installation.</span>',
      steps: [
        { name: 'Paint Assessment', text: 'The paint is assessed and corrected to the required standard before any film is applied. PPF locks in what’s underneath, so what goes under the film needs to be right.' },
        { name: 'Decontamination', text: 'Every surface is fully decontaminated. Any bonded contamination, iron fallout or residue is removed before the film goes near the paint.' },
        { name: 'Pattern & Application', text: 'Computer-cut patterns or hand-cut installation, whichever gives the best result for this car. Each panel is fitted individually, by hand, with no rush and no compromise.' },
        { name: 'Inspection & Cure', text: 'Every panel inspected under specialist lighting before the job is signed off. The film is allowed to cure fully before the car leaves the studio.' }
      ],

      /* ---------- Installation, in progress (Paul's photos) ---------- */
      workEyebrow: 'Installation, in progress',
      workTitle: 'Every panel. <span class="gold">Every car.</span>',
      work: [
        { img: frame('ppf-door', { alt: 'Film being squeegeed onto the door of a red supercar', sizes: workSizes(true), ratio: '16 / 9' }), wide: true },
        { img: frame('ppf-lamp', { alt: 'Film being worked around the headlight of a black car', sizes: workSizes(false), ratio: '16 / 9' }) },
        { img: frame('ppf-edge', { alt: 'The edge of the film wrapped neatly around a panel gap on a blue car', sizes: workSizes(false), ratio: '16 / 9' }) },
        { img: frame('ppf-stretch', { alt: 'A sheet of film stretched over the bonnet of a black car before it is laid down', sizes: workSizes(true), ratio: '16 / 9' }), wide: true }
      ],

      /* ---------- Reviews (shared block) ---------- */
      stars, reviews,
      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      /* ---------- Book (shared block, PPF ticked) ---------- */
      bookTitle: 'The best time to protect your paint was <span class="gold">the day you bought the car.</span>',
      bookLede: 'The second best time is now. Every consultation is honest: Paul will tell you what coverage he recommends and exactly why.',
      formServices: site.picks('Paint protection film'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Paint protection film', serviceType: 'Paint protection film (PPF)',
        description: 'Self-healing paint protection film fitted in the studio in Lingfield, Surrey: full front end, track pack or full car, in gloss, matte or colour.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog', name: 'Coverage options',
          itemListElement: packages.map((p, i) => ({
            '@type': 'Offer', name: p.name, description: p.sub, priceCurrency: 'GBP',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: [1500, 2000, 4000][i], priceCurrency: 'GBP', valueAddedTaxIncluded: site.vatMode === 'inc' }
          }))
        }
      }
    ]
  };
};
