/* ============================================================
   site.js — every value that appears in more than one place.

   NAP, prices, nav and the service list live here once. Header,
   footer, sticky bar, form, map and schema all read from this file,
   so a phone number or an address can never drift between blocks.

   11/11 (DMI CMS): the values themselves now live in site/content/*.json,
   which the CMS edits (Paul) and commits. This file only joins them and
   works out what is derived (call/WhatsApp links, address lines, prices,
   menu groups). Edit the JSON, not this file, for content changes.
     content/site.json      NAP, hours, rating, socials, nav, launch switch (preview)
     content/services.json  service cards + Services menu groups
     content/form.json      booking form choices
   The notes that used to sit beside each value (VERIFY, who asked for
   what and when) are kept in content/README.md.
   ============================================================ */
'use strict';

const site = Object.assign(
  {},
  require('../content/site.json'),
  require('../content/services.json'),
  require('../content/form.json')
);

/* Call and WhatsApp links follow the phone number, so changing the
   number in the CMS changes every button (11/11: were typed by hand). */
const digits = site.phone.replace(/\D/g, '');
site.phoneHref = 'tel:+' + digits;
site.whatsapp = 'https://wa.me/' + digits;

/* ---------- Derived ---------- */
const a = site.address;
site.addressLine = `${a.unit}, ${a.street}, ${a.town}, ${a.county} ${a.postcode}`;
site.addressShort = `${a.town}, ${a.county} ${a.postcode}`;
site.mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`Miracle Detail, ${a.unit}, ${a.street}, ${a.town} ${a.postcode}`)}&z=13&hl=en-GB&output=embed`;
site.mapDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Miracle Detail, ${a.town} ${a.postcode}`)}`;

const gbp = n => '£' + n.toLocaleString('en-GB');
site.price = s => {
  if (s.quote) return 'Enquire for a Bespoke Quotation';
  if (s.poa) return 'Price POA';
  if (!s.from) return '';
  const n = site.vatMode === 'inc' ? Math.round(s.from * 1.2) : s.from;
  const tail = site.vatMode === 'inc' ? ' inc. VAT' : ' + VAT';
  return s.per ? `${gbp(n)}${tail} / ${s.per}` : `From ${gbp(n)}${tail}`;
};
site.services.forEach(s => { s.price = site.price(s); });
site.picks = on => site.formServices.map(v => ({ v, on: v === on }));
site.mainServices = site.services.filter(s => s.main);
site.moreServices = site.services.filter(s => !s.main);
site.footServices = site.services.filter(s => s.foot !== false);
/* Menu labels letter by letter, for the rolling hover (01-header). */
site.nav.forEach(n => { n.chars = [...n.name].map((c, i) => ({ c, i })); });

module.exports = site;
