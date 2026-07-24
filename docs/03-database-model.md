# Modelo de Banco de Dados — SEGi CRM

**Versão:** 1.0  
**Data:** 2026-07-23  
**Formato:** PostgreSQL com Prisma ORM

---

## 1. Princípios

1. **Isolamento de dados:** Toda tabela comercial tem `organization_id` + `unit_id`
2. **Auditoria:** Toda tabela tem `created_at`, `updated_at`, `created_by`, `updated_by`
3. **Soft delete:** Entidades comerciais importantes usam `deleted_at`
4. **Integridade:** Foreign keys e constraints
5. **Performance:** Índices em colunas críticas
6. **Normalização:** 3NF para tabelas relacionais

---

## 2. Tabelas Principais

### 2.1 Organizações e Unidades

```sql
-- organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  website VARCHAR(500),
  email_contact VARCHAR(100),
  phone_contact VARCHAR(20),
  country_code CHAR(2) DEFAULT 'BR',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- units
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  code CHAR(4) NOT NULL,               -- SGNI, SGMD, etc
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  state CHAR(2),
  postal_code VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(100),
  manager_id UUID,
  opening_time TIME,
  closing_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  UNIQUE(organization_id, code),
  UNIQUE(organization_id, slug)
);

CREATE INDEX idx_units_org_id ON units(organization_id);
CREATE INDEX idx_units_code ON units(code);
```

---

### 2.2 Usuários e Permissões

```sql
-- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  email VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMP,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  preferred_unit_id UUID REFERENCES units(id),
  is_active BOOLEAN DEFAULT true,
  blocked_until TIMESTAMP,
  failed_login_attempts INT DEFAULT 0,
  last_login_at TIMESTAMP,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret_encrypted VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMP,
  UNIQUE(organization_id, email)
);

-- roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,         -- Super admin, SDR, etc
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  UNIQUE(organization_id, name)
);

-- permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,            -- 'read', 'create', 'update', 'delete'
  subject VARCHAR(100) NOT NULL,           -- 'Lead', 'User', 'Opportunity'
  conditions JSONB,                         -- Condições (unitId, etc)
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- role_permissions (RBAC)
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

-- user_roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id),       -- Role pode ser por unidade
  assigned_at TIMESTAMP DEFAULT now(),
  assigned_by UUID,
  UNIQUE(user_id, role_id, unit_id)
);

CREATE INDEX idx_users_org_id ON users(organization_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

---

### 2.3 Leads

```sql
-- lead_sources
CREATE TABLE lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  code VARCHAR(50) NOT NULL,               -- 'META_LEADGEN', 'WHATSAPP', 'MANUAL'
  name VARCHAR(255) NOT NULL,
  channel VARCHAR(100),                    -- 'ads', 'organic', 'direct'
  UNIQUE(organization_id, code)
);

-- leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID REFERENCES units(id),
  full_name VARCHAR(255) NOT NULL,
  preferred_name VARCHAR(100),
  phone_e164 VARCHAR(15),                  -- +5521987654321
  phone_raw VARCHAR(20),
  secondary_phone VARCHAR(20),
  email VARCHAR(255),
  birth_date DATE,
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  state CHAR(2),
  postal_code VARCHAR(10),
  occupation VARCHAR(100),
  education_level VARCHAR(50),
  income_range VARCHAR(50),
  preferred_shift VARCHAR(50),             -- 'morning', 'afternoon', 'evening'
  preferred_contact_channel VARCHAR(50),   -- 'whatsapp', 'call', 'sms'
  best_contact_time VARCHAR(50),
  
  -- Qualificação
  course_interest_id UUID REFERENCES courses(id),
  unit_interest_id UUID REFERENCES units(id),
  lead_temperature VARCHAR(20),            -- 'hot', 'warm', 'cold', 'unqualified'
  lead_score INT DEFAULT 0,
  
  -- Origem
  source_id UUID REFERENCES lead_sources(id),
  source_detail VARCHAR(255),              -- Nome do formulário, campanha, etc
  channel VARCHAR(100),
  campaign_id VARCHAR(100),
  campaign_name VARCHAR(255),
  adset_id VARCHAR(100),
  adset_name VARCHAR(255),
  ad_id VARCHAR(100),
  ad_name VARCHAR(255),
  form_id VARCHAR(100),
  form_name VARCHAR(255),
  meta_lead_id VARCHAR(100),
  
  -- UTM
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  fbclid VARCHAR(255),
  gclid VARCHAR(255),
  
  -- Contexto
  page_url VARCHAR(500),
  landing_page VARCHAR(500),
  referrer VARCHAR(500),
  
  -- Consentimento e controle
  consent_status VARCHAR(50),              -- 'consented', 'pending', 'denied', 'withdrawn'
  do_not_contact BOOLEAN DEFAULT false,
  opt_out_reason TEXT,
  
  -- Atribuição
  first_touch_at TIMESTAMP,
  last_touch_at TIMESTAMP,
  first_source_id UUID REFERENCES lead_sources(id),
  last_source_id UUID REFERENCES lead_sources(id),
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMP,
  
  UNIQUE(organization_id, phone_e164),
  UNIQUE(organization_id, email)
);

CREATE INDEX idx_leads_org_id ON leads(organization_id);
CREATE INDEX idx_leads_phone_e164 ON leads(phone_e164);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_meta_lead_id ON leads(meta_lead_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

---

### 2.4 Oportunidades e Funis

```sql
-- pipelines (funis)
CREATE TABLE pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID REFERENCES units(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(50),                        -- 'sdr_funnel', 'closer_funnel'
  is_default BOOLEAN DEFAULT false,
  order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(organization_id, code)
);

-- pipeline_stages
CREATE TABLE pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order INT NOT NULL,
  probability_win INT DEFAULT 0,           -- %
  is_final_stage BOOLEAN DEFAULT false,
  is_lost_stage BOOLEAN DEFAULT false,
  allow_skip BOOLEAN DEFAULT false,        -- Pode pular esta etapa?
  requires_fields JSONB,                   -- Campos obrigatórios para avançar
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_pipeline_stages_pipeline ON pipeline_stages(pipeline_id);

-- opportunities
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id),
  stage_id UUID NOT NULL REFERENCES pipeline_stages(id),
  
  course_id UUID REFERENCES courses(id),
  sdr_id UUID REFERENCES users(id),
  closer_id UUID REFERENCES users(id),
  
  estimated_value DECIMAL(10, 2),
  probability INT DEFAULT 0,               -- %
  temperature VARCHAR(20),                 -- 'hot', 'warm', 'cold'
  
  expected_close_date DATE,
  won_at TIMESTAMP,
  lost_at TIMESTAMP,
  lost_reason_id UUID,                     -- Futuro: referência a lost_reasons
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_opportunities_org_unit ON opportunities(organization_id, unit_id);
CREATE INDEX idx_opportunities_lead ON opportunities(lead_id);
CREATE INDEX idx_opportunities_sdr ON opportunities(sdr_id);
CREATE INDEX idx_opportunities_closer ON opportunities(closer_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage_id);

-- opportunity_stage_history
CREATE TABLE opportunity_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id),
  from_stage_id UUID REFERENCES pipeline_stages(id),
  to_stage_id UUID NOT NULL REFERENCES pipeline_stages(id),
  notes TEXT,
  moved_at TIMESTAMP DEFAULT now(),
  moved_by UUID NOT NULL,
  
  INDEX idx_opp_history_opportunity ON opportunity_id
);
```

---

### 2.5 Conversas e Mensagens

```sql
-- conversations (omnichannel)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  opportunity_id UUID REFERENCES opportunities(id),
  
  channel VARCHAR(50) NOT NULL,            -- 'whatsapp', 'facebook', 'instagram', 'email'
  external_conversation_id VARCHAR(255),   -- ID da conversa no provedor
  
  assigned_to UUID REFERENCES users(id),
  assigned_at TIMESTAMP,
  
  status VARCHAR(50) DEFAULT 'open',       -- 'open', 'closed', 'awaiting_response'
  unread_count INT DEFAULT 0,
  last_message_at TIMESTAMP,
  last_message_from VARCHAR(50),           -- 'customer', 'user'
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(organization_id, channel, external_conversation_id)
);

CREATE INDEX idx_conversations_org_unit ON conversations(organization_id, unit_id);
CREATE INDEX idx_conversations_lead ON conversations(lead_id);
CREATE INDEX idx_conversations_assigned_to ON conversations(assigned_to);
CREATE INDEX idx_conversations_status ON conversations(status);

-- messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  
  sender_type VARCHAR(50) NOT NULL,        -- 'user', 'customer', 'system'
  sender_id UUID,                          -- user_id se sender_type='user'
  sender_name VARCHAR(255),
  sender_phone VARCHAR(20),
  
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'document', 'audio', 'location'
  content TEXT,
  
  external_message_id VARCHAR(255),
  
  -- Para mensagens internas (notes)
  is_internal BOOLEAN DEFAULT false,
  
  -- Status de envio
  status VARCHAR(50) DEFAULT 'received',   -- 'sending', 'sent', 'delivered', 'read', 'failed'
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  created_by UUID
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_internal ON messages(is_internal);

-- message_attachments
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  
  file_name VARCHAR(255) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  file_path VARCHAR(500),                  -- S3 path
  
  created_at TIMESTAMP DEFAULT now()
);
```

---

### 2.6 Tarefas e Agendamentos

```sql
-- tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  opportunity_id UUID REFERENCES opportunities(id),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50),                   -- 'call', 'whatsapp', 'confirm', 'reschedule'
  
  assigned_to UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT now(),
  assigned_by UUID NOT NULL,
  
  due_at TIMESTAMP NOT NULL,
  priority VARCHAR(50) DEFAULT 'normal',   -- 'low', 'normal', 'high', 'critical'
  status VARCHAR(50) DEFAULT 'pending',    -- 'pending', 'in_progress', 'completed', 'cancelled', 'overdue'
  
  completed_at TIMESTAMP,
  completion_notes TEXT,
  completed_by UUID,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_tasks_org_unit ON tasks(organization_id, unit_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);
CREATE INDEX idx_tasks_status ON tasks(status);

-- appointments (agendamentos)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  opportunity_id UUID REFERENCES opportunities(id),
  
  appointment_type VARCHAR(50),            -- 'journey', 'consultation', 'call', 'meeting'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  scheduled_at TIMESTAMP NOT NULL,         -- Armazenar em UTC, exibir em fuso local
  duration_minutes INT DEFAULT 30,
  
  assigned_to UUID REFERENCES users(id),
  
  status VARCHAR(50) DEFAULT 'pending',    -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  confirmed_at TIMESTAMP,
  confirmed_by UUID,
  
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  
  location VARCHAR(500),
  location_url VARCHAR(500),
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_appointments_org_unit ON appointments(organization_id, unit_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_assigned_to ON appointments(assigned_to);
```

---

### 2.7 Jornada Gratuita

```sql
-- journey_types
CREATE TABLE journey_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 60,
  created_at TIMESTAMP DEFAULT now()
);

-- journey_sessions
CREATE TABLE journey_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  journey_type_id UUID NOT NULL REFERENCES journey_types(id),
  
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  max_capacity INT DEFAULT 20,
  current_capacity INT DEFAULT 0,
  
  instructor_id UUID REFERENCES users(id),
  location VARCHAR(500),
  notes TEXT,
  
  is_cancelled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- journey_bookings
CREATE TABLE journey_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  
  lead_id UUID NOT NULL REFERENCES leads(id),
  opportunity_id UUID REFERENCES opportunities(id),
  journey_session_id UUID NOT NULL REFERENCES journey_sessions(id),
  
  sdr_id UUID REFERENCES users(id),
  closer_id UUID REFERENCES users(id),
  
  status VARCHAR(50) DEFAULT 'pending',    -- 'pending', 'confirmed', 'attended', 'no_show', 'cancelled'
  
  confirmed_at TIMESTAMP,
  confirmed_by UUID,
  
  attended_at TIMESTAMP,
  no_show_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  
  notes TEXT,
  reschedule_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_journey_bookings_session ON journey_bookings(journey_session_id);
CREATE INDEX idx_journey_bookings_lead ON journey_bookings(lead_id);
CREATE INDEX idx_journey_bookings_status ON journey_bookings(status);
```

---

### 2.8 Vendas e Matrículas

```sql
-- proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id),
  
  code VARCHAR(50) NOT NULL,
  
  course_id UUID NOT NULL REFERENCES courses(id),
  gross_value DECIMAL(10, 2) NOT NULL,
  discount_value DECIMAL(10, 2) DEFAULT 0,
  final_value DECIMAL(10, 2) NOT NULL,
  entry_value DECIMAL(10, 2),
  
  installment_count INT DEFAULT 1,
  installment_value DECIMAL(10, 2),
  
  payment_method VARCHAR(100),             -- 'credit', 'debit', 'pix', 'check'
  
  valid_until DATE,
  status VARCHAR(50) DEFAULT 'draft',      -- 'draft', 'sent', 'viewed', 'negotiation', 'accepted', 'rejected', 'expired'
  
  viewed_at TIMESTAMP,
  accepted_at TIMESTAMP,
  rejected_at TIMESTAMP,
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(organization_id, code)
);

-- enrollments (matrículas)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  
  lead_id UUID NOT NULL REFERENCES leads(id),
  opportunity_id UUID REFERENCES opportunities(id),
  proposal_id UUID REFERENCES proposals(id),
  
  enrollment_code VARCHAR(50) NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id),
  class_id UUID REFERENCES classes(id),
  
  closer_id UUID REFERENCES users(id),
  
  enrollment_date DATE NOT NULL,
  start_date DATE,
  
  gross_value DECIMAL(10, 2) NOT NULL,
  discount_value DECIMAL(10, 2) DEFAULT 0,
  net_value DECIMAL(10, 2) NOT NULL,
  entry_value DECIMAL(10, 2),
  
  installment_count INT DEFAULT 1,
  
  payment_method VARCHAR(100),
  
  status VARCHAR(50) DEFAULT 'active',     -- 'active', 'completed', 'cancelled', 'suspended'
  
  external_enrollment_id VARCHAR(100),     -- Referência ao sistema pedagógico
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMP,
  
  UNIQUE(organization_id, enrollment_code)
);

CREATE INDEX idx_enrollments_org_unit ON enrollments(organization_id, unit_id);
CREATE INDEX idx_enrollments_lead ON enrollments(lead_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
```

---

### 2.9 Integrações

```sql
-- webhook_events
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  
  provider VARCHAR(100) NOT NULL,          -- 'META', 'UAZAPI', etc
  event_type VARCHAR(100) NOT NULL,        -- 'lead_received', 'message_received'
  event_id VARCHAR(255) NOT NULL,
  
  payload JSONB NOT NULL,                  -- Payload original do webhook
  
  status VARCHAR(50) DEFAULT 'pending',    -- 'pending', 'processed', 'failed'
  error_message TEXT,
  
  processed_at TIMESTAMP,
  retry_count INT DEFAULT 0,
  next_retry_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT now(),
  
  UNIQUE(organization_id, provider, event_id)
);

CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);

-- whatsapp_instances
CREATE TABLE whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL,          -- 'UAZAPI', 'META_CLOUD'
  
  external_instance_id VARCHAR(255),
  phone_number VARCHAR(20),
  display_name VARCHAR(255),
  
  status VARCHAR(50) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  connection_status VARCHAR(50),
  
  token_encrypted VARCHAR(500),           -- Criptografado com KMS
  api_url VARCHAR(500),
  webhook_secret_encrypted VARCHAR(255),
  
  last_connected_at TIMESTAMP,
  last_disconnected_at TIMESTAMP,
  last_health_check_at TIMESTAMP,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_whatsapp_instances_org_unit ON whatsapp_instances(organization_id, unit_id);
CREATE INDEX idx_whatsapp_instances_status ON whatsapp_instances(status);

-- integration_logs
CREATE TABLE integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  
  integration_type VARCHAR(100),
  action VARCHAR(100),
  
  status VARCHAR(50),                      -- 'success', 'error', 'warning'
  status_code INT,
  error_message TEXT,
  
  request JSONB,
  response JSONB,
  
  duration_ms INT,
  
  created_at TIMESTAMP DEFAULT now(),
  
  INDEX idx_integration_logs_org_id ON organization_id,
  INDEX idx_integration_logs_created_at ON created_at DESC
);
```

---

### 2.10 Cursos e Turmas

```sql
-- courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_hours INT,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- classes (turmas)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  
  instructor_id UUID REFERENCES users(id),
  
  start_date DATE,
  end_date DATE,
  
  capacity INT,
  shift VARCHAR(50),                       -- 'morning', 'afternoon', 'evening'
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  UNIQUE(organization_id, code)
);
```

---

### 2.11 Auditoria

```sql
-- audit_logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unit_id UUID REFERENCES units(id),
  
  actor_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,            -- 'create', 'update', 'delete', 'view'
  
  entity_type VARCHAR(100) NOT NULL,       -- 'Lead', 'Opportunity', 'User'
  entity_id UUID NOT NULL,
  
  before JSONB,                            -- Estado anterior
  after JSONB,                             -- Estado novo
  
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  correlation_id VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT now(),
  
  INDEX idx_audit_logs_org_entity ON organization_id, entity_type, entity_id,
  INDEX idx_audit_logs_created_at ON created_at DESC
);

-- consent_logs
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  
  consent_type VARCHAR(100),               -- 'marketing', 'whatsapp', 'call'
  status VARCHAR(50),                      -- 'consented', 'denied', 'withdrawn'
  
  source VARCHAR(100),                     -- Como consentiu: 'form', 'sdr', 'system'
  
  created_at TIMESTAMP DEFAULT now(),
  created_by UUID
);
```

---

## 3. Índices Críticos

```sql
-- Performance
CREATE INDEX idx_leads_org_created ON leads(organization_id, created_at DESC);
CREATE INDEX idx_leads_org_phone ON leads(organization_id, phone_e164);
CREATE INDEX idx_conversations_org_status ON conversations(organization_id, status);
CREATE INDEX idx_opportunities_org_stage ON opportunities(organization_id, stage_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_tasks_assigned_due ON tasks(assigned_to, due_at);

-- Full text search
CREATE INDEX idx_leads_search ON leads USING GIN (
  to_tsvector('portuguese', full_name || ' ' || COALESCE(email, '') || ' ' || COALESCE(phone_raw, ''))
);
```

---

## 4. Constraints Importantes

```sql
-- Isolamento de dados
ALTER TABLE leads ADD CONSTRAINT chk_leads_isolation
  CHECK (organization_id IS NOT NULL);

ALTER TABLE conversations ADD CONSTRAINT chk_conversations_isolation
  CHECK (organization_id IS NOT NULL AND unit_id IS NOT NULL);

ALTER TABLE opportunities ADD CONSTRAINT chk_opportunities_isolation
  CHECK (organization_id IS NOT NULL AND unit_id IS NOT NULL);

-- Integridade
ALTER TABLE opportunities ADD CONSTRAINT fk_opp_stage_pipeline
  FOREIGN KEY (pipeline_id) REFERENCES pipelines(id);

-- Valores
ALTER TABLE proposals ADD CONSTRAINT chk_proposal_values
  CHECK (final_value = gross_value - discount_value AND final_value > 0);

ALTER TABLE enrollments ADD CONSTRAINT chk_enrollment_values
  CHECK (net_value = gross_value - discount_value AND net_value > 0);
```

---

## 5. Seed Inicial

```sql
-- Organização
INSERT INTO organizations (id, name, slug, timezone)
VALUES ('org-segi', 'SEGi Escola de Gastronomia', 'segi', 'America/Sao_Paulo');

-- Unidades
INSERT INTO units (id, organization_id, code, name, slug, city, state)
VALUES
  ('unit-sgni', 'org-segi', 'SGNI', 'Nova Iguaçu', 'nova-iguacu', 'Nova Iguaçu', 'RJ'),
  ('unit-sgmd', 'org-segi', 'SGMD', 'Madureira', 'madureira', 'Rio de Janeiro', 'RJ'),
  ('unit-sgcg', 'org-segi', 'SGCG', 'Campo Grande', 'campo-grande', 'Rio de Janeiro', 'RJ'),
  ('unit-sgal', 'org-segi', 'SGAL', 'Alcântara', 'alcantara', 'Rio de Janeiro', 'RJ'),
  ('unit-sgcx', 'org-segi', 'SGCX', 'Caxias', 'caxias', 'Duque de Caxias', 'RJ');

-- Cursos
INSERT INTO courses (id, organization_id, name, duration_hours)
VALUES
  ('course-cozinheiro', 'org-segi', 'Cozinheiro Profissional', 240),
  ('course-confeiteiro', 'org-segi', 'Confeiteiro Profissional', 200),
  ('course-fastfood', 'org-segi', 'Fast-food', 120),
  ('course-confeitaria', 'org-segi', 'Técnicas de Confeitaria', 180);

-- Fontes de leads
INSERT INTO lead_sources (id, organization_id, code, name, channel)
VALUES
  ('source-meta', 'org-segi', 'META_LEADGEN', 'Meta Lead Ads', 'ads'),
  ('source-site', 'org-segi', 'SITE', 'Site SEGi', 'direct'),
  ('source-whatsapp', 'org-segi', 'WHATSAPP', 'WhatsApp', 'direct'),
  ('source-manual', 'org-segi', 'MANUAL', 'Cadastro Manual', 'direct');
```

---

## 6. Próximos Passos

- Implementar schema no Prisma
- Adicionar migrations
- Criar índices de performance
- Configurar soft delete
- Preparar seed

**Arquivo correspondente:** `prisma/schema.prisma`
