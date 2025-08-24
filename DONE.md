# DONE — Investor Pitch Coach

## Phase 0 — Repo & Rules

[2024-08-24] [Cursor] Setup repo with apps/{frontend,gateway,orchestrator,workers}, packages/sdk, PRODUCT_BRIEF.
[2024-08-24] [Cursor] Add `.cursor/rules/*.mdc`, PLAN/ARCH/TODO/DONE/DECISIONS.
[2024-08-24] [Cursor] `.env.example` with DB, Redis, NATS, S3, JWT, OAuth creds.
[2024-08-24] [Cursor] `docker-compose.dev.yml` with Postgres+pgvector, Redis, NATS, MinIO.
[2024-08-24] [Cursor] Pre-commit hooks, lint configs, `.gitignore`.

## Phase 1 — Contracts & Scaffolds

[2024-08-24] [Cursor] Bootstrap NestJS gateway with `/v1/health`, OpenAPI, idempotency middleware.
[2024-08-24] [Cursor] Define API routes for auth, startups, materials, narrative, slides, finance, market, qa, rehearsal, exports.
[2024-08-24] [Cursor] Generate typed SDKs (`packages/sdk-node`, `packages/sdk-web`).
[2024-08-24] [Cursor] Orchestrator skeleton (FastAPI + CrewAI FSM).
[2024-08-24] [Cursor] Next.js 14 scaffold with Tailwind/shadcn.
[2024-08-24] [Cursor] Pages: `/dashboard`, `/startups/new`, `/startups/[id]/{narrative,deck,finance,market,qa,rehearsal,exports}`, `/admin`.
[2024-08-24] [Cursor] Stores: `useStartupStore.ts`, `useRehearsalStore.ts`.
[2024-08-24] [Cursor] Lib: `api-client.ts`, `ws-client.ts`, `zod-schemas.ts`.

## Phase 2 — Narrative & Slides

[2024-08-24] [Cursor] `POST /startups/:id/narrative/generate` → narrative JSON.
[2024-08-24] [Claude] Story Coach prompt templates + red-team heuristics.
[2024-08-24] [Cursor] `POST /narratives/:id/slides/build` → slide previews + PPTX.
[2024-08-24] [Cursor] `deck-writer` worker builds slides; `evidence-binder` attaches citations.
[2024-08-24] [Cursor] **NarrativeBuilder** UI (outline tree, section templates, tone selector).
[2024-08-24] [Cursor] **SlideWorkshop** (slide previews, speaker notes, evidence sidebar).

## Phase 3 — Financials & Market

[2024-08-24] [Cursor] `POST /finance/parse` (spreadsheet ingest), `GET /finance/:startupId/diagnostics`.
[2024-08-24] [Claude] Finance lint rules: runway, CAC/LTV, churn, gross margin anomalies.
[2024-08-24] [Cursor] `POST /market/size` (TAM/SAM/SOM calc), store results.
[2024-08-24] [Claude] Market sizing heuristics & assumption checks.
[2024-08-24] [Cursor] **FinanceDiagnostics** (metrics cards, anomaly list, charts).
[2024-08-24] [Cursor] **MarketSizer** (input forms, sensitivity sliders, chart export).

## Phase 4 — Q&A & Rehearsal

[2024-08-24] [Cursor] `POST /qa/generate` → save to qa_bank.
[2024-08-24] [Claude] VC question templates per sector/stage + answer coach refinements.
[2024-08-24] [Cursor] `POST /rehearsals/start|stop`, `POST /rehearsals/:id/analyze` (ASR + speech metrics).
[2024-08-24] [Claude] Speech feedback heuristics (pace, filler, sentiment).
[2024-08-24] [Cursor] `speech-analyzer` worker → transcript + metrics.
[2024-08-24] [Cursor] **QATrainer** (question cards, record/playback, coach suggestions).
[2024-08-24] [Cursor] **RehearsalStudio** (timer HUD, live WPM/filler, transcript & feedback report).

## Phase 5 — Exports & Integrations

[2024-08-24] [Cursor] `exporter` worker → PPTX, 1-pager, Q&A CSV, investor brief PDF.
[2024-08-24] [Cursor] Integrations: Google Slides, PowerPoint, Drive, Notion, Slack.
[2024-08-24] [Cursor] `POST /exports/*` endpoints.
[2024-08-24] [Cursor] **ExportCenter** (deliverable selector, destination pickers, status updates).

## Phase 6 — Hardening & Deploy

[2024-08-24] [Cursor] Add RBAC roles + RLS.
[2024-08-24] [Cursor] Moderation filters + compliance policy checks.
[2024-08-24] [Cursor] Observability (OTel, Prometheus/Grafana, Sentry).
[2024-08-24] [Cursor] Tests: unit, contract, E2E (Playwright), load (k6), chaos, security scans.
[2024-08-24] [Cursor] CI/CD: GitHub Actions → Vercel (FE) + Render/Fly (services).
[2024-08-24] [Cursor] Terraform stubs for infra.
