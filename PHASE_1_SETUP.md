# Fase 1: Fundação — Setup Guide

**Status:** ✅ Estrutura criada  
**Próximo passo:** Instalar dependências e criar schema Prisma

---

## O que foi criado

✅ Estrutura de monorepo (Turborepo + pnpm)
✅ Configuração TypeScript, ESLint, Prettier
✅ Docker Compose (PostgreSQL, Redis, MinIO)
✅ Arquivo .env.example
✅ Package.json base para apps e packages

## Arquivos criados

```
├── package.json              (root)
├── turbo.json                (monorepo config)
├── pnpm-workspace.yaml       (workspaces)
├── tsconfig.json             (TypeScript)
├── eslint.config.js
├── prettier.config.js
├── .gitignore
├── .env.example
├── apps/
│   ├── web/                  (Next.js - ainda não criado)
│   ├── api/                  (NestJS - ainda não criado)
│   └── worker/               (BullMQ - ainda não criado)
├── packages/
│   ├── database/             (Prisma - criado)
│   ├── types/                (TS types - criado)
│   ├── validation/           (Zod - ainda não criado)
│   ├── integrations/         (ainda não criado)
│   └── config/               (ainda não criado)
└── infrastructure/
    └── docker-compose.yml    (PostgreSQL, Redis, MinIO)
```

---

## Próximos Passos (Fase 1 Completa)

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Copiar .env.example para .env

```bash
cp .env.example .env
cp packages/database/.env.example packages/database/.env
```

### 3. Iniciar containers

```bash
pnpm docker:up
```

Aguarde até que todos os containers estejam healthy:
- postgres: ✅ 5432
- redis: ✅ 6379
- minio: ✅ 9000

### 4. Criar schema Prisma

O arquivo `packages/database/prisma/schema.prisma` precisa ser criado com o schema SQL completo do documento `docs/03-database-model.md`.

### 5. Gerar migrations

```bash
pnpm db:generate
pnpm db:migrate
```

### 6. Criar apps (NestJS + Next.js)

Criar estrutura base para:
- `apps/api` (NestJS)
- `apps/web` (Next.js)
- `apps/worker` (BullMQ)

### 7. Implementar autenticação

- JWT (access + refresh)
- Argon2 (password hashing)
- Guards e estratégias Passport

### 8. Implementar RBAC

- CASL integration
- Guards de permissão
- Middleware de isolamento

---

## Verificação de Setup

```bash
# Verificar estrutura
tree -L 3 -I node_modules

# Verificar TypeScript
pnpm typecheck

# Verificar ESLint
pnpm lint

# Verificar Docker
docker-compose -f infrastructure/docker-compose.yml ps
```

---

## Credenciais Necessárias para Fase 2+

Para as próximas fases, você precisará ter:

```env
# Meta Lead Ads
META_APP_ID=
META_APP_SECRET=
META_VERIFY_TOKEN=
META_ACCESS_TOKEN=

# UAZAPI
UAZAPI_BASE_URL=
UAZAPI_ADMIN_TOKEN=
UAZAPI_WEBHOOK_SECRET=
```

Esses podem ser mocks/vazios para desenvolvimento, mas precisam ser reais para testes de integração.

---

## Próxima Tarefa

Quando estiver pronto, vamos:

1. ✅ Criar NestJS app base
2. ✅ Criar Prisma schema completo
3. ✅ Implementar autenticação JWT
4. ✅ Implementar RBAC com CASL
5. ✅ Criar health checks
6. ✅ Testes base

**Timeline:** 2 semanas

