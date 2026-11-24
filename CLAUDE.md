# Regras para quem mexe neste site (Claude)

## Mentoria Estrela e processos individuais (`mentoria/`)

1. **A Geovana precisa ver exatamente a tela do participante, sem entrar com o login dele.**
   - Todo exercício, sessão ou tela nova precisa aparecer no **espelho** do painel
     (botão "📱 Ver a tela de…" na página do participante e "📱 ver a tela" na Aula ao vivo).
   - O espelho usa o mesmo código da área do participante (`htmlCampos`, `MAAS.montar`, `MAAS.resumo`).
     Se criar um tipo novo de tela ou de campo, faça ele funcionar nos três lugares:
     área do participante (`index.html`), espelho do painel (`desenharEspelho` em `painel.html`)
     e leitura das respostas no painel (`MAAS.leitura` / `htmlCampos` com leitura).
   - Antes de publicar, teste a tela nova no espelho, com respostas preenchidas, e confira que o
     "seguir ao vivo" acompanha a pessoa.
2. **Nunca coloque dados pessoais no repositório.** Ele é público.
   - Nome completo, idade, família, trabalho, respostas e resumos de participantes ficam só no Supabase.
   - Arquivos SQL com conteúdo de processos individuais ficam em `F:\Claude\sites\mentoria-privado\`, fora deste repositório.
3. Linguagem neutra na Mentoria Estrela (a turma tem homens e mulheres): use "você", sem palavras no masculino ou feminino para quem lê.
4. Não mude o que a turma vê quando o pedido for só para um processo individual, e vice-versa.
