# Tratamento de erros e observabilidade

## Objetivo

Definir um padrão consistente para falhas técnicas, erros de validação e feedback ao usuário.

## Tipos de erro

### Erro de validação local

Detectado antes da chamada ao backend.

Exemplos:

- campo obrigatório;
- formato inválido;
- combinação não permitida.

Deve ser apresentado próximo ao campo ou fluxo relacionado.

### Erro de negócio

A operação foi compreendida, mas não pode ser concluída devido a uma regra.

Exemplos:

- transição de status inválida;
- serviço já publicado;
- cliente sem permissão;
- conflito de versão.

Deve possuir mensagem clara e ação possível.

### Erro de autenticação

Pode exigir renovação de sessão ou login.

A aplicação não deve criar loops de redirecionamento.

### Erro de autorização

O usuário está autenticado, mas não possui permissão.

A interface deve evitar oferecer ações proibidas, mas o backend continua sendo a fonte de autorização.

### Erro transitório

Falha temporária de rede ou indisponibilidade.

Pode oferecer tentativa manual e, em casos seguros, retry controlado.

### Erro inesperado

Falha não prevista.

Deve:

- exibir mensagem genérica;
- registrar informação técnica segura;
- preservar correlation ID;
- evitar exposição de stack trace.

## Modelo interno

Exemplo:

```ts
export interface AppError {
  type:
    | 'validation'
    | 'business'
    | 'authentication'
    | 'authorization'
    | 'not-found'
    | 'conflict'
    | 'network'
    | 'unexpected';
  code?: string;
  message: string;
  fieldErrors?: Record<string, string>;
  correlationId?: string;
}
```

## Normalização

Erros HTTP devem ser convertidos para `AppError` em uma camada central.

Features não devem interpretar livremente status e formatos diferentes em vários pontos.

## Feedback ao usuário

Use:

- erro inline para campos;
- banner para falhas de carregamento;
- snackbar para confirmações e erros simples;
- dialog apenas quando a decisão exige atenção;
- empty state para ausência legítima de dados.

Evitar mensagens genéricas como “Algo deu errado” quando existe informação útil e segura.

## Logging

Logs do frontend devem ser mínimos e estruturados.

Podem incluir:

- código do erro;
- rota;
- operação;
- correlation ID;
- versão da aplicação;
- contexto técnico não sensível.

Não incluir:

- tokens;
- senhas;
- segredos;
- dados financeiros completos;
- conteúdo sensível de formulários;
- informações pessoais desnecessárias.

## Observabilidade

Uma ferramenta de monitoramento pode registrar:

- exceções não tratadas;
- falhas HTTP relevantes;
- tempo de carregamento;
- versão;
- ambiente;
- rota;
- correlation ID.

## Error handler global

O error handler global é a última barreira.

Ele não substitui o tratamento contextual de erros esperados.

## Estados de tela

Toda tela que carrega dados deve considerar:

- inicial;
- loading;
- sucesso;
- vazio;
- erro;
- recarregamento.

## Recuperação

Sempre que possível, forneça uma ação:

- tentar novamente;
- voltar;
- atualizar;
- corrigir campos;
- refazer login;
- abrir suporte.

## Testes

Testar:

- normalização de erros;
- mensagens de validação;
- falha de carregamento;
- recuperação;
- expiração da sessão;
- ausência de permissão;
- conflito;
- erro inesperado.
