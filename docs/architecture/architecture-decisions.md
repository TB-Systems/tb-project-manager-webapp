# Decisões arquiteturais

## Objetivo

Registrar decisões que alteram padrões importantes do projeto.

Decisões arquiteturais devem ser documentadas para evitar que o motivo se perca e para permitir revisão futura.

## Quando registrar uma decisão

Criar uma ADR quando houver mudança relevante em:

- gerenciamento de estado;
- estrutura de pastas;
- autenticação;
- estratégia de comunicação com APIs;
- biblioteca de componentes;
- testes;
- observabilidade;
- cache;
- feature flags;
- autorização;
- padrão de formulários;
- adoção de dependência estrutural.

## Estrutura

As decisões podem ficar em:

```text
docs/architecture/decisions/
```

Formato:

```text
ADR-0001-use-signals-as-default-state.md
ADR-0002-adopt-vitest.md
ADR-0003-isolate-api-dtos.md
```

## Template

```md
# ADR-XXXX — Título

## Status

Proposta | Aceita | Substituída | Rejeitada

## Contexto

Qual problema motivou esta decisão?

## Decisão

Qual abordagem foi escolhida?

## Alternativas consideradas

Quais opções foram avaliadas?

## Consequências positivas

- ...

## Consequências negativas

- ...

## Impactos

Quais áreas, arquivos ou processos serão afetados?

## Data

AAAA-MM-DD
```

## Decisões iniciais

### Organização por feature

Status: aceita.

O projeto será organizado por funcionalidades de negócio.

### Standalone components

Status: aceita.

Novos componentes, directives e pipes serão standalone por padrão.

### Signals como estado padrão

Status: aceita.

Signals e services serão utilizados para estado local e compartilhado simples.

NgRx dependerá de justificativa arquitetural.

### DTOs isolados

Status: aceita.

Contratos da API devem permanecer na camada de data access e ser transformados antes de alcançar o restante da aplicação quando houver diferença relevante.

### Angular Material

Status: aceita.

Angular Material será a base dos componentes visuais.

Componentes de negócio não devem depender da implementação visual além da camada de apresentação.

### Vitest

Status: proposta inicial.

Vitest será utilizado para testes unitários, sujeito à validação na configuração inicial do projeto.

### Playwright

Status: proposta inicial.

Playwright será utilizado para jornadas E2E críticas.
