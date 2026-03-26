/**
 * Format redirect test results as HTML for pasting into Jira Cloud comments.
 * Jira Cloud's editor renders pasted HTML as rich content with tables and panels.
 */
export function formatResultsForJira(results, serverIp = null) {
  if (!results || results.length === 0) return '';

  const allPassed = results.every((r) => r.pass);

  // Info panel with results table
  let html = '<div style="background:#deebff;border:1px solid #b3d4ff;border-radius:3px;padding:12px 16px;margin:8px 0">';
  html += '<h3 style="margin:0 0 8px 0;color:#172b4d">Redirects verification results</h3>';

  if (serverIp) {
    html += `<p style="margin:0 0 8px 0;color:#172b4d"><strong>Server IP:</strong> ${escapeHtml(serverIp)}</p>`;
  }

  // Results table
  html += '<table style="border-collapse:collapse;width:100%;margin:8px 0">';
  html += '<thead><tr>';
  html += '<th style="border:1px solid #c1c7d0;padding:6px 8px;background:#f4f5f7;text-align:left;color:#172b4d">From</th>';
  html += '<th style="border:1px solid #c1c7d0;padding:6px 8px;background:#f4f5f7;text-align:left;color:#172b4d">Expected</th>';
  html += '<th style="border:1px solid #c1c7d0;padding:6px 8px;background:#f4f5f7;text-align:center;color:#172b4d">Status Code</th>';
  html += '<th style="border:1px solid #c1c7d0;padding:6px 8px;background:#f4f5f7;text-align:center;color:#172b4d">Result</th>';
  html += '</tr></thead>';
  html += '<tbody>';

  for (const r of results) {
    const from = escapeHtml(r.from || '');
    const expected = escapeHtml(r.expectedTo || '');
    const statusCode = r.statusCode || '—';
    let resultText;
    let resultColor;

    if (r.error) {
      resultText = `❌ ${escapeHtml(r.error)}`;
      resultColor = '#de350b';
    } else if (r.pass) {
      resultText = '✅ Passed';
      resultColor = '#00875a';
    } else {
      resultText = '❌ Failed';
      resultColor = '#de350b';
    }

    html += '<tr>';
    html += `<td style="border:1px solid #c1c7d0;padding:6px 8px;color:#172b4d">${from}</td>`;
    html += `<td style="border:1px solid #c1c7d0;padding:6px 8px;color:#172b4d">${expected}</td>`;
    html += `<td style="border:1px solid #c1c7d0;padding:6px 8px;text-align:center;color:#172b4d">${statusCode}</td>`;
    html += `<td style="border:1px solid #c1c7d0;padding:6px 8px;text-align:center;color:${resultColor};font-weight:600">${resultText}</td>`;
    html += '</tr>';
  }

  html += '</tbody></table>';
  html += '</div>';

  // QA verdict panel
  if (allPassed) {
    html += '<div style="background:#e3fcef;border:1px solid #57d9a3;border-radius:3px;padding:12px 16px;margin:8px 0">';
    html += '<strong style="color:#00875a">✅ QA Verification Passed</strong>';
    html += '</div>';
  } else {
    html += '<div style="background:#ffebe6;border:1px solid #ff5630;border-radius:3px;padding:12px 16px;margin:8px 0">';
    html += '<strong style="color:#de350b">❌ QA Verification Failed</strong>';
    html += '</div>';
  }

  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
