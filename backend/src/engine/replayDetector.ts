import { DecodedJwt, ReplayIssue, ReplayResult } from "../types/jwt";

export function runReplayDetection(decoded: DecodedJwt, originalToken: string): ReplayResult {
  const now = Math.floor(Date.now() / 1000);
  const issues: ReplayIssue[] = [];
  const steps: string[] = [];
  const risks: string[] = [];

  const exp = decoded.payload.exp;
  if (typeof exp !== "number") {
    issues.push({ field: "exp", present: false, value: null, risk: "No expiry set — token is valid forever" });
    risks.push("HIGH");
    steps.push("1. Checking exp claim... NOT PRESENT — token never expires");
  } else {
    const remaining = exp - now;
    if (remaining <= 0) {
      issues.push({ field: "exp", present: true, value: new Date(exp * 1000).toISOString(), risk: "Token is already expired" });
      steps.push("1. Checking exp claim... PRESENT — token is already expired");
    } else if (remaining > 24 * 3600) {
      issues.push({ field: "exp", present: true, value: new Date(exp * 1000).toISOString(), risk: `Expiry too far in future (${Math.round(remaining / 3600)}h remaining)` });
      risks.push("MEDIUM");
      steps.push(`1. Checking exp claim... PRESENT but long-lived (${Math.round(remaining / 3600)}h)`);
    } else {
      issues.push({ field: "exp", present: true, value: new Date(exp * 1000).toISOString(), risk: "Short-lived token window" });
      steps.push("1. Checking exp claim... PRESENT with short lifetime");
    }
  }

  if (typeof decoded.payload.nbf !== "number") {
    issues.push({ field: "nbf", present: false, value: null, risk: "No nbf claim — token valid from any point in past" });
    risks.push("LOW");
    steps.push("2. Checking nbf claim... NOT PRESENT — no time-window restriction");
  } else {
    issues.push({ field: "nbf", present: true, value: new Date(decoded.payload.nbf * 1000).toISOString(), risk: "nbf present — token has valid time window" });
    steps.push("2. Checking nbf claim... PRESENT");
  }

  if (typeof decoded.payload.jti !== "string" || !decoded.payload.jti.trim()) {
    issues.push({ field: "jti", present: false, value: null, risk: "No jti — server cannot track or revoke individual tokens" });
    risks.push("HIGH");
    steps.push("3. Checking jti claim... NOT PRESENT — cannot be blacklisted server-side");
  } else {
    issues.push({ field: "jti", present: true, value: decoded.payload.jti, risk: "jti present — server can implement token blacklist" });
    steps.push("3. Checking jti claim... PRESENT");
  }

  if (typeof decoded.payload.iat !== "number") {
    issues.push({ field: "iat", present: false, value: null, risk: "No iat — cannot determine token age" });
    risks.push("MEDIUM");
    steps.push("4. Checking iat claim... NOT PRESENT — token age unknown");
  } else {
    const ageDays = Math.floor((now - decoded.payload.iat) / 86400);
    if (ageDays > 30) {
      issues.push({ field: "iat", present: true, value: `${ageDays}d ago`, risk: `Token issued ${ageDays} days ago — likely stale` });
      risks.push("HIGH");
      steps.push(`4. Checking iat claim... issued ${ageDays} days ago — stale token still valid`);
    } else {
      issues.push({ field: "iat", present: true, value: `${ageDays}d ago`, risk: "Token issued recently" });
      steps.push("4. Checking iat claim... PRESENT and recent");
    }
  }

  const status = risks.includes("HIGH") || risks.includes("MEDIUM") ? "VULNERABLE" : "SECURE";
  steps.push(
    status === "VULNERABLE"
      ? "5. Conclusion: token is replayable due to missing/weak temporal or revocation defenses"
      : "5. Conclusion: token has strong replay protections",
  );

  return {
    status,
    issues,
    replayedToken: originalToken,
    explanation:
      status === "VULNERABLE"
        ? "The token can likely be replayed because key anti-replay claims are missing or weak."
        : "The token includes core anti-replay claims and appears resistant to passive replay.",
    mitigation:
      "Use short expirations, include jti for revocation, set nbf/iat, and enforce server-side denylisting for compromised tokens.",
    steps,
  };
}
