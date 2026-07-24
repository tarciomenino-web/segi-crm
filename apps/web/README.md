# SEGi CRM - Web App

Next.js 14 frontend para SEGi CRM.

## Instalação

```bash
pnpm install
```

## Desenvolvimento

```bash
pnpm --filter web dev
```

Abrir: http://localhost:3001

## Build

```bash
pnpm --filter web build
pnpm --filter web start
```

## Estrutura

```
src/
├── app/              # Pages e layouts
├── components/       # Componentes React
├── hooks/           # React hooks customizados
├── lib/             # Utilities e APIs
└── styles/          # CSS global
```

## Telas Implementadas (Fase 2)

- ✅ Login
- ⏳ Dashboard
- ⏳ Leads list
- ⏳ Lead 360°
- ⏳ Kanban (Opportunities)
- ⏳ Agenda

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Query
- Zustand (state management)
