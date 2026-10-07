# Planejamento da fundação visual do template

Data: 7 de outubro de 2026. Estado: planejado; implementação pendente.

## Origem e sequência

O template receberá a base visual consolidada primeiro em Logos, na sequência
`Holding -> Logos -> App Creator`. A Holding fornece Card, Paper, cabeçalhos,
escala tipográfica, ações compactas e o guia de interface. Logos acrescenta
os painéis laterais recolhíveis e a composição de escrita inspirada na
referência visual GPT fornecida pelo usuário.

Decisão confirmada: **MUI + Geist** como base da família. O objetivo é reduzir
manutenção recorrente dos controles e compartilhar uma fundação que também
atenda apps futuros, como Wtree, hoje no monorepo. Seu possível desenvolvimento
como DEX/CEX pertence a um planejamento de produto próprio.

O planejamento detalhado de Logos está em seu repositório, no documento
`docs/frontend-layout-plan.md`. Este documento define somente a transferência
para o starter e complementa a [arquitetura](architecture.md). A fundação atual
permanece a descrita em [foundation.md](foundation.md) até a implementação.

## Recorte adotado

Adotar MUI sobre React/TypeScript, com o tema, as composições e a integração
Next reaproveitados da Holding e consolidados em Logos. Usar os componentes
da biblioteca diretamente e criar componentes próprios para composições reais.
Não recriar uma biblioteca de Button/TextField/Dialog em CSS nem envolver
todos os componentes MUI em wrappers que apenas renomeiam a API.

O template e o frontend pessoal de Logos podem ser refatorados diretamente.
A entrega remove a base visual substituída, sem adaptadores de legado ou flags
para manter duas implementações. Apps gerados anteriormente continuam
independentes e só serão modificados por uma adoção explícita.

O template terá:

- tema MUI com escala de fontes, espaçamento, bordas, sombras e superfícies;
- identidade neutra configurável em um ponto, incluindo derivados de hover,
  foco, seleção e contraste;
- estados semânticos compartilhados, com erro em laranja;
- Card/Paper, cabeçalho/corpo/rodapé, agrupamento de ações e botões por ícone;
- controles MUI de formulário, menus e navegação uniformes;
- shell com slots opcionais à esquerda e à direita, além da área central;
- controles de recolher e regras responsivas que preservam a área de trabalho;
- composição ampla para ferramentas e largura de leitura limitada quando útil;
- guia incluído nos apps gerados, indicando onde alterar cada padrão.

Painéis são opcionais. Um app simples pode começar só com cabeçalho e conteúdo;
a capacidade de adicionar painéis já estará implementada e documentada. Quando
um painel estiver configurado, poder abri-lo vazio não depende de uma feature
editorial. Os itens da navegação e o conteúdo auxiliar são fornecidos pelo app.

Projects, Collections, recentes, guardas de rascunho, EPUB, árvore de capítulos,
APIs editoriais e controles financeiros permanecem em seus produtos.

## Arquivos previstos

| Destino no template | Responsabilidade |
| --- | --- |
| `web/src/theme/` | Tema MUI comum, variantes e identidade configurável |
| `web/src/components/AppProviders.tsx` | ThemeProvider e CssBaseline |
| `web/src/components/ui/` | Composições comprovadas sobre controles MUI |
| `web/src/components/shell/` | Layout, estado dos painéis, host e política responsiva |
| `web/src/components/AppHeader.tsx` | Compor branding, navegação configurada e sessão |
| `web/src/config/app.ts` | Continuar configurando nome e navegação |
| `web/src/app/layout.tsx`, `globals.css` | Geist, cache Next/MUI, camadas CSS e regras globais mínimas |
| `web/package.json`, lockfile | MUI/Emotion/adaptador compatíveis com Next e React |
| `web/src/app/(app)/layout.tsx` | Proteger sessão e compor o shell |
| `docs/frontend-ui-guide.md` | Guia portátil da base entregue |
| `docs/architecture.md`, `AGENTS.md` | Apontar ao guia e às responsabilidades visuais |
| `web/tests/` | Comportamento dos painéis e regressão da autenticação |

Os nomes finais seguem a implementação consolidada em Logos. O guia do template
descreve seus próprios arquivos e não exige consultar um checkout de Logos ou
Holding. Regras editoriais são retiradas do guia transplantado.

`create-app.sh` e o serviço de cópia continuam pequenos; os arquivos pertencem
a `template/`. Não acrescentar montagem de componentes no gerador nem cópia
dinâmica de outros repositórios durante a geração.

## Sequência e validação

1. Concluir e validar a fundação global de Logos, incluindo as duas composições.
2. Transferir arquivos genéricos e retirar imports/classes do domínio.
3. Incluir dependências compatíveis nos manifestos/locks, configurar providers
   e adaptar cabeçalho, login e layout autenticado ao tema e aos controles MUI.
4. Incluir o guia e exemplos curtos de painel configurado na documentação;
   a aplicação inicial continua simples.
5. Gerar app descartável com a CLI existente e conferir placeholders, imports,
   fontes, estilos do servidor, hidratação e funcionamento independente dos
   projetos de referência.
6. Executar testes do gerador e frontend, lint, tipos, build isolado e teste real
   de autenticação, seguindo os comandos do template. Validar visualmente o app
   simples e uma composição temporária com os dois painéis, inclusive no mobile.
7. Registrar versão e instruções para apps existentes conforme
   [versioning.md](versioning.md), sem publicar ou atualizar outros apps
   automaticamente.

A troca de identidade precisa refletir-se em cabeçalho, links, botões, foco e
seleção sem editar componentes. Painéis vazios, recolhidos e sobrepostos devem
funcionar com teclado. Abrir/recolher não pode remontar o conteúdo de trabalho.

O gerador já cria uma cópia independente: alterar o template não atualiza Logos
nem outros apps gerados. A futura adoção por projetos existentes será explícita.
