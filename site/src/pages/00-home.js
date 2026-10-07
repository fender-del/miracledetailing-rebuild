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
  { id: 'car-porsche', name: 'Porsche 911 Carrera Clubsport', tag: 'From the gallery', sub: '1984 · White',
    story: 'An air-cooled 3.2 Clubsport from 1984. Paul’s work on it fills thirty-two photographs in the gallery.',
    work: ['Classic', '32 photographs'], href: '/car-detail-gallery/?job=1984-porsche-carrera-clubsport-white',
    alt: 'White classic Porsche 911 Carrera with red script in the studio' }
];

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
    title: 'Car Detailing in Surrey | Paul Dalton’s Miracle Detail, Lingfield',
    description: 'Paint correction, ceramic coatings, PPF and dry ice cleaning in Lingfield, Surrey. Every car handled personally by Paul Dalton since 1994, from daily drivers to hypercars.',
    /* `sizes` = the width the poster is really drawn at under object-fit:
       cover (box height × 16:9 on desktop; the 5:4 loop is box height
       × 1.25 on phones, screen wide on portrait tablets). Getting it
       right keeps the poster, not the video's first frame, as the LCP. */
    preload: [
      { id: 'hero-vm', media: '(max-width: 767px)', sizes: 'calc(80px + 100vw)' },
      { id: 'hero-vm', media: '(min-width: 768px) and (max-width: 900px)', sizes: '100vw' },
      { id: 'hero-v', media: '(min-width: 901px)', sizes: 'max(100vw, 167vh)' }
    ],

    blocks: [
      '01-header',
      '02-hero', '04-press', '05-story',
      '08-services', '11-projects', '10-reviews', '09-coverage', '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      /* Poster = the loop's first frame (5:4 up to 900px). */
      heroPoster: frame('hero-v', {
        priority: true, ratio: false, alt: 'Close-up of a red Ferrari’s grille and headlight in low evening sun',
        sizes: 'max(100vw, 167vh)',
        art: [
          { media: '(max-width: 767px)', id: 'hero-vm', sizes: 'calc(80px + 100vw)' },
          { media: '(max-width: 900px)', id: 'hero-vm', sizes: '100vw' }
        ]
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
        img: frame(c.id, { alt: c.alt, sizes: '(max-width: 767px) 88vw, 560px', ratio: false, credit: c.credit })
      })),
      total: CARS.length,

      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      /* Coverage (round 5): v0.5's counties, nearest first, each with a
         town and its distance from Lingfield as the crow flies
         (51.177 N, 0.015 W; Tunbridge Wells 12.5, Charing Cross 23.4,
         Brighton 25.0, Winchester 56.6 miles). */
      coverage: [
        { name: 'Surrey', ref: 'Home · Lingfield', home: true },
        { name: 'Kent', ref: 'Tunbridge Wells · 13 mi' },
        { name: 'London', ref: 'Central London · 23 mi' },
        { name: 'Sussex', ref: 'Brighton · 25 mi' },
        { name: 'Hampshire', ref: 'Winchester · 57 mi' },
        { name: '& beyond', ref: '' }
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
