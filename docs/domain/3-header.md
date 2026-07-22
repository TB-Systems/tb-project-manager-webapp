# 2 - Navigation

## Objetivo

O objetivo é ter um componente de navegação de barra superior com o título do Project Manager no canto superior esquerdo, e um botão de logout no canto superior direito.

## Definições

- O componente deve ser fixo em todas as telas logadas, logo, se uma tela for scrollavel, ele deve permanecer fixo.
- O botão de logout deve efetuar o logout do usuário e redirecionar ele para a tela de login.
- O ícone do botão de logoute deve ser o ```<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=logout" />```

## UI

- Use as cores do arquivo de colors.md
- Use Material Design

- cURL: 
```JSON
request POST 'http://localhost:3000/api/v1/auth/logout' \
  --header 'Cookie: project_manager_csrf=csrf; project_manager_session=session; user_id=userid'
```