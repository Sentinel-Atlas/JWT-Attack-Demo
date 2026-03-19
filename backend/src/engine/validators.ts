import { AttackRequest } from "../types/jwt";

const JWT_REGEX = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateAttackRequest(body: unknown): AttackRequest {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object");
  }

  const input = body as Record<string, unknown>;
  const rawToken = input.token;
  const rawSize = input.wordlistSize;

  if (typeof rawToken !== "string") {
    throw new ValidationError("token must be a string");
  }

  const token = rawToken.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");

  if (!token) {
    throw new ValidationError("token cannot be empty");
  }

  if (token.length > 8192) {
    throw new ValidationError("token is too long (max 8192 chars)");
  }

  if (!JWT_REGEX.test(token)) {
    throw new ValidationError("Invalid JWT format — expected 3 base64url segments separated by dots");
  }

  let wordlistSize: "small" | "medium" | "large" | undefined = undefined;
  if (rawSize !== undefined) {
    if (rawSize === "small" || rawSize === "medium" || rawSize === "large") {
      wordlistSize = rawSize;
    } else {
      throw new ValidationError("wordlistSize must be one of: small, medium, large");
    }
  }

  return { token, wordlistSize };
}
