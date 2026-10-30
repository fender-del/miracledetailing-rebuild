/* ============================================================
   Terms, conditions & privacy (30/10). Paul's own page
   (miracledetail-terms.html, REQUESTS #30), words as he wrote them;
   only the long dash in 1.7 is gone. Linked from the footer
   (site.legal). Block 63.
   ============================================================ */
'use strict';
const { crumbs } = require('../lib/shared.js');

const SLUG = 'terms-and-privacy';
const p = s => `<p>${s}</p>`;
const ul = items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;

const SECTIONS = [
  {
    id: 'terms', label: 'Section 1', title: 'Terms &amp; <span class="gold it">Conditions</span>',
    clauses: [
      { n: '1.1', t: 'Bookings', html: p('All bookings are by appointment only. A booking is provisionally held following an initial conversation with Paul. It is only confirmed once a registration form has been completed and confirmed by email. Miracle Detail Ltd reserves the right to decline any booking at its discretion.') },
      { n: '1.2', t: 'Deposits', html: p('A deposit may be required to secure a booking, the amount of which will be confirmed at the time of booking. Deposits are non-refundable in the event of a late cancellation as set out in clause 1.3.') },
      { n: '1.3', t: 'Cancellations', html: p('If you need to cancel or reschedule, a minimum of 72 hours\' notice prior to the confirmed booking date is required. Cancellations made with less than 72 hours\' notice will incur a cancellation fee of £500 + VAT. This reflects the loss of revenue from the reserved time slot which cannot be reallocated at short notice.') },
      { n: '1.4', t: 'Payment', html: p('Payment in full is due before the vehicle is collected or as set out in the terms of the invoice. The following payment methods are accepted:')
          + ul(['Bank transfer', 'Debit card', 'Cash', 'Google Pay and Apple Pay'])
          + p('All prices are quoted exclusive of VAT unless stated otherwise. VAT is charged at the prevailing rate. Miracle Detail Ltd VAT registration number: 452960872.') },
      { n: '1.5', t: 'Vehicle collection and delivery', html: p('Paul is able to personally collect or deliver a vehicle within a reasonable distance of Lingfield, Surrey. Where a vehicle needs to be collected, detailed and then delivered, specialist automotive transportation can be arranged at an additional cost. Travel charges apply for any mobile service beyond 100 miles from Lingfield, Surrey. Paul will advise on the additional cost at the time of booking.') },
      { n: '1.6', t: 'Vehicle condition', html: p('Paul will inspect every vehicle on arrival and note any pre-existing damage, defects or areas of concern. A condition report may be provided prior to work commencing. Miracle Detail Ltd accepts no liability for pre-existing damage that was present before the vehicle was received.')
          + p('Clients are advised to ensure their vehicle is insured during the period it is in Paul\'s care. Miracle Detail Ltd holds appropriate public liability insurance, details of which are available on request.') },
      { n: '1.7', t: 'Results and expectations', html: p('The outcome of any detailing service is dependent on the condition of the vehicle, the paint thickness available, and the age and type of defects present. Paul will always provide an honest assessment of what is achievable before work begins. Results are not guaranteed beyond what is discussed and agreed at the point of booking. Paint correction is limited by the amount of clear coat available; this will be measured and communicated to the client.') },
      { n: '1.8', t: 'Liability', html: p('Miracle Detail Ltd\'s liability for any claim arising from the provision of services is limited to the value of the services provided. Miracle Detail Ltd is not liable for any indirect or consequential losses, including loss of use of a vehicle, loss of earnings, or diminution in value.')
          + p('Nothing in these terms limits liability for death or personal injury caused by negligence, or for fraud or fraudulent misrepresentation.') },
      { n: '1.9', t: 'Governing law', html: p('These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.') }
    ]
  },
  {
    id: 'privacy', label: 'Section 2', title: 'Privacy <span class="gold it">Policy</span>',
    clauses: [
      { n: '2.1', t: 'Who we are', html: p('Miracle Detail Ltd is the data controller for the personal data collected through this website and through the booking process. Registered address: Unit 8-9 Jesmor Farm, St Piers Lane, Lingfield, Surrey RH7 6PN. Company number: available on request. VAT number: 452960872.') },
      { n: '2.2', t: 'What data is collected', html: p('Paul collects only the personal data necessary to provide the service. This may include:')
          + ul(['Name and contact details (phone number, email address)', 'Vehicle details (make, model, registration, VIN where relevant)', 'Booking and payment information', 'Photographs of your vehicle taken before, during and after work', 'Any correspondence relating to your booking']) },
      { n: '2.3', t: 'How data is used', html: p('Personal data is used solely for the purpose of providing the detailing service, managing bookings and communicating with clients. It is not sold to third parties. It is not used for unsolicited marketing without explicit consent.') },
      { n: '2.4', t: 'How long data is kept', html: p('Client records are retained for a period of six years in accordance with HMRC requirements for VAT-registered businesses. After this period, records are securely deleted.') },
      { n: '2.5', t: 'Your rights', html: p('Under UK GDPR you have the right to access, correct or request deletion of your personal data. To exercise any of these rights, contact Paul directly at <a href="mailto:info@miracledetail.co.uk">info@miracledetail.co.uk</a> or by telephone on <a href="tel:+447444869983">+44 7444 869983</a>.') },
      { n: '2.6', t: 'Cookies', html: p('This website may use essential cookies necessary for basic functionality. No tracking or advertising cookies are used without consent. By continuing to use this site you accept the use of essential cookies.') },
      { n: '2.7', t: 'Complaints', html: p('If you have a concern about how your data is handled, you have the right to lodge a complaint with the Information Commissioner\'s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a>.') }
    ]
  }
];

module.exports = site => {
  const nav = crumbs([{ name: 'Home', href: '/' }, { name: 'Terms & privacy', href: `/${SLUG}/` }]);
  return {
    slug: SLUG,
    title: 'Terms & Conditions and Privacy | Miracle Detail Ltd',
    description: 'Terms and conditions for Miracle Detail Ltd. Bookings, cancellations, payment, liability and privacy policy for Paul Dalton\'s detailing studio in Lingfield, Surrey.',

    blocks: ['01-header', '63-legal', '13-footer', '14-sticky'],

    data: {
      crumbs: nav.html,
      lg: {
        eyebrow: 'Legal',
        h1: 'Terms, conditions<br>&amp; <span class="gold it">privacy.</span>',
        lede: 'Miracle Detail Ltd is a VAT-registered limited company (No. 452960872) based in Lingfield, Surrey. These terms govern all bookings, services and data handling.',
        sections: SECTIONS,
        updated: 'Last updated: June 2026. Miracle Detail Ltd reserves the right to update these terms at any time. The current version will always be published on this page.'
      }
    },

    schema: [nav.schema]
  };
};
