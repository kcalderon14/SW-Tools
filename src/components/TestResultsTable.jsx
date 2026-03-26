export default function TestResultsTable({ results }) {
  if (!results || results.length === 0) return null;

  const thClass = 'px-4 py-2 text-center border-r border-gray-600 last:border-r-0 text-sm font-semibold';
  const tdClass = 'px-4 py-2 border-r border-gray-600 last:border-r-0 text-sm';

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-dark-surface">
            <th className={thClass}>#</th>
            <th className={thClass}>LOC</th>
            <th className={thClass}>From</th>
            <th className={thClass}>Expected To</th>
            <th className={thClass}>Actual URL</th>
            <th className={thClass}>Status Code</th>
            <th className={`${thClass} border-r-0`}>Result</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.index}
              className={`${r.index % 2 === 0 ? 'bg-dark-surface' : 'bg-dark-bg'}`}
            >
              <td className={`${tdClass} text-center w-12`}>{r.index}</td>
              <td className={`${tdClass} text-center`}>
                {r.loc ? (
                  <span className="inline-flex items-center rounded bg-teal/20 px-2 py-1 text-xs font-medium text-teal">
                    {r.loc.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
              <td className={`${tdClass} break-all max-w-48`}>{r.from}</td>
              <td className={`${tdClass} break-all max-w-48`}>{r.expectedTo}</td>
              <td className={`${tdClass} break-all max-w-48`}>
                {r.error ? (
                  <span className="text-error">{r.error}</span>
                ) : (
                  r.actualUrl
                )}
              </td>
              <td className={`${tdClass} text-center`}>
                {r.statusCode ? (
                  <span
                    className={
                      r.statusCode >= 300 && r.statusCode < 400
                        ? 'text-teal font-semibold'
                        : r.statusCode >= 200 && r.statusCode < 300
                          ? 'text-gray-300'
                          : 'text-error font-semibold'
                    }
                  >
                    {r.statusCode}
                  </span>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
              <td className={`${tdClass} text-center border-r-0`}>
                {r.error ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : r.pass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
