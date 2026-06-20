/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.888spectate.com/
 * xwalk project — simple block, 1 column, up to 3 rows:
 *   row 2 = background image (field:image),
 *   row 3 = overlay content as richtext (field:text) — the centered logo image.
 * imageAlt is a collapsed field (no hint/row of its own).
 *
 * Robust to two representations:
 *  - scraped/cleaned HTML: real <img> elements (background first, logo inside .container__header-logo)
 *  - live DOM: images applied via CSS background-image; recovered from computed style.
 */
export default function parse(element, { document }) {
  const win = element.ownerDocument.defaultView || (typeof window !== 'undefined' ? window : null);

  const bgImageUrl = (el) => {
    if (!el || !win) return null;
    const bg = win.getComputedStyle(el).backgroundImage;
    const m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    return m ? m[1] : null;
  };

  const makeImg = (src, alt) => {
    const img = document.createElement('img');
    img.setAttribute('src', src);
    if (alt) img.setAttribute('alt', alt);
    return img;
  };

  const logoWrap = element.querySelector('.container__header-logo');

  // Background image: a top-level <img>, else the header's CSS background.
  let bgImage = element.querySelector(':scope > img');
  if (!bgImage) {
    const url = bgImageUrl(element);
    if (url) bgImage = makeImg(url, '');
  }

  // Logo overlay: an <img> inside the logo wrapper, else its CSS background.
  let logo = logoWrap ? logoWrap.querySelector('img') : element.querySelector('img:not(:first-of-type)');
  if (!logo && logoWrap) {
    const url = bgImageUrl(logoWrap);
    if (url) logo = makeImg(url, '888spectate');
  }

  if (!bgImage && !logo) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image cell (field:image).
  if (bgImage) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    frag.appendChild(bgImage);
    cells.push([frag]);
  } else {
    cells.push(['']);
  }

  // Row 3: overlay content cell (field:text) — the centered logo image.
  if (logo) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:text '));
    frag.appendChild(logo);
    cells.push([frag]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
