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
