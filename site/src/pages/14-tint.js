/* ============================================================
   Window tinting & bulletproof film (06/10, v0.5 pages only, PPF rules).

   v0.5 /window-tinting-protection/, in its order:
     hero · a complete transformation · film options (3) · the chameleon
     effect (+4 points) · UK legal requirements · bulletproof film
     · how it works (3) · who it's for (3) · complete discretion · book
   v0.5 slip, fixed: under "UK legal requirements" it shows the Ceramic
   by Paul Dalton paragraph, and the ceramic page shows the VLT one.
   Each sits on its own page here (REQUESTS.md). "From £???" kept as
   written (Fender 06/10).
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs, cards, prose } = require('../lib/shared.js');

const SLUG = 'window-tinting';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/car-care-services/' },
    { name: 'Window tinting', href: `/${SLUG}/` }
  ]);

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'restore',
    title: 'Window Tinting & Bulletproof Film in Surrey | Miracle Detail',
    description: 'Window tinting through Miracle Detail in Lingfield, Surrey: standard dyed tint, chameleon film and windscreen tint within UK VLT law, plus invisible ballistic protection film.',
    preload: [
      { id: 'wt-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'wt-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'overview', zoom: { focus: '30% 42%' },
        title: 'More than privacy. <span class="gold">A complete transformation.</span>',
        img: frame('wt-film', { alt: 'Tint film being laid onto a car’s side window with a squeegee', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: [
          'Window tinting is one of the most effective ways to change the appearance of a car, adding presence, privacy and a sense of intent that no other modification delivers as cleanly. Done properly, the film is invisible from the inside while transforming the car’s character from the outside.',
          'Window tinting is available through Miracle Detail as part of your overall package.',
          'Every installation is assessed individually and must comply with UK legal requirements. Paul will advise on what’s achievable and what the regulations allow before any film is applied.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'films', light: true, cols: 3, fx: 'rail',
        eyebrow: 'Film options',
        title: 'Two films. <span class="gold">Every application covered.</span>',
        items: [
          { n: 'I', name: 'Standard Dyed Tint', sub: 'Privacy and UV protection',
            paras: 'The classic window tint: a dyed film that reduces visible light transmission, blocks UV radiation and gives the car a clean, purposeful appearance from the outside. Available in various darkness levels from light privacy through to deep black, within UK legal limits.',
            list: ['Rear and side window tinting', 'Multiple darkness levels available', 'UV and heat reduction', 'Clean, uniform appearance', 'Compliant with UK VLT regulations'],
            price: 'From £???' },
          { n: 'II', tag: 'Most distinctive', hi: true, name: 'Chameleon Tint', sub: 'Colour-shift film, windows and windscreen',
            paras: 'Chameleon film shifts colour depending on viewing angle and light conditions, from blue to green to purple and beyond. Applied to side windows or the windscreen, it gives the car a dramatic, distinctive appearance unlike any other tint. The windscreen application is particularly striking: a subtle iridescent shimmer that changes with the light while remaining clear from inside.',
            list: ['Colour-shift effect, unique at every angle', 'Available for side windows and windscreen', 'Maintains excellent clarity from inside', 'UV and glare reduction', 'Legal for windscreen application in the UK'],
            price: 'From £???' },
          { n: 'III', name: 'Windscreen Tint', sub: 'Chameleon or light privacy film',
            paras: 'Windscreen tinting using chameleon or light privacy film, reducing glare, cutting UV and adding a distinctive appearance to the front of the car. All windscreen film applied at Miracle Detail complies with UK legal requirements for visible light transmission.',
            list: ['Chameleon or light dyed film', 'Glare and UV reduction', 'Legal VLT compliance confirmed before application', 'Professionally fitted: no bubbles, no edges'],
            price: 'From £???' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'chameleon', variant: 'points', cols: 4,
        eyebrow: 'The chameleon effect',
        title: 'A film that changes <span class="gold">with the light.</span>',
        intro: [
          'Chameleon tint is named for exactly what it does: the film shifts colour depending on the angle of light hitting it. In bright sunshine it shimmers with blue and green. In overcast conditions it settles into a more subtle purple or silver. No two moments look quite the same.',
          'On a windscreen it is particularly effective',
          'It is the choice of clients who want their car to look different: genuinely different, not just tinted.'
        ],
        items: [
          { n: 'I', name: 'Colour shift in different light', paras: 'The film moves through blue, green and purple tones depending on the angle and light conditions. No static appearance: the car looks different at every moment.' },
          { n: 'II', name: 'Clear visibility from inside', paras: 'Despite the dramatic exterior appearance, visibility from inside the car remains clear and natural. The colour shift is primarily visible from outside.' },
          { n: 'III', name: 'Available for windscreen', paras: 'Unlike standard dark tints, chameleon film meets UK legal requirements for windscreen VLT, making it one of the few genuinely dramatic windscreen options available legally.' },
          { n: 'IV', name: 'Pairs well with PPF', paras: 'Chameleon windscreen tint complements full front PPF installations: both films applied cleanly and professionally as part of a complete detail package.' }
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'legal', graphite: true, zoom: { glass: true, still: true },
        eyebrow: 'UK legal requirements',
        title: 'Tinted legally. <span class="gold">Done properly.</span>',
        img: frame('wt-glass', { alt: 'The dark tinted side glass of a black saloon', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '16 / 10' }),
        paras: [
          'Window tinting in the UK is governed by visible light transmission (VLT) regulations. The law specifies minimum light transmission levels for front side windows and windscreens: rear windows and rear side windows have no legal minimum for private vehicles.',
          'All window tinting carried out through Miracle Detail is compliant with current UK VLT regulations. Paul will confirm what’s achievable and legal for your specific car before any film is fitted.'
        ],
        listTitle: 'UK VLT Requirements',
        list: [
          'Windscreen: must let through at least 75% of light',
          'Front side windows: must let through at least 70% of light',
          'Rear side windows: no legal minimum for private vehicles',
          'Rear windscreen: no legal minimum for private vehicles',
          'Chameleon film is typically legal for windscreens as VLT remains above 75%',
          'Film darkness confirmed against your car’s existing glass before fitting',
          'Certificate of conformity provided on request'
        ],
        price: 'From £???'
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'bulletproof', light: true,
        eyebrow: 'Also available through Miracle Detail · Bulletproof Film',
        title: 'Protection that <span class="gold">cannot be seen.</span>',
        paras: [
          'Invisible protection. Absolute discretion.',
          'Ballistic protection film is a multi-layer security film applied to vehicle glass. In appearance it is indistinguishable from standard window glass: there is no visible difference, no tint, no indication of what lies beneath. The protection is entirely invisible.',
          'In the event of an impact (from a projectile, an attempted forced entry or a collision) the film holds the glass together, preventing shattering and maintaining the integrity of the vehicle. The glass breaks. The film holds. The occupants are protected.',
          'Available through Miracle Detail for private clients, chauffeurs carrying high-profile passengers and security vehicles. Every enquiry is handled with complete confidentiality.'
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'ballistic', light: true, variant: 'points', cols: 3,
        eyebrow: 'How it works',
        title: 'Three properties. <span class="gold">One purpose.</span>',
        items: [
          { n: 'I', name: 'Ballistic Resistance', sub: 'Impact and projectile protection', paras: 'Multiple layers of high-tensile film bonded to the interior surface of the glass create a barrier that absorbs and disperses the energy of an impact. The glass may crack, but it does not shatter, and the film holds.' },
          { n: 'II', name: 'Forced Entry Resistance', sub: 'Smash and grab prevention', paras: 'Ballistic film significantly increases the time and effort required to breach a vehicle window, deterring opportunistic attacks and smash-and-grab attempts, and buying critical seconds in higher-threat situations.' },
          { n: 'III', name: 'Invisible Application', sub: 'No visible indication of protection', paras: 'Unlike visible security glazing, ballistic film is applied to existing glass and is optically clear. From inside or outside the vehicle, there is no visible difference. The protection is entirely undetectable.' }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'who', light: true, cols: 3,
        eyebrow: 'Who it’s for',
        title: 'For those who carry <span class="gold">more than passengers.</span>',
        items: [
          { n: 'I', name: 'Private Clients', sub: 'High-net-worth individuals', paras: 'For private clients whose profile, assets or circumstances mean that personal security is a genuine consideration. The film is applied discreetly, the car looks entirely normal, and the client travels with a layer of protection that nobody can see.' },
          { n: 'II', name: 'Chauffeur Vehicles', sub: 'Carrying high-profile passengers', paras: 'Chauffeurs who carry celebrities, executives, diplomats or other high-profile clients have a responsibility to the safety of their passengers that goes beyond driving. Ballistic film is an invisible, maintenance-free enhancement to any chauffeur vehicle, coordinated through Miracle Detail alongside the full detail and presentation work the car requires.' },
          { n: 'III', name: 'Security Vehicles', sub: 'Close protection and escort', paras: 'Security and close protection vehicles operating in higher-threat environments where additional glass protection is a standard precaution. Applied professionally, coordinated discreetly, with complete confidentiality at every stage.' }
        ]
      }) } },
      { block: '33-svc-prose', with: { prose: prose({
        id: 'discretion', graphite: true,
        title: 'Complete discretion. <span class="gold">At every stage.</span>',
        paras: [
          'Paul has worked with clients who require absolute confidentiality throughout his career. The nature of this service means that enquiries, installation appointments and any discussion of the vehicles or their owners are handled with complete discretion, before, during and after the work.',
          'Nothing discussed at the studio leaves the studio. No social media, no case studies, no reference to client vehicles or identities. If you need to know that Paul has carried out this work before, the conversation starts and ends with a phone call.',
          `To enquire, call Paul directly on <a class="gold" href="${site.phoneHref}">${site.phone}</a>.`
        ]
      }) } },
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        h1: 'Window Tinting & Protection',
        line: 'Privacy, protection, presence, <span class="gold">and security.</span>',
        lede: 'Window tinting and ballistic protection film, both available through Miracle Detail. From chameleon windscreen film to invisible security glazing for private clients and chauffeur vehicles. Coordinated alongside your detail.',
        img: frame('wt-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Gloved hands smoothing tint film onto a car window',
          art: [{ media: '(max-width: 900px)', id: 'wt-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      snav: [
        { id: 'overview', label: 'Overview' },
        { id: 'films', label: 'Film options' },
        { id: 'chameleon', label: 'Chameleon' },
        { id: 'legal', label: 'UK law' },
        { id: 'bulletproof', label: 'Bulletproof film' },
        { id: 'who', label: 'Who it’s for' }
      ],

      bookTitle: 'Complete your car. <span class="gold">Inside and out.</span>',
      bookLede: 'Window tinting and ballistic film are both available through Miracle Detail, coordinated alongside your detail. Get in touch to discuss what’s right for your car.',
      formServices: site.picks('Window tinting or bulletproof film'),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Window tinting', serviceType: 'Window tinting and ballistic protection film',
        description: 'Standard dyed, chameleon and windscreen tint within UK VLT law, and invisible ballistic protection film, coordinated through Miracle Detail.',
        provider: { '@id': site.origin + '/#business' },
        areaServed: ['Surrey', 'Kent', 'Sussex', 'Hampshire', 'London']
      }
    ]
  };
};
