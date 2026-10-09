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

   Rebuilt 07/10 (Fender: "audit build lại kĩ… quan trọng không kém
   trang about paul… không cần interactive function"). Like About: no
   page interactions, nothing folds, nothing to tap or swipe; each
   section its own shape (blocks 70–76), real photos of work done where
   the car lives (About's London Concours, Monaco and Portugal shots,
   the old site's mobile jobs), no photo twice. One parallax (how it
   works), one lit line (Portugal's quote). Paul's words unchanged; the
   only splits are presentational (the Caddy paragraph's bold lead set
   as its heading, "Surrey (primary base: Lingfield)" as name + note,
   the wheel prices as term + price).

   Round 2, same day (Fender: "chưa đủ ấn tượng… cấu trúc các block vẫn
   lặp lại… các gói trên mobile nên kéo ngang… chưa nổi giá… 9 khu vực
   hơi lê thê… QnA trên mobile cũng dài quá"): each section a different
   shape: how = a full-bleed photo with the heading on it; the Caddy = a
   road with three stops (77); areas = a chart round Lingfield, counties
   on their true bearing; why = one photo behind three hollow numerals;
   packages = cards led by large prices, swiped on phones; Portugal =
   centred spread; questions fold on phones only.
   Round 3: hero photo held right (the van clear of the copy); how it
   works words-first with a framed photo (no second hero); the chart
   alone (names were shown twice); Portugal gets its third car.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs } = require('../lib/shared.js');

const SLUG = 'mobile-car-detailing';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Mobile detailing', href: `/${SLUG}/` }
  ]);
  /* the VAT switch in site.js (vatMode) reaches these prices too */
  const inc = site.vatMode === 'inc';
  const amt = n => (inc ? Math.round(n * 1.2) : n).toLocaleString('en-GB');
  const tail = inc ? 'inc. VAT' : '+ VAT';

  const faqs = [
    { q: 'Is mobile detailing the same standard as the studio?', a: 'Yes. The same products, the same process, and the same person. Paul’s mobile setup carries the full studio inventory: polishing equipment, Feynlab products, lighting. Nothing is substituted or left behind.' },
    { q: 'What do you need at the location?', a: 'In most cases, access to a power supply, a tap, and a reasonable working space around the car. Paul will talk through the specifics when you book.' },
    { q: 'How far will you travel?', a: 'Paul covers Surrey, Kent, Sussex, London, Hampshire, Essex, Hertfordshire, and Oxfordshire regularly. Further afield, including international, is possible on request. Travel costs apply outside the primary coverage area.' },
    { q: 'Is mobile detailing suitable for rare or valuable cars?', a: 'It’s often the right choice precisely because the car doesn’t have to move. For concours-prepared cars, low vehicles, or anything that doesn’t see road use, Paul coming to the car removes risk entirely.' },
    { q: 'How long does a mobile detail take?', a: 'It depends on the service and the condition of the car. A Maintenance Detail takes 1–2 hours. A full Connoisseur Detail with paint correction may take 2–3 days. Every job is assessed individually and Paul will give you a realistic timeframe upfront.' },
    { q: 'Can I book the mobile service for a fleet or multiple cars?', a: 'Yes. Contact Paul directly to discuss multi-car arrangements, whether for a private collection or a commercial fleet.' }
  ];

  /* Coverage chart: rings round Lingfield (centre 500,500), counties at
     their centre's bearing and distance (6.2 units a mile; lat/lon of the
     county centre, 07/10). Surrey is the base, so it sits at the centre. */
  const S = 6.2;
  const counties = [
    { name: 'London', x: 470, y: 358, lx: 488, ly: 368, a: 'start' },
    { name: 'Kent', x: 705, y: 490, lx: 723, ly: 500, a: 'start' },
    { name: 'Sussex', x: 477, y: 601, lx: 477, ly: 648, a: 'middle' },
    { name: 'Hampshire', x: 156, y: 550, lx: 156, ly: 597, a: 'middle' },
    { name: 'Essex', x: 651, y: 242, lx: 669, ly: 252, a: 'start' },
    { name: 'Hertfordshire', x: 450, y: 233, lx: 450, ly: 206, a: 'middle' },
    { name: ['Oxfordshire &amp;', 'Buckinghamshire'], x: 223, y: 248, lx: 223, ly: 306, a: 'middle' }
  ];
  const ring = r => `<circle class="mba__ring" cx="500" cy="500" r="${r}"/>`;
  const label = c => (Array.isArray(c.name)
    ? `<text class="mba__name" x="${c.lx}" y="${c.ly}" text-anchor="${c.a}">${c.name.map((t, i) => `<tspan x="${c.lx}" dy="${i ? '1.1em' : 0}">${t}</tspan>`).join('')}</text>`
    : `<text class="mba__name" x="${c.lx}" y="${c.ly}" text-anchor="${c.a}">${c.name}</text>`);
  const chart = '<svg class="mba__svg" viewBox="0 0 1000 1000" aria-hidden="true">'
    + '<line class="mba__axis" x1="500" y1="70" x2="500" y2="930"/><line class="mba__axis" x1="70" y1="500" x2="930" y2="500"/>'
    + [20, 40, 60].map(m => ring(m * S)).join('')
    + '<circle class="mba__ring mba__ring--out" cx="500" cy="500" r="430"/>'
    + '<text class="mba__north" x="500" y="56" text-anchor="middle">N</text>'
    + counties.map(c => `<line class="mba__spoke" x1="500" y1="500" x2="${c.x}" y2="${c.y}"/>`
        + `<circle class="mba__halo" cx="${c.x}" cy="${c.y}" r="12"/><circle class="mba__dot" cx="${c.x}" cy="${c.y}" r="5"/>`
        + label(c)).join('')
    /* international: off the chart, south-east */
    + '<path class="mba__arrow" d="M512 512 L880 880"/><path class="mba__head" d="M896 896 L868 884 L884 868 Z"/>'
    + '<text class="mba__far" x="960" y="962" text-anchor="end">International on request</text>'
    /* the base */
    + '<circle class="mba__pulse" cx="500" cy="500" r="18"/>'
    + '<rect class="mba__base" x="488" y="488" width="24" height="24" transform="rotate(45 500 500)"/>'
    + '<text class="mba__baseName" x="476" y="474" text-anchor="end">Surrey</text>'
    + '<text class="mba__sub" x="476" y="506" text-anchor="end">(PRIMARY BASE: LINGFIELD)</text>'
    + '</svg>';

  return {
    slug: SLUG,
    /* scroll kit (07/10): the story pages; this page uses none of the
       kit's kinds, only the base entrances */
    cluster: 'story',
    title: 'Mobile Car Detailing | Surrey, Kent, Sussex, London | Miracle Detail',
    description: 'Mobile detailing by Paul Dalton: the studio standard at your home, office or storage, across Surrey, Kent, Sussex, London and beyond. Packages from £200 + VAT.',
    preload: [
      { id: 'mb-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'mb-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      '70-mb-how', '77-mb-route', '71-mb-areas', '72-mb-why', '73-mb-menu', '74-mb-field', '75-mb-faq', '76-mb-addon',
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        shift: true,
        /* phones: where the poster crop is held (08/10) */
        mfit: true,
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

      stars, reviews,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      snav: [
        { id: 'how', label: 'How it works' },
        { id: 'caddy', label: 'The Caddy' },
        { id: 'areas', label: 'Coverage' },
        { id: 'why-mobile', label: 'Why mobile' },
        { id: 'packages', label: 'Packages' },
        { id: 'field', label: 'In the field' },
        { id: 'faq', label: 'Questions' },

        { id: 'reviews', label: 'Reviews' }
      ],

      how: {
        id: 'how',
        eyebrow: 'How it works',
        title: 'Studio results, <span class="gold">no studio required.</span>',
        img: frame('ab-11-1', { alt: 'Paul washing a blue Koenigsegg CCX on the lawn at the London Concours, the Miracle Detail van open behind him', sizes: '(max-width: 899px) 92vw, 34vw', ratio: false }),
        cap: 'Koenigsegg CCX · London Concours, The Burlington',
        lead: 'Mobile detailing isn’t a compromise: it’s a different delivery method for the same standard of work. Paul built a purpose-engineered mobile setup specifically for on-location work, carrying every product, tool, and piece of equipment used in the studio.',
        paras: [
          'The only thing that changes is where the car sits. The attention, the process, and the result stay exactly the same.',
          'For clients who can’t bring their car to Lingfield, or whose cars are simply not for driving around, Paul brings everything to you.'
        ]
      },

      route: {
        id: 'caddy',
        eyebrow: 'The van',
        title: 'The purpose-built <span class="gold">VW Caddy.</span>',
        text: 'Paul’s mobile detail van isn’t an afterthought. It was built specifically for mobile work, carrying a full product inventory, polishing equipment, lighting, and everything else the studio uses. The van visits regular clients on a monthly maintenance plan, and has worked across Europe, including a week in Portugal detailing two Ferraris and a Porsche GT3 RS, and a trip to Monaco for a private client.',
        stops: [
          { place: 'United Kingdom', note: 'Monthly maintenance plan',
            img: frame('mb-spyker', { alt: 'A silver Spyker C8 in a showroom, the Miracle Detail van parked outside', sizes: '(max-width: 899px) 30vw, 28vw', ratio: false }) },
          { place: 'Monaco', note: 'A private client',
            img: frame('ab-20-1', { alt: 'Paul giving a Ferrari F40 its final detail in a private garage in Monaco', sizes: '(max-width: 899px) 30vw, 28vw', ratio: false }) },
          { place: 'Portugal', note: 'Two Ferraris and a Porsche GT3 RS',
            img: frame('mb-f12b', { alt: 'The blue Ferrari F12 TDF in an underground garage in Portugal', sizes: '(max-width: 899px) 30vw, 28vw', ratio: false }) }
        ]
      },

      areas: {
        id: 'areas',
        eyebrow: null,
        title: 'Coverage <span class="gold">areas.</span>',
        svg: chart,
        items: ['Surrey (primary base: Lingfield)', 'Kent', 'Sussex', 'London', 'Hampshire', 'Essex', 'Hertfordshire', 'Oxfordshire &amp; Buckinghamshire', 'International on request']
          .map(text => ({ text }))
      },

      why: {
        id: 'why-mobile',
        eyebrow: 'Why choose mobile',
        title: 'Nothing <span class="gold">compromised.</span>',
        img: frame('ab-12-1', { alt: '', sizes: '100vw', ratio: false }),
        items: [
          { n: '01', name: 'No transport risk', text: 'For rare, valuable, or low cars that aren’t suitable for everyday driving, mobile detailing removes the risk of transporting the vehicle entirely. Paul comes to where the car lives.' },
          { n: '02', name: 'Genuine convenience', text: 'Your time matters. Paul works around your schedule: at your home, your business, a storage facility, or wherever works best. No waiting, no drop-off, no collection.' },
          { n: '03', name: 'Studio standard', text: 'The products, the process, and the person are identical to the studio service. There is no mobile-grade version of the work: there is one standard, and it travels with the van.' }
        ]
      },

      menu: {
        id: 'packages',
        eyebrow: 'Mobile packages',
        title: 'What’s <span class="gold">included.</span>',
        count: 4,
        intro: ['All packages use the same Feynlab products and multi-stage wash process Paul uses in the studio. Prices are indicative: every car is assessed individually.'],
        items: [
          { tag: 'Maintenance', name: 'Maintenance Detail', amt: amt(200), tail, hi: false,
            text: 'For regular clients who already have protection applied and want their car brought back to standard between visits. A full luxury wash and interior refresh.',
            list: ['28-stage luxury wash process', 'Citrus degreaser, lower panels', 'Snow foam application', 'Hand wash with Feynlab Pure Wash', 'Dual grit-guard bucket system', 'Purified water, heated to 35°C', 'Wheels, arches and door shuts', 'Tyre dressing, satin finish', 'Quick detailer spray sealant', 'Interior vacuum and clean (POA)'],
            facts: [{ k: 'Time', v: '1–2 hours' }, { k: 'Protection', v: 'Up to 6 months' }] },
          { tag: 'Protection', name: 'Classic Protection Detail', amt: amt(550), tail, hi: false,
            text: 'A solid entry point into professional detailing: paint decontamination, clay bar treatment, and high-end carnauba wax protection. Wash process as per Maintenance Detail.',
            list: ['Full 28-stage luxury wash', 'Clay bar paint decontamination', 'Iron fallout removal', 'High-end carnauba wax, all panels', 'Tyre dressing applied', 'Windows cleaned inside and out'],
            facts: [{ k: 'Time', v: 'Half day' }, { k: 'Protection', v: 'Up to 6 months' }] },
          { tag: 'Enhancement', name: 'Premier Enhancement Detail', amt: amt(750), tail, hi: true,
            text: 'For clients who want their car thoroughly detailed once or twice a year. Includes paint correction, Feynlab ceramic coating, and full glass treatment.',
            list: ['32-stage luxury wash process', 'Snow foam and Feynlab Pure Wash', 'Purified water heated to 35°C', 'Tar removal process', '1-stage paint enhancement correction', 'Feynlab ceramic coating applied', 'Water-repellent exterior glass coating', 'Tyre dressing, satin finish', 'Interior detail at extra cost'],
            facts: [{ k: 'Time', v: '1–2 days' }, { k: 'Durability', v: '2, 4 or 6 years' }] },
          { tag: 'Correction', name: 'Connoisseur Detail', amt: amt(950), tail, hi: false,
            text: 'A deeper level of paint correction with multi-year Feynlab ceramic protection. The right choice when the paint needs serious work or when maximum durability is the priority.',
            list: ['Full 32-stage luxury wash', 'Snow foam and Feynlab Pure Wash', 'Tar removal', '2-stage paint correction', 'Paint thickness measured, every panel', 'Feynlab ceramic coating applied', 'Water-repellent window coating'],
            facts: [{ k: 'Time', v: '2–3 days' }, { k: 'Durability', v: '1–5 years +' }] }
        ]
      },

      field: {
        id: 'field',
        eyebrow: 'The van in the field',
        title: 'Portugal. <span class="gold">One week. Three cars.</span>',
        photos: [
          { img: frame('mb-f12', { alt: 'A blue Ferrari F12 TDF detailed on location in Portugal', sizes: '(max-width: 899px) 46vw, 62vw', ratio: false }), cap: 'Ferrari F12 TDF · Portugal' },
          { img: frame('mb-599', { alt: 'A grey Ferrari 599 GTO detailed on location in Portugal', sizes: '(max-width: 899px) 46vw, 30vw', ratio: false }), cap: 'Ferrari 599 GTO · Portugal' },
          /* stand-in until Paul sends the Portugal car: a 997 GT3 RS from
             his gallery, captioned as such (REQUESTS) */
          { img: frame('mb-gt3', { alt: 'A blue Porsche 997 GT3 RS from Paul’s gallery', sizes: '(max-width: 899px) 46vw, 30vw', ratio: false }), cap: 'Porsche GT3 RS · from the gallery' }
        ],
        paras: [
          'In 2020 Paul drove the purpose-built Caddy to Portugal and spent a week detailing a Ferrari F12 TDF, a Ferrari 599 GTO, and a Porsche GT3 RS on location for a private client. The van has also been to Monaco. Closer to home, Paul visits regular clients on a monthly maintenance basis: the same care, on a schedule that suits them.',
          'The same Feynlab products, the same process, the same result, wherever the car happens to be.',
          'For international mobile work, get in touch directly to discuss logistics and pricing.'
        ],
        quote: '“Same standard. <span class="gold">Different postcode.</span>”',
        cite: 'Paul Dalton · Miracle Detail',
        close: 'The mobile service covers the UK regularly, visiting monthly maintenance clients as well as one-off jobs. It has also reached Portugal and Monaco for private clients abroad.',
        price: 'From £???'
      },

      qa: {
        id: 'faq',
        eyebrow: 'Common questions',
        title: 'Things people <span class="gold">ask.</span>',
        items: faqs
      },

      addon: {
        id: 'wheels',
        eyebrow: 'Available at your location',
        title: 'Wheel ceramic coating: <span class="gold">applied off the car, inside and out.</span>',
        text: 'Painted calipers included. Can be added to any mobile package.',
        img: frame('cc-wheel', { alt: 'A Ferrari 458 Speciale wheel and caliper up close', sizes: '(max-width: 899px) 92vw, 50vw', ratio: false }),
        prices: [
          { term: '1-year', amt: 'from £200+VAT' },
          { term: '3–5 year', amt: 'from £300+VAT' }
        ]
      },

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
