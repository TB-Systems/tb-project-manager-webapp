# 10 - Project form

## Objetivo

Permitir que o usuário consiga criar e editar um projeto, se baseie na url, se vier com id, é editar, se não vier, é criação.

## Definições

- A tela deve conter formulário para criação/edição do projeto.
- Segue abaixo a regra dos campos:
    - Nome: Até 100 caracteres, obrigatório;
    - Descrição: Até 500 caracteres, não obrigatório;
    - Slug: Uníco, até 50 caracteres, obrigatório, sem espaços e caracteres especiais;
    - Repo URL: Até 500 caracteres, não obrigatório;
    - Status: não deve ter um campo e nem deve ir no body, o serviço ja deve criar automaticamente com estado 1 - Backlog;

## UI

- Use as cores do arquivo de colors.md
- Use Material Design
- Crie um estado de loading enquanto as informações são carregadas
- Crie um estado de erro com botão de retry para recarregar os dados
- No botão para editar/criar, faça que ele tenha um estado de loading, e que esse botão não possa ser clicado durante o loading

## Endpoints

- Buscar os dasdos do projeto caso ele venha com o id na url: 
```JSON
request 'http://localhost:3000/api/v1/projects/:id' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```

- Atualizar projeto: 
```JSON
request PUT 'http://localhost:3000/api/v1/projects/:id' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'' \
  --body '{
  "name": "Project Manager Atualizado",
  "description": "Sistema interno para acompanhar operacao e monitoramento.",
  "slug": "project-manager",
  "repo_url": "https://github.com/TB-Systems/tb-project-manager-api",
  "status": 1
}'
```

- Criar projeto: 
```JSON
request POST 'http://localhost:3000/api/v1/projects' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'' \
  --body '{
  "name": "Project Manager",
  "description": "Sistema interno para acompanhar clientes, projetos e servicos no ar.",
  "slug": "project-manager",
  "repo_url": "https://github.com/TB-Systems/tb-project-manager-api",
  "status": 1
}'
```