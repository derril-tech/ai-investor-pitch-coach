# Investor Pitch Coach

An AI coaching platform that turns any startup idea + traction into a fundable pitch narrative, investor-grade deck, financial model checks, and mock Q&A rehearsal—with role-played VCs, timed practice, and actionable, slide-specific feedback.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-investor-pitch-coach
   ```

2. **Start infrastructure services**
   ```bash
   npm run docker:up
   ```

3. **Install dependencies**
   ```bash
   npm run install:all
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:3001
- Orchestrator: http://localhost:8000
- Infrastructure: Postgres (5432), Redis (6379), NATS (4222), MinIO (9000)

## 🏗️ Architecture

### Services

- **Frontend** (`apps/frontend`): Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **API Gateway** (`apps/gateway`): NestJS with OpenAPI, authentication, and rate limiting
- **Orchestrator** (`apps/orchestrator`): FastAPI + CrewAI for multi-agent orchestration
- **Workers** (`apps/workers`): Python Celery workers for background tasks
- **SDK** (`packages/sdk`): TypeScript SDK for API integration

### Infrastructure

- **Database**: PostgreSQL with pgvector for embeddings
- **Cache**: Redis for session storage and caching
- **Message Queue**: NATS for event-driven communication
- **Storage**: MinIO (S3-compatible) for file storage
- **AI Services**: OpenAI, Anthropic for LLM integration

## 📁 Project Structure

```
ai-investor-pitch-coach/
├── apps/
│   ├── frontend/          # Next.js 14 frontend
│   ├── gateway/           # NestJS API gateway
│   ├── orchestrator/      # FastAPI + CrewAI orchestrator
│   └── workers/           # Python Celery workers
├── packages/
│   └── sdk/              # TypeScript SDK
├── docker-compose.dev.yml # Development infrastructure
├── .env.example          # Environment variables template
└── README.md
```

## 🎯 Features

### Core Functionality

- **Narrative Builder**: AI-powered pitch narrative generation
- **Deck Writer**: Automatic slide creation with brand consistency
- **Finance Linter**: Spreadsheet analysis and financial diagnostics
- **Market Sizer**: TAM/SAM/SOM calculations with assumptions
- **Q&A Generator**: VC question simulation and answer coaching
- **Rehearsal Studio**: Speech analysis with filler word detection
- **Export Center**: PPTX, PDF, and integration exports

### AI Agents

- **Story Coach**: Narrative structure and clarity
- **Finance Analyst**: Financial model validation
- **Market Analyst**: Market sizing and competition analysis
- **VC Partner**: Red-team questions and deal evaluation
- **Product Expert**: Product roadmap and GTM strategy
- **Compliance/Legal**: Regulatory and claims verification

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                    # Start all services
npm run dev:frontend          # Frontend only
npm run dev:gateway           # API Gateway only
npm run dev:orchestrator      # Orchestrator only

# Building
npm run build                 # Build all packages
npm run build:frontend        # Build frontend
npm run build:gateway         # Build gateway
npm run build:sdk             # Build SDK

# Infrastructure
npm run docker:up             # Start Docker services
npm run docker:down           # Stop Docker services
npm run docker:logs           # View Docker logs

# Code Quality
npm run lint                  # Lint all packages
npm run install:all           # Install all dependencies
```

### API Documentation

- **API Gateway**: http://localhost:3001/api (Swagger UI)
- **Orchestrator**: http://localhost:8000/docs (FastAPI docs)

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for full list):

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pitch_coach_dev

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Storage
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin

# Authentication
JWT_SECRET=your-jwt-secret
```

## 🧪 Testing

```bash
# Frontend tests
cd apps/frontend && npm test

# Gateway tests
cd apps/gateway && npm test

# Orchestrator tests
cd apps/orchestrator && pytest

# Workers tests
cd apps/workers && pytest
```

## 📦 Deployment

### Production Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy to cloud platform**
   - Frontend: Vercel
   - APIs/Workers: Render/Fly.io
   - Database: Neon/Cloud SQL
   - Storage: S3/R2

### Environment-Specific Configs

- `docker-compose.dev.yml`: Local development
- `docker-compose.prod.yml`: Production deployment
- `.env.example`: Environment variables template

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the architecture overview in `ARCH.md`

---

**Built with ❤️ using Next.js, NestJS, FastAPI, CrewAI, and modern web technologies.**
