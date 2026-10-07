/* ============================================================
   About Paul (06/10, v0.5 pages only, PPF rules).
   Old-site slug /about-paul-dalton-car-detailing/ kept.

   v0.5 /about-paul/, in its order:
     hero (headline, intro, six figures) · the beginning · the full
     story (timeline, 24 entries) · Fifth Gear 2006 · the work itself
     · a few credentials (5) · two quotes · new to detailing (5) · on
     price (4) · five cars · Google reviews · book
   v0.5 slips left out (REQUESTS.md): the figure "10,000" is labelled
   "Years in the trade"; "Paint looks dull or hazy" repeats the section
   intro instead of its own line; Nippon TV shows one photo three times
   (kept once); 2015 LaFerrari shows the dry ice photo (this page shows
   v0.5's own LaFerrari photo, download.jpg, instead).
   07/10 rebuild (Fender: the layout and the scroll did not land; on a
   phone the story could not be read in full): the timeline reads top to
   bottom with a year bar (desktop: a photo stage beside it), Fifth Gear
   is one spread, credentials / new to detailing / on price are numbered
   lists, the two quotes share one photo, and nothing folds. Same words,
   same order.
   ============================================================ */
'use strict';
const { frame, images } = require('../lib/pic.js');
const { stars, reviews, crumbs, prose } = require('../lib/shared.js');

const SLUG = 'about-paul-dalton-car-detailing';

/* one timeline photo. The frames take their shape from the layout
   (40-timeline.css: a phone grid, or the desktop stage), so no ratio
   here; sizes follow the tile each layout gives the photo. */
const ph = (n, cap, alt) => ({ n, cap, alt });
const isPort = n => { const im = images['ab-' + n]; return !!im && im.h > im.w; };
function photos(list, port) {
  const n = list.length;
  const size = i => {
    if (n === 1) return '(max-width: 1023px) 92vw, 46vw';
    if (n === 2) return '(max-width: 1023px) 46vw, 46vw';
    if (n === 3 && !port) return i === 0 ? '(max-width: 1023px) 92vw, 46vw' : '(max-width: 1023px) 46vw, 23vw';
    if (port) return '(max-width: 1023px) 31vw, 16vw';
    return '(max-width: 1023px) 46vw, 23vw';
  };
  return list.map((p, i) => ({ img: frame('ab-' + p.n, { alt: p.alt || p.cap, sizes: size(i), ratio: false }), cap: p.cap, portrait: isPort(p.n), ar: `${images['ab-' + p.n].w} / ${images['ab-' + p.n].h}` }));
}
/* block 43: a numbered list (credentials, new to detailing, on price) */
const list = o => ({
  id: o.id, light: !!o.light, cards: !!o.cards, eyebrow: o.eyebrow, title: o.title,
  intro: o.intro || null, hasIntro: !!(o.intro && o.intro.length),
  items: o.items.map(it => ({ n: it.n, name: it.name, sub: it.sub || null, paras: it.paras ? [].concat(it.paras) : null, hasText: !!it.paras }))
});
let seq = 0;
const entry = (year, title, paras, list = []) => {
  const port = list.filter(p => isPort(p.n)).length > list.length / 2;
  const ps = photos(list, port);
  const idx = String(++seq).padStart(2, '0');
  return {
    id: 'tl-' + idx, idx, year, title, paras: [].concat(paras), photos: ps,
    hasPhotos: ps.length > 0, count: ps.length, shape: port ? 'port' : 'land',
    /* phones: three or more photos share one line of captions */
    capLine: ps.length >= 3 ? ps.map(p => p.cap).join(' · ') : null
  };
};

module.exports = site => {
  seq = 0;
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'About Paul', href: `/${SLUG}/` }
  ]);

  const timeline = [
    entry('1988', 'It starts: age 13', 'A sponsored teenage mountain biker starts washing cars for pocket money in Surrey. The first car he clearly remembers: an Astra mk2 GTE for an insurance man down the road. Nobody suspects this is the beginning of a 37-year obsession, least of all Paul. He discovers he cannot simply clean a car. He has to make it perfect.'),
    entry('1994', 'Miracle Detail is established', 'What started as pocket money becomes a business. Miracle Detail is founded, operating mobile across London, detailing high profile clientele at their homes and premises. From the very first day, the approach is the same: Paul works alone, every car is treated as if it were his own, and there are no shortcuts.'),
    entry('2005', 'Swissvax: the Crystal Rock Wax collaboration', 'Paul collaborates with Swissvax on Crystal Rock Wax, sold worldwide through Swissvax’s authorised reseller network. The partnership runs until 2022.'),
    entry('2006', 'Fifth Gear, and the £5,000 car wash', 'Paul appears on Fifth Gear to detail a Maserati MC12, one of only 50 ever made. 61 stages. 64 hours. £5,000. The segment is broadcast globally and covered by seven national newspapers. Phone calls come in from across the world for a week. A generation of detailers still cites it as the moment they understood what the craft could become. In the same year, Paul begins installing PPF, making him the UK’s longest-serving active PPF installer.',
      [ph('60', 'Maserati MC12', 'A white and blue Maserati MC12 outside the studio'), ph('1-1', 'Sunday Mirror, 2006', 'Sunday Mirror cutting: “The £5K carwash”')]),
    entry('2006', 'Autocar: the £5,000 car wash', 'Autocar magazine runs a feature on Paul and the £5,000 car wash, shot at Romans International supercar dealership in Fleet, Surrey. The piece asks whether the world’s most expensive car wash is worth it, and answers its own question.'),
    entry('2008', 'MPH: Top Gear Live, London', 'Paul attends MPH at Top Gear Live in London, putting the final polish on a Koenigsegg CCX on the show stand. Even surrounded by cameras and crowds rather than a quiet studio, the standard does not move: every car gets the same attention, wherever it is being prepared.',
      [ph('2-1', 'Koenigsegg CCX', 'A silver Koenigsegg CCX on the show stand'), ph('3-1', 'On the stand', 'Paul polishing the Koenigsegg on the stand'), ph('4-1', 'Final polish', 'Paul giving the Koenigsegg its final polish')]),
    entry('2008', 'The Middle East: a Bugatti and a Ferrari 599', 'Paul travels to the Middle East to detail a Bugatti Veyron and a Ferrari 599 GTB Fiorano, working alongside cars most detailers only ever see in photographs. The standard travels with him: the same studio discipline, a long way from Surrey.',
      [ph('5-1', 'Ferrari 599, Middle East', 'A white Ferrari 599 GTB Fiorano')]),
    entry('2008', 'RTL: German television', 'Paul appears on RTL in Germany, taking the same detailing message to a European audience two years after Fifth Gear.',
      [ph('6-1', 'RTL Germany, 2008', 'Paul being interviewed for RTL in a car park')]),
    entry('2008', 'Japanese television: Broughtons, Pangbourne', 'Paul appears on Japanese television, filmed at Broughtons, the Koenigsegg and Spyker dealer in Pangbourne, near Reading. The detailing message travelling from Surrey to two different continents within months of each other.',
      [ph('7-1', 'Nippon Television, 2008', 'Paul polishing a dark car, with Japanese captions on screen')]),
    entry('2008', 'London Concours, the Burlington', 'Paul prepares a car for the London Concours at the Burlington, one of the early entries in what becomes a 100% win record at UK concours events.',
      [ph('10-1', 'Koenigsegg CCX, London Concours', 'Paul polishing the blue Koenigsegg CCX at the London Concours'), ph('11-1', 'The Burlington, 2008', 'The blue Koenigsegg on the lawn at the Burlington'), ph('12-1', 'Koenigsegg, London Concours, The Burlington', 'Paul working on the Koenigsegg’s windscreen at the concours')]),
    entry('2009', 'A studio at Dunsfold Park: home of Top Gear', 'As the business grew, Paul established his first studio unit at Dunsfold Park in Surrey: the airfield made famous worldwide as the home of Top Gear, and a working test facility where the world’s leading manufacturers push their latest hypercars to the limit. For a detailer whose work was already attracting the finest cars in private ownership, the surroundings were entirely fitting.',
      [ph('13-1', '458 Speciale, Dunsfold', 'A yellow Ferrari 458 Speciale reflected in standing water on the Dunsfold runway')]),
    entry('2009', 'A Ferrari 599, ten thousand miles from Surrey', 'Paul travels to Hong Kong to detail a Ferrari 599 GTB Fiorano for a private client: proof that the call for the right standard of work doesn’t stop at a postcode. The car gets the same treatment it would in Lingfield, just with a longer flight either side of it.',
      [ph('14-1', 'Ferrari 599, Hong Kong', 'A red Ferrari 599 GTB Fiorano in a Hong Kong garage')]),
    entry('2009', '3M Car Care', 'Paul partners with 3M, advising on their car care range: chemistry and product development alongside the detailing work itself.'),
    entry('2010', 'Inside the Koenigsegg factory, Sweden', 'Paul is invited inside the Koenigsegg factory itself, a level of access most detailers never get near. The relationship with the marque runs deeper than a single show stand: hand-built, hand-finished cars deserve a finish to match, and that standard holds whether the work happens in a factory in Sweden or a studio in Surrey.',
      [ph('15-1', 'Factory floor', 'Paul machine polishing a panel on the Koenigsegg factory floor'), ph('16-1', 'Koenigsegg CCX', 'A white Koenigsegg CCX in the factory')]),
    entry('2014', 'First in the UK to use dry ice cleaning', 'Paul introduces dry ice cleaning to his studio, the first detailer in the United Kingdom to do so. While most of the industry was still unaware the technology existed in an automotive context, Paul was already using it on engine bays, underbodies and interiors of some of the rarest cars in private ownership. He has been doing it for over a decade since.',
      [ph('17-1', 'Dry ice cleaning', 'Dry ice cleaning a red Ferrari engine bay')]),
    entry('2015', 'LaFerrari: the GF Williams shoot', 'GF Williams, the car photographer, comes down to Dunsfold Park while Paul is in the middle of a week-long detail on a LaFerrari, there for over a week, getting the shots while the work itself is still going on.',
      [ph('laf', 'LaFerrari, GF Williams', 'A red LaFerrari in the rain under a studio light')]),
    entry('2016', 'Ferrari F40, and a LaFerrari that rivalled Pebble Beach', 'Paul travels to Monaco to detail a Ferrari F40, one of the most iconic and valuable road cars ever made. The work leads to an ongoing relationship with a Monaco-based private client whose LaFerrari, after Paul’s attention, prompts a response that says more than any review could: “My LaFerrari looks better than cars prepared for the Pebble Beach Concours d’Elegance.” The world’s most prestigious automotive show. The highest bar in the industry.',
      [ph('18-1', 'Ferrari F40', 'A red Ferrari F40 in a Monaco garage'), ph('19-1', 'Monaco garage', 'The F40 in the private garage in Monaco'), ph('20-1', 'Final detail', 'Paul giving the F40 its final detail')]),
    entry('2018', 'Motorheads: back on television', 'Paul appears on Motorheads, talking detailing to a national audience over a decade on from Fifth Gear. Different show, same message: the work only counts if it’s done properly, camera or no camera.',
      [ph('22-1', 'On location', 'Paul with the Motorheads presenters on location'), ph('23-1', 'Motorheads studio', 'Paul on the Motorheads studio set')]),
    entry('2019', 'Mercedes 600: £10,000 show car finish', 'A Mercedes 600 (600 EXY) arrives at the studio for a full paint wet-sand and correction, the goal a completely orange-peel-free finish worthy of the concours circuit. £10,000 of work later, the result speaks for itself. The car goes on to be displayed at Mercedes World in Woking, Surrey, and has won every concours show it has since entered.',
      [ph('24-1', 'Mercedes 600, before and after', 'The Mercedes 600 before and after its wet-sand and correction'), ph('27-1', 'Mercedes World, Woking', 'The blue Mercedes 600 on display at Mercedes World'), ph('26-1', 'Flawless finish', 'The light running cleanly along the Mercedes 600’s bodywork'),
       ph('25-1', '600 EXY', 'The Mercedes 600 from the rear'), ph('28-1', 'Mercedes 600, Mercedes World', 'The Mercedes 600 from the front at Mercedes World'), ph('29-1', 'Show-ready', 'The Mercedes 600, show-ready')]),
    entry('2020', 'Portugal: a week on the road', 'Paul drives to Portugal in his purpose-built VW Caddy (engineered specifically for mobile detailing, carrying everything the studio carries) to detail two Ferraris and a Porsche GT3 RS over a week. A Ferrari 599 GTO and an F12 TDF, both brought to the same standard they’d receive in Surrey. The studio discipline taken on tour, this time south.',
      [ph('30-1', 'Ferrari F12 TDF, Portugal', 'A blue Ferrari F12 TDF in Portugal'), ph('31-1', 'Ferrari 599 GTO, Portugal', 'A grey Ferrari 599 GTO in Portugal'), ph('32-1', 'Ferrari F12 TDF, blue', 'The blue F12 TDF in a garage'), ph('33-1', 'Miracle Detail VW Caddy, purpose-built mobile studio', 'The Miracle Detail VW Caddy on a cobbled street in Portugal')]),
    entry('2021', 'Ferrari Monza SP2: Oslo Motor Show', 'Paul takes a Ferrari Monza SP2 to the Oslo Motor Show, a barchetta built in tiny numbers, with no windscreen and nowhere for a mistake to hide. The car gets the full studio treatment before going on display, and is finished again on the stand itself, in front of the crowds it was built to stop.',
      [ph('34-1', 'Monza SP2', 'The Ferrari Monza SP2 in the studio'), ph('35-1', 'Studio detail', 'Paul detailing the Monza SP2 in the studio'), ph('36-1', 'Final polish', 'Paul polishing the Monza SP2'),
       ph('37-1', 'Engine bay', 'Paul working in the Monza SP2’s engine bay'), ph('38-1', 'Engine bay', 'Paul detailing the Monza SP2’s engine bay'), ph('39-1', 'Oslo Motor Show', 'The Monza SP2 on its stand at the Oslo Motor Show')]),
    entry('Concours', 'Every concours car prepared by Paul has won its class', 'Over the years, Paul has prepared cars for UK concours events on multiple occasions. The record is straightforward: every car Paul has ever prepared for a concours event has won its category or won the show. Every single one.',
      [ph('40-1', 'Morgan Aero 8, concours', 'A silver Morgan Aero 8 at a concours')]),
    entry('2023', 'A talk at Glansz, the Netherlands', 'Paul is invited to Glansz detailing studio in the Netherlands to talk about his life as a detailer: 37 years of craft distilled into a room of people who understand exactly how much work sits behind every finish.',
      [ph('41-1', 'Glansz, Netherlands', 'Paul speaking at Glansz in the Netherlands')]),
    entry('2024', 'The Japanese Detailers World Detailing Tour visits HQ', 'A group of Japan’s leading detailers stop at Miracle Detail as part of their World Detailing Tour of the UK: proof that the studio in Lingfield is a destination on a map that stretches a lot further than Surrey.',
      [ph('42-1', 'Japanese Detailers World Tour', 'The Japanese Detailers World Detailing Tour group with Paul at the studio')]),
    entry('2025', 'Global ambassador, and a coating with Paul’s name on it', 'Paul becomes Feynlab’s only global ambassador: not UK ambassador, global. He collaborates with Feynlab’s chemists to develop Ceramic by Paul Dalton, a professional-grade coating sold worldwide through the Feynlab website and used daily by professional detailers across the industry. His name is on the bottle. The coating launches in 2024.',
      [ph('43-1', 'Launch, 2024', 'Paul holding Ceramic by Paul Dalton at its launch'), ph('44-1', 'Ceramic by Paul Dalton', 'A bottle of Ceramic by Paul Dalton')]),
    entry('2026', 'A new studio: 32 years in the making', 'In July 2026, Miracle Detail opens its new purpose-built studio in Lingfield, Surrey. Climate controlled, with a specialist light tunnel, dedicated correction and PPF bays, a dedicated dry ice and industrial underside coating bay, and smart lighting throughout. This is what 32 years of craft looks like when it has the space it deserves.',
      [ph('45-1', 'The new studio, Lingfield', 'A green Lamborghini under the light tunnel in the new studio')])
  ];

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'story',
    title: 'About Paul Dalton | 37 Years of Car Detailing | Miracle Detail',
    description: 'Paul Dalton, founder of Miracle Detail in Lingfield, Surrey: from washing cars at 13 to Fifth Gear, Koenigsegg, Monaco and Feynlab’s only global ambassador. 37 years, more than 10,000 cars.',
    preload: [
      { id: 'ab-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'ab-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero',
      '21-svc-proof',
      '29-svc-nav',
      { block: '33-svc-prose', with: { prose: prose({
        id: 'beginning',
        eyebrow: 'The beginning',
        title: 'It started with an Astra mk2 GTE and <span class="gold">a need for pocket money.</span>',
        img: frame('ab-monza', { alt: 'Paul Dalton beside a Ferrari Monza SP', sizes: '(max-width: 900px) 92vw, 44vw', ratio: '4 / 5' }),
        cap: 'Paul Dalton, Ferrari Monza SP · Andreas Jansson Photography',
        paras: [
          'Paul Dalton was 13 years old. A sponsored mountain biker who needed to earn some cash. The first car he clearly remembers detailing was an Astra mk2 GTE for an insurance man down the road. Nobody knew then, including Paul, that this was the beginning of a 37-year obsession.',
          'He discovered quickly that he couldn’t simply clean a car. He had to make it perfect. That instinct has never left him.',
          'Miracle Detail was founded in 1994. The standard Paul set on day one has never changed. And the clients who found him when he first opened his doors are still with him today.',
          'Thirty-seven years of that same instinct, applied to more than 10,000 cars, adds up to something that can’t be bought or fast-tracked: a working knowledge of how dozens of different manufacturers’ paint systems age, scratch, oxidise and respond to correction, built one panel at a time, not from a textbook.'
        ]
      }) } },
      '40-timeline',
      { block: '42-ab-feature', with: { feat: {
        id: 'fifth-gear',
        eyebrow: 'Fifth Gear, 2006',
        title: 'The £5,000 car wash: <span class="gold">61 stages, 64 hours.</span>',
        img: frame('ab-50', { alt: 'The white and blue Maserati MC12 detailed on Fifth Gear', sizes: '(max-width: 899px) 92vw, 54vw', ratio: '4 / 3' }),
        /* the Sunday Mirror cutting laid over the MC12 (Fender 07/10) */
        press: frame('ab-1-1', { alt: 'Sunday Mirror cutting: “The £5K carwash”', sizes: '(max-width: 899px) 64vw, 26vw' }),
        pressCap: 'Sunday Mirror, 2006',
        cap: 'Maserati MC12 · Fifth Gear · 2006 · One of only 50 ever made',
        figs: [{ n: '61', l: 'Stages' }, { n: '64', l: 'Hours' }, { n: '7', l: 'National newspapers' }],
        paras: [
          'In 2006, Paul appeared on Fifth Gear to detail a Maserati MC12, one of only 50 ever built, properly. 61 stages. 64 hours. £5,000. It gave a television audience their first real look at what obsessive paint correction actually involves: not a wash and wax, but full inspection, correction and protection carried out to a standard most viewers didn’t know existed. The segment was broadcast globally and picked up by seven national newspapers.',
          'The response was immediate and international. Phone calls came in from around the world for a week. Requests from Hong Kong, Monaco, Portugal and the Middle East followed. A generation of detailers, many of whom are now prominent in the industry, point to that segment as the moment they understood what detailing could actually be.'
        ],
        quote: '“A generation of detailers cites this as the moment they understood <span class="gold">what the craft could become.</span>”',
        cite: 'Fifth Gear · 2006 · Broadcast globally'
      } } },
      '24-svc-work',
      { block: '43-ab-list', with: { list: list({
        id: 'credentials',
        eyebrow: 'Background',
        title: 'A few credentials, <span class="gold">for context.</span>',
        items: [
          { n: 'I', name: 'Feynlab’s Only Global Ambassador', sub: 'Worldwide, not just UK', paras: 'Paul is the only detailer in the world to hold Feynlab’s global ambassador status. He collaborated with Feynlab’s chemists to co-develop Ceramic by Paul Dalton, a coating sold worldwide and used daily by professionals across the industry.' },
          { n: 'II', name: 'PPF Since 2006', sub: 'Longest-serving UK PPF installer', paras: 'Paul has been installing Paint Protection Film since 2006, longer than any other active detailer in the United Kingdom. Nearly two decades of experience on everything from daily drivers to Bugattis and Koenigseggs.' },
          { n: 'III', name: 'First UK Dry Ice Detailer', sub: 'Since 2014', paras: 'Paul was the first detailer in the United Kingdom to use dry ice cleaning, in 2014. While the industry was still catching up, Paul had already been using the technology on some of the rarest cars in private ownership for years.' },
          { n: 'IV', name: 'Concours Record', sub: '100% win rate', paras: 'Every car Paul has ever prepared for a UK concours event has won its category. Every single one. Including Bugatti Veyrons and Koenigseggs among the most extraordinary machinery that competes.' },
          { n: 'V', name: '30+ Years: Clients Who Stay', sub: 'Since 1994', paras: 'The clients who found Paul when he first opened his doors in 1994 are still with him today. No advertising. No promotions. A business built entirely on the quality of the work and the trust it creates.' }
        ]
      }) } },
      { block: '44-ab-quotes', with: { q: {
        id: 'quotes',
        img: frame('ab-54', { alt: '', sizes: '100vw', ratio: false }),
        items: [
          { text: '“One detailer. Every car. <span class="gold">No exceptions.</span>”', cite: 'Paul Dalton · Ferrari Monza SP · Photography: Andreas Jansson' },
          { text: '“My LaFerrari looks better than cars prepared for the prestigious <span class="gold">Pebble Beach Concours d’Elegance.</span>”', cite: 'Private Client · Monaco' }
        ]
      } } },
      { block: '43-ab-list', with: { list: list({
        id: 'new', light: true, cards: true,
        eyebrow: 'New to detailing?',
        title: 'Not sure what your car <span class="gold">actually needs?</span>',
        intro: [
          'Most people who contact Paul don’t know exactly what they want: they just know they want their car to look better and be protected. That’s enough. Paul will tell you honestly what the car needs, what he recommends, and what it will cost before any commitment is made.',
          'There’s no pressure, no upselling and no jargon. Just an honest conversation about your car.'
        ],
        items: [
          { n: 'I', name: 'Paint looks dull or hazy' },
          { n: 'II', name: 'Scratches and chips', paras: 'Paul checks with a paint depth gauge before touching the car. Surface scratches polish out. Anything down to bare metal needs repair first, not polish.' },
          { n: 'III', name: 'Want long-term protection', paras: 'Paul’s view: correct the paint properly first, then protect it. A ceramic coating on top of bad paint just seals in whatever was already there.' },
          { n: 'IV', name: 'New car: want to protect it from day one', paras: 'Paul rarely sees a new car arrive in perfect condition: dealer prep and transport leave their mark. He corrects it once, properly, before it’s driven anywhere in anger.' },
          { n: 'V', name: 'Not sure: just ask', paras: 'Tell Paul about the car and what concerns you. He’ll tell you what he sees and what he recommends. No obligation, no pressure.' }
        ]
      }) } },
      { block: '43-ab-list', with: { list: list({
        id: 'price',
        eyebrow: 'On price',
        title: 'Yes, Paul costs more. <span class="gold">Here is exactly why.</span>',
        intro: [
          'Paul doesn’t apologise for his pricing and he doesn’t discount. The work is done to one standard, by one person, with the same instruments and products every time. There are no packages designed to maximise revenue. There is a fair price for work done properly.',
          'Clients who have been with Paul since 1994 have never gone elsewhere. That is the only endorsement that matters.'
        ],
        items: [
          { n: 'I', name: 'One detailer, every job', paras: 'Paul does every job himself. 37 years of experience is applied to your car personally, not delegated to an assistant.' },
          { n: 'II', name: 'Instruments most detailers don’t own', paras: 'A £4,000 gloss and orange peel measurement instrument. A digital microscope. Paint depth gauges. Assessment before anything else.' },
          { n: 'III', name: 'No shortcuts, ever', paras: 'The standard doesn’t change based on the car’s value or the client’s budget. Every car receives the same approach.' },
          { n: 'IV', name: 'Products Paul helped develop', paras: 'Feynlab coatings applied by the person who helped create one of them. The chemistry and the expertise together.' }
        ]
      }) } },
      { block: '24-svc-work', with: {
        workId: 'cars', workTitle: null, workEyebrow: null,
        work: [
          { img: frame('ab-55', { alt: 'A grey Ferrari Monza SP in a dark studio', sizes: '(max-width: 767px) 92vw, 58vw', ratio: '16 / 9' }), cap: 'Ferrari Monza SP', wide: true, half: null, third: null, full: null },
          { img: frame('ab-56', { alt: 'A white Ferrari 599 with a Bugatti Veyron behind it', sizes: '(max-width: 767px) 92vw, 34vw', ratio: '4 / 3' }), cap: 'Ferrari 599 · Bugatti Veyron', wide: null, half: null, third: null, full: null },
          { img: frame('ab-57', { alt: 'A red Ferrari F50 in the studio', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari F50', third: true, wide: null, half: null, full: null },
          { img: frame('ab-58', { alt: 'A yellow Ferrari 458 Speciale outside the studio', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari 458 Speciale', third: true, wide: null, half: null, full: null },
          { img: frame('ab-59', { alt: 'A red Ferrari F40 with polishing kit around it', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Ferrari F40', third: true, wide: null, half: null, full: null }
        ]
      } },
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true,
        h1: 'About Paul Dalton',
        line: '37 years. Not one <span class="gold">shortcut.</span>',
        lede: 'How a teenage mountain biker washing cars for pocket money in Surrey ended up detailing Bugattis, Koenigseggs, and a LaFerrari that out-shone Pebble Beach.',
        img: frame('ab-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Paul Dalton working on a red Ferrari F40 in a private collection in Monaco',
          art: [{ media: '(max-width: 900px)', id: 'ab-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      proofN: 5,
      proof: [
        { n: '37', l: 'Years in the craft' },
        { n: '5', l: 'Bugatti Veyrons' },
        { n: '6', l: 'Koenigseggs' },
        { n: '7', l: 'National newspapers' },
        { n: '4', l: 'TV appearances' }
      ].map(p => Object.assign({ rating: null, tbc: null }, p)),

      snav: [
        { id: 'beginning', label: 'The beginning' },
        { id: 'story', label: 'The full story' },
        { id: 'fifth-gear', label: 'Fifth Gear' },
        { id: 'credentials', label: 'Credentials' },
        { id: 'new', label: 'New to detailing' },
        { id: 'price', label: 'On price' }
      ],

      tl: {
        id: 'story',
        eyebrow: 'The full story',
        title: 'From a Surrey driveway to <span class="gold">Monaco and beyond.</span>',
        items: timeline,
        total: String(timeline.length).padStart(2, '0'),
        /* runs of entries with photos (they share a stage on desktop)
           and runs without (they read across the page) */
        groups: timeline.reduce((gs, t) => {
          const g = gs[gs.length - 1];
          if (g && g.isStage === t.hasPhotos) g.items.push(t);
          else gs.push({ isStage: t.hasPhotos, isNotes: !t.hasPhotos, items: [t] });
          return gs;
        }, []),
        /* the year bar: each year once, linked to its first entry */
        years: timeline.filter((t, i) => timeline.findIndex(u => u.year === t.year) === i)
          .map(t => ({ label: t.year, href: t.id, first: timeline.indexOf(t) }))
      },

      workEyebrow: 'The work itself',
      workTitle: 'What paint correction <span class="gold">actually does.</span>',
      work: [
        { img: frame('ab-51', { alt: 'Swirled paint before correction under an inspection light', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Before correction', third: true },
        { img: frame('ab-52', { alt: 'Swirl marks under an inspection light', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Swirls under inspection light', third: true },
        { img: frame('ab-53', { alt: 'Paul machine polishing a carbon panel by hand', sizes: '(max-width: 767px) 92vw, 30vw', ratio: '4 / 3' }), cap: 'Every panel, by hand', third: true }
      ],

      stars, reviews,
      revsBg: frame('bg-reviews', { alt: '', sizes: '100vw', ratio: false }),

      bookTitle: 'Ready to talk <span class="gold">about your car?</span>',
      bookLede: 'Every conversation starts honestly. Paul will tell you what the car needs and what he recommends, before any commitment is made.',
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'AboutPage',
        name: 'About Paul Dalton',
        mainEntity: { '@type': 'Person', name: 'Paul Dalton', jobTitle: 'Car detailer, founder of Miracle Detail', worksFor: { '@id': site.origin + '/#business' } }
      }
    ]
  };
};
