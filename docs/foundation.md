# Fundação adotada — primeira rodada

Data: 6 de outubro de 2026.

## Recorte do Holding

Preservados e adaptados:

- Django/DRF e usuário padrão com autenticação Djoser/Token;
- navegador → rotas internas Next → Django;
- cookie HttpOnly, login, logout, sessão e proteção de páginas;
- configuração por ambiente, SQLite local e opção PostgreSQL;
- separação de rotas, componentes, cliente HTTP e adaptador de servidor;
- testes e CI executados sobre uma aplicação gerada.

O starter mantém os domínios financeiros, banco e ambientes do Holding fora do
template. A interface usa controles nativos e tokens CSS mínimos. A arquitetura
é a referência principal; o visual e a navegação de cada produto ficam livres.

## Adaptações concretas

- Variáveis do processo têm precedência sobre `.env`.
- Desenvolvimento precisa ser explícito; produção exige configuração própria.
- Health check informa apenas disponibilidade e nome do serviço.
- Cookies são específicos de cada app para coexistirem no mesmo host.
- Cliente suporta JSON, FormData, respostas vazias e downloads.
- Sessão inválida é diferente de API indisponível; falhas temporárias não apagam
  o cookie de autenticação.
- Origem de escritas é validada; a origem pública de produção é explícita.
- Dependências são instaladas pelos locks nativos; versões não ficam no gerador.
- A preparação não cria usuários ou segredos e não realiza auditoria de pacotes.

A geração agora prepara o app por padrão: cria `.env` a partir dos exemplos
somente quando ausentes, instala dependências e migra o banco local.
`--skip-setup` permite gerar apenas arquivos; o setup também pode ser executado
diretamente em um app existente.

## Entrega

`create-app.sh` é uma entrada curta para o gerador Python. A aplicação real está
em `template/`. O modo `migration` inclui inventário, mapa de dados e checklist
de jornadas, admitindo migração seletiva e redesenho de UX.

O gerador registra versão, data e modo em `.app-creator.json`. Não sobrescreve
destinos nem modifica apps já criados. O template gerado funciona sem consultar
o repositório do starter.

## Verificação proporcional

A verificação da rodada cobre geração limpa, proteção do destino, autenticação,
configuração, cliente HTTP, formulário de login e build. O teste de integração
inicia Next e Django reais com banco temporário, sem credenciais pessoais.

Verificado localmente em aplicação gerada com `--prepare` e locks congelados:
6 testes do gerador, 10 testes Django, 12 testes frontend, lint, tipos e build
de produção, além do fluxo real de login/sessão/proteção/logout. A validação
local usou Python 3.14 e Node 24; CI está configurado e ainda não foi executado
remotamente nesta rodada.

Auditoria contínua de dependências, catálogo e painel não são parte desta rodada.
Storage privado e processamento de EPUB pertencem ao domínio do Logos, não à
fundação comum.

## Referências técnicas consultadas

- [Django: versões suportadas](https://www.djangoproject.com/download/).
- [Django: compatibilidade com Python](https://docs.djangoproject.com/en/5.2/faq/install/).
- [Next: instalação](https://nextjs.org/docs/app/getting-started/installation).
- Guias locais de Route Handlers, cookies e Server/Client Components da versão
  instalada no Holding.

## Erros de validação HTTP

O cliente entende `detail`, `non_field_errors` e erros por campo do Django REST,
inclusive estruturas aninhadas. `ApiError` mantém o status e `fieldErrors`; sua
mensagem já pode ser exibida diretamente. O terceiro argumento de `apiRequest`
ou `downloadRequest` permite fornecer rótulos legíveis dos campos. Esses rótulos
pertencem ao produto, não ao starter. Respostas vazias ou não JSON usam uma
mensagem genérica. Não foi adicionada nenhuma dependência.

## Barra comum dos apps

O template usa a logo Wtree branca, barra azul de largura total e navegação
configurável. A cor vem de `--app-header-background` em `web/src/app/globals.css`;
nome e links vêm de `web/src/config/app.ts`. Cada app adapta a cor, preservando
a mesma identidade: Logos azul e Holding verde. Sem novas dependências.
