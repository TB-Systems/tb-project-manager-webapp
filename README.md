# TB Project Manager Webapp

Frontend Angular do TB Project Manager.

## Requisitos

- Node.js 24+
- npm 11+
- Backend local em `http://localhost:3000/api/v1`

## Instalar dependencias

```bash
npm install
```

## Rodar localmente

```bash
npm start
```

A aplicacao fica disponivel em:

```text
http://localhost:4200/login
```

Para fixar host e porta:

```bash
npm start -- --host 127.0.0.1 --port 4200
```

## Testes

```bash
npm run test -- --watch=false
```

Para rodar em modo watch:

```bash
npm test
```

## Build

```bash
npm run build
```

O resultado fica em `dist/tb-project-manager-webapp/`.

## Desenvolvimento

```bash
npm run watch
```
