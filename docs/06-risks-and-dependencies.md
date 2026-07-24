# Riscos Técnicos e Dependências — SEGi CRM

**Versão:** 1.0  
**Data:** 2026-07-23

---

## 1. Riscos Técnicos

### 🔴 Riscos Críticos

#### 1.1 UAZAPI é API não-oficial

**Risco:** WhatsApp pode quebrar integração sem aviso.

**Impacto:** Chat completamente offline, SDRs não conseguem se comunicar.

**Mitigation:**
- [ ] Implementar circuit breaker com fallback
- [ ] Implementar timeout agressivo
- [ ] Monitorar health check a cada 5 minutos
- [ ] Alertar admin se desconectar
- [ ] Preparar documentação para conexão manual
- [ ] Manter compatibilidade com Meta Cloud API futuramente

**Plano B:** Preparar módulo de integração com Meta Cloud WhatsApp quando disponível.

---

#### 1.2 Webhook Meta pode falhar ou ser perdido

**Risco:** Lead não chega ao CRM, campanha perde dados.

**Impacto:** CPL não calculável, campanhas cegas, leads perdidos.

**Mitigation:**
- [ ] Implementar webhook_events com idempotência total
- [ ] Responder HTTP 200 **antes** de processar
- [ ] Enfileirar job para processamento assíncrono
- [ ] Implementar sincronização de contingência (query últimas 24h)
- [ ] Executar sync 2x/dia automaticamente
- [ ] Logs e alertas de divergência

**Plano B:** Importação manual por CSV se sync falhar.

---

#### 1.3 Duplicação massiva de leads

**Risco:** Mesmo lead entra 5+ vezes (meta_lead_id repetido, webhook retry).

**Impacto:** Métricas erradas, SLA quebra, conversão falsa.

**Mitigation:**
- [ ] Deduplicação por meta_lead_id + provider
- [ ] Deduplicação por telefone normalizado (E.164)
- [ ] Deduplicação por email (normalizado)
- [ ] Combinação nome + telefone
- [ ] Log de duplicidade + central de fusão
- [ ] Permitir fusão manual com auditoria

---

#### 1.4 Vazamento de dados entre unidades

**Risco:** SDR da unidade A consegue ver leads da unidade B.

**Impacto:** Violação LGPD, confiança quebrada, processo judicial.

**Mitigation:**
- [ ] Middleware obrigatório que injeta organization_id + unit_id
- [ ] Validar em **todas** as queries (não confiar no front)
- [ ] Testes de acesso não autorizado
- [ ] Auditoria de todas as queries em logs
- [ ] Code review obrigatório para novas queries

---

### 🟡 Riscos Altos

#### 2.1 Performance degrada com muitos leads

**Risco:** 100k+ leads → queries lentas, relatórios travam.

**Impacto:** UX ruim, users abandonam.

**Mitigation:**
- [ ] Índices agressivos em created_at, organization_id, unit_id
- [ ] Pagination obrigatória (max 100 registros)
- [ ] Cache em Redis para dashboards
- [ ] Relatórios em background job
- [ ] Carga de teste com 500k leads antes de produção

---

#### 2.2 Falha de integração bloqueia fluxo comercial

**Risco:** Se Meta ou UAZAPI cair, SDR não consegue trabalhar.

**Impacto:** Produtividade zero.

**Mitigation:**
- [ ] Fila robusta com retentativas
- [ ] Não bloquear fluxo por falha externa
- [ ] Graceful degradation (aviso ao user, mas continua)
- [ ] Dead-letter queue para tração manual
- [ ] Painel técnico mostrando status

---

#### 2.3 Perda de dados comerciais

**Risco:** Exclusão destrutiva de lead/oportunidade acidental.

**Impacto:** Perda histórica, impossível recuperar.

**Mitigation:**
- [ ] Soft delete obrigatório (deleted_at)
- [ ] Permissão especial para hard delete
- [ ] Backup diário
- [ ] Retention policy configurável
- [ ] Auditoria de todas as exclusões

---

#### 2.4 Crescimento do banco sem limite

**Risco:** Disco cheio, backups falham, queries lentificam.

**Impacto:** Sistema cai.

**Mitigation:**
- [ ] Retention policy para webhooks (90 dias)
- [ ] Partition de tables grandes por data
- [ ] Arquivamento de dados antigos
- [ ] Monitoring de tamanho do disco
- [ ] Alerta se > 80% de uso

---

#### 2.5 Cache desatualizado

**Risco:** Dashboard mostra dados antigos.

**Impacto:** Decisões erradas.

**Mitigation:**
- [ ] Invalidar cache em mudanças críticas
- [ ] TTL curto para dados sensíveis (5 min)
- [ ] Sempre buscar dados recentes em operações críticas
- [ ] Teste de cache invalidation

---

### 🟢 Riscos Moderados

#### 3.1 Timezone confuso

**Risco:** Agendamento às 14:00 AM fica 13:00 no relatório.

**Impacto:** Confusão, agendamentos errados.

**Mitigation:**
- [ ] Armazenar tudo em UTC
- [ ] Apresentar sempre em America/Sao_Paulo
- [ ] Permitir escolha de timezone por usuário
- [ ] Converter ao enviar para webhook
- [ ] Testes com multiple timezones

---

#### 3.2 Concorrência em agendamento

**Risco:** 2 SDRs agendam mesmo lead em mesma hora.

**Impacto:** Validação de vagas quebra.

**Mitigation:**
- [ ] Pessimistic locking em journey_sessions
- [ ] Validar capacidade em transação
- [ ] Teste de race condition

---

#### 3.3 Callback de webhook antes de salvar

**Risco:** Webhook retorna erro antes de persistir no DB.

**Impacto:** Reprocessar, pode duplicar.

**Mitigation:**
- [ ] Salvar evento em DB **antes** de processar
- [ ] Usar status para rastrear progresso
- [ ] Idempotência total por event_id

---

## 2. Dependências Externas

### APIs Externas (Obrigatórias)

| Serviço | Tipo | Essencial | Status | Plano B |
|---------|------|-----------|--------|---------|
| Meta Lead Ads | Webhook | ✅ Sim | MVP | Manual CSV |
| Meta Graph API | API | ✅ Sim | MVP | Cache local |
| UAZAPI | Webhook | ✅ Sim | MVP | Meta Cloud API |
| S3 / MinIO | Object Storage | ✅ Sim | MVP | LocalStack |

---

### Credenciais Necessárias

#### Meta
- [ ] Meta App ID → `META_APP_ID`
- [ ] Meta App Secret → `META_APP_SECRET` (encrypted)
- [ ] Meta Verify Token → `META_VERIFY_TOKEN` (gerado no FB)
- [ ] Meta Access Token → `META_ACCESS_TOKEN` (Page Token ou User Token)
- [ ] Meta Pixel ID → `META_PIXEL_ID` (para eventos)
- [ ] Meta CAPI Access Token → `META_CAPI_ACCESS_TOKEN` (v2, futuro)

**Obtenção:**
1. Criar app em https://developers.facebook.com
2. Adicionar produto "Lead Ads"
3. Gerar webhooks
4. Gerar access tokens

**Documentação:** https://developers.facebook.com/docs/lead-ads

---

#### UAZAPI
- [ ] Base URL → `UAZAPI_BASE_URL` (ex: https://api.uazapi.com)
- [ ] Admin Token → `UAZAPI_ADMIN_TOKEN` (encrypted)
- [ ] Webhook Secret → `UAZAPI_WEBHOOK_SECRET` (encrypted)

**Obtenção:**
1. Criar conta em https://uazapi.com
2. Gerar API token
3. Configurar webhook URL

**Documentação:** https://docs.uazapi.com

---

#### Banco de Dados
- [ ] DATABASE_URL → PostgreSQL connection string
- [ ] DIRECT_DATABASE_URL → Para migrations (sem pooling)

**Obtenção:**
- Desenvolvimento: Docker Compose (local)
- Staging: RDS / Railway / Azure Database
- Produção: RDS / Railway / Azure Database

---

#### Redis
- [ ] REDIS_URL → Redis connection string

**Obtenção:**
- Desenvolvimento: Docker Compose (local)
- Staging: Redis Cloud / AWS ElastiCache
- Produção: Redis Cloud / AWS ElastiCache

---

#### S3 (ou compatível)
- [ ] S3_ENDPOINT → URL do bucket
- [ ] S3_REGION → us-east-1, etc
- [ ] S3_BUCKET → Nome do bucket
- [ ] S3_ACCESS_KEY_ID → Key ID (encrypted)
- [ ] S3_SECRET_ACCESS_KEY → Secret (encrypted)

**Obtenção:**
- Desenvolvimento: MinIO (Docker)
- Staging: AWS S3 / DigitalOcean Spaces
- Produção: AWS S3 / DigitalOcean Spaces

---

### Serviços Cloud (Obrigatórios em Produção)

| Serviço | Caso de Uso | Alternativas |
|---------|-----------|--------------|
| **Container Registry** | Push de imagens | Docker Hub, GitHub Container Registry, ECR |
| **Compute** | Deploy apps | Railway, Render, Heroku, AWS ECS, DigitalOcean |
| **PostgreSQL** | Banco de dados | AWS RDS, Railway, Azure Database, Heroku Postgres |
| **Redis** | Cache + Queue | Redis Cloud, AWS ElastiCache, Upstash |
| **Object Storage** | Imagens, docs, áudios | AWS S3, DigitalOcean Spaces, Backblaze B2 |
| **Monitoring** | Logs + Errors | Sentry, DataDog, New Relic, Sumologic |
| **CI/CD** | Build + Deploy | GitHub Actions, GitLab CI, CircleCI |

---

### Bibliotecas Críticas

#### Back-end

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^9.0.0",
  "@prisma/client": "^5.0.0",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.0",
  "passport-local": "^1.0.0",
  "redis": "^4.6.0",
  "bullmq": "^5.0.0",
  "zod": "^3.22.0",
  "argon2": "^0.31.0",
  "aws-sdk": "^2.1500.0",
  "winston": "^3.11.0",
  "joi": "^17.11.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1"
}
```

#### Front-end

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.2.0",
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-table": "^8.0.0",
  "@tanstack/react-form": "^0.0.0",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  "tailwindcss": "^3.3.0",
  "shadcn-ui": "^0.0.0",
  "recharts": "^2.10.0",
  "axios": "^1.6.0",
  "zustand": "^4.4.0",
  "date-fns": "^2.30.0"
}
```

---

## 3. Checklist Pré-Produção

### Credenciais

- [ ] Meta App ID e Secret
- [ ] Meta Verify Token
- [ ] Meta Access Token válido
- [ ] UAZAPI Admin Token
- [ ] UAZAPI Webhook Secret
- [ ] Chave de encriptação (KMS ou ENV)
- [ ] JWT Secrets (diferentes em prod)
- [ ] S3 credentials

### Infraestrutura

- [ ] PostgreSQL gerenciado (RDS / Railway)
- [ ] Redis gerenciado (Redis Cloud)
- [ ] S3 bucket criado e acessível
- [ ] Container registry configurado
- [ ] CI/CD pipeline funcional
- [ ] Domínio e SSL configurado
- [ ] Load balancer (se necessário)

### Segurança

- [ ] Secrets em variáveis de ambiente
- [ ] Nenhum segredo em git
- [ ] HTTPS obrigatório
- [ ] CORS restrito
- [ ] Rate limiting ativo
- [ ] Firewall configurado
- [ ] Backup automático

### Monitoramento

- [ ] Sentry integrado
- [ ] Logs estruturados
- [ ] Health checks funcionando
- [ ] Alertas configurados
- [ ] Dashboard técnico disponível

---

## 4. Planos de Contingência

### Se Meta falhar

1. Importar leads por CSV manualmente
2. Usar dashboard da Meta para verificar dados
3. Sincronizar contingência lê últimas 24h

### Se UAZAPI falhar

1. Usar SDK oficial do WhatsApp (Meta Cloud)
2. Manter números conectados manualmente
3. Aceitar mensagens via webhook temporariamente

### Se PostgreSQL falhar

1. Failover automático (Multi-AZ em RDS)
2. Restore de backup (últimas 24h)
3. Operação em modo leitura enquanto recupera

### Se Redis falhar

1. Cache fica desativado (sem impacto crítico)
2. Filas enfileiram em banco (degradado)
3. Restaurar Redis do RDB

---

## 5. Matriz de Prioridades

| Risco | Severidade | Probabilidade | Prioridade | Mitigation |
|-------|-----------|--------------|-----------|-----------|
| UAZAPI offline | 🔴 Crítica | 🟡 Média | 🔴 Alta | Circuit breaker, health check |
| Lead duplicado | 🔴 Crítica | 🟡 Média | 🔴 Alta | Dedup robusta, central fusão |
| Vazamento dados | 🔴 Crítica | 🟢 Baixa | 🔴 Alta | Middleware, validação, testes |
| Webhook perdido | 🟡 Alta | 🟡 Média | 🟡 Alta | Sync contingência, retry |
| Cache desatualizado | 🟢 Média | 🟡 Média | 🟢 Média | TTL curto, invalidação |
| Timezone confuso | 🟢 Média | 🟢 Baixa | 🟢 Baixa | Testes, documentação |

---

## 6. Próximos Passos

1. ✅ Documentar riscos
2. ✅ Documentar dependências
3. ⏳ Validar credenciais (Meta, UAZAPI)
4. ⏳ Provisionar infraestrutura (dev, staging, prod)
5. ⏳ Inicializar monorepo (Fase 1)

