/* ============================================================
   site.js — every value that appears in more than one place.

   NAP, prices, nav and the service list live here once. Header,
   footer, sticky bar, form, map and schema all read from this file,
   so a phone number or an address can never drift between blocks.

   ⚠️ VERIFY = still waiting on Paul / Ed (PLAN.md §12).
   ============================================================ */
'use strict';

const site = {
  name: 'Miracle Detail',
  legalName: 'Miracle Detail Ltd',
  person: 'Paul Dalton',
  origin: 'https://miracledetail.co.uk',
  /* Demo build: every page carries noindex until launch (netlify.toml adds
     the header too). Flip to false on the real domain. */
  preview: true,

  phone: '+44 7444 869983',
  phoneHref: 'tel:+447444869983',
  whatsapp: 'https://wa.me/447444869983',            // v0.5 aftercare page links WhatsApp to this number
  email: 'info@miracledetail.co.uk',                 // v0.5 aftercare page
  since: '1994',
  vatNo: '452960872',

  /* VERIFY — the old site and v1 say "Unit 8–9 Jesmor Farm", v0.5 and
     Google say "Unit 10, Jesmor Trading Estate". This is the one place
     it is written; every block reads it from here. */
  address: {
    unit: 'Unit 10, Jesmor Trading Estate',
    street: "St Piers Lane",
    town: 'Lingfield',
    county: 'Surrey',
    postcode: 'RH7 6PN',
    country: 'GB'
  },
  hours: 'Studio appointments only · Monday to Saturday',

  rating: '5.0',
  reviewCount: 139,                                  // Google Business Profile, 01/10/2026 (v0.5 said "140+")
  reviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Miracle+Detail+Lingfield',

  /* Prices. Fender's call (01/10): ex-VAT with "+ VAT". Switching to
     VAT-inclusive (ASA CAP 3.18 / DMCC) is one line: vatMode = 'inc'. */
  vatMode: 'ex',

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/miracledetailuk/',
      icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.8" stroke="currentColor" stroke-width="1.6"/><circle cx="16.9" cy="7.1" r="1.1" fill="currentColor"/></svg>' },
    { label: 'Facebook', href: 'https://www.facebook.com/pauldaltonsmiracledetail',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A21 21 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.12V9.9H7.6V13h2.7v8h3.2Z"/></svg>' },
    { label: 'YouTube', href: 'https://www.youtube.com/user/MiracleDetail',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></svg>' },
    { label: 'X', href: 'https://x.com/MiracleDetailUK',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.2 3.5h2.9l-6.3 7.2 7.4 9.8h-5.8l-4.5-5.9-5.2 5.9H2.8l6.7-7.7-7.1-9.3h5.9l4.1 5.4 4.8-5.4Zm-1 15.3h1.6L7.9 5.1H6.2l10 13.7Z"/></svg>' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@miracledetail',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.3 2.1 1.6 3.6 3.9 3.8v3a7.3 7.3 0 0 1-3.9-1.2v6.1a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.07v3.1a2.8 2.8 0 1 0 1.9 2.63V3h3Z"/></svg>' }
  ],

  /* ---------- Services ----------
     Old-site slugs (PLAN.md §5.1). `main` = the four v0.5 cards with a
     photo; the rest are the v0.5 list. `from` is a number (ex-VAT);
     `per` qualifies it. No `from` = no price shown (v0.5 had none, or
     it was "From £???"). */
  services: [
    { key: 'correction', main: true, name: 'Paint Correction', href: '/paint-correction-and-polishing/',
      badge: '5 levels · Enhancement to concours',
      line: 'Every job assessed with instruments most detailers don’t own.',
      from: 650, fromNote: 'Two-stage Correction Detail',   // VERIFY: v0.5 correction levels are "From £???"; this is Packages Level 3
      img: 'svc-correction', alt: 'A dual-action polisher working red paintwork' },
    { key: 'ceramic', main: true, name: 'Ceramic Coating', href: '/ceramic-coatings/',
      badge: 'Feynlab global ambassador',
      line: 'Applied by the man who helped create it.',
      from: 450, fromNote: 'Protection Detail with Feynlab coating',
      img: 'svc-ceramic', alt: 'A gloved hand levelling ceramic coating beside the Ferrari badge of a red SF90 Spider' },
    { key: 'ppf', main: true, name: 'Paint Protection Film', href: '/paint-protection-film-ppf/',
      badge: 'Installing since 2006',
      line: 'Longer than any other UK detailer.',
      from: 1500, fromNote: 'Maximum front protection',
      img: 'svc-ppf', alt: 'Paint protection film being squeegeed onto a red door' },
    { key: 'dryice', main: true, name: 'Dry Ice Cleaning', href: '/dry-ice-blasting-and-laser-cleaning/',
      badge: 'First in the UK, 2014',
      line: 'No water. No chemicals. No residue.',
      from: 200, per: 'hour', fromNote: 'Minimum two hours',
      img: 'svc-dryice', alt: 'Dry ice blasting the engine bay of a red Ferrari' },

    /* v0.5 has no underbody page: Feynlab Industrial V2 is in the ceramic range */
    { key: 'underside', name: 'Underside Coating', href: '/ceramic-coatings/#industrial',
      line: 'Feynlab Industrial V2 — 10 year protection', img: 'svc-underside' },
    { key: 'studio', name: 'Full Studio Detail', href: '/car-detailing-studio/#signature',
      line: 'Every service. One detailer.', img: 'svc-studio' },
    { key: 'packages', name: 'Detailing Packages', href: '/car-detailing-studio/',
      line: 'Maintenance to Signature — 5 levels', from: 175, img: 'svc-packages' },
    { key: 'bodyshop', name: 'Bodyshop & Paint Repair', href: '/bodyshop-repair/',
      line: 'Panel repairs to full restorations', img: 'svc-bodyshop' },
    { key: 'pdr', name: 'Paintless Dent Removal', href: '/paintless-dent-removal/',
      line: 'No filler. No paint. Original panel.', img: 'svc-pdr' },
    { key: 'wheels', name: 'Wheel Refurbishment', href: '/wheel-refurbishment/',
      line: 'Diamond cut, powder coat, colour change', img: 'svc-wheels' },
    /* v0.5 bug: this row carried the tint line. Now the leather page's own. */
    { key: 'leather', name: 'Leather Restoration', href: '/leather-restoration/',
      line: 'Colour restoration, scuff repair and conditioning', img: 'svc-leather' },
    { key: 'tint', name: 'Window Tinting & Bulletproof Film', href: '/window-tinting/',
      line: 'Chameleon, standard and security film', img: 'svc-tint' }
  ],

  /* Menu groups (PLAN.md §5.2), shown in the Services mega menu and footer. */
  serviceGroups: [
    { name: 'Correct & restore', links: [
      { name: 'Paint correction', href: '/paint-correction-and-polishing/' },
      { name: 'Leather restoration', href: '/leather-restoration/' },
      { name: 'Wheel refurbishment', href: '/wheel-refurbishment/' },
      { name: 'Bodyshop & paint repair', href: '/bodyshop-repair/' },
      { name: 'Paintless dent removal', href: '/paintless-dent-removal/' } ] },
    { name: 'Protect', links: [
      { name: 'Ceramic coatings', href: '/ceramic-coatings/' },
      { name: 'Paint protection film', href: '/paint-protection-film-ppf/' },
      { name: 'Window tinting & bulletproof film', href: '/window-tinting/' } ] },
    { name: 'Clean & preserve', links: [
      { name: 'Dry ice cleaning', href: '/dry-ice-blasting-and-laser-cleaning/' },
      { name: 'Detailing packages', href: '/car-detailing-studio/' },
      { name: 'Mobile detailing', href: '/mobile-car-detailing/' },
      { name: 'Aftercare & washing guide', href: '/aftercare-washing-guide/' } ] }
  ],

  /* v0.5 header order, old-site slugs. */
  nav: [
    { name: 'About Paul', href: '/about-paul-dalton-car-detailing/' },
    { name: 'Services', href: '/car-care-services/', mega: true },
    { name: 'Mobile Detailing', href: '/mobile-car-detailing/' },
    { name: 'Projects', href: '/car-detail-gallery/' },
    { name: 'Packages', href: '/car-detailing-studio/' },
    { name: 'Journal', href: '/journal/' }
  ],

  /* Privacy and terms pages: not on v0.5, waiting on Paul (REQUESTS) */
  legal: [],

  cta: { label: 'Book a consultation', href: '#book' },

  /* "To confirm" (Fender 06/10): every price or claim still waiting on
     Paul carries a small gold label on the page, so Paul and Ed can see
     what to check. false = the labels disappear (the copy stays). */
  tbc: false,

  /* The form's "What would you like done?" picks. A page ticks its own
     service with `formPick` (the dry ice page ticks "Dry ice cleaning"). */
  formServices: ['Paint correction', 'Ceramic coating', 'Paint protection film', 'Dry ice cleaning', 'Underside coating', 'Full studio detail', 'Detailing package', 'Mobile detailing', 'Window tinting or bulletproof film', 'Leather, wheels or bodywork', 'Not sure yet'],
  heardFrom: ['Instagram', 'Facebook', 'Google', 'YouTube', 'TikTok', 'Fifth Gear or the press', 'A friend or another client', 'Other']
};

/* ---------- Derived ---------- */
const a = site.address;
site.addressLine = `${a.unit}, ${a.street}, ${a.town}, ${a.county} ${a.postcode}`;
site.addressShort = `${a.town}, ${a.county} ${a.postcode}`;
site.mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`Miracle Detail, ${a.unit}, ${a.street}, ${a.town} ${a.postcode}`)}&z=13&hl=en-GB&output=embed`;
site.mapDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Miracle Detail, ${a.town} ${a.postcode}`)}`;

const gbp = n => '£' + n.toLocaleString('en-GB');
site.price = s => {
  if (!s.from) return '';
  const n = site.vatMode === 'inc' ? Math.round(s.from * 1.2) : s.from;
  const tail = site.vatMode === 'inc' ? ' inc. VAT' : ' + VAT';
  return s.per ? `${gbp(n)}${tail} / ${s.per}` : `From ${gbp(n)}${tail}`;
};
site.services.forEach(s => { s.price = site.price(s); });
site.picks = on => site.formServices.map(v => ({ v, on: v === on }));
site.mainServices = site.services.filter(s => s.main);
site.moreServices = site.services.filter(s => !s.main);
/* Menu labels letter by letter, for the rolling hover (01-header). */
site.nav.forEach(n => { n.chars = [...n.name].map((c, i) => ({ c, i })); });

module.exports = site;
