# 5 - Customer form

## Objetivo

Permitir que o usuário consiga criar e editar um cliente, se baseie na url, se vier com id, é editar, se não vier, é criação.

## Definições

- A tela deve conter formulário para criação/edição do cliente.
- Segue abaixo a regra dos campos:
    - Nome: Até 100 caracteres, obrigatório;
    - Slug: Uníco, até 50 caracteres, obrigatório, sem espaços e caracteres especiais;
    - Tipo de Documento: Selector, CPF, CNPJ ou outro, dependendo da escolha vai influenciar a mascara do campo de documento, pois CPF e CNPJ tem suas mascaras e validações que deverão ser aplicadas, e outro simplesmente não permita deixar vazio;
    - Documento: Até 100 caracteres, obrigatório, mascara e validação de acordo com o campo do tipo de documento;
    - Email: Até 100 caracteres, obrigatório, mascara de email e validação;
    - Celular: Até 100 caracteres, obrigatório, mascara de celular PT-br e validação;
    - Status: ja começa com o 1;
    - URL: Até 500 caracteres, e pode ser vazio ou nulo;

## UI

- Use as cores do arquivo de colors.md
- Use Material Design
- Crie um estado de loading enquanto as informações são carregadas
- Crie um estado de erro com botão de retry para recarregar os dados
- No botão para editar/criar, faça que ele tenha um estado de loading, e que esse botão não possa ser clicado durante o loading

## Endpoints

- Buscar os dasdos do cliente caso ele venha com o id na url: 
```JSON
request 'http://localhost:3000/api/v1/customers/:id' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```

- Editar cliente: 
```JSON
request PUT 'http://localhost:3000/api/v1/customers/5e5e701b-d7e1-4e07-b87a-6d470e228f95' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id' \
  --body '{
  "name": "Cliente Exemplo Atualizado",
  "slug": "cliente-exemplo",
  "document": "11144477735",
  "document_type": 1,
  "email": "cliente.exemplo@tb.local",
  "phone": "+55 11 98888-8888",
  "status": 1,
  "url": "https://cliente-exemplo.local/app"
}'
```

- Criar cliente: 
```JSON
request POST 'http://localhost:3000/api/v1/customers' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id' \
  --body '{
  "name": "Cliente Exemplo",
  "slug": "cliente-exemplo",
  "document": "11144477735",
  "document_type": 1,
  "email": "cliente.exemplo@tb.local",
  "phone": "+55 11 99999-9999",
  "status": 1,
  "url": "https://cliente-exemplo.local"
}'
}'
```