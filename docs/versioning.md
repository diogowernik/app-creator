# Versões e atualizações

## Objetivo

Permitir que o starter acompanhe versões estáveis de longa duração sem obrigar todos os apps gerados a atualizar ao mesmo tempo e sem esconder mudanças incompatíveis.

## Política

### Django

- Preferir uma linha LTS suportada para a base padrão.
- Fixar o projeto dentro dessa linha compatível, permitindo correções seguras.
- Avaliar a próxima LTS primeiro em um app gerado de teste.
- Migrar uma linha principal por vez e ler as notas de incompatibilidade antes da troca.

### Next.js e React

- Usar uma linha estável e suportada, compatível entre Next.js, React, TypeScript e ESLint.
- Não atualizar uma dependência estrutural isoladamente quando ela fizer parte desse conjunto.
- Testar a próxima linha principal em um app gerado de teste antes de torná-la padrão.
- Tratar mudanças de major como migração explícita, nunca como atualização automática silenciosa.

### Outras dependências

- Manter intervalos compatíveis nos manifestos e locks reproduzíveis.
- Separar correções rotineiras de mudanças principais.
- Evitar bibliotecas sem função concreta na fundação.
- Remover dependências que deixarem de ser usadas.

## Fonte única das versões

As versões pertencem aos arquivos nativos do template:

- Python e Django: `template/api/pyproject.toml`;
- Node, Next e React: `template/web/package.json`;
- resolução exata: arquivos de lock.

O `create-app.sh` apenas instala o que esses arquivos declaram. Ele não mantém uma segunda lista de versões.

## Processo de atualização do starter

1. Criar um app descartável com a versão atual do starter.
2. Atualizar os manifestos e locks no template.
3. Aplicar guias oficiais de migração quando houver mudança principal.
4. Gerar novamente um app descartável do zero.
5. Executar testes, análise estática, build e checagem de migrações.
6. Validar login, logout, sessão expirada e rota protegida.
7. Registrar no changelog do starter as mudanças que um app existente precisaria reproduzir.
8. Somente então publicar a nova versão do template.

## Apps já gerados

Um app criado pelo starter não recebe alterações automaticamente. Isso evita que uma atualização do gerador quebre um produto em desenvolvimento.

Para facilitar atualizações conscientes, cada app deverá registrar:

- versão do App Creator usada na geração;
- data da geração;
- versões principais de Django, Next.js e React;
- changelog ou guia de atualização aplicável.

No futuro, um comando de auditoria poderá comparar essas informações com o template atual. Ele deve apenas relatar diferenças; alterações automáticas ficam fora do primeiro MVP.

## Critério de aceite de uma atualização

Uma atualização da fundação só está pronta quando um projeto novo consegue:

- instalar dependências do zero;
- criar e migrar o banco;
- iniciar backend e frontend;
- autenticar e encerrar sessão;
- executar testes e análise estática;
- gerar o build de produção;
- recusar configuração insegura de produção.
