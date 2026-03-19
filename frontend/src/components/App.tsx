import { useEffect, useMemo, useState } from "react";
import { AttackPanel } from "./AttackPanel";
import { DecodedViewer } from "./DecodedViewer";
import { TokenInput } from "./TokenInput";
import { useJwtAnalysis } from "../hooks/useJwtAnalysis";
import { decodeJwt } from "../utils/jwtDecoder";

export default function App() {
  const [token, setToken] = useState("");
  const { report, loading, error, samples, analyze, loadSamples } = useJwtAnalysis();

  useEffect(() => {
    loadSamples();
  }, []);

  useEffect(() => {
    if (!token && samples[0]) setToken(samples[0].token);
  }, [samples, token]);

  const decoded = useMemo(() => {
    try {
      return token ? decodeJwt(token) : null;
    } catch {
      return null;
    }
  }, [token]);

  return (
    <main className="app-shell">
      <h1>JWT Attack Demo</h1>
      <div className="layout">
        <section className="left-column">
          <TokenInput token={token} setToken={setToken} onAnalyze={() => analyze(token)} loading={loading} error={error} samples={samples} />
          <DecodedViewer decoded={decoded} />
        </section>
        <section className="right-column">
          <AttackPanel report={report} />
        </section>
      </div>
    </main>
  );
}
