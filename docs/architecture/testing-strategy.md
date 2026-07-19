# Estratégia de testes

## Objetivo

Garantir comportamento confiável sem depender exclusivamente de testes manuais ou testes de ponta a ponta.

## Ferramentas

Decisão inicial:

- Vitest para testes unitários;
- Angular TestBed para componentes e integrações Angular;
- Playwright para testes de ponta a ponta;
- mocks HTTP com ferramentas oficiais do Angular.

A escolha pode ser revisada por decisão arquitetural documentada.

## Pirâmide de testes

Prioridade:

1. testes de funções e regras puras;
2. testes de services, facades e mappers;
3. testes de componentes;
4. testes de integração de fluxos;
5. poucos testes E2E para jornadas críticas.

## Testes de domínio

Devem testar regras sem Angular quando possível.

Exemplos:

- transições de status;
- validações;
- mapeamentos;
- permissões derivadas;
- cálculos;
- regras de disponibilidade.

## Testes de mapper

Devem cobrir:

- transformação válida;
- valores opcionais;
- valores desconhecidos;
- diferenças de nomenclatura;
- fallback seguro;
- regressões de contrato.

## Testes de facade

Devem cobrir:

- estado inicial;
- loading;
- sucesso;
- erro;
- atualização de estado;
- coordenação de múltiplas chamadas;
- invalidação de cache;
- ações concorrentes quando aplicável.

## Testes de componentes

Devem verificar comportamento observável:

- conteúdo apresentado;
- eventos emitidos;
- campos e validações;
- loading;
- erro;
- acessibilidade básica;
- interação do usuário.

Evitar testes excessivamente acoplados a detalhes internos.

## Testes HTTP

Usar mock HTTP para verificar:

- método;
- URL;
- parâmetros;
- body;
- headers específicos;
- transformação da resposta;
- tratamento de erro.

Não realizar chamadas reais em testes unitários.

## Testes E2E

Reservar para jornadas essenciais.

Exemplos:

- autenticação;
- cadastro de cliente;
- criação de projeto;
- publicação de serviço;
- alteração de status;
- recuperação após falha relevante.

Evitar cobrir cada variação de validação apenas com E2E.

## Requisitos mínimos por alteração

Toda alteração de regra de negócio deve possuir:

- teste do caminho principal;
- teste de validação;
- teste dos casos-limite relevantes;
- teste de regressão quando corrigir um bug.

## Correção de bug

Fluxo esperado:

1. reproduzir;
2. criar teste que demonstre a falha;
3. corrigir;
4. confirmar que o teste passa;
5. executar testes relacionados.

## Nomenclatura

Os testes devem descrever comportamento.

Exemplo:

```ts
it('deve impedir a publicação quando o serviço não possui ambiente configurado', () => {
  // ...
});
```

## Mocks

Mockar fronteiras externas, não tudo indiscriminadamente.

Prefira objetos reais para:

- modelos;
- funções puras;
- regras;
- mappers simples.

Mockar:

- API;
- storage;
- relógio;
- autenticação;
- analytics;
- integrações externas.

## Cobertura

Cobertura é um indicador, não objetivo isolado.

Priorizar:

- regras críticas;
- fluxos de negócio;
- erros;
- casos-limite;
- regressões.

## Estabilidade

Testes devem evitar:

- dependência de ordem;
- horário real;
- timers sem controle;
- dados externos;
- sleeps;
- seletores frágeis;
- estado compartilhado.

## Execução esperada

O projeto deve possuir comandos equivalentes a:

```bash
npm run lint
npm run test
npm run build
npm run e2e
```

E2E pode ser executado separadamente quando a mudança afetar jornadas críticas.

## Definição de pronto

Uma alteração está pronta quando:

- testes relevantes foram adicionados;
- testes existentes continuam passando;
- build passa;
- lint passa;
- critérios de aceitação foram cobertos;
- falhas não foram ocultadas por mocks excessivos.
