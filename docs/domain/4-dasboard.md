# 4 - Dashboard

## Objetivo

Permitir que o usuário consiga listar os projetos, e suas relações.

## Definições

- A tela deve ter a listagem de projetos, onde será usado o componente de accordion ```<mat-accordion>``` e envolvendo ele o card do [material](https://m3.material.io/components/cards/overview)
- A listagem deve ser vertical.
- No accordion fechado, vamos mostrar apenas o nome do projeto como título, o status e a quantidade de serviços.
- No accordion aberto, vamos mostrar todas as informações do customer e dos services.
- Vai haver um botão clicável para o detalhe do projeto, um para o do cliente e um para cada serviço usando o a tag ```<a>```

## UI

- Use as cores do arquivo de colors.md
- Use Material Design

## Endpoint

- cURL: 
```JSON
postman request 'http://localhost:3000/api/v1/dashboard' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=userid'
```