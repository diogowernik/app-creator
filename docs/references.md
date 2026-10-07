# Projetos de referência

O starter não será uma cópia integral de nenhum projeto. As referências servem para identificar soluções transversais já comprovadas e também diferenças que a fundação precisa respeitar.

## Holding

Referência principal por representar a base mais moderna e a experiência recente de reconstrução do sistema.

Observar especialmente:

- Django/DRF com configuração por ambiente;
- Next.js com React, TypeScript e rotas internas para a API;
- autenticação conectada entre frontend e backend;
- testes e CI proporcionais;
- separação entre fundação compartilhada e domínio financeiro;
- sistema visual baseado em componentes e tokens, sem estilos locais repetidos.

Não importar modelos financeiros, fluxos de bancos, investimentos ou migrações do legado.

## Logos — composição de trabalho

Referência adicionada na rodada de planejamento de 7 de outubro de 2026.
A consolidação visual será validada em Logos antes da transferência ao template.

Observar especialmente:

- painéis esquerdo e direito recolhíveis, independentes de seu conteúdo;
- navegação com tamanho uniforme, peso moderado e cores neutras;
- área central de trabalho confortável e ações discretas;
- reaproveitamento dos cards, tema e cabeçalhos MUI da Holding;
- remoção de definições locais ao migrar para componentes comuns.

O [plano visual](frontend-foundation-plan.md) delimita a transferência. Projects,
Collections, EPUB, conteúdo de menus e operações editoriais ficam em Logos.

## Wtree — futuro consumidor

O usuário indicou Wtree, atualmente no monorepo, como futuro app independente
da mesma família e com possível evolução para DEX/CEX. Isso reforça a escolha
de MUI + Geist, tema configurável e política comum de versões. Seu código não
foi auditado nesta rodada. Recursos de exchange serão planejados no produto,
sem inclusão antecipada no template.

## Clareia

Referência de arquitetura disciplinada e documentação orientada à execução.

Observar especialmente:

- Django como fonte de autenticação, autorização e dados;
- Next como interface e adaptador HTTP, sem duplicar regras do backend;
- fronteiras claras entre páginas, componentes, hooks, chamadas HTTP e configuração;
- preferência por DRY e KISS antes de abstrações preventivas;
- documentação curta que aponta somente para o contexto necessário;
- verificação proporcional ao tipo de alteração.

O uso de outra organização do Next ou de outro sistema visual deve ser avaliado como alternativa, não copiado automaticamente.

## FinKidz

Referência de uma aplicação com backend, web, mobile e pipeline de qualidade mais amplo.

Observar especialmente:

- convivência de Django, Next.js e Flutter no mesmo produto;
- autenticação consumida por clientes diferentes;
- CI separado por componente;
- validação de schema da API;
- testes unitários, integração e ponta a ponta;
- necessidades de versionamento que vão além de um único frontend web.

Flutter não entra no primeiro template. A experiência do FinKidz orienta o desenho extensível do futuro catálogo e de seus adaptadores.

## Critério de adoção

Uma solução dessas referências entra no starter apenas quando:

1. resolve uma necessidade transversal de aplicações novas;
2. não carrega regra de produto específica;
3. reduz trabalho recorrente sem criar manutenção desproporcional;
4. pode ser validada em um projeto gerado do zero;
5. possui uma fonte clara de configuração e versão.

Em caso de conflito, não se escolhe automaticamente o projeto mais novo. A decisão considera simplicidade, segurança, manutenção e compatibilidade com a proposta do starter.
