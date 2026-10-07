/* ============================================================
   Mobile detailing (06/10, v0.5 pages only, PPF rules).

   v0.5 /mobile-detailing/, in its order:
     hero · how it works (+ the Caddy, coverage areas) · why choose
     mobile (3) · mobile packages (4) · the van in the field (Portugal,
     "Same standard. Different postcode.") · common questions (6)
     · wheel ceramic at your location · book
   v0.5's hero is an AI picture of the van; this page opens on Paul's
   own photo of the Caddy in Portugal (About, 2020). "From £???" under
   the quote kept as written (Fender 06/10).
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs, cards, prose, quote } = require('../lib/shared.js');

const SLUG = 'mobile-car-detailing';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Mobile detailing', href: `/${SLUG}/` }
  ]);
  const vat = n => `From £${n} + VAT`;

  const faqs = [
    { q: 'Is mobile detailing the same standard as the studio?', a: 'Yes. The same products, the same process, and the same person. Paul’s mobile setup carries the full studio inventory: polishing equipment, Feynlab products, lighting. Nothing is substituted or left behind.' },
    { q: 'What do you need at the location?', a: 'In most cases, access to a power supply, a tap, and a reasonable working space around the car. Paul will talk through the specifics when you book.' },
    { q: 'How far will you travel?', a: 'Paul covers Surrey, Kent, Sussex, London, Hampshire, Essex, Hertfordshire, and Oxfordshire regularly. Further afield, including international, is possible on request. Travel costs apply outside the primary coverage area.' },
    { q: 'Is mobile detailing suitable for rare or valuable cars?', a: 'It’s often the right choice precisely because the car doesn’t have to move. For concours-prepared cars, low vehicles, or anything that doesn’t see road use, Paul coming to the car removes risk entirely.' },
    { q: 'How long does a mobile detail take?', a: 'It depends on the service and the condition of the car. A Maintenance Detail takes 1–2 hours. A full Connoisseur Detail with paint correction may take 2–3 days. Every job is assessed individually and Paul will give you a realistic timeframe upfront.' },
    { q: 'Can I book the mobile service for a fleet or multiple cars?', a: 'Yes. Contact Paul directly to discuss multi-car arrangements, whether for a private collection or a commercial fleet.' }
  ];

  return {
    slug: SLUG,
    title: 'Mobile Car Detailing | Surrey, Kent, Sussex, London | Miracle Detail',
    description: 'Mobile detailing by Paul Dalton: the studio standard at your home, office or storage, across Surrey, Kent, Sussex, London and beyond. Packages from £200 + VAT.',
    preload: [
      { id: 'mb-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'mb-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'how',
        eyebrow: 'How it works',
        title: 'Studio results, <span class="gold">no studio required.</span>',
        img: frame('mb-pagani', { alt: 'A blue Pagani Zonda being detailed at a client’s premises', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: [
          'Mobile detailing isn’t a compromise: it’s a different delivery method for the same standard of work. Paul built a purpose-engineered mobile setup specifically for on-location work, carrying every product, tool, and piece of equipment used in the studio.',
          'The only thing that changes is where the car sits. The attention, the process, and the result stay exactly the same.',
          'For clients who can’t bring their car to Lingfield, or whose cars are simply not for driving around, Paul brings everything to you.',
          '<strong>The purpose-built VW Caddy.</strong> Paul’s mobile detail van isn’t an afterthought. It was built specifically for mobile work, carrying a full product inventory, polishing equipment, lighting, and everything else the studio uses. The van visits regular clients on a monthly maintenance plan, and has worked across Europe, including a week in Portugal detailing two Ferraris and a Porsche GT3 RS, and a trip to Monaco for a private client.'
        ],
        listTitle: 'Coverage areas',
        listCols: true,
        list: ['Surrey (primary base: Lingfield)', 'Kent', 'Sussex', 'London', 'Hampshire', 'Essex', 'Hertfordshire', 'Oxfordshire &amp; Buckinghamshire', 'International on request']
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'why-mobile', graphite: true, variant: 'points', cols: 3,
        eyebrow: 'Why choose mobile',
        title: '<span class="gold">Nothing compromised.</span>',
        items: [
          { n: '01', name: 'No transport risk', paras: 'For rare, valuable, or low cars that aren’t suitable for everyday driving, mobile detailing removes the risk of transporting the vehicle entirely. Paul comes to where the car lives.' },
          { n: '02', name: 'Genuine convenience', paras: 'Your time matters. Paul works around your schedule: at your home, your business, a storage facility, or wherever works best. No waiting, no drop-off, no collection.' },
          { n: '03', name: 'Studio standard', paras: 'The products, the process, and the person are identical to the studio service. There is no mobile-grade version of the work: there is one standard, and it travels with the van.' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'packages', light: true, cols: 4,
        eyebrow: 'Mobile packages',
        title: 'What’s <span class="gold">included.</span>',
        intro: ['All packages use the same Feynlab products and multi-stage wash process Paul uses in the studio. Prices are indicative: every car is assessed individually.'],
        items: [
          { tag: 'Maintenance', name: 'Maintenance Detail', price: vat(200),
            paras: 'For regular clients who already have protection applied and want their car brought back to standard between visits. A full luxury wash and interior refresh.',
            list: ['28-stage luxury wash process', 'Citrus degreaser, lower panels', 'Snow foam application', 'Hand wash with Feynlab Pure Wash', 'Dual grit-guard bucket system', 'Purified water, heated to 35°C', 'Wheels, arches and door shuts', 'Tyre dressing, satin finish', 'Quick detailer spray sealant', 'Interior vacuum and clean (POA)'],
            facts: [{ k: 'Time', v: '1–2 hours' }, { k: 'Protection', v: 'Up to 6 months' }] },
          { tag: 'Protection', name: 'Classic Protection Detail', price: vat(550),
            paras: 'A solid entry point into professional detailing: paint decontamination, clay bar treatment, and high-end carnauba wax protection. Wash process as per Maintenance Detail.',
            list: ['Full 28-stage luxury wash', 'Clay bar paint decontamination', 'Iron fallout removal', 'High-end carnauba wax, all panels', 'Tyre dressing applied', 'Windows cleaned inside and out'],
            facts: [{ k: 'Time', v: 'Half day' }, { k: 'Protection', v: 'Up to 6 months' }] },
          { tag: 'Enhancement', name: 'Premier Enhancement Detail', price: vat(750), hi: true,
            paras: 'For clients who want their car thoroughly detailed once or twice a year. Includes paint correction, Feynlab ceramic coating, and full glass treatment.',
            list: ['32-stage luxury wash process', 'Snow foam and Feynlab Pure Wash', 'Purified water heated to 35°C', 'Tar removal process', '1-stage paint enhancement correction', 'Feynlab ceramic coating applied', 'Water-repellent exterior glass coating', 'Tyre dressing, satin finish', 'Interior detail at extra cost'],
            facts: [{ k: 'Time', v: '1–2 days' }, { k: 'Durability', v: '2, 4 or 6 years' }] },
          { tag: 'Correction', name: 'Connoisseur Detail', price: vat(950),
            paras: 'A deeper level of paint correction with multi-year Feynlab ceramic protection. The right choice when the paint needs serious work or when maximum durability is the priority.',
            list: ['Full 32-stage luxury wash', 'Snow foam and Feynlab Pure Wash', 'Tar removal', '2-stage paint correction', 'Paint thickness measured, every panel', 'Feynlab ceramic coating applied', 'Water-repellent window coating'],
            facts: [{ k: 'Time', v: '2–3 days' }, { k: 'Durability', v: '1–5 years +' }] }
        ]
      }) } },
      { block: '38-svc-quote', with: { quote: quote({
        id: 'field',
        eyebrow: 'The van in the field',
        title: 'Portugal. <span class="gold">One week. Three cars.</span>',
        img: frame('mb-polish', { alt: '', sizes: '100vw', ratio: false }),
        text: '“Same standard. <span class="gold">Different postcode.</span>”',
        cite: 'Paul Dalton · Miracle Detail',
        paras: [
          'In 2020 Paul drove the purpose-built Caddy to Portugal and spent a week detailing a Ferrari F12 TDF, a Ferrari 599 GTO, and a Porsche GT3 RS on location for a private client. The van has also been to Monaco. Closer to home, Paul visits regular clients on a monthly maintenance basis: the same care, on a schedule that suits them.',
          'The same Feynlab products, the same process, the same result, wherever the car happens to be.',
          'For international mobile work, get in touch directly to discuss logistics and pricing.',
          'The mobile service covers the UK regularly, visiting monthly maintenance clients as well as one-off jobs. It has also reached Portugal and Monaco for private clients abroad.'
        ],
        price: 'From £???'
      }) } },
      '24-svc-work',
      '28-svc-faq',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'wheels', graphite: true,
        eyebrow: 'Available at your location',
        title: 'Wheel ceramic coating: <span class="gold">applied off the car, inside and out.</span>',
        paras: ['Painted calipers included. Can be added to any mobile package.'],
        list: ['1-year from £200+VAT', '3–5 year from £300+VAT']
      }) } },
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        h1: 'Mobile Detailing',
        line: 'The studio. <span class="gold">At your location.</span>',
        lede: 'The same standard Paul applies in the studio, delivered to your home, your office, or anywhere else you need it. Surrey, Kent, Sussex, London and beyond.',
        img: frame('mb-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'The Miracle Detail VW Caddy, Paul’s purpose-built mobile studio, parked on a cobbled street in Portugal',
          art: [{ media: '(max-width: 900px)', id: 'mb-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      snav: [
        { id: 'how', label: 'How it works' },
        { id: 'why-mobile', label: 'Why mobile' },
        { id: 'packages', label: 'Packages' },
        { id: 'field', label: 'In the field' },
        { id: 'faq', label: 'Questions' }
      ],

      workId: 'portugal',
      work: [
        { img: frame('mb-f12', { alt: 'A blue Ferrari F12 TDF detailed on location in Portugal', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari F12 TDF, Portugal', third: true },
        { img: frame('mb-599', { alt: 'A grey Ferrari 599 GTO detailed on location in Portugal', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari 599 GTO, Portugal', third: true },
        { img: frame('mb-f12b', { alt: 'The blue Ferrari F12 TDF in an underground garage', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari F12 TDF, blue', third: true }
      ],

      faqTitle: 'Things people <span class="gold">ask.</span>',
      faqs: faqs.map(f => Object.assign({ tbc: null }, f)),

      bookTitle: 'Ready to <span class="gold">book?</span>',
      bookLede: 'Tell Paul where the car is, what it needs, and when suits you. He’ll come to you.',
      formServices: site.picks('Mobile detailing'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Mobile detailing', serviceType: 'Mobile car detailing',
        description: 'The studio standard at the client’s location: maintenance, protection, enhancement and correction details from Paul’s purpose-built VW Caddy.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'London', 'Hampshire', 'Essex', 'Hertfordshire', 'Oxfordshire', 'Buckinghamshire']
      },
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }
    ]
  };
};
