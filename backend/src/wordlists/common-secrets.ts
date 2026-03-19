const BASE_50 = [
  "secret", "password", "123456", "jwt_secret", "your-256-bit-secret",
  "supersecret", "mysecret", "test", "dev", "prod", "qwerty", "abc123",
  "changeme", "default", "admin", "token", "key", "private", "secretkey",
  "jwttoken", "myapp", "appSecret", "signing_key", "jwt-secret-key",
  "SECRET_KEY", "JWT_SECRET", "access_token_secret", "refresh_secret",
  "hs256secret", "weak", "12345", "password123", "letmein", "welcome",
  "monkey", "dragon", "master", "login", "pass", "root", "toor",
  "hello", "world", "security", "secure", "unsafe", "hack", "test123",
  "demo", "sample"
];

const EXTRA_100 = [
  "example", "express_secret", "node_secret", "react_app", "django_secret",
  "flask_secret", "laravel_key", "rails_secret", "spring_jwt", "nextjs_secret",
  "nestjs_secret", "fastapi_secret", "api_secret", "api_key_secret", "backend_secret",
  "frontend_secret", "myapp_secret", "webapp_jwt", "company_secret", "project_secret",
  "staging_secret", "production_secret", "development_secret", "local_secret", "auth_secret",
  "token_secret", "signingsecret", "jwt_signing_key", "session_secret", "cookie_secret",
  "super_secret", "ultrasecret", "verysecret", "notsosecret", "tempsecret",
  "secret2023", "secret2024", "secret2025", "secret2026", "password2024",
  "password2025", "admin123", "admin2024", "welcome123", "letmein123",
  "qazwsx", "1qaz2wsx", "zxcvbn", "asdfgh", "qwerty123",
  "iloveyou", "trustno1", "football", "baseball", "sunshine",
  "princess", "whatever", "freedom", "starwars", "mustang",
  "jordan", "harley", "cheese", "internet", "service",
  "auth", "jwt", "hs256", "hs384", "hs512",
  "token123", "secret123", "secret!", "password!", "admin!",
  "changeme123", "default123", "devsecret", "prodsecret", "testsecret",
  "internal", "external", "public", "privatekey", "signkey",
  "jwtkey", "jwtpass", "apppassword", "application", "enterprise",
  "microservice", "gateway", "oauthsecret", "openidsecret", "ssosecret",
  "azure_secret", "aws_secret", "gcp_secret", "k8s_secret", "docker_secret"
];

const EXTRA_50 = [
  "c2VjcmV0", "cGFzc3dvcmQ=", "736563726574", "70617373776f7264", "deadbeef",
  "cafebabe", "0x123456", "0xabcdef", "aaaaaaaaaaaaaaaa", "bbbbbbbbbbbbbbbb",
  "0123456789", "12341234", "abcd1234", "a1b2c3d4", "jwt-jwt-jwt",
  "token-token", "sign-sign", "super-secret-key", "ultra-secure-key", "my-signing-secret",
  "enterprise-secret-key", "this_is_not_secure", "please_change_me", "temporary_secret", "sample_secret",
  "demo_secret", "example_secret", "acme_secret", "contoso_secret", "globex_secret",
  "initech_secret", "umbrella_secret", "wayne_secret", "stark_secret", "shield_secret",
  "authserver", "jwtserver", "api_gateway_secret", "mobile_app_secret", "web_client_secret",
  "service_account_secret", "internal_api_secret", "legacy_secret", "old_secret", "backup_secret",
  "rotating_secret", "longbutguessablepassword", "correcthorsebatterystaple", "simple-secret-phrase", "jwt_demo_secret"
];

export const SMALL_WORDLIST = BASE_50;
export const MEDIUM_WORDLIST = [...BASE_50, ...EXTRA_100];
export const LARGE_WORDLIST = [...MEDIUM_WORDLIST, ...EXTRA_50];

export function getWordlist(size: "small" | "medium" | "large"): string[] {
  switch (size) {
    case "small":
      return SMALL_WORDLIST;
    case "medium":
      return MEDIUM_WORDLIST;
    case "large":
    default:
      return LARGE_WORDLIST;
  }
}
