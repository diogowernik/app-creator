# Navegação responsiva

Validação local em 19 de outubro de 2026, com o template e um app independente
gerado do zero em diretório temporário. A mudança adota o comportamento da
Holding sem copiar seus links, dados ou dependências de domínio.

## Comportamento

`appConfig.navigation` fornece links, ícones opcionais e rotas ativas para
`AppNavigation`. O layout autenticado conecta a navegação ao shell existente.
A partir de `xl` (1536px), ela aparece no cabeçalho; abaixo disso, na lateral.
A abertura no desktop é persistida e a abertura no celular é temporária.
O botão Sair permanece no cabeçalho. Painéis personalizados continuam opcionais.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| Gerador | 9 testes passaram |
| Template frontend | 27 testes, lint e tipos passaram |
| Instalação limpa | uv/npm instalaram os locks e as migrações passaram |
| App gerado frontend | 27 testes, lint, tipos e build `.next-codex` passaram |
| App gerado backend | 10 testes e Ruff passaram |
| Autenticação real Next → Django | Login, cookie, proteção, invalidação e logout passaram com banco descartável |
| Navegador a 1600px | Menu com ícone no cabeçalho, sem botão lateral |
| Navegador a 1200px | Botão abre a lateral; abertura restaurada após recarregar |
| Navegador a 390px | Inicia fechado, abre sobreposição e fecha ao navegar |
| Console do navegador | Nenhum erro observado |

Os testes incluem links e ícones compartilhados, identificação de rota exata,
subrota e alias, preservação do rascunho durante mudança de largura, preferências
do desktop sem reabrir o menu no celular, cliques modificados, foco após Escape
e coexistência com painéis personalizados. Navegação cancelada e autenticação
mantêm seus testes existentes.

O aceite visual permanece com o usuário. Apps já gerados adotam as mudanças
explicitamente pelo [guia distribuído](../template/docs/frontend-guide.md).
