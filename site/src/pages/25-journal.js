/* ============================================================
   Journal (07/10). Fender: "the journal is really the blog": the old
   site's /blog/ and its two posts, every word and photo as published
   there (miracledetail.co.uk, 7 August 2024). The posts keep their old
   slugs. New words are interface labels only (Read article, All
   articles, More from the Journal). The old posts' star-rating widget
   (a plugin) is not carried over.
   Titles: the old pages' own title case ("Facebook Competition!"), not
   the capitals of their headings.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs } = require('../lib/shared.js');

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

const POSTS = [
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

const cardImg = (p, sizes) => frame(p.img, { alt: p.alt, sizes, ratio: '16 / 9' });

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

    blocks: ['01-header', '20-svc-hero', '60-jn-list', '12-book', '13-footer', '14-sticky'],

    data: {
      crumbs: nav.html,
      hero: {
        stats: true,
        /* phones: where the poster crop is held (08/10) */
        mpos: '50% 40%',
        h1: 'Journal',
        line: 'Our <span class="gold">blog.</span>',
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
        posts: POSTS.map((p, i) => ({
          n: String(i + 1).padStart(2, '0'), href: `/${p.slug}/`, title: p.h1,
          date: p.date, dateText: p.dateText, author: p.author, excerpt: p.excerpt,
          img: cardImg(p, '(max-width: 860px) 92vw, 56vw')
        }))
      },
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [nav.schema, {
      '@context': 'https://schema.org', '@type': 'Blog', name: 'Miracle Detail Journal', url: site.origin + `/${SLUG}/`,
      blogPost: POSTS.map(p => ({ '@type': 'BlogPosting', headline: p.h1, url: site.origin + `/${p.slug}/`, datePublished: p.date }))
    }]
  };

  const posts = POSTS.map((p, i) => {
    const pnav = crumbs([home, jn, { name: p.h1, href: `/${p.slug}/` }]);
    const other = POSTS[(i + 1) % POSTS.length];
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      preload: [{ id: p.img, media: '(min-width: 0px)', sizes: '(max-width: 1320px) 92vw, 1224px' }],

      blocks: ['01-header', '61-post', '12-book', '13-footer', '14-sticky'],

      data: {
        crumbs: pnav.html,
        post: {
          h1: p.h1, sub: p.sub, date: p.date, dateText: p.dateText, author: p.author,
          img: frame(p.img, { alt: p.alt, priority: true, sizes: '(max-width: 1320px) 92vw, 1224px', ratio: '1920 / 1083' }),
          body: p.body(),
          next: {
            href: `/${other.slug}/`, title: other.h1, date: other.date, dateText: other.dateText,
            img: cardImg(other, '(max-width: 767px) 92vw, 40vw')
          }
        },
        formServices: site.picks(),
        heardFrom: site.heardFrom
      },

      schema: [pnav.schema, {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        headline: p.h1, description: p.description, datePublished: p.date,
        image: site.origin + `/assets/img/${p.img}-1920.webp`,
        author: { '@type': 'Person', name: 'Paul Dalton' },
        publisher: { '@type': 'Organization', name: site.name },
        mainEntityOfPage: site.origin + `/${p.slug}/`
      }]
    };
  });

  return [list, ...posts];
};
