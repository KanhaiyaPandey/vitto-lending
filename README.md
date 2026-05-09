# Vitto MSME Lending Decision System

A full-stack lending decision system built with Turborepo, React, Express, and Supabase (PostgreSQL).

## Architecture

```
vitto-lending/
├── apps/
│   ├── api/          # Express API (port 4000)
│   └── web/          # React + Vite frontend (port 3000)
└── packages/
    └── shared/       # Shared TypeScript types
```

## Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL via Supabase
- **Language**: TypeScript throughout

---

## Setup

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### 1. Clone and install

```bash
git clone <repo-url>
cd vitto-lending
npm install
```

### 2. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

> The table is created automatically on first startup via `initDb()`.

### 3. Run locally

```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000

---

## API Reference

### POST /api/applications
Submit a loan application and receive an instant credit decision.

**Request body:**
```json
{
  "business": {
    "ownerName": "Ramesh Kumar",
    "pan": "ABCDE1234F",
    "businessType": "retail",
    "monthlyRevenue": 500000
  },
  "loan": {
    "requestedAmount": 2000000,
    "tenureMonths": 24,
    "purpose": "Working capital"
  }
}
```

**Response:**
```json
{
  "applicationId": "uuid",
  "decision": "APPROVED",
  "creditScore": 75,
  "reasonCodes": ["STRONG_PROFILE"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/applications
Returns the last 50 submitted applications (audit log).

### GET /health
Returns `{ "status": "ok" }`.

---

## Decision Engine

All logic is in `apps/api/src/lib/engine.ts`.

### Scoring Model (0–100 points)

| Signal | Points Deducted | Condition |
|---|---|---|
| PAN validation | 15 | Invalid format (not ABCDE1234F) |
| Low revenue | 20 | Monthly revenue < ₹50,000 |
| Loan/revenue ratio | 30 | > 50× revenue |
| Loan/revenue ratio | 20 | > 20× revenue |
| Loan/revenue ratio | 10 | > 10× revenue |
| EMI burden | 40 | EMI > 60% of revenue |
| EMI burden | 20 | EMI > 40% of revenue |
| EMI burden | 10 | EMI > 30% of revenue |
| Tenure risk | 15 | Tenure < 3 or > 60 months |

**Threshold:** Score ≥ 50 → APPROVED

### Assumptions

- EMI is approximated as `loan_amount / tenure` (principal only, no interest rate). This is intentional for a scoring heuristic — actual EMI would require interest rate inputs.
- PAN format follows Indian standard: 5 uppercase letters + 4 digits + 1 uppercase letter.
- ₹50,000 monthly revenue minimum reflects the smallest viable MSME.
- Acceptable tenure range: 3–60 months (short-term bridging to 5-year term).

### Reason Codes

| Code | Meaning |
|---|---|
| `LOW_REVENUE` | Monthly revenue < ₹50,000 |
| `HIGH_LOAN_RATIO` | Loan > 20× monthly revenue |
| `HIGH_EMI_BURDEN` | EMI exceeds 40% of revenue |
| `INVALID_PAN` | PAN format validation failed |
| `DATA_INCONSISTENCY` | Loan > 50× monthly revenue (extreme) |
| `TENURE_RISK` | Tenure outside 3–60 month window |
| `STRONG_PROFILE` | No issues found, all checks passed |

---

## Edge Case Handling

| Case | Handling |
|---|---|
| Missing fields | 400 with `fields` array listing what's missing |
| Negative revenue/amount | Validation rejects with descriptive message |
| Invalid PAN format | Caught in frontend (live) and backend (engine penalises) |
| Loan >> revenue | `DATA_INCONSISTENCY` code, heavy score penalty |
| Short/long tenure | `TENURE_RISK` applied |
| Non-numeric inputs | Express JSON parse + validation middleware |
| DB failure | 500 with generic message, error logged server-side |

---

## Deployment

### API (Render / Railway)
1. Set `DATABASE_URL` and `FRONTEND_URL` env vars
2. Build command: `npm run build`
3. Start command: `node dist/index.js`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed API URL
2. Build command: `npm run build`
3. Output directory: `dist`

---

## Docker (optional)

```bash
docker-compose up
```

See `docker-compose.yml` for configuration.
