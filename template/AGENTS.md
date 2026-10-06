# Orientações do projeto

- Django é dono de dados, autorização e regras; Next é interface e fronteira HTTP.
- Browser chama rotas internas Next. Tokens ficam somente em cookie HttpOnly.
- Todo endpoint privado exige autenticação e queryset filtrado pelo proprietário.
- Páginas privadas chamam `requireUser()` antes de carregar conteúdo; não confie apenas no layout.
- Use `.venv/` da raiz; ambientes ficam em `api/.env` e `web/.env.local`.
- Preserve o teste de autenticação ponta a ponta em `scripts/test_auth.py`.
- Antes de alterar Next, leia os guias relevantes em `web/node_modules/next/dist/docs/`.
- Valide builds com `NEXT_DIST_DIR=.next-codex` para preservar o servidor dev.
- Leia `docs/architecture.md`; acrescente documentação de produto antes do domínio.
- Não copie dados, segredos ou dependências de projetos de referência.
