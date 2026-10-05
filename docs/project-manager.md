# Gerenciador de projetos

## Visão

Depois de estabilizar o gerador, o App Creator poderá ganhar um frontend local para acompanhar aplicações novas e existentes. A proposta deixa de ser apenas “criar um app” e passa a cobrir parte do seu ciclo de manutenção.

## Primeira entrega: somente leitura

O primeiro painel deve ser deliberadamente seguro:

- catálogo de projetos e seus caminhos;
- stack detectada em cada projeto;
- versões de Python, Django, Node, Next.js, React e outras plataformas reconhecidas;
- presença e estado dos arquivos de lock;
- branch atual e indicação de alterações locais;
- diferença entre as versões do projeto e as recomendadas pela fundação;
- comandos de validação conhecidos e último resultado registrado.

Projetos existentes podem ser cadastrados mesmo sem terem sido criados pelo App Creator.

## Modelo extensível

Cada stack deve possuir um inspector próprio:

```text
Project
├── Django inspector    -> pyproject.toml ou requirements
├── Next inspector      -> package.json e lock
└── Flutter inspector   -> pubspec.yaml e lock
```

Um projeto pode combinar vários componentes. Isso permite representar Holding e Clareia como Django + Next e FinKidz como Django + Next + Flutter sem forçar uma estrutura única.

## Atualizações assistidas

Atualizar vem depois de inspecionar. O fluxo desejado é:

1. detectar a versão e o estado atual;
2. comparar com uma versão recomendada;
3. apresentar mudanças, incompatibilidades conhecidas e verificações necessárias;
4. exigir uma árvore Git limpa ou registrar claramente as alterações existentes;
5. criar uma branch específica;
6. aplicar a atualização solicitada;
7. executar verificações proporcionais;
8. apresentar diff e relatório para decisão humana.

Não fazem parte da proposta:

- atualizar projetos em segundo plano sem consentimento;
- sobrescrever alterações locais;
- prometer compatibilidade apenas porque a instalação terminou;
- impor o template mais recente a projetos que deliberadamente usam outra arquitetura.

## Limites do frontend

O frontend apresenta estado e intenções. Leitura do sistema de arquivos, execução de comandos e alterações ficam em uma camada local controlada, com operações permitidas explicitamente.

Se o gerenciador vier a aceitar acesso remoto, autenticação e isolamento precisarão ser tratados como uma fase própria. O primeiro MVP deve funcionar apenas no ambiente local.
