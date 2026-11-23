-- =====================================================================
-- MENTORIA ESTRELA · Sessão 01 · livro e missões da semana
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Pode rodar de novo para atualizar os textos: as respostas não se perdem.
-- Depois, libere cada missão pelo painel (aba Liberar), na hora que quiser.
--
-- ✏️  Para mudar um texto: troque só o que está entre aspas "assim".
--     **palavra** fica em negrito. Links https://... viram clicáveis.
-- =====================================================================

insert into exercicios (id, sessao, ordem, titulo, tipo, conteudo) values

-- ---------- LIVRO ----------
('s1-livro', 1, 101, 'Viva a Sua Real Identidade · Introdução e Capítulo 1', 'Livro · missão semanal', $j${
  "capa": {
    "imagem": "livros/viva-a-sua-real-identidade.jpg",
    "titulo": "Viva a Sua Real Identidade",
    "autor": "Camila Saraiva Vieira",
    "detalhe": "Prefácio de Paulo Vieira · Editora Gente\nIntrodução e Capítulo 1 · Sua vida vai muito além disso"
  },
  "intro": "Leia a introdução e o capítulo 1 com uma caneta na mão. Sempre que aparecer uma pergunta aqui, pare e responda com verdade. Eu vou ler cada resposta antes da nossa próxima sessão.",
  "campos": [
    { "tipo": "info", "texto": "**Ainda não tem o livro?** Você encontra em livrarias físicas (nos shoppings quase sempre tem os livros da Camila e do Paulo Vieira), no Mercado Livre, na Shopee e nos sites das grandes livrarias.\n\n**Vídeos oficiais do livro:** a Camila conduz o exercício da visão positiva de futuro e mostra um modelo do Mural da Vida Extraordinária. É o mesmo endereço dos QR Codes das páginas 34, 35 e 42: https://digital.febracis.com/viva-sua-real-identidade" },

    { "tipo": "info", "texto": "**Enquanto você lê:** perguntas para responder" },
    { "id": "p15", "tipo": "paragrafo", "rotulo": "Página 15 · Você sabe qual é o seu propósito? Hoje você vive em busca dele ou está só cumprindo uma rotina de tarefas, dia após dia?" },
    { "id": "p21", "tipo": "paragrafo", "rotulo": "Página 21 · Em que área da sua vida você ainda culpa outras pessoas ou as circunstâncias pelos seus resultados? O que você decide fazer de diferente a partir de hoje?" },
    { "id": "p25", "tipo": "paragrafo", "rotulo": "Página 25 · Que resultado ruim você vem carregando como se fosse quem você é? Escreva quem você decide ser daqui para a frente." },
    { "id": "p26", "tipo": "paragrafo", "rotulo": "Página 26 · Você aceita viver esse processo até o fim, mesmo quando ficar difícil? Escreva o seu compromisso com as suas palavras." },
    { "id": "p28", "tipo": "paragrafo", "rotulo": "Página 28 · Quais frases negativas você mais repete sobre você e sobre a sua vida? Reescreva cada uma do jeito que você quer passar a acreditar." },

    { "tipo": "info", "texto": "**Exercício · Minha visão positiva de futuro** (páginas 35 a 41)\nAssista ao vídeo da Camila e escreva, para cada pilar, como será a sua vida extraordinária. No presente, com detalhes, como se já estivesse vivendo. Olhe a sua roda do MAAS para lembrar de onde você está partindo." },
    { "id": "v_espiritual",   "tipo": "paragrafo", "rotulo": "1. Pilar Espiritual" },
    { "id": "v_parentes",     "tipo": "paragrafo", "rotulo": "2. Pilar Parentes" },
    { "id": "v_conjugal",     "tipo": "paragrafo", "rotulo": "3. Pilar Conjugal" },
    { "id": "v_filhos",       "tipo": "paragrafo", "rotulo": "4. Pilar Filhos" },
    { "id": "v_social",       "tipo": "paragrafo", "rotulo": "5. Pilar Social / Lazer" },
    { "id": "v_saude",        "tipo": "paragrafo", "rotulo": "6. Pilar Saúde" },
    { "id": "v_servir",       "tipo": "paragrafo", "rotulo": "7. Pilar Servir" },
    { "id": "v_intelectual",  "tipo": "paragrafo", "rotulo": "8. Pilar Intelectual" },
    { "id": "v_financeiro",   "tipo": "paragrafo", "rotulo": "9. Pilar Financeiro" },
    { "id": "v_profissional", "tipo": "paragrafo", "rotulo": "10. Pilar Profissional" },
    { "id": "v_emocional",    "tipo": "paragrafo", "rotulo": "11. Pilar Emocional" },

    { "tipo": "info", "texto": "**Exercício · Mural da Vida Extraordinária** (páginas 41 a 43)\nEscolha imagens que retratem a visão que você escreveu para cada pilar. Cole tudo numa folha grande, num lugar que você veja todos os dias. Depois tire uma foto do seu mural e envie aqui." },
    { "id": "mural_foto", "tipo": "foto", "rotulo": "Foto do seu mural", "max": 3 },
    { "id": "mural_texto", "tipo": "paragrafo", "rotulo": "Qual imagem do seu mural mais mexe com você? Por quê?" }
  ]
}$j$::jsonb),

-- ---------- FILME ----------
('s1-filme', 1, 102, 'À Procura da Felicidade', 'Filme · missão semanal', $j${
  "capa": {
    "titulo": "À Procura da Felicidade",
    "autor": "Com Will Smith e Jaden Smith",
    "detalhe": "2006 · Direção de Gabriele Muccino · Baseado na história real de Chris Gardner\nProcure pelo nome nas plataformas de streaming ou para alugar."
  },
  "intro": "Assista com atenção, de preferência sem celular na mão. Depois responda com verdade. Não é sobre o Chris: é sobre você.",
  "campos": [
    { "id": "f1", "tipo": "paragrafo", "rotulo": "1. O Chris perde o dinheiro, a casa e o casamento, mas não deixa que esses resultados digam quem ele é. Que resultado da sua vida você tem deixado definir quem você é?" },
    { "id": "f2", "tipo": "paragrafo", "rotulo": "2. Em que momentos ele assume a responsabilidade em vez de culpar alguém? Em que área da sua vida você ainda coloca a culpa nos outros ou nas circunstâncias?" },
    { "id": "f3", "tipo": "paragrafo", "rotulo": "3. Na quadra de basquete, ele diz ao filho para nunca deixar ninguém dizer que ele não consegue. Quem já disse isso a você? E que frase contra você mesmo você ainda repete?" },
    { "id": "f4", "tipo": "paragrafo", "rotulo": "4. Na porta da corretora, o Chris enxerga a vida que quer viver. Qual é a cena da sua vida extraordinária que te faz levantar todo dia?" },
    { "id": "f5", "tipo": "paragrafo", "rotulo": "5. Pense na noite no banheiro do metrô. Qual foi o seu momento mais difícil? O que te fez continuar?" },
    { "id": "f6", "tipo": "paragrafo", "rotulo": "6. Olhe para a sua roda do MAAS. Quais pilares o Chris sustentou durante a crise e quais desabaram? E os seus, quais estão sustentando você agora?" },
    { "id": "f7", "tipo": "paragrafo", "rotulo": "7. Que atitude você vai tomar nesta semana por causa deste filme?" }
  ]
}$j$::jsonb),

-- ---------- 30 EU SOU ----------
('s1-eusou', 1, 103, '30 características "Eu sou…"', 'Missão diária · marque no Jogo Estrela', $j${
  "intro": "A missão de cada dia você marca no **Jogo Estrela**. Aqui, escreva uma vez as suas 30 características para a Geovana conferir: frases sobre quem você é e quem você decide ser, no presente e com convicção, mesmo que hoje ainda pareça distante.",
  "campos": [
    { "id": "eusou", "tipo": "lista", "rotulo": "Eu sou…", "linhas": 30, "prefixo": "Eu sou" }
  ]
}$j$::jsonb),

-- ---------- 40 GRATIDÃO ----------
('s1-gratidao', 1, 104, '40 motivos de gratidão', 'Missão diária · marque no Jogo Estrela', $j${
  "intro": "A missão de cada dia você marca no **Jogo Estrela**. Aqui, escreva uma vez os seus 40 motivos de gratidão para a Geovana conferir. Do maior ao menor. Quando parecer que acabou, continue: é ali que a consciência desperta.",
  "campos": [
    { "id": "gratidao", "tipo": "lista", "rotulo": "Eu agradeço por…", "linhas": 40 }
  ]
}$j$::jsonb),

-- ---------- 3 PILARES ----------
('s1-pilares', 1, 105, 'Quem você é a partir de hoje nos seus 3 pilares', 'Missão pontual', $j${
  "intro": "Pegue os 3 pilares com a menor nota do seu MAAS e escreva quem você é a partir de hoje em cada um deles. Não escreva o que vai tentar. Escreva quem você decide ser.\n\nMande uma mensagem para a Geovana: ela ajuda cada participante individualmente nesta missão.",
  "campos": [
    { "id": "escolhidos", "tipo": "marcar", "rotulo": "Quais são os seus 3 pilares com a menor nota?", "ajuda": "Marque 3.", "opcoes": ["Espiritual", "Parentes", "Conjugal", "Filhos", "Social / Lazer", "Saúde", "Servir", "Intelectual", "Financeiro", "Profissional", "Emocional"] },
    { "id": "pilar1", "tipo": "paragrafo", "rotulo": "Primeiro pilar · Quem eu sou a partir de hoje", "ajuda": "Comece escrevendo o nome do pilar." },
    { "id": "pilar2", "tipo": "paragrafo", "rotulo": "Segundo pilar · Quem eu sou a partir de hoje", "ajuda": "Comece escrevendo o nome do pilar." },
    { "id": "pilar3", "tipo": "paragrafo", "rotulo": "Terceiro pilar · Quem eu sou a partir de hoje", "ajuda": "Comece escrevendo o nome do pilar." }
  ]
}$j$::jsonb)

on conflict (id) do update
  set sessao = excluded.sessao, ordem = excluded.ordem, titulo = excluded.titulo,
      tipo = excluded.tipo, conteudo = excluded.conteudo;
