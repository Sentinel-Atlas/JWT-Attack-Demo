# JWT Attack Demo

Production-style JWT vulnerability demonstration tool showing three practical attack patterns:
- `alg:none` downgrade forgery
- HMAC weak-secret brute-force cracking
- Replay weakness detection (`exp`, `nbf`, `jti`, `iat`)

## Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Crypto: Node built-in `crypto` only (no JWT libraries)

## Features
- Manual JWT decode pipeline (base64url + JSON parse)
- Real HMAC comparison attack loop with configurable wordlist size
- Replay posture report with per-claim risk analysis
- Sample vulnerable tokens endpoint for demo/testing
- MITRE ATT&CK mappings in UI

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend proxies `/api` to backend on `http://localhost:4000`.

## API Reference

### `POST /api/attack`
Request:
```json
{ "token": "<jwt>", "wordlistSize": "medium" }
```

Response:
```json
{ "success": true, "report": { "overallRisk": "HIGH" } }
```

### `GET /api/sample-tokens`
Returns three hardcoded demo tokens.

### `GET /api/health`
Returns service status.

## Security Disclaimer
This project is for authorized security testing and education only. Never test systems without explicit permission.

## Author
Built for **Nima Shahmoradi** — Senior Front-End Developer | Cybersecurity Specialist (Toronto, ON).
Portfolio: nimashahmoradi.com • GitHub: nima-shahmoradi
