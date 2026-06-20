/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsCultureParser from './parsers/cards-culture.js';
import columnsBenefitsParser from './parsers/columns-benefits.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/888spectate-cleanup.js';
import sectionsTransformer from './transformers/888spectate-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-culture': cardsCultureParser,
  'columns-benefits': columnsBenefitsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'careers-landing',
  description: 'Careers landing page: nav header, hero banner, current-positions jobs widget, who-are-we intro text, why-work culture cards grid, benefits two-column list, footer.',
  urls: [
    'https://www.888spectate.com/',
    'https://www.888spectate.com/index.html',
  ],
  blocks: [
    { name: 'hero-banner', instances: ['body > header.container__header-banner'] },
    { name: 'fragment', instances: ['#current-positions #BambooHR'] },
    { name: 'cards-culture', instances: ['#swup > section.container__section:nth-of-type(3)'] },
    { name: 'columns-benefits', instances: ['#swup > section.container__section:nth-of-type(4)'] },
    { name: 'modal', instances: ['body > button.evoke-tab'] },
    { name: 'section-who-are-we', instances: ['#swup > section.container__section-who-are-we'], section: 'dark' },
  ],
  sections: [
    { id: 'rc2', name: 'hero', selector: ['body > header.container__header-banner'], style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'rc3', name: 'current-positions', selector: ['#current-positions'], style: 'light', blocks: ['fragment'], defaultContent: ['#current-positions > h1.container__main-header'] },
    { id: 'rc4', name: 'who-are-we', selector: ['#swup > section.container__section-who-are-we'], style: 'dark', blocks: [], defaultContent: ['#swup > section.container__section-who-are-we'] },
    { id: 'rc5', name: 'why-work-heading', selector: ['#swup > h1.container__main-header:nth-of-type(1)'], style: null, blocks: [], defaultContent: ['#swup > h1.container__main-header:nth-of-type(1)'] },
    { id: 'rc6', name: 'culture-cards', selector: ['#swup > section.container__section:nth-of-type(3)'], style: 'light', blocks: ['cards-culture'], defaultContent: [] },
    { id: 'rc7', name: 'benefits-heading', selector: ['#swup > h1.container__main-header:nth-of-type(2)'], style: null, blocks: [], defaultContent: ['#swup > h1.container__main-header:nth-of-type(2)'] },
    { id: 'rc8', name: 'benefits', selector: ['#swup > section.container__section:nth-of-type(4)'], style: 'light', blocks: ['columns-benefits'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name, selector, element, section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    let path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );
    // Ensure an absolute path. The bundled path.resolve() polyfill falls back to
    // process.cwd() for relative paths, which throws on pages (e.g. the home page)
    // whose third-party scripts clobber the importer's internal process shim.
    if (!path || path === '.') path = '/index';
    if (!path.startsWith('/')) path = `/${path}`;

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
