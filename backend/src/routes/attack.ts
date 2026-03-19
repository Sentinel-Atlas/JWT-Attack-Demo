import { Router } from "express";
import { createHmac } from "crypto";
import { runAllAttacks } from "../engine";
import { base64urlEncode } from "../engine/decoder";
import { ValidationError } from "../engine/validators";

const router = Router();

function signHs256(header: Record<string, unknown>, payload: Record<string, unknown>, secret: string): string {
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(`${encodedHeader}.${encodedPayload}`).digest("base64url");
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const SAMPLE_TOKENS = [
  {
    label: "Weak secret (signed with 'secret')",
    description: "HS256 token signed with the word 'secret'",
    token: signHs256(
      { alg: "HS256", typ: "JWT" },
      { sub: "user_123", name: "John Doe", role: "user", iat: 1700000000 },
      "secret",
    ),
  },
  {
    label: "No expiry (missing exp claim)",
    description: "Token with no expiry — valid forever",
    token: signHs256(
      { alg: "HS256", typ: "JWT" },
      { sub: "admin_456", name: "Jane Smith", role: "admin", iat: 1680000000 },
      "jwt_secret",
    ),
  },
  {
    label: "Strong secret, weak replay controls",
    description: "HS256 token with strong secret but missing nbf/jti",
    token: signHs256(
      { alg: "HS256", typ: "JWT" },
      { sub: "svc_account", iss: "auth.example.com", aud: "api.example.com", exp: 9999999999, iat: 1700000000 },
      "xK9#mP2$vL5@nQ8",
    ),
  },
];

router.post("/attack", async (req, res) => {
  try {
    const report = await runAllAttacks(req.body);
    res.status(200).json({ success: true, report });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ success: false, report: null, error: error.message });
    }

    return res.status(500).json({ success: false, report: null, error: "Internal analysis error" });
  }
});

router.get("/sample-tokens", (_req, res) => {
  res.json({ tokens: SAMPLE_TOKENS });
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "jwt-attack-engine" });
});

export default router;
