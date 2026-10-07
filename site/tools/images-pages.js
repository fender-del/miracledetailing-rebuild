/* ============================================================
   images-pages.js — photos for the v0.5 pages rebuilt on 06/10
   (Fender: "only the pages v0.5 has"). Read by tools/images.js.

   Sources, in order of preference:
     v05pages/<slug>/  the photos each v0.5 page shows (its Elementor
                       backgrounds and images), downloaded 06/10
     old-site/         the old miracledetail.co.uk service photos
     drive/            the Drive set already used on the homepage
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
  ...hero('cc-hero', V + 'ceramic-coatings/download-99.jpg', { l: .3, t: 0, w: .5, h: 1 }),
  { id: 'cc-paul',    src: O + '2024_08_Feynlab-Ceramic-Paul-Dalton.jpg', crop: { l: .12, t: 0, w: .76, h: 1 }, widths: [600, 900, 1400] },
  { id: 'cc-laf',     src: O + '2023_11_Top-Quality-Ceramic-Coatings-in-Lingfield-Surrey-miracle-detail.jpg', widths: [600, 900, 1200] },
  { id: 'cc-laf2',    src: O + '2023_11_Top-Quality-Ceramic-Coatings-in-Lingfield-Surrey-miracle-detail-2.jpg', widths: [600, 900, 1200] },
  { id: 'cc-veyron',  src: V + 'ceramic-coatings/download-98.jpg', widths: W },
  { id: 'cc-f1',      src: V + 'ceramic-coatings/download-99.jpg', widths: W },
  { id: 'cc-wheel',   src: 'drive/20-gfw-458-speciale.jpg', crop: { l: 0, t: .4, w: .6, h: .5 }, widths: [600, 900, 1200] },

  /* ---------- Paint correction ---------- */
  ...hero('pc-hero', V + 'paint-correction/download-72.webp', { l: .3, t: 0, w: .5, h: 1 }),
  { id: 'pc-split',  src: V + 'paint-correction/download-73.jpg', widths: [600, 900, 1280] },
  { id: 'pc-gauge',  src: V + 'paint-correction/Screenshot-2026-08-16-150942.png', widths: [502] },
  { id: 'pc-rolls',  src: V + 'paint-correction/download-74.jpg', crop: { l: 0, t: .12, w: 1, h: .76 }, widths: W },
  { id: 'pc-pagani', src: V + 'paint-correction/download-78.jpg', widths: [700, 1000] },
  { id: 'pc-gallardo', src: V + 'paint-correction/download-75.jpg', widths: W },
  { id: 'pc-alfa',   src: V + 'paint-correction/download-76.jpg', widths: W },
  { id: 'pc-f40',    src: V + 'paint-correction/download-77.jpg', widths: W },

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
  ...hero('mb-hero', V + 'about-paul/download-33-1.jpg', { l: .15, t: 0, w: .6, h: 1 }),
  { id: 'mb-pagani', src: O + '2023_11_Miracle-Detail-near-Kent-mobile-detailing-1024x576.jpg.webp', widths: [600, 1024] },
  { id: 'mb-spyker', src: O + '2023_11_Miracle-Detail-near-Sussex-mobile-auto-detailing-1024x576.jpg.webp', widths: [600, 1024] },
  { id: 'mb-polish', src: O + '2023_11_Miracle-Detail-LINGFIELD-SURREY-Mobile-auto-detailing.jpg', widths: [600, 1200] },
  { id: 'mb-f12',    src: V + 'about-paul/download-30-1.jpg', widths: W },
  { id: 'mb-599',    src: V + 'about-paul/download-31-1.jpg', widths: W },
  { id: 'mb-f12b',   src: V + 'about-paul/download-32-1.jpg', widths: W },

  /* ---------- Bodyshop ---------- */
  ...hero('bs-hero', O + '2023_11_High-class-Bodyshop-repairs-andbo-renovation-in-Lingfield-Surrey-miracle-detail.jpg', { l: .25, t: 0, w: .5, h: 1 }),
  { id: 'bs-600',    src: V + 'about-paul/download-24-1.jpg', widths: [600, 1125] },
  { id: 'bs-roma',   src: O + '2023_11_Paint-Correction-and-Polishing-in-Lingfield-Surrey-miracle-detail-3.jpg', widths: [600, 1200] },

  /* ---------- PDR ---------- */
  ...hero('pd-hero', 'drive/02-gfw-red-macro-dark.jpg', { l: .3, t: 0, w: .45, h: 1 }),

  /* ---------- Wheels ---------- */
  ...hero('wr-hero', O + '2023_11_Wheel-Refurbishment-in-Lingfield-SurreY-MIRACLE-DETAIL.jpg', { l: 0, t: 0, w: .5, h: 1 }),
  { id: 'wr-stands', src: O + '2023_11_Excellent-Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail.jpg', widths: [600, 1200] },
  { id: 'wr-audi',   src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail-2.jpg', widths: [600, 1200] },
  { id: 'wr-face',   src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail-4.jpg', widths: [600, 1200] },
  { id: 'wr-spoke',  src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail-6.jpg', widths: [600, 1200] },
  { id: 'wr-porsche', src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-Surrey.-Miracle-Detail.jpg', widths: [600, 1200] },
  { id: 'wr-bronze', src: O + '2023_11_Wheel-Refurbishment-in-Lingfield-SurreY-MIRACLE-DETAIL-2.jpg', widths: [600, 1440] },

  /* ---------- Leather ---------- */
  ...hero('lr-hero', O + '2023_11_High-quality-Auto-Leather-Restoration-in-Lingfield-Surrey-miracle-detail.jpg', { l: .25, t: 0, w: .5, h: 1 }),
  { id: 'lr-seat',   src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-10.jpeg', widths: [480, 768] },
  { id: 'lr-bolster', src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-11.jpeg', widths: [480, 768] },
  { id: 'lr-red',    src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-12.jpeg', widths: [480, 768] },
  { id: 'lr-worn',   src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-3.jpeg', widths: [480, 768] },
  { id: 'lr-fixed',  src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-6.jpeg', widths: [480, 768] },
  { id: 'lr-base',   src: O + '2023_12_Auto-Leather-Restoration-services-in-Lingfield-Surrey-8.jpeg', widths: [480, 768] },

  /* ---------- Packages ---------- */
  ...hero('pk-hero', V + 'packages/download-68.webp', { l: .3, t: 0, w: .45, h: 1 }),
  { id: 'pk-split',  src: V + 'packages/download-69-scaled.webp', crop: { l: 0, t: .2, w: 1, h: .5 }, widths: [600, 1179] },
  { id: 'pk-pagani', src: V + 'packages/download-70.jpg', widths: [600, 1000] },
  { id: 'pk-dry',    src: V + 'packages/download-71.jpg', widths: W },

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
  ...hero('gl-hero', 'drive/12-bugatti-studio.png', { l: .25, t: 0, w: .5, h: 1 }),
  ...hero('jn-hero', 'drive/16-studio-interior.png', { l: .25, t: 0, w: .5, h: 1 })
];
