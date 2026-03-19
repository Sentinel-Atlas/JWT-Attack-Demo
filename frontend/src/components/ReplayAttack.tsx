import { ReplayResult } from "../types/jwt";
import { MitreTag } from "./MitreTag";
import { ResultBadge } from "./ResultBadge";

export function ReplayAttack({ result }: { result: ReplayResult }) {
  return (
    <div className="panel">
      <ResultBadge status={result.status} />
      <p>{result.explanation}</p>
      <table className="issues-table">
        <thead><tr><th>Claim</th><th>Present</th><th>Value</th><th>Risk</th></tr></thead>
        <tbody>
          {result.issues.map((issue) => (
            <tr key={issue.field}>
              <td>{issue.field}</td><td>{issue.present ? "✅ YES" : "❌ NO"}</td><td>{issue.value || "—"}</td><td>{issue.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ol className="steps-list">{result.steps.map((s, i) => <li key={i} style={{ animationDelay: `${i * 80}ms` }}>{s}</li>)}</ol>
      <MitreTag technique="T1550" name="Use Alternate Authentication Material" />
    </div>
  );
}
