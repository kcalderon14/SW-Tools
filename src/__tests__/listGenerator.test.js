import { describe, it, expect } from 'vitest';
import { generateListHtml } from '../utils/listGenerator';

describe('generateListHtml', () => {
  it('returns empty string for empty input', () => {
    expect(generateListHtml({ lines: '', listType: 'ul', listClass: '', itemClass: '' })).toBe('');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(generateListHtml({ lines: '   \n  \n ', listType: 'ul', listClass: '', itemClass: '' })).toBe('');
  });

  it('generates a simple unordered list', () => {
    const result = generateListHtml({ lines: 'Apple\nBanana\nCherry', listType: 'ul', listClass: '', itemClass: '' });
    expect(result).toContain('<ul>');
    expect(result).toContain('</ul>');
    expect(result).toContain('<li>Apple</li>');
    expect(result).toContain('<li>Banana</li>');
    expect(result).toContain('<li>Cherry</li>');
  });

  it('generates a simple ordered list', () => {
    const result = generateListHtml({ lines: 'First\nSecond\nThird', listType: 'ol', listClass: '', itemClass: '' });
    expect(result).toContain('<ol>');
    expect(result).toContain('</ol>');
    expect(result).toContain('<li>First</li>');
    expect(result).toContain('<li>Second</li>');
  });

  it('handles nested sub-lists', () => {
    const result = generateListHtml({ lines: 'Fruits\n  Apple\n  Banana', listType: 'ul', listClass: '', itemClass: '' });
    // Should contain a nested <ul> inside the first <li>
    expect(result).toContain('<li>Fruits');
    expect(result).toContain('<li>Apple</li>');
    expect(result).toContain('<li>Banana</li>');
    // Should have two <ul> tags (root + nested)
    const ulCount = (result.match(/<ul>/g) || []).length;
    expect(ulCount).toBe(2);
  });

  it('closes nesting properly when returning to parent level', () => {
    const result = generateListHtml({
      lines: 'Fruits\n  Apple\n  Banana\nVegetables\n  Carrot',
      listType: 'ul', listClass: '', itemClass: ''
    });
    expect(result).toContain('<li>Fruits');
    expect(result).toContain('<li>Vegetables');
    // Should close and reopen nested lists
    const ulOpenCount = (result.match(/<ul>/g) || []).length;
    const ulCloseCount = (result.match(/<\/ul>/g) || []).length;
    expect(ulOpenCount).toBe(ulCloseCount);
  });

  it('applies class to list element', () => {
    const result = generateListHtml({ lines: 'Item', listType: 'ul', listClass: 'my-list', itemClass: '' });
    expect(result).toContain('<ul class="my-list">');
  });

  it('applies class to list items', () => {
    const result = generateListHtml({ lines: 'Apple\nBanana', listType: 'ul', listClass: '', itemClass: 'list-item' });
    expect(result).toContain('<li class="list-item">Apple</li>');
    expect(result).toContain('<li class="list-item">Banana</li>');
  });

  it('applies both list and item classes', () => {
    const result = generateListHtml({ lines: 'Item', listType: 'ol', listClass: 'ordered', itemClass: 'entry' });
    expect(result).toContain('<ol class="ordered">');
    expect(result).toContain('<li class="entry">Item</li>');
  });

  it('skips blank lines in input', () => {
    const result = generateListHtml({ lines: 'A\n\n\nB', listType: 'ul', listClass: '', itemClass: '' });
    expect(result).toContain('<li>A</li>');
    expect(result).toContain('<li>B</li>');
    const liCount = (result.match(/<li>/g) || []).length;
    expect(liCount).toBe(2);
  });

  it('escapes HTML special characters in content', () => {
    const result = generateListHtml({ lines: '<script>alert("xss")</script>', listType: 'ul', listClass: '', itemClass: '' });
    expect(result).toContain('&lt;script&gt;');
    expect(result).toContain('&quot;');
    expect(result).not.toContain('<script>');
  });

  it('clamps depth jumps to +1', () => {
    // Line with 6 spaces (depth 3) after a root item should be treated as depth 1
    const result = generateListHtml({ lines: 'Root\n      Deep', listType: 'ul', listClass: '', itemClass: '' });
    // Should only have 2 ul tags (root + 1 level of nesting), not 4
    const ulCount = (result.match(/<ul>/g) || []).length;
    expect(ulCount).toBe(2);
  });

  it('applies class to nested sub-lists', () => {
    const result = generateListHtml({ lines: 'Parent\n  Child', listType: 'ul', listClass: 'nav', itemClass: '' });
    const classMatches = result.match(/class="nav"/g) || [];
    // Both root ul and nested ul should have the class
    expect(classMatches.length).toBe(2);
  });

  it('generates single item list correctly', () => {
    const result = generateListHtml({ lines: 'Only item', listType: 'ol', listClass: '', itemClass: '' });
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>Only item</li>');
    expect(result).toContain('</ol>');
  });
});
