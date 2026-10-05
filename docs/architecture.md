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
│   ├── users/
│   ├── manage.py
│   ├── pyproject.toml
│   └── .env.example
├── web/
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   ├── package.json
│   └── .env.local.example
├── docs/
├── .github/workflows/ci.yml
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

A base do frontend será Next.js, React e TypeScript. Ela deve incluir:

- login, logout e recuperação da sessão;
- comunicação com Django por rotas internas do Next;
- cookie de sessão seguro e inacessível ao JavaScript do navegador;
- proteção das rotas autenticadas;
- cliente HTTP centralizado;
- providers essenciais;
- tema e componentes estruturais mínimos;
- testes do fluxo de autenticação.

A fundação visual será pequena. Ela deve oferecer tokens e componentes básicos sem impor páginas ou decisões de produto do Holding.

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

## Segurança operacional

O gerador deve:

- rejeitar destino existente;
- nunca gravar segredos reais;
- criar apenas arquivos `.env.example`;
- usar chave insegura somente no desenvolvimento local;
- falhar em produção quando uma configuração crítica estiver ausente;
- terminar ao primeiro erro sem deixar uma geração apresentada como concluída.
