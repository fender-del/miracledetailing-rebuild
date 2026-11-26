/* ============================================================
   Journal (07/10). Fender: "the journal is really the blog": the old
   site's /blog/ and its two posts, every word and photo as published
   there (miracledetail.co.uk, 7 August 2024). The posts keep their old
   slugs. New words are interface labels only (Read article, All
   articles, More from the Journal). The old posts' star-rating widget
   (a plugin) is not carried over.
   27/10: a third post, Paul's own "Why matte and satin paint absolutely
   needs PPF" (miracledetail-blog-matte-ppf.html): his words as written
   (em dashes → commas), the photo slots filled with his Drive photos of
   the Jaguar in the studio. A post may carry name (plain title), read
   (reading time), cta and related.
   Titles: the old pages' own title case ("Facebook Competition!"), not
   the capitals of their headings.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs } = require('../lib/shared.js');
const images = require('../lib/images.json');
/* the largest webp an image id was built at (the matte post's photos stop at 1448) */
const big = id => `/assets/img/${id}-${Math.max(...images[id].widths)}.webp`;

const SLUG = 'journal';
const ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" stroke-width="1.8"/></svg>';
const ext = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

/* the same five shop links close both posts */
const buy = () => '<ul class="post__buy" role="list">' + [
  ['https://www.feynlab.co.uk/product/feynlab-ceramic-by-paul-dalton', 'Available to buy in UK'],
  ['https://eu.feynlab.com/product/feynlab-ceramic-by-paul-dalton', 'Available to buy in Europe'],
  ['https://feynlab.dk/product/ceramic-by-paul-dalton/', 'Available in buy in Denmark and Sweden'],
  ['https://www.feynlab.com/product/feynlab-ceramic-by-paul-dalton', 'Available to buy in USA'],
  ['https://au.feynlab.com/product/feynlab-ceramic-by-paul-dalton', 'Available to buy in Australia']
].map(([h, t]) => `<li><a href="${h}" target="_blank" rel="noopener"><span>${t}</span>${ARROW}</a></li>`).join('') + '</ul>';

/* both posts embed the same film */
const YT = { id: 'f3v_am1UsVc', title: 'NEW PRODUCT LAUNCH - Feynlab CERAMIC by Paul Dalton' };
const video = () => `<div class="post__video"><a class="yt" href="https://www.youtube.com/watch?v=${YT.id}" target="_blank" rel="noopener" data-yt="${YT.id}" data-yt-title="${YT.title}" aria-label="Play video: ${YT.title}">`
  + frame('jn-yt', { alt: '', sizes: '(max-width: 767px) 92vw, 68ch', ratio: '16 / 9' })
  + '<span class="yt__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15L19.5 12 7 4.5Z"/></svg></span></a></div>';


/* a photo in a post: the same curtain as the cards, caption under it */
const fig = (id, alt, sizes, ratio, cap) => '<figure class="post__fig" data-reveal="card">'
  + frame(id, { alt, sizes, ratio }) + (cap ? `<figcaption>${cap}</figcaption>` : '') + '</figure>';
const SZ = '(max-width: 767px) 92vw, 68ch';
const SZ2 = '(max-width: 767px) 92vw, 34ch';

const POSTS = [
  {
    slug: 'why-matte-and-satin-paint-needs-ppf',
    h1: 'Why Matte and Satin Paint Need <span class="gold it">Paint Protection Film (PPF)</span>',
    name: 'Why matte and satin paint absolutely needs PPF',
    title: 'Why Matte and Satin Paint Absolutely Needs PPF | Journal | Miracle Detail',
    description: 'One stone chip on a matte or satin finish car can mean a full panel repaint, or worse, the entire side of the car. Paul Dalton explains why PPF isn’t optional on these finishes.',
    date: '2026-06-01', dateText: 'June 2026', author: 'Paul Dalton', read: '5 min read',
    excerpt: 'One stone chip on a gloss car is an inconvenience. One stone chip on a matte or satin finish is a potential four-figure repair bill. Here’s why PPF on these finishes isn’t a luxury…',
    img: 'jn-matte',
    alt: 'A matte grey Jaguar I-Pace in the Miracle Detail studio',
    sub: null,
    cta: {
      title: 'Protect your matte finish <span class="gold it">before it’s too late.</span>',
      text: 'Paul has been installing PPF since 2006, longer than any other active UK detailer. Every installation is done personally, to a standard that doesn’t change regardless of the car.',
      href: '#book', label: 'Book a PPF Consultation'
    },
    related: [
      { name: 'Paint Protection Film', href: '/paint-protection-film-ppf/' },
      { name: 'Paint Correction', href: '/paint-correction-and-polishing/' },
      { name: 'Ceramic Coatings', href: '/ceramic-coatings/' },
      { name: 'Detailing Packages', href: '/car-detailing-studio/' }
    ],
    body: () => [
      '<p class="post__lede">One stone chip on a gloss car is an inconvenience. One stone chip on a matte or satin finish is a potential four-figure repair bill, and it can happen on the way home from the dealer. Here’s why PPF on these finishes isn’t a luxury. It’s the only sensible choice.</p>',

      '<h2 data-reveal>The problem with <span class="gold it">matte and satin paint.</span></h2>',
      '<p>Matte and satin finishes have become increasingly popular over the last decade, and for good reason. The depth and character of a flat or semi-flat finish on the right car is genuinely stunning. Manufacturers have responded, factory matte options are now available across everything from BMW M cars to Rolls-Royces, and bespoke satin wraps have never been more common.</p>',
      '<p>But there’s a fundamental problem with these finishes that most owners don’t fully understand until it’s too late: <strong>they cannot be repaired in the conventional sense.</strong></p>',
      '<p>On a standard gloss car, a stone chip or light scratch can often be addressed with a careful touch-in and polish. It’s not always invisible, but in most cases it’s manageable. The clear coat on a gloss finish allows for localised correction (blending, polishing, cutting) that makes small damage far less catastrophic than it would otherwise be.</p>',
      '<p>On a matte or satin finish, none of that is possible. The flat sheen that makes these cars so visually distinctive comes from a microscopic surface texture in the clear coat, and that texture cannot be replicated with touch-in paint or localised repair. The moment you try, the repaired area reflects light differently to the surrounding finish. It’s immediately visible.</p>',
      '<blockquote class="post__quote post__quote--pull" data-reveal><p><span class="it">“One stone chip on a matte finish isn’t just a chip. It’s a panel respray. And if that panel is a wing, the colour and sheen spread means you’re often looking at the entire side of the car.”</span></p></blockquote>',

      '<h2 data-reveal>What actually happens <span class="gold it">when a chip occurs.</span></h2>',
      '<p>Paul has seen this scenario play out many times. A client takes delivery of a new car in a beautiful factory satin finish. Within weeks, sometimes days, a stone chip appears on the bonnet or a wing. They call the dealer, expecting a straightforward repair. The dealer confirms what Paul already knows: the panel needs repainting.</p>',
      '<p>But repainting a single panel on a matte or satin car is rarely the end of it. Matching a flat finish across panel gaps is extraordinarily difficult. The adjacent panels, sprayed at the factory under controlled conditions with the same batch of paint, will almost certainly not match a freshly sprayed repair panel exactly. The light catches them differently. The texture differs slightly.</p>',
      '<p>This means that what started as a single stone chip on a wing can result in the entire side of the car (front wing, front door, rear door, rear quarter) needing to be resprayed to achieve a consistent finish. On a prestige or performance car, that repair bill can easily reach £5,000 to £10,000 or more.</p>',
      '<div class="post__duo">'
        + fig('jn-matte-wing', 'Paint protection film being squeegeed over the front wing of a Jaguar, past the side vent', SZ2, '1086 / 1448', 'Film going over the wing')
        + fig('jn-matte-mirror', 'Clear paint protection film wrapped around the door mirror of a Jaguar before it is trimmed', SZ2, '1086 / 1448', 'Around the door mirror')
        + '</div>',

      '<h2 data-reveal>PPF is the <span class="gold it">only answer.</span></h2>',
      '<p>Paint Protection Film applied to a matte or satin finish car does two things simultaneously. First, it absorbs stone chips, road debris, abrasion and environmental contamination before any of it reaches the paint beneath. Second, and this is what most people don’t realise, modern matte PPF films are virtually indistinguishable from the factory finish beneath them.</p>',
      '<p>XPEL Stealth, for example, the film Paul uses on matte and satin cars, is specifically engineered to replicate the optical properties of a flat finish. Applied correctly, by someone with the experience to handle it properly, you would not know it was there. The protection is invisible. The finish is preserved.</p>',
      '<p>And if the film itself is ever damaged, by a stone chip or a scrape, you replace the film, not the paint. That panel section of film costs a fraction of a respray. The paint beneath is untouched.</p>',
      /* 04/11 (requests 03/11 #7): Paul's own matte blue Ioniq 5 N */
      fig('jn-matte-ioniq', 'A matte blue Hyundai Ioniq 5 N in the Miracle Detail studio under the hexagon lights', SZ, '1320 / 950', 'Paul’s matte blue Ioniq 5 N'),

      '<h2 data-reveal>The importance of <span class="gold it">correct installation.</span></h2>',
      '<p>Matte PPF is significantly more demanding to install than gloss film. The surface tension of the film, the stretching required around complex curves, and the precision needed at panel edges is all more critical, because any imperfection is more visible on a flat finish than it would be on a gloss car where reflections mask minor flaws.</p>',
      '<p>Paul has been installing PPF since 2006, longer than any other active detailer in the United Kingdom. The Jaguar I-Pace currently in the studio is a case in point: a full-car matte installation that requires every panel to be handled with the same level of precision as a concours preparation. There is no margin for error on a finish this unforgiving.</p>',
      fig('jn-matte-done', 'A matte Cupra head-on in the Miracle Detail studio under the hexagon lights', SZ, '1254 / 940', 'In the studio'),

      '<h2 data-reveal>If you own a matte or satin car, <span class="gold it">act before it happens.</span></h2>',
      '<p>The conversation Paul has most often with matte car owners is the one that happens after the first chip. By that point, the options are limited and expensive. The conversation worth having is the one before delivery, or as early as possible after it.</p>',
      '<p>A full-front PPF installation on a matte car starts from £1,500 + VAT. A full-car installation starts from £4,000 + VAT. Neither figure is insignificant, but set against the cost of a single side respray on a prestige car, it is not a difficult calculation to make.</p>',
      '<p>If you’re considering PPF on a matte or satin vehicle, or want an honest conversation about what the right level of coverage is for the way you use the car, get in touch. Paul will tell you exactly what he’d recommend, and if a lower level of coverage achieves what you need, that’s what he’ll say.</p>'
    ].join('\n')
  },
  {
    slug: 'facebook-competition',
    h1: 'Facebook Competition!',
    title: 'Facebook Competition! | Journal | Miracle Detail',
    description: 'WIN a bottle of Feynlab Ceramic by Paul Dalton and also a promotional t-shirt!',
    date: '2024-08-07', dateText: '7 August 2024', author: 'Paul',
    excerpt: 'Win a bottle of Feynlab Ceramic by Paul Dalton and a promotional t-shirt. Read more to find out how to enter…',
    img: 'jn-fb',
    alt: 'For your chance to WIN a bottle of Feynlab Ceramic by Paul Dalton and also a promotional T-Shirt. Please answer the following questions on our Facebook page.',
    sub: 'Win a bottle of Feynlab Ceramic by Paul Dalton and a promotional t-shirt',
    body: () => [
      '<p>Enter our Facebook competition for your chance to WIN a bottle of Feynlab Ceramic by Paul Dalton and a promotional t-shirt. Please answer the following questions on our Facebook page.</p>',
      '<p class="post__ask">What is the current mileage on Paul’s VW caddy van?</p>',
      `<p>Remember that sharing is caring. Let your friends have a chance of entering, don’t be mean! If you want to LIKE the ${ext('https://www.facebook.com/PaulDaltonsmiracledetail/', 'Miracle Detail Facebook page')} and the ${ext('https://www.facebook.com/FeynlabUK', 'Feynlab UK and Europe page')} to keep up to date with what we do, please go ahead.</p>`,
      '<p class="post__terms"><strong>Terms &amp; Conditions:</strong> Only open to UK residents, over 18 years old. Closing date is midnight on Wednesday 11th September 2024. One winner will be selected by Miracle Detail and will be notified by Friday 13th September 2024. No purchase necessary. Prizes are non-exchangeable, non-refundable or negotiable. Employees of Miracle detail, and any agencies connected with the competition and their families are not eligible to enter. The competition is in no way sponsored, endorsed or administered by or associated with Facebook. By entering this competition, an entrant is indicating his/her agreement to be bound by these terms and conditions. The winner agrees to the use of his/her name and images in any publicity material. Any personal data relating to the winner or any other entrants will be used solely in accordance with current UK data protection legislation and will not be disclosed to a third party without the entrant’s prior consent. NOTE: Closest mileage will be will be the figure closest ‘up to’. For example if the mileage was 10,000 miles and there were guesses at 9,000 and 11,000 then 9000 will win.</p>',
      '<h3>Click on the following links to buy Feynlab Ceramic by Paul Dalton:</h3>',
      buy(),
      video()
    ].join('\n')
  },
  {
    slug: 'new-product-launch',
    h1: 'New Product Launch!',
    title: 'New Product Launch! Feynlab Ceramic by Paul Dalton | Journal | Miracle Detail',
    description: 'Feynlab and Miracle Detail have been working closely to develop a very special coating that brings a professional grade ceramic coating to enthusiasts and professionals alike',
    date: '2024-08-07', dateText: '7 August 2024', author: 'Paul',
    excerpt: 'For the last few months, Feynlab and I have been working closely to develop a very special coating that brings a professional grade ceramic coating to enthusiasts and professionals alike…',
    img: 'jn-npl',
    alt: 'Feynlab CERAMIC by Paul Dalton - professional grade ceramic coating available to purchase',
    sub: null,
    body: () => [
      '<div class="post__intro">',
      '<h2>NEW PRODUCT LAUNCH: Feynlab CERAMIC by Paul Dalton</h2>',
      '<p>For the last few months, Feynlab and I have been working closely to develop a very special coating that brings a professional grade ceramic coating to enthusiasts and professionals alike with its easy-to-apply formula, great slickness, superb water beading, as well as 3 years durability.</p>',
      '<p>YES, you read that right, this product is PROFESSIONAL strength and quality, modified so a DiYer can use it AND therefore you can get up to 3 years of protection, with a product you can apply yourself!</p>',
      '<figure class="post__bottle">' + frame('jn-bottle', { alt: 'Feynlab CERAMIC by Paul Dalton - ceramic coating treatment for your car', sizes: '(max-width: 767px) 60vw, 240px', ratio: '1 / 1' }) + '</figure>',
      '</div>',
      '<h3>Words from Feynlab:</h3>',
      '<blockquote class="post__quote">',
      '<p>“Paul is considered by many to be the OG of detailing and was instrumental in bringing it to the masses in the early 2000’s with TV and Media exposure and the ‘£5000 car wash’. Paul has previously travelled worldwide for clients requesting his services, working on Supercars and Hypercars alike for high-profile clientele.</p>',
      '<p>On a personal note, it has been a pleasure to work on this with you, Paul, and after all the alterations, we have a product that truly reflects what we set out to achieve. You’ve been a hard taskmaster 😊”</p>',
      '</blockquote>',
      '<h3>Click on the following links to buy:</h3>',
      buy(),
      video()
    ].join('\n')
  }
];

/* ---------- Posts written in the DMI CMS (18/11) ----------
   content/posts.json is a list: { title, slug, date (YYYY-MM-DD), author,
   excerpt, cover: { src, alt }, body, hidden, seo: { title, description,
   ogImage, noindex } }. Paul writes them in the CMS; the three posts above
   stay in code (their bodies carry hand-built photos, film and shop links).
   A CMS post lives at /journal/<slug>/, so it can never take a page's
   address. body is the CMS's small Markdown (lib/rich.js): its ## headings
   get the house reveal, and *italic* in a heading becomes the gold italic.
   cover.src: an image id from images.json (sharp sizes, blur-up) or a
   path/URL used as it is (until uploads land in R2). No cover: the
   journal's own studio photo. Hidden posts and posts with a bad slug or
   date are left out with a warning, so one slip can't stop the build. */
const fs = require('fs');
const path = require('path');
const { esc } = require('../lib/render.js');
const { renderRich } = require('../lib/rich.js');
const CMS_POSTS = path.join(__dirname, '../../content/posts.json');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = d => { const [y, m, day] = d.split('-').map(Number); return `${day} ${MONTHS[m - 1]} ${y}`; };
const realDate = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d + 'T00:00:00Z')) && new Date(d + 'T00:00:00Z').toISOString().slice(0, 10) === d;
/* photos (26/11): Paul's photos between paragraphs come from the CMS library
   (R2, MEDIA_URL) and use the photo-post figure style (.post__fig) */
const { MEDIA_URL } = require('../lib/media.js');
const postBody = md => renderRich(md || '', { photos: true, mediaUrl: MEDIA_URL, sizes: '(max-width: 767px) 92vw, 68ch' })
  .replace(/<h2>(.*?)<\/h2>/g, (_, h) => `<h2 data-reveal>${h.replace(/<em>(.*?)<\/em>/g, '<span class="gold it">$1</span>')}</h2>`)
  .replace(/<blockquote>/g, '<blockquote class="post__quote" data-reveal>')
  .replace(/<figure>/g, '<figure class="post__fig" data-reveal="card">');

function cmsPosts() {
  if (!fs.existsSync(CMS_POSTS)) return [];
  const taken = new Set(POSTS.map(p => p.slug));
  const out = [];
  for (const p of JSON.parse(fs.readFileSync(CMS_POSTS, 'utf8'))) {
    if (!p || p.hidden) continue;
    const slug = typeof p.slug === 'string' ? p.slug.trim() : '';
    const why = !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ? `bad slug '${slug}'`
      : !String(p.title || '').trim() ? 'no title'
      : !realDate(p.date) ? `bad date '${p.date}'`
      : taken.has(`journal/${slug}`) ? `slug '${slug}' used twice` : '';
    if (why) { console.warn(`journal: CMS post left out (${why})`); continue; }
    taken.add(`journal/${slug}`);
    const seo = p.seo || {};
    const title = String(p.title).trim();
    const cover = p.cover && String(p.cover.src || '').trim();
    out.push({
      slug: `journal/${slug}`, cms: true,
      h1: esc(title), name: esc(title), plain: title,
      title: (seo.title || '').trim() || `${title} | Journal | Miracle Detail`,
      description: (seo.description || '').trim() || String(p.excerpt || '').trim() || `${title}, from the Miracle Detail journal by Paul Dalton.`,
      noindex: seo.noindex === true,
      ogImage: seo.ogImage && String(seo.ogImage.src || '').trim() || null,
      date: p.date, dateText: longDate(p.date), author: String(p.author || '').trim() || 'Paul Dalton',
      excerpt: esc(String(p.excerpt || '').trim()),
      img: cover || 'jn-hero',
      alt: String(p.cover && p.cover.alt || '').trim() || title,
      sub: null,
      body: () => postBody(p.body)
    });
  }
  return out;
}

/* every post, newest first (the order the code posts were already in) */
const ALL = [...POSTS, ...cmsPosts()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

/* a post's photo: a built image id, or a CMS path/URL shown as it is */
const media = (p, o) => (images[p.img]
  ? frame(p.img, o)
  : `<div class="media" style="aspect-ratio:${o.ratio || '16 / 9'}"><img src="${esc(p.img)}" alt="${esc(o.alt || '')}"${o.priority ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}></div>`);
const absImg = p => (images[p.img] ? big(p.img) : p.img);

const cardImg = (p, sizes) => media(p, { alt: p.alt, sizes, ratio: '16 / 9' });

module.exports = site => {
  const home = { name: 'Home', href: '/' };
  const jn = { name: 'Journal', href: `/${SLUG}/` };
  const nav = crumbs([home, jn]);

  const list = {
    slug: SLUG,
    title: 'Journal | Car Detailing Blog | Miracle Detail',
    description: 'Take a look through our latest blogs to learn about the wide range of vehicle detailing, paint correction, PPF and ceramic coating services offered at Miracle Detail.',
    preload: [
      { id: 'jn-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'jn-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: ['01-header', '20-svc-hero', '60-jn-list', '64-insta', '12-book', '13-footer', '14-sticky'],

    data: {
      crumbs: nav.html,
      hero: {
        stats: true,
        /* phones: where the poster crop is held (08/10) */
        mpos: '50% 40%',
        h1: 'Car Detailing Journal',
        line: 'Our <span class="gold it">blog.</span>',
        lede: 'Take a look through our latest blogs to learn about the wide range of vehicle detailing, paint correction, PPF and ceramic coating services offered at Miracle Detail.',
        img: frame('jn-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Inside the Miracle Detail studio',
          art: [{ media: '(max-width: 900px)', id: 'jn-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },
      jn: {
        eyebrow: 'Latest articles',
        posts: ALL.map((p, i) => ({
          n: String(i + 1).padStart(2, '0'), href: `/${p.slug}/`, title: p.name || p.h1,
          date: p.date, dateText: p.dateText, author: p.author, excerpt: p.excerpt,
          img: cardImg(p, '(max-width: 860px) 92vw, 56vw')
        }))
      },
      /* Paul 23/10 (board note 207): "Is your car?" gold and italic */
      bookTitle: 'The studio is ready.<br> <span class="gold it">Is your car?</span>',
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [nav.schema, {
      '@context': 'https://schema.org', '@type': 'Blog', name: 'Miracle Detail Journal', url: site.origin + `/${SLUG}/`,
      blogPost: ALL.filter(p => !p.noindex).map(p => ({ '@type': 'BlogPosting', headline: p.plain || p.name || p.h1, url: site.origin + `/${p.slug}/`, datePublished: p.date }))
    }]
  };

  const posts = ALL.map((p, i) => {
    const pnav = crumbs([home, jn, { name: p.name || p.h1, href: `/${p.slug}/` }]);
    const other = ALL[(i + 1) % ALL.length];
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      /* CMS posts: their SEO comes from posts.json, not content/pages (build.js, tools/cms-pages.js skip them) */
      ...(p.cms ? { cmsPost: true, noindex: p.noindex, ...(p.ogImage ? { ogImage: p.ogImage } : {}) } : {}),
      preload: images[p.img] ? [{ id: p.img, media: '(min-width: 0px)', sizes: '(max-width: 1320px) 92vw, 1224px' }] : undefined,

      blocks: ['01-header', '61-post', '12-book', '13-footer', '14-sticky'],

      data: {
        crumbs: pnav.html,
        post: {
          h1: p.h1, sub: p.sub, date: p.date, dateText: p.dateText, author: p.author, read: p.read || null, cta: p.cta || null, related: p.related ? { links: p.related } : null,
          img: media(p, { alt: p.alt, priority: true, sizes: '(max-width: 1320px) 92vw, 1224px', ratio: '1920 / 1083' }),
          body: p.body(),
          next: {
            href: `/${other.slug}/`, title: other.name || other.h1, date: other.date, dateText: other.dateText,
            img: cardImg(other, '(max-width: 767px) 92vw, 40vw')
          }
        },
        formServices: site.picks(),
        heardFrom: site.heardFrom
      },

      schema: [pnav.schema, {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        headline: p.plain || p.name || p.h1, description: p.description, datePublished: p.date,
        image: /^https?:/.test(absImg(p)) ? absImg(p) : site.origin + absImg(p),
        author: { '@type': 'Person', name: 'Paul Dalton' },
        publisher: { '@type': 'Organization', name: site.name },
        mainEntityOfPage: site.origin + `/${p.slug}/`
      }]
    };
  });

  return [list, ...posts];
};
