# Project Plan — Investor Pitch Coach

## Current Goal
Deliver an MVP slice: founder uploads brief + spreadsheet → Story Coach + agents draft narrative outline → deck-writer generates 5–7 slides (Problem, Solution, Market, Traction, Ask) with previews → finance-linter runs diagnostics → rehearsal studio streams ASR transcript + filler count → export PPTX + rehearsal feedback PDF.  

Runs locally with docker-compose (DB, Redis, NATS, MinIO); FE on Vercel; APIs/workers on Render.

## 80/20 Build Strategy
- 80% [Cursor]: monorepo setup, REST/OpenAPI surfaces, DB migrations, FE routes/components, CI/CD, infra wiring, exports.
- 20% [Claude]: agent prompt graphs (Story Coach, VC Partner, Analyst roles), narrative scoring heuristics, finance lint rules, Q&A templates, speech feedback heuristics.

## Next 3 Tasks
1. [Cursor] NestJS API Gateway `/v1` endpoints for auth, startups, narratives, slides, finance, market, qa, rehearsal, exports; typed SDKs.
2. [Claude] Orchestrator skeleton (FastAPI + CrewAI) with FSM (created→drafting→assembling→rehearsing→reviewing→exported) and initial agent graph.
3. [Cursor] Next.js 14 scaffold with Tailwind/shadcn, pages: `/dashboard`, `/startups/new`, `/startups/[id]/{narrative,deck,finance,market,qa,rehearsal,exports}`, `/admin`.

## Phase Plan
- **P0 Repo/Infra** — scaffolds, rules, envs, CI.
- **P1 Contracts** — API, DB migration #1, orchestrator FSM.
- **P2 Narrative/Slides** — Story Coach outline → deck-writer slides.
- **P3 Financials/Market** — spreadsheet parsing, TAM/SAM/SOM service.
- **P4 Q&A/Rehearsal** — VC question generation, rehearsal studio with ASR/filler count.
- **P5 Exports/Integrations** — PPTX, 1-pager, Q&A CSV, meeting briefs; push to Slides/Drive/Notion.
- **P6 Hardening/Deploy** — moderation, observability, CI/CD pipelines.

## Definition of Done (MVP)
- User uploads brief + spreadsheet → receives draft narrative + 7 slides within 2 min P95.
- Finance anomalies flagged in <30s.
- Rehearsal studio streams transcript with filler count in real-time.
- Export deck (PPTX) + Q&A CSV successfully to Drive/Slides.
