# Componentes e responsabilidades

## Objetivo

Evitar que componentes Angular concentrem apresentação, integração, estado e regra de negócio ao mesmo tempo.

## Tipos de componente

### Componentes de apresentação

Recebem dados por inputs e emitem eventos por outputs.

Devem:

- apresentar informações;
- capturar interações;
- controlar detalhes visuais locais;
- ser previsíveis e reutilizáveis;
- evitar dependência de services de negócio.

Exemplo conceitual:

```ts
@Component({
  selector: 'tb-client-card',
  standalone: true,
  templateUrl: './client-card.component.html',
})
export class ClientCardComponent {
  client = input.required<ClientViewModel>();
  edit = output<string>();
  remove = output<string>();
}
```

### Pages ou containers

Conectam a interface ao fluxo da aplicação.

Podem:

- injetar facades;
- ler parâmetros de rota;
- disparar carregamentos;
- coordenar dialogs e navegação;
- transformar estado em propriedades para a view.

Não devem:

- chamar `HttpClient` diretamente;
- repetir regras que já existem no domínio;
- montar DTOs complexos no template.

## Facades

A facade apresenta uma API simples para a página.

Pode concentrar:

- estado da tela;
- carregamento;
- filtros;
- paginação;
- comandos;
- coordenação de múltiplos repositories;
- tratamento de sucesso e falha do fluxo.

Exemplo conceitual:

```ts
@Injectable()
export class ClientsFacade {
  readonly clients = signal<ClientViewModel[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async load(): Promise<void> {
    // Coordena o caso de uso.
  }
}
```

A facade não deve se tornar uma classe genérica com responsabilidades de várias features.

## Services de caso de uso

Use um service ou use case separado quando uma operação:

- possui regra de negócio relevante;
- combina múltiplos repositories;
- precisa ser reutilizada em mais de uma tela;
- deve ser testada isoladamente;
- não pertence ao estado de apresentação.

Exemplos:

- publicar um serviço;
- alterar o status de um projeto;
- vincular um cliente a um projeto;
- validar uma transição operacional.

## Estado visual local

Estado visual simples pode permanecer no componente:

- aba selecionada;
- dialog aberto;
- item expandido;
- texto temporário de busca;
- indicador de hover;
- ordenação estritamente visual.

## Estado de negócio

Estado relacionado ao fluxo deve ficar na facade ou no data access:

- cliente selecionado;
- lista carregada;
- permissões;
- filtros persistentes;
- paginação da API;
- status de salvamento;
- erro de operação.

## Templates

Templates devem permanecer simples.

Evitar:

- chamadas de método custosas em bindings;
- regras complexas em expressões;
- múltiplos ternários;
- conversões de domínio;
- acesso a estruturas internas de DTOs;
- lógica duplicada.

Prefira computed signals, view models e pipes puros.

## View models

Quando o formato necessário para a tela divergir do modelo de domínio, crie um view model.

Exemplo:

```ts
export interface ClientListItemViewModel {
  id: string;
  displayName: string;
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'danger';
  canEdit: boolean;
}
```

O componente não deve decidir sozinho como traduzir estados ou permissões.

## Angular Material

Angular Material é a base visual do projeto.

Regras:

- encapsule padrões repetidos;
- não acople regras de domínio a componentes Material;
- mantenha acessibilidade;
- use dialogs para interações focadas;
- evite abrir dialogs encadeados;
- defina padrões de feedback, loading e confirmação.

## Acessibilidade

Todo componente deve considerar:

- navegação por teclado;
- label para campos;
- foco após abertura e fechamento de dialogs;
- mensagens de erro associadas ao campo;
- contraste adequado;
- conteúdo textual para ícones relevantes;
- estado disabled coerente.

## Critério de revisão

Um componente está com responsabilidade excessiva quando:

- injeta vários services;
- conhece detalhes de vários endpoints;
- contém regras de permissão;
- transforma muitos DTOs;
- possui múltiplos fluxos assíncronos;
- é difícil de testar sem configurar grande parte da aplicação.
