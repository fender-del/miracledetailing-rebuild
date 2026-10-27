/* ============================================================
   Homepage — v0.5 order and copy (80%), DMI fixes + motion (20%).
   Spec: HOMEPAGE-PLAN.md §2, revised with Fender 02/10:
     header · hero (video) · press strip · story (since 1988 + the
     cutting, Fifth Gear, then "One detailer. Every car. No exceptions."
     — one pinned block) · services · projects (card deck) · reviews ·
     coverage (one band) · book · footer · sticky bar
   ============================================================ */
'use strict';
const { frame, images } = require('../lib/pic.js');
const { stars, reviews } = require('../lib/shared.js');
const GALLERY = require('../lib/gallery.json');

/* A logo from tools/images.js (white mark), or null so the template
   falls back to the name in type. `k` evens out how big the marks look:
   a long wordmark (Porsche) is drawn lower than a round badge (BMW) so
   both carry about the same weight in the strip. */
const mark = id => {
  const m = images['mark-' + id];
  if (!m) return null;
  const k = Math.max(0.36, Math.min(1.2, Math.sqrt(2.2 / (m.w / m.h)))).toFixed(2);
  return { src: `/assets/img/mark-${id}.webp${m.v ? `?v=${m.v}` : ''}`, w: m.w, h: m.h, k };
};

/* Project cards (Fender 02/10, round 6: "they read like a sales
   catalogue"): each card is a job Paul has done, told only from what
   he has already published: the v0.5 About timeline (Dunsfold Park,
   GF Williams' LaFerrari shoot in 2015, the F40 in Monaco in 2016,
   Koenigsegg at the London Concours, Top Gear Live and the factory) and
   the old gallery (its photo count per job: full-size images on the
   page). No spec sheets, no trivia. The DB11 had no story and left.
   A card opens that car in the Gallery (?job=, the lightbox) where the
   archive has it, otherwise the Gallery filtered to the make (?make=).
   Those five jobs keep every photo (tools/gallery.js FULL), so the
   counts match; the 458's old page showed two photos twice. The Enzo leads (Fender 02/10). */
const CARS = [
  { id: 'car-enzo', name: 'Ferrari Enzo', tag: 'From the gallery', sub: 'Rosso Corsa',
    story: 'An Enzo in Rosso Corsa, one of 150+ jobs in Paul’s gallery, told there in seventeen photographs.',
    work: ['Detailed by Paul', '17 photographs'], href: '/car-detail-gallery/?job=ferrari-enzo-rossa-corsa',
    alt: 'Red Ferrari Enzo in a white showroom' },
  { id: 'car-laferrari', name: 'Ferrari LaFerrari', tag: 'Dunsfold Park · 2015', sub: 'Red',
    story: 'A week-long detail. GF Williams came down to shoot it while the work was still going on.',
    work: ['Week-long detail', 'Shot by GF Williams'], href: '/car-detail-gallery/?make=ferrari',
    alt: 'Red Ferrari LaFerrari under studio lights in a burst of water spray' },
  { id: 'car-ccxr', name: 'Koenigsegg CCX-R Edition', tag: 'From the gallery', sub: 'Clear-coated carbon fibre',
    story: 'Bare carbon shows every mark. Paul has prepared Koenigseggs for the London Concours, the Top Gear Live stand and on the factory floor in Sweden.',
    work: ['Carbon finish', '78 photographs'], href: '/car-detail-gallery/?job=koenigsegg-ccx-r-edition-clear-coated-carbon-fibre',
    alt: 'Clear-coated carbon Koenigsegg CCX-R Edition' },
  { id: 'car-zonda', name: 'Pagani Zonda', tag: 'From the gallery', sub: 'Exposed carbon',
    story: 'Three Zondas in Paul’s gallery, among them a Zonda F Clubsport Final Edition in full carbon, one of 25.',
    work: ['Exposed carbon', '3 Zondas'], href: '/car-detail-gallery/?make=pagani',
    alt: 'Blue carbon Pagani Zonda with gold wheels in a studio' },
  { id: 'car-f40', name: 'Ferrari F40', tag: 'Monaco · 2016', sub: 'Private collection',
    story: 'Detailed on location for a private collection in Monaco, the start of a long relationship with the client.',
    work: ['On location', '5 photographs'], href: '/car-detail-gallery/?job=ferrari-f40',
    alt: 'Red Ferrari F40 in a private garage under work lights' },
  { id: 'car-458', name: 'Ferrari 458 Speciale', tag: 'Dunsfold Park', sub: 'Yellow',
    story: 'Prepared at Paul’s studio at Dunsfold Park, the home of Top Gear’s test track, and photographed by GF Williams.',
    work: ['Dunsfold studio', '4 photographs'], href: '/car-detail-gallery/?job=ferrari-458-speciale-in-yellow',
    alt: 'Yellow Ferrari 458 Speciale on wet tarmac', credit: 'GF Williams' },
  /* Paul 19/10, note 22: the Clubsport card opened an older car; the
     classic slot is now a job whose photo and gallery page match. */
  { id: 'car-993rs', name: 'Porsche 993 Carrera RS', tag: 'From the gallery', sub: '1995 · Riviera Blue',
    story: 'A 993 Carrera RS in Riviera Blue, from the last generation of air-cooled 911s.',
    work: ['Classic', '12 photographs'], href: '/car-detail-gallery/?job=1995-porsche-993-carrera-rs-riviera-blue',
    alt: 'Riviera Blue Porsche 993 Carrera RS in the workshop' },
  /* everyday cars (Paul 19/10, note 21): the section says "classics to daily drivers" */
  { id: 'car-golf-r', name: 'VW Golf R', tag: 'From the gallery', sub: 'Daily driver',
    story: 'A 25-hour detail on a new Golf R, finished with Modesta BC04 glass coating on the paint and BC06 on the wheels.',
    work: ['25-hour detail', '12 photographs'], href: '/car-detail-gallery/?job=vw-golf-r-modesta-bc-04',
    alt: 'Blue VW Golf R in the studio' },
  { id: 'car-m135i', name: 'BMW M135i', tag: 'From the gallery', sub: 'Estoril Blue',
    story: 'An M135i in Estoril Blue: the same care as the supercars, on the car that gets driven every day.',
    work: ['Detailed by Paul', '12 photographs'], href: '/car-detail-gallery/?job=bmw-m135i-in-estoril-blue',
    alt: 'Blue BMW M135i seen from the front three-quarter in the workshop' },
  { id: 'car-focus-rs', name: 'Ford Focus RS', tag: 'From the gallery', sub: 'Ultimate Green',
    story: 'A Focus RS in Ultimate Green, polished panel by panel.',
    work: ['Detailed by Paul', '12 photographs'], href: '/car-detail-gallery/?job=ford-focus-rs-in-ultimate-green',
    alt: 'Green Ford Focus RS in side view' },
  /* three more everyday cars (22/10, note 21) */
  { id: 'car-996', name: 'Porsche 996', tag: 'From the gallery', sub: 'Lapis Blue · 125,000 miles',
    story: 'A 996 in Lapis Blue, brought in with 125,000 miles on the clock.',
    work: ['High mileage', '12 photographs'], href: '/car-detail-gallery/?job=porsche-996-in-lapis-blue-with-125000-on-the-clock',
    alt: 'Lapis Blue Porsche 996 outside the Miracle Detail unit' },
  { id: 'car-mini-gp', name: 'Mini GP', tag: 'From the gallery', sub: 'Daily driver',
    story: 'The limited-run Mini GP, detailed in Paul’s workshop.',
    work: ['Detailed by Paul', '12 photographs'], href: '/car-detail-gallery/?job=mini-gp',
    alt: 'Grey Mini GP with red mirrors in the workshop' },
  { id: 'car-c63', name: 'Mercedes C63 AMG', tag: 'From the gallery', sub: 'Brand new',
    story: 'Booked in brand new for Paul’s Ultimate Detail.',
    work: ['Ultimate Detail', '12 photographs'], href: '/car-detail-gallery/?job=mercedes-c63-amg-brand-new-car-in-for-ultimate-detail',
    alt: 'Silver Mercedes C63 AMG on axle stands in the workshop' }
];

const HERO_SIZES = '(max-width: 767px) calc(106vw + 90px), (max-width: 900px) 100vw, max(68vw, 132vh)';

module.exports = site => {
  const svcImg = s => frame(s.img, {
    alt: s.alt || '', sizes: '(max-width: 767px) 46vw, (max-width: 1100px) 31vw, 25vw', ratio: false, credit: s.credit
  });
  const groupOf = s => {
    const path = s.href.split('#')[0];
    const g = site.serviceGroups.find(g => g.links.some(l => l.href === path));
    return g ? g.name : '';
  };

  return {
    slug: '',
    title: 'Professional Car Detailing in Surrey | Paul Dalton’s Miracle Detail, Lingfield',
    description: 'Paint correction, ceramic coatings, PPF and dry ice cleaning in Lingfield, Surrey. Every car handled personally by Paul Dalton since 1994, from daily drivers to hypercars.',
    /* `sizes` = the width the STO photo is really drawn at under
       object-fit: cover (02-hero.css): 68% of the screen or the hero's
       height × 1.32 on desktop, about 80vw tall on phones. Preloading it
       keeps the photo as the LCP (the old video posters were still here). */
    preload: [
      { id: 'hero-sto', media: 'all', sizes: HERO_SIZES }
    ],

    blocks: [
      '01-header',
      '02-hero', '04-press', '05-story',
      '08-services', '11-projects', '10-reviews', '09-coverage', '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      /* Hero photo (Fender 20/10): lime Huracán STO under a hex-light
         ceiling, replaces the red Ferrari video. */
      heroPoster: frame('hero-sto', {
        priority: true, ratio: false, alt: 'Lime green Lamborghini Huracán STO under hexagonal studio lights',
        sizes: HERO_SIZES
      }),

      /* v0.5 "Featured On", as a strip under the hero (Fender 02/10: the
         place names read as "not based in the UK"; real logos, not names).
         The four TV names are the "4 TV appearances"; the seven papers
         have no single mark, so they stay in type. */
      press: [
        { id: 'fifth-gear', name: 'Fifth Gear' }, { id: 'sunday-mirror', name: 'Sunday Mirror' },
        { id: 'motorheads', name: 'Motorheads' }, { id: 'rtl', name: 'RTL' },
        { id: 'nippon-tv', name: 'Nippon TV' }, { name: 'Seven national newspapers' }
      ].map(p => Object.assign(p, { mark: p.id ? mark(p.id) : null })),

      paulImg: frame('paul', {
        alt: 'Paul Dalton, founder of Miracle Detail', sizes: '(max-width: 767px) 92vw, (max-width: 1023px) 560px, 40vw', ratio: false,
        art: [{ media: '(max-width: 767px)', id: 'paul-sq', sizes: '92vw' }]
      }),
      mirrorImg: frame('mirror', { alt: 'Sunday Mirror cutting, 2006: “The £5K carwash”', sizes: '(max-width: 767px) 54vw, 24vw' }),

      /* All twelve as cards (Ed 06/10). The eight without a v0.5 badge
         carry their menu group instead (Correct & restore, Protect...). */
      services: site.services.map(s => Object.assign({}, s, {
        badge: s.badge || groupOf(s), img: svcImg(s)
      })),
      priceNote: site.vatMode === 'inc'
        ? 'Prices include VAT. Every car is assessed before a final quote.'
        : 'Prices exclude VAT. Every car is assessed before a final quote.',

      totalPad: String(CARS.length).padStart(2, '0'),
      cars: CARS.map((c, i) => Object.assign({}, c, {
        gold: i % 2 === 1,
        /* "N photographs" follows the job's photo count in the Gallery
           (22/10: the re-download took most jobs from 12 to 24 photos) */
        work: c.work.map(w => {
          const job = /[?&]job=([^&#]+)/.exec(c.href);
          const g = job && GALLERY.find(j => j.slug === job[1]);
          return g && / photographs$/.test(w) ? `${g.photos.length} photographs` : w;
        }),
        img: frame(c.id, { alt: c.alt, sizes: '(max-width: 767px) 88vw, 560px', ratio: false, credit: c.credit })
      })),
      total: CARS.length,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      /* Coverage (round 5): v0.5's counties, nearest first, each with a
         town and its distance from Lingfield as the crow flies
         (51.177 N, 0.015 W; Tunbridge Wells 12.5, Charing Cross 23.4,
         Brighton 25.0, Winchester 56.6 miles). */
      areas: [
        { name: 'Surrey', towns: ['Lingfield', 'Reigate', 'Redhill', 'Oxted', 'Caterham', 'Guildford', 'Godalming', 'Dorking', 'Epsom', 'Leatherhead', 'Woking', 'Godstone', 'Banstead', 'Farnham'] },
        { name: 'Kent', towns: ['Sevenoaks', 'Tunbridge Wells', 'Westerham', 'Edenbridge', 'Tonbridge', 'Maidstone', 'Biggin Hill', 'Swanley', 'Dartford', 'Gravesend', 'Rochester', 'Chatham', 'Ashford', 'Canterbury'] },
        { name: 'Sussex & Hampshire', towns: ['East Grinstead', 'Horsham', 'Crawley', 'Haywards Heath', 'Burgess Hill', 'Brighton', 'Worthing', 'Chichester', 'Southampton', 'Winchester', 'Portsmouth', 'Basingstoke'] },
        { name: 'London & beyond', towns: ['Central London', 'South London', 'Croydon', 'Bromley', 'Kingston', 'Richmond', 'Essex', 'Hertfordshire', 'Oxfordshire', 'Berkshire', 'Buckinghamshire', 'International on request'] }
      ],

      stars,
      /* v0.5's six Google reviews (lib/shared.js) */
      reviews,

      /* The makes in the archive (153 old gallery pages) and v0.5's
         recent-cars list, as their logos (Fender 02/10). */
      makes: [
        ['ferrari', 'Ferrari'], ['porsche', 'Porsche'], ['lamborghini', 'Lamborghini'], ['mclaren', 'McLaren'],
        ['bugatti', 'Bugatti'], ['pagani', 'Pagani'], ['koenigsegg', 'Koenigsegg'], ['aston-martin', 'Aston Martin'],
        ['bentley', 'Bentley'], ['rolls-royce', 'Rolls-Royce'], ['mercedes-benz', 'Mercedes-Benz'], ['bmw', 'BMW'],
        ['audi', 'Audi'], ['jaguar', 'Jaguar'], ['land-rover', 'Land Rover'], ['maserati', 'Maserati'],
        ['alfa-romeo', 'Alfa Romeo'], ['tesla', 'Tesla']
      ].map(([id, name]) => ({ id, name, mark: mark(id) })),


      /* Paul 22/10 (board notes 28, 29): the booking lede, and the studio
         line under it. The Baskerville italic on the lede waits for Ed. */
      bookLedeIt: true,
      bookLede: 'Miracle Detail operates by appointment only. Every car gets the same attention, whether it’s a daily driver or something far rarer.',
      bookStudio: 'Studio appointments only · 7 days per week',

      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'AutomotiveBusiness',
        '@id': site.origin + '/#business',
        name: site.name,
        alternateName: 'Paul Dalton’s Miracle Detail',
        url: site.origin + '/',
        telephone: site.phone.replace(/\s/g, ''),
        image: site.origin + '/assets/img/og.jpg',
        foundingDate: site.since,
        founder: { '@type': 'Person', name: site.person },
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${site.address.unit}, ${site.address.street}`,
          addressLocality: site.address.town,
          addressRegion: site.address.county,
          postalCode: site.address.postcode,
          addressCountry: site.address.country
        },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London'],
        sameAs: site.social.map(s => s.href)
      },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.origin + '/' }
    ]
  };
};
