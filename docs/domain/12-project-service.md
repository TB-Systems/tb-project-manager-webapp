# 12 - Project Service Form

## Objetivo

Permitir que o usuário consiga criar/editar um serviço vinculado ao projeto.

## Definições

- A tela deve conter formulário para criação/edição do projeto com o cliente.
- Não precisa de um campo para o projeto, visto que vamos vir do detalhe do projeto, vamos então ja salvar o ID do projeto e enviar para o back depois.
- Não vamos atualizar estado nessa tela, nem na criação ou na edição.
- Segue abaixo a regra dos campos:
    - Cliente: Seletor de clientes (deve baixar todos os clientes SEM PAGINAÇÃO, edite o endpoint se precisar);
    - Valor do projeto: obrigatório, só não pode ser valor negativo;
    - Valor do mensal: obrigatório, só não pode ser valor negativo;
    - Dia do vencimento: obrigatório, entre 1 e 31;
    - Status de pagamento do projeto: não deve ter um campo e nem deve ir no body, o serviço ja deve criar automaticamente com estado 1 - ProjectPaymentStatusFirstHalfPending;
    - Ultimo pagamento: não deve ter um campo e não é obrigatório, ignore;

## UI

- Use as cores do arquivo de colors.md
- Use Material Design
- Crie um estado de loading enquanto as informações são carregadas
- Crie um estado de erro com botão de retry para recarregar os dados
- No botão para editar/criar, faça que ele tenha um estado de loading, e que esse botão não possa ser clicado durante o loading

## Endpoints

- Buscar os dasdos do serviço caso ele venha com o id na url: 
```JSON
request 'http://localhost:3000/api/v1/project-services/1a4082d6-567f-4c01-8608-86adaec9a724' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```

- Atualizar serviço: 
```JSON
request PUT 'http://localhost:3000/api/v1/project-services/1a4082d6-567f-4c01-8608-86adaec9a724' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id' \
  --body '{
  "project_id": "6566d494-1fc2-4737-8723-18ce830a5052",
  "name": "Project Manager API",
  "type": 1,
  "url": "http://localhost:8080",
  "repo_url": "https://github.com/TB-Systems/tb-project-manager-api",
  "health_check_url": "http://localhost:8080/health"
}'
```

- Criar projeto: 
```JSON
request POST 'http://localhost:3000/api/v1/project-services' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id' \
  --body '{
  "project_id": "6566d494-1fc2-4737-8723-18ce830a5052",
  "name": "Project Manager API",
  "type": 1,
  "url": "http://localhost:8080",
  "repo_url": "https://github.com/TB-Systems/tb-project-manager-api",
  "health_check_url": "http://localhost:8080/health"
}'
```