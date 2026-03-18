/**
 * Remove https:// or http:// protocol from a URL string.
 */
export function removeProtocol(url) {
  return url.replace('https://', '').replace('http://', '');
}

/**
 * Format "From" URLs: split by newline, strip protocol from each non-empty line,
 * return the cleaned text string.
 */
export function formatFromUrls(text) {
  const lines = text.trim().split('\n');
  let result = '';

  for (const line of lines) {
    if (line.trim() !== '') {
      result += removeProtocol(line.trim()) + '\n';
    }
  }

  return result.trim();
}

/**
 * Format "To" URLs: split by newline, strip protocol, remove domain prefix
 * leaving relative path. If result is empty after stripping domain, use "/".
 */
export function formatToUrls(text, domain) {
  const lines = text.trim().split('\n');
  let result = '';

  for (const line of lines) {
    if (line.trim() !== '') {
      let outcome = line.trim();

      if (outcome.includes(domain)) {
        outcome = removeProtocol(outcome).replace(domain, '');
      }

      result += (outcome.length === 0 ? '/' : outcome) + '\n';
    }
  }

  return result.trim();
}

/**
 * Generate localized versions of URLs for a given domain.
 * Looks up the domain's languages from sitesData array.
 * Returns { text: expandedUrlString, hasLanguages: boolean }
 */
export function generateLocVersions(urlText, domain, sitesData) {
  let languages = [];

  for (const site of sitesData) {
    if (site.site === domain) {
      languages = site.lang;
      break;
    }
  }

  if (languages.length <= 1 || (languages.length === 1 && languages[0] === 'NA')) {
    return { text: '', hasLanguages: false };
  }

  const urls = urlText.trim().split('\n');
  let newContent = '';

  for (const url of urls) {
    if (url.trim() === '') {
      continue;
    }

    newContent += url + '\n';

    for (const lang of languages) {
      if (url.indexOf('/') > 0) {
        newContent += url.replace('.com/', '.com' + lang) + '\n';
      } else {
        newContent += url.replace('/', lang) + '\n';
      }
    }
  }

  return { text: newContent.trim(), hasLanguages: true };
}
