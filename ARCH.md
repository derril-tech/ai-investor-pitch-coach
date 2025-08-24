# Architecture Overview — Investor Pitch Coach

## Topology
- **Frontend**: Next.js 14 (Vercel), TS, shadcn/Tailwind, TanStack Query + Zustand, WS/SSE, Recharts, MediaRecorder.
- **API Gateway**: NestJS (REST, RBAC, OpenAPI 3.1, idempotency).
- **Auth**: Auth.js + JWT, SAML/OIDC, SCIM for enterprise.
- **Orchestrator**: FastAPI + CrewAI; FSM (created→drafting→assembling→rehearsing→reviewing→exported).
- **Workers**:
  - `deck-writer` — outline → slide JSON → PPTX/Slides.
  - `evidence-binder` — citations/images → slides.
  - `finance-linter` — spreadsheet parse + diagnostics.
  - `market-sizer` — TAM/SAM/SOM calculators.
  - `qa-generator` — VC Q&A bank + answer coach.
  - `speech-analyzer` — ASR transcript + filler/pacing/sentiment.
  - `exporter` — deliverables (Slides/PPTX, PDFs, CSVs).
- **Infra**: NATS (event bus), Celery (Redis backend), Postgres + pgvector, S3/R2 (storage), Upstash Redis (cache), WS gateway, OTel + Prometheus/Grafana + Sentry.

## Data Model (Postgres)
- **Tenancy**: `orgs`, `users`, `memberships`.
- **Core**: `startups`, `materials` (brief/deck/spreadsheet/media), `narratives` (outline + embeddings), `slides`, `diagnostics_finance`, `tam_sam_som`, `qa_bank`, `rehearsals` (transcripts + metrics), `investor_profiles`, `exports`, `audit_log`.

## API Surface (v1)
- **Auth/Orgs**: login, token/refresh, me, investors CRUD.
- **Startups/Materials**: create startup, upload materials, get startup.
- **Narrative/Deck**: generate outline, rewrite sections, build slides, list slides.
- **Finance/Market**: parse spreadsheet, diagnostics, TAM/SAM/SOM calculators.
- **Q&A/Rehearsal**: generate Q&A, start/stop rehearsal, analyze speech, fetch report.
- **Exports**: deck (Slides/PPTX), one-pager, Q&A CSV, investor brief.
- Conventions: Problem+JSON errors, Idempotency-Key, cursor pagination, RLS.

## Orchestration Logic
- **Agents**: Story Coach, Finance Analyst, Market Analyst, Product Expert, VC Partner, Compliance/Legal, Editor-in-Chief.
- **Tools**: RAG.search, Slides.build, Finance.check, Market.size, QA.generate, ASR.transcribe, Speech.analyze, Moderation.check, Policy.check.
- **FSM**: created → drafting (outline) → assembling (slides/evidence) → rehearsing (speech/Q&A) → reviewing → exported.

## Realtime
- Channels: `startup:{id}:narrative`, `startup:{id}:deck`, `rehearsal:{id}:metrics`, `qa:{startupId}`.
- SSE fallback for restricted networks.

## Security & Safety
- RBAC + Postgres RLS; JWT rotation; SAML/OIDC for enterprise.
- Moderation on generated text; compliance policy checks.
- PII redaction in uploads; audit log for slide edits/exports.
- Secrets in Vault/KMS; OAuth tokens encrypted/rotated.

## Deployment
- FE: Vercel.
- APIs/Workers: Render/Fly/GKE.
- DB: Neon/Cloud SQL Postgres + pgvector.
- Cache: Upstash Redis.
- Storage: S3/R2.
- Event Bus: NATS.
- CI/CD: GitHub Actions (lint/test/docker build/deploy).
- Terraform modules for infra.
