# Critérios de Aceite do MVP — SEGi CRM

**Versão:** 1.0  
**Data:** 2026-07-23  
**Status:** Detalhado

---

## 1. O que é o MVP?

O MVP (Minimum Viable Product) é uma versão funcional do CRM que permite:

1. **Marketing** capturar leads da Meta
2. **SDR** receber, conversar e qualificar leads
3. **Closer** registrar oportunidades e matrículas
4. **Gestor** visualizar indicadores
5. **Administrador** gerenciar sistema

Sem necessidade de:
- ❌ Integrações com gateway de pagamento
- ❌ Automações avançadas
- ❌ Portal do aluno
- ❌ Machine Learning

---

## 2. Critérios de Aceite por Módulo

### 2.1 Autenticação

- [ ] Usuário consegue fazer login com e-mail e senha
- [ ] Senha é validada com Argon2
- [ ] JWT é emitido (access + refresh token)
- [ ] Refresh token consegue renovar access token
- [ ] Logout revoga sessão
- [ ] Usuário bloqueado após 5 tentativas erradas
- [ ] 2FA é opcional (para futuro)
- [ ] Recuperação de senha funciona por e-mail (ou mock)
- [ ] Todos os testes de autenticação passam

**Entrada:** POST `/auth/login`  
**Saída:** JWT válido com permissões

---

### 2.2 RBAC (Controle de Acesso)

- [ ] Superadmin consegue acessar tudo
- [ ] Diretor consegue ver todas as unidades
- [ ] SDR consegue ver apenas sua unidade
- [ ] Closer consegue ver apenas sua unidade
- [ ] Acesso negado retorna 403
- [ ] Permissões são validadas no back-end (não confiar no front)
- [ ] Testes de acesso não autorizado passam

**Teste crítico:** SDR da unidade A não consegue ver leads da unidade B

---

### 2.3 Leads

- [ ] Novo lead pode ser criado manualmente (admin)
- [ ] Lead é visualizado no perfil 360°
- [ ] Telefone é validado e normalizado (E.164)
- [ ] E-mail é validado
- [ ] Leads duplicados são detectados por:
  - [ ] meta_lead_id
  - [ ] Telefone normalizado
  - [ ] E-mail normalizado
  - [ ] Nome + telefone combinado
- [ ] Fusão de leads é possível manualmente (com auditoria)
- [ ] First-touch attribution é preservada
- [ ] Last-touch attribution é atualizado
- [ ] Lead score é calculado
- [ ] Consentimento é registrado

**Teste crítico:** Mesmo lead não entra 2x (mesmo webhook repetido)

---

### 2.4 Meta Lead Ads

- [ ] Webhook recebe lead da Meta (`POST /webhooks/meta/leadgen`)
- [ ] Webhook valida token (`X-Hub-Signature`)
- [ ] Webhook responde HTTP 200 **imediatamente** (< 100ms)
- [ ] Lead é processado em background (fila)
- [ ] Dados completos são consultados via Graph API
- [ ] Lead é criado/atualizado no banco
- [ ] Campanha, anúncio, formulário são identificados
- [ ] Unidade é identificada (por regra configurável)
- [ ] Lead é distribuído para SDR automaticamente
- [ ] SDR recebe notificação em tempo real
- [ ] Eventos são registrados (`webhook_events`)
- [ ] Idempotência total (webhook repetido = sem duplicação)
- [ ] Logs são estruturados e consultáveis
- [ ] Sincronização de contingência funciona (busca últimas 24h)

**Teste crítico:** Meta envia lead 3x (retry) → aparece apenas 1x no CRM

---

### 2.5 WhatsApp (UAZAPI)

- [ ] Instância WhatsApp pode ser conectada (QR Code)
- [ ] Status da instância é monitorado
- [ ] Token é criptografado em repouso
- [ ] Webhook recebe mensagem (`POST /webhooks/whatsapp/uazapi`)
- [ ] Webhook valida segredo
- [ ] Webhook responde HTTP 200 imediatamente
- [ ] Mensagem é armazenada no banco
- [ ] Telefone é normalizado (E.164)
- [ ] Lead é identificado por telefone
- [ ] Conversa é criada ou atualizada
- [ ] Caixa de entrada é atualizada em tempo real (WebSocket)
- [ ] Usuário consegue enviar mensagem de volta
- [ ] Status de envio é rastreado (enviado, entregue, lido)
- [ ] Arquivos podem ser enviados (imagem, documento)
- [ ] Notas internas são separadas de mensagens cliente

**Teste crítico:** Cliente envia mensagem → aparece na caixa de entrada em < 1s

---

### 2.6 Caixa de Entrada Omnichannel

- [ ] Lista conversas por unidade
- [ ] Filtros funcionam:
  - [ ] Por responsável
  - [ ] Por status (aberta, fechada, aguardando resposta)
  - [ ] Não lidas
  - [ ] Atrasadas
  - [ ] Por período
- [ ] Conversa mostra histórico completo
- [ ] Usuário consegue enviar texto, áudio, imagem, documento
- [ ] Mensagens internas são distinguidas de mensagens cliente
- [ ] Busca global funciona (por nome, telefone)
- [ ] Atribuição/transferência funciona
- [ ] Encerramento de conversa funciona

**Teste crítico:** 50 conversas abertas → lista abre em < 2s

---

### 2.7 Oportunidades e Funis

- [ ] Oportunidade é criada quando lead chega
- [ ] Funis são configuráveis (SDR, Closer)
- [ ] Estágios podem ser visualizados em Kanban
- [ ] Movimento entre estágios funciona
- [ ] Mudança de estágio registra histórico
- [ ] Etapas exigem campos obrigatórios
- [ ] Exemplo: marcar como "Jornada agendada" exige data + hora
- [ ] Score e temperatura são atualizados
- [ ] Testes de Kanban passam

---

### 2.8 Distribuição de Leads

- [ ] Lead é distribuído automaticamente para SDR
- [ ] Distribuição usa round-robin (ou configurável)
- [ ] SDR disponível recebe o lead
- [ ] Fila de leads não distribuídos existe
- [ ] Redistribuição automática funciona (se SDR offline)
- [ ] Testes de distribuição passam

---

### 2.9 SLA

- [ ] SLA de primeira tentativa é criado (5 min)
- [ ] Alertas de SLA funcionam (no prazo, próximo vencimento, atrasado)
- [ ] Dashboard mostra SLAs vencidos
- [ ] Testes de SLA passam

---

### 2.10 Jornada Gratuita

- [ ] Sessão pode ser criada (data, hora, capacidade)
- [ ] SDR consegue agendar lead em sessão
- [ ] Confirmação por WhatsApp funciona
- [ ] Check-in na recepção funciona
- [ ] Comparecimento é registrado
- [ ] Falta é registrada
- [ ] Taxa de comparecimento é calculada

---

### 2.11 Propostas e Matrículas

- [ ] Proposta pode ser criada
- [ ] Valores são validados (gross, discount, final)
- [ ] Parcelamento é configurável
- [ ] Status de proposta é rastreado
- [ ] Matrícula pode ser criada
- [ ] Enrollment code é gerado
- [ ] Valores são persistidos
- [ ] Status de matrícula é rastreado

---

### 2.12 Relatórios

- [ ] Relatório de leads funciona (total, por campanha, por unidade)
- [ ] Relatório de conversão funciona (% que matricula)
- [ ] Relatório de vendas funciona (receita por unidade)
- [ ] Exportação CSV funciona
- [ ] Exportação XLSX funciona
- [ ] Filtros no relatório funcionam

---

### 2.13 Dashboards

- [ ] Dashboard executivo mostra:
  - [ ] Leads (hoje, semana, mês)
  - [ ] Oportunidades em funil
  - [ ] Matrículas (valor, ticket)
  - [ ] CPL, CPA, ROAS
  - [ ] Tendências (gráficos)
- [ ] Dashboard de marketing mostra:
  - [ ] Leads por campanha
  - [ ] Leads por anúncio
  - [ ] CPL por campanha
  - [ ] Qualificação por origem
  - [ ] ROAS por campanha
- [ ] Dashboard SDR mostra:
  - [ ] Leads recebidos
  - [ ] Contatos realizados
  - [ ] Qualificados
  - [ ] Agendados
  - [ ] Produtividade
- [ ] Gráficos renderizam corretamente
- [ ] Dados são atualizados a cada 5 minutos

---

### 2.14 Auditoria

- [ ] Ações críticas são registradas (login, criar lead, mudar stage)
- [ ] Audit log mostra antes/depois (para edições)
- [ ] Tela de auditoria permite filtrar por:
  - [ ] Usuário
  - [ ] Ação
  - [ ] Entidade
  - [ ] Período
- [ ] Logs não podem ser editados
- [ ] Logs estão em banco (não apagáveis facilmente)

---

### 2.15 Segurança

- [ ] HTTPS obrigatório (em produção)
- [ ] CORS está restrito ao domínio
- [ ] Rate limiting está ativo (100 req/min por IP)
- [ ] Brute force bloqueado (5 tentativas → 15 min bloqueado)
- [ ] Senhas têm Argon2 (não MD5, não SHA1)
- [ ] Tokens são criptografados em repouso
- [ ] Não há secrets em logs
- [ ] Validação Zod em todas as DTOs
- [ ] Sanitização de entrada
- [ ] Helmet está ativado
- [ ] CSRF está protegido (quando aplicável)

---

### 2.16 Operacional

- [ ] Sistema está em Docker
- [ ] Docker Compose funciona (dev + prod)
- [ ] Health checks responsem HTTP 200
- [ ] Migrations rodam automaticamente no boot
- [ ] Seed roda na primeira execução (ou manual)
- [ ] Logs estão estruturados (JSON)
- [ ] Backup está configurado
- [ ] Recovery está documentado

---

## 3. Testes Obrigatórios

### Unitários

- [ ] Normalização de telefone (20+ casos)
- [ ] Deduplicação (10+ cenários)
- [ ] Distribuição (round-robin, por capacidade)
- [ ] Score cálculo
- [ ] Validações Zod

**Target:** > 80% coverage

### Integração

- [ ] Meta webhook → Lead criado
- [ ] UAZAPI webhook → Conversa criada
- [ ] Lead distribuído → SDR notificado
- [ ] Agendamento → Confirmação funciona
- [ ] Proposta → Matrícula criada
- [ ] Auditoria → Histórico rastreado

### E2E (Critical Path)

```gherkin
Scenario: Lead da Meta até matrícula
  Given Meta envia lead com phone válido
  When CRM processa webhook
  Then Lead aparece no CRM
  And SDR recebe notificação
  And Opportunity está em funil

Scenario: Webhook duplicado
  Given Meta envia lead
  When Webhook é reprocessado
  Then Lead não duplica

Scenario: SDR qualifica e agenda
  Given Lead está atribuído
  When SDR qualifica e agenda Jornada
  Then Status muda para "Jornada agendada"
  And Closer recebe o lead

Scenario: Isolamento de dados
  Given SDR está na unidade A
  When Acessa leads
  Then Vê apenas leads da unidade A
  And Não consegue ver unidade B
```

---

## 4. Performance Aceita

| Métrica | Target | Teste |
|---------|--------|-------|
| Login | < 500ms | POST `/auth/login` |
| Listar leads (100) | < 1s | GET `/leads?limit=100` |
| Listar conversas (50) | < 500ms | GET `/conversations?limit=50` |
| Criar lead | < 200ms | POST `/leads` |
| Webhook response | < 100ms | POST `/webhooks/meta/leadgen` |
| Dashboard load | < 2s | GET `/dashboard` |
| TTFB (Web) | < 200ms | HTTP header timing |
| PageLoad (Web) | < 3s | Lighthouse |

---

## 5. Checklist Final

### Código

- [ ] Sem erros TypeScript
- [ ] Sem warnings ESLint
- [ ] Prettier formatado
- [ ] Testes passam
- [ ] Coverage > 80%
- [ ] Sem `any` type (sem justificativa)
- [ ] Sem `TODO` crítico
- [ ] Sem console.log em produção
- [ ] Sem credenciais em código

### Documentação

- [ ] README.md atualizado
- [ ] API documentada (Swagger)
- [ ] Database schema documentado
- [ ] Deployment documentado
- [ ] Recovery documentado
- [ ] Troubleshooting documentado

### Infraestrutura

- [ ] Docker builds sem warnings
- [ ] Health checks funcionam
- [ ] Logs estruturados
- [ ] Backup configurado
- [ ] Monitoring ativado
- [ ] Alertas configurados

### Segurança

- [ ] Revisão de segurança feita
- [ ] Testes de acesso não autorizado passam
- [ ] LGPD compliance checklist feito
- [ ] Secrets em variáveis
- [ ] HTTPS ativado (prod)

---

## 6. Handoff para Produção

Quando todos os critérios acima estiverem ✅:

1. Deploy em staging
2. Testes de carga (500+ req/min)
3. Testes de segurança (OWASP top 10)
4. Revisão final de código
5. Aprovação de produto
6. Deploy em produção
7. Monitoramento 24h
8. Plano de rollback ativo

---

## 7. Próximos Passos

**Estado atual:** ✅ Planejamento completo

**Próximo passo:** Inicializar Fase 1 (Fundação)

- [ ] Criar monorepo
- [ ] Configurar build
- [ ] Criar banco
- [ ] Implementar auth
- [ ] Implementar RBAC
- [ ] Testes base
