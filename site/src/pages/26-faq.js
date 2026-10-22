/* ============================================================
   FAQ (22/10). Paul's own page of 39 questions in nine groups
   (miracledetail-faqs.html), words as he wrote them; only the long
   dashes are gone and links point at this site (contact = the booking
   form, aftercare = the guide). Old slug /car-detail-faqs/ (it was a
   301 to Packages until now). Data: lib/faqs.json, block 62.
   ============================================================ */
'use strict';
const { frame } = require('../lib/pic.js');
const { crumbs } = require('../lib/shared.js');
const SECTIONS = require('../lib/faqs.json');

const SLUG = 'car-detail-faqs';
const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

module.exports = site => {
  const nav = crumbs([{ name: 'Home', href: '/' }, { name: 'FAQs', href: `/${SLUG}/` }]);
  return {
    slug: SLUG,
    title: 'Car Detailing FAQs | Paul Dalton | Miracle Detail, Surrey',
    description: 'Questions about booking, paint correction, ceramic coating, PPF, dry ice, pricing and aftercare, answered by Paul Dalton of Miracle Detail, Lingfield, Surrey.',
    preload: [
      { id: 'jn-hero-m', media: '(max-width: 900px)', sizes: '100vw' },
      { id: 'jn-hero', media: '(min-width: 901px)', sizes: '100vw' }
    ],

    blocks: ['01-header', '20-svc-hero', '62-faq', '12-book', '13-footer', '14-sticky'],

    data: {
      crumbs: nav.html,
      hero: {
        stats: true,
        mpos: '50% 40%',
        h1: 'Frequently Asked Questions',
        line: 'Questions. <span class="gold">Answered honestly.</span>',
        lede: 'If something isn\'t covered here, call or message Paul directly. Every enquiry is answered personally: there\'s no queue, no chatbot, no contact form that disappears into a void.',
        img: frame('jn-hero', {
          priority: true, ratio: false, sizes: '100vw',
          alt: 'Inside the Miracle Detail studio',
          art: [{ media: '(max-width: 900px)', id: 'jn-hero-m', sizes: '100vw' }]
        }),
        facts: []
      },
      fq: {
        eyebrow: 'Nine topics',
        title: 'Things people <span class="gold">ask Paul.</span>',
        sections: SECTIONS
      },
      formServices: site.picks(),
      heardFrom: site.heardFrom
    },

    schema: [nav.schema, {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: SECTIONS.flatMap(s => s.items).map(f => ({
        '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: strip(f.a) }
      }))
    }]
  };
};
