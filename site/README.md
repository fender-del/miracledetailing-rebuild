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
| Journal (placeholder text, noindex) | `25-journal.js` | /journal/ |

- **A block used twice on a page:** `blocks: [{ block: '33-svc-prose', with: { prose: … } }]` (build.js). Helpers in `lib/shared.js` (`cards`, `prose`, `quote`, `steps`) set every key, because the template engine looks a missing key up in the outer context.
- **New blocks:** 37 cards (variants boxed / points / versus; three or more boxed cards swipe as a row on phones), 38 quote (words lit one by one, optional photo ground), 39 price band, 40 timeline (About), 41 gallery (+ `motion/gallery.js`). 33 prose gained a list, price, photo caption, before/after tags, photo on the right; 23 steps any count, step tags, no heading; 21 proof any count; 24 work optional heading and full/half/third widths; 28 FAQ and 30 cold take their heading from the page.
- **Photos:** `tools/images-pages.js` (read by images.js). v0.5's own page photos (`../assets-src/v05pages/<slug>/`, from each page's Elementor CSS), then the old site's service photos (`../assets-src/old-site/`). Gallery: `tools/gallery.js` -> `assets/gallery/<job>/<n>-480|1400.webp` + `src/lib/gallery.json` (125 MB).
- **v0.5 slips** fixed or left out (ceramic/tint paragraphs swapped, leather areas carrying PPF lines, duplicated headings…): each page's header comment, and REQUESTS section 3.
- **Menu / footer:** no links to pages that do not exist (new car, supercar, classic, contact, privacy, terms). "Contact" opens the booking form.

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
