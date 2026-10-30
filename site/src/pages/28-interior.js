/* ============================================================
   Interior cleaning & protection (27/10). Built on Paul's own page
   (miracledetail-interior-cleaning-protection-updated.html, Fender
   27/10: "build page này thế vào ô detailing package ở ngoài"). His
   words whole and in his order, only the long dashes changed; the
   homepage card that was Detailing Packages links here now (site.js).
   Slug from Paul's own link (/interior-detailing). No price on his
   page, so no price band: the FAQ says to ask for a quotation.
   Photos: Paul's Drive "interior pics x2", a brush working foam into
   an MS-RT seat (back for the hero, base and bolster for the approach);
   27/10 (Fender: too few photos) interiors from his own gallery jobs on
   every card, step, the quote and the note.

   hero · quote · a considered approach · services (6) · long-term
   care · tailored protection · process (4) · FAQ · reviews · book
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose, quote, steps } = require('../lib/shared.js');
const { note } = require('../lib/formats.js');

const SLUG = 'interior-detailing';

const FAQS = [
  { q: 'Can you remove every stain?', a: 'No responsible specialist can guarantee that. Results depend on the stain, material, age and any previous attempts to remove it. We will explain what is realistically achievable.' },
  { q: 'Can you clean classic car interiors?', a: 'Yes. Older leather, fabrics and original finishes are assessed carefully. Preservation may be more appropriate than aggressive cleaning.' },
  { q: 'Does interior protection prevent all damage?', a: 'No. It can make cleaning and maintenance easier, but it cannot prevent physical wear, cuts, permanent dye transfer or every type of staining.' },
  { q: 'How much does an interior detail cost?', a: 'Pricing depends on the vehicle, materials, condition and scope of work. Contact us with your vehicle details and photographs for an informed quotation.' }
];

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Interior Cleaning & Protection', href: `/${SLUG}/` }
  ]);
  const cardImg = (id, alt) => frame(id, { alt, sizes: '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 30vw', ratio: '4 / 3' });
  const stepPic = (id, alt) => ({
    pic: frame(id, { alt: '', sizes: '(max-width: 1023px) 1px, 34vw', ratio: false }),
    img: frame(id, { alt, sizes: '(max-width: 1023px) 84vw, 1px', ratio: false })
  });

  return {
    slug: SLUG,
    cluster: 'restore',
    title: 'Interior Car Detailing, Leather Cleaning & Protection | Miracle Detail Surrey',
    description: 'Premium interior car detailing in Lingfield, Surrey by Paul Dalton. Specialist leather cleaning, upholstery deep cleaning, and interior surface protection. Enquire today.',
    preload: [
      { id: 'in-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'in-hero', media: '(min-width: 901px)', sizes: '66vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '38-svc-quote', with: { quote: quote({
        id: 'quote', side: true,
        img: frame('in-quote', { alt: '', sizes: '(max-width: 899px) 100vw, 60vw', ratio: false }),
        text: '<span class="it">“True detailing is not simply about how a car looks. <span class="gold">It is about how it feels to step inside.</span>”</span>'
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'approach', light: true,
        eyebrow: 'A Considered Approach',
        title: 'The detail is in <span class="gold">every surface.</span>',
        img: frame('in-bolster', { alt: 'A detailing brush working foam along the leather bolster of a sports seat, blue stitching across the seat base', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        paras: [
          'At Miracle Detail, interior detailing is approached with the same patience and attention as our exterior work. No two cabins are alike. Materials, age, previous treatments and condition all influence how we clean and protect them.',
          'Whether your vehicle is a modern daily driver, a cherished classic or an exceptional collector car, we begin with an assessment and select methods appropriate to its individual surfaces.',
          'Our aim is a beautifully clean, natural-looking interior: not an artificially shiny finish or a heavy fragrance masking the problem.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'services', cols: 3,
        eyebrow: 'Interior Detailing Services',
        title: 'Cleaned with care. <span class="gold">Finished with precision.</span>',
        intro: ['Every service is tailored to the vehicle. Depending on its condition and materials, your interior detail may include the following.'],
        items: [
          { n: '01', tag: 'Leather', name: 'Leather Cleaning &amp; Care', img: cardImg('in-c-leather', 'Hands brushing cleaner into the black leather seat of a Porsche 911'), paras: 'Careful removal of accumulated grime, body oils and residues from seats, bolsters, armrests and leather trim, using material-appropriate methods to preserve the original finish.' },
          { n: '02', tag: 'Fabrics', name: 'Fabric &amp; Carpet Cleaning', img: cardImg('in-c-fabric', 'The cabin of a Nissan GT-R: suede seats, carpets and floor mats'), paras: 'Detailed vacuuming, targeted stain treatment and controlled deep cleaning of carpets, mats and upholstery where suitable. We work to lift contamination without unnecessary saturation.' },
          { n: '03', tag: 'Fine detail', name: 'Dashboards &amp; Intricate Trim', img: cardImg('in-c-dash', 'The dashboard, vents, gloss trim and console of a Mercedes C63 AMG'), paras: 'Vents, switches, controls, consoles, seams, crevices and hard-to-reach areas receive meticulous attention, with finishes chosen to suit the original material.' },
          { n: '04', tag: 'Finishes', name: 'Delicate &amp; Specialist Materials', img: cardImg('in-c-special', 'The Alcantara steering wheel and piano black trim of a Mercedes C63 AMG'), paras: 'Alcantara, suede-effect finishes, piano black, carbon fibre, wood and sensitive heritage materials require individual assessment and appropriate specialist care.' },
          { n: '05', tag: 'Glass', name: 'Interior Glass &amp; Presentation', img: cardImg('in-c-glass', 'The rear-view mirror of a Bugatti Veyron, its built-in display lit'), paras: 'Interior glass, mirrors, screens and visible finishing details are carefully cleaned for a crisp, refined result, with consideration for coated and sensitive displays.' },
          { n: '06', tag: 'Protection', name: 'Interior Surface Protection', img: cardImg('in-c-protect', 'A pale grey Porsche 911 Turbo seat with black piping, clean and protected'), paras: 'Suitable leather, fabric and trim surfaces can receive specialist protection designed to make routine care easier and help reduce the impact of everyday soiling.' }
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'protection', light: true,
        eyebrow: 'Long-Term Care',
        title: 'Protection that works <span class="gold">beyond collection day.</span>',
        img: frame('in-612', { alt: 'The tan leather cabin of a Ferrari 612 Scaglietti, seen from the open door', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: [
          'A freshly detailed cabin is only the beginning. Appropriate interior protection can help reduce staining, make dirt easier to remove and simplify future maintenance.',
          'We assess each surface before recommending a product. Leather, fabric, carpets and interior trim have different requirements; a universal coating is not the answer.',
          'Protection does not make an interior impervious to damage, wear, dye transfer or neglect. Good maintenance remains essential.'
        ]
      }) } },
      { block: '50-svc-note', with: { note: note({
        id: 'tailored',
        eyebrow: 'Tailored Protection',
        title: 'The right care for <span class="gold">every surface.</span>',
        img: frame('in-note', { sizes: '100vw', ratio: false }),
        paras: [
          'Different materials demand different approaches. We select appropriate treatments for leather, textiles and interior trim based on their condition, finish and intended use.',
          'Our focus is on maintaining a natural appearance and feel while making day-to-day cleaning more manageable.',
          'Every recommendation is made following an assessment of your vehicle, rather than a one-product-fits-all approach.'
        ],
        cta: { href: '#book', label: 'Enquire About Protection' }
      }) } },
      { block: '23-svc-steps', with: steps({
        id: 'process', light: true,
        stage: { pics: true },
        eyebrow: 'Our Process',
        title: 'No shortcuts. <span class="gold">No one-size-fits-all packages.</span>',
        intro: 'The right result starts with understanding what your interior actually needs.',
        steps: [
          { name: 'Inspection', ...stepPic('in-s1', 'Fine scratches across the tan leather of a BMW M5 seat'), text: 'We assess the cabin, its materials, existing wear, stains and previous treatments, identifying any areas that need specialist attention.' },
          { name: 'Careful Cleaning', ...stepPic('in-s2', 'Hands working cleaner into a leather seat with a brush'), text: 'We work methodically across the interior, selecting suitable cleaning techniques and paying particular attention to high-contact and overlooked areas.' },
          { name: 'Surface Protection', ...stepPic('in-s3', 'The yellow quilted leather cabin of a Lamborghini Murciélago'), text: 'Where requested and suitable, we apply material-specific protection to help keep the interior easier to maintain.' },
          { name: 'Final Inspection', ...stepPic('in-s4', 'The finished grey leather cabin of a Porsche Boxster S'), text: 'We review the finished cabin and explain sensible aftercare so the results can be enjoyed for longer.' }
        ]
      }) },
      '28-svc-faq',
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      /* Paul's hero is a heading and one paragraph: its first sentence is
         the display line, the rest the lede */
      hero: {
        stats: true, shift: true, dpos: '50% 40%',
        h1: 'Interior Cleaning & Protection',
        line: 'Exceptional interiors deserve <span class="gold">more than a quick clean.</span>',
        lede: 'From delicate leather and fine upholstery to the smallest, often-overlooked details, we restore cleanliness, refine presentation and protect the surfaces you experience every time you drive.',
        img: frame('in-hero', {
          priority: true, ratio: false, sizes: '(max-width: 900px) 100vw, 66vw',
          alt: 'A detailing brush working foam into the leather of a black sports seat, blue stitching on the seat below',
          art: [{ media: '(max-width: 900px)', id: 'in-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      faqEyebrow: 'Frequently Asked Questions',
      faqTitle: 'Good questions. <span class="gold">Clear answers.</span>',
      faqs: FAQS.map((f, i) => ({ q: f.q, a: f.a, tbc: null, _first: i === 0 })),

      stars, reviews,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      snav: [
        { id: 'approach', label: 'Our approach' },
        { id: 'services', label: 'Services' },
        { id: 'protection', label: 'Protection' },
        { id: 'process', label: 'Process' },
        { id: 'faq', label: 'FAQ' },
        { id: 'reviews', label: 'Reviews' }
      ],

      bookTitle: 'Rediscover the pleasure of <span class="gold it">a beautiful interior.</span>',
      bookLedeIt: true,
      bookLede: 'From careful interior deep cleaning to specialist leather care and long-term surface protection, every vehicle receives an individually considered approach.',
      formServices: site.picks('Interior Cleaning & Protection'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Interior Cleaning & Protection', serviceType: 'Interior car detailing',
        description: 'Interior car detailing: leather cleaning and care, fabric and carpet cleaning, dashboards and trim, specialist materials, interior glass and interior surface protection.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      },
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }
    ]
  };
};
