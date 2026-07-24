# Backlog do Projeto — SEGi CRM

**Versão:** 1.0  
**Data:** 2026-07-23  
**Organização:** Por fases, com story points e dependências

---

## Fase 0: Planejamento ✅ (Concluída)

- [x] Criar especificação de produto
- [x] Desenhar arquitetura
- [x] Modelar banco de dados
- [x] Definir estrutura de monorepo
- [x] Documentar riscos técnicos
- [x] Documentar dependências

**Saída:** Documentação completa, pronto para inicializar código

---

## Fase 1: Fundação (Semana 1-2) — 34 points

### Monorepo e Build

- [ ] Inicializar Turborepo + pnpm workspaces (2)
- [ ] Configurar ESLint + Prettier (1)
- [ ] Configurar TypeScript + tsconfig (1)
- [ ] Criar GitHub Actions CI/CD básico (3)

### PostgreSQL e Prisma

- [ ] Criar `packages/database` (1)
- [ ] Escrever schema Prisma completo (5)
- [ ] Gerar migrations (1)
- [ ] Criar seed inicial (3)
- [ ] Testar conexão (1)

### Redis e Docker

- [ ] Configurar Docker Compose (2)
- [ ] Criar Redis client (1)
- [ ] Testar health checks (1)

### NestJS Base

- [ ] Inicializar `apps/api` (2)
- [ ] Configurar logger estruturado (2)
- [ ] Criar exception filters (2)
- [ ] Criar interceptors (2)
- [ ] Configurar CORS e Helmet (1)
- [ ] Criar health checks (2)

### Autenticação

- [ ] Criar módulo `auth` (5)
- [ ] Implementar JWT (access + refresh) (4)
- [ ] Implementar Argon2 (1)
- [ ] Criar guards de autenticação (2)
- [ ] Testes de autenticação (3)

### RBAC

- [ ] Criar tabelas (roles, permissions) (2)
- [ ] Implementar CASL (3)
- [ ] Criar guards de permissão (2)
- [ ] Testes de autorização (2)

### Front-end Base

- [ ] Inicializar `apps/web` com Next.js (1)
- [ ] Configurar Tailwind + shadcn/ui (1)
- [ ] Criar layout base (2)
- [ ] Criar página de login (3)
- [ ] Criar página de forgot password (2)
- [ ] API client configurado (1)

### Suporte a Unidades

- [ ] Módulo `organizations` (2)
- [ ] Módulo `units` (2)
- [ ] Middleware de isolamento (3)
- [ ] Testes de isolamento (2)

**Total: 34 points**

**Saída:** MVP pode fazer login, navegar com permissões, banco está pronto

---

## Fase 2: CRM Básico (Semana 3-4) — 28 points

### Leads

- [ ] Módulo `leads` (CRUD) (4)
- [ ] Deduplicação por telefone/email (3)
- [ ] Integração com `lead_sources` (2)
- [ ] Tela de lista de leads (3)
- [ ] Tela de perfil 360° (4)
- [ ] Busca global (2)

### Oportunidades

- [ ] Módulo `opportunities` (3)
- [ ] Funis configuráveis (3)
- [ ] Mudança de etapa com validação (3)
- [ ] Histórico de estágios (2)
- [ ] Kanban visual (4)

### Tarefas

- [ ] Módulo `tasks` (2)
- [ ] Listagem e filtros (2)
- [ ] Atribuição automática (2)

### Distribuição de Leads

- [ ] Motor de distribuição (round-robin, unidade) (5)
- [ ] Fila de leads não distribuídos (2)
- [ ] Teste de distribuição (2)

**Total: 28 points**

**Saída:** SDR consegue ver e trabalhar com leads

---

## Fase 3: Meta Lead Ads (Semana 5-6) — 32 points

### Integração Meta

- [ ] Módulo `meta` (2)
- [ ] Webhook `/webhooks/meta/leadgen` (3)
- [ ] Validação de webhook (2)
- [ ] Sincronização Graph API (4)
- [ ] Idempotência (webhook_events) (3)
- [ ] Normalização de campos (2)
- [ ] Identificar unidade e curso (2)
- [ ] Sincronização de contingência (3)
- [ ] Testes de webhook (4)

### Fila de Processamento

- [ ] Criar `apps/worker` (2)
- [ ] BullMQ processor para Meta (3)
- [ ] Retentativas e dead-letter queue (2)

### Logs

- [ ] Registrar eventos de integração (2)
- [ ] Painel de logs (3)

**Total: 32 points**

**Saída:** Leads da Meta entram automaticamente no CRM

---

## Fase 4: WhatsApp UAZAPI (Semana 7-8) — 36 points

### Integração UAZAPI

- [ ] Módulo `whatsapp` (2)
- [ ] Adaptador UAZAPI (WhatsAppProvider) (4)
- [ ] Webhook `/webhooks/whatsapp/uazapi` (3)
- [ ] Normalização de telefone E.164 (2)
- [ ] QR Code generation (2)
- [ ] Connection status monitoring (2)
- [ ] Criptografia de tokens (2)
- [ ] Testes de UAZAPI (3)

### Caixa de Entrada

- [ ] Módulo `conversations` (3)
- [ ] Listagem com filtros (4)
- [ ] Envio de mensagens (2)
- [ ] Recebimento de mensagens (2)
- [ ] Notas internas vs mensagens cliente (1)
- [ ] WebSocket para live inbox (3)
- [ ] Tela de caixa de entrada (5)

### Attachments

- [ ] Upload de imagens/documentos para S3 (2)
- [ ] Envio de media pelo WhatsApp (2)
- [ ] Testes de media (2)

**Total: 36 points**

**Saída:** SDR consegue conversar pelo WhatsApp

---

## Fase 5: Jornada Gratuita (Semana 9) — 20 points

### Calendário e Agendamento

- [ ] Módulo `journeys` (3)
- [ ] Tabelas journey_sessions, journey_bookings (2)
- [ ] Agenda visual (3)
- [ ] Agendamento e confirmação (3)
- [ ] Check-in (2)
- [ ] Registro de comparecimento/falta (2)
- [ ] Tela de Jornadas (3)

**Total: 20 points**

**Saída:** Jornada Gratuita pode ser agendada e confirmada

---

## Fase 6: Vendas e Matrículas (Semana 10) — 24 points

### Propostas

- [ ] Módulo `sales` (2)
- [ ] Criação de proposta (3)
- [ ] Desconto e parcelamento (2)
- [ ] Status de proposta (1)
- [ ] Tela de proposta (3)

### Matrículas

- [ ] Tabela enrollments (1)
- [ ] Criação de matrícula (3)
- [ ] Valores e pagamento (2)
- [ ] Integração com sistema pedagógico (stub) (2)
- [ ] Tela de matrículas (3)

### Relatório de Perda

- [ ] Motivos de perda/desqualificação (1)
- [ ] Registro de perda (1)

**Total: 24 points**

**Saída:** Closer consegue registrar proposta e matrícula

---

## Fase 7: Analytics e Meta CAPI (Semana 11) — 28 points

### Dashboards

- [ ] Dashboard executivo (4)
- [ ] Dashboard de marketing (4)
- [ ] Dashboard SDR (3)
- [ ] Dashboard closer (3)
- [ ] Dashboard de unidade (3)
- [ ] Gráficos e métricas (3)
- [ ] Testes de dashboard (2)

### Meta Conversions API

- [ ] Módulo `meta/conversions` (2)
- [ ] Mapeamento de eventos (2)
- [ ] Envio de eventos (3)
- [ ] Hashing de PII (2)
- [ ] Retentativas e dead-letter (1)

### Relatórios

- [ ] Relatório de leads (2)
- [ ] Relatório de conversão (2)
- [ ] Relatório de vendas (2)
- [ ] Exportação CSV/XLSX (2)

**Total: 28 points**

**Saída:** Gestor consegue visualizar indicadores completos

---

## Fase 8: Automações (Semana 12) — 22 points

### Motor de Automações

- [ ] Módulo `automations` (3)
- [ ] Tabela automation_rules (1)
- [ ] Processador de gatilhos (3)
- [ ] Processador de ações (3)
- [ ] Modelos de mensagem (2)
- [ ] Cadência de tentativas (2)
- [ ] Teste de automação (3)
- [ ] Simulação de automação (2)

**Total: 22 points**

**Saída:** Automações disparam corretamente

---

## Fase 9: Segurança, LGPD e Produção (Semana 13-14) — 30 points

### Segurança

- [ ] Revisão de segurança (4)
- [ ] Rate limiting (2)
- [ ] Proteção contra brute force (2)
- [ ] CSRF (quando aplicável) (1)
- [ ] Validação Zod em todas as DTOs (3)
- [ ] Sanitização de entrada (2)

### LGPD

- [ ] Tela de privacidade e consentimento (3)
- [ ] Solicitar dados do titular (2)
- [ ] Corrigir/anonimizar dados (2)
- [ ] Marcar opt-out (1)
- [ ] Auditoria de acesso (2)

### Auditoria

- [ ] Logs de ações críticas (2)
- [ ] Tela de auditoria (2)
- [ ] Testes de auditoria (2)

### Observabilidade

- [ ] Health checks aprimorados (1)
- [ ] Métricas Prometheus (2)
- [ ] Correlation ID em logs (1)
- [ ] Painel técnico (2)

### Testing

- [ ] Testes unitários (5)
- [ ] Testes de integração (5)
- [ ] Testes E2E críticos (4)
- [ ] Coverage > 80% (1)

### Deployment

- [ ] Build Docker otimizado (2)
- [ ] Health checks em container (1)
- [ ] Migrations automatizadas (1)
- [ ] Script de backup (2)
- [ ] Documentação de deploy (2)
- [ ] Documentação de recovery (1)

**Total: 30 points**

**Saída:** Sistema pronto para produção

---

## Backlog Futuro (v2 e beyond)

### Curto Prazo (v2 — 1-2 meses)

- [ ] 2FA obrigatório para admin
- [ ] Integração com gateway de pagamento
- [ ] Relatórios avançados (drill-down, cohort)
- [ ] Notificações por e-mail
- [ ] Integração com Google Calendar
- [ ] Busca full-text melhorada

### Médio Prazo (v3 — 3-6 meses)

- [ ] Microsserviços (Meta, WhatsApp separados)
- [ ] Machine Learning (lead scoring, churn prediction)
- [ ] Portal do aluno
- [ ] Mobile app nativo
- [ ] Análise preditiva
- [ ] IA generativa para sugestões

### Longo Prazo (v4+ — 6+ meses)

- [ ] Multi-tenancy total (franquias)
- [ ] Marketplace de integrações
- [ ] Webhooks customizados
- [ ] Flows visuais (node-based automations)
- [ ] Real-time collaboration

---

## Resumo por Fase

| Fase | Duração | Story Points | Saída |
|------|---------|-------------|-------|
| 0 - Planejamento | Semana 1 | - | Documentação |
| 1 - Fundação | Semana 2-3 | 34 | Auth + Banco + Docker |
| 2 - CRM Básico | Semana 4-5 | 28 | Leads + Oportunidades |
| 3 - Meta Lead Ads | Semana 6-7 | 32 | Webhook Meta + Worker |
| 4 - WhatsApp | Semana 8-9 | 36 | Caixa de entrada + UAZAPI |
| 5 - Jornada | Semana 10 | 20 | Agenda + Confirmação |
| 6 - Vendas | Semana 11 | 24 | Proposta + Matrícula |
| 7 - Analytics | Semana 12 | 28 | Dashboards + CAPI |
| 8 - Automações | Semana 13 | 22 | Motor de automações |
| 9 - Produção | Semana 14-15 | 30 | Segurança + Deploy |
| **TOTAL** | **15 semanas** | **274** | **MVP Completo** |

---

## Critérios de Completude

Para cada item do backlog estar "Done":

1. ✅ Código escrito e revisado
2. ✅ Testes unitários/integração passam
3. ✅ TypeScript sem erros
4. ✅ ESLint sem warnings
5. ✅ Documentação atualizada
6. ✅ Merge em `main` após aprovação

---

## Próximos Passos

1. ⏳ Documentar riscos técnicos
2. ⏳ Listar dependências externas
3. ⏳ Inicializar monorepo (Fase 1)
