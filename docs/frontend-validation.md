# Registro da fundação visual 0.2.0

Data: 7 de outubro de 2026. Implementação e documentação concluídas;
validação complementar e aceite visual pendentes, a cargo do usuário.
Este registro consolida verificações já realizadas. Nenhuma nova validação
foi executada no fechamento documental.

## Entrega

O template recebeu MUI + Emotion + Geist, tema neutro configurável,
Card/Paper compactos, ações alinhadas e erro laranja. Cabeçalho, login,
estados e tela inicial usam a mesma base. `AppShell` oferece painéis opcionais,
incluindo um direito vazio, sem trazer o domínio editorial de Logos ou o
financeiro da Holding. O app inicial mantém apenas cabeçalho e conteúdo.

O [guia portátil](../template/docs/frontend-guide.md) acompanha cada app.
A versão do starter é 0.2.0; dependências continuam nos manifestos e locks
nativos. Veja o [changelog](../CHANGELOG.md) para adoção em apps existentes.
O checkpoint anterior à implementação é `51c6d5d`. Não houve publicação,
atualização automática de outros apps ou alteração da lógica do gerador.

## Verificações já executadas

| Verificação | Resultado observado |
| --- | --- |
| Gerador | 9 testes passaram, incluindo destino existente, exclusão de segredos/artefatos e substituição de identificadores |
| Frontend do template | 18 testes passaram, incluindo painéis e autenticação |
| Tipos e lint frontend | Passaram |
| Geração limpa | Apps descartáveis gerados em modo `migration`, com `--skip-setup` |
| Instalação do app gerado | `npm ci` e `uv sync --frozen` passaram a partir dos locks próprios |
| Frontend do app gerado final | 18 testes, tipos, lint e build isolado passaram |
| Backend do app gerado final | 10 testes e Ruff passaram |
| Autenticação real do app gerado final | Login, cookie, proteção, invalidação e logout passaram com banco temporário |

O app foi instalado e compilado fora dos repositórios de referência.
A geração não depende de consultar Holding ou Logos em runtime.
Uma rodada preliminar de navegador foi realizada em Logos, consumidor real
desta base, e está registrada em seu `docs/frontend-validation.md`.
Isso não equivale ao aceite visual do starter.

## Pendências para a próxima rodada

- [ ] Conferir visualmente o app gerado simples e uma composição com os dois
  painéis, inclusive teclado, overlays, larguras intermediárias e mobile.
- [ ] Concluir a troca de identidade no navegador. Foi iniciado um ensaio
  alterando somente `web/src/config/app.ts` do app descartável para verde,
  mas a observação visual final não foi realizada. O resultado daquele
  ensaio não está marcado como validado.
- [ ] Conferir fonte, contraste, zoom e uso com o ambiente/conteúdo do usuário.

Os ensaios não importaram banco ou `.env` pessoais. CI remoto e publicação
não foram executados. Apps já gerados continuam independentes e exigem adoção
explícita desta fundação.

A instalação apontou cinco entradas altas na cadeia de lint de
`eslint-config-next`, associadas a `braces` 3.0.3, também presente no lock
anterior à rodada. Não houve atualização automática para tentar corrigi-las.
Isso deve ser avaliado separadamente da revisão visual.
