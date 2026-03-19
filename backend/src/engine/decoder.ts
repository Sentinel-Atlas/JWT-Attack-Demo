import { DecodedJwt, JwtHeader, JwtPayload } from "../types/jwt";

export function base64urlDecode(str: string): string {
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

export function base64urlEncode(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function parseJwt(token: string): DecodedJwt {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format — expected 3 base64url segments separated by dots");
  }

  const [rawHeader, rawPayload, signature] = parts;

  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    header = JSON.parse(base64urlDecode(rawHeader)) as JwtHeader;
  } catch {
    throw new Error("Malformed header JSON");
  }

  try {
    payload = JSON.parse(base64urlDecode(rawPayload)) as JwtPayload;
  } catch {
    throw new Error("Malformed payload JSON");
  }

  if (!header || typeof header !== "object" || Array.isArray(header) || typeof header.alg !== "string") {
    throw new Error("Invalid JWT header — missing or invalid 'alg'");
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid JWT payload — must be a JSON object");
  }

  return {
    header,
    payload,
    signature,
    raw: {
      header: rawHeader,
      payload: rawPayload,
    },
  };
}
