import { BruteForceResult } from "../types/jwt";
import { MitreTag } from "./MitreTag";
import { ResultBadge } from "./ResultBadge";

export function BruteForceAttack({ result }: { result: BruteForceResult }) {
  return (
    <div className="panel">
      <ResultBadge status={result.status} />
      <p>{result.explanation}</p>
      {result.crackedSecret && <div className="secret">SECRET FOUND: "{result.crackedSecret}"</div>}
      <div className="meta">Attempts: {result.attemptCount} · Time: {result.timeMs}ms</div>
      {result.forgedToken && <pre className="token-block">{result.forgedToken}</pre>}
      <ol className="steps-list">{result.steps.map((s, i) => <li key={i} style={{ animationDelay: `${i * 80}ms` }}>{s}</li>)}</ol>
      <MitreTag technique="T1110/002" name="Password Cracking" />
    </div>
  );
}
