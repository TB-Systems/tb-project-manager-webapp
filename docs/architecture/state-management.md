# Gerenciamento de estado

## Objetivo

Definir quando utilizar estado local, services com Signals ou uma solução de estado global.

## Princípio

O estado deve permanecer o mais próximo possível de quem o utiliza.

Não transformar todo dado da aplicação em estado global.

## Níveis de estado

### Estado local do componente

Use para informações visuais e temporárias.

Exemplos:

- expansão de painel;
- aba ativa;
- menu aberto;
- valor temporário de um filtro;
- modo de edição;
- feedback visual.

Ferramentas:

- `signal`;
- `computed`;
- propriedades simples;
- Reactive Forms.

### Estado da feature

Use um service ou facade com Signals quando o estado é compartilhado entre componentes do mesmo fluxo.

Exemplos:

- lista de clientes;
- item selecionado;
- filtros;
- paginação;
- carregamento;
- erros;
- permissões derivadas;
- resultado de comandos.

### Estado global

Utilize somente para informações realmente transversais.

Exemplos:

- usuário autenticado;
- permissões globais;
- tema;
- contexto da organização ativa;
- configuração carregada na inicialização.

## Padrão inicial

Para aplicações pequenas ou médias, o padrão é:

- Signals;
- computed signals;
- services;
- facades;
- RxJS na fronteira assíncrona.

## Signals e RxJS

Signals são preferidos para:

- estado síncrono;
- valores derivados;
- integração com template;
- composição de estado de apresentação.

RxJS é preferido para:

- chamadas HTTP;
- eventos assíncronos;
- cancelamento;
- debounce;
- combinação de streams;
- retry;
- integração com APIs baseadas em Observable.

Evite converter repetidamente entre Signal e Observable sem necessidade.

## Estrutura de estado de uma feature

Exemplo conceitual:

```ts
interface ClientsState {
  items: Client[];
  loading: boolean;
  error: AppError | null;
  filter: ClientFilter;
  page: number;
}
```

A implementação pode usar vários signals em vez de um objeto único.

## Estado derivado

Valores derivados devem usar `computed`.

Exemplo:

```ts
readonly activeClients = computed(() =>
  this.clients().filter(client => client.status === 'active')
);
```

Não armazene um valor que pode ser calculado de outro estado, salvo quando houver justificativa de desempenho.

## Imutabilidade

Atualizações de estado devem evitar mutação silenciosa.

Prefira criar novos arrays e objetos.

## Loading

Diferencie quando necessário:

- carregamento inicial;
- recarregamento;
- envio de formulário;
- ação em um item;
- paginação.

Um único `loading: boolean` pode ser insuficiente em telas com operações paralelas.

## Erros

O estado deve representar erros de maneira estruturada.

Evitar armazenar apenas mensagens provenientes diretamente da API.

Exemplo:

```ts
interface AppError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
```

## Cache

Cache deve possuir uma política explícita.

Documentar:

- duração;
- chave;
- invalidação;
- atualização;
- comportamento offline;
- fonte de verdade.

Não introduzir cache apenas para evitar uma chamada isolada.

## Quando considerar NgRx

Avaliar NgRx quando existirem vários destes sinais:

- muitas features compartilham e alteram o mesmo estado;
- fluxos assíncronos são complexos;
- eventos precisam ser rastreáveis;
- existe necessidade forte de devtools;
- há efeitos concorrentes;
- regras de atualização ficaram dispersas;
- a equipe domina a ferramenta.

NgRx não deve ser adotado apenas porque o projeto cresceu em quantidade de telas.

## ComponentStore ou store local

Uma store local pode ser considerada quando uma única feature possuir:

- estado complexo;
- várias ações;
- valores derivados;
- efeitos assíncronos;
- necessidade de isolamento.

## Persistência

Não persistir estado automaticamente.

Antes de usar storage, definir:

- por que o dado precisa sobreviver;
- validade;
- sensibilidade;
- migração de formato;
- limpeza;
- fallback em caso de dado inválido.

Tokens e informações sensíveis não devem ser armazenados de maneira insegura.
