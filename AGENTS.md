# Visão geral

Este repositório contém Frontend do TB Project Manager, um sistema de controle dem clientes e serviços no ar.

A aplicação utiliza:

- Angular
- Typescript
- Material Design
- Framework de testes a escolha

# Fonte de verdade

As regras de negócio ficam em `docs/domain/`.

Antes de alterar uma funcionalidade:

1. Leia `docs/README.md`.
2. Identifique a documentação de domínio relacionada.
3. Leia a especificação da feature em `specs/`, quando existir.
4. Analise a implementação atual antes de criar uma nova abstração.

Se o código e a documentação estiverem em conflito:

- não escolha uma interpretação silenciosamente;
- informe o conflito;
- preserve o comportamento atual até que a decisão esteja documentada.

# Arquitetura

- Estruture por features, não por tipo de arquivo.
- Use standalone components como padrão.
- Separe bem:
    - ui: componentes visuais/reutilizáveis
    - feature: páginas e fluxos de negócio
    - data-access: chamadas HTTP, adapters, estado
    - shared: utilitários, pipes, directives, componentes genéricos

- Deixe a regra de negócio fora dos componentes.componente: 
    - exibe e captura eventos
    - service/facade/use-case: decide comportamento

- Use estado global só quando realmente precisar.app pequena/média:
    - signals + services costuma bastar
    - app grande/complexa: NgRx ou ComponentStore faz mais sentido

- Centralize integrações externas em camadas próprias.
    - API, auth, storage, analytics, etc.

- Crie fronteiras claras entre domínio e infraestrutura.

# Chamadas HTTP

O padrão mais saudável costuma ser:
- component chama uma facade ou service de caso de uso.
- Essa camada chama um api service ou repository.
- O api service usa HttpClient.
- interceptors cuidam de autenticação, headers, retry leve, log e tratamento comum de erro.

# Regras de implementação

- Não adicione dependências de produção sem justificar.
- Não faça refatorações não relacionadas à tarefa.
- Preserve compatibilidade quando não houver autorização para breaking changes.
- Trate erros com os padrões existentes no projeto.
- Não registre tokens, senhas ou dados financeiros sensíveis nos logs.

# Testes

Toda alteração de regra de negócio deve possuir:

- teste do caminho principal;
- teste de validação;
- teste dos principais casos-limite;
- teste de regressão quando a tarefa corrige um bug.