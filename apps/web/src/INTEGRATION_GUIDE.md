# Guia de Integração com API

## Visão Geral

O frontend foi totalmente integrado com o backend NestJS. Todos os dados agora vêm da API real, sem mais mock data.

## Hooks Disponíveis

### 1. `useLeads()`
Gerencia dados de leads.

```typescript
import { useLeads } from '@/hooks/useLeads';

function MyComponent() {
  const { leads, loading, error, refetch } = useLeads();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id}>{lead.fullName}</div>
      ))}
    </div>
  );
}
```

**Retorno:**
- `leads: Lead[]` - Lista de leads
- `loading: boolean` - Está carregando
- `error: string | null` - Mensagem de erro (se houver)
- `refetch(): Promise<void>` - Recarregar dados

**Endpoints usados:**
- `GET /api/leads` - Buscar todos os leads

---

### 2. `useOpportunities()`
Gerencia dados de oportunidades com suporte a drag-drop.

```typescript
import { useOpportunities } from '@/hooks/useOpportunities';

function MyComponent() {
  const { 
    opportunities, 
    loading, 
    error, 
    moveToStage, 
    refetch 
  } = useOpportunities();

  const handleDrop = async (oppId: string, newStage: string) => {
    await moveToStage(oppId, newStage);
  };

  return (
    <div>
      {opportunities.map(opp => (
        <div key={opp.id} draggable onDrop={() => handleDrop(opp.id, 'contacted')}>
          {opp.title}
        </div>
      ))}
    </div>
  );
}
```

**Retorno:**
- `opportunities: Opportunity[]` - Lista de oportunidades
- `loading: boolean` - Está carregando
- `error: string | null` - Mensagem de erro
- `moveToStage(id: string, stage: string): Promise<void>` - Mover para stage
- `refetch(): Promise<void>` - Recarregar dados

**Endpoints usados:**
- `GET /api/opportunities` - Buscar todas
- `POST /api/opportunities/{id}/move/{stage}` - Mover para stage

---

### 3. `useAppointments()`
Gerencia dados de agendamentos.

```typescript
import { useAppointments } from '@/hooks/useAppointments';

function MyComponent() {
  const { 
    appointments, 
    loading, 
    error, 
    updateStatus, 
    refetch 
  } = useAppointments();

  const handleConfirm = async (aptId: string) => {
    await updateStatus(aptId, 'confirmed');
  };

  return (
    <div>
      {appointments.map(apt => (
        <div key={apt.id}>
          <h3>{apt.title}</h3>
          <button onClick={() => handleConfirm(apt.id)}>Confirmar</button>
        </div>
      ))}
    </div>
  );
}
```

**Retorno:**
- `appointments: Appointment[]` - Lista de agendamentos
- `loading: boolean` - Está carregando
- `error: string | null` - Mensagem de erro
- `updateStatus(id: string, status: string): Promise<void>` - Atualizar status
- `refetch(): Promise<void>` - Recarregar dados

**Endpoints usados:**
- `GET /api/appointments` - Buscar todos
- `PATCH /api/appointments/{id}` - Atualizar status

---

## Utilitário `api`

Para requisições personalizadas, use o utilitário `api`:

```typescript
import { api } from '@/lib/api';

// GET
const data = await api.get<Lead[]>('/api/leads');

// POST
const newLead = await api.post<Lead>('/api/leads', {
  fullName: 'João Silva',
  email: 'joao@example.com',
});

// PUT
await api.put('/api/leads/123', {
  temperature: 'hot',
});

// PATCH
await api.patch('/api/leads/123', {
  leadScore: 85,
});

// DELETE
await api.delete('/api/leads/123');
```

**Tratamento de erros:**
```typescript
import { api, APIError } from '@/lib/api';

try {
  const data = await api.get('/api/leads');
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 401) {
      // Sessão expirada
    } else if (error.status === 404) {
      // Não encontrado
    }
  }
}
```

---

## Variáveis de Ambiente

Configure a URL da API em `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Default:** `http://localhost:3000`

---

## Autenticação

Todos os hooks incluem autenticação automática:

1. Token é obtido do `localStorage.accessToken`
2. Token é enviado no header `Authorization: Bearer {token}`
3. Se receber 401, user é redirecionado para login
4. Token é removido automaticamente

---

## Páginas Integradas

### `/dashboard`
- Carrega: Leads, Opportunities, Appointments
- Calcula: Métricas, Funil, Atividades
- Atualiza: Em tempo real

### `/dashboard/leads`
- Carrega: Lista de leads da API
- Filtros: Em tempo real no cliente
- Paginação: Local

### `/dashboard/opportunities`
- Carrega: Oportunidades organizadas por stage
- Drag-drop: Atualiza via API
- Métricas: Calculadas localmente

### `/dashboard/agenda`
- Carrega: Agendamentos da API
- Calendário: Exibe com indicadores
- Ações: Confirmar, cancelar, concluir

---

## Fluxo de Dados

```
┌─────────────────┐
│   Component     │
└────────┬────────┘
         │
    useHook()
         │
    ┌────▼────────────┐
    │   Hook Logic    │  ← useState + useEffect
    │   + Error mgmt  │  ← Carrega de /api/*
    └────┬───────────┬┘
         │           │
    ┌────▼──┐   ┌───▼────┐
    │ State │   │ Action  │
    │ (data)│   │ (update)│
    └────┬──┘   └───┬────┘
         │           │
         └─────┬─────┘
               │
          return {...}
               │
    ┌──────────▼──────────┐
    │  Component Render   │
    └─────────────────────┘
```

---

## Tipos TypeScript

### Lead
```typescript
interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  temperature: 'hot' | 'warm' | 'cold';
  leadScore: number;
  source: string;
  createdAt: string;
  lastContact: string;
}
```

### Opportunity
```typescript
interface Opportunity {
  id: string;
  title: string;
  leadName: string;
  email: string;
  phone: string;
  stage: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  value: number;
  temperature: 'hot' | 'warm' | 'cold';
  probability: number;
  daysInStage: number;
  lastActivity: string;
}
```

### Appointment
```typescript
interface Appointment {
  id: string;
  title: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'consultation' | 'call' | 'demo' | 'meeting';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}
```

---

## Próximos Passos

### 1. Testar Integração
```bash
# Terminal 1: Backend
cd apps/api
npm run start:dev

# Terminal 2: Frontend
cd apps/web
npm run dev

# Visitar http://localhost:3001
```

### 2. Corrigir Schemas (se necessário)
Se os dados retornados forem diferentes, ajuste:
- Interfaces em `hooks/*.ts`
- Tipos em `app/dashboard/*/page.tsx`
- Tipos em `components/**/*.tsx`

### 3. Implementar Mais Funcionalidades
- Criar novo lead
- Editar lead
- Deletar lead
- Mover múltiplas oportunidades
- Criar agendamento
- Etc.

---

## Troubleshooting

### "Token não encontrado"
- Faça login primeiro em `/`
- Verifique localStorage em DevTools

### "Erro ao carregar dados"
- Verifique se backend está rodando
- Verifique `NEXT_PUBLIC_API_URL`
- Verifique logs do backend

### CORS Error
- Verifique se backend tem CORS habilitado
- Verificar `apps/api/src/main.ts` - `app.enableCors()`

### Dados não atualizam após ação
- Verifique se API retorna sucesso (200)
- Verifique se hooks atualizam state corretamente
- Use `refetch()` manualmente se necessário

---

## Documentação de Referência

- Backend API: `/apps/api/src`
- Hooks: `/apps/web/src/hooks/`
- Páginas: `/apps/web/src/app/dashboard/`
- Componentes: `/apps/web/src/components/`
- Utils: `/apps/web/src/lib/api.ts`
