# Arquitetura do starter

## Separação de responsabilidades

O App Creator tem duas partes:

- **orquestrador:** valida argumentos, copia o template, substitui identificadores e executa a preparação inicial;
- **template:** contém a aplicação real, legível e testável como qualquer outro projeto.

O shell não deve produzir arquivos grandes por `heredoc`, conhecer detalhes de telas ou duplicar configurações de dependências. Isso mantém o gerador simples e permite melhorar a fundação editando arquivos normais.

## Aplicação gerada

```text
<app>/
├── api/
│   ├── config/
│   ├── manage.py
│   ├── pyproject.toml
│   └── .env.example
├── web/
│   ├── src/app/
│   ├── src/components/
│   ├── src/api/
│   ├── src/server/
│   ├── package.json
│   └── .env.local.example
├── docs/
├── .github/workflows/ci.yml
├── .github/workflows/deploy.yml
├── scripts/                # preparação e teste de integração
├── deploy                  # publicação seletiva no servidor
├── deploy-status           # último workflow por alvo
├── deploy.env.example      # domínio e portas da instalação
├── AGENTS.md
└── README.md
```

## Backend

A base do backend será Django com Django REST Framework. Ela deve incluir somente capacidades transversais:

- configuração por ambiente;
- usuário e autenticação;
- endpoint de sessão/usuário atual;
- health check;
- CORS e hosts configuráveis;
- banco local simples e suporte configurável a PostgreSQL;
- testes da autenticação e da configuração crítica.

Regras financeiras, modelos do Holding e integrações específicas não pertencem ao starter.

## Frontend

A base do frontend usa Next.js, React e TypeScript. Ela inclui:

- login, logout e recuperação da sessão;
- comunicação com Django por rotas internas do Next;
- cookie de sessão seguro e inacessível ao JavaScript do navegador;
- proteção das rotas autenticadas;
- cliente HTTP centralizado;
- providers essenciais;
- tema e componentes estruturais mínimos;
- testes do fluxo de autenticação.

A fundação visual é pequena. Ela deve oferecer tokens e componentes básicos sem impor páginas ou decisões de produto do Holding.

A versão 0.2.0 substituiu os tokens CSS e controles nativos da primeira
fundação por MUI + Emotion + Geist. O usuário
padrão do Django e os endpoints Djoser dispensam um app `users` vazio.

### Fundação visual implementada

Implementada em 7 de outubro de 2026, com aceite visual e validação
complementar pendentes: base consolidada de Logos na sequência `Holding -> Logos -> App Creator`. Manter
React/TypeScript e adotar MUI + Geist; reutilizar tema e composições da Holding,
parametrizar identidade neutra e incluir navegação uniforme e shell com painéis
recolhíveis opcionais. Usar controles MUI diretamente, removendo a base visual
superada. Conteúdo e operações editoriais permanecem em Logos.

O uso pessoal permite uma refatoração direta, sem infraestrutura de transição
entre dois sistemas visuais. Outros apps da família, incluindo Wtree como
futuro consumidor, receberão a mesma fundação por adoção explícita. Sua possível
evolução para DEX/CEX é um domínio próprio, não uma exigência do starter.

O [plano da fundação visual](frontend-foundation-plan.md) define arquivos,
limites e validação em app gerado. O [registro da rodada](frontend-validation.md)
separa os resultados observados das verificações pendentes. O template inclui um [guia próprio](../template/docs/frontend-guide.md), sem
dependência de checkout ou runtime dos projetos de referência.

## Autenticação

O navegador conversa com o Next.js, e o Next.js conversa com o Django. Credenciais do backend não devem ser expostas diretamente ao código cliente.

```text
Navegador -> Next.js -> Django REST Framework
             cookie     autenticação da API
```

O contrato mínimo cobre:

- entrar;
- sair;
- obter usuário atual;
- tratar sessão expirada;
- impedir acesso anônimo a páginas privadas.

## Configuração do gerador

Identificadores substituíveis devem usar placeholders explícitos, por exemplo:

- `__APP_NAME__`: nome legível;
- `__APP_SLUG__`: nome de diretório e pacote;
- `__APP_DESCRIPTION__`: descrição curta.

Versões de plataforma e dependências permanecem nos gerenciadores nativos (`pyproject.toml`, `package.json` e arquivos de lock), não espalhadas pelo script.

## Evolução para gerenciador

O gerador e o futuro frontend devem compartilhar serviços de inspeção, mas continuar independentes:

```text
CLI create-app.sh ----> criação a partir do template
                              |
Catálogo/inspectores ---> estado dos projetos <--- Frontend local
```

- o gerador cria um projeto;
- os inspectores leem manifestos, locks e metadados Git;
- o catálogo guarda apenas localização e metadados locais dos projetos;
- o frontend apresenta os dados e solicita operações explícitas;
- adaptadores tratam diferenças entre Django, Next.js e, futuramente, Flutter.

O frontend não deve executar atualizações arbitrárias por conta própria. A camada operacional precisa validar o projeto, montar um plano e pedir confirmação antes de qualquer alteração.

## Deploy da aplicação gerada

O template inclui o fluxo comprovado por Holding e Logos: checkout próprio,
Next e Django em processos PM2 distintos, API no loopback, Nginx na borda e
GitHub Actions com alvos `all`, `api` e `web`. Domínio e portas não pertencem à
fundação e são definidos somente no `deploy.env` da instalação. O gerador não
aloca infraestrutura, cria DNS, certificados, chaves ou segredos.

A `main` permanece como única branch de trabalho. As referências remotas
`deploy-*` existem apenas como gatilho; instalação de dependências é explícita
e separada do deploy cotidiano.

## Segurança operacional

O gerador deve:

- rejeitar destino existente;
- nunca gravar segredos reais;
- incluir exemplos versionados e criar os ambientes locais somente quando ausentes;
- usar chave insegura somente no desenvolvimento local;
- falhar em produção quando uma configuração crítica estiver ausente;
- terminar ao primeiro erro sem deixar uma geração apresentada como concluída.

A preparação padrão cria ambientes locais a partir dos exemplos, preserva os
existentes, instala dependências e migra o banco local; não cria usuários.
`--skip-setup` gera somente arquivos. Uma falha na cópia remove somente a pasta criada pela
invocação; uma falha na preparação preserva o código e retorna erro para permitir
retomada. O modo `migration` acrescenta documentação, sem importar dados.
