# Roadmap

## 1. Fundação do projeto

- [x] Criar o diretório do App Creator.
- [x] Registrar arquitetura e limites do starter.
- [x] Definir política de versões e atualização.
- [ ] Escolher os arquivos mínimos do Holding que representam a fundação técnica.
- [x] Registrar Holding, Clareia e FinKidz como projetos de referência.

## 2. Template executável

- [ ] Criar o template Django/DRF sem domínios do Holding.
- [ ] Criar o template Next.js/React/TypeScript.
- [ ] Conectar login, logout e usuário atual.
- [ ] Adicionar configuração de desenvolvimento e produção.
- [ ] Adicionar testes mínimos e CI proporcional.

## 3. Gerador

- [ ] Criar `create-app.sh` como orquestrador fino.
- [ ] Validar nome, slug e destino.
- [ ] Recusar sobrescrita de diretório existente.
- [ ] Copiar o template e substituir placeholders.
- [ ] Preparar ambientes e executar migrações.
- [ ] Exibir um resumo curto dos próximos comandos.

## 4. Validação

- [ ] Gerar um projeto descartável do zero.
- [ ] Validar autenticação ponta a ponta.
- [ ] Validar testes, lint, tipos e builds.
- [ ] Confirmar que o projeto gerado não depende do repositório do App Creator.

## 5. Migração de aplicações

- [ ] Adicionar o modo `migration`.
- [ ] Gerar inventário de funcionalidades do legado.
- [ ] Gerar mapa de modelos e dados.
- [ ] Gerar checklist de paridade funcional e visual.
- [ ] Manter a implementação do domínio fora do gerador.

## 6. Catálogo e inspeção de projetos

- [ ] Definir um manifesto opcional do App Creator dentro dos apps gerados.
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
