/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: 888spectate (careers site) site-wide cleanup.
 *
 * All selectors verified against migration-work/cleaned.html and the validated
 * block mappings in tools/importer/page-templates.json. Nothing here is guessed.
 *
 * Non-authorable site chrome that becomes auto-populated header/footer blocks is
 * removed. Authorable content that is mapped to a block (hero-banner, modal,
 * fragment) is intentionally preserved for the parsers.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove dynamic third-party / interactive content that has NO static parser
    // and cannot be meaningfully captured as static content. Done in beforeTransform
    // so it never reaches the markdown conversion (the embedded BambooHR ATS widget
    // markup breaks html2md). These are reauthored later as fragment/modal references.
    //   #BambooHR / .BambooHR-ATS-board — dynamic BambooHR jobs widget (careers page)
    //   button.evoke-tab / .evoke-dialog__container — interactive evoke modal overlay
    //   iframe — Google Maps embed (contact page) and any other third-party iframe
    //   script / style / noscript — non-content
    WebImporter.DOMUtils.remove(element, [
      '#BambooHR',
      '.BambooHR-ATS-board',
      'button.evoke-tab',
      '.evoke-dialog__container',
      'iframe',
      'script',
      'style',
      'noscript',
    ]);

    // NOTE: the swup.js SPA wrapper (<main id="swup">) is intentionally LEFT intact.
    // Block instance selectors in page-templates.json are scoped under "#swup > ..."
    // and must resolve during block discovery (which runs after beforeTransform).
    // html2md flattens the wrapper div automatically, so no unwrap is needed.
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome — these become auto-populated EDS header/footer
    // blocks, so they must not appear in page content.
    //   nav.container__nav       — site nav    (cleaned.html line 2)
    //   footer.container__footer — site footer (cleaned.html line 271)
    // header.container__header-banner (hero-banner) is preserved for its parser.
    WebImporter.DOMUtils.remove(element, [
      'nav.container__nav',
      'footer.container__footer',
    ]);
  }
}
