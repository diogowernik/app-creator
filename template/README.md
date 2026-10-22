# __APP_NAME__

__APP_DESCRIPTION__

Fundação Django/DRF + Next.js/React/TypeScript, com autenticação privada.

## Preparar

Instale Python e Node compatíveis com os manifestos e o gerenciador `uv`.
A partir da raiz:

```bash
bash scripts/setup.sh
./.venv/bin/python api/manage.py createsuperuser
```

O gerador já executa o setup por padrão. Use o comando acima para retomar a
preparação ou se gerou com `--skip-setup`. O setup cria os ambientes a partir
dos exemplos somente quando ausentes, instala os locks e migra o banco local.
Não cria credenciais. Não execute preparação de desenvolvimento sobre um
banco de produção.

## Executar

Em terminais separados, a partir da raiz:

```bash
./.venv/bin/python api/manage.py runserver 127.0.0.1:8000
```

```bash
cd web
npm run dev -- --port 3000
```

Acesse `http://localhost:3000`. Ao alterar portas, ajuste `DJANGO_API_URL` e
origens do ambiente. O usuário criado pelo Django autentica no frontend.

## Personalizar a barra

A logo Wtree branca é comum aos apps. Nome, navegação e identidade configurável
ficam em `web/src/config/app.ts`; controles e superfícies seguem o tema MUI.
Os mesmos links e ícones aparecem no cabeçalho em telas largas e na lateral
recolhível nas menores. O layout autenticado já faz essa integração.
Sair acompanha o menu. Em `appConfig.shell`, é possível optar pela lateral em
qualquer largura e habilitar o painel direito; o padrão é responsivo, com o
painel direito desligado e laterais inicialmente recolhidas.
Consulte [docs/frontend-guide.md](docs/frontend-guide.md) para alterar padrões
e acrescentar painéis opcionais sem copiar estilos de uma tela para outra.

## Validar

```bash
(cd api && DJANGO_ENV=development ../.venv/bin/python manage.py test)
./.venv/bin/ruff check api
cd web
npm run lint
NEXT_DIST_DIR=.next-codex npm run typecheck
npm test
NEXT_DIST_DIR=.next-codex npm run build
```

Da raiz, após o build, teste a integração real entre Next e Django em processos
temporários, banco descartável e portas livres:

```bash
./.venv/bin/python scripts/test_auth.py
```

Esse teste verifica login, cookie, página protegida, sessão inválida e logout
sem usar credenciais reais ou alterar o banco de desenvolvimento.

## Produção

Configure `DJANGO_ENV=production`, `DJANGO_DEBUG=false`, `DJANGO_SECRET_KEY`
aleatória com pelo menos 50 caracteres e `DJANGO_ALLOWED_HOSTS` explícitos.
Use `DATABASE_URL` conforme o destino, HTTPS e backup adequado. Next exige
`DJANGO_API_URL` e `APP_ORIGIN` pública. Não versione segredos.

O template inclui deploy seletivo de API e web pelo GitHub Actions, no padrão
de Holding e Logos. Reserve domínio e portas próprios antes da primeira
publicação e siga o [guia de deploy](docs/deployment.md). Consulte também a
[arquitetura](docs/architecture.md).

A instalação como app, retomada por conta e desbloqueio opcional estão no
[guia de PWA](docs/pwa.md).
