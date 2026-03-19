export interface JwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  raw: {
    header: string;
    payload: string;
  };
}

export type VulnerabilityStatus = "VULNERABLE" | "SECURE" | "UNKNOWN";

export interface AlgNoneResult {
  status: VulnerabilityStatus;
  forgedToken: string | null;
  originalAlg: string;
  explanation: string;
  steps: string[];
  mitigation: string;
}

export interface BruteForceResult {
  status: VulnerabilityStatus;
  crackedSecret: string | null;
  attemptCount: number;
  timeMs: number;
  forgedToken: string | null;
  explanation: string;
  steps: string[];
  mitigation: string;
}

export interface ReplayResult {
  status: VulnerabilityStatus;
  issues: ReplayIssue[];
  replayedToken: string;
  explanation: string;
  steps: string[];
  mitigation: string;
}

export interface ReplayIssue {
  field: "exp" | "nbf" | "jti" | "iat";
  present: boolean;
  value: string | null;
  risk: string;
}

export interface AttackReport {
  decoded: DecodedJwt;
  algNone: AlgNoneResult;
  bruteForce: BruteForceResult;
  replay: ReplayResult;
  overallRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  analyzedAt: string;
  tokenAgeSeconds: number | null;
  isExpired: boolean;
}

export interface AttackRequest {
  token: string;
  wordlistSize?: "small" | "medium" | "large";
}

export interface AttackResponse {
  success: boolean;
  report: AttackReport | null;
  error?: string;
}
