# Acesso a dados e HTTP

## Objetivo

Centralizar a comunicação com o backend e impedir que detalhes de transporte se espalhem pela interface.

## Fluxo padrão

```text
Component/Page
      ↓
Facade ou Use Case
      ↓
Repository
      ↓
API Service
      ↓
HttpClient
```

## API services

API services encapsulam endpoints HTTP.

Responsabilidades:

- definir URLs;
- enviar parâmetros;
- enviar headers específicos;
- tipar request e response;
- representar contratos externos;
- retornar Observables;
- não decidir regras de negócio.

Exemplo:

```ts
@Injectable({ providedIn: 'root' })
export class ClientsApi {
  private readonly http = inject(HttpClient);

  list(params: ListClientsParams): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>('/api/clients', { params });
  }
}
```

## DTOs

DTOs representam o contrato da API.

Devem permanecer próximos do data access.

Exemplo:

```ts
export interface ClientDto {
  id: string;
  legal_name: string;
  status: string;
}
```

Evite utilizar DTOs diretamente em toda a aplicação.

## Mappers

Mappers transformam DTOs em modelos internos.

Exemplo:

```ts
export function mapClientDto(dto: ClientDto): Client {
  return {
    id: dto.id,
    legalName: dto.legal_name,
    status: mapClientStatus(dto.status),
  };
}
```

Mappers devem:

- ser funções puras quando possível;
- validar valores inesperados;
- centralizar diferenças de nomenclatura;
- proteger a aplicação de mudanças no backend.

## Repositories

Repositories representam operações de dados em linguagem próxima ao domínio.

Exemplo:

```ts
@Injectable({ providedIn: 'root' })
export class ClientsRepository {
  private readonly api = inject(ClientsApi);

  list(filter: ClientFilter): Observable<Client[]> {
    return this.api.list(toListClientsParams(filter)).pipe(
      map(items => items.map(mapClientDto))
    );
  }
}
```

Use repository quando:

- a aplicação precisa ser protegida de detalhes da API;
- existe mapeamento relevante;
- existem múltiplas fontes de dados;
- há cache;
- a operação possui significado de domínio.

Para endpoints triviais em uma feature pequena, uma facade pode inicialmente chamar o API service, desde que a separação continue clara.

## Interceptors

Interceptors podem cuidar de comportamento transversal:

- autenticação;
- correlation ID;
- headers comuns;
- serialização padronizada;
- log técnico;
- tratamento de erros comuns;
- retry leve em operações seguras.

Interceptors não devem:

- conhecer regras específicas de uma feature;
- exibir mensagens específicas de negócio;
- redirecionar silenciosamente em qualquer erro;
- repetir operações não idempotentes sem segurança.

## Retry

Retry deve ser conservador.

Permitido principalmente para:

- falhas transitórias;
- leitura idempotente;
- indisponibilidade temporária;
- limites explicitamente definidos.

Evitar retry automático em:

- criação;
- pagamento;
- publicação;
- exclusão;
- operações que possam gerar duplicidade.

## Cancelamento

Fluxos como busca devem cancelar requisições anteriores.

Exemplo:

```ts
searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => repository.search(term))
);
```

## Paginação e filtros

Parâmetros de paginação e filtro devem possuir tipos próprios.

Evitar montar query params manualmente em vários componentes.

## Tratamento de resposta

A aplicação deve diferenciar:

- sucesso com conteúdo;
- sucesso sem conteúdo;
- lista vazia;
- erro de validação;
- não autorizado;
- proibido;
- não encontrado;
- conflito;
- falha temporária;
- erro inesperado.

## Contratos

Mudanças de contrato devem ser tratadas explicitamente.

Quando houver incompatibilidade:

- atualizar DTO;
- atualizar mapper;
- atualizar testes;
- revisar documentação da feature;
- informar breaking change quando aplicável.

## Mock de API

Mocks devem ser utilizados em testes ou desenvolvimento local de maneira controlada.

Não espalhar condicionais de mock pelo código de produção.

## Regra de segurança

Nunca registrar:

- token;
- senha;
- segredo;
- payload sensível;
- dados financeiros completos;
- informações pessoais desnecessárias.
