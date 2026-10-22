# Instalação e desbloqueio do dispositivo

O template gera um PWA instalável, com abertura em `/pwa` e identidade `/`.
O identificador deve permanecer estável ao mudar o destino inicial. Os ícones
neutros vêm da marca Wtree já presente no template; substitua os quatro PNGs
em `web/public/icons/` pela marca do app, mantendo dimensões e área segura do
maskable. Nome e cor do manifesto usam `src/config/app.ts`.

A ação Instalar acompanha a navegação: cabeçalho em telas largas, lateral nas
demais. O convite nativo só abre por ação do usuário. No iPhone/iPad há guia
com ícone; a ação fica oculta no app instalado. A instalação depende do suporte
do navegador e de HTTPS ou localhost.

## Retomada por conta

`appConfig.pwa.resumePaths` começa com `["/"]`, pois o starter não possui
páginas de produto. Acrescente caminhos exatos existentes ao criar páginas.
Uma lista vazia mantém toda abertura no início. Caminhos não cadastrados,
login, APIs, parâmetros, fragmentos e URLs externas nunca são lembrados.
O dispositivo guarda somente a rota, em chave por conta e app; não guarda
formulários ou dados de domínio.

`/pwa` exige sessão. Sem ela, `/login?next=/pwa` devolve o usuário à entrada
depois do login. A entrada comum `/` e links diretos preservam seu destino.
Falhas de rede oferecem nova tentativa, sem apagar a rota lembrada.

O proxy `/api/pwa/resume` valida origem, sessão e chama `src/server/pwa.ts`
para validar o destino. O default permite apenas as páginas estáticas de
`resumePaths`. Para recursos dinâmicos, estenda o matcher compartilhado em
`components/pwa/navigation.ts` e a política em `server/pwa.ts`: consulte Django
para conferir proprietário e existência antes de devolver a rota. Não libere
prefixos ou caminhos arbitrários sem autorização no backend. Um recurso
excluído ou inacessível deve retornar `/`.

## Cache e atualizações

O worker é registrado somente em produção e contexto seguro. Guarda apenas
manifesto e ícones públicos explicitamente listados. Não há páginas, sessões,
respostas privadas ou operações offline no cache. Falha no armazenamento não
bloqueia a resposta de rede nem a instalação do worker.

Atualizações não forçam recarga de tela. Cada versão limpa somente caches
anteriores com o prefixo do próprio app; incremente a versão do cache ao trocar
recursos. Build e start devem usar o mesmo `NEXT_DIST_DIR`.

## Desbloqueio opcional

`appConfig.deviceLock.available` começa em `true`: disponibiliza a opção, mas
não a ativa. Cada usuário escolhe “Exigir desbloqueio neste dispositivo”, que
começa desativado. Use `available: false` para remover essa capacidade da
interface e do proxy do app. O serviço Django continua privado.

O sistema operacional decide entre Face ID, Touch ID e código do aparelho.
A senha da conta permite recuperar o acesso e desativar a opção. Cancelamento
ou falha mantém a tela bloqueada. O bloqueio funciona no navegador e no PWA;
biometria real precisa de validação no aparelho.

A preferência é um cookie HttpOnly por app e conta. Django verifica WebAuthn
em `/api/device-security/`, passando pelo proxy `/api/auth/device-lock/`.
Origem e vínculo de dispositivo vêm do pedido validado e do cookie, não do
JSON do browser. Desafios duram dois minutos, são de uso único e vinculados à
conta, token, origem e finalidade. A API limita tentativas. Guarda somente
identificadores, chaves públicas e contadores, sem dados biométricos.

A interface começa bloqueada quando a preferência está ativa. Ao ocultar a
página ou alternar de app, bloqueia novamente sem encerrar a sessão. Depois
do primeiro desbloqueio, componentes e portais ficam montados e ocultos,
preservando rascunhos. É privacidade visual sobre a sessão existente, não
nova autorização das APIs nem criptografia de dados. A captura de prévia do
sistema operacional não é garantidamente ocultada.

Configure `WEBAUTHN_ALLOWED_ORIGINS` na API com as origens exatas autorizadas;
o default local é `http://localhost:3000`. Em produção, informe a origem HTTPS
do app. Credenciais são próprias da origem: cadastro local não habilita a
produção. Ao mudar portas de desenvolvimento, ajuste essa variável também.

A primeira publicação requer instalação das dependências de API e web e
migrations de `device_security`; use o alvo `all` com `install=true` no fluxo
[de deploy](deployment.md).
