# Estrutura do Projeto — SEGi CRM

**Versão:** 1.0  
**Data:** 2026-07-23  
**Padrão:** Turborepo + pnpm workspaces

---

## 1. Árvore de Diretórios

```
segi-crm/
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, test, build
│       ├── e2e.yml             # E2E tests
│       └── deploy.yml          # Deploy automático
│
├── apps/
│   ├── web/                    # Frontend (Next.js + React)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx         # Dashboard executivo
│   │   │   │   ├── inbox/           # Caixa de entrada
│   │   │   │   ├── leads/           # Leads
│   │   │   │   ├── opportunities/   # Oportunidades
│   │   │   │   ├── funnel/          # Kanban
│   │   │   │   ├── schedule/        # Agenda
│   │   │   │   ├── journeys/        # Jornada Gratuita
│   │   │   │   ├── sales/           # Vendas
│   │   │   │   ├── reports/         # Relatórios
│   │   │   │   ├── admin/           # Admin
│   │   │   │   └── settings/        # Configurações
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── forms/           # Form components
│   │   │   ├── tables/          # Table components
│   │   │   ├── charts/          # Chart components
│   │   │   └── layouts/         # Layout components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts          # API client
│   │   │   ├── auth.ts         # Auth utilities
│   │   │   └── utils.ts
│   │   ├── styles/              # Global styles
│   │   ├── public/              # Static assets
│   │   ├── .env.example
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/                     # Backend (NestJS)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   ├── local.strategy.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   └── guards/
│   │   │   │   ├── users/
│   │   │   │   ├── organizations/
│   │   │   │   ├── leads/
│   │   │   │   ├── opportunities/
│   │   │   │   ├── conversations/
│   │   │   │   ├── whatsapp/
│   │   │   │   ├── meta/
│   │   │   │   ├── journeys/
│   │   │   │   ├── sales/
│   │   │   │   ├── webhooks/
│   │   │   │   ├── reports/
│   │   │   │   └── integrations/
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── filters/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── pipes/
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/      # Prisma config
│   │   │   │   ├── redis/
│   │   │   │   ├── s3/
│   │   │   │   ├── logger/
│   │   │   │   └── health/
│   │   │   └── config/            # Config validation
│   │   ├── test/
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── .env.example
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── worker/                  # Background jobs (BullMQ)
│       ├── src/
│       │   ├── main.ts
│       │   ├── processors/
│       │   │   ├── meta-lead.processor.ts
│       │   │   ├── whatsapp-message.processor.ts
│       │   │   ├── automation.processor.ts
│       │   │   ├── notification.processor.ts
│       │   │   ├── sla-check.processor.ts
│       │   │   └── cleanup.processor.ts
│       │   ├── config/
│       │   ├── logger/
│       │   └── utils/
│       ├── .env.example
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── database/                # Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   └── client.ts        # Prisma client
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── types/                   # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── auth.ts
│   │   │   ├── lead.ts
│   │   │   ├── opportunity.ts
│   │   │   ├── conversation.ts
│   │   │   ├── webhook.ts
│   │   │   └── api.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── validation/              # Zod schemas
│   │   ├── src/
│   │   │   ├── auth.ts
│   │   │   ├── lead.ts
│   │   │   ├── opportunity.ts
│   │   │   ├── webhook.ts
│   │   │   └── shared.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── integrations/            # External APIs
│   │   ├── src/
│   │   │   ├── meta/
│   │   │   │   ├── graph-api.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── types.ts
│   │   │   ├── whatsapp/
│   │   │   │   ├── provider.ts
│   │   │   │   ├── uazapi/
│   │   │   │   ├── meta-cloud/
│   │   │   │   └── types.ts
│   │   │   └── s3/
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── config/                  # Configuration
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   ├── jwt.ts
│   │   │   └── integrations.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── eslint-config/           # ESLint
│       ├── index.js
│       └── package.json
│
├── infrastructure/              # Docker e deployment
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   ├── Dockerfile.worker
│   ├── nginx.conf
│   └── scripts/
│       ├── migrate.sh
│       ├── backup.sh
│       └── restore.sh
│
├── docs/
│   ├── 01-product-requirements.md
│   ├── 02-architecture.md
│   ├── 03-database-model.md
│   ├── 04-project-structure.md   (este arquivo)
│   ├── 05-backlog.md
│   ├── 06-risks.md
│   ├── 07-dependencies.md
│   ├── 08-mvp-criteria.md
│   ├── 09-api.md                 (Swagger/OpenAPI)
│   ├── 10-deployment.md
│   ├── 11-security.md
│   ├── 12-testing.md
│   └── 13-troubleshooting.md
│
├── .github/
│   └── CLAUDE.md                 (instruções para futuro trabalho)
│
├── .gitignore
├── .env.example
├── turbo.json                    # Turborepo config
├── pnpm-workspace.yaml           # pnpm workspaces
├── package.json                  # Root package
├── tsconfig.json                 # Root TypeScript config
├── prettier.config.js
├── eslint.config.js
├── jest.config.js
└── README.md
```

---

## 2. Configuração do Turborepo

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/json-schema.json",
  "globalDependencies": [".env", ".env.local"],
  "globalEnv": [
    "NODE_ENV",
    "VERCEL",
    "CI"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": false
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": false
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "db:generate": {
      "dependsOn": [],
      "outputs": ["src/client.ts"]
    },
    "db:migrate": {
      "dependsOn": ["db:generate"],
      "outputs": [],
      "cache": false
    },
    "db:seed": {
      "dependsOn": ["db:migrate"],
      "outputs": [],
      "cache": false
    }
  }
}
```

---

## 3. Configuração do pnpm

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'

shared-workspace-lockfile: true
```

---

## 4. Package.json Root

```json
{
  "name": "segi-crm",
  "version": "0.1.0",
  "description": "CRM comercial multiunidade para SEGi Escola de Gastronomia",
  "private": true,
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev": "turbo dev --parallel",
    "build": "turbo build",
    "test": "turbo test",
    "test:e2e": "turbo test:e2e",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "clean": "turbo clean && rm -rf node_modules",
    "db:generate": "pnpm --filter database db:generate",
    "db:migrate": "pnpm --filter database db:migrate",
    "db:migrate:deploy": "pnpm --filter database db:migrate:deploy",
    "db:seed": "pnpm --filter database db:seed",
    "db:studio": "pnpm --filter database db:studio",
    "docker:build": "docker-compose -f infrastructure/docker-compose.yml build",
    "docker:up": "docker-compose -f infrastructure/docker-compose.yml up",
    "docker:down": "docker-compose -f infrastructure/docker-compose.yml down",
    "docker:logs": "docker-compose -f infrastructure/docker-compose.yml logs -f"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "turbo": "^1.10.0",
    "typescript": "^5.2.0"
  }
}
```

---

## 5. Estrutura de Módulos (NestJS)

Cada módulo segue este padrão:

```
modules/leads/
├── leads.module.ts          # Definição do módulo
├── leads.controller.ts      # Endpoints HTTP
├── leads.service.ts         # Lógica de negócio
├── dto/
│   ├── create-lead.dto.ts
│   ├── update-lead.dto.ts
│   └── list-lead.dto.ts
├── entities/
│   └── lead.entity.ts       # Entidade do banco
├── repositories/
│   └── leads.repository.ts  # Acesso ao Prisma
├── guards/
│   └── lead-ownership.guard.ts
└── __tests__/
    ├── leads.controller.spec.ts
    ├── leads.service.spec.ts
    └── leads.repository.spec.ts
```

---

## 6. Arquivo .env.example (Root)

```env
# Application
NODE_ENV=development
APP_NAME=SEGi CRM
APP_URL=http://localhost:3000
API_URL=http://localhost:4000
API_PUBLIC_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/segi-crm
DIRECT_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/segi-crm

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_ACCESS_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Encryption
ENCRYPTION_KEY=your-encryption-key-here

# AWS S3 (compatible)
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_BUCKET=segi-crm
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin

# Meta
META_APP_ID=
META_APP_SECRET=
META_VERIFY_TOKEN=
META_GRAPH_API_VERSION=v18.0
META_ACCESS_TOKEN=
META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
META_TEST_EVENT_CODE=

# UAZAPI
UAZAPI_BASE_URL=https://api.uazapi.com
UAZAPI_ADMIN_TOKEN=
UAZAPI_WEBHOOK_SECRET=

# Observability
SENTRY_DSN=
LOG_LEVEL=info

# Configuration
DEFAULT_TIMEZONE=America/Sao_Paulo
```

---

## 7. Docker Compose (Desenvolvimento)

### `infrastructure/docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: segi-crm
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: minio server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

---

## 8. Configuração TypeScript

### `tsconfig.json` (Root)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    "baseUrl": ".",
    "paths": {
      "@segi/types": ["packages/types/src"],
      "@segi/validation": ["packages/validation/src"],
      "@segi/integrations": ["packages/integrations/src"],
      "@segi/config": ["packages/config/src"],
      "@segi/database": ["packages/database/src"]
    },

    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  },
  "include": ["."],
  "exclude": ["node_modules", "dist"]
}
```

---

## 9. Próximos Passos

1. ✅ Documentar estrutura
2. ⏳ Criar backlog por fases
3. ⏳ Documentar riscos técnicos
4. ⏳ Listar dependências e credenciais
5. ⏳ Inicializar monorepo

---

**Correspondência:**
- `/apps/web` → Frontend
- `/apps/api` → Backend
- `/apps/worker` → Background jobs
- `/packages/*` → Código compartilhado
- `/infrastructure` → Docker e deploy
