# Architecture & Tradeoffs — Vitto MSME Lending

## Architecture Decisions

### Monorepo with Turborepo
Turborepo was chosen for task orchestration and caching. With two apps (`api`, `web`) and a shared types package, a monorepo keeps everything cohesive without introducing unnecessary complexity. The `@vitto/shared` package ensures the frontend and backend share the same TypeScript interfaces without duplication.

### Backend: Express over frameworks like Fastify or NestJS
The requirement was light — three endpoints, one table, one decision function. NestJS would introduce decorators, modules, DI containers — all unnecessary overhead for this scope. Express with `tsx` for development and plain `tsc` for production is the smallest surface area that does the job correctly.

### Database: Supabase (PostgreSQL)
Supabase was chosen because it provides a managed PostgreSQL instance with zero infrastructure work, a free tier suitable for assessment purposes, and SSL by default. The schema is a single `applications` table. No ORM was used — raw `pg` queries are sufficient and transparent for this use case.

### Frontend: React + Vite + Tailwind
Vite is faster than CRA or Webpack for a project of this size. Tailwind was specified in the brief. The frontend is a single page — one form view, one result view — no router needed.

### Decision Engine: Pure function, no ML
The credit engine is a deterministic scoring function. This was an intentional choice: it is fully auditable, testable, and explainable — critical properties for a lending decision system. The scoring model penalises EMI burden most heavily (40 pts) because it most directly represents repayment capacity, followed by loan-to-revenue ratio (30 pts) as a leverage signal.

---

## Tradeoffs

| Decision | Chosen | Tradeoff |
|---|---|---|
| ORM vs raw SQL | Raw `pg` | Less boilerplate, less abstraction — fine for single table |
| MongoDB | Not used | Only PostgreSQL is needed; adding Mongo for one table would be over-engineering |
| Interest rate in EMI | Not included | Requires rate input, out of scope for MVP scoring |
| Async job queue | Not implemented | Brief lists it as bonus; synchronous response is simpler and sufficient |
| Auth | Not implemented | Out of scope for the assessment |

---

## What I'd Improve With More Time

1. **Interest-adjusted EMI**: Incorporate a market rate (e.g. 18% per annum) into the EMI calculation for a more realistic burden ratio.

2. **Async processing with polling**: Move the decision to a background job (BullMQ + Redis), return a `202 Accepted` with a job ID, and let the frontend poll `/api/applications/:id/status`. This mirrors real lending systems where bureau checks are async.

3. **Bureau data mocking**: Simulate a CIBIL score lookup that contributes to the credit score, making the model richer.

4. **Rate limiting per PAN**: Prevent the same PAN from submitting more than N applications per day — a basic fraud signal.

5. **Admin audit view**: A simple table in the frontend showing recent applications, filter by decision, with export to CSV.

6. **Test coverage**: Unit tests for the decision engine covering boundary conditions (score = 49, score = 50, all flags simultaneously).
