# App Creator

Starter versionado para criar aplicações novas ou iniciar migrações sobre uma fundação técnica comum, sem carregar regras de negócio dos projetos de referência.

## Objetivo

Gerar uma aplicação pronta para desenvolvimento com:

- API Django e Django REST Framework;
- frontend Next.js com React e TypeScript;
- login conectado entre frontend e backend;
- configuração local por ambiente;
- testes básicos e CI;
- estrutura preparada para evoluir sem transformar o script em um gerador monolítico.

O App Creator deve servir a dois fluxos:

1. **Aplicação nova:** começa somente com a fundação técnica.
2. **Migração:** usa a mesma fundação e acrescenta inventário, mapeamento de dados e checklist de paridade com o legado.

## Princípios

- O script é um orquestrador pequeno; os arquivos reais ficam em `template/`.
- Dependências e versões não ficam repetidas no shell.
- O template é independente dos domínios financeiros do Holding.
- Segurança, autenticação, testes e CI já nascem funcionando.
- Atualizações de Django e Next são feitas primeiro no template e validadas em um app de exemplo.
- Um app já gerado é independente: atualizar o starter não altera projetos existentes silenciosamente.
- A automação deve falhar com clareza e nunca sobrescrever uma pasta existente.

## Estrutura

```text
app-creator/
├── create-app.sh           # interface curta do gerador
├── README.md
├── docs/
│   ├── architecture.md
│   ├── roadmap.md
│   └── versioning.md
└── template/
    ├── api/                # Django/DRF e autenticação
    ├── web/                # Next.js/React e sessão
    ├── docs/               # documentação inicial do app gerado
    └── .github/            # CI do app gerado
```

O gerador já copia uma aplicação independente. O shell é apenas a entrada;
`scripts/create_app.py` cuida da geração e `template/` contém os arquivos reais.

## Criar uma aplicação

```bash
./create-app.sh meu-app
./create-app.sh meu-app --destination /caminho/dos/projetos
./create-app.sh meu-app --mode migration
./create-app.sh meu-app --skip-setup
```

O modo de migração não muda a arquitetura da aplicação. Ele apenas inclui documentação e checklists próprios da migração.

Use um nome em minúsculas com números e hífens. O destino não pode existir,
inclusive como arquivo ou link. O gerador não copia bancos, segredos, ambientes
instalados ou Git. Registra a versão da fundação em `.app-creator.json`.

Por padrão, a geração instala os locks com uv/npm, cria os ambientes locais a
partir dos exemplos e migra o banco. `--skip-setup` gera somente os arquivos.
Os requisitos de Python/Node estão nos manifestos do template. Arquivos de
ambiente existentes são preservados e nenhum usuário é criado automaticamente.
Consulte o README do app para criar o primeiro usuário e iniciar os processos.

Em um app já criado, execute `bash scripts/setup.sh` na raiz para preparar ou
retomar a preparação. `--prepare` continua aceito por compatibilidade.

Para um repositório já existente, como Logos, gere em outra pasta e integre os
arquivos necessários. O gerador nunca sobrescreve a pasta existente.

## Validar o starter

```bash
python3 -m unittest discover -s tests -v
./create-app.sh teste-app --destination /tmp/app-creator-test
```

Depois execute as verificações do README gerado: testes Django, lint/tipos,
testes frontend, build isolada e autenticação real entre Next e Django.

## Evolução planejada

Os apps gerados compartilham a logo Wtree branca e a barra azul. A cor fica em
`--app-header-background` no CSS; nome e navegação ficam em `src/config/app.ts`
do frontend. Cada produto pode adaptar esses valores mantendo a mesma estrutura.

O primeiro produto é o gerador. Depois que ele estiver estável, o mesmo projeto poderá oferecer um frontend local para gerenciar aplicações criadas ou já existentes:

- cadastrar e localizar projetos;
- identificar stacks e versões instaladas;
- comparar cada projeto com a fundação atual;
- mostrar verificações de saúde e atualizações disponíveis;
- orientar atualizações sem alterar projetos silenciosamente.

O painel será uma camada sobre um catálogo de projetos e adaptadores de stack. Ele não deve acoplar o gerador a uma interface gráfica nem exigir que todos os projetos sejam idênticos.

As referências iniciais são Holding, Clareia e FinKidz. Holding é a principal referência de fundação moderna; os demais ajudam a validar decisões em arquiteturas e produtos diferentes.

## Documentação

- [Arquitetura](docs/architecture.md)
- [Projetos de referência](docs/references.md)
- [Gerenciador de projetos](docs/project-manager.md)
- [Versões e atualizações](docs/versioning.md)
- [Roadmap](docs/roadmap.md)
- [Fundação adotada](docs/foundation.md)

## Estado

Primeira fundação implementada: template executável, gerador, autenticação,
documentação de migração, testes e CI. Catálogo e painel de gerenciamento
continuam no roadmap. O domínio do Logos será construído no próprio projeto.
