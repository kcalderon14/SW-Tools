function normalizeLocCode(locCode) {
  if (typeof locCode !== 'string') {
    return '';
  }

  return locCode.replace(/^\/+|\/+$/g, '');
}

function splitUrlParts(url) {
  const normalizedUrl = typeof url === 'string' ? url.trim() : '';

  if (!normalizedUrl) {
    return { protocol: '', host: '', suffix: '' };
  }

  const protocolMatch = normalizedUrl.match(/^[a-z][a-z\d+.-]*:\/\//i);
  const protocol = protocolMatch ? protocolMatch[0] : '';
  const rest = normalizedUrl.slice(protocol.length);
  const splitIndex = rest.search(/[/?#]/);

  if (splitIndex === -1) {
    return { protocol, host: rest, suffix: '' };
  }

  return {
    protocol,
    host: rest.slice(0, splitIndex),
    suffix: rest.slice(splitIndex)
  };
}

function addLocToSuffix(suffix, loc) {
  if (!suffix) {
    return `/${loc}/`;
  }

  if (suffix.startsWith('/')) {
    return `/${loc}${suffix}`;
  }

  return `/${loc}/${suffix}`;
}

export function expandToLocVersions(url, locCodes) {
  const originalUrl = typeof url === 'string' ? url.trim() : '';
  const { protocol, host, suffix } = splitUrlParts(originalUrl);
  const variants = [{ url: originalUrl, loc: 'en' }];

  if (!host || !Array.isArray(locCodes) || locCodes.length === 0) {
    return variants;
  }

  for (const locCode of locCodes) {
    const loc = normalizeLocCode(locCode);
    if (!loc) {
      continue;
    }

    variants.push({
      url: `${protocol}${host}${addLocToSuffix(suffix, loc)}`,
      loc
    });
  }

  return variants;
}

export function getLocCodesForDomain(url, sitesData) {
  const { host } = splitUrlParts(url);
  if (!host || !Array.isArray(sitesData)) {
    return [];
  }

  const normalizedHost = host.toLowerCase();
  const match = sitesData.find((siteEntry) => {
    if (!siteEntry || typeof siteEntry.site !== 'string') {
      return false;
    }

    return siteEntry.site.toLowerCase() === normalizedHost;
  });

  if (!match || !Array.isArray(match.lang)) {
    return [];
  }

  if (match.lang.length === 1 && String(match.lang[0]).toUpperCase() === 'NA') {
    return [];
  }

  return match.lang;
}

function resolveExpectedToUrl(index, fromUrls, toUrls) {
  if (!Array.isArray(toUrls) || toUrls.length === 0) {
    return '';
  }

  if (toUrls.length === 1 && Array.isArray(fromUrls) && fromUrls.length > 1) {
    return toUrls[0];
  }

  if (Array.isArray(fromUrls) && toUrls.length === fromUrls.length) {
    return toUrls[index];
  }

  return toUrls[index] || '';
}

export function expandUrlPairs(fromUrls, toUrls, locExpandFrom, locExpandTo, sitesData) {
  const safeFromUrls = Array.isArray(fromUrls) ? fromUrls : [];
  const safeToUrls = Array.isArray(toUrls) ? toUrls : [];
  const pairs = [];

  for (let index = 0; index < safeFromUrls.length; index += 1) {
    const fromUrl = safeFromUrls[index];
    const expectedToUrl = resolveExpectedToUrl(index, safeFromUrls, safeToUrls);

    if (!locExpandFrom) {
      pairs.push({ fromUrl, expectedToUrl, loc: 'en' });
      continue;
    }

    const locCodes = getLocCodesForDomain(fromUrl, sitesData);
    const fromVariants = expandToLocVersions(fromUrl, locCodes);
    const toVariantsByLoc = locExpandTo && expectedToUrl
      ? expandToLocVersions(expectedToUrl, locCodes)
      : [{ url: expectedToUrl, loc: 'en' }];

    for (const fromVariant of fromVariants) {
      let localizedToUrl = expectedToUrl;

      if (locExpandTo && expectedToUrl) {
        const matchingToVariant = toVariantsByLoc.find((toVariant) => toVariant.loc === fromVariant.loc);
        localizedToUrl = matchingToVariant ? matchingToVariant.url : expectedToUrl;
      }

      pairs.push({
        fromUrl: fromVariant.url,
        expectedToUrl: localizedToUrl,
        loc: fromVariant.loc
      });
    }
  }

  return pairs;
}