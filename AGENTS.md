# Orientações do projeto

- Mantenha `create-app.sh` pequeno: validação, cópia, substituição e preparação.
- Arquivos da aplicação gerada pertencem a `template/`; não os monte em grandes blocos dentro do shell.
- Não copie domínios financeiros nem dados do Holding para o starter.
- Preserve a autenticação ponta a ponta e seus testes ao alterar a fundação.
- Declare versões apenas nos manifestos e locks nativos do template.
- Atualizações principais exigem geração limpa de um app de teste e validação completa.
- O gerador nunca deve sobrescrever um destino existente.
- Não adicione funcionalidades de produto ao starter sem uma necessidade transversal comprovada.
