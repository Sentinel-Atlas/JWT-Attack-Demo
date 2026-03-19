import { DecodedJwt } from "../types/jwt";
import { formatUnixTimestamp, timeAgoFromUnix } from "../utils/formatters";

function colorizedJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function DecodedViewer({ decoded }: { decoded: DecodedJwt | null }) {
  if (!decoded) return <div className="panel">Paste a token to preview decoded segments.</div>;

  return (
    <div className="panel decoded-viewer">
      <h3>Decoded JWT</h3>
      <div className="decoded-section">
        <h4>HEADER</h4>
        <pre>{colorizedJson(decoded.header)}</pre>
        {decoded.header.alg?.toLowerCase() === "none" && <div className="warn">⚠ alg:none detected</div>}
      </div>
      <div className="decoded-section">
        <h4>PAYLOAD</h4>
        <pre>{colorizedJson(decoded.payload)}</pre>
        <div className="meta">exp: {formatUnixTimestamp(decoded.payload.exp)}</div>
        <div className="meta">iat: {timeAgoFromUnix(decoded.payload.iat)}</div>
        {typeof decoded.payload.exp !== "number" && <div className="warn">⚠ missing exp</div>}
        {!decoded.payload.jti && <div className="warn">⚠ missing jti</div>}
        {typeof decoded.payload.nbf !== "number" && <div className="warn">⚠ missing nbf</div>}
      </div>
      <div className="decoded-section">
        <h4>SIGNATURE</h4>
        <pre>{decoded.signature || "(empty)"}</pre>
      </div>
    </div>
  );
}
