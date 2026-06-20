/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-benefits. Base: columns.
 * Source: https://www.888spectate.com/
 * xwalk project — Columns block: NO field hints (Columns blocks use default
 * content only). Single content row with one cell per column; each cell holds
 * a bulleted list of benefits.
 */
export default function parse(element, { document }) {
  // Each benefits article is a column.
  const columns = Array.from(
    element.querySelectorAll(':scope > .main-content__article-benefits, :scope > div')
  ).filter((d) => d.querySelector('ul, ol, li, p'));

  if (!columns.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One content row; one cell per column. No field hints for Columns blocks.
  const row = columns.map((col) => {
    const content = Array.from(col.querySelectorAll(':scope > ul, :scope > ol, :scope > p'));
    return content.length ? content : col;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-benefits', cells });
  element.replaceWith(block);
}
