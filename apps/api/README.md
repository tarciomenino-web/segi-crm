# SEGi CRM API

NestJS backend para SEGi CRM.

## Estrutura

```
src/
├── main.ts                  # Entry point
├── app.module.ts           # Módulo raiz
├── modules/
│   ├── auth/               # Autenticação JWT
│   ├── users/              # Usuários e permissões
│   ├── organizations/      # Organizações e unidades
│   └── health/             # Health checks
└── common/
    ├── guards/             # Guards (JWT, etc)
    ├── strategies/         # Passport strategies
    ├── decorators/         # Custom decorators
    ├── filters/            # Exception filters
    ├── interceptors/       # HTTP interceptors
    └── pipes/              # Validation pipes
```

## Instalação

```bash
pnpm install
```

## Configuração

Copiar `.env.example` para `.env`:

```bash
cp .env.example .env
```

## Desenvolvimento

```bash
# Iniciar em modo de desenvolvimento
pnpm start:dev

# Iniciar em modo de debug
pnpm start:debug
```

## Build

```bash
pnpm build
pnpm start:prod
```

## Testing

```bash
# Testes unitários
pnpm test

# Testes com coverage
pnpm test:cov

# Testes E2E
pnpm test:e2e
```

## API Documentation

Swagger disponível em: `http://localhost:3000/api/docs`

## Health Checks

- `GET /health` - Health check geral
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe

## Autenticação

Todos os endpoints (exceto `/auth/*` e `/health/*`) requerem Bearer token JWT:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/users/me
```

## Permissões

RBAC implementado com CASL (a ser expandido).

Verificar permissões via `@CheckAbilities()` decorator.

## Próximas Implementações

- [ ] Integração com Prisma Client completa
- [ ] Decorators customizados
- [ ] Exception filters
- [ ] Interceptors de logging
- [ ] Validation pipes
- [ ] Integração CASL
- [ ] Testes automatizados
- [ ] Docker support
