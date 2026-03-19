import { VulnerabilityStatus } from "../types/jwt";

export function ResultBadge({ status }: { status: VulnerabilityStatus }) {
  return <span className={`result-badge ${status.toLowerCase()}`}>{status}</span>;
}
