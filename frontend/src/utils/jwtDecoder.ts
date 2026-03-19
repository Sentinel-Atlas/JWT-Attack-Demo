import { DecodedJwt, JwtHeader, JwtPayload } from "../types/jwt";

export function base64urlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

export function decodeJwt(token: string): DecodedJwt {
  const segments = token.split(".");
  if (segments.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const [headerRaw, payloadRaw, signature] = segments;
  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    header = JSON.parse(base64urlDecode(headerRaw));
  } catch {
    throw new Error("Malformed header segment");
  }

  try {
    payload = JSON.parse(base64urlDecode(payloadRaw));
  } catch {
    throw new Error("Malformed payload segment");
  }

  return {
    header,
    payload,
    signature,
    raw: { header: headerRaw, payload: payloadRaw },
  };
}
