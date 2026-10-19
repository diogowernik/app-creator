# Padrão visual da família

O guia distribuído com cada app está em
[template/docs/frontend-guide.md](../template/docs/frontend-guide.md).
A base é MUI + Emotion + Geist, consolidada em Logos a partir da Holding.
Apps já gerados não recebem mudanças automaticamente.

O layout gerado usa a navegação responsiva da Holding: os mesmos links e
ícones de `appConfig.navigation` aparecem no cabeçalho a partir de `xl` e na
lateral recolhível abaixo disso. O shell preserva painéis próprios do produto,
a preferência de abertura no desktop e o conteúdo central ao mudar de largura.
No celular, a lateral inicia fechada e fecha após navegar. Integração e adoção
em apps existentes estão no guia distribuído.
O modo responsivo é o default. `appConfig.shell` permite optar pelo menu lateral
em qualquer largura e pela abertura inicial dos painéis. O direito fica
desabilitado por padrão; habilitá-lo e abri-lo inicialmente são opções distintas.
Sair acompanha a navegação: cabeçalho em telas largas e rodapé da lateral nas
menores (ou em qualquer largura no modo `sidebar`).
Os resultados desta rodada estão no [registro de navegação](navigation-validation.md).

## Decisões para desenvolvimento

Holding e Logos são referências complementares: Holding para organização de
dados e operações compactas; Logos para identidade configurável, leitura e
painéis opcionais. Aproveitar esses recursos sem copiar o domínio dos apps.

- Usar MUI + Emotion + Geist diretamente, sem criar outra biblioteca de controles.
- Preservar o CardHeader compacto, fontes agradáveis e hierarquia moderada,
  com ações alinhadas à direita. Copiar, editar e salvar podem ser ícones com
  tooltip e nome acessível; padronizar suas métricas no tema.
- Recolhimento foi aprovado: acrescenta comportamento ao card existente,
  sem mudar fonte, padding ou aparência do cabeçalho. Preservar conteúdo e
  operações ao recolher.
- A identidade inicial do starter deve ser azul ou verde. Cinza como identidade
  principal foi rejeitado; superfícies e textos neutros continuam adequados.
  Identidade vive na configuração, não em cores espalhadas pelos componentes.
- Composição acompanha a tarefa: tabelas podem aproveitar a largura; leitura
  usa largura confortável; catálogos podem mostrar capa e título sem card por
  item. Não exigir abas, três colunas nem caixas aninhadas em todo recurso.
- Painéis laterais são opcionais e devem ter função concreta. Explicações e
  feedback só ocupam espaço quando ajudam a decidir ou agir.
- Toda capacidade do template deve declarar seu default e como habilitar suas
  alternativas. A existência de um recurso não o torna obrigatório no app gerado.
- Aparência comum pertence ao tema e aos componentes existentes. Uma regra
  local em `styled` também é exceção visual; exige pedido explícito, não apenas
  conveniência. Geometria funcional não autoriza redesenhar controles.

## Espaçamento compartilhado

Preferir intervalos compactos entre cards relacionados: 16px como ponto de
partida, usando a escala do tema. Ajustar a composição conforme a tarefa e
largura disponível, sem inventar distância por página. Separar áreas distintas
pode exigir mais respiro. Usar um responsável pelo intervalo, evitando somar
margem de cada card com gap do contêiner.

Logos e o template usam `components/ui/CardLayout.tsx`: grade responsiva com
intervalo de 16px, sem margem adicional dos cards. A referência é a grade de
Bancos da Holding nova; a Holding usa outros intervalos em outras composições.
Mudanças nesse espaçamento devem acontecer na composição compartilhada.

O starter entrega identidade azul configurável, CardSection recolhível,
PageContent centralizado, memória dos painéis e feedback temporário compartilhado.
Essas capacidades são opcionais: o produto define a composição e o fluxo.
O aceite visual continua com o usuário; valores e detalhes evidentes ficam no código.

Esta é a referência da comparação entre apps; os guias de cada produto tratam
de seu uso concreto. Valores atuais e detalhes evidentes permanecem no código.
