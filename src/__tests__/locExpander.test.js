import { describe, it, expect } from 'vitest';
import { sitesData } from '../config/data';
import {
  expandToLocVersions,
  getLocCodesForDomain,
  expandUrlPairs
} from '../utils/locExpander';

const solarwindsLocCodes = ['/de/', '/es/', '/pt/', '/fr/', '/ja/', '/ko/', '/zh/'];

describe('expandToLocVersions', () => {
  it('returns EN + 7 LOC variants with EN first', () => {
    const result = expandToLocVersions('www.solarwinds.com/some-page', solarwindsLocCodes);

    expect(result).toHaveLength(8);
    expect(result[0]).toEqual({ url: 'www.solarwinds.com/some-page', loc: 'en' });
    expect(result[1]).toEqual({ url: 'www.solarwinds.com/de/some-page', loc: 'de' });
    expect(result[7]).toEqual({ url: 'www.solarwinds.com/zh/some-page', loc: 'zh' });
  });

  it('preserves https protocol in expanded URLs', () => {
    const result = expandToLocVersions('https://www.solarwinds.com/some-page', ['/de/']);
    expect(result[1]).toEqual({ url: 'https://www.solarwinds.com/de/some-page', loc: 'de' });
  });

  it('works for URL without protocol', () => {
    const result = expandToLocVersions('www.solarwinds.com/page', ['/de/']);
    expect(result[1].url).toBe('www.solarwinds.com/de/page');
  });

  it('expands root URL with trailing slash', () => {
    const result = expandToLocVersions('www.solarwinds.com/', ['/de/']);
    expect(result[1].url).toBe('www.solarwinds.com/de/');
  });

  it('expands root URL without trailing slash', () => {
    const result = expandToLocVersions('www.solarwinds.com', ['/de/']);
    expect(result[1].url).toBe('www.solarwinds.com/de/');
  });

  it('expands non-www domain correctly', () => {
    const result = expandToLocVersions('try.solarwinds.com/page', ['/de/']);
    expect(result[1].url).toBe('try.solarwinds.com/de/page');
  });

  it('returns only EN when LOC code list is empty', () => {
    const result = expandToLocVersions('www.solarwinds.com/some-page', []);
    expect(result).toEqual([{ url: 'www.solarwinds.com/some-page', loc: 'en' }]);
  });
});

describe('getLocCodesForDomain', () => {
  it('returns LOC codes for known localized domain', () => {
    const result = getLocCodesForDomain('www.solarwinds.com/some-page', sitesData);
    expect(result).toEqual(['/de/', '/es/', '/pt/', '/fr/', '/ja/', '/ko/', '/zh/']);
  });

  it('returns empty array for NA domain', () => {
    const result = getLocCodesForDomain('www.webhelpdesk.com/some-page', sitesData);
    expect(result).toEqual([]);
  });

  it('returns empty array for unknown domain', () => {
    const result = getLocCodesForDomain('www.unknown-domain.com/page', sitesData);
    expect(result).toEqual([]);
  });

  it('extracts domain correctly when protocol is present', () => {
    const result = getLocCodesForDomain('https://www.solarwinds.com/some-page', sitesData);
    expect(result).toEqual(['/de/', '/es/', '/pt/', '/fr/', '/ja/', '/ko/', '/zh/']);
  });
});

describe('expandUrlPairs', () => {
  it('supports many-to-one mapping without LOC expansion', () => {
    const result = expandUrlPairs(
      ['www.solarwinds.com/a', 'www.solarwinds.com/b', 'www.solarwinds.com/c'],
      ['www.solarwinds.com/destination'],
      false,
      false,
      sitesData
    );

    expect(result).toHaveLength(3);
    expect(result.every((pair) => pair.expectedToUrl === 'www.solarwinds.com/destination')).toBe(true);
    expect(result.every((pair) => pair.loc === 'en')).toBe(true);
  });

  it('supports 1:1 mapping without LOC expansion', () => {
    const result = expandUrlPairs(
      ['www.solarwinds.com/a', 'www.solarwinds.com/b'],
      ['www.solarwinds.com/c', 'www.solarwinds.com/d'],
      false,
      false,
      sitesData
    );

    expect(result).toEqual([
      { fromUrl: 'www.solarwinds.com/a', expectedToUrl: 'www.solarwinds.com/c', loc: 'en' },
      { fromUrl: 'www.solarwinds.com/b', expectedToUrl: 'www.solarwinds.com/d', loc: 'en' }
    ]);
  });

  it('sets expectedToUrl to empty string when no To URLs are provided', () => {
    const result = expandUrlPairs(
      ['www.solarwinds.com/a', 'www.solarwinds.com/b'],
      [],
      false,
      false,
      sitesData
    );

    expect(result).toEqual([
      { fromUrl: 'www.solarwinds.com/a', expectedToUrl: '', loc: 'en' },
      { fromUrl: 'www.solarwinds.com/b', expectedToUrl: '', loc: 'en' }
    ]);
  });

  it('expands From only when locExpandFrom=true and locExpandTo=false', () => {
    const result = expandUrlPairs(
      ['www.solarwinds.com/source'],
      ['www.solarwinds.com/target'],
      true,
      false,
      sitesData
    );

    expect(result).toHaveLength(8);
    expect(result[0]).toEqual({
      fromUrl: 'www.solarwinds.com/source',
      expectedToUrl: 'www.solarwinds.com/target',
      loc: 'en'
    });
    expect(result[1]).toEqual({
      fromUrl: 'www.solarwinds.com/de/source',
      expectedToUrl: 'www.solarwinds.com/target',
      loc: 'de'
    });
    expect(result[7]).toEqual({
      fromUrl: 'www.solarwinds.com/zh/source',
      expectedToUrl: 'www.solarwinds.com/target',
      loc: 'zh'
    });
  });

  it('expands both From and To when both LOC flags are true', () => {
    const result = expandUrlPairs(
      ['www.solarwinds.com/source'],
      ['www.solarwinds.com/target'],
      true,
      true,
      sitesData
    );

    expect(result).toHaveLength(8);
    expect(result[0]).toEqual({
      fromUrl: 'www.solarwinds.com/source',
      expectedToUrl: 'www.solarwinds.com/target',
      loc: 'en'
    });
    expect(result[1]).toEqual({
      fromUrl: 'www.solarwinds.com/de/source',
      expectedToUrl: 'www.solarwinds.com/de/target',
      loc: 'de'
    });
    expect(result[7]).toEqual({
      fromUrl: 'www.solarwinds.com/zh/source',
      expectedToUrl: 'www.solarwinds.com/zh/target',
      loc: 'zh'
    });
  });

  it('supports many-to-one combined with LOC expansion on From', () => {
    const result = expandUrlPairs(
      ['www.solarwinds.com/source-1', 'www.solarwinds.com/source-2'],
      ['www.solarwinds.com/target'],
      true,
      false,
      sitesData
    );

    expect(result).toHaveLength(16);
    expect(result.every((pair) => pair.expectedToUrl === 'www.solarwinds.com/target')).toBe(true);
  });

  it('returns EN-only pair when domain has no LOC codes even if flags are true', () => {
    const result = expandUrlPairs(
      ['www.webhelpdesk.com/source'],
      ['www.webhelpdesk.com/target'],
      true,
      true,
      sitesData
    );

    expect(result).toEqual([
      {
        fromUrl: 'www.webhelpdesk.com/source',
        expectedToUrl: 'www.webhelpdesk.com/target',
        loc: 'en'
      }
    ]);
  });

  it('supports 1:1 mapping with both LOC flags enabled', () => {
    const result = expandUrlPairs(
      ['www.solarwinds.com/source-a', 'www.solarwinds.com/source-b'],
      ['www.solarwinds.com/target-a', 'www.solarwinds.com/target-b'],
      true,
      true,
      sitesData
    );

    expect(result).toHaveLength(16);

    const sourceAVariants = result.filter((pair) => pair.fromUrl.includes('/source-a') || pair.fromUrl.endsWith('source-a'));
    const sourceBVariants = result.filter((pair) => pair.fromUrl.includes('/source-b') || pair.fromUrl.endsWith('source-b'));

    expect(sourceAVariants).toHaveLength(8);
    expect(sourceBVariants).toHaveLength(8);
    expect(sourceAVariants.some((pair) => pair.expectedToUrl === 'www.solarwinds.com/de/target-a' && pair.loc === 'de')).toBe(true);
    expect(sourceBVariants.some((pair) => pair.expectedToUrl === 'www.solarwinds.com/zh/target-b' && pair.loc === 'zh')).toBe(true);
  });
});