import { decodeJwt } from "../utils/jwtDecoder";

interface Props {
  token: string;
  setToken: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string | null;
  samples: Array<{ label: string; token: string }>;
}

export function TokenInput({ token, setToken, onAnalyze, loading, error, samples }: Props) {
  let localError: string | null = null;
  try {
    if (token) decodeJwt(token);
  } catch (e) {
    localError = (e as Error).message;
  }

  return (
    <div className="panel">
      <h3>JWT Token Input</h3>
      <textarea
        className={localError || error ? "invalid" : ""}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste JWT here..."
      />
      <div className="controls">
        <button onClick={onAnalyze} disabled={loading || !token}>{loading ? "Analyzing..." : "ANALYZE"}</button>
        <select onChange={(e) => setToken(e.target.value)} defaultValue="">
          <option value="" disabled>Load Sample</option>
          {samples.map((s, idx) => <option key={idx} value={s.token}>{s.label}</option>)}
        </select>
        <button onClick={() => setToken("")}>Clear</button>
      </div>
      <div className="meta">Chars: {token.length} · Segments: {token ? token.split(".").length : 0}</div>
      {(localError || error) && <div className="error">{localError || error}</div>}
    </div>
  );
}
