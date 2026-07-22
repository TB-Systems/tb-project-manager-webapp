# 5 - Customer detail

## Objetivo

Permitir que o usuário consiga vizualizar o cliente, recebendo o id dele pela url.

## Definições

- A tela deve detalhar o cliente, mostrar todas as suas informações.
- Deve haver um botão de editar o cliente.
- Linke o dashboard e a listagem de clientes na parte que permite navegar para o detalhe do cliente que ainda não foi desenvolvido
- Deve haver um botão de deletar cliente onde ele sobe um modal de confirmação, e só permite deletar se não tiver nenhum projeto vinculado

## UI

- Use as cores do arquivo de colors.md
- Use Material Design
- Crie um estado de loading enquanto as informações são carregadas
- Crie um estado de erro com botão de retry para recarregar os dados

## Endpoint

- Detalhe do cliente: 
```JSON
request 'http://localhost:3000/api/v1/customers/:id' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```

- Deletar cliente: 
```JSON
request DELETE 'http://localhost:3000/api/v1/customers/5e5e701b-d7e1-4e07-b87a-6d470e228f95' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```