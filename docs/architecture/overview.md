# Visão geral da arquitetura

## Objetivo

Este documento define a arquitetura do frontend do TB Project Manager.

A arquitetura deve permitir:

- evolução incremental do produto;
- separação entre interface, regras de negócio e infraestrutura;
- manutenção por uma equipe pequena;
- facilidade para testar regras e fluxos;
- baixo acoplamento entre funcionalidades;
- substituição de integrações externas com impacto controlado.

## Tecnologias principais

- Angular;
- TypeScript;
- Angular Material;
- Signals para estado local e compartilhado simples;
- RxJS para fluxos assíncronos e integração com APIs;
- Vitest para testes unitários;
- Playwright para testes de ponta a ponta, quando necessário.

A adoção de bibliotecas adicionais deve ser justificada pela complexidade real do projeto.

## Princípios arquiteturais

### Organização por feature

O código deve ser organizado por funcionalidade de negócio, não apenas por tipo técnico.

Exemplo:

```text
src/app/features/clients/
src/app/features/projects/
src/app/features/services/
```

Cada feature deve reunir suas páginas, componentes específicos, acesso a dados, modelos e testes.

### Componentes standalone

Standalone components são o padrão do projeto.

Novos componentes, pipes e directives devem ser standalone, salvo quando uma limitação técnica justificar outra abordagem.

### Regra de negócio fora da interface

Componentes devem:

- apresentar dados;
- capturar interações;
- controlar estado estritamente visual;
- delegar decisões.

Componentes não devem:

- decidir regras de negócio complexas;
- montar manualmente contratos de API em vários pontos;
- conhecer detalhes de autenticação ou armazenamento;
- duplicar validações de domínio.

Decisões de negócio devem ficar em facades, services, use cases ou funções de domínio.

### Fronteiras claras

O domínio da aplicação não deve depender diretamente de:

- `HttpClient`;
- local storage;
- session storage;
- SDKs externos;
- analytics;
- bibliotecas de autenticação;
- componentes do Angular Material.

Esses recursos pertencem à camada de infraestrutura ou integração.

## Camadas conceituais

A arquitetura utiliza as seguintes camadas conceituais:

### UI

Responsável por componentes visuais reutilizáveis e sem regra específica de negócio.

Exemplos:

- botões;
- campos;
- tabelas;
- dialogs;
- empty states;
- loading indicators;
- componentes de layout.

### Feature

Responsável por páginas, fluxos e composição de casos de uso.

Exemplos:

- listagem de clientes;
- cadastro de projeto;
- edição de serviço;
- acompanhamento de ambiente publicado.

### Data access

Responsável por comunicação com APIs, adapters, repositories, cache e estado compartilhado da feature.

Exemplos:

- `ClientsApi`;
- `ClientsRepository`;
- `ClientsFacade`;
- mapeadores entre DTOs e modelos da aplicação.

### Domain

Responsável por modelos, regras, validações e operações que independem da interface e da infraestrutura.

Exemplos:

- validação de status;
- transições permitidas;
- cálculo de disponibilidade;
- regras de exibição derivadas do domínio.

### Shared

Responsável por elementos genéricos, reutilizáveis e sem conhecimento de uma feature específica.

## Fluxo recomendado

```text
Page/Component
      ↓
Facade ou Use Case
      ↓
Repository
      ↓
API Service
      ↓
HttpClient
```

No retorno:

```text
DTO da API
      ↓
Adapter/Mapper
      ↓
Modelo da aplicação
      ↓
Facade/State
      ↓
Component
```

## Critérios para criação de abstrações

Uma nova abstração deve existir quando:

- reduz duplicação real;
- protege o domínio de uma integração externa;
- simplifica testes;
- representa um conceito do negócio;
- estabelece uma fronteira estável.

Não criar abstrações apenas por antecipação.

## Escopo inicial

Para uma aplicação pequena ou média:

- Signals e services são o padrão;
- facades são usadas em fluxos com múltiplas operações;
- repositories são usados quando existe necessidade de separar domínio e API;
- NgRx não deve ser adotado sem necessidade comprovada.

A arquitetura deve crescer junto com o produto, sem antecipar complexidade.
