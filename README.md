# Akasha Lekha

> A monorepo platform combining a developer-focused technical blog with interactive hands-on labs.

**Domain:** [works-on-my.cloud](https://works-on-my.cloud)

## Overview

Akasha Lekha is a comprehensive learning platform for developers:

- **Blog** - Technical articles and series on AWS, DevOps, and cloud engineering
- **Labs** - Interactive, hands-on exercises with CLI verification and progress tracking

## Quick Start

```bash
# Install dependencies
pnpm install

# Start everything for development
pnpm dev:all

# Or run individually:
pnpm dev         # Blog only (apps/web)
pnpm dev:api     # API only (SST dev mode)
```

## Project Structure

```
akasha-lekha/
├── apps/
│   └── web/                    # Astro blog + labs frontend
├── packages/
│   ├── api/                    # Lambda functions (auth, exercises, progress)
│   ├── types/                  # Shared TypeScript types
│   └── db/                     # Database utilities (planned)
├── infra/                      # SST infrastructure definitions
│   ├── api.ts                  # API Gateway routes
│   ├── auth.ts                 # Secrets configuration
│   └── database.ts             # DynamoDB tables
├── .readme/                    # Project documentation
│   ├── architecture/           # Architecture docs
│   └── sst-api-development.md  # SST development guide
├── sst.config.ts               # SST configuration
├── docker-compose.yml          # Local DynamoDB
└── pnpm-workspace.yaml         # Monorepo configuration
```

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture Overview](.readme/architecture/overview.md) | High-level system architecture |
| [Blog Setup](.readme/architecture/blog.md) | Astro blog configuration and content creation |
| [Labs Platform](.readme/architecture/labs.md) | Interactive labs system |
| [Backend (SST)](.readme/architecture/backend-sst.md) | API and infrastructure |
| [CI/CD Workflows](.readme/architecture/ci-cd.md) | GitHub Actions pipelines |
| [SST Development Guide](.readme/sst-api-development.md) | Detailed SST API development reference |

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Astro 5.x, Solid.js, Tailwind CSS v4 |
| **Backend** | SST v3, AWS Lambda, API Gateway |
| **Database** | DynamoDB (single-table design) |
| **Auth** | GitHub OAuth, JWT |
| **Infrastructure** | AWS (ap-south-1), Cloudflare Pages |
| **CI/CD** | GitHub Actions |

## Development

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (for local DynamoDB)
- AWS CLI configured (for SST deployment)

### Environment Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd akasha-lekha
pnpm install

# 2. Start local DynamoDB
pnpm db:local

# 3. Start development
pnpm dev:all
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start blog dev server |
| `pnpm dev:api` | Start SST dev mode |
| `pnpm dev:all` | Start both concurrently |
| `pnpm build` | Build blog for production |
| `pnpm test` | Run all tests |
| `pnpm typecheck` | Type check all packages |
| `pnpm db:local` | Start local DynamoDB |
| `pnpm db:local:stop` | Stop local DynamoDB |

### SST Commands

```bash
# Development
pnpm sst dev                      # Live Lambda development
pnpm sst dev --stage preview      # Specific stage

# Deployment
pnpm sst deploy --stage preview   # Deploy to preview
pnpm sst deploy --stage prod      # Deploy to production

# Secrets
pnpm sst secret set KEY value --stage preview
pnpm sst secret list --stage preview

# Outputs
pnpm sst output --stage preview   # View API URL, table names
```

## Deployment

### Blog (Cloudflare Pages)

The blog deploys automatically via GitHub Actions:

- **Preview**: Every PR gets a preview deployment
- **Production**: Merges to `main` deploy to production

### API (AWS via SST)

```bash
# Preview environment
pnpm sst deploy --stage preview

# Production environment
pnpm sst deploy --stage prod
```

### Required Secrets

**GitHub (Repository Secrets):**
- `CLOUDFLARE_API_TOKEN` - For Pages deployment
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account

**SST (per stage):**
```bash
pnpm sst secret set GithubClientId <value> --stage <stage>
pnpm sst secret set GithubClientSecret <value> --stage <stage>
pnpm sst secret set JwtSecret <value> --stage <stage>
```

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and commit (pre-commit hooks run automatically)
3. Push and create a PR
4. Preview deployment is created automatically
5. After review, merge to `main` for production deployment

### Pre-commit Hooks

The following checks run on every commit:

- ESLint - Code linting
- Prettier - Code formatting
- TypeScript - Type checking
- Build verification

To bypass in emergencies: `git commit --no-verify -m "message"`

## License

Private project.
