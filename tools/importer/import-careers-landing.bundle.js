/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-careers-landing.js
  var import_careers_landing_exports = {};
  __export(import_careers_landing_exports, {
    default: () => import_careers_landing_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const win = element.ownerDocument.defaultView || (typeof window !== "undefined" ? window : null);
    const bgImageUrl = (el) => {
      if (!el || !win) return null;
      const bg = win.getComputedStyle(el).backgroundImage;
      const m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
      return m ? m[1] : null;
    };
    const makeImg = (src, alt) => {
      const img = document.createElement("img");
      img.setAttribute("src", src);
      if (alt) img.setAttribute("alt", alt);
      return img;
    };
    const logoWrap = element.querySelector(".container__header-logo");
    let bgImage = element.querySelector(":scope > img");
    if (!bgImage) {
      const url = bgImageUrl(element);
      if (url) bgImage = makeImg(url, "");
    }
    let logo = logoWrap ? logoWrap.querySelector("img") : element.querySelector("img:not(:first-of-type)");
    if (!logo && logoWrap) {
      const url = bgImageUrl(logoWrap);
      if (url) logo = makeImg(url, "888spectate");
    }
    if (!bgImage && !logo) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:image "));
      frag.appendChild(bgImage);
      cells.push([frag]);
    } else {
      cells.push([""]);
    }
    if (logo) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:text "));
      frag.appendChild(logo);
      cells.push([frag]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-culture.js
  function parse2(element, { document }) {
    const cards = Array.from(
      element.querySelectorAll(":scope > .main-content__article, :scope > div")
    ).filter((d) => d.querySelector("h2, h3, h4, p") || d.querySelector("img"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      let imageCell = "";
      if (img) {
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(" field:image "));
        frag.appendChild(img);
        imageCell = frag;
      }
      const textParts = Array.from(
        card.querySelectorAll("h1, h2, h3, h4, h5, h6, p")
      );
      let textCell = "";
      if (textParts.length) {
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(" field:text "));
        textParts.forEach((el) => frag.appendChild(el));
        textCell = frag;
      }
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-culture", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-benefits.js
  function parse3(element, { document }) {
    const columns = Array.from(
      element.querySelectorAll(":scope > .main-content__article-benefits, :scope > div")
    ).filter((d) => d.querySelector("ul, ol, li, p"));
    if (!columns.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columns.map((col) => {
      const content = Array.from(col.querySelectorAll(":scope > ul, :scope > ol, :scope > p"));
      return content.length ? content : col;
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-benefits", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/888spectate-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#BambooHR",
        ".BambooHR-ATS-board",
        "button.evoke-tab",
        ".evoke-dialog__container",
        "iframe",
        "script",
        "style",
        "noscript"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "nav.container__nav",
        "footer.container__footer"
      ]);
    }
  }

  // tools/importer/transformers/888spectate-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    if (!template || !Array.isArray(template.sections) || template.sections.length < 2) return;
    const doc = element.ownerDocument;
    const sections = template.sections;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let anchor = null;
      for (const sel of selectors) {
        if (!sel) continue;
        anchor = element.querySelector(sel);
        if (anchor) break;
      }
      if (!anchor) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (anchor.nextSibling) {
          anchor.parentNode.insertBefore(metaBlock, anchor.nextSibling);
        } else {
          anchor.parentNode.appendChild(metaBlock);
        }
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        anchor.parentNode.insertBefore(hr, anchor);
      }
    }
  }

  // tools/importer/import-careers-landing.js
  var parsers = {
    "hero-banner": parse,
    "cards-culture": parse2,
    "columns-benefits": parse3
  };
  var PAGE_TEMPLATE = {
    name: "careers-landing",
    description: "Careers landing page: nav header, hero banner, current-positions jobs widget, who-are-we intro text, why-work culture cards grid, benefits two-column list, footer.",
    urls: [
      "https://www.888spectate.com/",
      "https://www.888spectate.com/index.html"
    ],
    blocks: [
      { name: "hero-banner", instances: ["body > header.container__header-banner"] },
      { name: "fragment", instances: ["#current-positions #BambooHR"] },
      { name: "cards-culture", instances: ["#swup > section.container__section:nth-of-type(3)"] },
      { name: "columns-benefits", instances: ["#swup > section.container__section:nth-of-type(4)"] },
      { name: "modal", instances: ["body > button.evoke-tab"] },
      { name: "section-who-are-we", instances: ["#swup > section.container__section-who-are-we"], section: "dark" }
    ],
    sections: [
      { id: "rc2", name: "hero", selector: ["body > header.container__header-banner"], style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "rc3", name: "current-positions", selector: ["#current-positions"], style: "light", blocks: ["fragment"], defaultContent: ["#current-positions > h1.container__main-header"] },
      { id: "rc4", name: "who-are-we", selector: ["#swup > section.container__section-who-are-we"], style: "dark", blocks: [], defaultContent: ["#swup > section.container__section-who-are-we"] },
      { id: "rc5", name: "why-work-heading", selector: ["#swup > h1.container__main-header:nth-of-type(1)"], style: null, blocks: [], defaultContent: ["#swup > h1.container__main-header:nth-of-type(1)"] },
      { id: "rc6", name: "culture-cards", selector: ["#swup > section.container__section:nth-of-type(3)"], style: "light", blocks: ["cards-culture"], defaultContent: [] },
      { id: "rc7", name: "benefits-heading", selector: ["#swup > h1.container__main-header:nth-of-type(2)"], style: null, blocks: [], defaultContent: ["#swup > h1.container__main-header:nth-of-type(2)"] },
      { id: "rc8", name: "benefits", selector: ["#swup > section.container__section:nth-of-type(4)"], style: "light", blocks: ["columns-benefits"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_careers_landing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      if (!path || path === ".") path = "/index";
      if (!path.startsWith("/")) path = `/${path}`;
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_careers_landing_exports);
})();
