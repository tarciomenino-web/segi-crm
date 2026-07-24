# Guia de Instalação — SEGi CRM

**Data:** 2026-07-23  
**Status:** Pronto para instalação local

---

## ⚠️ Pré-requisitos

Você precisa ter instalado localmente:

### 1. Node.js (>=18.0.0)

**macOS (Homebrew):**
```bash
brew install node@20
```

**macOS (Direct Download):**
Baixar de: https://nodejs.org/en/download/

**Windows:**
Baixar de: https://nodejs.org/en/download/

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verificar instalação:**
```bash
node --version  # Deve ser v18+ ou v20+
npm --version   # Deve ser 9+
```

### 2. pnpm (>=8.0.0)

**Depois de instalar Node.js:**
```bash
npm install -g pnpm@latest
```

**Verificar instalação:**
```bash
pnpm --version  # Deve ser 8+
```

### 3. Docker Desktop

Para PostgreSQL, Redis e MinIO localmente.

**macOS/Windows:** https://www.docker.com/products/docker-desktop

**Linux:**
```bash
sudo apt-get install docker.io docker-compose
```

**Verificar instalação:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 Instalação Passo a Passo

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/tarciomenino-web/segi-crm.git
cd segi-crm
```

### Passo 2: Instalar Dependências

```bash
pnpm install
```

**Tempo estimado:** 3-5 minutos (primeira vez)

**Saída esperada:**
```
> @pnpm/core run install
 WARN  deprecated joi@17.11.0: joi is deprecated...
Packages: +850
++++++++++++++++++++++++++++++++++
Progress: resolved 850, reused 800
✓ pnpm install completed in 2m 15s
```

Se houver erro, tente:
```bash
pnpm install --force
```

### Passo 3: Copiar Variáveis de Ambiente

```bash
# Root
cp .env.example .env

# API
cp apps/api/.env.example apps/api/.env

# Database
cp packages/database/.env.example packages/database/.env
```

### Passo 4: Verificar Instalação

```bash
# Verificar TypeScript
pnpm typecheck

# Verificar ESLint
pnpm lint

# Listar workspaces
pnpm list --depth=0
```

### Passo 5: Iniciar Docker

```bash
pnpm docker:up
```

**Aguarde até ver:**
```
✓ postgres: healthy
✓ redis: healthy
✓ minio: healthy
```

Isso pode levar 1-2 minutos na primeira vez (download das imagens).

### Passo 6: Preparar Banco de Dados

```bash
# Gerar Prisma Client
pnpm db:generate

# Rodar migrations
pnpm db:migrate

# (Opcional) Seed inicial
pnpm db:seed
```

### Passo 7: Iniciar a API

```bash
# Terminal 1: API
pnpm --filter api start:dev
```

**Saída esperada:**
```
🚀 Application is running on: http://localhost:3000
📚 Swagger docs available at: http://localhost:3000/api/docs
```

---

## ✅ Verificação de Saúde

Após iniciar a API, teste os endpoints:

### Health Check (todos públicos)
```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/live
curl http://localhost:3000/health/ready
```

**Saída esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2026-07-23T22:00:00.000Z",
  "uptime": 123
}
```

### Swagger Documentation
```
Abrir no navegador: http://localhost:3000/api/docs
```

### Login (Teste)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@segi.com",
    "password": "senha123",
    "organizationId": "org-segi"
  }'
```

**Saída esperada:**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

(Esperado porque não há usuários no BD ainda)

---

## 📋 Scripts Úteis

### Desenvolvimento
```bash
# Iniciar API em modo dev (hot reload)
pnpm --filter api start:dev

# Executar TypeScript checker
pnpm typecheck

# Executar ESLint
pnpm lint

# Formatar código
pnpm format
```

### Banco de Dados
```bash
# Acessar Prisma Studio (UI do banco)
pnpm db:studio

# Criar nova migration
pnpm db:migrate

# Resetar banco (CUIDADO!)
pnpm db:push --force-reset
```

### Docker
```bash
# Iniciar containers
pnpm docker:up

# Parar containers
pnpm docker:down

# Ver logs
pnpm docker:logs

# Ver status
pnpm docker:ps
```

### Build
```bash
# Buildar tudo
pnpm build

# Buildar apenas API
pnpm --filter api build

# Iniciar em modo produção
pnpm --filter api start:prod
```

---

## 🐛 Troubleshooting

### Erro: "pnpm: command not found"
```bash
npm install -g pnpm@latest
```

### Erro: "Port 3000 already in use"
```bash
# Mudar porta no .env
PORT=3001
pnpm --filter api start:dev
```

### Erro: "Cannot connect to Docker daemon"
```bash
# Iniciar Docker Desktop (macOS/Windows)
# ou para Linux:
sudo systemctl start docker
```

### Erro: "Database connection refused"
```bash
# Verificar se PostgreSQL está rodando
pnpm docker:ps

# Se não estiver, iniciar
pnpm docker:up

# Aguardar health check passar
```

### Erro: "Module not found"
```bash
# Limpar cache do pnpm
rm -rf node_modules
pnpm install

# Regenerar Prisma Client
pnpm db:generate
```

---

## 📦 Estrutura de Workspaces

Após instalação, você terá:

```
segi-crm/
├── node_modules/          (compartilhado)
├── pnpm-lock.yaml         (lock file)
├── apps/
│   ├── api/               (NestJS)
│   │   └── node_modules/  (específico)
│   ├── web/               (Next.js - próximo)
│   └── worker/            (BullMQ - próximo)
└── packages/
    ├── database/          (Prisma)
    ├── types/             (TypeScript)
    └── ...
```

---

## 🔐 Variáveis de Ambiente

### Root `.env`
```
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/segi-crm
DIRECT_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/segi-crm
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
```

### API `apps/api/.env`
```
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/segi-crm
REDIS_URL=redis://localhost:6379
```

---

## 📊 Checklist de Instalação

- [ ] Node.js >=18.0.0 instalado
- [ ] pnpm >=8.0.0 instalado
- [ ] Docker Desktop instalado
- [ ] Git clone do repositório
- [ ] `pnpm install` executado
- [ ] `.env` arquivos copiados
- [ ] Docker containers rodando
- [ ] `pnpm db:migrate` executado
- [ ] API iniciada com `pnpm --filter api start:dev`
- [ ] Health check respondendo em http://localhost:3000/health
- [ ] Swagger disponível em http://localhost:3000/api/docs

---

## 🎯 Próximos Passos

Após instalação bem-sucedida:

1. **Explorar a API**
   - Acessar Swagger em http://localhost:3000/api/docs
   - Testar endpoints públicos

2. **Começar Fase 2**
   - Implementar módulo de Leads
   - Implementar Opportunities
   - Criar Next.js web app

3. **Integração com Meta e UAZAPI**
   - Configurar webhook Meta
   - Configurar instância UAZAPI

---

## 📚 Documentação Relacionada

- `PHASE_1_COMPLETE.md` — Resumo da Fase 1
- `REVIEW_AND_TEST.md` — Revisão técnica
- `docs/02-architecture.md` — Arquitetura
- `docs/03-database-model.md` — Modelo do banco
- `apps/api/README.md` — Documentação da API

---

**Tempo estimado total:** 15-30 minutos (primeira instalação)

**Próximo**: Aguardar sua instalação local completar ✅

