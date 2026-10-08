/* ============================================================
   images-pages.js — photos for the v0.5 pages rebuilt on 06/10
   (Fender: "only the pages v0.5 has"). Read by tools/images.js.

   Sources, in order of preference:
     v05pages/<slug>/  the photos each v0.5 page shows (its Elementor
                       backgrounds and images), downloaded 06/10
     old-site/         the old miracledetail.co.uk service photos
     drive/            the Drive set already used on the homepage
     drive-paul/       Paul's "High res pics for Ed" Drive folder (07/10),
                       the heroes that show the work itself
   A page v0.5 shows no photo for (tint, bodyshop, PDR, wheels,
   leather, aftercare) borrows the old site's own photos of that work.
   ============================================================ */
'use strict';
const V = 'v05pages/';
const O = 'old-site/';

/* a hero = a wide crop for desktops and a taller one for phones */
const hero = (id, src, m = { l: .2, t: 0, w: .6, h: 1 }, q = 54) => [
  { id, src, widths: [960, 1440, 2048], q },
  { id: id + '-m', src, crop: m, widths: [480, 720, 1080], q }
];
const W = [600, 900, 1200];

module.exports = [
  /* ---------- Dry ice ---------- */
  ...hero('dx-hero', V + 'dry-ice-cleaning/download-60.webp', { l: .12, t: 0, w: .55, h: 1 }),
  { id: 'dx-exp',  src: V + 'dry-ice-cleaning/download-62.webp', widths: [700, 1100, 1600] },
  { id: 'dx-64',   src: V + 'dry-ice-cleaning/download-64.webp', widths: [600, 960] },
  { id: 'dx-65',   src: V + 'dry-ice-cleaning/download-65.webp', widths: W },
  { id: 'dx-66',   src: V + 'dry-ice-cleaning/download-66.webp', widths: W },
  { id: 'dx-67',   src: V + 'dry-ice-cleaning/download-67.webp', widths: W },

  /* ---------- Ceramic ---------- */
  /* hero = the McLaren F1 v0.5 shows (Paul's job); Paul with his own
     coating carries "Ceramic by Paul Dalton" */
  /* 08/10: a coating being applied, the suede applicator on blue paint
     (Fender's pick, assets-src/ceramic hero.png; the Drive beading photo
     was water on PPF, and Paul's set has no coating shot) */
  ...hero('cc-hero', 'ceramic hero.png', { l: .22, t: 0, w: .66, h: 1 }),
  { id: 'cc-paul',    src: O + '2024_08_Feynlab-Ceramic-Paul-Dalton.jpg', crop: { l: .12, t: 0, w: .76, h: 1 }, widths: [600, 900, 1400] },
  { id: 'cc-laf',     src: O + '2023_11_Top-Quality-Ceramic-Coatings-in-Lingfield-Surrey-miracle-detail.jpg', widths: [600, 900, 1200] },
  { id: 'cc-laf2',    src: O + '2023_11_Top-Quality-Ceramic-Coatings-in-Lingfield-Surrey-miracle-detail-2.jpg', widths: [600, 900, 1200] },
  { id: 'cc-veyron',  src: V + 'ceramic-coatings/download-98.jpg', widths: W },
  { id: 'cc-f1',      src: V + 'ceramic-coatings/download-99.jpg', widths: W },
  /* 08/10: the product itself in place of the red LaFerrari (Fender):
     Feynlab's own cut-out bottle (old site) set on a dark studio floor,
     products/cc-bottle-studio.png, composed in code, nothing redrawn */
  { id: 'cc-bottle',  src: 'products/cc-bottle-studio.png', widths: [600, 900, 1400] },
  /* 08/10: more cars for the work grid (Fender: "cho thêm vài chiếc"),
     Paul's Drive set, none of them already on the Correction page */
  { id: 'cc-w-348',    src: 'drive-paul/7874F526-4D71-43A2-8A15-AA699EBC0D37.PNG', widths: [500, 800, 1100] },
  { id: 'cc-w-m3',     src: 'drive-paul/43A66CCD-792F-466A-9B58-9CD493AA852C.PNG', widths: [500, 800] },
  { id: 'cc-w-laf',    src: 'drive-paul/7F092959-7052-463A-BCD6-D79366144417.PNG', crop: { l: 0, t: .2, w: 1, h: .563 }, widths: [500, 800] },
  { id: 'cc-w-f50',    src: 'drive-paul/8BBD2C80-F2B6-4135-8BFA-DA13CA2CA434.PNG', widths: [500, 800] },
  { id: 'cc-w-sto',    src: 'drive-paul/1D9733C6-7379-413C-A370-F7D973DF1A4D 2.PNG', widths: [600, 900, 1200] },
  { id: 'cc-w-599',    src: 'drive-paul/38059B2A-8AC0-4D87-A082-3A08CDE2F9B7.PNG', widths: [600, 900, 1200] },
  { id: 'cc-wheel',   src: 'drive/20-gfw-458-speciale.jpg', crop: { l: 0, t: .4, w: .6, h: .5 }, widths: [600, 900, 1200] },

  /* ---------- Paint correction ---------- */
  ...hero('pc-hero', V + 'paint-correction/download-72.webp', { l: .3, t: 0, w: .5, h: 1 }),
  { id: 'pc-split',  src: V + 'paint-correction/download-73.jpg', widths: [600, 900, 1280] },
  /* 08/10: Fender's photo of a paint depth gauge in use (was v0.5's small screenshot), 400 px source */
  { id: 'pc-gauge',  src: 'drive/paint-depth-gauge.avif', crop: { l: 0, t: .08, w: 1, h: .75 }, widths: [400] },
  { id: 'pc-rolls',  src: V + 'paint-correction/download-74.jpg', crop: { l: .035, t: .485, w: .92, h: .515 }, widths: W },  /* 08/10: the lower (after) half only; v0.5 shows a before/after pair split across the middle (Fender: unbalanced) */
  { id: 'pc-pagani', src: V + 'paint-correction/download-78.jpg', widths: [700, 1000] },
  { id: 'pc-gallardo', src: V + 'paint-correction/download-75.jpg', widths: W },
  { id: 'pc-alfa',   src: V + 'paint-correction/download-76.jpg', widths: W },
  { id: 'pc-f40',    src: V + 'paint-correction/download-77.jpg', widths: W },
  /* 08/10 rebuild: Paul's Drive set, his gloss & orange peel meter and
     him polishing an M3 under the hex lights */
  { id: 'pc-gloss',  src: 'drive-paul/gloss-meter-pic/37077F18-952E-4750-A70F-5F06A6457865.png', widths: [600, 900, 1200] },
  { id: 'pc-polish', src: 'drive-paul/paul-polishing-bmw-m3-to/A22AB860-218C-4E49-AFA9-8ADFFF9B39DE.png', crop: { l: 0, t: .06, w: 1, h: .94 }, widths: [500, 800, 1080] },
  { id: 'pc-seat',   src: 'drive-paul/paul-polishing-bmw-m3-to/17E5B759-B2A0-41E1-9FB5-0317202D2108.png', widths: [500, 800, 1086] },
  /* 08/10 round 2: a picture per process step (Fender: "lựa ảnh phù hợp
     với các step"): swirls under a light (old gallery, Aston Vantage),
     the C63 with its wheels off (old gallery), Paul's hands on the M3,
     an inspection light held to a black panel (Drive) */
  { id: 'pc-s1', src: 'gallery/aston-martin-vantage-v8/02-gal-571-IMG_2957.jpg', crop: { l: .2, t: 0, w: .6, h: 1 }, widths: [500, 760] },
  { id: 'pc-s2', src: 'gallery/mercedes-c63-amg-brand-new-car-in-for-ultimate-detail/03-gal-614-DSC00004.jpg', crop: { l: .18, t: 0, w: .6, h: 1 }, widths: [500, 760] },
  { id: 'pc-s4', src: 'drive/06-paint-correction-pad.png', crop: { l: .04, t: 0, w: .5, h: 1 }, widths: [500, 768] },
  /* more cars for the work grid (Fender: "cho thêm nhiều xe"), Paul's Drive set */
  { id: 'pc-w-enzo',   src: 'drive-paul/053055E7-247C-4CD1-8359-3EDF9D99BACF.PNG', widths: [500, 800] },
  { id: 'pc-w-zonda',  src: 'drive-paul/0E5A99EA-6981-4FAD-8DCB-2CC4B41F5F3F.PNG', widths: [500, 800] },
  { id: 'pc-w-monza',  src: 'drive-paul/3952C70D-2C9F-4808-8EC0-225C03BC209B.PNG', crop: { l: .06, t: 0, w: .94, h: 1 }, widths: [500, 800] },
  { id: 'pc-w-f1',     src: 'drive-paul/538CBFA0-75B8-417F-AC36-54F812D4D390.PNG', widths: [500, 800] },
  { id: 'pc-w-911',    src: 'drive-paul/3CE10B77-8075-49E1-B6CE-EC3922ED8BB8.PNG', widths: [500, 800] },
  { id: 'pc-w-458',    src: 'drive-paul/523DD8E4-EB72-430C-9722-AD6EFA69A824.PNG', widths: [500, 800] },

  /* ---------- Window tinting ---------- */
  ...hero('wt-hero', O + '2023_11_The-Best-Quality-Window-Tinting-in-Lingfield-Surrey-Miracle-Detail.jpg', { l: .25, t: 0, w: .5, h: 1 }),
  { id: 'wt-film',   src: O + '2023_11_window-tinting-on-cars-at-miracle-detail.png', widths: [600, 900, 1089] },
  { id: 'wt-glass',  src: 'stock/pexels-20036216.jpg', crop: { l: .1, t: .1, w: .8, h: .8 }, widths: [600, 900, 1200] },
  /* 07/10 rebuild (Fender: "thiếu visual, dùng stock được"): Pexels,
     free licence. Polygons drawn over these live in pages/14-tint.js,
     measured in % of the crop below: re-crop = re-measure. */
  { id: 'wt-dyed',   src: 'stock/pexels-26691322.jpg', crop: { l: .05, t: .12, w: .9, h: .8 }, widths: [600, 900, 1300] },
  { id: 'wt-cham',   src: 'stock/pexels-1574846.jpg', widths: [600, 900, 1300] },
  { id: 'wt-screen', src: 'stock/pexels-39835378.jpg', widths: [600, 900, 1300] },
  { id: 'wt-jag',    src: 'stock/pexels-4096380.jpg', widths: [800, 1200, 1700, 2400] },
  { id: 'wt-merc',   src: 'stock/pexels-17233277.jpg', widths: [700, 1000, 1400, 1900] },
  { id: 'wt-side',   src: 'stock/pexels-20036216.jpg', crop: { l: 0, t: .14, w: 1, h: .643 }, widths: [900, 1400, 2000, 2600] },
  { id: 'wt-who-1',  src: 'stock/pexels-7594130.jpg', crop: { l: 0, t: .17, w: 1, h: .5 }, widths: [600, 900, 1200] },
  { id: 'wt-who-2',  src: 'stock/pexels-1467591.jpg', crop: { l: .05, t: .1, w: .9, h: .8 }, widths: [600, 900, 1200] },
  { id: 'wt-who-3',  src: 'stock/pexels-33203858.jpg', crop: { l: 0, t: .25, w: 1, h: .6 }, widths: [600, 900, 1200] },
  { id: 'wt-note',   src: 'stock/pexels-11877373.jpg', crop: { l: 0, t: .2, w: 1, h: .45 }, widths: [900, 1400, 2000], q: 46 },

  /* ---------- Mobile ---------- */
  /* phone crop widened 07/10 so the whole van shows (Fender) */
  ...hero('mb-hero', V + 'about-paul/download-33-1.jpg', { l: .1, t: 0, w: .64, h: 1 }),
  { id: 'mb-pagani', src: O + '2023_11_Miracle-Detail-near-Kent-mobile-detailing-1024x576.jpg.webp', widths: [600, 1024] },
  { id: 'mb-spyker', src: O + '2023_11_Miracle-Detail-near-Sussex-mobile-auto-detailing-1024x576.jpg.webp', widths: [600, 1024] },
  { id: 'mb-polish', src: O + '2023_11_Miracle-Detail-LINGFIELD-SURREY-Mobile-auto-detailing.jpg', widths: [600, 1200] },
  { id: 'mb-f12',    src: V + 'about-paul/download-30-1.jpg', widths: W },
  { id: 'mb-599',    src: V + 'about-paul/download-31-1.jpg', widths: W },
  { id: 'mb-f12b',   src: V + 'about-paul/download-32-1.jpg', widths: W },
  /* NOT the Portugal car: a 997 GT3 RS from Paul's gallery, standing in
     until Paul sends the Portugal one (REQUESTS) */
  { id: 'mb-gt3',    src: 'gallery/porsche-997-gt3rs-in-blue/01-gal-603-DSC01853.jpg', widths: [600, 900, 1200] },

  /* ---------- Bodyshop ---------- */
  ...hero('bs-hero', 'drive-paul/hero-bodyshop-masked.png', { l: .25, t: 0, w: .5, h: 1 }),  /* Paul's Drive set, 07/10 */
  { id: 'bs-600',    src: V + 'about-paul/download-24-1.jpg', widths: [600, 1125] },
  { id: 'bs-roma',   src: O + '2023_11_Paint-Correction-and-Polishing-in-Lingfield-Surrey-miracle-detail-3.jpg', widths: [600, 1200] },

  /* ---------- PDR ---------- */
  ...hero('pd-hero', 'drive-paul/hero-pdr-board.png', { l: 0, t: 0, w: 1, h: 1 }),  /* Paul's Drive set, 07/10 */

  /* ---------- Wheels ---------- */
  /* 08/10: the hero is the "after" half alone on every screen (the whole
     collage showed its seams and "»" on desktops). wheel-after-clean.png
     = that half of Paul's collage, its "AFTER" label covered with the
     blurred workshop just below it, composed in code, nothing redrawn. */
  ...hero('wr-hero', 'drive-paul/wheel-after-clean.png', { l: 0, t: 0, w: 1, h: 1 }),  /* Paul's Drive set, 07/10 */
  { id: 'wr-stands', src: O + '2023_11_Excellent-Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail.jpg', widths: [600, 1200] },
  { id: 'wr-audi',   src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail-2.jpg', widths: [600, 1200] },
  { id: 'wr-face',   src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail-4.jpg', widths: [600, 1200] },
  { id: 'wr-spoke',  src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail-6.jpg', widths: [600, 1200] },
  { id: 'wr-porsche', src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail.jpg', widths: [600, 1200] },
  { id: 'wr-bronze', src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-SurreY-MIRACLE-DETAIL-2.jpg', widths: [600, 1440] },
  /* 08/10 the work (block 57, square): the only real before & after is
     Paul's collage (VW); the old site's other wheel photos are finished
     wheels, two of each job (-3/-5/-7/-8 were on its server, unlinked) */
  { id: 'wr-vw-b',   src: 'drive-paul/hero-wheel-before-after.png', crop: { l: .14, t: 0, w: .2897, h: .4346 }, widths: [445] },
  { id: 'wr-vw-a',   src: 'drive-paul/wheel-after-clean.png', crop: { l: .0258, t: 0, w: .8682, h: 1 }, widths: [480, 672] },
  ...[['wr-cupra', '-5', .2183], ['wr-cupra-c', '-7', .2183], ['wr-audi-w', '-4', .1667], ['wr-audi-c', '-2', .2183], ['wr-911', '-9', .3333], ['wr-911-c', '-8', .2183]]
    .map(([id, n, l]) => ({ id, src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail' + n + '.jpg', crop: { l, t: 0, w: .5625, h: 1 }, widths: [480, 675] })),

  /* ---------- Leather ---------- */
  ...hero('lr-hero', O + '2023_11_High-quality-Auto-Leather-Restoration-in-Lingfield-Surrey-miracle-detail.jpg', { l: .25, t: 0, w: .5, h: 1 }),
  { id: 'lr-seat',   src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-10.jpeg', widths: [480, 768] },
  { id: 'lr-bolster', src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-11.jpeg', widths: [480, 768] },
  { id: 'lr-red',    src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-12.jpeg', widths: [480, 768] },
  { id: 'lr-worn',   src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-3.jpeg', widths: [480, 768] },
  { id: 'lr-fixed',  src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-6.jpeg', widths: [480, 768] },
  { id: 'lr-base',   src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-8.jpeg', widths: [480, 768] },
  /* the before halves of the old site's pairs (08/10, block 57): 9→10,
     5→6, 7→8, 11→12, 3→4 are the same seat before and after */
  ...['4', '5', '7', '9'].map(n => ({ id: 'lr-' + n, src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-' + n + '.jpeg', widths: [480, 768] })),

  /* ---------- Packages ---------- */
  ...hero('pk-hero', V + 'packages/download-68.webp', { l: .3, t: 0, w: .45, h: 1 }),
  { id: 'pk-split',  src: V + 'packages/download-69-scaled.webp', crop: { l: 0, t: .2, w: 1, h: .5 }, widths: [600, 1179] },
  { id: 'pk-pagani', src: V + 'packages/download-70.jpg', widths: [600, 1000] },
  { id: 'pk-dry',    src: V + 'packages/download-71.jpg', widths: W },
  /* the ladder (07/10): one photo per level, shown in its panel */
  { id: 'pk-l1', src: 'drive/03-gfw-water-beading.jpg', crop: { l: .25, t: .1, w: .7, h: .7 }, widths: W },
  { id: 'pk-l2', src: 'Ferrari-SF90-Spider-ceramic.jpg', crop: { l: 0, t: 0, w: .78, h: 1 }, widths: [600, 842] },
  { id: 'pk-l3', src: V + 'packages/download-69-scaled.webp', crop: { l: 0, t: .3, w: 1, h: .3 }, widths: [600, 1179] },
  { id: 'pk-l4', src: 'stock/pexels-37809561.jpg', crop: { l: .25, t: .42, w: .75, h: .3 }, widths: W },
  { id: 'pk-l5', src: V + 'packages/download-71.jpg', widths: W },
  { id: 'pk-wheel', src: 'drive/20-gfw-458-speciale.jpg', crop: { l: .22, t: .43, w: .7, h: .292 }, widths: [700, 1100, 1500] },
  { id: 'pk-note', src: V + 'packages/download-70.jpg', crop: { l: 0, t: .22, w: 1, h: .5 }, widths: [700, 1000], q: 50 },

  /* ---------- About Paul ---------- */
  ...hero('ab-hero', V + 'about-paul/download-21-1.jpg', { l: .3, t: 0, w: .5, h: 1 }),
  { id: 'ab-monza',  src: V + 'about-paul/download-49.jpg', widths: [600, 1125] },
  ...['1-1', '2-1', '3-1', '4-1', '5-1', '6-1', '7-1', '10-1', '11-1', '12-1', '13-1', '14-1', '15-1', '16-1', '17-1',
    '18-1', '19-1', '20-1', '22-1', '23-1', '24-1', '25-1', '26-1', '27-1', '28-1', '29-1', '30-1', '31-1', '32-1', '33-1',
    '34-1', '35-1', '36-1', '37-1', '38-1', '39-1', '40-1', '41-1', '42-1', '43-1', '44-1', '45-1',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '']
    .map(n => ({ id: 'ab-' + (n || 'laf'), src: V + 'about-paul/download' + (n ? '-' + n : '') + '.jpg', widths: [480, 900, 1400] })),

  /* ---------- Aftercare ---------- */
  ...hero('ac-hero', 'drive/03-gfw-water-beading.jpg', { l: .35, t: 0, w: .45, h: 1 }),

  /* ---------- Hubs ---------- */
  ...hero('sv-hero', 'drive/15-mclaren-studio.png', { l: .25, t: 0, w: .5, h: 1 }),
  /* the source is a phone screenshot: the phone crop keeps only the photo in it (08/10) */
  ...hero('gl-hero', 'drive/12-bugatti-studio.png', { l: .15, t: .26, w: .85, h: .4 }),
  ...hero('jn-hero', 'drive/16-studio-interior.png', { l: .25, t: 0, w: .5, h: 1 }),

  /* ---------- Journal posts (07/10): the old blog's two posts, their own
     photos (1920 originals) + the poster of the YouTube film both embed
     (sddefault is letterboxed 4:3: the bars are cropped off) ---------- */
  { id: 'jn-fb',     src: 'journal/fb-competition.jpg', widths: [600, 900, 1400, 1920] },
  { id: 'jn-npl',    src: 'journal/feynlab-ceramic-paul-dalton.jpg', widths: [600, 900, 1400, 1920] },
  { id: 'jn-bottle', src: 'journal/feynlab-ceramic-paul-dalton-bottle.jpg', widths: [300, 600] },
  { id: 'jn-yt',     src: 'journal/yt-sddefault.jpg', crop: { l: 0, t: .125, w: 1, h: .75 }, widths: [640] }
];
