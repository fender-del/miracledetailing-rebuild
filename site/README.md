# Miracle Detail · homepage build (Phase 1)

Spec: `../HOMEPAGE-PLAN.md`, revised with Fender on 02/10 (rounds 2–4, below). Toolchain: DMI-2026 (`build.js` + `src/lib/render.js` + blocks).
Status 06/10/2026: homepage v9 built and QA'd (Ed's notes of 06/10: the service text list gone, every service a photo card; a thicker logo; buttons instead of drag on the project deck; plus Fender: services two across on phones). v8 was zipped 05/10 (`../miracle-homepage-v8-netlify.zip`); v9 is not zipped yet. **Not deployed.**

## Commands

```bash
npm install                    # once: gsap 3.13, lenis, sharp, esbuild, puppeteer-core
node tools/video.js [wide|tall] # Pexels 5309351 -> 60 fps hero loops (1920 16:9, 1080 5:4) + posters (slow: interpolation)
node tools/images.js           # assets-src/ -> assets/img (AVIF + WebP, srcset, blur placeholders, logo, white logo marks)
node build.js                  # src/ -> index.html, assets/css, assets/js/site.js, netlify.toml, _redirects
node tools/serve.js            # http://localhost:8765 (gzip + year-long cache on /assets/, like Netlify)
node tools/qa.js <out-dir>     # 390 / 768 / 1440 + reduced motion + JS off: errors, overflow (at load and after), H1, hidden text, screenshots
node tools/deep-links.js       # opens /#book, /#projects, /#services at 1440 + 390: lands on target, everything in view shown
```

## Page order (v7, 02/10)

header · hero (video loop) · press strip · **story** · services (white) · **projects deck** + makes band · reviews (photo ground) · **coverage rail** · book · footer · sticky bar

- **Hero (v8):** H1 + slogan + one button, set low on the left over a soft dark pool; no glass panel, so the car fills the frame (Ed 05/10: "a red Ferrari, more visible"). The loop: one slow tracking shot along a red Ferrari Portofino in evening sun, grille → headlight (Pexels 5309351 by Taryn Elliott, real footage, picked by Fender; Pexels serves it at 1280×720 only, so it is scaled once to 1920 with a firmer sharpen and there is no 2560 file). 25 → 60 fps by motion interpolation, first 12 s, dips through black for half a second at the join. 1920 (5.2 MB) for desktops, 5:4 1080 (2.6 MB) up to 900 px wide. Poster = first lit frame (the LCP). No video with reduced motion, Save-Data, 2G or iOS Low Power Mode.
- **Press strip:** "As featured on" stays put at the start; real logos run past it (Fifth Gear, Sunday Mirror, RTL, Nippon TV). Motorheads and "Seven national newspapers" stay in type (no credible Motorheads logo found).
- **Story:** opens on "Since 1988" (sentences light up word by word as you scroll, figures count); beat 2 slides in from the right — "On TV · In the papers", Fifth Gear 2006, the Sunday Mirror ran it — and brings the cutting onto Paul's photo; then the photo goes and "One detailer. Every car. No exceptions." grows into the middle of the screen and fades into the services (3/4 of the scroll it had in v3). Desktop pins; phones stack, the closing line holds a screen briefly.
- **Projects:** each card is a job Paul has done (round 6: they read like a sales catalogue), told only from what he has published — the v0.5 About timeline and the old gallery: a label (where and when, or "From the gallery"), the job in a sentence, two work tags, "See the job". No spec sheets or trivia; the DB11 (no story) is out, 7 cards. White and gold cards in turn (no gold wash on the waiting cards), Enzo first. Moved by two round arrow buttons under the deck, with a count (01 / 07) (Ed 06/10: "rather than drag, a simple button that goes left to right"): next slides the top card off to the right, it drops behind and slides in under the deck; back brings the last card in from the right. A click during a move is played straight after. Arrow keys do the same; on touch screens a swipe still works, a mouse does not drag. The deck deals itself in the first time it is seen. Under it, the makes band: logos of 18 makes from the archive.
- **Services on ivory (rounds 5–7):** the section paints its own paper ground (a touch darker towards its edges); it rises as a narrower panel with rounded top corners that opens out to the full width as it takes the screen and closes in again as it leaves. Behind the cards, one large logo, off to the left, in faint ink and out of focus, drifting against the scroll (round 7: a repeated debossed pattern read as kitsch; a black ground was tried and dropped). Inside, the tokens flip (ink text, bronze #8B6E22 for the gold, 4.8:1 on paper; black buttons with a gold sweep); the photo cards keep their dark tokens. All twelve services are the same photo card (Ed 06/10: the text list went): badge, name, line, price, arrow; the eight without a v0.5 badge carry their menu group. Four across on desktop, three on tablets, two on phones with only photo, name, price and arrow (Fender 06/10: a list scrolls forever on a phone).
- **Reviews on a photo (round 5):** GF Williams' water on a tail light, dimmed and faded into the black above and below; it comes down from a zoom and drifts as the section passes. Review cards are frosted glass on desktop.
- **Coverage (round 5; names at ~60% in round 6):** the block holds the screen and the counties run past right to left in large type — Surrey (home), Kent, London, Sussex, Hampshire, & beyond — each turning gold in the middle with a town and its distance from Lingfield as the crow flies (Tunbridge Wells 13 mi, Central London 23, Brighton 25, Winchester 57); the studio, hours and directions arrive last. About 1.75 screens of scroll on desktop, 1.3 on a phone. No JS / reduced motion: a plain list.
- **Project cards on phones (round 5–6):** photo 16:9, label, name, the job in up to three lines, button (~400 px of an 844 px screen, was 638); the finish line and the work tags stay on desktop.
- **Sound (round 5):** made in the browser (Web Audio, `src/motion/sound.js`): nothing to download, nothing licensed, +3.6 KB gz. Starts at the visitor's first click, tap or key (browsers allow nothing earlier: tested, a wheel or a swipe does not unlock audio, PageDown/arrows/space do); the first scroll without sound makes the switch dance for three seconds with a gold ring breathing out (header held in view meanwhile); the gold bars in the header switch it off and on, and the choice is remembered (localStorage `md-sound`). Silent in a hidden tab; iOS keeps it silent on the mute switch. Bed: a slow pad whose chord follows the section in the middle of the screen, a soft bell now and then, air that rises with the scroll speed. Touches: menu letters tick, buttons breathe, clicks tap; cards lift, rub, whoosh and land, the deck deals with flicks; story beats land low, the closing line swells, two glass notes over a low bloom as the services arrive (round 6, picked from three); each county rings a rising note. Levels measured: bed −34 dBFS RMS, touches peak −26 to −17, services glass −13, story beat −13. `?snd=meter` exposes the parts for a level check.
- **Book:** no "What happens next"; "Prefer something quicker? Call Paul." sits over the phone number. On phones the form comes straight after the heading.
- **Motion language (v4):** headings flip up word by word; eyebrows: the gold diamond spins in and the words wipe in; text rises out of a soft blur; service cards and the form open like a curtain. Cursor = gold dot + hairline ring (opens out over links). Menu: letters roll up, a gold copy rolls in. Eyebrow marker = a small gold diamond everywhere (no hairline rules). Type (v8, Paul via Ed: "more classy and luxury"; direction 1 of 3, the comparison is `../review/miracle-font-directions.pdf`): Bodoni Moda for every display line (headings, slogan, car and service names, county names, the phone number), mixed case, the gold words in italic; Jost for labels, buttons and menu (capitals, spaced) and for text.

## Service pages (06/10, wave 1: Dry ice first)

`/dry-ice-blasting-and-laser-cleaning/` = `src/pages/10-dry-ice.js`. Lean after Fender's note ("too many blocks, too much text"): 9 blocks, one short line per card.

hero (20) · proof strip (21) · uses + price on ivory (22) · **−78.5°C** (30, dry ice's own) · **compared** (31, dry ice's own) · from the studio (24) · reviews (10) · FAQ (28) · book (12, "Dry ice cleaning" ticked)

- **−78.5°C:** one SVG drawing (gun, pellets, grime on metal) played by the scroll beside three short beats (Impact · Cold · Gone): pellets fly and strike, frost and cracks, readout falls to −78.5°C, pellets turn to vapour, the grime flakes off, the bare edge shines. CSS sticky, no pin (`src/motion/svc.js`). Reduced motion / no JS: one still frame, all beats lit.
- **Compared:** dry ice vs pressure washing, steam, chemical degreaser on water, residue, wiring, tight gaps. Phones: dry ice against one method, picked with chips (radio + `:has()`, no JS).
- Blocks cut in the trim, kept on disk for other services: 23 how a job runs, 25 why Paul, 26 what it is not, 27 alongside it.
- **"To confirm" labels** (`site.tbc`, false hides them all; hover shows the note): "first in the UK, 2014"; the three stock/archive photos on the use cards (underbody: Pexels Testarossa on a lift, interior: Pexels leather, restoration: archive Porsche); how the other methods are described in the table; before/after photos wanted; underbody protection (Feynlab Industrial V2) and laser cleaning still offered?
- Photos: Paul's own dry ice shots from v0.5 (download-61/62) and the old site (3), in `../assets-src/dryice/`; the Drive engine bay.
- Each page now inlines only its own blocks' CSS (`build.js cssFor`).

## PPF, the sample service page (06/10, after Ed)

**Rule for every service page from now on** (Ed 06/10, Fender): Paul's v0.5 text stays word for word, only the layout and UX change. The one edit allowed is the em dash (replaced by a comma, colon or full stop). New words are interface labels only (the "on this page" bar, buttons, Read more, alt, meta). No FAQ added where v0.5 has none. **No "To confirm" labels** (`site.tbc = false`). This supersedes the lean dry-ice rule above: the dry ice page is to be rebuilt with its full v0.5 text using these blocks (and loses the 4 FAQ answers written for it).

`/paint-protection-film-ppf/` = `src/pages/11-ppf.js`, v0.5's order:

hero with the **film sweep** (20, `hero.film`) · **on this page** bar (29) · since 2006, lit word by word (32) · peace of mind, sticky heading + photo, Read more on phones (33) · **coverage** (34, PPF's own) · film finishes as tabs on ivory with CSS swatches (35) · the films, real logos (36) · process (23) · installation photos (24) · reviews (10) · book (12, PPF ticked)

- **Coverage drawing** (`src/lib/ppf-car.js`, built into the HTML): side + top view of a mid-engined car in gold line work. The side view is traced from a side-on photo of a McLaren MP4-12C (Wikimedia Commons, M 93, CC BY-SA 3.0 de; used as a reference only, not published) with `tools/ppf-side-trace.py` -> `src/lib/ppf-side.json`. Each film panel is a zone; a package lights its zones in fitting order, hatches them and sweeps a sheen over them. Pointing at a line of the list lights its panel and draws a callout (dot + hairline + name); pointing at a panel lights its line. Phones: the drawing sticks under the bar while the list passes. Motion: `src/motion/ppf.js`.
- **Shared by the long pages** (`src/motion/ppf.js`): the bar lights the section on screen and slides to the top when the header hides; `[data-more]` folds long text on phones (13.5em) with Read more; `[data-tabs]` turns options into tabs (without JS every option shows).
- **Logos** in `../assets-src/logos/films/` (sources in SOURCES.md): XPEL, SunTek, STEK, Profilm (profilmgrp.com) from the brands' own sites, as white marks like the homepage strips (Fender 06/10 tried them in colour on light plates and found it ugly).
- **Hero, round 5 (Fender 06/10), CURRENT:** back to GF Williams' LaFerrari, full width, with the film sweep (`hero.film`), keeping the round-3/4 copy layout: figures as a gold row under the buttons, no glass card (`hero.stats`, `.shero--stats`). The video and the panel layout stay in the code (`hero.video`, `hero.panel`), unused.
- **Hero, round 4 (superseded): video + gold figures.** A loop of gloved hands laying PPF over a black car's door mirror, in the right-hand panel (same player as the homepage, `.hero__video`; poster = first frame). **The file in place is Adobe Stock 594907552's watermarked preview (`assets/video/ppf-hero-comp.mp4`, from `../assets-src/video/adobe-594907552-COMP-watermarked.mp4`), for review only: license the clip and replace that file (and the poster `assets-src/video/ppf-hero-comp-poster.png`, then `node tools/images.js`) before going live.** No free clip of PPF being fitted exists on Pexels or Pixabay (searched 06/10). The figures 2006 · 4 · 3 are gold and larger. The panel's left edge is faded by an ink gradient on `.shero__shade`, not a mask (a mask left a seam in Chrome). The film sweep (`hero.film`) stays in the code for photo heroes.
- **Hero, round 3 (superseded):** the photo holds the right half (fading into the dark on its left), the copy stands on clean black, the three figures are one row under the buttons (no glass card). Photo = Unsplash dlJelFmdpOc (film trimmed round a Mercedes headlight, Unsplash licence), cropped to the hands so the fitter's face is out (he is not Paul). The film sweep still plays over it. `hero.panel`.
- **Hero, round 2 (superseded):** GF Williams' LaFerrari (7360 px) full width. The photo is layered: bare paint below (a touch flat), full gloss above behind a slanted film edge that sweeps across on arrival (bright edge, soft shadow ahead of it, a hair-wide refraction band behind, a glint over the fresh film), then the edge fades and only the gloss remains. `motion/ppf.js filmHero`; reduced motion / no JS = the finished gloss. Dark side gradient so the copy reads over the car.
- **Finishes, round 3 (Fender 06/10):** close on the paint. Gloss = bare paint (flatter, softer reflections) -> gloss film (deep): no scratches, PPF does not repair paint. Matte = gloss -> satin, same close-up. Both from GF Williams' LaFerrari bonnet (`finishes/laf-*`: AI pass + a flatter grade in code for bare; AI satin). Colour keeps the whole 458 (yellow -> emerald), left label 'Original'.
- **Finishes, round 2 (superseded):** a before/after slider per finish on one GF Williams 458 Speciale: gloss (worn, swirls + chips -> clean), matte (gloss -> satin matte), colour (yellow -> emerald). The three edits were made with AI (FLUX 3 on Higgsfield, 12 credits) from that photo, so every pair lines up pixel for pixel (`assets-src/finishes/`). Range input over the frame (drag, tap, keys), sweeps once as a hint. CSS swatch stays as the fallback when an item has no `ba`.
- **Photos, round 2:** peace of mind = GF Williams water off a wheel (credited); installation = four of Paul's job photos with no teal floor (Drive door + three from the old site). The v0.5 blue squeegee and the teal-floor shots are out.
- Photos: hero = Drive `07-ppf-squeegee.png`; the rest are Paul's PPF photos from the old site (`../assets-src/ppf/`, 1200 px wide, so a little soft on big screens: better originals from Paul would help).
- Lighthouse (local, 06/10): mobile 96 · desktop 100, LCP 2.5 s / 0.5 s, CLS 0. QA 7 modes clean.

## Every v0.5 page (06/10, Fender: "only the pages v0.5 has")

Scope = the 13 content pages on the v0.5 staging site + Services, Gallery and Journal (v0.5 has them empty). The old ~207-page plan (145 project pages, make pages, new-car / supercar / classic pages) is dropped; their old URLs 301 in `_redirects`. Rules as PPF: Paul's v0.5 text word for word, the em dash the only edit, UI labels only as new words; `From £???` kept as written. What is still missing for Paul / Ed: `../REQUESTS-Paul-Ed.md` (+ `.pdf`).

| Page | File | Slug |
|---|---|---|
| Dry ice (full text again; the FAQ and comparison written for the lean version are gone) | `10-dry-ice.js` | /dry-ice-blasting-and-laser-cleaning/ |
| Ceramic | `12-ceramic.js` | /ceramic-coatings/ |
| Paint correction | `13-correction.js` | /paint-correction-and-polishing/ |
| Window tinting & bulletproof film | `14-tint.js` | /window-tinting/ |
| Mobile | `15-mobile.js` | /mobile-car-detailing/ |
| Bodyshop | `16-bodyshop.js` | /bodyshop-repair/ |
| PDR | `17-pdr.js` | /paintless-dent-removal/ |
| Wheels | `18-wheels.js` | /wheel-refurbishment/ |
| Leather | `19-leather.js` | /leather-restoration/ |
| Packages | `20-packages.js` | /car-detailing-studio/ |
| About Paul (timeline, 24 entries) | `21-about.js` | /about-paul-dalton-car-detailing/ |
| Aftercare guide | `22-aftercare.js` | /aftercare-washing-guide/ |
| Services hub (homepage cards) | `23-services.js` | /car-care-services/ |
| Gallery (133 old jobs, filter + lightbox) | `24-gallery.js` | /car-detail-gallery/ |
| Journal = the old blog + its 2 posts, word for word (07/10) | `25-journal.js` | /journal/, /facebook-competition/, /new-product-launch/ |

- **A block used twice on a page:** `blocks: [{ block: '33-svc-prose', with: { prose: … } }]` (build.js). Helpers in `lib/shared.js` (`cards`, `prose`, `quote`, `steps`) set every key, because the template engine looks a missing key up in the outer context.
- **New blocks:** 37 cards (variants boxed / points / versus; three or more boxed cards swipe as a row on phones), 38 quote (words lit one by one, optional photo ground), 39 price band, 40 timeline (About), 41 gallery (+ `motion/gallery.js`). 33 prose gained a list, price, photo caption, before/after tags, photo on the right; 23 steps any count, step tags, no heading; 21 proof any count; 24 work optional heading and full/half/third widths; 28 FAQ and 30 cold take their heading from the page.
- **Photos:** `tools/images-pages.js` (read by images.js). v0.5's own page photos (`../assets-src/v05pages/<slug>/`, from each page's Elementor CSS), then the old site's service photos (`../assets-src/old-site/`). Gallery: `tools/gallery.js` -> `assets/gallery/<job>/<n>-480|1400.webp` + `src/lib/gallery.json` (125 MB).
- **v0.5 slips** fixed or left out (ceramic/tint paragraphs swapped, leather areas carrying PPF lines, duplicated headings…): each page's header comment, and REQUESTS section 3.
- **Menu / footer:** no links to pages that do not exist (new car, supercar, classic, contact, privacy, terms). "Contact" opens the booking form.

## Scroll kit on the inner pages (07/10, `../PLAN-interactions.md` §1–4, revised the same day)

The layout and scroll motion from the plan, on every v0.5 page. **The page-specific interactions at the top of that plan (VLT slider, five-level slider, PDR reflection lines…) are NOT built yet.** Paul's words unchanged; only grounds (dark / ivory) moved to keep the rhythm (never three dark sections in a row; two ivory sections in a row read as one chapter, no seam).

**Rule after Fender's review (07/10): one effect, once per page.** An effect repeated block after block (the light sweeping every section, the hairline at every section, every quote lighting word by word) read cheap, so:
- one section per page arrives with an effect, set by the page: `arrive: 'id:beam|ripple|cut'` (Correction: Diagnosis under the inspection light; Ceramic: Why, a bead of water spreading; Dry ice, PDR, Bodyshop: one hairline cut; PPF: none, its hero film sweep is its one);
- only the first statement or quote of a page lights word by word, the others simply rise in;
- one zoom per page (Tint: the overview zooms, the legal photo only darkens like film);
- phones: at most one row to swipe per page.

Code: `src/02-fx.css` + `src/motion/kit.js` (+ `motion/cold.js` for dry ice); a page sets `cluster` and `arrive`, a block sets its kind.

**The main list of each page runs sideways under an anchored header** (Fender 07/10: scroll down, travel sideways, keep the header so the visitor knows what is being talked about): `cards.fx = 'rail'` on Correction (5 levels), Ceramic (6 coatings), Mobile (4 packages), Bodyshop (4), Wheels (4), Leather (3), Tint (3 films), Dry ice (4 uses). Desktop/tablet landscape (≥1024 wide, ≥600 tall): the section holds the screen; heading on top, under it the names of every item (the one in view lit, a click goes to it) and a count; the cards run past edge to edge; a card with a photo becomes a slide (photo left, words right); Correction's Rolls-Royce photo leads the row. It fits itself to the screen: normal → tighter → wide cards with Paul's words beside the list (laptops ~650 px tall) → otherwise the plain grid. Packages keeps its stacked cards, PPF its coverage drawing.

| Cluster | Pages | What stays |
|---|---|---|
| paint | Correction, Ceramic, PPF | hero closes into a framed photo as it leaves |
| process | Dry ice, PDR, Bodyshop | PDR's five steps and Bodyshop's process on a **stage** (desktop: the picture holds still, the number turns over, the step beside it lights) |
| restore | Wheels, Leather, Tint | the first photo opens on a close-up and pulls back |
| story | About, Mobile, Packages | quotes take the whole screen; About: a **year counter** rolls beside the timeline; Packages: the five levels **stack**; Mobile: the three Portugal cars float round the quote |
| utility | Aftercare | "Step n / 8" pill while the procedure is read |

**Dry ice, redrawn (07/10, `motion/cold.js`):** one canvas, no images: a machined aluminium casing (brushed top catching two softboxes, cooling ribs), a stainless lance with a fan nozzle that frosts over, a stream of pellets, a caked crust of grime. The scroll tells it: I the pellets strike and the crust shivers; II frost spreads and crystals grow, the readout falls to −78.5°C, the crust cracks; III the pellets turn straight to gas (CO2 is heavier than air: the vapour rolls along the surface and spills over the edge), the crust breaks off from the centre out, a light runs along the clean edge. Held on screen while the beats pass (desktop: right column; phones: a band under the page bar, about a fifth of the screen). Painted only while on screen. Reduced motion: one still frame. No JS: `assets/img/cold-still.webp`, rendered from the canvas (re-render it after changing the drawing: open the page with reduced motion and save `.cold__cv` as an image).

**Phones:** nothing covers the text (held pictures stay small); options with a price and no photo become a **price list** (`cards.acc`: every option on one screen, a tap opens the rest); About's timeline and Aftercare's steps become rows to swipe with a count; Paul's paragraphs fold after about three lines (only when 2.5+ lines would hide); project photos two up. About on a phone: 37 → ~15 screens, Aftercare 12 → 8.

Reduced motion / no JS: none of the motion; stage and year counter still work with JS (they are how the page reads); every list shows in full without it.

QA 07/10 (after the revision): 17 pages × 7 modes, 0 console errors, 1 H1, 0 horizontal overflow, 0 hidden text. Lighthouse mobile (local): Dry ice 98, Correction 99, Wheels 99; CLS 0. JS 93 KB gz.

## New block shapes 45–50 (07/10, the window tint rebuild)

Fender: the tint page had too few visuals and every section was "heading left, text right" or "a row of cards". Rebuilt with Paul's words unchanged, each section a different shape. The shapes are generic (data in `src/lib/formats.js`, behaviour in `src/motion/formats.js`), so other pages can use them:

| Block | What it is | Tint uses it for | Could serve |
|---|---|---|---|
| 45 show | a large photo, an effect painted on a traced part (`regions`: `poly` in % of the image, `fx` shift / hatch), numbered points that take turns and set a look | chameleon film on a Jaguar windscreen, following the pointer; IV hatches the bonnet (PPF) | leather areas, wheel parts |
| 46 gauge | a slider against a photo and limits; each zone darkens and says pass / fail | UK VLT: windscreen 75, front 70, rear none, on a Mercedes E-class | correction % levels |
| 47 lens | a wide photo with a hidden layer seen through a lens (pointer / drag / drift), a label riding under it | bulletproof film: honeycomb, plies, bonded edge on the side glass | an inspection light on paint |
| 48 layers | an exploded drawing; the item in the middle of the screen sets its state | glass + film plies: part (I), bonded edge holds (II), one clear pane (III) | ceramic layers, PPF build-up |
| 49 index | big editorial rows, one open at a time on a paragraph + photo | who it's for | areas, audiences |
| 50 note | a closing note on a dark photo, the page's one lit paragraph, a call button | complete discretion | any page's last word |

Also: `cards({ compact: true })` (37): on phones each card shows photo, name, line and price, "Read more" opens the rest (tint film options, Fender 07/10).

- Dropped the same day: a canvas of the pane being shot (Fender: "trông trẻ con quá"); 48 layers replaced it.
- Photos: Pexels (free licence) in `../assets-src/stock/pexels-<id>.jpg`: 26691322, 1574846, 39835378, 4096380, 17233277, 20036216, 7594130, 1467591, 33203858, 11877373. The traced glass is in `pages/14-tint.js`; re-cropping a photo in `tools/images-pages.js` means re-tracing.
- Canva stock was asked for, but the Canva connector was not signed in on 07/10.
- QA 07/10: tint and ceramic, 7 modes each, clean.

## Mobile detailing, rebuilt (07/10, blocks 70–77)

Fender, round 1: "audit build lại kĩ… quan trọng không kém trang about paul, không cần interactive function". Round 2 the same day: "chưa đủ ấn tượng, cấu trúc các block vẫn lặp lại; các gói trên mobile nên kéo ngang, chưa nổi giá; 9 khu vực lê thê / chưa đẹp; QnA trên mobile dài quá". Paul's words unchanged (checked line by line against `../crawl/v05/pages/mobile-detailing.md`; only the CTA labels differ, site-wide). Each section has its own shape:

| Block | What it is |
|---|---|
| 70 mb-how | a full-bleed photo (Koenigsegg + the old van on the London Concours lawn) with the heading over it (the page's one parallax), then Paul's first line large and the other two beside it |
| 77 mb-route | the Caddy: heading + paragraph, then the van's road as a gold line with three stops (UK, Monaco, Portugal), each a photo + Paul's words |
| 71 mb-areas | a chart round Lingfield on ivory: rings, each county on its true bearing / rough distance (county centres, `15-mobile.js`), "International on request" leaving along a dashed arrow, a slow light sweep (CSS, off with reduced motion). Desktop: v0.5's nine lines beside it; phones: the chart alone (list kept for screen readers) |
| 72 mb-why | one photo behind the section, title large and centred, three reasons under hollow gold numerals |
| 73 mb-menu | cards led by large prices (Premier inverted: black, gold figures); desktop four across with subgrid, tablets 2×2, phones a row to swipe (CSS scroll-snap, next card peeking, "Swipe · 4 packages") |
| 74 mb-field | Portugal: heading centred and large, F12 TDF wide + 599 GTO tall, paragraphs, the one lit quote, closing line + "From £???" |
| 75 mb-faq | phones/tablets: `<details>`, questions only, first open; desktop (≥1024): every answer printed (`::details-content` forced visible) |
| 76 mb-addon | wheel ceramic: 458 Speciale wheel close-up beside the heading, the two prices as a small list |

Round 3 (Fender): the hero photo is held in the right two thirds (`hero.shift`, block 20) so the van clears the copy, phone crop widened; how it works is words-first with a framed photo (a full-bleed photo right after the hero read as a second hero); the chart stands alone (the names showed twice; v0.5's list stays for screen readers); Portugal shows three cars, the GT3 RS a gallery stand-in (`mb-gt3`, captioned "from the gallery", in REQUESTS §4).

Round 4 (Fender: the phone block did not fit one screen; text on the photo with a gradient; a sideways scroll): how it works on phones = the photo across the top, heading on its lower edge over a gradient, the rest on dark, one screen (835 px at 390×844); on every width the photo pans sideways as the section passes (CSS scroll-driven `view-timeline` on the section, since the clipping frame would otherwise be the timeline's scroller; static where unsupported or with reduced motion). It replaces the page's parallax.

Round 5 (Fender: a package card was taller than the phone screen): on phones each card stops at its facts (~500 px) and "What's included" opens a sheet from the bottom with Paul's line, the facts and the list, the same look as the packages page's sheet. `motion/sheet.js` is generic: any `[data-sheet-card]` with `[data-sheet-kick]`, `[data-sheet-name]`, `[data-sheet-part]` and a `[data-sheet-open]` button; its CSS (.pks) is copied into block 73 so the page does not need block 53. Without JS the list stays on the card.

No photo is used twice. Round 2 was built without the QA pass (Fender: "bỏ qua bước QA để tiết kiệm tg"); round 1 QA was clean, Lighthouse mobile 96. Phone length ~13 screens (round 1: 17).

## Packages rebuilt: blocks 53–54 (07/10)

Fender: audit the packages page and make it more appealing; PC approved, then "mobile chán quá, sáng tạo cho mobile nữa". Paul's words unchanged. Page: hero (gold figures 5 · 100 · £175) · **53 ladder** · 50 note "Just ask Paul" (Paul at work behind, the page's one lit line) · **54 add-on** (wheel ceramic, one band) · reviews · book. The stacked cards (37 `fx:'stack'`) and the photo strip are gone from this page.

- **53 ladder** (`lib/packages.js` ladder(), `motion/ladder.js`): desktop 1024+ × 640+ = Paul's intro, then the five levels on ivory beside a dark panel held still: the level's photo (`pk-l1…l5`), name + roman numeral, a step per level (rising bars, a click goes to the level), estimated time (log scale, hours → 100 hours), coating durability (0–7+ years), polishing stages (diamonds) and the price + Book Now. The panel follows the level crossing 45% of the screen. Lines new at each level are the strong ones (a list line starting with `+` in the page data). Tablets/phones/short screens (Fender: the first phone version was "chán", the pinned staircase after it "xấu"): **nothing pinned**. A row of dark cards to swipe (the page's one swipe row), each = photo, then under it (words over the photo sank in, Fender 07/10) roman numeral, name, sub, five small rungs lit up to the level, time + coating gauges, polishing stages, price, "What's included" + Book Now; count, bar and arrows under it. "What's included" opens a sheet from the bottom (copied from the level's own words and list; ×, Esc, the backdrop or a pull down closes it). No JS: every level open with its facts.
- **54 add-on**: wide photo + Paul's words + button on one band (`pk-wheel`, a tighter crop of the GF Williams 458).
- QA 07/10: packages 7 modes clean.

## Where things live

| What | File |
|---|---|
| Phone, WhatsApp, address (one copy), prices + VAT switch, nav, services, socials | `src/site.js` |
| Homepage copy, project cards, press + makes lists, reviews, schema | `src/pages/00-home.js` |
| Blocks (one `.html` + `.css` each, cut into WP template-parts later) | `src/blocks/` |
| Motion (GSAP 3.13 ScrollTrigger/SplitText/Draggable + Lenis) | `src/motion/*.js` → `assets/js/site.js` |
| Logo (white on transparent): inlined in the CSS for header/menu/preloader; files for the footer | `../assets-src/logo-bold.png` (= `logo.png` with every stroke thickened, Ed 06/10) → `assets/img/logo*` |
| Press + car logos (originals, licences in `SOURCES.md`) → one white mark each | `../assets-src/logos/{press,cars}/` → `assets/img/mark-*.webp` |
| Service photos (Pexels, free licence) | `../assets-src/stock/` |
| Fonts: Bodoni Moda (display, weight 500 pinned, optical size kept, 25 + 28 KB) + Jost (300–600, 22 KB), self-hosted, cut to the glyphs used; originals in `../assets-src/fonts/` | `assets/fonts/` |

`vatMode: 'inc'` in `site.js` switches every price to VAT-inclusive (×1.2).

Images, logos and videos carry `?v=<content hash>` (images.json / build.js): `/assets/` is cached for a year, so a re-encoded file under the same name would otherwise never reach a returning visitor.

## Measured (05/10, v8, local server with gzip)

- Lighthouse mobile ×2: Performance 97–98, LCP 2.3 s (the poster), TBT 90–100 ms, CLS 0.03. Desktop: 100, LCP 0.5 s. Accessibility 96 (the dimmed story words and the waiting county names: both light up as they reach the middle). SEO 69 only because the demo is `noindex`.
- JS 80.7 KB gzip, loaded after the page's `load` event once the poster has decoded (the hero entrance is CSS; menu and form work without JS). CSS 18 KB gzip inlined. Fonts 75 KB (Bodoni Moda upright preloaded for the hero slogan).
- 7 QA runs (390, 768, 1440, reduced ×2, JS off ×2): 1 H1, 0 console errors, 0 horizontal overflow at load or after scrolling, 0 hidden text. Deep links /#book, /#projects, /#services land on target at 1440 and 390 with everything in view shown.
- Fixed in round 7: the three gold figures in the story vanished after the window crossed the pin/flow line (1024 wide / 680 tall): the word split is undone there and the sentence's original HTML brings back hidden figures; a mark on the section now keeps them shown.
- Fixed in round 5: a page opened at /#book on desktop landed 461 px short — Lenis caps a jump at the page length it measured before the pins were built (it re-reads it 250 ms later); `rehash()` now has it re-measure first. A click on the hero video focused it inside an aria-hidden block (console warning); the video ignores the pointer now.
- Fixed on the way: beat 2 waiting off to the right widened the phone page by 64 px; one-shot entrances never fired on a page opened at #book (the story pin is built after the fonts and moves everything below) — now IntersectionObserver; a deep link landed ~2 screens early for the same reason — now re-lands after the pin and the deck are built; the hero parallax kept a 1.07 scale.
- Local form POST returns 501 (the page says the preview is not connected). Netlify Forms takes it once deployed.

## Still waiting on Paul / Ed (also in PLAN.md §12)

- Address: Unit 10 Jesmor Trading Estate (used) vs Unit 8–9 Jesmor Farm.
- Prices shown: Correction from £650 (= Packages Level 3), Ceramic from £450 (= Packages Level 2), PPF from £1,500, Dry ice £200/hour, Packages from £175. All + VAT.
- LaFerrari photo credit (likely GF Williams), WhatsApp on the same number, review count 139.
- Project cards: Enzo, CCX-R, F40, 458 Speciale and Carrera Clubsport link to their old gallery pages; LaFerrari and Zonda link to the make page. The stories come from v0.5's About timeline; to confirm with Paul: the LaFerrari in the card photo is the one GF Williams shot at Dunsfold in 2015; the F40 photo is the Monaco car; the 458 Speciale was done at the Dunsfold studio. Photo counts are the full-size images on each old gallery page. No service is named on a card until Paul says what he did.
- The hero is stock footage (a Ferrari Paul did not necessarily work on) and only 720p at source. Paul's own clip, ideally 4K, can replace it with `tools/video.js`.
- Ceramic card photo (Fender's SF90 Spider) carries an "ESOTERIC" watermark — another detailer's work; needs their permission or a replacement before going live.
- Logos are trademarks of their owners (footer says so). Pagani mark is CC BY 4.0 — credited in the footer. Motorheads logo: ask Paul for it or a still from the show. Fifth Gear mark is the 2024 relaunch logo, not the 2006 one.

## 07/10: Journal, socials, project cards

- **Journal = the old /blog/** (Fender): `/journal/` lists the two posts of 7 August 2024 (block 60, photo and words side by side, sides swapping); each post keeps its old slug (`/facebook-competition/`, `/new-product-launch/`, block 61) with every word, link and photo of the old page (`../assets-src/journal/`, ids `jn-fb`, `jn-npl`, `jn-bottle`). Titles use the old pages' own title case. The YouTube film both posts embed (f3v_am1UsVc) is a poster (`jn-yt`) until pressed, then a youtube-nocookie player (`motion/journal.js`). The old star-rating widget is not carried over. Indexed now (was noindex); the two 301s that sent the posts elsewhere are gone. A page file may now return several pages (build.js flatMap).
- **Socials (footer):** X (@MiracleDetailUK, from the old site) added beside Instagram, Facebook, YouTube, TikTok. The icons sat high in their circles: `.ft__col li a` (padding, inline-block) beat `.ft__social a`; now `.ft .ft__social a`, 42 px so the five fit one row.
- **Project cards (homepage)** open the car in the Gallery lightbox (`/car-detail-gallery/?job=…`) or the Gallery filtered to the make (`?make=ferrari|pagani`) instead of old-site URLs that relied on a 301. The five card jobs keep every photo (`tools/gallery.js` FULL), so "78 photographs" opens 78; the 458 tag says 4 (its old page showed two photos twice).
- **Grouping the gallery by service: not built.** The crawl names the work on 11 of 133 jobs only (9 descriptions + 2 titles), so a service filter would hide most of the archive. It needs Paul to tag the jobs.

## Paint correction rebuilt: blocks 55–56 (08/10)

Fender: QC the page and rebuild it from what the other pages taught. Paul's words unchanged (checked against `../crawl/v05/pages/paint-correction.md`). Page: hero · diagnosis (beam, unchanged) · **55 tools** · **56 scope** · process on a stage (Paul's hands on the M3, `pc-polish`) · quote beside one photo of Paul (`pc-seat`; the Pagani photo behind it read as a second hero) · work (Gallardo + Alfa side by side on phones too) · reviews · book (+ v0.5's "View Packages", `bookMore`).

- **55 tools** (`lib/correction.js` tools()): heading + Paul's two paragraphs centred, three equal instruments, each with a picture: depth gauge photo, Paul's own gloss & orange peel meter (`pc-gloss`, Drive), and the paint under a microscope ring drawn in code. The gauge's caption sits under its words so the three names line up. Phones: one row per instrument, a 116 px picture beside its name. Was heading-left / text-right like the diagnosis above it, with one photo in three cards.
- **56 scope** (`lib/correction.js` scope(), `motion/scope.js`): one panel of black paint under an inspection light. Swirls, scratches, water spots and two deep scratches; each scratch is cut into segments that light only when square to the line to the light, so swirls ring the light as on a real car. A level removes its share of defects, shallowest first (I 70%, II 80%, III 87.5%, IV 95%, V 99.5%, from Paul's "Defect removal" figures); the haze lifts at I and the reflection sharpens. The panel arrives "before", then clears to level I. "Hold to see before" brings the defects back while pressed. Desktop: the mouse carries the light; stops I–V under the panel, the level's words beside it (all five in one cell, no jump). Phones/tablets: panel, five round stops, the levels as a row of cards to swipe (the page's one swipe row; Level V inverted), synced both ways; a finger dragging across the panel moves the light. Nothing pinned. Painted only while on screen. No JS: a CSS panel and every card.
- **Rolls-Royce photo**: v0.5's image is a before/after pair split across the middle (Fender 08/10: unbalanced), now only the lower "after" half. The car looks like a Mercedes-Benz 600 Pullman, not a Silver Shadow: caption kept, asked in REQUESTS §3.
- Shared fixes: stage photo scrim .92 + text shadow (block 23, also bodyshop); quote with one collage photo = photo column left, words beside (block 38); `is-half` work photos stay paired on phones (block 24).
- QA 08/10: 7 modes clean (desktop "hidden" = the four levels not picked, by design). Lighthouse mobile 96, LCP 2.1 s, CLS 0. Gotcha: a visually-hidden `.sr` inside a horizontal scroll row widened the phone page to 1,565 px (its containing block was the section): the cards are `position:relative`.

Round 2 (08/10, Fender's six notes): the panel's button reads "Hold here to see before"; on phones a level card gives the removal figure and the price a row each (the figure wrapped over itself beside the price); phones: a gold line fills down the step numbers and each number lights when reached (`svc.js` steps(), every steps block except swipe rows and aftercare's progress); the quote = Paul's photo sunk in behind (`quote.side`: desktop the right ~60% fading into the page, phones the whole section with the words low on a scrim); six more of Paul's cars under the work (Drive set: Enzo, Zonda, Monza SP, McLaren F1, 911 Carrera, 458 Speciale; car names only); a picture per process step (`stage.pics` + per-step `pic`/`img`, the stage crossfades; phones show it under the name): swirls under a light (old gallery, Aston Vantage), the C63 with its wheels off (old gallery: no decontamination photo exists, asked in REQUESTS), Paul's hands on the M3, an inspection light on a black panel (Drive). QA 7 modes clean.

Round 3 (08/10): phone level cards fit one screen with the panel (Fender: "các thẻ nhiều text quá"): two lines of Paul's words, then the price and "Read more" on one row; the sheet (`motion/sheet.js`, `.pks` copied into block 56) holds his full words, the removal figure and the price. The removal figure leaves the card (it is large on the panel) and so does Book (the sticky bar has it). Card 244 px; panel → count fits at 390×844 and 360×740. Phone panel 16:10. The quote on phones starts under the top third of the photo (78svh, was 118svh: "tách ra xa quá").
The Rolls-Royce photo and its caption are gone from the levels block (Fender, same day); the head is the title alone.
Narrow level cards (Fender's 320 px screenshot, price under Read more): the card is a wrapping row and a container query (text under 290 px) gives the price its own row and Read more the full width. Checked 320–430: no overlap; card 286 px at 360/390, panel → count fits at 360×740.
Paint depth gauge photo (08/10): Fender's file, renamed `assets-src/drive/paint-depth-gauge.avif` (was 77402_04.avif), 400 px source, replaces v0.5's screenshot in block 55 (`pc-gauge`).
Round 4 (08/10): desktop (1024+ wide, 600+ tall, motion on) holds the panel + words under the page bar (84 px, fixed) for 0.55 screen per level; the scroll walks I → V, the new level's words come in from the right and the last leave to the left (back = reverse); a stop scrolls to its level. The ivory edges don't close in while it's held (scroll.js lightBands). Phones: count/arrows 14 px under the cards (they touched).

## Wheel refurbishment rebuilt (08/10)

Fender: QC the page and rebuild it like Leather, with a showcase if the photo library has one. Paul's words unchanged (checked against `../crawl/v05/pages/wheel-refurbishment.md`). Page: hero · overview · what's available (4, rail) · why it matters · **the work** (block 57) · book.

- QC found: the desktop hero showed Paul's whole before/after collage, its seams and "»" behind the copy; on phones the hero (830 px at 360×740), the four cards (1,215 px) and "Why it matters" (1,071 px) each ran past one screen.
- Hero: `wheel-after-clean.png` = the "after" half of Paul's Drive collage, its "AFTER" label covered with the blurred workshop just below it (composed in code, nothing redrawn), on every screen; `shift` (desktop: wheel on the right, copy on the dark) + `fit` (phones: ends above the sticky bar).
- What's available: `compact` like Leather (photo, name, line, price, Read more); phones 16:9 photos, price on one line, no gap left by the folded words (`#available.scards--compact`).
- Why it matters: new cards option `brief` (rides on compact's button): on phones each reason is one row (numeral, name, a gold ring), a tap anywhere on the row opens its words; desktop unchanged; no JS = all words shown.
- **The work** (block 57, new options `square` and per-job `bl`/`al` labels; Leather keeps Before/After): the library holds one real before & after for wheels (the VW in Paul's collage, cropped to a 445 px square: a little soft). The other three jobs are finished wheels from the old site, each whole and up close (Cupra, Audi Sport, Porsche): labelled "Finished" / "Up close", never "Before". `-3/-5/-7/-8` were on the old server but not linked from its page; downloaded to `assets-src/old-site/`.
- Measured at 360×740 / 390×844: hero ends at 646 / 666, every block fits one screen. QA 7 modes clean (the 6 "hidden" captions are the three jobs not on stage). Lighthouse mobile 99, LCP 2.1 s, CLS 0. Pair thumbnails' labels now read "Job 01 of 04" (they contain the visible number; Leather too).

## Aftercare rebuilt: block 58, the wash checklist (09/10)

Fender: QA the page and build it (PLAN-interactions #6). Paul's words unchanged. Page: hero · the six rules · **the procedure** (block 58) · products (8) · discount code · reviews · book.

- QC found: the eight steps sat under no heading (v0.5 had the correction page's), with an empty band above them on desktop; the "Step 4 / 8" pill sat on top of step 4's ring; on phones the steps were a swipe row with folded words; the six rules ran ~3 phone screens; the reviews sat on the same water-spray photo as the hero; step tags all pointed at the products section; the code had no way to copy it.
- **Block 58** (`58-ac-check`, `motion/check.js`): a ring per step ticks it off (gold fill, tick draws), count "n / 8", a bar, "Start again"; kept on this device (`localStorage` key `md-check:aftercare-wash`, try/catch). Desktop: heading, Paul's coated blue panel beading (Drive, `ac-bead`) and the count held on the left (sticky from 1024 × 760), every step open on the right; the next step to do keeps a brighter ring. Tablet: heading + count beside the photo. Phones: one row per step (ring, name, open); the name or the chevron opens it; ticking folds it and opens the next one still to do. Nothing pinned on phones. No JS: the eight steps numbered and open, no rings.
- Heading "Eight steps. Every wash." and the line under it are new UI copy (REQUESTS still asks Paul for a heading).
- Tags go to their own product card (`anchor: 'ac-…'`; on phones the card opens first, then the page scrolls itself: a ScrollTrigger refresh stopped the normal anchor jump halfway) and the card glows once. Buckets, Grit Guards, Wheel Brush and Barrel Brush have no card: plain grey labels.
- Six rules: cards `brief` (phones one row each, like Wheels). Hero `fit`. Discount band: `band.copy` → "Copy code" button (clipboard, textarea fallback, "Copied" for 2 s). Reviews background on this page: `ac-revs` (dark red macro) instead of `bg-reviews`.
- QA 7 modes clean; phone checks: tick → next opens, reload keeps 8/8, Start again → 0, tag → card open at 96 px, copy → clipboard "MIRACLE". Lighthouse mobile 94 (LCP 3.1 s = the hero's gold line, not the photo: its CSS entrance paints late; PPF shows the same, 87; Tint 99).

## Bodyshop & paint repair rebuilt (09/10)

Fender: QA the page and rebuild it. Paul's words unchanged. Page: hero · overview · what's available (4, rail) · why · **the work** (block 57) · how it works (stage) · one call + its steps · book.

- QC found: the overview showed v0.5's Mercedes 600 collage split across one frame (Fender's rule: never); the process stage held one unrelated photo (a Ferrari Roma at a show, a correction photo) for all four steps; the four services were words only (phones: a tap-to-open list); "Why" ran ~2 phone screens. Paul's Drive "bodyshop pictures" folder (9 booth photos) was unused but for the hero.
- Photos (`tools/images-pages.js`, `bs-*`): overview = a grey car masked under plastic (16:10); a photo per service: I the red rear quarter refinished, II a grey door sprayed, III a white car masked for a full respray, IV blue panels off the car on stands; a photo per step (`stage.pics`): an inspection light on gloss paint, a black bonnet in the booth, Paul polishing the M3 (another shot than Correction's), PPF laid over a red Jaguar.
- What's available `compact`, Why `brief` (as Wheels).
- **The work** (block 57, new options): the Mercedes 600 collage cut at its seam (y 559/563) into its two halves, "Bare metal" / "Painted", one above the other at 2:1 (`wide`); one job alone = no picker, no count (`one`); its "after" still opens on arrival (pairs.js marks every pairs section seen, not only multi-job ones). Placed after Why so the grounds alternate (one call + its steps are ivory).
- QA 09/10: 7 modes clean. 360×740: overview 757, available 807, why 554, the work 656 (section heights incl. padding; Wheels: 722 / 827 / 603 / 569).

## Paintless dent removal rebuilt (09/10)

Fender: QC the page and rebuild it. Paul's words unchanged (checked against `../crawl/v05/pages/paintless-dent-removal.md`); v0.5's second button "Bodyshop & Paint Repair" was missing, now `bookMore`. Page: hero · overview (+ photo) · how it works (prose) · **block 59** · PDR vs repair · right for · book.

- QC found: one photo on the whole page (the hero); "How it works" prose and the five steps two dark blocks of words back to back, the steps' stage an empty ring with a number; on phones the comparison 1,057 px and "Right for" 1,150 px; "Right for" dark straight into the dark booking block; Paul's second PDR photo (E30 M3, `dent-removal-pics/F2F9…`) unused.
- Overview: that E30 photo (`pd-e30`, a 16:10 crop: rod at the tail light, light board at the quarter).
- **Block 59** (`59-pd-read`, `motion/dent.js`, PLAN-interactions §4 "PDR"): one panel of black paint mirroring a striped light board, drawn per pixel: each pixel shows the stripe its slope reflects, so the lines bend and pinch round a dent (a Gaussian hollow). The five steps tell it: a gold ring measures the dent (Assessment); the tool's tip, a tiny raised bump, shows as a tick travelling through the lines to the back of the dent (Access); it works round the dent while the dent rises out and the lines run straight (Manipulation); the board turns ~40° and the lines stay straight (Inspection); the lines sharpen, the black deepens, a gloss pass crosses (Detailing follows). Desktop: the 4:5 panel holds still on the left, the steps pass on the right, the step at 55% of the screen lights, the number turns over. Phones/tablets: an 8:3 strip of the panel stays under the page bar (~1/6 of the screen) while the steps pass under it. Reduced motion: each step's finished state, nothing moving. No JS: the steps alone. Painted only while on screen. This is the page's one effect.
- PDR vs repair: phones show one list under a switch "PDR | Traditional repair" (new UI labels; the cards keep Paul's full names); a sideways swipe on the list switches too. Desktop unchanged. The hidden card counts as 9 "hidden" texts at 390 in qa.js, by design.
- Right for: graphite (no longer dark into dark), each kind of dent drawn by the same painter (one ding, hail, a larger dent); phones `brief` rows with the drawing as the row's thumbnail, tap opens the words. No JS: no drawings, numerals back.
- Measured 360×740: overview 687, how 484, comparison 781, right for 757 (each about one screen); the steps run 1,156 under the strip. QA 7 modes clean, 0 overflow, 0 errors. Lighthouse mobile 95 (LCP 2.9 s, CLS 0, TBT 60 ms), accessibility 98.
- Block number: 58 was taken the same day by aftercare's checklist (`58-ac-check`), so this one is 59.
- **Same day, Fender: photos instead of the drawings.** "dùng ảnh gen AI phù hợp … close up ultra real để nhìn vào vẫn uy tín", for every drawing on the page (the step panel and the three "Right for" pictures). Eight renders, GPT Image 2.5 sunburst 2k (Higgsfield), in `../assets-src/pdr/`: `step1-assess` … `step5-detail` (4:5) and `for-ding`, `for-hail`, `for-large` (16:9). Step 5's first render had three hands; re-rendered. No text, logos or faces in any. Block 59 now: desktop the stage crossfades the step's photo (`pd-s1`…`s5`), number turns over, gold bar fills; phones/tablets each step's 16:10 crop (`pd-s1m`…) under its name, no sticky strip any more; no JS the same. "Right for" cards carry `pd-ding/-hail/-large` (phones: the row's thumbnail). The canvas painter is gone from `motion/dent.js` (it keeps the step tracking and the phone switch). AI renders stand in until Paul sends his own (REQUESTS). QA 7 modes clean, Lighthouse mobile 95 (LCP 3.0 s, CLS 0).
- Step 5 (Fender, same day): Paul's own photo replaces the AI render: his hands polishing the M3's bonnet (`paul-polishing-bmw-m3-to/4A1EB473…`, not used elsewhere), `pd-s5` 4:5 / `pd-s5m` 16:10. The other seven pictures stay AI renders.
