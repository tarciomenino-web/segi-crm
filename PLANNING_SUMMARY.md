# SEGi CRM — Resumo do Planejamento

**Data:** 2026-07-23  
**Status:** ✅ Fase 0 Completa — Pronto para Fase 1

---

## O que foi feito

Documentação completa de planejamento técnico e de produto:

✅ **01-product-requirements.md** — Especificação de produto, escopo MVP, indicadores-chave  
✅ **02-architecture.md** — Decisões arquiteturais, padrões de design, tecnologia stack  
✅ **03-database-model.md** — Schema SQL completo com índices, constraints, seed  
✅ **04-project-structure.md** — Árvore de diretórios, Turborepo, pnpm workspace  
✅ **05-backlog.md** — 274 story points divididos em 9 fases (15 semanas)  
✅ **06-risks-and-dependencies.md** — 15 riscos mapeados + credenciais obrigatórias  
✅ **07-mvp-acceptance-criteria.md** — Checklist de aceite funcional completo  

---

## Tecnologia Stack (Decidida)

### Front-end
- **Next.js 14** + React 18
- **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form** + **Zod** (validação)
- **TanStack Query** (data fetching)
- **TanStack Table** (tabelas)
- **Recharts** (gráficos)

### Back-end
- **NestJS** + Node.js 18+
- **TypeScript** (strict mode)
- **Prisma ORM** (type-safe queries)
- **PostgreSQL** (banco relacional)
- **Redis** + **BullMQ** (cache + filas)
- **Zod** (validação schemas)
- **Argon2** (hashing)

### Infraestrutura
- **Docker** (multi-stage builds)
- **Docker Compose** (dev + prod)
- **PostgreSQL gerenciado** (RDS/Railway)
- **Redis gerenciado** (Redis Cloud)
- **S3-compatible** (arquivos)
- **GitHub Actions** (CI/CD)

---

## Estrutura do Projeto

```
Monorepo (Turborepo + pnpm)
├── apps/web          # Frontend Next.js
├── apps/api          # Backend NestJS
├── apps/worker       # Background jobs (BullMQ)
├── packages/         # Código compartilhado
├── infrastructure/   # Docker + deploy
└── docs/             # Documentação
```

---

## Módulos Principais

### Backend (NestJS)

| Módulo | Responsabilidade | Prioridade |
|--------|-----------------|-----------|
| `auth` | Autenticação JWT + RBAC | 🔴 MVP |
| `users` | Usuários, permissões | 🔴 MVP |
| `organizations` | Organização e unidades | 🔴 MVP |
| `leads` | Captação, duplicação, scoring | 🔴 MVP |
| `opportunities` | Funis, estágios, conversão | 🔴 MVP |
| `conversations` | Caixa de entrada omnichannel | 🔴 MVP |
| `whatsapp` | Integração UAZAPI | 🔴 MVP |
| `meta` | Integração Meta Lead Ads | 🔴 MVP |
| `journeys` | Jornada Gratuita + agenda | 🔴 MVP |
| `sales` | Propostas, matrículas | 🔴 MVP |
| `webhooks` | Orquestração de webhooks | 🔴 MVP |
| `reports` | Relatórios e dashboards | 🔴 MVP |
| `integrations` | Logs de integração | 🔴 MVP |
| `audit` | Auditoria de ações | 🔴 MVP |

---

## Fases de Implementação

| Fase | Semanas | Points | Saída |
|------|---------|--------|-------|
| **0** Planejamento | 1 | ✅ | Documentação |
| **1** Fundação | 2 | 34 | Auth + Banco + Docker |
| **2** CRM Básico | 2 | 28 | Leads + Oportunidades |
| **3** Meta Lead Ads | 2 | 32 | Webhook Meta + Worker |
| **4** WhatsApp | 2 | 36 | Caixa de entrada |
| **5** Jornada | 1 | 20 | Agenda + Check-in |
| **6** Vendas | 1 | 24 | Propostas + Matrículas |
| **7** Analytics | 1 | 28 | Dashboards + CAPI |
| **8** Automações | 1 | 22 | Motor de automações |
| **9** Produção | 2 | 30 | Segurança + Deploy |
| **TOTAL** | **15 semanas** | **274** | **MVP Pronto** |

---

## Integrações Externas (MVP)

### Meta Lead Ads
- ✅ Webhook para receber leads
- ✅ Graph API para dados completos
- ❌ Conversions API (v2, futuro)

### UAZAPI WhatsApp
- ✅ Webhook para mensagens
- ✅ Provider abstrato (preparado para Meta Cloud)
- ✅ QR Code + connection management

### S3-compatible
- ✅ Upload de imagens/documentos
- ✅ Suporte a MinIO (dev) e S3 (prod)

---

## Riscos Críticos (Mapeados)

| Risco | Impacto | Mitigation |
|-------|---------|-----------|
| UAZAPI é API não-oficial | Chat offline | Circuit breaker + health check |
| Webhook Meta pode falhar | Leads perdidos | Sincronização contingência 2x/dia |
| Duplicação de leads | Métricas erradas | Dedup por 4 critérios + central fusão |
| Vazamento de dados | LGPD violação | Middleware de isolamento obrigatório |
| Performance degrada | UX ruim | Índices + cache + pagination |

---

## Credenciais Necessárias

### Obrigatórias para MVP

```
META_APP_ID               ← Developers.facebook.com
META_APP_SECRET           ← Developers.facebook.com
META_VERIFY_TOKEN         ← Gerado no FB
META_ACCESS_TOKEN         ← Token de página/usuário
META_PIXEL_ID             ← Para rastreamento

UAZAPI_BASE_URL           ← API UAZAPI
UAZAPI_ADMIN_TOKEN        ← Token admin
UAZAPI_WEBHOOK_SECRET     ← Secret do webhook

S3_ENDPOINT               ← MinIO (dev) ou AWS S3
S3_BUCKET                 ← Nome do bucket
S3_ACCESS_KEY_ID          ← Chave
S3_SECRET_ACCESS_KEY      ← Segredo

DATABASE_URL              ← PostgreSQL
REDIS_URL                 ← Redis
JWT_ACCESS_SECRET         ← JWT segredo
JWT_REFRESH_SECRET        ← JWT segredo
ENCRYPTION_KEY            ← Para tokens
```

---

## Critérios de Aceite MVP

O sistema está **pronto para uso** quando:

✅ Usuários conseguem autenticar com permissões corretas  
✅ Leads da Meta entram automaticamente  
✅ Leads não são duplicados  
✅ SDR recebe notificação em tempo real  
✅ SDR consegue qualificar e conversar pelo WhatsApp  
✅ SDR consegue agendar Jornada Gratuita  
✅ Closer consegue registrar proposta e matrícula  
✅ Gestor consegue visualizar funil e indicadores  
✅ Marketing consegue ver origem de leads e ROAS  
✅ Auditoria e logs funcionam  
✅ Sistema está em Docker e escala  
✅ Testes essenciais passam (>80% coverage)  
✅ Backups estão configurados  

---

## Próxima Etapa

### 🚀 Fase 1: Fundação (Semanas 2-3)

**Objetivos:**
1. Inicializar Turborepo + pnpm workspaces
2. Configurar PostgreSQL + Prisma
3. Criar NestJS API base
4. Implementar autenticação JWT
5. Implementar RBAC com CASL
6. Docker Compose funcional
7. GitHub Actions CI/CD

**Saída esperada:**
- Usuário consegue fazer login
- Banco de dados pronto
- Build pipeline funcional
- Pronto para Fase 2

---

## Como Usar Esta Documentação

### Para Product Manager
→ Ler: `01-product-requirements.md`

### Para Arquiteto
→ Ler: `02-architecture.md` + `03-database-model.md`

### Para Developer
→ Ler: `04-project-structure.md` + `05-backlog.md`

### Para QA
→ Ler: `07-mvp-acceptance-criteria.md`

### Para DevOps
→ Ler: `04-project-structure.md` + `06-risks-and-dependencies.md`

### Para Security
→ Ler: `06-risks-and-dependencies.md` + `02-architecture.md` (seção de segurança)

---

## Stack Resumido

```
Frontend: Next.js + React + TypeScript + Tailwind
Backend: NestJS + PostgreSQL + Redis + BullMQ
Deploy: Docker + GitHub Actions + Cloud (RDS, S3, etc)
Integration: Meta Ads API + UAZAPI WebSocket
```

---

## Timeline Estimada

- **Semana 1**: Planejamento ✅
- **Semanas 2-3**: Fundação (auth, banco)
- **Semanas 4-5**: CRM básico
- **Semanas 6-7**: Meta Lead Ads
- **Semanas 8-9**: WhatsApp + Caixa de entrada
- **Semanas 10-11**: Jornada + Vendas
- **Semanas 12-14**: Analytics + Automações
- **Semanas 15**: Produção + Deploy

**Total: ~15 semanas para MVP completo**

---

## Próximos Comandos

Quando estiver pronto para começar:

```bash
# 1. Inicializar monorepo
mkdir -p segi-crm/{apps,packages,infrastructure,docs}

# 2. Criar package.json root
pnpm init

# 3. Inicializar Turborepo
npx create-turbo@latest

# 4. Criar apps
cd apps
npx create-next-app web
npx @nestjs/cli new api

# 5. Criar packages compartilhadas
cd ../packages
mkdir database types validation integrations config eslint-config
```

---

## Status Final

| Item | Status |
|------|--------|
| Documentação de produto | ✅ Completo |
| Arquitetura | ✅ Decidida |
| Banco de dados | ✅ Modelado |
| Estrutura do projeto | ✅ Definida |
| Backlog | ✅ Priorizado |
| Riscos | ✅ Mapeados |
| Dependências | ✅ Listadas |
| Critérios de aceite | ✅ Definidos |
| **Pronto para Fase 1?** | ✅ **SIM** |

---

## Comando para Iniciar

Quando autorizar, execute:

```bash
cd /Users/tarciojose/Documents/segi-crm
# Próximo: Inicializar Fase 1
```

---

**Versão:** 1.0  
**Última atualização:** 2026-07-23  
**Próxima revisão:** Após Fase 1

