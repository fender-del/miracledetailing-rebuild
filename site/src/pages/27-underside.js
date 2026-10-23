/* ============================================================
   Underside coating. First built 23/10 from Paul's board note ("Need a
   new page for underside coating") with drafted words; rebuilt the same
   day on Paul's own page (miracledetail-underside.html, Fender 23/10:
   "build lại trang under coating theo cấu trúc và content này"). His
   words whole, only the long dashes changed; his photos: a coated
   Toyota arch (his damper close-up is already the hero) and one
   subframe, before above after.

   hero · most detailers stop at the paint · Feynlab Industrial V2 ·
   the result (same subframe) · what gets protected · why it matters ·
   price · reviews · book
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose, pairs } = require('../lib/shared.js');

const SLUG = 'underside-coating';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Underside coating', href: `/${SLUG}/` }
  ]);
  const svc = site.services.find(s => s.key === 'underside');
  const wide = (id, alt) => frame(id, { alt, sizes: '(max-width: 767px) 92vw, 560px', ratio: '2 / 1' });

  return {
    slug: SLUG,
    cluster: 'process',
    title: 'Underside & Underbody Coating in Surrey | Feynlab Industrial V2 | Miracle Detail',
    description: 'Professional underbody and underside coating by Miracle Detail. Feynlab Industrial V2: 10 years of protection for chassis, suspension, arches and underbody. Lingfield, Surrey.',
    preload: [
      { id: 'us-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'us-hero', media: '(min-width: 901px)', sizes: '66vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'overview', light: true,
        title: 'Most detailers stop at the paint. <span class="gold">Paul doesn’t.</span>',
        /* Paul's damper close-up is the hero photo already, so
           the arch and spring here */
        img: frame('us-spring', { alt: 'A coated wheel arch: coil spring, damper and arch metal in gloss black above the studio floor', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        cap: 'After Feynlab Industrial V2',
        paras: [
          'The underbody of a car is its most exposed surface. While paint protection and ceramic coatings preserve the panels everyone can see, the chassis, sills, suspension components and wheel arches are left to absorb everything the road throws at them: unprotected.',
          '<strong>Underbody coating changes that.</strong> A single application of Feynlab Industrial V2 bonds to metal, plastic and composite surfaces beneath your car, delivering ten years of protection against corrosion, chemical attack, abrasion and moisture ingress.',
          'It reduces cleaning intervals, protects against salt and grime build-up, and preserves the structural integrity of components that are expensive to replace and impossible to ignore once they start to deteriorate.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'product', variant: 'points', cols: 5, brief: true, graphite: true,
        eyebrow: 'The product',
        title: 'Feynlab <span class="gold">Industrial V2</span>',
        intro: [
          'Feynlab Industrial V2 is a multi-purpose, UV-resistant coating designed for maximum protection across hard surfaces: vehicle underbody, chassis, suspension components, arches, metals and plastics.',
          'As a <strong>high-solids, single-component coating</strong>, it provides superior resistance to chemicals, abrasion and sun exposure. Extremely hydrophobic, with excellent release properties that prevent contamination from bonding to treated surfaces.',
          'The same product applied to the underside of trains in Norway to prevent snow and ice adhesion. On your car, it means the most exposed surfaces receive the toughest protection Feynlab makes.'
        ],
        items: [
          { n: 'I', name: '10-Year Durability', paras: 'A single application lasts a decade. Protection that continues working long after most treatments have worn away.' },
          { n: 'II', name: 'Chemical Resistance', paras: 'Resists road salt, brake fluid, oils, fuel and industrial contaminants. The chemistry that attacks unprotected underbodies cannot penetrate this coating.' },
          { n: 'III', name: 'Abrasion Resistance', paras: 'Stone chips, grit and road debris bounce off rather than scoring the surface. The coating absorbs impact that would otherwise reach bare metal.' },
          { n: 'IV', name: 'Extreme Hydrophobicity', paras: 'Water and contamination bead and release rather than sitting on the surface. The underbody stays cleaner for longer between washes.' },
          { n: 'V', name: 'UV Resistance', paras: 'Plastics and rubbers beneath the car are protected from UV degradation, preserving flexibility and preventing the cracking that accelerates deterioration.' }
        ]
      }) } },
      { block: '57-svc-pairs', with: { pairs: pairs({
        id: 'result', light: true, wide: true,
        eyebrow: 'The result',
        title: 'What the coating <span class="gold">actually looks like.</span>',
        /* Paul's one photo, before above after, split at the seam */
        items: [
          { before: wide('us-b', 'Before: a front subframe and sump, dull, grimy and spotted with surface rust'),
            after: wide('us-a', 'After Feynlab Industrial V2: the same subframe and sump, clean and coated in gloss black'),
            thumb: '', bl: 'Before', al: 'After, same subframe' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'coverage', cols: 4,
        eyebrow: 'What gets protected',
        title: 'Bespoke to every car and every <span class="gold">requirement.</span>',
        items: [
          { n: 'I', name: 'Full Underbody', paras: 'Complete coverage of the entire underside: chassis rails, floor pan, crossmembers and all structural components. Nothing underneath is left untreated.' },
          { n: 'II', name: 'Wheel Arches', paras: 'The arches take more direct stone chip and abrasion impact than any other part of the car. Coating the inner arches and arch liners dramatically reduces the damage that accumulates over time.' },
          { n: 'III', name: 'Suspension Components', paras: 'Wishbones, subframes, anti-roll bars, brake lines and callipers. Components that are expensive to replace and critical to safety, coated for long-term protection against corrosion and contamination.' },
          { n: 'IV', name: 'Sills &amp; Shut Lines', paras: 'The sills and door shut lines are prime entry points for moisture and corrosion. Coating these areas prevents the trapped water and salt ingress that causes rust to develop unseen.' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'why', variant: 'points', cols: 3, brief: true, light: true,
        eyebrow: 'Why it matters',
        title: 'The case for protecting <span class="gold">what you can’t see.</span>',
        items: [
          { n: 'I', name: 'Corrosion Prevention', paras: 'Bare metal exposed to road salt, moisture and oxygen corrodes. Once it starts, it spreads. Underbody coating seals metal surfaces from the conditions that cause corrosion before it has a chance to begin.' },
          { n: 'II', name: 'Residual Value', paras: 'A clean, protected underbody is increasingly scrutinised at point of sale, especially on prestige and classic vehicles. A car with a coated, corrosion-free underbody commands higher values and shorter sales periods.' },
          { n: 'III', name: 'Reduced Maintenance', paras: 'Contamination that would otherwise bond to bare metal or plastic releases easily from a coated surface. Cleaning intervals are reduced and the condition of components is maintained for longer between services.' }
        ]
      }) } },
      '39-svc-price',
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      /* ---------- Hero: Paul's photo of a coated Toyota underside on the
         studio lift (Drive, 21/10); his page's hero words ---------- */
      hero: {
        stats: true, shift: true, dpos: '50% 30%',
        h1: 'Underside & Underbody Coating',
        line: 'The part of your car nobody sees. <span class="gold">Protected like they do.</span>',
        lede: 'Your underbody faces more punishment than any other part of your car. Stone chips, road salt, chemical contamination, moisture and abrasion: relentlessly, every single mile. Feynlab Industrial V2 puts a stop to it.',
        img: frame('us-hero', {
          priority: true, ratio: false, sizes: '(max-width: 900px) 100vw, 66vw',
          alt: 'The underside of a Toyota on the studio lift after coating: gloss black chassis, suspension arms and a coil spring',
          art: [{ media: '(max-width: 900px)', id: 'us-hero-m', sizes: '100vw' }]
        }),
        facts: [
          { k: 'Coating durability', v: '10yr', big: true },
          /* Paul's "£850+VAT / From"; + VAT moves to the key, so the
             figure fits beside the other two on a phone */
          { k: 'From + VAT', v: '£850' },
          { k: 'Detailer. Every job.', v: '1' }
        ]
      },

      stars, reviews,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'product', label: 'The product' },
        { id: 'result', label: 'The result' },
        { id: 'coverage', label: 'What gets protected' },
        { id: 'why', label: 'Why it matters' },
        { id: 'price', label: 'Price' },
        { id: 'reviews', label: 'Reviews' }
      ],

      band: {
        id: 'price',
        k: 'Underside Coating, <span class="gold">from</span>',
        amount: svc.price.replace(/^From /, ''),
        /* one paragraph: the band's grid holds a single note */
        note: 'Price depends on vehicle size, condition and coverage required. Every job is assessed individually. Paul will advise on preparation required and what coverage he recommends.'
      },

      bookTitle: 'Protect the parts <span class="gold">that matter most.</span>',
      bookLede: 'Most people never think about their underbody until something goes wrong. The best time to protect it is before it does.',
      formServices: site.picks('Underside coating'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Underside coating', serviceType: 'Underbody protection coating',
        description: 'Feynlab Industrial V2 coating of the underbody, chassis, suspension, wheel arches, sills and shut lines. 10 years of protection.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London'],
        offers: { '@type': 'Offer', priceCurrency: 'GBP', price: String(svc.from), priceSpecification: { '@type': 'PriceSpecification', minPrice: String(svc.from), priceCurrency: 'GBP', valueAddedTaxIncluded: false } }
      }
    ]
  };
};
