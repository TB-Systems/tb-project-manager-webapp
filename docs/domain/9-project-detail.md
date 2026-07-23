# 9 - Project Detail

## Objetivo

Permitir que o usuário consiga vizualizar o projeto, recebendo o id dele pela url.

## Definições

- A tela deve detalhar o projeto, mostrar todas as suas informações. Incluindo os seus serviços.
- Se houver cliente vinculado, trazer esse cliente e o detalhe do customer project também.
- Deve haver um botão de desvincular cliente, deletando o customer project dele, e isso deve ter um modal igual uma deleção.
- Deve haver um botão de editar o projeto.
- Além de listar os serviços linkados no projeto, eles devem ter um botão de editar e deletar, seguindo as regras padrões de editar e deletar.
- Linke o dashboard e a listagem de projetos na parte que permite navegar para o detalhe do projeto que ainda não foi desenvolvido.
- Deve haver um botão de deletar projeto onde ele sobe um modal de confirmação, e só permite deletar se não tiver nenhum cliente vinculado.
- Vai haver um botão de vincular cliente e um de criar serviço para o projeto.
- O de vincular cliente vai direcionar para a tela de vincular projeto com cliente.
- O de criar serviço vai direcionar para a tela de criar serviço.
- No botão de vincular cliente ao projeto, vai direcionar para uma tela de formulário do cliente com o projeto.
- Ao lado do botão de vincular, deve ter um de editar a relação, caso tenha cliente vinculado.
- No botão de vincular serviço ao projeto, vai direcionar para uma tela de formulário de criação de serviço.

## UI

- Use as cores do arquivo de colors.md
- Use Material Design
- Crie um estado de loading enquanto as informações são carregadas
- Crie um estado de erro com botão de retry para recarregar os dados

## Endpoint

- Detalhe do projeto: 
```JSON
request 'http://localhost:3000/api/v1/projects/:id' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```

- Serviços vinculados ao projeto:
```JSON
request 'http://localhost:3000/api/v1/project-services?page=1&limit=10&project_id=<PROJECT_ID>' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```

- Deletar projeto: 
```JSON
request DELETE 'http://localhost:3000/api/v1/projects/5e5e701b-d7e1-4e07-b87a-6d470e228f95' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```

- Detalhe do cliente: 
```JSON
request 'http://localhost:3000/api/v1/customers/:id' \
  --header 'Cookie: project_manager_csrf=crsf; project_manager_session=session_id; user_id=user_id'
```