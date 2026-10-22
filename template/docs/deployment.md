# Deploy

Holding é o padrão oficial de commit, push e deploy. A produção usa Nginx na borda,
Next e Django em processos PM2 separados e API acessível somente pelo loopback.
Cada app tem checkout, portas, ambiente, site Nginx, domínio e certificado
próprios; o serviço systemd do PM2 é compartilhado pelo usuário `wtr`.

## Configuração do app

No servidor, copie `deploy.env.example` para `deploy.env` e informe um par de
portas ainda livre e a origem HTTPS pública. O arquivo não contém segredos, mas
é específico da máquina e não entra no Git. Prepare também `.venv`, `api/.env`
e `web/.env.local`. A API ligada apenas ao loopback deve definir
`DJANGO_SECURE_SSL_REDIRECT=false`; o HTTPS termina no Nginx.

Banco, ambientes, mídia e storage persistente ficam fora do Git. Migrações
evoluem o schema, mas não substituem importação ou transporte de dados. Defina
backup próprio para storage externo; com SQLite, o script cria uma cópia antes
das migrations.

## Sincronização do SQLite

Quando um SQLite local já validado precisar substituir o arquivo do servidor,
envie-o primeiro como `.incoming`, preserve o banco atual e faça a troca local
por `mv`. Substitua `<ssh-alias>` e `<app>` pelos valores da instalação:

```bash
scp api/db.sqlite3 <ssh-alias>:~/<app>/api/db.sqlite3.incoming
ssh <ssh-alias> 'mkdir -p ~/<app>/api/backups && cp -p ~/<app>/api/db.sqlite3 ~/<app>/api/backups/db-before-sync-$(date +%Y%m%d-%H%M%S).sqlite3 && mv ~/<app>/api/db.sqlite3.incoming ~/<app>/api/db.sqlite3 && chmod 600 ~/<app>/api/db.sqlite3'
```

O caminho ativo permanece intacto durante o upload; o backup permite rollback.

## Autorização e publicação

Commit, push, deploy e substituição do banco são ações distintas e dependem
do pedido do usuário. A `main` é a única branch de trabalho. `deploy-all`,
`deploy-api` e `deploy-web` são referências remotas que acionam o GitHub Actions,
não branches locais de trabalho. Não criar PR para um push comum:

```bash
git push origin main
git push origin main:deploy-all
./deploy-status all
```

Push em `main` executa CI, com jobs separados para backend e frontend. O CI
usa o lock do uv, gera tipos antes do TypeScript, usa `.next-codex` e mantém o
teste integrado de autenticação. Deploy é independente do CI e não aguarda
automaticamente a aprovação dos testes.

Troque `all` por `api` ou `web` para publicar somente uma parte. Consultar
status não dispara deploy. O script atualiza `main`, aplica migrations da API,
gera build da web, reinicia os processos correspondentes e verifica endpoints.
Build e start de produção devem usar o mesmo diretório, `.next` por padrão.

Todos os alvos compartilham uma fila de produção por app no Actions; um deploy
em execução não é cancelado por outro. O `flock` do script também impede
sobreposição com execuções manuais no servidor.

O build da web usa heap de 1024 MB por padrão, preservando as demais opções de
`NODE_OPTIONS`. Para outro limite, defina `DEPLOY_WEB_BUILD_HEAP_MB` em
`deploy.env`. Portas e domínio continuam sendo definidos por instalação; os
comandos Next respeitam `PORT` e usam 3000 quando ela não é fornecida.

Quando dependências mudarem, execute o workflow manual com instalação:

```bash
gh workflow run deploy.yml --ref main -f target=all -f install=true
```

No servidor, o equivalente é `./deploy all --install`. Deploy comum não
reinstala pacotes nem executa `collectstatic`.

O repositório usa os secrets `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`,
`DEPLOY_SSH_PORT` e `DEPLOY_SSH_KEY`. O Actions entra no servidor com chave
própria; o servidor baixa o repositório com outra Deploy Key, exclusiva e
somente leitura. Nunca coloque PAT em URL Git, ambiente, PM2 ou documentação.

## Confirmar publicação e retornar código

Espere `completed` e `success` no workflow, confira os processos PM2 e a saúde
da API na porta da instalação e valide os fluxos afetados no domínio público.
O health check não substitui a validação do app.

A revisão anterior fica em `.deploy/previous`. No servidor, para retornar
código sem atualizar do remoto:

```bash
git switch --detach "$(cat .deploy/previous)"
./deploy all --skip-pull
```

Se o schema mudou de modo incompatível, retornar somente o código não basta:
é necessário um banco compatível. Para retomar publicação normal, use
`git switch main`.

## Primeira publicação

Na máquina já preparada com Python, Node, PM2, Nginx e Certbot:

```bash
python3.13 -m venv .venv
cp deploy.env.example deploy.env
cp api/.env.example api/.env
cp web/.env.local.example web/.env.local
./deploy all --install
```

Configure o Nginx para a porta web definida, valide os endpoints internos,
aponte o DNS e emita o certificado. Execute `pm2 save`; não crie outro daemon
PM2 quando a máquina já possuir o serviço do usuário de aplicação.
