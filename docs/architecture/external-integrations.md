# Integrações externas

## Objetivo

Isolar SDKs e serviços externos para que o domínio e as features não dependam diretamente de detalhes de fornecedores.

## Tipos de integração

Exemplos:

- autenticação;
- armazenamento local;
- analytics;
- monitoramento;
- feature flags;
- serviços de terceiros;
- APIs de status;
- ferramentas de suporte.

## Ports e adapters

Quando uma integração for relevante para o domínio, defina um contrato interno.

Exemplo:

```ts
export abstract class AuthProvider {
  abstract signIn(): Observable<AuthenticatedUser>;
  abstract signOut(): Observable<void>;
  abstract getAccessToken(): Observable<string | null>;
}
```

A implementação concreta fica na infraestrutura:

```ts
@Injectable()
export class ExternalAuthProvider implements AuthProvider {
  // Implementação baseada no SDK externo.
}
```

A feature depende do contrato, não do SDK.

## Autenticação

A camada de autenticação deve centralizar:

- inicialização;
- sessão;
- renovação;
- usuário autenticado;
- logout;
- expiração;
- integração com interceptor;
- tratamento de falhas.

Componentes não devem acessar SDKs de autenticação diretamente.

## Storage

Crie adapters para storage quando o dado persistido fizer parte de um fluxo relevante.

Exemplo:

```ts
export abstract class AppStorage {
  abstract get<T>(key: string): T | null;
  abstract set<T>(key: string, value: T): void;
  abstract remove(key: string): void;
}
```

Defina:

- prefixo de chaves;
- expiração;
- tratamento de JSON inválido;
- estratégia de limpeza;
- dados proibidos.

## Analytics

Eventos de analytics devem usar nomes padronizados e não depender diretamente do SDK em componentes.

Exemplo:

```ts
analytics.track('client_created', {
  source: 'client_form',
});
```

Não enviar dados pessoais ou sensíveis sem necessidade e autorização.

## Observabilidade

Integrações de monitoramento devem receber erros normalizados.

Evitar enviar:

- tokens;
- payloads completos;
- dados pessoais;
- segredos;
- conteúdo de formulários sensíveis.

## Feature flags

Feature flags devem:

- possuir valores padrão seguros;
- ser tipadas;
- ter responsável;
- possuir plano de remoção;
- não substituir autorização;
- não esconder permanentemente código abandonado.

## Falhas de integração

Toda integração deve definir:

- timeout;
- fallback;
- comportamento sem conexão;
- tratamento de indisponibilidade;
- impacto para o usuário;
- forma de monitoramento.

## Substituição de fornecedor

Uma integração está adequadamente isolada quando a troca do fornecedor exige alterar principalmente:

- adapter;
- configuração;
- testes da integração.

Features e domínio não devem precisar de mudanças extensas.
