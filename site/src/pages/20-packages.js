/* ============================================================
   Detailing packages (06/10, v0.5 pages only, PPF rules).
   Old-site slug /car-detailing-studio/ kept (PLAN.md §5.1).

   v0.5 /packages/, in its order:
     hero · choose your level · five levels · two notes · wheel ceramic
     coating · Google reviews · book
   v0.5 slips: Level 1's descriptor repeats its name (left out); the
   wheel ceramic box carries "Level 5 — The Pinnacle" and "Estimated
   time 50–100 hours" twice (copied from Level 5; left out). Both in
   REQUESTS.md. "From / From £1,000" reads "From £1,000".
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose } = require('../lib/shared.js');

const SLUG = 'car-detailing-studio';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Detailing packages', href: `/${SLUG}/` }
  ]);
  const book = [{ label: 'Book Now', href: '#book', ext: null }];

  return {
    slug: SLUG,
    title: 'Car Detailing Packages | Five Levels | Miracle Detail, Surrey',
    description: 'Five detailing packages by Paul Dalton in Lingfield, Surrey: Maintenance, Protection, Correction, Ultimate and the Paul Dalton Signature Detail. From £175 + VAT.',
    preload: [
      { id: 'pk-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'pk-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'choose',
        eyebrow: 'The beginning',
        title: 'Choose your level. <span class="gold">Paul does the rest.</span>',
        img: frame('pk-pagani', { alt: 'Paul Dalton polishing a black Pagani by hand in the studio', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        paras: [
          'The right package depends on your car, its condition and what you want to achieve. Paul will always advise honestly on which level he recommends for your car, and if a lower level will achieve the result you’re after, that’s what he’ll tell you.',
          'Every package includes Paul’s full attention, from first wash to final inspection. No apprentices, no assistants, no shortcuts, regardless of which level you book.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'levels', light: true, cols: 3,
        items: [
          { kicker: 'Level 1', name: 'Maintenance Detail',
            paras: 'For cars that have already received a full detail and protective coating and need bringing back to standard after a period of use. A thorough wash, dry, window clean, tyre dress and Feynlab Hybrid Detailer application: the standard Miracle Detail wash your car deserves every time.',
            list: ['32-stage luxury wash process', 'Feynlab Pure Wash shampoo', 'Two bucket method throughout', 'Interior vacuum and wipe down', 'Window cleaning inside and out', 'Tyre dressing', 'Feynlab Hybrid Detailer applied', 'Air blow-out of all crevices'],
            facts: [{ k: 'Estimated time', v: '2–3 hours' }],
            price: 'From £175–£200+VAT', links: book },
          { kicker: 'Level 2', name: 'Protection Detail', sub: 'New cars and well-maintained paint',
            paras: 'The ideal starting point for a new car or a car in good condition that needs proper decontamination and long-term protection. Paint is fully decontaminated, a single stage enhancement polish brings out the best in the clear coat, and a Feynlab ceramic coating is applied for lasting protection.',
            list: ['Full luxury wash and decontamination', 'Iron fallout removal', 'Clay bar treatment', 'Tar removal', 'Single stage enhancement polish', 'Paint depth measured on every panel', 'Exterior glass polished and water repellent treatment applied', 'Feynlab ceramic coating applied', 'Tyre dressing', 'Interior wipe down and vacuum'],
            facts: [{ k: 'Estimated time', v: '1–2 days' }, { k: 'Coating durability', v: '2–5 years' }],
            price: 'From £450–£550+VAT', links: book },
          { kicker: 'Level 3', name: 'Correction Detail', sub: 'Swirled, scratched or neglected paint',
            paras: 'For paint carrying visible swirl marks, light scratches, water etching or oxidation. A two-stage correction process (cutting then refining) removes the defects and restores the depth and clarity the paint had when the car left the factory. Protected with a Feynlab ceramic coating on completion.',
            list: ['Full luxury wash and decontamination', 'Iron fallout and tar removal', 'Clay bar treatment', 'Paint depth measured, every panel', 'Gloss and orange peel assessed', 'Digital microscope inspection', 'Two stage paint correction', 'Exterior glass polished and water repellent treatment applied', 'Feynlab ceramic coating applied', 'Wheels cleaned and protected', 'Tyre dressing', 'Interior detailed and steam cleaned'],
            facts: [{ k: 'Estimated time', v: '2–3 days' }, { k: 'Coating durability', v: '3–7 years' }],
            price: 'From £650–£850+VAT', links: book },
          { kicker: 'Level 4', name: 'Ultimate Detail', sub: 'As far as the clear coat will allow',
            paras: 'Three stages of paint correction take the paint as close to perfection as the clear coat allows: every defect addressed, every panel brought to the same standard. The wheels come off. The engine bay is detailed. The interior is deep cleaned and steam cleaned. Feynlab Self-Heal Lite or Feynlab Ultra V3 coating applied for maximum long-term protection.',
            list: ['Full luxury wash and full decontamination', 'Iron fallout, tar and fallout removal', 'Paint depth, gloss and orange peel measured', 'Digital microscope inspection', 'Three stage paint correction', 'Engine bay cleaned and detailed', 'Wheels removed, cleaned inside and out', 'Wheel arches deep cleaned and protected', 'Brake calipers protected with ceramic coating', 'Exterior glass polished and water repellent treatment applied', 'Exhaust tips cleaned and polished', 'Feynlab Self-Heal Lite or Feynlab Ultra V3 coating applied', 'Interior deep cleaned and steam cleaned', 'Carpets and mats cleaned', 'Tyre dressing'],
            facts: [{ k: 'Estimated time', v: '3–5 days' }, { k: 'Coating durability', v: '5–7 years' }],
            price: 'From £1,000+VAT', links: book },
          { kicker: 'Level 5: The Pinnacle', name: 'Paul Dalton Signature Detail', sub: 'Up to 100 hours. Nothing left out.', hi: true, anchor: 'signature',
            paras: 'Everything. Up to six stages of paint correction including orange peel removal. Dry ice cleaning of the engine bay, wheel arches, suspension and underbody. Feynlab Industrial undercoating. PPF on the high-impact zones or the full car. Feynlab Self-Heal Plus 7-year coating. A detail that can take up to 100 hours to complete, and shows it.',
            list: ['Full luxury wash and decontamination', 'Up to 6 stages of paint correction', 'Orange peel removal', 'Paint depth, gloss and orange peel measured', 'Digital microscope inspection throughout', 'Dry ice engine bay cleaning', 'Dry ice underbody and suspension cleaning', 'Feynlab Industrial V2 underbody coating', 'PPF, partial or full car (at additional cost)', 'Feynlab Self-Heal Plus 7-year ceramic coating', 'Wheels removed, ceramic coated inside and out', 'Brake calipers protected', 'Arches cleaned, dressed and protected', 'Exterior glass polished and water repellent treatment applied', 'Exhaust tips polished', 'Interior deep cleaned and steam cleaned at 174°C', 'Carpets and mats deep cleaned', 'Rubber seals protected', 'Tyre dressing', 'Fully bespoke, tailored to the car'],
            facts: [{ k: 'Estimated time', v: '50–100 hours' }, { k: 'Coating durability', v: '7+ years' }],
            price: 'POA', links: book }
        ],
        note: [
          'Not sure which level is right for your car? Just ask Paul. He’ll tell you honestly what the car needs, and if a lower level achieves the result you’re after, that’s what he’ll recommend.',
          'Prices shown are from, and depend on which coating is applied: 3, 5, 6 or 7 year, including the 5 and 7 year self-healing options.'
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'wheels', graphite: true, reverse: true,
        title: 'Wheel ceramic <span class="gold">coating</span>',
        img: frame('cc-wheel', { alt: 'The wheel and caliper of a yellow Ferrari 458 Speciale', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: ['Wheels removed from the car, ceramic coating applied inside and out. Painted calipers included. Available as a standalone service or added to any package.']
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
        h1: 'Detailing Packages',
        line: 'Five levels. <span class="gold">One standard.</span>',
        lede: 'From a maintenance detail between full jobs to the complete Paul Dalton Signature: every package is carried out personally by Paul, to a standard that doesn’t change regardless of which level you choose.',
        img: frame('pk-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'The Ferrari badge on the deep red bonnet of a car in the dark studio',
          art: [{ media: '(max-width: 900px)', id: 'pk-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      snav: [
        { id: 'choose', label: 'Choose your level' },
        { id: 'levels', label: 'The five levels' },
        { id: 'wheels', label: 'Wheel ceramic' },
        { id: 'reviews', label: 'Reviews' }
      ],

      work: [
        { img: frame('pk-dry', { alt: 'Dry ice cleaning the engine bay of a red Ferrari', sizes: '(max-width: 767px) 92vw, 58vw', ratio: '3 / 2' }), wide: true },
        { img: frame('pk-split', { alt: 'Metallic paint half corrected, half swirled, under an inspection light', sizes: '(max-width: 767px) 92vw, 34vw', ratio: '3 / 2' }) }
      ],

      stars, reviews,
      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      bookTitle: 'Every job. <span class="gold">Every car. Paul.</span>',
      bookLede: 'Get in touch to discuss which package is right for your car, and to check availability.',
      formServices: site.picks('Detailing package'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'OfferCatalog',
        name: 'Detailing packages',
        itemListElement: [
          ['Maintenance Detail', 175], ['Protection Detail', 450], ['Correction Detail', 650], ['Ultimate Detail', 1000]
        ].map(([name, p]) => ({ '@type': 'Offer', name, priceCurrency: 'GBP', priceSpecification: { '@type': 'PriceSpecification', minPrice: p, priceCurrency: 'GBP', valueAddedTaxIncluded: false } }))
      }
    ]
  };
};
