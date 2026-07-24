# Arquitetura — SEGi CRM

**Versão:** 1.0  
**Data:** 2026-07-23  
**Status:** Aprovado

---

## 1. Visão Geral

Sistema monolítico modular com separação clara de domínios, preparado para migração para microsserviços no futuro.

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                    │
│              apps/web (TypeScript + React)              │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP + WebSocket
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (NestJS + Node.js)                 │
│  apps/api (Monolítico com módulos independentes)       │
└─────────────────────┬──────────────────┬────────────────┘
                      │                  │
                      ↓                  ↓
        ┌──────────────────────┐  ┌──────────────┐
        │  PostgreSQL + Prisma │  │ Redis + Bull │
        │    (Dados)           │  │  (Queue)     │
        └──────────────────────┘  └──────────────┘
                      │
                      ↓
        ┌──────────────────────────────────┐
        │ Worker (BullMQ Consumer)         │
        │ apps/worker (Tarefas assíncronas)│
        └──────────────────────────────────┘
                      │
        ┌─────────────┼──────────────────┐
        ↓             ↓                  ↓
    ┌────────┐   ┌─────────────┐   ┌─────────┐
    │ Meta   │   │ UAZAPI      │   │ S3      │
    │ Ads    │   │ WhatsApp    │   │ Storage │
    └────────┘   └─────────────┘   └─────────┘
```

---

## 2. Decisões de Arquitetura

### 2.1 Monolítico Modular vs Microsserviços

**Decisão:** Iniciar com monolítico modular.

**Motivo:**
- Complexidade reduzida no MVP
- Facilita transações ACID
- Menos overhead operacional
- Permite migração gradual para microserviços

**Alternativas avaliadas:**
- ❌ Microsserviços desde o início (complexo, overhead operacional)
- ❌ Monolítico sem modularização (difícil evoluir)
- ✅ Monolítico modular (melhor equilíbrio)

**Evolução:**
- Módulos podem se tornar serviços independentes se crescerem demais
- Message bus preparado para desacoplamento futuro

---

### 2.2 Banco de Dados

**Decisão:** PostgreSQL com Prisma ORM.

**Motivo:**
- ACID transactions obrigatórias
- Suporte a JSON (metadados de webhook)
- Índices avançados (trigram, full-text)
- Migrations versionadas
- Cloud-friendly (RDS, Railway, Azure)

**Por que não:**
- ❌ MongoDB: não é relacional, duplicação comum
- ❌ Supabase direct: não, vamos usar Prisma
- ✅ PostgreSQL gerenciado

---

### 2.3 Cache e Filas

**Decisão:** Redis + BullMQ.

**Motivo:**
- Redis: cache, sessions, publish-subscribe
- BullMQ: filas robustas, retentativas, scheduled jobs
- Ambos: documentação excelente, maduro

**Por que não:**
- ❌ RabbitMQ: mais complexo para o MVP
- ❌ AWS SQS: custo, menos controle local
- ✅ BullMQ em Redis

---

### 2.4 WebSocket vs SSE

**Decisão:** WebSocket inicialmente, SSE como fallback.

**Motivo:**
- WebSocket: latência menor, bi-direcional
- SSE: fallback se WebSocket falhar
- Socket.io: gerencia ambos automaticamente

**Casos de uso:**
- Notificações em tempo real
- Caixa de entrada live
- Status da instância WhatsApp
- Atualizações de SLA

---

### 2.5 Autenticação

**Decisão:** JWT (access + refresh token) com Argon2.

**Motivo:**
- JWT: stateless, escalável
- Refresh token: segurança
- Argon2: resistente a força bruta
- Sessions revogáveis

**Fluxo:**
1. Login → Access Token (15 min) + Refresh Token (30 dias)
2. Refresh → Novo Access Token
3. Logout → Revoga token no Redis
4. 2FA: opcional para admin

---

### 2.6 Isolamento de Dados (Multiunidade)

**Decisão:** Campo `organization_id` + `unit_id` em todas as queries.

**Motivo:**
- Simplicidade
- Sem complexidade de schemas
- Auditoria fácil
- Futuro suporte a franquias

**Implementação:**
- Middleware que injeta IDs do JWT
- Query builder que filtra automaticamente
- Testes de segurança para acesso não autorizado

---

### 2.7 Integrações Externas

**Decisão:** Adaptadores por provedor (estratégia de bridge).

```typescript
interface WhatsAppProvider {
  sendMessage(): Promise<void>
  receiveWebhook(): void
  getStatus(): Promise<Status>
}

class UazapiProvider implements WhatsAppProvider { }
class MetaCloudProvider implements WhatsAppProvider { }
```

**Motivo:**
- Trocar provedor sem impacto no domínio
- Testar com mocks facilmente
- Suportar múltiplos provedores em paralelo

---

### 2.8 Processamento Assíncrono

**Decisão:** Responder ao webhook rapidamente, processar em fila.

**Motivo:**
- Webhook rápido = menos timeout
- Processamento em background = sem bloqueio
- Retentativas automáticas
- Idempotência garantida

**Fluxo:**
```
Meta envia lead (webhook)
→ Validação rápida (< 100ms)
→ HTTP 200
→ Salvar payload bruto
→ Enfileirar job
→ Worker processa (log, dedup, distribuição)
```

---

### 2.9 Idempotência

**Decisão:** Chave única por evento externo + status de processamento.

**Motivo:**
- Webhooks podem ser reenviados
- Mesmo lead não pode entrar 2x
- Meta retry policy: até 5 vezes

**Implementação:**
```sql
webhook_events(
  provider TEXT,
  event_id TEXT,
  status ENUM('pending', 'processed', 'failed'),
  UNIQUE(provider, event_id)
)
```

---

### 2.10 Soft Delete

**Decisão:** `deleted_at` NOT NULL para marcar exclusão, nunca apagar.

**Motivo:**
- Auditoria completa
- Histórico intacto
- Recuperação possível
- Conformidade LGPD

**Exceção:** Logs técnicos antigos podem ser apagados após 90 dias.

---

## 3. Mapa de Módulos

```
apps/api/src/
├── modules/
│   ├── auth/              # Autenticação, JWT, 2FA
│   ├── users/             # Usuários, permissões, RBAC
│   ├── organizations/     # Organização, unidades
│   ├── leads/             # Leads, duplicação, scoring
│   ├── opportunities/     # Oportunidades, funis, stages
│   ├── crm/               # Atividades, tarefas, timeline
│   ├── conversations/     # Conversas omnichannel
│   ├── whatsapp/          # Integração UAZAPI
│   ├── meta/              # Integração Meta Lead Ads
│   ├── journeys/          # Jornada Gratuita
│   ├── sales/             # Propostas, matrículas, vendas
│   ├── assignments/       # Distribuição de leads
│   ├── sla/               # SLA, alertas
│   ├── automations/       # Motor de automações
│   ├── reports/           # Relatórios, analytics
│   ├── webhooks/          # Orquestração de webhooks
│   ├── integrations/      # Logs, health check
│   ├── audit/             # Auditoria, logs
│   ├── notifications/     # Notificações em tempo real
│   └── config/            # Configurações globais
├── common/
│   ├── decorators/        # Guards, pipes
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Logging, timing
│   └── strategies/        # Passport strategies
├── infrastructure/
│   ├── database/          # Prisma config
│   ├── redis/             # Redis client
│   ├── s3/                # S3 client
│   └── logger/            # Winston config
└── main.ts

apps/worker/src/
├── processors/
│   ├── webhook.processor.ts
│   ├── meta.processor.ts
│   ├── whatsapp.processor.ts
│   ├── automation.processor.ts
│   ├── notification.processor.ts
│   └── cleanup.processor.ts
└── main.ts

packages/
├── database/              # Prisma schema, migrations
├── types/                 # TypeScript shared types
├── validation/            # Zod schemas
├── integrations/
│   ├── meta/
│   ├── whatsapp/
│   └── s3/
├── config/                # Config validation
└── eslint-config/
```

---

## 4. Fluxo de Integração Meta Lead Ads

```
┌─────────────────┐
│ Meta Platform   │
│ (Lead Ads)      │
└────────┬────────┘
         │
         │ Webhook (lead_id)
         ↓
┌──────────────────────────────────┐
│ POST /webhooks/meta/leadgen      │
│ • Validar token                  │
│ • Responder HTTP 200 imediato    │
│ • Salvar payload bruto           │
│ • Enfileirar job                 │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ BullMQ: ProcessMetaLeadJob       │
│ • Consultar dados completos      │
│ • Graph API /leadgen_id          │
│ • Normalizar campos              │
│ • Verificar duplicidade          │
│ • Criar/atualizar lead           │
│ • Criar oportunidade             │
│ • Distribuir para SDR            │
│ • Notificar SDR                  │
│ • Registrar evento               │
└──────────────────────────────────┘
```

---

## 5. Fluxo de Integração UAZAPI WhatsApp

```
┌──────────────────┐
│ UAZAPI WhatsApp  │
│ Instance         │
└────────┬─────────┘
         │
         │ Webhook (message, status)
         ↓
┌──────────────────────────────────┐
│ POST /webhooks/whatsapp/uazapi   │
│ • Validar secret                 │
│ • Responder HTTP 200 imediato    │
│ • Salvar payload bruto           │
│ • Enfileirar job                 │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ BullMQ: ProcessWhatsAppJob       │
│ • Normalizar telefone (E.164)    │
│ • Identificar lead               │
│ • Criar conversa se nova         │
│ • Armazenar mensagem             │
│ • Atualizar caixa de entrada     │
│ • Executar automações            │
│ • Notificar responsável          │
│ • Marcar como lida (quando OK)   │
└──────────────────────────────────┘
```

---

## 6. Padrão de Validação

Usar **Zod** em toda API.

```typescript
// schemas/create-lead.ts
export const CreateLeadSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().regex(/^\+55/),
  email: z.string().email().optional(),
  courseId: z.uuid(),
  unitId: z.uuid(),
  source: z.enum(['META_ADS', 'WHATSAPP', 'MANUAL']),
})

// controller
@Post()
async create(@Body(ZodValidationPipe) dto: CreateLeadDto) {
  return this.service.create(dto)
}
```

---

## 7. Padrão de Permissões

**Usar CASL + Guards customizados.**

```typescript
@UseGuards(AuthGuard, CaslGuard)
@CheckAbilities({ action: 'read', subject: 'Lead' })
@Get(':id')
async getOne(@Param('id') id: string) {
  // CASL garante unit_id
}
```

---

## 8. Tratamento de Erros

```typescript
// Consistent error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone format",
    "details": {
      "phone": "Must start with +55"
    },
    "timestamp": "2026-07-23T10:30:00Z",
    "requestId": "req-12345"
  }
}
```

---

## 9. Logging

**Estruturado com Winston + Correlation ID.**

```json
{
  "timestamp": "2026-07-23T10:30:00Z",
  "level": "info",
  "correlationId": "req-12345",
  "userId": "user-789",
  "organizationId": "org-1",
  "unitId": "unit-5",
  "action": "lead.created",
  "duration": 125,
  "message": "Lead criado via Meta Ads"
}
```

---

## 10. Observabilidade

- **Logs:** Winston (estruturado)
- **Métricas:** Prometheus (CPU, memória, requests)
- **Traces:** Correlation ID (correlacionar requests)
- **Health checks:** `/health`, `/health/live`, `/health/ready`

---

## 11. Segurança

### Autenticação
- Argon2 para senhas
- JWT com access + refresh
- 2FA para admin

### Autorização
- RBAC com CASL
- Validação de `organization_id` e `unit_id` em cada query

### Dados em trânsito
- HTTPS obrigatório
- CORS restrito
- Helmet para headers

### Dados em repouso
- Criptografia de tokens (AES-256)
- Senhas hashadas (Argon2)
- Campos sensíveis mascarados em logs

### Rede
- Rate limiting (100 req/min por IP)
- Proteção contra brute force
- Circuit breaker para APIs externas

---

## 12. Escalabilidade

**Horizontal:**
- API stateless (JWT)
- Sessions em Redis (compartilhado)
- WebSocket com Redis adapter
- Load balancer (nginx/haproxy)

**Vertical:**
- Connection pooling (Prisma)
- Cache de queries (Redis)
- Índices de banco (btree, trigram)

**Assíncrono:**
- BullMQ workers escaláveis
- Processing em background
- Retry automático

---

## 13. Performance

| Métrica | Target | Como atingir |
|---------|--------|------------|
| TTFB | < 200ms | Cache, CDN |
| API latency | < 500ms | Índices, connection pooling |
| Webhook response | < 100ms | Validação rápida + fila |
| PageLoad | < 2s | Code splitting, lazy load |
| LCP (CMS) | < 2.5s | Optimize images, fonts |

---

## 14. Evolução Futura

### v2 (3-6 meses)
- Meta Conversions API
- Automações avançadas
- 2FA obrigatório para admin
- Integração com gateway de pagamento

### v3 (6-12 meses)
- Microsserviços (Meta, WhatsApp, analytics)
- Machine Learning (lead scoring, churn prediction)
- Portal do aluno
- Análise preditiva

### v4+ (Longo prazo)
- Multi-tenancy total (franquias)
- Marketplace de integrações
- IA generativa (sugestões de response)
- Mobile native

---

## 15. Matriz de Decisão

| Decisão | Opção A | Opção B | Opção C | Escolha | Risco |
|---------|---------|---------|---------|---------|-------|
| DB | PostgreSQL | MongoDB | DynamoDB | PG | Baixo |
| Cache | Redis | Memcached | Memory | Redis | Baixo |
| Queue | BullMQ | RabbitMQ | AWS SQS | BullMQ | Baixo |
| Auth | JWT | Sessions | OAuth2 | JWT | Baixo |
| API Style | REST | GraphQL | gRPC | REST | Baixo |
| Monolítico | Sim | Não (µs) | N/A | Sim | Médio |

---

## 16. Documentação Técnica

Manter em `/docs`:
- `architecture.md` (este arquivo)
- `database.md` (modelo ER, índices)
- `api.md` (Swagger/OpenAPI)
- `deployment.md` (infra, CI/CD)
- `security.md` (políticas, guidelines)
- `testing.md` (estratégia de testes)
- `troubleshooting.md` (common issues)

---

**Próximos passos:** Desenhar modelo de banco de dados
