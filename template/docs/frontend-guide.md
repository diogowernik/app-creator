# Guia da interface

A base é MUI 9 + Emotion + Geist, integrada ao App Router do Next. Os controles
são componentes MUI usados diretamente. As composições locais existem para
agrupar responsabilidades reais, sem recriar uma biblioteca de controles.

A identidade inicial deve ser azul ou verde, configurada em `config/app.ts`;
cinza como identidade principal foi rejeitado. Superfícies neutras permanecem.
O starter começa azul; mudar a identidade na configuração, sem sobrescrever
cores em cada página.

## Onde mudar cada padrão

- `web/src/config/app.ts`: nome, navegação, opções do shell e identidade do app. `primary`
  define os controles, `header`/`headerText` a barra e `cardTitle` os títulos.
- `web/src/theme/index.ts`: escala de fontes, superfícies neutras, raio e
  larguras dos painéis. Erro usa a paleta laranja, preservando contraste.
- `web/src/theme/components.ts`: defaults e overrides de Card, Paper,
  CardHeader, CardActions, botões, campos, listas, menus, diálogos e tabelas.
- `web/src/components/AppProviders.tsx`: ThemeProvider e CssBaseline.
- `web/src/app/layout.tsx`: Geist/Geist Mono e cache SSR do MUI para Next 16.
- `web/src/components/shell/AppShell.tsx`: painéis opcionais e conteúdo central.
- `web/src/components/ui/`: agrupamento das ações, ícones com tooltip,
  seção de dados e menu contextual.

Uma mudança recorrente deve acontecer no tema ou na composição responsável.
Não usar `sx`, `style` ou CSS local para inventar aparência por página.
Geometria funcional pertence às composições compartilhadas em `theme/`;
cores, fontes e métricas de controles pertencem ao tema.
Uma exceção em `styled` também está fora do padrão e exige especificação
explícita do usuário. A composição pode variar conforme a tarefa, sem exigir
abas, painéis ou caixas aninhadas em todas as páginas.

## Cards e leitura

Use `CardHeader` para título e ações à direita, `CardContent` para conteúdo e
`CardActions` quando houver rodapé de ações. O header usa 10px × 16px,
título de 18px e altura mínima de 52px; ações podem quebrar linha em telas
estreitas. Botões comuns são compactos, sem caixa alta. Copiar e salvar usam
`CompactActionButton` de 36px, com nome acessível e tooltip.

`CardSection` mantém o CardHeader padrão e aceita `expanded`/`onToggle` para
recolher sem desmontar o conteúdo. `useStoredToggle(nome)` lembra a escolha
no navegador; use nomes estáveis, incluindo o identificador do recurso quando
a preferência for específica. `titleControls` permite seletores junto ao título
e `actions` recebe as ações à direita, sem redesenhar o cabeçalho.
Entre cards relacionados, partir de intervalos compactos na escala do tema;
evitar somar margem do card e gap do contêiner. Mais respiro deve ter uma função,
como separar áreas distintas, em vez de ser um ajuste visual isolado.
`components/ui/CardLayout.tsx` fornece `CardGrid` com intervalo compartilhado
de 16px e duas colunas responsivas; `CardGridFullWidth` ocupa a linha inteira.
Cards não acrescentam margem própria. `PageContent` centraliza o conteúdo
na largura confortável do tema; `wide` libera a largura para tarefas que
precisam dela. A composição inicial usa essa base.

Declare a semântica do título: `slotProps={{ title: { component: "h2",
variant: "h6" } }}`; use `h1` para o título principal e `h3` para cartões
subordinados. Aparência e nível do heading são decisões separadas.

`DataSection` compõe Paper delineado, header e conteúdo. Conteúdo de escrita
ou leitura usa superfície branca, largura confortável e tipografia de 16px;
a navegação usa 16px e peso normal. Não transforme a área de escrita em uma
sucessão de cartões decorativos.

## Painéis

O layout autenticado já conecta a navegação principal ao shell:

```tsx
<AppShell
  header={<AppHeader />}
  navigation={<AppNavigation variant="sidebar" />}
>
  {children}
</AppShell>
```

`appConfig.navigation` é a fonte única de links nos dois formatos. Cada item
aceita `label`, `href`, `icon` opcional (componente React) e `activePaths`
opcional para outras rotas da mesma área. Rotas exatas e subrotas são marcadas
com `aria-current="page"`; `/projects-other` não ativa `/projects`.

A partir do breakpoint `xl` do tema (1536px), `AppHeader` mostra os links com
ícones. Abaixo disso, o botão de navegação abre a lateral, inicialmente fechada.
No desktop a lateral ocupa uma coluna e lembra a abertura; em mobile começa
fechada, sobrepõe o conteúdo e fecha no `onNavigate` do Next Link. Cliques para
abrir outra aba não fecham a navegação. Sair aparece no cabeçalho quando o menu
está nele e no rodapé da lateral quando a navegação está na lateral.

### Defaults e opções do template

As escolhas iniciais ficam explícitas em `appConfig.shell`:

```ts
shell: {
  navigation: { mode: "responsive", defaultOpen: false },
  rightPanel: { enabled: false, defaultOpen: false, label: "Preview" },
}
```

| Opção | Padrão | Alternativa |
| --- | --- | --- |
| `navigation.mode` | `"responsive"`: menu no cabeçalho em telas largas; botão lateral nas menores | `"sidebar"`: menu lateral e seu botão disponíveis em qualquer largura |
| `navigation.defaultOpen` | `false`: lateral inicialmente recolhida | `true`: iniciar aberta no desktop quando houver lateral |
| `rightPanel.enabled` | `false`: sem painel nem ícone direito | `true`: disponibilizar um painel vazio para conteúdo contextual |
| `rightPanel.defaultOpen` | `false`: painel habilitado começa fechado | `true`: iniciar o painel habilitado aberto |

Manter o botão disponível em todas as larguras e iniciar o painel aberto são
decisões independentes. Preferências já salvas prevalecem sobre `defaultOpen`.
A navegação no celular sempre inicia fechada. O app gerado mantém o modo
responsivo e o painel direito desligado, como ponto de partida simples.

`AppShell` também aceita `navigationMode`, `leftDefaultOpen`, `rightDefaultOpen`
e `rightLabel` para sobrescrever essas escolhas em uma composição específica.
Fornecer `left` acrescenta um painel personalizado, inicialmente recolhido;
fornecer `right` (inclusive `null`) habilita explicitamente o direito naquela
composição, mesmo com `rightPanel.enabled: false` na configuração global.

`navigation` fornece o menu responsivo; `left` acrescenta conteúdo próprio do
produto à lateral, inclusive quando o menu principal está no cabeçalho. Ambos
usam o mesmo controle de recolhimento. Omitir `navigation` permite manter uma
composição personalizada, com o menu principal no cabeçalho. Apps existentes
podem adotar o comportamento adicionando `AppNavigation` ao layout autenticado,
junto das atualizações de `AppShell`, `AppHeader`, configuração, ícones e tema.

```tsx
<AppShell
  header={<AppHeader />}
  left={<Navigation />}
  right={null}
  leftLabel="Navegação"
  rightLabel="Preview"
>
  {children}
</AppShell>
```

Omitir `left` e `navigation` elimina o painel esquerdo e seu controle;
omitir `right` deixa a configuração global decidir se o direito existe.
`right={null}` configura um painel vazio que pode ser aberto. Um app simples
começa com cabeçalho, conteúdo e navegação responsiva; painéis de produto são
capacidades opcionais.

`useShell()` expõe estado e controles sincronizados. A escolha de abrir ou
fechar a lateral no desktop é persistida no navegador, isolada pelo
`storagePrefix` do app. Abrir ou fechar a navegação em mobile não altera essa
preferência. `closeMobileNavigation()` fecha apenas a sobreposição esquerda.
`setRightContext({ key, defaultOpen })` permite uma preferência por área;
restaure `null` ao sair dela. `rightHost` permite que
uma feature publique conteúdo contextual com `createPortal`, removido quando
a feature desmonta. O conteúdo central permanece na mesma posição na árvore
React ao alternar painéis e mudar de viewport; rascunhos não são remontados.
O host do painel pode ser refeito ao trocar entre coluna e sobreposição,
e o portal acompanha o novo host sem transferir estado do editor.

A lateral esquerda mede 260px e a direita 360px. Desktop começa em 761px;
o direito, quando habilitado e aberto, ocupa uma coluna a partir de 1100px;
abaixo disso usa sobreposição para preservar a área central.
Em mobile, Drawer temporário cuida de backdrop, Escape, foco e retorno ao controle; um painel abre por vez.
Links cuja navegação foi cancelada não fecham a lateral. O menu e o preview
rolam independentemente da área central. Resize por arrastar é evolução futura.

## Feedback

`AppProviders` inclui `FeedbackProvider`. Use `useFeedback().notify(mensagem,
severidade)` para confirmações temporárias, como copiar ou salvar. A próxima
mensagem substitui a anterior; erros ficam até fechar. Diagnósticos que exigem
consulta ou cópia pertencem ao recurso, sem ocupar a tela quando não existem.

## CSS e fronteiras

`globals.css` declara a ordem de layers do MUI. CSS adicional é restrito a
conteúdo especializado, como Markdown. Não aplicar estilos globais a `button`,
`input`, `h1` ou `p`; a aparência da interface pertence ao tema MUI.
Geist Mono é reservado para código. Se o app renderizar Markdown ou outro
conteúdo editorial, isole seu estilo da tipografia dos títulos da interface.

Autenticação continua no servidor. Páginas privadas mantêm `requireUser()`;
a camada visual cliente não recebe tokens. Não acrescentar React Query,
endpoints ou modelos apenas para aproveitar o layout de outro app.

## Validação

Execute lint, tipos, testes e build com `NEXT_DIST_DIR=.next-codex`. Preserve
os testes de autenticação em `scripts/test_auth.py`. Mudanças no shell exigem
checar rascunho, navegação cancelada, foco e viewport; mudanças no template
exigem gerar um app limpo e validar sua independência.

## Instalação e bloqueio

Instalar acompanha a posição da navegação. O guia usa os controles MUI padrão
e um ícone público. O desbloqueio usa diálogo fullscreen; `theme/device-lock.ts`
oculta a interface e os portais sem desmontar editores. Esses estilos são
geometria funcional de privacidade, sem versões próprias dos controles.
Os defaults e limites estão no [guia de PWA](pwa.md).
