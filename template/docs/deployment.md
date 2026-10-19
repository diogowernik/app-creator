# Deploy

A produção segue o padrão compartilhado por Holding e Logos: Nginx na borda,
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

Commit, push e deploy são ações distintas e só acontecem quando pedidos. A
`main` é a única branch de trabalho. `deploy-all`, `deploy-api` e `deploy-web`
são apenas referências remotas que acionam o GitHub Actions:

```bash
git push origin main
git push origin main:deploy-all
./deploy-status all
```

Troque `all` por `api` ou `web` para publicar somente uma parte. Mudança de
dependência exige execução manual do workflow com `install=true`; deploy comum
não reinstala pacotes nem executa `collectstatic`.

O repositório usa os secrets `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`,
`DEPLOY_SSH_PORT` e `DEPLOY_SSH_KEY`. O Actions entra no servidor com chave
própria; o servidor baixa o repositório com outra Deploy Key, exclusiva e
somente leitura. Nunca coloque PAT em URL Git, ambiente, PM2 ou documentação.

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
