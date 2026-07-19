# Segurança no frontend

## Objetivo

Reduzir riscos no cliente sem assumir que o frontend substitui validações e controles do backend.

## Princípio principal

O frontend melhora a experiência e reduz exposição acidental, mas não é uma fronteira confiável de segurança.

Toda autorização e validação crítica deve existir no backend.

## Autenticação

A aplicação deve:

- centralizar sessão;
- tratar expiração;
- evitar loops de renovação;
- limpar estado no logout;
- não expor tokens em logs;
- utilizar mecanismos seguros definidos pela arquitetura do backend.

## Autorização

A interface pode esconder ou desabilitar ações sem permissão.

Isso não substitui a validação do servidor.

Permissões devem ser representadas por capacidades ou regras explícitas.

Evitar condicionais espalhadas como:

```ts
if (user.role === 'admin') {
  // ...
}
```

Prefira:

```ts
if (permissions.canDeleteClient) {
  // ...
}
```

## Armazenamento

Não armazenar em local storage:

- senhas;
- segredos;
- dados financeiros completos;
- informações pessoais desnecessárias;
- tokens quando a estratégia de segurança proibir;
- respostas completas de APIs sensíveis.

Todo dado persistido deve possuir justificativa e política de limpeza.

## XSS

Evitar:

- HTML dinâmico não confiável;
- bypass de sanitização;
- interpolação de conteúdo externo em contextos inseguros;
- uso indiscriminado de `innerHTML`.

Qualquer bypass de segurança do Angular deve ser justificado e revisado.

## CSRF

A estratégia depende do método de autenticação utilizado.

Quando cookies participarem da autenticação:

- seguir o mecanismo de proteção definido pelo backend;
- utilizar headers ou tokens antiforgery quando exigido;
- revisar configurações de origem e credenciais.

## Dados sensíveis

Minimize a exposição de dados.

A interface deve solicitar e mostrar apenas o necessário.

Mascarar valores quando aplicável.

## Logs e telemetria

Nunca enviar dados sensíveis para:

- console;
- analytics;
- monitoramento;
- logs de erro;
- eventos de interação.

## Dependências

Antes de adicionar uma dependência:

- verificar necessidade;
- avaliar manutenção;
- limitar permissões;
- evitar bibliotecas redundantes;
- revisar vulnerabilidades;
- registrar a justificativa.

## Configuração

Variáveis presentes no bundle do frontend não são segredos.

Chaves privadas, credenciais e segredos nunca devem ser incluídos no código ou em arquivos de ambiente distribuídos ao navegador.

## Uploads

Quando houver upload:

- validar extensão e tamanho na interface;
- não confiar apenas na validação do cliente;
- evitar renderização automática de conteúdo não confiável;
- apresentar erros de forma segura.

## Navegação

Guards melhoram fluxo, mas não substituem autorização do backend.

## Checklist

Antes de concluir uma feature:

- nenhum segredo foi adicionado;
- nenhum dado sensível é registrado;
- permissões foram consideradas;
- conteúdo externo é tratado com segurança;
- armazenamento local foi justificado;
- dependências foram revisadas;
- erros não expõem detalhes internos.
