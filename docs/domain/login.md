# Transações recorrentes

## Objetivo

Permitir que o usuário consiga fazer login.

## Definições

- Deve ser uma tela simples apenas com um pequenos container
- Campo de username (sem regra)
- Campo de senha (sem regra também)
- Botão de login
- Não existe criação de usuário, só o login

## UI

- Use as cores do arquivo de colors.md
- Use Material Design

## Endpoint

- cURL: 
```JSON
POST '{{baseURL}}/auth/login' \
  --header 'Content-Type: application/json' \
  --body '{
  "username": "",
  "password": ""
}'
```