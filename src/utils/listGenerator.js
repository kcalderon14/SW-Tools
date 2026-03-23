function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function indent(level) {
  return '  '.repeat(level);
}

function listOpenTag(listType, listClass) {
  const classAttr = listClass ? ` class="${escapeHtml(listClass)}"` : '';
  return `<${listType}${classAttr}>`;
}

function liOpenTag(itemClass) {
  const classAttr = itemClass ? ` class="${escapeHtml(itemClass)}"` : '';
  return `<li${classAttr}>`;
}

/**
 * Generate nested HTML list markup from newline-separated plain text.
 */
export function generateListHtml({ lines, listType, listClass, itemClass }) {
  const input = typeof lines === 'string' ? lines : '';
  const nonEmptyLines = input.split('\n').filter((line) => line.trim() !== '');

  if (nonEmptyLines.length === 0) {
    return '';
  }

  const safeListType = listType === 'ol' ? 'ol' : 'ul';
  const openList = listOpenTag(safeListType, listClass);
  const openLi = liOpenTag(itemClass);
  
  // Pre-compute depths
  const items = [];
  let prevDepth = 0;
  for (const rawLine of nonEmptyLines) {
    const leadingSpacesMatch = rawLine.match(/^ */);
    const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0].length : 0;
    const computedDepth = Math.ceil(leadingSpaces / 2);
    const currentDepth = Math.max(0, Math.min(computedDepth, prevDepth + 1));
    items.push({ text: escapeHtml(rawLine.trim()), depth: currentDepth });
    prevDepth = currentDepth;
  }

  const output = [openList];
  let previousDepth = 0;

  for (let index = 0; index < items.length; index += 1) {
    const { text, depth: currentDepth } = items[index];
    const nextDepth = index < items.length - 1 ? items[index + 1].depth : null;
    const hasChildren = nextDepth !== null && nextDepth > currentDepth;

    if (index > 0) {
      if (currentDepth > previousDepth) {
        output.push(`${indent(currentDepth * 2)}${openList}`);
      } else if (currentDepth < previousDepth) {
        for (let depth = previousDepth; depth > currentDepth; depth -= 1) {
          output.push(`${indent(depth * 2)}</${safeListType}>`);
          output.push(`${indent(depth * 2 - 1)}</li>`);
        }
      }
    }

    if (hasChildren) {
      output.push(`${indent(currentDepth * 2 + 1)}${openLi}${text}`);
    } else {
      output.push(`${indent(currentDepth * 2 + 1)}${openLi}${text}</li>`);
    }

    previousDepth = currentDepth;
  }

  for (let depth = previousDepth; depth > 0; depth -= 1) {
    output.push(`${indent(depth * 2)}</${safeListType}>`);
    output.push(`${indent(depth * 2 - 1)}</li>`);
  }

  output.push(`</${safeListType}>`);

  return output.join('\n');
}
