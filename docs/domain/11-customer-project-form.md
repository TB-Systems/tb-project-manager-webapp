# 11 - Customer Project form

## Objetivo

Permitir que o usuário consiga vincular projeto ao cliente, e incluir os dados de pagamento.

## Definições

- A tela deve conter formulário para criação/edição do projeto com o cliente.
- Não precisa de um campo para o projeto, visto que vamos vir do detalhe do projeto, vamos então ja salvar o ID do projeto e enviar para o back depois.
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

- Buscar os dasdos do projeto caso ele venha com o id na url: 
```JSON
request 'http://localhost:3000/api/v1/customer-projects/881c671f-2c17-4e1f-a4b0-e49d3649ad99' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id' 
```

- Atualizar projeto: 
```JSON
request PUT 'http://localhost:3000/api/v1/customer-projects/881c671f-2c17-4e1f-a4b0-e49d3649ad99' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id' \
  --body '{
  "project_id": "6566d494-1fc2-4737-8723-18ce830a5052",
  "customer_id": "5e5e701b-d7e1-4e07-b87a-6d470e228f95",
  "project_value": 300000,
  "monthly_value": 18000,
  "due_day": 15,
  "project_payment_status": 2,
  "last_payment": null
}'
```

- Criar projeto: 
```JSON
request POST 'http://localhost:3000/api/v1/customer-projects' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id' \
  --body '{
  "project_id": "6566d494-1fc2-4737-8723-18ce830a5052",
  "customer_id": "5e5e701b-d7e1-4e07-b87a-6d470e228f95",
  "project_value": 250000,
  "monthly_value": 15000,
  "due_day": 10,
  "project_payment_status": 1,
  "last_payment": null
}'
```