# Estrutura do projeto

## Objetivo

Definir uma estrutura previsível para que funcionalidades relacionadas permaneçam próximas e fáceis de localizar.

## Estrutura recomendada

```text
src/
└── app/
    ├── core/
    │   ├── auth/
    │   ├── config/
    │   ├── guards/
    │   ├── http/
    │   ├── layout/
    │   └── observability/
    ├── features/
    │   ├── clients/
    │   ├── projects/
    │   ├── services/
    │   └── dashboard/
    ├── shared/
    │   ├── ui/
    │   ├── directives/
    │   ├── pipes/
    │   ├── utils/
    │   └── types/
    ├── app.config.ts
    └── app.routes.ts
```

## Core

`core/` contém recursos únicos e transversais da aplicação.

Pode conter:

- autenticação;
- configuração de ambiente;
- interceptors;
- guards;
- layout principal;
- tratamento global de erros;
- analytics;
- observabilidade.

Não deve conter componentes ou regras específicas de uma feature.

## Features

Cada pasta em `features/` representa uma área funcional.

Exemplo:

```text
features/clients/
├── pages/
│   ├── clients-list/
│   └── client-form/
├── ui/
│   ├── client-card/
│   └── client-status-chip/
├── data-access/
│   ├── clients.api.ts
│   ├── clients.repository.ts
│   ├── clients.facade.ts
│   └── clients.mapper.ts
├── domain/
│   ├── client.model.ts
│   ├── client-status.ts
│   └── client.rules.ts
├── clients.routes.ts
└── index.ts
```

Nem toda feature precisa começar com todas essas pastas.

Crie apenas as camadas necessárias para a complexidade atual.

## Pages

`pages/` contém componentes ligados a rotas ou fluxos completos.

Responsabilidades:

- compor componentes;
- conectar a facade;
- reagir a parâmetros de rota;
- disparar ações de alto nível;
- controlar estado de apresentação da página.

Pages não devem acessar `HttpClient` diretamente.

## UI da feature

`ui/` dentro de uma feature contém componentes reutilizáveis apenas naquela área.

Exemplo:

```text
features/clients/ui/client-status-chip/
```

Um componente deve ser movido para `shared/ui/` somente quando for realmente genérico e utilizado por áreas diferentes.

## Data access

`data-access/` contém:

- chamadas HTTP;
- repositories;
- facades;
- adapters;
- mappers;
- cache;
- estado compartilhado da feature.

Código dessa pasta pode depender da infraestrutura Angular, mas não deve vazar DTOs diretamente para toda a aplicação.

## Domain

`domain/` contém conceitos independentes da interface.

Exemplos:

- modelos;
- enums;
- value objects;
- validações;
- regras puras;
- funções de transformação de domínio.

Sempre que possível, arquivos de domínio devem ser testáveis sem `TestBed`.

## Shared

`shared/` deve conter apenas recursos realmente genéricos.

Permitido:

- componentes visuais sem regra de negócio;
- pipes genéricos;
- directives genéricas;
- tipos utilitários;
- funções puras reutilizáveis.

Evitar:

- services de negócio;
- DTOs de APIs específicas;
- estados globais;
- componentes que conhecem clientes, projetos ou serviços.

## Imports e dependências

Fluxo permitido:

```text
shared ← core
shared ← features
core   ← features
```

Features podem depender de `core` e `shared`.

Uma feature não deve importar diretamente detalhes internos de outra feature.

Quando duas features precisarem compartilhar um conceito:

1. mova somente o conceito genérico para uma camada apropriada;
2. exponha um contrato público;
3. evite importar arquivos internos por caminhos profundos.

## Arquivos públicos

Cada feature pode possuir um `index.ts` para expor apenas o que outras áreas podem usar.

Evite exportar toda a implementação interna.

## Convenções de nomes

- componentes: `*.component.ts`;
- pages: `*.page.ts` ou `*.component.ts`, mantendo consistência;
- facades: `*.facade.ts`;
- repositories: `*.repository.ts`;
- integrações HTTP: `*.api.ts`;
- mappers: `*.mapper.ts`;
- modelos de domínio: `*.model.ts`;
- DTOs: `*.dto.ts`;
- regras puras: `*.rules.ts`;
- testes: `*.spec.ts`.

## Regra prática

Se um arquivo só faz sentido dentro de uma funcionalidade, ele deve permanecer dentro da pasta daquela feature.
