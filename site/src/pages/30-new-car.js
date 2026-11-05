/* ============================================================
   New car detail & protection (05/11). Built on Paul's own text (his
   mail of 04/11, "new car protection page text", forwarded by Fender
   05/11) with his notes of 05/11: the SEO title, meta description and
   slug as he gave them, and the 3- and 5-year coatings shown with
   "Enquire for a Bespoke Quotation" instead of a price. His words whole
   and in his order, headings in Title Case, only the long dashes changed.
   Photos: his new matte blue Ioniq 5 N centre stage at the top ("my new
   car being centre stage at the top"); the matte grey Cupra in the new
   PPF bay (attached to his mail) beside the matte & satin section; the
   other sections take Drive photos no other page uses (Brian 05/11):
   the foam wash, black paint under the hex lights, film going on, a
   white R8 for the finished car, the studio, a blue F12 behind the close.

   hero · intro · 30 years · preparation · refinement (2) · ceramic (2)
   · PPF (3) · matte & satin · matte options (2) · complete package
   · why Miracle Detail · day one · reviews · book
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards, prose } = require('../lib/shared.js');
const { note } = require('../lib/formats.js');

const SLUG = 'new-car-detail-protection';
const NAME = 'New Car Detail & Protection';
const QUOTE = [{ href: '#book', label: 'Enquire for a Bespoke Quotation' }];

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: NAME, href: `/${SLUG}/` }
  ]);
  const cardImg = (id, alt, two) => frame(id, { alt, sizes: two ? '(max-width: 767px) 86vw, 45vw' : '(max-width: 767px) 86vw, (max-width: 1023px) 45vw, 30vw', ratio: '4 / 3' });

  return {
    slug: SLUG,
    cluster: 'paint',
    title: 'New Car Detailing, Ceramic Coatings & PPF | Miracle Detail Surrey',
    description: 'Protect your new car with specialist detailing, paint correction, 3 or 5-year ceramic coatings and premium PPF at Miracle Detail in Lingfield, Surrey.',
    preload: [
      { id: 'nc-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'nc-hero', media: '(min-width: 901px)', sizes: '66vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'new-car', light: true,
        title: 'Your new car deserves <span class="gold">more than a showroom finish</span>',
        img: frame('nc-intro', { alt: 'A grey Porsche 911 on the lift in the Miracle Detail studio', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        paras: [
          'Taking delivery of a new vehicle should be an exciting experience. However, even brand-new cars can arrive with paintwork imperfections, including fine scratches, swirl marks, light marring and defects introduced during manufacturing, transportation or dealership preparation.',
          'At Miracle Detail, we believe exceptional new car protection begins with meticulous preparation, followed by the appropriate level of paintwork refinement and long-term protection.',
          'From professional ceramic coatings to precision-installed Paint Protection Film (PPF), our bespoke treatments are designed to enhance, preserve and protect your vehicle from the very beginning.'
        ]
      }) } },
      '32-svc-statement',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'preparation',
        eyebrow: 'The Preparation',
        title: 'Exceptional results begin with <span class="gold">meticulous preparation.</span>',
        img: frame('nc-prep', { alt: 'A white Ferrari Portofino under a layer of snow foam on a block-paved drive', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        paras: [
          'Every new car detail begins with a comprehensive, carefully controlled wash and decontamination process.',
          'Using specialist products and proven techniques, we safely remove surface contamination, including bonded deposits, industrial fallout and transportation residue.',
          'This essential stage ensures the paintwork is thoroughly cleaned and correctly prepared before any refinement or protective treatments are undertaken.',
          'Following preparation, the vehicle is carefully inspected under specialist lighting to assess the condition of the paintwork and determine the most appropriate treatment.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'refinement', light: true, cols: 2,
        eyebrow: 'Paintwork Refinement',
        title: 'Because new doesn’t always <span class="gold">mean perfect.</span>',
        intro: [
          'Even the most prestigious new vehicles can arrive with paintwork imperfections.',
          'Our professional paint correction treatments are designed to address these defects, enhancing gloss, depth and clarity while preserving the integrity of the original finish.'
        ],
        fig: frame('nc-refine', { alt: 'The hexagon studio lights reflected sharp and unbroken in the black paint of a BMW', sizes: '(max-width: 1023px) 92vw, 44vw', ratio: false }),
        items: [
          { n: '01', name: 'Single-Stage Paintwork Correction', img: cardImg('nc-c-single', 'A blue BMW M2 in the studio, its paint reflecting the lights', true), sub: 'Ideal for new vehicles displaying minor imperfections, light swirl marks and fine surface marring.',
            paras: 'Using carefully selected polishing compounds and techniques, this treatment refines the paintwork, enhancing gloss and clarity while addressing lighter defects.' },
          { n: '02', name: 'Two-Stage Paintwork Correction', img: cardImg('nc-c-two', 'A red BMW M3 Touring in the studio under the hexagon lights', true), sub: 'For vehicles requiring a more comprehensive level of paintwork refinement.',
            paras: 'Our two-stage correction process incorporates an initial correction stage to address more noticeable imperfections, followed by a finer finishing stage to maximise gloss, clarity and depth.' }
        ],
        note: [
          'Every vehicle is individually assessed to ensure the appropriate level of correction is carried out without unnecessary removal of clear coat.',
          'Our philosophy is simple: achieve the finest possible finish while preserving as much original paintwork as possible.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'ceramic', cols: 2,
        eyebrow: 'Ceramic Coating Protection',
        title: 'Exceptional gloss. <span class="gold">Long-lasting protection.</span>',
        intro: ['Once the paintwork has been meticulously prepared and refined, we offer a choice of professional ceramic coating systems designed to protect and preserve its appearance.'],
        fig: frame('nc-ceramic', { alt: 'A black Range Rover in the studio, the hexagon lights mirrored in its bonnet and windscreen', sizes: '(max-width: 1023px) 92vw, 44vw', ratio: '4 / 3' }),
        items: [
          { n: '01', name: '3-Year Ceramic Coating', img: cardImg('nc-c-3yr', 'A red Tesla Roadster in the studio, its paint mirroring the lights', true),
            paras: [
              'An advanced ceramic protection treatment offering outstanding gloss enhancement, excellent hydrophobic properties and resistance to environmental contamination.',
              'Designed to make routine washing and maintenance considerably easier while helping preserve the vehicle’s finish.'
            ], links: QUOTE },
          { n: '02', name: '5-Year Ceramic Coating', img: cardImg('nc-c-5yr', 'A blue Lotus Emira in the studio', true),
            paras: [
              'Our longer-term ceramic protection option, delivering exceptional gloss, water repellency and durable resistance to environmental contamination.',
              'Ideal for owners seeking extended protection and easier ongoing maintenance.'
            ], links: QUOTE }
        ],
        note: [
          'Both treatments are professionally applied following thorough surface preparation to ensure optimal bonding and performance.',
          'Coating durability depends on vehicle usage, environmental exposure and appropriate ongoing maintenance.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'ppf', light: true, cols: 3,
        eyebrow: 'Paint Protection Film (PPF)',
        title: 'Invisible protection. <span class="gold">Exceptional peace of mind.</span>',
        intro: [
          'For owners seeking physical protection against stone chips, road debris and everyday driving damage, Miracle Detail offers professionally installed Paint Protection Film.',
          'Our premium PPF solutions provide a protective barrier over vulnerable painted surfaces while maintaining the vehicle’s original appearance.',
          'PPF can be installed as a standalone treatment or combined with paintwork refinement and ceramic coating protection.'
        ],
        fig: frame('nc-ppf', { alt: 'Hands working clear paint protection film around the headlight of a black car', sizes: '(max-width: 1023px) 92vw, 44vw', ratio: false }),
        items: [
          { n: '01', name: 'Full Front End PPF', img: cardImg('nc-c-front', 'A white Lotus Exige in the studio, seen from the front'), sub: 'Essential protection where it matters most.',
            paras: ['Designed to protect the areas most vulnerable to stone chips and road debris during everyday driving.', 'Typical coverage includes:'],
            list: ['Front bumper', 'Full bonnet', 'Front wings', 'Exterior mirror housings'],
            after: 'An excellent choice for owners seeking discreet, effective protection for the most exposed areas of their new vehicle.' },
          { n: '02', name: 'Track Pack PPF', img: cardImg('nc-c-track', 'The front of a lime green Lamborghini Huracán STO'), sub: 'Enhanced protection for the driving enthusiast.',
            paras: ['Our Track Pack extends protection beyond the front end to additional areas exposed to road debris and abrasion.', 'Coverage includes:'],
            list: ['Full front end', 'A-pillars', 'Side sills'],
            after: 'Particularly suited to performance vehicles, enthusiastic drivers and owners who want additional protection in vulnerable areas.' },
          { n: '03', name: 'Full Vehicle PPF', img: cardImg('nc-c-full', 'A silver Bugatti Centodieci'), sub: 'The ultimate expression of vehicle protection.',
            paras: [
              'For those seeking the highest level of exterior paintwork protection, our Full Vehicle PPF package offers comprehensive coverage of the vehicle’s painted body panels.',
              'Designed to protect against stone chips, light abrasions and everyday wear, while helping preserve the condition of the original paintwork.',
              'Available in gloss, matte and satin finishes, subject to vehicle requirements and film compatibility.',
              'Full vehicle coverage is particularly beneficial for prestige, performance and specialist-finish vehicles where preserving the original paintwork is a priority.',
              'Exact coverage is confirmed following a vehicle-specific consultation.'
            ] }
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'matte',
        eyebrow: 'Matte & Satin Paint Protection',
        title: 'Preserve the finish. <span class="gold">Protect the investment.</span>',
        img: frame('nc-matte', { alt: 'A matte grey Cupra in the Miracle Detail PPF bay, under the hexagon lights', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '1 / 1' }),
        paras: [
          'Matte and satin paint finishes offer a distinctive, understated appearance increasingly found on luxury, performance and prestige vehicles.',
          'However, these specialist finishes require a very different approach to conventional gloss paintwork.',
          'Unlike traditional gloss finishes, matte and satin paintwork cannot be conventionally machine polished to remove scratches or imperfections without potentially altering its original appearance and sheen.',
          'Even relatively minor damage can be exceptionally expensive to rectify, potentially requiring specialist refinishing or repainting of entire panels to achieve a consistent finish.',
          'For this reason, protecting factory matte and satin paintwork from the outset is especially important.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'matte-options', cols: 2,
        items: [
          { n: '01', name: 'Specialist Matte &amp; Satin PPF', sub: 'Protecting the finish without changing its character.',
            paras: [
              'Our specialist matte and satin Paint Protection Film solutions are designed to preserve the distinctive appearance of these finishes while providing a physical barrier against stone chips, light abrasions and everyday driving damage.',
              'From front-end protection to complete vehicle coverage, every installation is carefully tailored to the vehicle.',
              'For maximum protection, we recommend full vehicle PPF coverage, particularly on factory matte finishes where conventional paint correction is not an option.'
            ] },
          { n: '02', name: 'Matte &amp; Satin Ceramic Coatings',
            paras: ['For vehicles not receiving complete PPF coverage, we offer specialist ceramic coatings compatible with matte and satin finishes.', 'These treatments enhance water repellency, help reduce contamination build-up and make routine maintenance easier, while preserving the intended appearance of the original finish.'] }
        ],
        note: [
          'All preparation and protection methods are selected specifically for the paint type, avoiding conventional polishing techniques that could permanently alter its appearance.',
          'With specialist matte paintwork, prevention is considerably more cost-effective than correction.'
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'package', light: true,
        eyebrow: 'The Complete New Car Protection Package',
        title: 'Refinement and protection, <span class="gold">without compromise.</span>',
        img: frame('nc-package', { alt: 'A white Audi R8 Spyder in the Miracle Detail studio', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 3' }),
        paras: [
          'For owners seeking a comprehensive approach, we can combine our specialist treatments into one bespoke new car protection package.',
          'Following thorough preparation and paintwork assessment, the appropriate level of refinement can be undertaken before installing Paint Protection Film to the selected areas.',
          'Professional ceramic coatings can then be applied to compatible exposed painted surfaces and, where appropriate, over the installed PPF.',
          'This combination offers the physical protection of PPF alongside the hydrophobic properties, gloss enhancement where applicable, and easier maintenance associated with ceramic coatings.',
          'Whether you choose front-end protection, our enhanced Track Pack or full vehicle coverage, every treatment is tailored to your vehicle, driving habits and expectations.'
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'why', graphite: true,
        eyebrow: 'Why Choose Miracle Detail?',
        title: 'Experience. Precision. <span class="gold">An uncompromising approach.</span>',
        img: frame('nc-studio', { alt: 'Cars lined up under the hexagon lights of the Miracle Detail studio, a white Porsche in front', sizes: '(max-width: 900px) 92vw, 40vw', ratio: '4 / 5' }),
        paras: [
          'With more than three decades of professional detailing experience and over 20 years working with Paint Protection Film, Paul Dalton has established a reputation for exceptional attention to detail and an uncompromising approach to vehicle preparation.',
          'From everyday luxury vehicles to some of the world’s most exclusive supercars, every vehicle receives the same dedication, care and meticulous workmanship.',
          'Working from our specialist detailing and PPF studio in Lingfield, Surrey, we provide a controlled environment for professional paintwork refinement, ceramic coating application and Paint Protection Film installation.',
          'We believe every vehicle deserves an individual approach, rather than a one-size-fits-all package.'
        ],
        after: ['No shortcuts. No unnecessary treatments. No compromises.']
      }) } },
      { block: '50-svc-note', with: { note: note({
        id: 'day-one',
        title: 'Protect your new car <span class="gold">from day one</span>',
        img: frame('nc-dayone', { sizes: '100vw', ratio: false }),
        lead: 'Your vehicle. Your requirements. Our expertise.',
        paras: [
          'Whether you’re awaiting delivery of a new vehicle or have recently taken ownership, we can advise on the most appropriate combination of paintwork refinement, ceramic coatings and Paint Protection Film.',
          'Contact Miracle Detail to discuss your vehicle and arrange a bespoke new car protection quotation.'
        ],
        cta: { href: '#book', label: 'Enquire About New Car Protection' }
      }) } },
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true, shift: true, dpos: '50% 55%',
        /* phones: the Ioniq whole, not a tall crop of the lights (05/11) */
        mfit: true, mshort: true,
        h1: NAME,
        line: 'The perfect finish starts <span class="gold it">before the first mile.</span>',
        img: frame('nc-hero', {
          priority: true, ratio: false, sizes: '(max-width: 900px) 100vw, 66vw',
          alt: 'Paul’s new matte blue Hyundai Ioniq 5 N in the Miracle Detail studio under the hexagon lights',
          art: [{ media: '(max-width: 900px)', id: 'nc-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      statement: {
        id: 'experience',
        text: 'With over 30 years of professional detailing experience, <span class="gold">Paul Dalton</span> brings an exceptional level of knowledge, precision and attention to detail <span class="gold">to every vehicle.</span>'
      },

      stars, reviews,
      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      snav: [
        { id: 'new-car', label: 'New cars' },
        { id: 'preparation', label: 'Preparation' },
        { id: 'refinement', label: 'Refinement' },
        { id: 'ceramic', label: 'Ceramic' },
        { id: 'ppf', label: 'PPF' },
        { id: 'matte', label: 'Matte & satin' },
        { id: 'package', label: 'Complete package' },
        { id: 'reviews', label: 'Reviews' }
      ],

      /* Paul's sign-off: Miracle Detail, Specialist Detailing | Ceramic
         Coatings | Paint Protection Film, Lingfield, Surrey, email, phone */
      bookTitle: 'Miracle <span class="gold it">Detail</span>',
      bookLede: 'Specialist Detailing | Ceramic Coatings | Paint Protection Film',
      bookStudio: 'Lingfield, Surrey',
      bookEmail: true,
      formServices: site.picks(NAME),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: NAME, serviceType: 'New car detailing and paint protection',
        description: 'New car preparation and decontamination, single- and two-stage paint correction, 3- and 5-year ceramic coatings, and paint protection film: full front end, Track Pack or full vehicle, including matte and satin finishes.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
