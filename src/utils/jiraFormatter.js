/**
 * Format redirect test results as Jira wiki markup for pasting into Jira comments.
 * @param {Array} results - Array of result objects from useRedirectTester
 * @param {string|null} serverIp - The resolved/staging IP used for testing, or null for production
 * @returns {string} Jira wiki markup string
 */
export function formatResultsForJira(results, serverIp = null) {
  if (!results || results.length === 0) return '';

  const allPassed = results.every((r) => r.pass);

  // Build info box with table
  let jira = '{info:title=Redirects verification results}\n';

  if (serverIp) {
    jira += `Server IP: ${serverIp}\n`;
  }

  // Table header
  jira += '||From||Expected||Status Code||Result||\n';

  // Table rows
  for (const r of results) {
    const from = r.from || '';
    const expected = r.expectedTo || '';
    const statusCode = r.statusCode || '—';
    const result = r.error ? `(x) ${r.error}` : r.pass ? '(/) Passed' : '(x) Failed';
    jira += `|${from}|${expected}|${statusCode}|${result}|\n`;
  }

  jira += '{info}\n\n';

  // QA verdict panel
  if (allPassed) {
    jira += '{panel:borderStyle=solid|borderColor=#57d9a3|bgColor=#e3fcef|titleBGColor=#00875a|titleColor=#ffffff|title=QA Verification Passed}\n';
    jira += 'QA Verification Passed\n';
    jira += '{panel}';
  } else {
    jira += '{panel:borderStyle=solid|borderColor=#ff5630|bgColor=#ffebe6|titleBGColor=#de350b|titleColor=#ffffff|title=QA Verification Failed}\n';
    jira += 'QA Verification Failed\n';
    jira += '{panel}';
  }

  return jira;
}
