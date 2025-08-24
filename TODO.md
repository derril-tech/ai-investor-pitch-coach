# TODO — Investor Pitch Coach
> 80/20 split: [Cursor] scaffolds, APIs, FE, infra; [Claude] agent prompts/graphs, finance/market heuristics, QA templates, speech feedback.

---

## Phase 0 — Repo & Rules
- [x] [Cursor] Setup repo with apps/{frontend,gateway,orchestrator,workers}, packages/sdk, PRODUCT_BRIEF.
- [x] [Cursor] Add `.cursor/rules/*.mdc`, PLAN/ARCH/TODO/DONE/DECISIONS.
- [x] [Cursor] `.env.example` with DB, Redis, NATS, S3, JWT, OAuth creds.
- [x] [Cursor] `docker-compose.dev.yml` with Postgres+pgvector, Redis, NATS, MinIO.
- [x] [Cursor] Pre-commit hooks, lint configs, `.gitignore`.

## Phase 1 — Contracts & Scaffolds
### Backend
- [x] [Cursor] Bootstrap NestJS gateway with `/v1/health`, OpenAPI, idempotency middleware.
- [x] [Cursor] Define API routes for auth, startups, materials, narrative, slides, finance, market, qa, rehearsal, exports.
- [x] [Cursor] Generate typed SDKs (`packages/sdk-node`, `packages/sdk-web`).
- [x] [Cursor] Orchestrator skeleton (FastAPI + CrewAI FSM).
- [Claude] DB migration #1 (orgs/users, startups/materials, narratives/slides, diagnostics, tam_sam_som, qa_bank, rehearsals, investor_profiles, exports, audit_log).

### Frontend
- [x] [Cursor] Next.js 14 scaffold with Tailwind/shadcn.
- [x] [Cursor] Pages: `/dashboard`, `/startups/new`, `/startups/[id]/{narrative,deck,finance,market,qa,rehearsal,exports}`, `/admin`.
- [x] [Cursor] Stores: `useStartupStore.ts`, `useRehearsalStore.ts`.
- [x] [Cursor] Lib: `api-client.ts`, `ws-client.ts`, `zod-schemas.ts`.

## Phase 2 — Narrative & Slides
### Backend
- [x] [Cursor] `POST /startups/:id/narrative/generate` → narrative JSON.
- [x] [Claude] Story Coach prompt templates + red-team heuristics.
- [x] [Cursor] `POST /narratives/:id/slides/build` → slide previews + PPTX.
- [x] [Cursor] `deck-writer` worker builds slides; `evidence-binder` attaches citations.

### Frontend
- [x] [Cursor] **NarrativeBuilder** UI (outline tree, section templates, tone selector).
- [x] [Cursor] **SlideWorkshop** (slide previews, speaker notes, evidence sidebar).

---

## Phase 3 — Financials & Market
### Backend
- [x] [Cursor] `POST /finance/parse` (spreadsheet ingest), `GET /finance/:startupId/diagnostics`.
- [x] [Claude] Finance lint rules: runway, CAC/LTV, churn, gross margin anomalies.
- [x] [Cursor] `POST /market/size` (TAM/SAM/SOM calc), store results.
- [x] [Claude] Market sizing heuristics & assumption checks.

### Frontend
- [x] [Cursor] **FinanceDiagnostics** (metrics cards, anomaly list, charts).
- [x] [Cursor] **MarketSizer** (input forms, sensitivity sliders, chart export).

---

## Phase 4 — Q&A & Rehearsal
### Backend
- [x] [Cursor] `POST /qa/generate` → save to qa_bank.
- [x] [Claude] VC question templates per sector/stage + answer coach refinements.
- [x] [Cursor] `POST /rehearsals/start|stop`, `POST /rehearsals/:id/analyze` (ASR + speech metrics).
- [x] [Claude] Speech feedback heuristics (pace, filler, sentiment).
- [x] [Cursor] `speech-analyzer` worker → transcript + metrics.

### Frontend
- [x] [Cursor] **QATrainer** (question cards, record/playback, coach suggestions).
- [x] [Cursor] **RehearsalStudio** (timer HUD, live WPM/filler, transcript & feedback report).

---

## Phase 5 — Exports & Integrations
### Backend
- [x] [Cursor] `exporter` worker → PPTX, 1-pager, Q&A CSV, investor brief PDF.
- [x] [Cursor] Integrations: Google Slides, PowerPoint, Drive, Notion, Slack.
- [x] [Cursor] `POST /exports/*` endpoints.

### Frontend
- [x] [Cursor] **ExportCenter** (deliverable selector, destination pickers, status updates).

---

## Phase 6 — Hardening & Deploy
- [x] [Cursor] Add RBAC roles + RLS.
- [x] [Cursor] Moderation filters + compliance policy checks.
- [x] [Cursor] Observability (OTel, Prometheus/Grafana, Sentry).
- [x] [Cursor] Tests: unit, contract, E2E (Playwright), load (k6), chaos, security scans.
- [x] [Cursor] CI/CD: GitHub Actions → Vercel (FE) + Render/Fly (services).
- [x] [Cursor] Terraform stubs for infra.

---

## Ongoing
- [Cursor] Update DECISIONS.log + DONE.md after each milestone.
- [Cursor] Refresh PLAN.md "Next 3 Tasks" as phases complete.
- [Claude] Iterate agent prompts, finance lint heuristics, Q&A quality, rehearsal feedback.
