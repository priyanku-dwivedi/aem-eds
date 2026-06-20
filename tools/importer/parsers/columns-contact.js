/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base: columns.
 * Source: https://www.888spectate.com/contact.html
 * xwalk project — Columns block: NO field hints (Columns blocks use default
 * content only). Single content row, one cell per column:
 *   col 1 = ADDRESS heading + address paragraph,
 *   col 2 = EMAIL heading + mailto link.
 */
export default function parse(element, { document }) {
  // Each contact article is a column.
  const columns = Array.from(
    element.querySelectorAll(':scope > .main-content__article, :scope > div')
  ).filter((d) => d.querySelector('h1, h2, h3, h4, p, a'));

  if (!columns.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One content row; one cell per column. No field hints for Columns blocks.
  const row = columns.map((col) => {
    const content = Array.from(
      col.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > a')
    );
    return content.length ? content : col;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
