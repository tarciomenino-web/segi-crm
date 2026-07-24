# SEGi CRM — Requisitos de Produto

**Versão:** 1.0  
**Data:** 2026-07-23  
**Status:** Planejamento

---

## 1. Visão Geral

Sistema CRM comercial multiunidade para a SEGi Escola de Gastronomia. Plataforma em nuvem responsiva, segura e escalável preparada para expansão por franquias.

**Propósito:** Controlar integralmente a jornada de leads — desde captação por marketing até matrícula e pós-venda, integrando Meta Ads, WhatsApp e operações comerciais.

---

## 2. Escopo do MVP

### O que está incluído

- Autenticação e RBAC (5 perfis iniciais)
- Gestão de leads (captação, duplicação, qualificação)
- CRM com funis configuráveis
- Integração com Meta Lead Ads (webhook)
- Integração com WhatsApp (UAZAPI)
- Caixa de entrada omnichannel
- Jornada Gratuita (agenda + confirmação)
- Módulo de vendas (propostas, matrículas)
- Relatórios básicos e dashboards
- Auditoria e logs

### O que está **fora** do MVP

- Meta Conversions API (v2)
- Automações avançadas
- Integrações com gateway de pagamento
- Módulo pedagógico completo
- Portal do aluno
- Análise preditiva/IA

---

## 3. Unidades Iniciais

| Código | Unidade | Região |
|--------|---------|--------|
| SGNI | Nova Iguaçu | RJ |
| SGMD | Madureira | RJ |
| SGCG | Campo Grande | RJ |
| SGAL | Alcântara | RJ |
| SGCX | Caxias | RJ |

---

## 4. Cursos Principais

- Cozinheiro profissional
- Confeiteiro profissional
- Fast-food
- Técnicas de confeitaria
- Cadastros adicionais pelo admin

---

## 5. Jornada do Lead

```
Marketing → Captação → Lead → Distribuição → SDR → Qualificação 
→ Jornada Gratuita → Closer → Consultoria → Proposta → Matrícula 
→ Pós-venda
```

---

## 6. Canais de Captação

- Meta Lead Ads (prioritário)
- Site + formulário
- Landing pages
- WhatsApp
- Cadastro manual
- Indicação
- Evento
- Jornada presencial
- CSV
- Google/Facebook/Instagram orgânico
- TikTok
- Parceiros

---

## 7. Indicadores-Chave

### Funil comercial

- **CPL**: Custo por lead
- **Show-up**: % que comparece
- **Conversão**: % que matricula
- **Ticket médio**: Valor por matrícula
- **CAC**: Custo de aquisição
- **ROAS**: Retorno sobre investimento

### Operacional

- **SLA**: Tempo até primeira tentativa (5 min em horário)
- **Taxa de contato**: % de leads contatados
- **Taxa de qualificação**: % de leads qualificados
- **Taxa de agendamento**: % de leads agendados
- **Produtividade por SDR**: Leads trabalhados, agendados, qualificados

---

## 8. Perfis de Acesso (MVP)

1. **Superadministrador** — Plataforma inteira
2. **Diretor** — Visão executiva, todas as unidades
3. **Gestor de marketing** — Campanhas, leads, atribuição
4. **Gestor comercial** — Equipes, distribuição, SLA
5. **SDR** — Leads atribuídos, qualificação, agendamento
6. **Closer/Vendedor** — Oportunidades, propostas, matrículas
7. **Recepção** — Check-in, agenda, confirmação
8. **Auditor** — Leitura de logs e auditoria

---

## 9. Regras de Negócio Críticas

1. **Nenhum lead sem origem** — Registrar sempre o primeiro toque
2. **Nenhum lead sem responsável** — Distribuição automática
3. **Nenhum lead sem próxima ação** — Task ou SLA sempre
4. **First-touch attribution** — Nunca sobrescrever origem
5. **Idempotência** — Webhook repetido = sem duplicação
6. **Isolamento de dados** — Cada unidade vê apenas seus dados
7. **Soft delete** — Nenhuma exclusão destrutiva de dados comerciais
8. **Criptografia em repouso** — Tokens, senhas, dados sensíveis

---

## 10. Integrações Externas

| Sistema | Prioridade | Tipo | Status |
|---------|-----------|------|--------|
| Meta Lead Ads | 🔴 Crítica | Webhook | MVP |
| Meta Conversions API | 🟡 Alta | API | v2 |
| UAZAPI WhatsApp | 🔴 Crítica | Webhook | MVP |
| Meta Cloud WhatsApp | 🟡 Alta | API | Futuro |
| S3 (arquivos) | 🟡 Alta | Object storage | MVP |
| PostgreSQL | 🔴 Crítica | Database | MVP |
| Redis | 🔴 Crítica | Cache/Queue | MVP |

---

## 11. Telas Obrigatórias do MVP

1. Login + recuperação de senha
2. Dashboard executivo
3. Caixa de entrada (omnichannel)
4. Lista de leads + filtros
5. Perfil 360° do lead
6. Kanban SDR
7. Kanban Closer
8. Agenda comercial
9. Jornadas Gratuitas
10. Tarefas
11. Vendas + Matrículas
12. Relatórios (exportáveis)
13. Campanhas + Meta
14. Usuários + Permissões
15. Instâncias WhatsApp
16. Logs de integração
17. Auditoria

---

## 12. Tecnologia (Stack Decidida)

### Front-end
- Next.js + React
- TypeScript
- Tailwind + shadcn/ui
- React Hook Form + Zod
- TanStack Query + Table
- WebSocket ou SSE

### Back-end
- NestJS + Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis + BullMQ
- Swagger/OpenAPI

### Infraestrutura
- Docker (multi-stage)
- Docker Compose (dev)
- PostgreSQL gerenciado
- Redis gerenciado
- S3-compatible storage
- CI/CD (GitHub Actions)

### Monorepo
- Turborepo
- pnpm workspaces
- Estrutura modular

---

## 13. Critérios de Aceite do MVP

- [ ] Usuários conseguem autenticar com permissões corretas
- [ ] Leads da Meta são recebidos automaticamente
- [ ] Leads não são duplicados
- [ ] Leads são distribuídos automaticamente
- [ ] SDR recebe notificação em tempo real
- [ ] SDR consegue qualificar e conversar pelo WhatsApp
- [ ] SDR agenda Jornada Gratuita
- [ ] Closer visualiza oportunidade e registra proposta
- [ ] Recepção registra check-in
- [ ] Matrícula é concluída
- [ ] Gestor visualiza funil e indicadores
- [ ] Marketing visualiza origem e campanha
- [ ] Auditoria e logs funcionam
- [ ] Sistema está em Docker
- [ ] Testes essenciais passam
- [ ] Backups estão configurados

---

## 14. Restrições e Não-Funcionais

| Requisito | Valor |
|-----------|-------|
| **Uptime** | 99.5% |
| **TTFB** | < 200ms |
| **Latência API** | < 500ms |
| **Disponibilidade webhook** | Imediata (< 1s) |
| **Retenção de logs** | 90 dias |
| **Retenção de backup** | 30 dias |
| **Usuários simultâneos** | 50+ (V1) |
| **Throughput API** | 1000 req/min |
| **Rate limiting** | 100 req/min por IP |
| **Timeout de sessão** | 30 min |
| **Renovação de JWT** | 15 min de validade |

---

## 15. Riscos Identificados

### 🔴 Críticos

1. **UAZAPI é API não-oficial** → Implementar circuit breaker e fallback
2. **Webhook Meta pode falhar** → Sincronização de contingência
3. **Duplicação de leads** → Implementar deduplicação robusta
4. **Data isolation** → Validação em toda API

### 🟡 Altos

5. **Performance com muitos leads** → Índices e pagination
6. **Falha de integração bloqueia fluxo** → Fila e retentativas
7. **Perda de dados comerciais** → Soft delete obrigatório

### 🟢 Moderados

8. **Timezone em histórico** → UTC + apresentação em SP
9. **Exportação de dados grande** → Background job
10. **Cache desatualizado** → Invalidação automática

---

## 16. Dependências Externas Necessárias

### Credenciais obrigatórias

- [ ] Meta App ID + Secret
- [ ] Meta Verify Token
- [ ] Meta Graph API Access Token
- [ ] UAZAPI Base URL + Admin Token
- [ ] S3 endpoint + credentials
- [ ] Sentry DSN (opcional, v2)

### Serviços cloud

- [ ] PostgreSQL gerenciado (RDS/Azure/Railway)
- [ ] Redis gerenciado
- [ ] Bucket S3-compatible
- [ ] Container registry (ghcr.io)
- [ ] CI/CD runner

---

## 17. Próximos Passos

1. ✅ Criar documentação (este arquivo)
2. ⏳ Desenhar módulos e arquitetura
3. ⏳ Modelar banco de dados
4. ⏳ Criar estrutura do monorepo
5. ⏳ Inicializar Fase 1 (Fundação)
