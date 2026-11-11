# content/ — what the DMI CMS edits

Plain JSON that `build.js` reads. Paul (and the SEO person) change it in the DMI CMS, which commits the files here; a push to `main` rebuilds the site. Developers can still edit these files by hand, but the CMS will then refuse to publish over a file that changed outside it until someone presses "Sync from GitHub" in the CMS admin.

| File | Feeds |
|---|---|
| `site.json` | `src/site.js`: NAP, hours, Google rating, socials, header nav, footer legal links, launch switch `preview` |
| `services.json` | service cards (`services`) and the Services menu / footer groups (`serviceGroups`) |
| `form.json` | the booking form's two choice lists |
| `reviews.json` | the six Google reviews (`src/lib/shared.js`) |
| `faqs.json` | the FAQ page (`src/pages/26-faq.js`) |
| `pages/<slug>.json` | each page's SEO title, description, share image and noindex. A value set here wins over the page file's own; empty keeps the page file's. New page? `node tools/cms-pages.js` |

Derived in `src/site.js`, so not stored here: `phoneHref` and `whatsapp` (from `phone`), address lines, map links, prices with £/VAT, menu letters.

## Notes that used to sit next to the values in `site.js` (moved 11/11)

- `preview: true` = demo build: every page carries noindex until launch. Set it to false on the real domain (agency only in the CMS).
- Address: the old site and v1 said "Unit 8–9 Jesmor Farm"; v0.5 and Google say "Unit 10, Jesmor Trading Estate" (Paul confirmed Unit 10 on 10/11, REQUESTS #5).
- `reviewCount` 139 is from the Google Business Profile on 01/10/2026 (v0.5 said "140+").
- Prices: Fender's call (01/10) is ex-VAT with "+ VAT". Switching to VAT-inclusive (ASA CAP 3.18 / DMCC) is `vatMode: "inc"`.
- `waChat`: Paul 09/11 asked for a WhatsApp widget; same name, reply time and greeting as his Elfsight one on the old site. `instagram.elfsight` is his own paid Elfsight feed (09/11).
- Paint Correction `from: 650` is Packages Level 3 (v0.5 said "From £???").
- Services order: `main: true` = the four photo cards; `wide: true` = the half-row cards (Packages, New Car, 05/11 Brian). Interior took the Detailing Packages card on 27/10. Underside was added 22/10 (Paul's board note 1).
- `tbc: false` turns off the gold "To confirm" labels (Fender 06/10).
- A page ticks its own service in the form with `formPick`.
