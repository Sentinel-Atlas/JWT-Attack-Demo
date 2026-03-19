import { AlgNoneResult } from "../types/jwt";
import { MitreTag } from "./MitreTag";
import { ResultBadge } from "./ResultBadge";

export function AlgNoneAttack({ result }: { result: AlgNoneResult }) {
  return (
    <div className="panel">
      <ResultBadge status={result.status} />
      <p>{result.explanation}</p>
      <ol className="steps-list">{result.steps.map((s, i) => <li key={i} style={{ animationDelay: `${i * 80}ms` }}>{s}</li>)}</ol>
      {result.forgedToken && <pre className="token-block">{result.forgedToken}</pre>}
      <MitreTag technique="T1600" name="Weaken Encryption" />
    </div>
  );
}
