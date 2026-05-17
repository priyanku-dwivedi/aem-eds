/** Default persisted query: AEM demo assets adventures (publish GraphQL). */
const DEFAULT_GRAPHQL_URL =
  'https://publish-p50156-e1509324.adobeaemcloud.com/graphql/execute.json/aem-demo-assets/adventures-all';

/**
 * Reads optional endpoint from the first block cell or link.
 * @param {Element} block
 * @returns {string}
 */
function getConfiguredEndpoint(block) {
  const link = block.querySelector('a');
  if (link?.href) return link.href.trim();
  const firstCell = block.querySelector(':scope > div > div');
  if (firstCell) return firstCell.textContent.trim();
  return '';
}

/**
 * Restricts outbound fetch to HTTPS persisted queries on Adobe AEM Cloud hosts.
 * @param {string} raw
 * @returns {boolean}
 */
function isAllowedPersistedQueryUrl(raw) {
  if (!raw) return false;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return false;
    if (!u.pathname.includes('/graphql/execute.json/')) return false;
    if (!u.hostname.endsWith('.adobeaemcloud.com')) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {Element} block
 * @returns {string|null}
 */
function resolveEndpoint(block) {
  const configured = getConfiguredEndpoint(block);
  if (configured && isAllowedPersistedQueryUrl(configured)) return configured;
  if (isAllowedPersistedQueryUrl(DEFAULT_GRAPHQL_URL)) return DEFAULT_GRAPHQL_URL;
  return null;
}

/**
 * @param {string} endpointUrl
 * @param {string} [dynamicPath]
 * @returns {string}
 */
function imageUrlForItem(endpointUrl, dynamicPath) {
  if (!dynamicPath) return '';
  try {
    const baseOrigin = new URL(endpointUrl).origin;
    if (dynamicPath.startsWith('https://') || dynamicPath.startsWith('http://')) {
      const abs = new URL(dynamicPath);
      if (abs.protocol !== 'https:') return '';
      if (abs.origin !== baseOrigin) return '';
      return abs.href;
    }
    return new URL(dynamicPath, baseOrigin).href;
  } catch {
    return '';
  }
}

export default async function decorate(block) {
  const endpoint = resolveEndpoint(block);
  const status = document.createElement('p');
  status.className = 'adventures-status';
  status.textContent = 'Loading adventures…';
  block.replaceChildren(status);

  if (!endpoint) {
    status.textContent = 'Invalid or missing GraphQL endpoint.';
    status.setAttribute('role', 'alert');
    return;
  }

  let json;
  try {
    const resp = await fetch(endpoint);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    json = await resp.json();
  } catch {
    status.textContent = 'Unable to load adventures. Check the endpoint or browser access (CORS).';
    status.setAttribute('role', 'alert');
    return;
  }

  const items = json?.data?.adventureList?.items ?? [];
  if (!items.length) {
    status.textContent = 'No adventures found.';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'adventures-list';
  const priceFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'adventures-card';

    const imgUrl = imageUrlForItem(endpoint, item.primaryImage?._dynamicUrl);
    if (imgUrl) {
      const wrap = document.createElement('div');
      wrap.className = 'adventures-card-image';
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = item.title || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      wrap.append(img);
      li.append(wrap);
    }

    const body = document.createElement('div');
    body.className = 'adventures-card-body';
    const h3 = document.createElement('h3');
    h3.textContent = item.title || '';

    const meta = document.createElement('p');
    meta.className = 'adventures-card-meta';
    const parts = [item.activity, item.tripLength].filter(Boolean);
    meta.textContent = parts.join(' · ');

    const priceEl = document.createElement('p');
    priceEl.className = 'adventures-card-price';
    if (typeof item.price === 'number') {
      priceEl.textContent = priceFmt.format(item.price);
    }

    body.append(h3, meta, priceEl);
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
