/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-culture. Base: cards.
 * Source: https://www.888spectate.com/
 * xwalk project — container block. Each card = one row with two cells:
 *   cell 1 = image (field:image), cell 2 = text richtext (field:text).
 * Source cards render their icon via a CSS class on the article div (no <img>),
 * so the image cell is left empty (no field hint on empty cells).
 */
export default function parse(element, { document }) {
  // Each card is an article div in the section.
  const cards = Array.from(
    element.querySelectorAll(':scope > .main-content__article, :scope > div')
  ).filter((d) => d.querySelector('h2, h3, h4, p') || d.querySelector('img'));

  const cells = [];

  cards.forEach((card) => {
    // Image cell — icons are CSS-driven so usually no <img> in source.
    const img = card.querySelector('img');
    let imageCell = '';
    if (img) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(img);
      imageCell = frag;
    }

    // Text cell — heading + descriptive paragraph(s) as richtext.
    const textParts = Array.from(
      card.querySelectorAll('h1, h2, h3, h4, h5, h6, p')
    );
    let textCell = '';
    if (textParts.length) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      textParts.forEach((el) => frag.appendChild(el));
      textCell = frag;
    }

    cells.push([imageCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-culture', cells });
  element.replaceWith(block);
}
