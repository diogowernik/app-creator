# Roadmap

Primeira rodada concluída em 6 de outubro de 2026: fundação, template, gerador,
validação local e documentação inicial do modo de migração. O modo de migração
gera documentos para preencher; não examina nem importa dados automaticamente.

## 1. Fundação do projeto

- [x] Criar o diretório do App Creator.
- [x] Registrar arquitetura e limites do starter.
- [x] Definir política de versões e atualização.
- [x] Escolher os arquivos mínimos do Holding que representam a fundação técnica.
- [x] Registrar Holding, Clareia e FinKidz como projetos de referência.

## 2. Template executável

- [x] Criar o template Django/DRF sem domínios do Holding.
- [x] Criar o template Next.js/React/TypeScript.
- [x] Conectar login, logout e usuário atual.
- [x] Adicionar configuração de desenvolvimento e produção.
- [x] Adicionar testes mínimos e CI proporcional.

## 3. Gerador

- [x] Criar `create-app.sh` como orquestrador fino.
- [x] Validar nome, slug e destino.
- [x] Recusar sobrescrita de diretório existente.
- [x] Copiar o template e substituir placeholders.
- [x] Preparar ambientes e executar migrações.
- [x] Exibir um resumo curto dos próximos comandos.

## 4. Validação

- [x] Gerar um projeto descartável do zero.
- [x] Validar autenticação ponta a ponta.
- [x] Validar testes, lint, tipos e builds.
- [x] Confirmar que o projeto gerado não depende do repositório do App Creator.

## 5. Migração de aplicações

- [x] Adicionar o modo `migration`.
- [x] Gerar inventário de funcionalidades do legado.
- [x] Gerar mapa de modelos e dados.
- [x] Gerar checklist de paridade funcional e visual.
- [x] Manter a implementação do domínio fora do gerador.

## 6. Catálogo e inspeção de projetos

- [x] Definir um manifesto opcional do App Creator dentro dos apps gerados.
- [ ] Cadastrar projetos existentes sem exigir que tenham sido gerados pelo starter.
- [ ] Detectar stacks e versões a partir dos manifestos nativos.
- [ ] Criar adaptadores iniciais para Django e Next.js.
- [ ] Tratar Flutter como extensão, sem incluí-lo no template web padrão.
- [ ] Exibir estado Git e saúde básica de forma somente leitura.

## 7. Frontend de gerenciamento

- [ ] Listar projetos cadastrados e seus componentes.
- [ ] Mostrar versões atuais, versões da fundação e diferenças relevantes.
- [ ] Mostrar comandos de verificação e último resultado conhecido.
- [ ] Produzir um plano de atualização antes de qualquer escrita.
- [ ] Permitir atualização assistida com confirmação, branch própria e relatório.
- [ ] Nunca atualizar vários projetos silenciosamente.

## 8. Evolução

- [ ] Versionar releases do App Creator.
- [ ] Manter changelog com instruções para apps existentes.
- [ ] Criar auditoria não destrutiva de versões.
- [ ] Avaliar automação de atualizações somente após o fluxo manual estar estável.
