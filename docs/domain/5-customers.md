# 5 - Custoemrs

## Objetivo

Permitir que o usuário consiga listar os clientes.

## Definições

- A tela deve ter a listagem de clientes, onde iremos nos basear no card utilizado no dashboard, ele não vai ser um accordion, apenas um card
- A listagem deve ser vertical.
- No card, vamos mostrar apenas o nome do cliente, email, telefone, documento e status.
- O card vai ser clicavel e vair redirecionar para o detalhe do cliente.
- Essa listagem tem paginação, logo lide com ela na UI com scroll infinito

## UI

- Use as cores do arquivo de colors.md
- Use Material Design
- Crie um estado de loading enquanto as informações são carregadas
- Crie um estado de erro com botão de retry para recarregar os dados
- Tanto o Loading quanto o retry, devem ser iguais ao do dashboard, portanto componentise eles para reaproveitalos

## Endpoint

- cURL: 
```JSON
request 'http://localhost:3000/api/v1/customers?page=1&limit=10' \
  --header 'Cookie: project_manager_csrf=csrf; project_manager_session=session_id; user_id=user_id'
```