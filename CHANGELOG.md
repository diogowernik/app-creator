# Changelog

## 0.2.0 — implementação local em 7 de outubro de 2026

A fundação visual passa a MUI + Emotion + Geist, com identidade centralizada,
Card/Paper compactos, ações à direita e erro laranja. O shell aceita painéis
opcionais à esquerda/direita, com Drawer responsivo e conteúdo central estável.
Testes e builds locais passaram; aceite visual e validação complementar
permanecem pendentes, registrados em [frontend-validation.md](docs/frontend-validation.md).
Não houve publicação de release.

Login, cabeçalho, estados e tela inicial usam a mesma base. O guia acompanha
cada app gerado. Não há componentes CSS antigos mantidos em paralelo.

Apps existentes não são alterados automaticamente. Para adotar esta versão,
integre dependências/locks, tema, providers, layout e composições, migre seus
consumidores e remova estilos substituídos. Preserve domínio e fronteiras de
autenticação; siga `template/docs/frontend-guide.md`. A integração deve ser
validada no próprio app, incluindo autenticação e rascunhos quando existirem.

## 0.1.0

Gerador independente Django/Next, autenticação BFF, locks nativos, proteção de
destino e documentação de migração.
