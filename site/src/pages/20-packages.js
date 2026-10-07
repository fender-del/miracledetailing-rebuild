/* ============================================================
   Detailing packages (06/10, v0.5 pages only, PPF rules).
   Old-site slug /car-detailing-studio/ kept (PLAN.md §5.1).

   Rebuilt 07/10 (Fender: audit it, make it more appealing, from the
   feedback so far). The five levels were five long white cards stacked
   on one another: hard to tell apart, nothing to compare. Now:
     hero (figures row) · the ladder (53: Paul's intro, the five levels
     beside a held panel of photo, steps, time, coating, polishing
     stages and price; the lines new at each level are the strong ones)
     · "Just ask Paul" (50, the page's one lit line, Paul at work behind)
     · wheel ceramic coating (54, one band) · reviews · book
   Paul's words unchanged; the em dashes replaced. v0.5's order kept
   (levels, the two notes, wheel coating, reviews, book); the price
   note moved under the prices it qualifies. "Paint Correction Levels"
   (v0.5's last link) sits with it. The figures in the panel are his:
   time and coating from each level, stages from each list.

   v0.5 slips: Level 1's descriptor repeats its name (left out); the
   wheel ceramic box carries "Level 5 — The Pinnacle" and "Estimated
   time 50–100 hours" twice (copied from Level 5; left out). Both in
   REQUESTS.md. "From / From £1,000" reads "From £1,000".
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs } = require('../lib/shared.js');
const { note } = require('../lib/formats.js');
const { ladder, addon } = require('../lib/packages.js');

const SLUG = 'car-detailing-studio';

/* time on a log scale, 1 hour → 100 hours (a working day read as about
   8 hours: only where the bar sits, the words are Paul's) */
const T = h => Math.log10(h) / 2;
const pic = (id, alt) => frame(id, { alt, sizes: '(max-width: 1023px) 92vw, 40vw', ratio: '16 / 10' });

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Detailing packages', href: `/${SLUG}/` }
  ]);

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'story',
    title: 'Car Detailing Packages | Five Levels | Miracle Detail, Surrey',
    description: 'Five detailing packages by Paul Dalton in Lingfield, Surrey: Maintenance, Protection, Correction, Ultimate and the Paul Dalton Signature Detail. From £175 + VAT.',
    preload: [
      { id: 'pk-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'pk-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '53-pk-ladder', with: { ladder: ladder({
        id: 'levels', light: true,
        eyebrow: 'The beginning',
        title: 'Choose your level. <span class="gold">Paul does the rest.</span>',
        intro: [
          'The right package depends on your car, its condition and what you want to achieve. Paul will always advise honestly on which level he recommends for your car, and if a lower level will achieve the result you’re after, that’s what he’ll tell you.',
          'Every package includes Paul’s full attention, from first wash to final inspection. No apprentices, no assistants, no shortcuts, regardless of which level you book.'
        ],
        book: { label: 'Book Now', href: '#book' },
        gauges: {
          time: { label: 'Estimated time', ticks: [{ label: 'Hours', at: 0 }, { label: 'Days', at: .52 }, { label: '100 hours', at: 1 }] },
          life: { label: 'Coating durability', unit: 'years', max: 7 },
          stages: { label: 'Polishing stages', max: 6 }
        },
        levels: [
          { kicker: 'Level 1', name: 'Maintenance Detail',
            img: pic('pk-l1', 'Water running off the gloss red paint and tail light of a Ferrari'),
            paras: 'For cars that have already received a full detail and protective coating and need bringing back to standard after a period of use. A thorough wash, dry, window clean, tyre dress and Feynlab Hybrid Detailer application: the standard Miracle Detail wash your car deserves every time.',
            list: ['32-stage luxury wash process', 'Feynlab Pure Wash shampoo', 'Two bucket method throughout', 'Interior vacuum and wipe down', 'Window cleaning inside and out', 'Tyre dressing', 'Feynlab Hybrid Detailer applied', 'Air blow-out of all crevices'],
            time: { text: '2–3 hours', from: T(2), to: T(3) },
            price: 'From £175–£200+VAT' },
          { kicker: 'Level 2', name: 'Protection Detail', sub: 'New cars and well-maintained paint',
            img: pic('pk-l2', 'A gloved hand applying a ceramic coating beside the badge on a red Ferrari'),
            paras: 'The ideal starting point for a new car or a car in good condition that needs proper decontamination and long-term protection. Paint is fully decontaminated, a single stage enhancement polish brings out the best in the clear coat, and a Feynlab ceramic coating is applied for lasting protection.',
            list: ['+Full luxury wash and decontamination', '+Iron fallout removal', '+Clay bar treatment', '+Tar removal', '+Single stage enhancement polish', '+Paint depth measured on every panel', '+Exterior glass polished and water repellent treatment applied', '+Feynlab ceramic coating applied', 'Tyre dressing', 'Interior wipe down and vacuum'],
            time: { text: '1–2 days', from: T(8), to: T(16) },
            life: { text: '2–5 years', from: 2, to: 5 },
            stages: { text: 'Single stage', n: 1 },
            price: 'From £450–£550+VAT' },
          { kicker: 'Level 3', name: 'Correction Detail', sub: 'Swirled, scratched or neglected paint',
            img: pic('pk-l3', 'Metallic paint half corrected, half swirled, under an inspection light'),
            paras: 'For paint carrying visible swirl marks, light scratches, water etching or oxidation. A two-stage correction process (cutting then refining) removes the defects and restores the depth and clarity the paint had when the car left the factory. Protected with a Feynlab ceramic coating on completion.',
            list: ['Full luxury wash and decontamination', 'Iron fallout and tar removal', 'Clay bar treatment', 'Paint depth measured, every panel', '+Gloss and orange peel assessed', '+Digital microscope inspection', '+Two stage paint correction', 'Exterior glass polished and water repellent treatment applied', 'Feynlab ceramic coating applied', '+Wheels cleaned and protected', 'Tyre dressing', '+Interior detailed and steam cleaned'],
            time: { text: '2–3 days', from: T(16), to: T(24) },
            life: { text: '3–7 years', from: 3, to: 7 },
            stages: { text: 'Two stage', n: 2 },
            price: 'From £650–£850+VAT' },
          { kicker: 'Level 4', name: 'Ultimate Detail', sub: 'As far as the clear coat will allow',
            img: pic('pk-l4', 'Hands working a dual action polisher over red paint'),
            paras: 'Three stages of paint correction take the paint as close to perfection as the clear coat allows: every defect addressed, every panel brought to the same standard. The wheels come off. The engine bay is detailed. The interior is deep cleaned and steam cleaned. Feynlab Self-Heal Lite or Feynlab Ultra V3 coating applied for maximum long-term protection.',
            list: ['Full luxury wash and full decontamination', 'Iron fallout, tar and fallout removal', 'Paint depth, gloss and orange peel measured', 'Digital microscope inspection', '+Three stage paint correction', '+Engine bay cleaned and detailed', '+Wheels removed, cleaned inside and out', '+Wheel arches deep cleaned and protected', '+Brake calipers protected with ceramic coating', 'Exterior glass polished and water repellent treatment applied', '+Exhaust tips cleaned and polished', '+Feynlab Self-Heal Lite or Feynlab Ultra V3 coating applied', '+Interior deep cleaned and steam cleaned', '+Carpets and mats cleaned', 'Tyre dressing'],
            time: { text: '3–5 days', from: T(24), to: T(40) },
            life: { text: '5–7 years', from: 5, to: 7 },
            stages: { text: 'Three stage', n: 3 },
            price: 'From £1,000+VAT' },
          { kicker: 'Level 5: The Pinnacle', name: 'Paul Dalton Signature Detail', sub: 'Up to 100 hours. Nothing left out.', hi: true, anchor: 'signature',
            img: pic('pk-l5', 'Dry ice cleaning the engine bay of a red Ferrari in the studio'),
            paras: 'Everything. Up to six stages of paint correction including orange peel removal. Dry ice cleaning of the engine bay, wheel arches, suspension and underbody. Feynlab Industrial undercoating. PPF on the high-impact zones or the full car. Feynlab Self-Heal Plus 7-year coating. A detail that can take up to 100 hours to complete, and shows it.',
            list: ['Full luxury wash and decontamination', '+Up to 6 stages of paint correction', '+Orange peel removal', 'Paint depth, gloss and orange peel measured', 'Digital microscope inspection throughout', '+Dry ice engine bay cleaning', '+Dry ice underbody and suspension cleaning', '+Feynlab Industrial V2 underbody coating', '+PPF, partial or full car (at additional cost)', '+Feynlab Self-Heal Plus 7-year ceramic coating', '+Wheels removed, ceramic coated inside and out', 'Brake calipers protected', 'Arches cleaned, dressed and protected', 'Exterior glass polished and water repellent treatment applied', 'Exhaust tips polished', 'Interior deep cleaned and steam cleaned at 174°C', 'Carpets and mats deep cleaned', '+Rubber seals protected', 'Tyre dressing', '+Fully bespoke, tailored to the car'],
            time: { text: '50–100 hours', from: T(50), to: T(100) },
            life: { text: '7+ years', from: 7, to: null },
            stages: { text: 'Up to 6', n: 6 },
            price: 'POA' }
        ],
        note: 'Prices shown are from, and depend on which coating is applied: 3, 5, 6 or 7 year, including the 5 and 7 year self-healing options.',
        link: { label: 'Paint Correction Levels', href: '/paint-correction-and-polishing/' }
      }) } },
      { block: '50-svc-note', with: { note: note({
        id: 'ask',
        img: frame('pk-note', { alt: '', sizes: '100vw', ratio: false }),
        lead: 'Not sure which level is right for your car? Just ask Paul.',
        paras: 'He’ll tell you honestly what the car needs, and if a lower level achieves the result you’re after, that’s what he’ll recommend.',
        cta: { href: site.phoneHref, label: 'Call Paul' }
      }) } },
      { block: '54-pk-addon', with: { addon: addon({
        id: 'wheels', light: true,
        title: 'Wheel ceramic <span class="gold">coating</span>',
        img: frame('pk-wheel', { alt: 'The front wheel, yellow caliper and headlight of a Ferrari 458 Speciale', sizes: '(max-width: 1023px) 92vw, 52vw', ratio: '16 / 10' }),
        paras: 'Wheels removed from the car, ceramic coating applied inside and out. Painted calipers included. Available as a standalone service or added to any package.',
        links: [{ label: 'Book Now', href: '#book' }]
      }) } },
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
        /* the gold figures row under the buttons (PPF's hero, Fender 06/10) */
        facts: [
          { k: 'Levels', v: '5', big: true },
          { k: 'Hours, Level 5', v: '100' },
          { k: 'From, + VAT', v: '£175' }
        ]
      },

      snav: [
        { id: 'levels', label: 'The five levels' },
        { id: 'ask', label: 'Ask Paul' },
        { id: 'wheels', label: 'Wheel ceramic' },
        { id: 'reviews', label: 'Reviews' }
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
