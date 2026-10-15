/* The pages on the board, in the order Paul meets them. */
module.exports = [
  { id: 'home', path: '', name: 'Homepage', group: 'Main pages' },
  { id: 'services', path: 'car-care-services/', name: 'Services', group: 'Main pages' },
  { id: 'packages', path: 'car-detailing-studio/', name: 'Packages', group: 'Main pages' },
  /* the timeline dims the years you have not scrolled to: all lit for the board */
  { id: 'about', path: 'about-paul-dalton-car-detailing/', name: 'About Paul', group: 'Main pages', css: '.tl.is-stage .tl__it{opacity:1!important}' },
  { id: 'gallery', path: 'car-detail-gallery/', name: 'Gallery', group: 'Main pages' },
  { id: 'ppf', path: 'paint-protection-film-ppf/', name: 'Paint Protection Film', group: 'Services' },
  { id: 'ceramic', path: 'ceramic-coatings/', name: 'Ceramic Coating', group: 'Services' },
  { id: 'correction', path: 'paint-correction-and-polishing/', name: 'Paint Correction', group: 'Services' },
  { id: 'tint', path: 'window-tinting/', name: 'Window Tinting', group: 'Services' },
  { id: 'dry-ice', path: 'dry-ice-blasting-and-laser-cleaning/', name: 'Dry Ice Cleaning', group: 'Services' },
  { id: 'mobile', path: 'mobile-car-detailing/', name: 'Mobile Detailing', group: 'Services' },
  { id: 'bodyshop', path: 'bodyshop-repair/', name: 'Bodyshop & Paint Repair', group: 'Services' },
  { id: 'pdr', path: 'paintless-dent-removal/', name: 'Paintless Dent Removal', group: 'Services' },
  { id: 'wheels', path: 'wheel-refurbishment/', name: 'Wheel Refurbishment', group: 'Services' },
  { id: 'leather', path: 'leather-restoration/', name: 'Leather Restoration', group: 'Services' },
  { id: 'aftercare', path: 'aftercare-washing-guide/', name: 'Aftercare Guide', group: 'Services' },
  { id: 'journal', path: 'journal/', name: 'Journal', group: 'Journal' },
  { id: 'post-competition', path: 'facebook-competition/', name: 'Facebook Competition (post)', group: 'Journal' },
  { id: 'post-launch', path: 'new-product-launch/', name: 'New Product Launch (post)', group: 'Journal' }
];
