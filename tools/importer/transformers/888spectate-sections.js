/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: 888spectate section breaks + Section Metadata.
 *
 * Template-driven (template-agnostic): reads payload.template.sections and, for
 * each section, inserts an <hr> before every non-first section and a
 * "Section Metadata" block after any section that declares a `style`.
 * Section selectors come from page-templates.json (validated DOM selectors).
 *
 * Runs in afterTransform only — block parsers run between the hooks, so section
 * structure must be applied after blocks have been extracted.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  if (!template || !Array.isArray(template.sections) || template.sections.length < 2) return;

  const doc = element.ownerDocument;
  const sections = template.sections;

  // Process in reverse so insertions don't shift the positions of earlier sections.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

    // Find the first element that matches any of this section's selectors.
    let anchor = null;
    for (const sel of selectors) {
      if (!sel) continue;
      anchor = element.querySelector(sel);
      if (anchor) break;
    }
    if (!anchor) continue;

    // Section Metadata block (after the section) when a style is declared.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (anchor.nextSibling) {
        anchor.parentNode.insertBefore(metaBlock, anchor.nextSibling);
      } else {
        anchor.parentNode.appendChild(metaBlock);
      }
    }

    // Section break (<hr>) before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      anchor.parentNode.insertBefore(hr, anchor);
    }
  }
}
