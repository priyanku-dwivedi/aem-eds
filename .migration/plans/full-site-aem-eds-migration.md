# Full-Site Migration to AEM Edge Delivery Services (Crosswalk, Content + Design)

## Overview
Migrate the website **https://www.888spectate.com/** to AEM Edge Delivery Services (EDS) as a **Crosswalk (Universal Editor)** project, reproducing both the **content structure** (sections and blocks) and the **visual design** (CSS, design tokens, layout) to match the original site.

## Scope (confirmed)
- **Source:** `https://www.888spectate.com/`
- **Breadth:** Full site — all discoverable pages, grouped into reusable page templates
- **Fidelity:** Content + visual design (match original styling)
- **Project type:** Crosswalk (Universal Editor) — content output as JCR XML with proper block models and field hinting
- **Rollout strategy:** Migrate **one representative page per template first** to validate fidelity, then scale to the full set

## Migration Phases

### Phase 1 — Discovery & Scoping
- Discover all site URLs (sitemap.xml first, fall back to crawling)
- Analyze pages and group similar ones into a small set of **page templates**
- Inventory the **blocks** required across templates
- Produce a migration scope report (page count, template count, block list, design tokens)

### Phase 2 — Design System Extraction
- Extract global design tokens (colors, typography, spacing) from the source
- Establish site-level styles (fonts, base layout, header/footer shells)

### Phase 3 — Per-Template Page Analysis (one representative page per template)
- For each template: analyze structure, identify sections and authoring decisions
- Determine block variants (reuse existing blocks where ~80% similar; create new ones only when needed)
- Migrate per-block visual design to match the original

### Phase 4 — Import Infrastructure
- Generate block parsers and page transformers
- Build a bundled import script driven by the page templates

### Phase 5 — Crosswalk Content Conversion & Import
- Run the import for the representative pages
- Convert HTML content to **JCR XML** for Universal Editor, validating block models and field hinting
- Validate page template schemas

### Phase 6 — Navigation & Footer
- Instrument the site header/navigation (desktop, mobile, megamenu as applicable)
- Migrate the footer

### Phase 7 — Visual Validation & Fixes (representative pages)
- Compare migrated representative pages against the originals (block, section, page)
- Iterate on styling discrepancies until the design matches
- **Validation gate:** review representative pages with user before scaling

### Phase 8 — Scale to Full Site
- After validation sign-off, run import + crosswalk conversion across all remaining URLs per template
- Full-site visual validation and fixes

## Checklist

- [x] **Confirm source site URL** — `https://www.888spectate.com/`
- [x] **Confirm project type** — Crosswalk (Universal Editor)
- [x] **Confirm rollout** — representative page per template first, then scale
- [ ] Discover all site URLs via sitemap or crawl
- [ ] Catalog page templates (group similar pages)
- [ ] Inventory required blocks across templates
- [ ] Generate migration scope report and review with user
- [ ] Extract global design tokens and establish site-level styles
- [ ] Select one representative page per template
- [ ] Analyze each representative page's structure and sections
- [ ] Determine block variants (reuse vs. create new)
- [ ] Migrate per-block visual design to match original
- [ ] Generate block parsers and page transformers
- [ ] Build bundled import script from page templates
- [ ] Import representative pages and convert content to JCR XML (Crosswalk)
- [ ] Validate Universal Editor block models and field hinting
- [ ] Instrument site navigation/header
- [ ] Migrate footer
- [ ] Visually validate representative pages against originals
- [ ] Fix styling discrepancies on representative pages
- [ ] **Validation gate:** review representative pages with user
- [ ] Scale import + crosswalk conversion to all remaining URLs
- [ ] Full-site visual validation and final fixes

## Notes & Considerations
- **888spectate.com** is a sports betting / gaming site. Pages may be **highly dynamic** (live odds, JS-rendered content, geo/age gating). URL discovery and scraping may need browser-based rendering rather than static fetch.
- **Age verification / geo-restrictions** may block access to some pages during scraping — flagged for handling at execution.
- **Crosswalk specifics:** content is authored via Universal Editor, so each block needs a valid component model and field hints; this is validated during Phase 5.

---

**Note:** Execution requires Execute mode. On approval I'll begin Phase 1 — URL discovery and page-template cataloging for `https://www.888spectate.com/`.
