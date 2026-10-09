/* ============================================================
   Ceramic coatings (06/10, v0.5 pages only, PPF rules: Paul's text
   word for word, the em dash the only edit; UI labels are new).

   v0.5 /ceramic-coatings/, in its order:
     hero (headline, intro, three figures) · Paul and Feynlab
     · why ceramic matters · Ceramic by Paul Dalton · the full range (6)
     · why Feynlab (4) · wheel ceramic (2) · Veyron + McLaren F1 · book
   07/10: why Feynlab plays each point on a test panel (block 51), the
   wheel coating is one choice between its two versions (block 52).
   v0.5 slip, fixed: under "Ceramic by Paul Dalton" it shows the tint
   page's VLT paragraph, and the tint page shows this one. Each sits on
   its own page here (REQUESTS.md asks Paul to confirm).
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose } = require('../lib/shared.js');
const { bench, choose } = require('../lib/formats-b.js');

const SLUG = 'ceramic-coatings';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Ceramic coatings', href: `/${SLUG}/` }
  ]);
  const workSizes = '(max-width: 767px) 92vw, 46vw';

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'paint', arrive: 'why:ripple',
    title: 'Ceramic Coating in Surrey | Feynlab, by Paul Dalton | Miracle Detail',
    description: 'Feynlab ceramic coatings applied in Lingfield, Surrey, by Paul Dalton, Feynlab’s only global ambassador and co-developer of Ceramic by Paul Dalton. Six coatings, 1 to 10 years.',
    preload: [
      { id: 'cc-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'cc-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      '32-svc-statement',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'why', light: true,
        eyebrow: 'The beginning',
        title: 'Why ceramic coating matters, and why who applies it <span class="gold">matters more.</span>',
        img: frame('cc-bottle', { alt: 'A bottle of Ceramic by Paul Dalton, the Feynlab coating, on a dark studio floor', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: [
          'A ceramic coating is a semi-permanent protective layer bonded to your paintwork. Applied correctly, it provides years of protection against UV damage, chemical contamination, bird lime, water etching and environmental fallout, while delivering a depth of gloss that no wax or sealant can match.',
          'The key word is correctly. A ceramic coating is only as good as the preparation beneath it and the application above it. Applied over contaminated or uncorrected paint, it locks the problems in. Applied by someone who doesn’t understand the chemistry, it underperforms from day one.',
          'Paul has applied Feynlab coatings to everything from daily drivers to Bugatti Veyrons and Koenigseggs. The standard is the same regardless of the car.'
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'paul-dalton', reverse: true, graphite: true,
        eyebrow: 'A product with Paul’s name on it',
        title: 'Ceramic by <span class="gold">Paul Dalton</span>',
        img: frame('cc-paul', { alt: 'Paul Dalton holding a box of Ceramic by Paul Dalton, the coating he developed with Feynlab', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        paras: [
          'Developed in collaboration with Feynlab’s chemists, Ceramic by Paul Dalton is a professional-grade coating designed to bring professional performance to both detailers and enthusiasts. Easy to apply, with strong slickness, water beading and three years of durability.',
          'It’s sold through the Feynlab website and used daily by professional detailers across the world. When applied at Miracle Detail, you’re receiving it from the person who helped build it.'
        ],
        listTitle: 'Ceramic by Paul Dalton · Feynlab · 3 Year Durability',
        list: [
          'Professional-grade formula, accessible to enthusiasts',
          'Strong slickness and water beading from day one',
          '3 years of proven protection',
          'Co-developed by Paul Dalton and Feynlab chemists',
          'Sold worldwide through the Feynlab website',
          'Used daily by professional detailers globally'
        ],
        price: 'From £???'
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'range', light: true, cols: 3, fx: 'rail', acc: true,
        eyebrow: 'The full Feynlab range',
        title: 'Six coatings. <span class="gold">One standard of application.</span>',
        items: [
          { tag: '1–2yr', name: 'Original Ceramic', sub: 'Feynlab Original',
            paras: 'The proven entry point into Feynlab protection. Outstanding hydrophobicity, impressive gloss and significantly better durability than any traditional wax or sealant. A record of over 60,000 vehicle installations worldwide.',
            list: ['Superior to any wax or sealant', 'High gloss and hydrophobicity', 'Proven formula since the early 2000s'] },
          { tag: '3yr', name: 'Ceramic by Paul Dalton', sub: 'Feynlab · Co-developed by Paul Dalton', kicker: 'Paul’s own product', hi: true,
            paras: 'Developed with Feynlab to bring professional performance to everyone. Professional strength, professional quality, with a formula accessible enough for enthusiasts to apply themselves. Three years of protection with outstanding slickness and water behaviour.',
            list: ['Co-developed by Paul Dalton and Feynlab', 'Professional grade, enthusiast friendly', 'Strong slickness from day one', 'Sold worldwide through Feynlab'] },
          { tag: '5yr', name: 'Heal Lite', sub: 'Feynlab Heal Lite',
            paras: 'A professional-grade nano coating with self-healing capabilities. Minor surface scratches disappear with the application of gentle heat. UV resistant, highly hydrophobic and high-gloss, with up to 60% of the healing capability of the flagship coating.',
            list: ['Self-healing under gentle heat', 'UV resistance and deep gloss', 'Single-step ultra-durable formula'],
            price: 'From £2,000 + VAT' },
          { tag: '5yr', name: 'Ultra V2', sub: 'Feynlab Ceramic Ultra V2',
            paras: 'One of the most durable non-healing ceramic coatings available. Extreme gloss, outstanding UV resistance, robust chemical protection and formidable scratch resistance. Built for cars that need maximum durability without self-healing complexity.',
            list: ['Extreme gloss and scratch resistance', 'Chemical and UV protection', 'Flexible, durable formula'] },
          { tag: '7yr', name: 'Self-Heal Plus', sub: 'Feynlab Self-Heal Plus',
            paras: 'Feynlab’s most advanced nano-coating. The thickest coating in the range, combining a revolutionary self-healing mechanism with a highly durable ceramic backbone. Super gloss, extreme slickness and the best healing capability in the range. The thickest coating Feynlab makes.',
            list: ['Most advanced nano-coating available', 'Full self-healing mechanism', 'Extreme slickness and super gloss', 'Thickest coating in the Feynlab range'] },
          { tag: '10yr', name: 'Industrial Coating', sub: 'Feynlab Industrial V2', anchor: 'industrial',
            paras: 'Not for paint: for the parts nobody else protects. Underbody, suspension components, arches, metals and plastics. UV-resistant, chemical-resistant, highly hydrophobic. Reduces cleaning intervals and eliminates the need to repaint. Applied to the underside of trains in Norway. On your car, it means the areas most exposed to damage get the best protection available.',
            list: ['Underbody, arches and suspension', 'Chemical and abrasion resistance', 'Extreme hydrophobicity', 'Reduces repainting and cleaning costs'] }
        ]
      }) } },
      { block: '51-svc-bench', with: { bench: bench({
        id: 'why-feynlab',
        eyebrow: 'Why Feynlab',
        title: 'The coating Paul chose to put <span class="gold">his name on.</span>',
        left: 'Unprotected', right: 'Feynlab',
        items: [
          { n: 'I', name: 'Self-Healing Technology', demo: 'heal', cap: 'Swirls, then gentle heat',
            paras: 'The flagship Feynlab coatings heal minor surface scratches with the application of gentle heat. No other coating brand has refined this technology further.' },
          { n: 'II', name: 'Chemical Resistance', demo: 'chem', cap: 'Acid rain and fallout',
            paras: 'Bird lime, acid rain, industrial fallout, brake dust: Feynlab coatings are formulated to resist chemical attack that degrades unprotected or lesser-coated paint.' },
          { n: 'III', name: 'UV Protection', demo: 'uv', cap: 'Five summers in the sun',
            paras: 'Ultraviolet radiation fades paint over time. Every Feynlab coating in the range includes UV resistance, protecting the colour and clarity of your paintwork for years.' },
          { n: 'IV', name: 'Depth of Gloss', demo: 'gloss', cap: 'One strip light across both halves',
            paras: 'No wax or sealant delivers the depth of gloss a properly applied ceramic coating achieves. Applied over corrected paint, the result is paint that looks better than new.' }
        ]
      }) } },
      { block: '52-svc-choose', with: { choose: choose({
        id: 'wheels', graphite: true,
        eyebrow: 'Additional service',
        title: 'Wheel ceramic <span class="gold">coating.</span>',
        intro: [
          'Wheels take more punishment than any other surface on the car: brake dust, road salt, stone chips and heat. A ceramic coating applied properly means they stay cleaner for longer, are far easier to maintain, and look significantly better.',
          'Paul removes the wheels from the car and applies the coating inside and out, the correct way. Painted calipers are included where the car has them.'
        ],
        img: frame('cc-wheel', { alt: 'The wheel and yellow painted caliper of a Ferrari 458 Speciale', sizes: '(max-width: 1023px) 92vw, 38vw', ratio: '4 / 5' }),
        label: 'Wheel coating options',
        scale: { label: 'Durability', unit: 'Years', max: 5 },
        options: [
          { kicker: '1-Year Protection', name: 'Wheel Ceramic Coating', price: 'From £200 + VAT', to: 1,
            list: ['Wheels removed from the car', 'Ceramic coating applied inside and out', 'Painted calipers included', '1-year durability'] },
          { kicker: '3–5 Year Protection', name: 'Durable Wheel Ceramic Coating', price: 'From £300 + VAT', from: 3, to: 5,
            list: ['Wheels removed from the car', 'Durable ceramic applied inside and out', 'Painted calipers included', '3–5 year durability'] }
        ]
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
        mfit: true,
        h1: 'Ceramic Coatings',
        line: 'Protection applied by the man who <span class="gold">helped create it.</span>',
        lede: 'Paul Dalton is Feynlab’s only global ambassador, and the detailer behind Ceramic by Paul Dalton, a coating developed with Feynlab and sold to professionals worldwide. When your car receives a Feynlab coating at Miracle Detail, it’s applied by the person who knows it better than almost anyone on earth.',
        img: frame('cc-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'A gloved hand laying a ceramic coating onto blue paint with a suede applicator',
          art: [{ media: '(max-width: 900px)', id: 'cc-hero-m', sizes: '100vw' }]
        }),
        facts: [
          { k: 'Global Feynlab ambassador', v: '1', big: true },
          { k: 'Maximum protection', v: '10 yr' },
          { k: 'Coatings in the range', v: '6' }
        ]
      },

      stars, reviews,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'why', label: 'Why it matters' },
        { id: 'paul-dalton', label: 'Ceramic by Paul Dalton' },
        { id: 'range', label: 'The range' },
        { id: 'why-feynlab', label: 'Why Feynlab' },
        { id: 'wheels', label: 'Wheels' },

        { id: 'reviews', label: 'Reviews' }
      ],

      statement: {
        id: 'overview',
        text: 'Paul doesn’t just apply Feynlab coatings. <span class="gold">He collaborated with Feynlab to create one.</span> Ceramic by Paul Dalton is a professional-grade coating developed alongside Feynlab’s chemists, sold through the Feynlab website and used daily by detailers around the world.'
      },

      work: [
        { img: frame('cc-veyron', { alt: 'A black Bugatti Veyron outside the studio after its Feynlab ceramic coating', sizes: workSizes, ratio: '3 / 2' }), cap: 'Bugatti Veyron, Feynlab ceramic coating', wide: true },
        /* 08/10: the McLaren F1 is the hero again, so its photo leaves the
           grid; more of Paul's cars instead (Fender: "cho thêm vài chiếc") */
        { img: frame('cc-w-348', { alt: 'A red Ferrari 348 on the studio lift under the Feynlab banner', sizes: '(max-width: 767px) 92vw, 40vw', ratio: '4 / 3' }), cap: 'Ferrari 348' },
        { img: frame('cc-w-m3', { alt: 'A red BMW M3 Touring on the studio lift under the Feynlab banner', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'BMW M3 Touring', third: true },
        { img: frame('cc-w-laf', { alt: 'The front of a red Ferrari LaFerrari in the studio', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari LaFerrari', third: true },
        { img: frame('cc-w-f50', { alt: 'A red Ferrari F50 outside the Miracle Detail studio', sizes: '(max-width: 767px) 46vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari F50', third: true },
        { img: frame('cc-w-sto', { alt: 'A green Lamborghini Huracán STO under a summer sky', sizes: '(max-width: 767px) 46vw, 46vw', ratio: '4 / 3' }), cap: 'Lamborghini Huracán STO', half: true },
        { img: frame('cc-w-599', { alt: 'A white Ferrari 599 GTB in the studio, a Bugatti Veyron behind it', sizes: '(max-width: 767px) 46vw, 46vw', ratio: '4 / 3' }), cap: 'Ferrari 599 GTB', half: true }
      ],

      bookTitle: 'Protect your paint with the <span class="gold">person who knows it best.</span>',
      bookLede: 'Every coating consultation starts with an honest conversation about your car, how you use it, and which product is genuinely right for it.',
      formServices: site.picks('Ceramic coating'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Ceramic coating', serviceType: 'Ceramic coating',
        description: 'Feynlab ceramic coatings applied by Paul Dalton, Feynlab’s only global ambassador: from Original Ceramic to Self-Heal Plus and Industrial V2.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
