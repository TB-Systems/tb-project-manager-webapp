# 8 - Project list

## Objetivo

Permitir que o usuário consiga listar os projeto.

## Definições

- A tela deve ter a listagem de projetos, onde iremos nos basear no card de clientes.
- A listagem deve ser vertical.
- No card, vamos mostrar apenas o nome do projeto, slug e status.
- O card vai ser clicavel e vair redirecionar para o detalhe do projeto.
- Essa listagem tem paginação, logo lide com ela na UI com scroll infinito
- Deve haver um botão acima da listagem para adcionar projeto.

## UI

- Use as cores do arquivo de colors.md
- Use Material Design
- Crie um estado de loading enquanto as informações são carregadas
- Crie um estado de erro com botão de retry para recarregar os dados
- Tanto o Loading quanto o retry, devem ser iguais ao do dashboard, portanto componentise eles para reaproveitalos

## Endpoint

- cURL: 
```JSON
request 'http://localhost:3000/api/v1/projects?page=1&limit=10' \
  --header 'Cookie: project_manager_csrf=csrf; project_manager_session=session_id; user_id=user_id'
```