/* ============================================================
   Aftercare & washing guide (06/10, v0.5 pages only, PPF rules).

   v0.5 /aftercare-washing-guide/, in its order:
     hero · two paragraphs · the six rules · the eight steps (with
     product links) · products at a glance (8) · Paul's discount code
     · Google reviews · any questions (WhatsApp, email)
   v0.5 slips: the eight steps sit under the correction page's heading
   ("Before a pad is lifted / Five levels. One standard."), so here they
   carry only their bar label; every product button on v0.5 points back
   at the page itself. The step tags jump to the products below; the
   "Buy from" buttons go to each shop's home page until Paul sends the
   product links (REQUESTS.md).
   09/10 (Fender: QA + build the page): the eight steps are a checklist
   to wash by (block 58: tick a step, the count and bar follow, kept on
   this device; phones one row per step, ticking opens the next); its
   heading is new UI copy (v0.5's was the correction page's). Tags jump
   to their product card; Buckets, Grit Guards and the two brushes have
   no card, so they are plain labels. Six rules brief on phones; the
   discount band copies the code; the hero fits one phone screen;
   the reviews sit on a different photo from the hero (they were the
   same water-spray shot).
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { stars, reviews, crumbs, cards } = require('../lib/shared.js');

const SLUG = 'aftercare-washing-guide';
const FEYNLAB = 'https://www.feynlab.co.uk/';
const GT = 'https://www.garagetherapy.co.uk/';
const CS = 'https://www.cleanandshiny.co.uk/';

module.exports = site => {
  const nav = crumbs([
    { name: 'Home', href: '/' },
    { name: 'Aftercare & washing guide', href: `/${SLUG}/` }
  ]);
  /* a tag points at its product's card, or is a plain label */
  const tag = (label, card) => ({ label, href: card ? '#ac-' + card : null });
  const buy = (label, href) => [{ label, href, ext: true }];
  /* block 58's data: every key set (the template engine would borrow a
     missing one from the page) */
  const check = o => Object.assign({ img: null, lede: null }, o, {
    total: o.steps.length,
    steps: o.steps.map(st => ({ num: st.num, name: st.name, text: st.text, links: st.links || null, hasLinks: !!(st.links && st.links.length) }))
  });

  return {
    slug: SLUG,
    /* scroll kit (07/10, PLAN-interactions §3) */
    cluster: 'utility',
    title: 'Ceramic Coating Aftercare & Washing Guide | Miracle Detail',
    description: 'How to wash a Feynlab ceramic-coated car: Paul Dalton’s six rules, eight-step procedure and the exact products he recommends to every client, with a 10% Feynlab discount code.',
    preload: [
      { id: 'ac-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'ac-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: [
      '01-header',
      '20-svc-hero', '29-svc-nav',
      { block: '37-svc-cards', with: { cards: cards({
        id: 'rules', variant: 'points', cols: 3, brief: true,
        eyebrow: 'Why it matters',
        title: 'Before you start. <span class="gold">Never break them.</span>',
        intro: [
          'Feynlab coatings are built to last years, but they’re not maintenance-free. The biggest threat to a ceramic coating isn’t road grime or weather: it’s incorrect washing. Wrong products, wrong technique or washing in direct sunlight can degrade the coating faster than anything the road throws at it.',
          'The guide below is exactly what Paul sends every client after their coating is applied. The products are specifically chosen for Feynlab-coated cars. Use them, follow the procedure, and the coating will continue to perform and look the way it did when it left the studio.'
        ],
        items: [
          { n: 'I', name: 'Never wash in direct sunlight', paras: 'Always wash in the shade or on an overcast day. Sunlight causes shampoo and water to dry on the panel before you can rinse it, leaving marks in the coating that are difficult to remove.' },
          { n: 'II', name: 'Always wash top to bottom', paras: 'Start at the roof and work down. The lower panels carry the most contamination: always clean them last to avoid dragging grit up onto cleaner upper surfaces.' },
          { n: 'III', name: 'Always wash in straight lines', paras: 'Never use circular motions. Straight lines, front to back or top to bottom, prevent swirl marks from being induced in the paint during washing.' },
          { n: 'IV', name: 'Always use the two bucket method', paras: 'One bucket for your shampoo solution, one with clean water to rinse the wash mitt between panels. Grit guards in both buckets. This keeps contamination out of the wash solution and off the paint.' },
          { n: 'V', name: 'Use Feynlab Pure Wash only', paras: 'Only use Feynlab Pure Wash shampoo on a ceramic-coated car. Generic shampoos can strip or dull the coating over time. Pure Wash is pH neutral and formulated specifically for coated surfaces.' },
          { n: 'VI', name: 'Finish with Hybrid Detailer', paras: 'After every wash, apply Feynlab Hybrid Ceramic Detailer to each panel. This tops up the coating with every wash, maintaining the gloss and protection between annual inspections.' }
        ]
      }) } },
      { block: '58-ac-check', with: { check: check({
        id: 'procedure', key: 'aftercare-wash',
        eyebrow: 'The procedure',
        title: 'Eight steps. <span class="gold">Every wash.</span>',
        lede: 'Tick each step off as you go. Your progress stays on this device until you start again.',
        img: frame('ac-bead', { alt: 'Water beading on a coated blue panel', sizes: '(max-width: 767px) 1px, (max-width: 1023px) 44vw, 34vw', ratio: '16 / 10' }),
        steps: [
          { num: '1', name: 'Rinse or snow foam first', text: 'Before the wash mitt touches the car, rinse the vehicle thoroughly with a pressure washer or apply snow foam to loosen surface contamination. Never put a dry mitt on a dry car: even small particles of dust can scratch the paint.' },
          { num: '2', name: 'Set up your two buckets', text: 'Fill one bucket with warm water and Feynlab Pure Wash shampoo. Fill a second bucket with clean water for rinsing the wash pad between panels. Put a grit guard in the bottom of each bucket. The grit guard traps contamination at the bottom so it doesn’t transfer back to the mitt.',
            links: [tag('Feynlab Pure Wash', 'pure-wash'), tag('Buckets'), tag('Grit Guards')] },
          { num: '3', name: 'Wash one section at a time, top to bottom', text: 'Work in sections: roof and windscreen first, then upper panels, then lower panels and sills, leaving the wheel arches and lower bumpers to last. After each section, rinse the wash pad thoroughly in the clean water bucket before returning it to the shampoo solution. Always wash in straight lines. Never circular motions.',
            links: [tag('GT Wash Pad', 'wash-pad')] },
          { num: '4', name: 'Clean the wheels', text: 'Wheels carry the heaviest contamination: brake dust, road tar and grime. Use Feynlab Tyre and Wheel Cleaner with a dedicated wheel brush for the face of the wheel and an EZ Detail brush for the inside of the barrel. Never use the same mitt on the wheels that you use on the paint.',
            links: [tag('Wheel Cleaner', 'wheel-cleaner'), tag('Wheel Brush'), tag('Barrel Brush')] },
          { num: '5', name: 'Rinse the whole car thoroughly', text: 'Once the full car and wheels are washed, rinse everything thoroughly: roof to sills, wheels and arches. Make sure all shampoo residue is removed before drying begins.' },
          { num: '6', name: 'Dry with a quality drying towel', text: 'Use the Rag Company Liquid8r twisted loop microfibre drying towel: it’s the one Paul uses and recommends. Work panel by panel, top to bottom. Once the main panels are dry, blow out all the crevices, door shuts, mirror housings and badges with a forced air dryer to prevent water marks appearing after the car is put away.',
            links: [tag('Drying Towel', 'drying-towel'), tag('Air Dryer', 'air-dryer')] },
          { num: '7', name: 'Apply Feynlab Hybrid Ceramic Detailer', text: 'This is the step most people skip, and it’s the most important one for maintaining the coating long term. Shake the bottle well for a full minute before use. Spray one or two sprays onto each panel and buff with an Edgeless 365 microfibre. Work panel by panel. The Hybrid Detailer adds a fresh layer of ceramic protection with every wash, keeping the gloss deep and the water beading sharp.',
            links: [tag('Hybrid Detailer', 'hybrid'), tag('Edgeless 365 Microfibre', 'edgeless')] },
          { num: '8', name: 'Tyre dressing: Feynlab Black Velvet', text: 'For the finishing touch, apply Feynlab Black Velvet Tyre Sealant using a microfibre applicator. Wear rubber gloves: it can be messy on your hands. Black Velvet gives a deep, satin tyre finish and seals the rubber for lasting protection and appearance.',
            links: [tag('Black Velvet Tyre Sealant', 'black-velvet')] }
        ]
      }) } },
      { block: '37-svc-cards', with: { cards: cards({
        id: 'products', light: true, cols: 4, acc: true,
        eyebrow: 'Products at a glance',
        title: 'Everything you need. <span class="gold">Nothing you don’t.</span>',
        items: [
          { kicker: 'Shampoo', anchor: 'ac-pure-wash', name: 'Feynlab Pure Wash', paras: 'pH neutral shampoo formulated specifically for ceramic-coated vehicles. The only shampoo Paul recommends on a Feynlab-coated car.', links: buy('Buy from Feynlab', FEYNLAB) },
          { kicker: 'Maintenance Detailer', anchor: 'ac-hybrid', name: 'Feynlab Hybrid Ceramic Detailer', paras: 'Tops up the coating with every wash. Shake for one minute before use: this is not optional. One to two sprays per panel, buff with a quality microfibre.', links: buy('Buy from Feynlab', FEYNLAB) },
          { kicker: 'Wheel &amp; Tyre', anchor: 'ac-wheel-cleaner', name: 'Feynlab Tyre &amp; Wheel Cleaner', paras: 'Safe on all wheel finishes including diamond cut and powder coat. Effective on brake dust and road contamination without aggressive acids.', links: buy('Buy from Feynlab', FEYNLAB) },
          { kicker: 'Tyre Dressing', anchor: 'ac-black-velvet', name: 'Feynlab Black Velvet Tyre Sealant', paras: 'Deep satin finish and lasting tyre protection. Apply with a microfibre applicator. Wear gloves: it stains hands. Worth every bit of the effort.', links: buy('Buy from Feynlab', FEYNLAB) },
          { kicker: 'Wash Pad', anchor: 'ac-wash-pad', name: 'GT Wash Pad', paras: 'The wash pad Paul uses. Soft enough for coated paint, structured enough to hold shampoo solution and release contamination safely into the rinse bucket.', links: buy('Buy from Garage Therapy', GT) },
          { kicker: 'Drying', anchor: 'ac-drying-towel', name: 'Rag Company Liquid8r Drying Towel', paras: 'Paul’s recommended drying towel. Twisted loop construction absorbs water fast without dragging on the surface. Use with an air dryer for perfect results.', links: buy('Buy from Clean & Shiny', CS) },
          { kicker: 'Air Dryer', anchor: 'ac-air-dryer', name: 'Rokit R1 Forced Air Dryer', paras: 'Essential for blowing water out of door shuts, badges, mirrors and crevices after washing. Prevents the water marks that appear hours after a wash.', links: buy('Buy from Clean & Shiny', CS) },
          { kicker: 'Microfibre', anchor: 'ac-edgeless', name: 'Rag Company Edgeless 365', paras: 'The microfibre Paul uses to apply and buff the Hybrid Detailer. Premium edgeless construction: no risk of scratching from hard edges. One side to apply, one side to buff.', links: buy('Buy from Clean & Shiny', CS) }
        ]
      }) } },
      '39-svc-price',
      '10-reviews',
      '12-book',
      '13-footer', '14-sticky'
    ],

    data: {
      crumbs: nav.html,

      hero: {
        stats: true, fit: true,
        /* phones: where the poster crop is held (08/10) */
        mpos: '40% 50%',
        h1: 'Aftercare & Washing Guide',
        line: 'Look after your <span class="gold">coating properly.</span>',
        lede: 'Your Feynlab coating is designed to last years, but how you wash the car matters. This is the exact procedure and the exact products Paul recommends to every client after a ceramic coating. Follow it and the coating will perform the way it should.',
        img: frame('ac-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Water beading and running off the coated paint of a red supercar',
          art: [{ media: '(max-width: 900px)', id: 'ac-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },

      snav: [
        { id: 'rules', label: 'The six rules' },
        { id: 'procedure', label: 'The procedure' },
        { id: 'products', label: 'Products' },
        { id: 'code', label: 'Discount code' }
      ],

      band: {
        id: 'code', nobtn: true,
        k: 'Use Paul’s discount code for 10% off all Feynlab products at the Feynlab online store',
        amount: 'MIRACLE', copy: 'MIRACLE',
        note: 'Enter at checkout at <a class="gold" href="https://www.feynlab.co.uk/" target="_blank" rel="noopener">feynlab.co.uk</a>'
      },

      stars, reviews,
      revsBg: frame('ac-revs', { alt: '', sizes: '100vw', ratio: false }),

      bookTitle: 'Any questions? <span class="gold">Just ask Paul.</span>',
      bookLede: 'If you’re unsure about anything (the procedure, the products, or how your coating is performing) get in touch directly. Paul is happy to advise.',
      bookEmail: true,
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [
      nav.schema,
      {
        '@context': 'https://schema.org', '@type': 'HowTo',
        name: 'How to wash a Feynlab ceramic-coated car',
        step: ['Rinse or snow foam first', 'Set up your two buckets', 'Wash one section at a time, top to bottom', 'Clean the wheels', 'Rinse the whole car thoroughly', 'Dry with a quality drying towel', 'Apply Feynlab Hybrid Ceramic Detailer', 'Tyre dressing: Feynlab Black Velvet']
          .map((name, i) => ({ '@type': 'HowToStep', position: i + 1, name }))
      }
    ]
  };
};
