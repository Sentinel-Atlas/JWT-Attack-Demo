import { AttackReport, AttackRequest } from "../types/jwt";
import { parseJwt } from "./decoder";
import { runAlgNoneAttack } from "./algNone";
import { runBruteForce } from "./bruteForce";
import { runReplayDetection } from "./replayDetector";
import { validateAttackRequest } from "./validators";

export async function runAllAttacks(request: AttackRequest): Promise<AttackReport> {
  const validated = validateAttackRequest(request);
  const decoded = parseJwt(validated.token);

  const [algNone, bruteForce, replay] = await Promise.all([
    Promise.resolve(runAlgNoneAttack(decoded)),
    runBruteForce(decoded, validated.wordlistSize ?? "medium"),
    Promise.resolve(runReplayDetection(decoded, validated.token)),
  ]);

  let overallRisk: AttackReport["overallRisk"] = "LOW";
  if (algNone.status === "VULNERABLE" && bruteForce.status === "VULNERABLE") {
    overallRisk = "CRITICAL";
  } else if (algNone.status === "VULNERABLE" || bruteForce.status === "VULNERABLE") {
    overallRisk = "HIGH";
  } else if (replay.status === "VULNERABLE") {
    overallRisk = "MEDIUM";
  }

  const now = Math.floor(Date.now() / 1000);
  const tokenAgeSeconds = typeof decoded.payload.iat === "number" ? now - decoded.payload.iat : null;
  const isExpired = typeof decoded.payload.exp === "number" ? decoded.payload.exp <= now : false;

  return {
    decoded,
    algNone,
    bruteForce,
    replay,
    overallRisk,
    analyzedAt: new Date().toISOString(),
    tokenAgeSeconds,
    isExpired,
  };
}
