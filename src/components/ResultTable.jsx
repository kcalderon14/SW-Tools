import StatusIcon from './icons/StatusIcon';
import { redirectTypes } from '../config/data';

export default function ResultTable({ redirectInfo, onUpdateType, onUpdateQuery }) {
  const thClass = 'px-4 py-2 text-center border-r border-border-light last:border-r-0 text-sm font-semibold';
  const tdClass = 'px-4 py-2 border-r border-border-light last:border-r-0 text-sm';

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-bg-surface">
            <th className={thClass}>From</th>
            <th className={thClass}>To</th>
            <th className={thClass}>Code</th>
            <th className={`${thClass} border-r-0`}>Query String</th>
          </tr>
        </thead>
        <tbody>
          {redirectInfo.map((r, i) => (
            <tr
              key={r.redirectId}
              className={`${r.redirectStatus ? '' : 'text-error'} ${i % 2 === 0 ? 'bg-bg-primary' : 'bg-bg-surface'}`}
            >
              <td className={tdClass}>
                <div className="flex items-start">
                  <StatusIcon isValid={r.redirectStatus} message={r.redirectStatusMessage} />
                  <span className="break-all">{r.matchUrl}</span>
                </div>
              </td>
              <td className={`${tdClass} break-all`}>{r.resultUrl}</td>
              <td className={`${tdClass} text-center`}>
                <select
                  className="bg-bg-surface text-text-primary border border-border-light rounded px-2 py-1 text-sm focus:border-teal focus:outline-none"
                  value={r.statusCode}
                  onChange={(e) => onUpdateType(r.redirectId, parseInt(e.target.value, 10))}
                >
                  {redirectTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </td>
              <td className={`${tdClass} text-center border-r-0`}>
                <input
                  type="checkbox"
                  checked={r.queryString == 1}
                  onChange={(e) => onUpdateQuery(r.redirectId, e.target.checked)}
                  className="accent-teal w-4 h-4"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
