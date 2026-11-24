-- =====================================================================
-- MENTORIA ESTRELA · Sessão 01 · Despertando a Consciência
-- Versão igual à aula gravada. Cole tudo no Supabase:
-- SQL Editor → New query → Run. Pode rodar de novo para ajustar textos;
-- as respostas já dadas não se perdem.
--
-- ✏️  Para mudar um texto: troque só o que está entre aspas "assim".
--     **palavra** fica em negrito. Não apague aspas, vírgulas, [ ] nem { }.
-- 🎧  Áudio da Gaivota: quando o arquivo estiver no site, troque
--     "audio": "" por "audio": "audio/gaivota.mp3"
-- =====================================================================

-- estrelas do Jogo Estrela que você marca à mão no painel
alter table alunos add column if not exists estrelas int not null default 0;

update sessoes set titulo = 'Despertando a Consciência' where numero = 1;

update exercicios
set conteudo = jsonb_set(
  conteudo || $j${
  "componente": "maas",

  "abertura": {
    "rotulo": "Sessão 1 de 12",
    "titulo": "Despertando a Consciência",
    "texto": "Ninguém muda o que não enxerga. Hoje você vai parar, olhar a sua vida inteira de frente e dar nome ao que está funcionando e ao que está sendo empurrado com a barriga.",
    "aviso": "Esta aula é gravada e vai num ritmo rápido. Se precisar de mais tempo para escrever, pause o vídeo.",
    "listaTitulo": "Esta Mentoria Estrela é para você",
    "lista": [
      "Reescrever a sua identidade.",
      "Construir uma vida de verdade, com coragem e humildade.",
      "Não negociar o inegociável.",
      "Viver em alinhamento com os seus valores.",
      "Entender e viver o seu processo."
    ],
    "botao": "Continuar"
  },

  "antes": [
    { "tipo": "perguntas", "rotulo": "Exercício de abertura · 1 de 5", "titulo": "O que você veio buscar?",
      "campos": [ { "id": "buscar", "tipo": "paragrafo", "rotulo": "O que você veio buscar nesta mentoria? O que você quer mudar na sua vida? Qual área quer focar nestas 12 sessões?" } ] },
    { "tipo": "perguntas", "rotulo": "Exercício de abertura · 2 de 5", "titulo": "Suas expectativas",
      "campos": [ { "id": "expectativas", "tipo": "paragrafo", "rotulo": "Quais são as suas expectativas para estas 12 sessões? O que você acredita que vai mudar, que vai ser bom, que vai te ajudar?" } ] },
    { "tipo": "perguntas", "rotulo": "Exercício de abertura · 3 de 5", "titulo": "O que você tem negligenciado?",
      "campos": [ { "id": "negligencia", "tipo": "marcar", "rotulo": "O que na sua vida você tem negligenciado? Pode marcar mais de uma.",
                    "opcoes": ["Relacionamento", "Saúde", "Vida financeira", "Profissão", "Saúde mental", "Vida espiritual"] } ] },
    { "tipo": "perguntas", "rotulo": "Exercício de abertura · 4 de 5", "titulo": "Seu propósito de vida",
      "campos": [ { "id": "proposito", "tipo": "simnao", "rotulo": "Você sabe qual é o seu propósito de vida hoje?", "qual": "Explique qual é e por quê." } ] },
    { "tipo": "perguntas", "rotulo": "Exercício de abertura · 5 de 5", "titulo": "Eu sou",
      "intro": "Respire fundo. Diga \"eu sou\". Quais são as 5 primeiras coisas que aparecem na sua mente? Escreva o que vier, bom ou ruim. É isso que mostra para onde a gente precisa caminhar.",
      "campos": [ { "id": "eusou5", "tipo": "eusou", "rotulo": "As 5 primeiras coisas", "linhas": 5 } ] },
    { "tipo": "presente", "id": "presente", "rotulo": "Um presente para você", "titulo": "Você ganhou um presente",
      "texto": "Toque na caixa para abrir.",
      "revelacao": { "rotulo": "Aula bônus", "titulo": "Parabéns!", "texto": "Você ganhou uma **aula bônus sobre propósito**. Ela chega nos próximos dias no grupo do WhatsApp." } }
  ],

  "intro": {
    "titulo": "MAAS · Mapa de Autoavaliação Sistêmico",
    "texto": "Agora não é um exercício avulso: é a sua jornada. Respire fundo, vá com calma e responda com toda a verdade.",
    "passos": [
      "Leia o pilar e as perguntas.",
      "Escreva a sua reflexão: justifique a sua nota.",
      "Dê a sua nota de 0 a 10, pensando nos últimos 30 dias."
    ],
    "botao": "Ir para o Pilar 1"
  },

  "regras": [
    "A nota é sobre os **últimos 30 dias**.",
    "**0** = não está fazendo nada nessa área · **10** = de forma extraordinária."
  ],
  "reflexao": { "rotulo": "MINHAS REFLEXÕES", "ajuda": "Justifique a sua nota. Por que você deu essa nota?" },
  "escala": { "min": "0 · não está fazendo nada", "max": "10 · extraordinário" },

  "pilares": [
    { "nome": "Espiritual",
      "gruposTitulo": "Escolha o seu caso",
      "grupos": [
        { "nome": "Acredito em algo", "perguntas": [
          "Quanto tempo você tem dedicado à sua conexão com Deus?",
          "Você tem feito o que a sua fé pede (oração, leitura, devocional, igreja)?" ] },
        { "nome": "Não acredito em nada", "perguntas": [
          "Que nota você dá para esse sentimento?",
          "Você está bem assim ou gostaria de dedicar tempo a pesquisar essas visões de mundo?" ] }
      ] },

    { "nome": "Parentes",
      "texto": "Pai, mãe e irmãos.",
      "perguntas": [
        "Você dedica tempo e atenção a eles?",
        "Você sabe qual é a linguagem do amor do seu pai, da sua mãe, dos seus irmãos?",
        "Mesmo de longe: você liga? Qual a qualidade dessa conversa?",
        "Como você lida quando tem conflito? **Nota 10** = quando vêm desavenças, você sabe resolver."
      ],
      "saibaMais": { "titulo": "Saiba mais: as 5 linguagens do amor",
        "texto": "**Palavras de afirmação** · elogios, incentivo, dizer o que sente.\n**Tempo de qualidade** · atenção total, sem celular, estar junto de verdade.\n**Presentes** · gestos concretos que mostram que você lembrou.\n**Atos de serviço** · fazer algo prático para ajudar.\n**Toque físico** · abraço, carinho, proximidade." } },

    { "nome": "Conjugal",
      "gruposTitulo": "Escolha o seu caso",
      "grupos": [
        { "nome": "Tenho alguém", "perguntas": [
          "Você dedica tempo e atenção a essa pessoa?",
          "Você sabe a linguagem do amor dela?",
          "Quando há conflito, vocês resolvem ou empurram com a barriga?",
          "Tempo é o que há de mais caro no mundo: você tem dado o seu?" ] },
        { "nome": "Não tenho ninguém hoje", "perguntas": [
          "A nota é para o **sentimento**, não para ter ou não alguém.",
          "Há quem sinta que não é a hora e há quem queira e não encontre: que nota você dá para o que sente?" ] }
      ] },

    { "nome": "Filhos",
      "gruposTitulo": "Escolha o seu caso",
      "grupos": [
        { "nome": "Tenho filhos", "perguntas": [
          "Existe confiança, amor, respeito, tempo, brincadeira e ensino dos seus valores? Ou você está no automático?",
          "**Autorresponsabilidade:** a nota é de você para o seu filho, não dele para você." ] },
        { "nome": "Não tenho filhos", "perguntas": [
          "A nota é para o **sentimento** de não ter: não é a hora, ou você quer e ainda não conseguiu." ] }
      ] },

    { "nome": "Social e Lazer",
      "texto": "Este pilar tem duas notas. A nota do pilar é a média delas, calculada sozinha.",
      "partes": [
        { "nome": "Social", "texto": "Você tem amigos em quem confia e com quem pode contar? Ou é sempre você puxando todo mundo para cima? Seus amigos têm mentalidade de crescimento?" },
        { "nome": "Lazer", "texto": "É o tempo só seu. Você pratica hobbies de que gosta (videogame, cuidar de si, o que for seu)?" }
      ],
      "frase": "Você é a pessoa mais importante da sua vida." },

    { "nome": "Saúde",
      "texto": "Este pilar tem três notas. A nota do pilar é a média delas, calculada sozinha.",
      "partes": [
        { "nome": "Alimentação e hidratação", "texto": "O que você come, quanta água bebe, e se sabe quanto o seu corpo precisa." },
        { "nome": "Exercício físico", "texto": "Academia, corrida, esporte, condicionamento." },
        { "nome": "Médico", "texto": "Você faz check-up e exames de rotina? Tem a data marcada na agenda? Ou faz anos que não vai ao médico?" }
      ] },

    { "nome": "Servir",
      "frase": "O propósito do ser humano é crescer e contribuir.",
      "perguntas": [
        "Você tem ajudado pessoas que não têm como te retribuir, sem querer nada em troca?",
        "O mundo é melhor porque você existe nele?"
      ] },

    { "nome": "Intelectual",
      "texto": "Livros, cursos, faculdade, imersões. Mas o que vale é colocar em prática.",
      "perguntas": [
        "Você usa o que aprende?",
        "Você já ajudou alguém com esse conhecimento?",
        "**Nota** = qualidade do que você aprende + intensidade com que pratica."
      ] },

    { "nome": "Financeiro",
      "texto": "Este pilar tem três notas. A nota do pilar é a média delas, calculada sozinha.",
      "partes": [
        { "nome": "Fazer dinheiro", "texto": "A sua habilidade de gerar renda." },
        { "nome": "Poupar", "texto": "Você sabe guardar dinheiro?" },
        { "nome": "Investir", "texto": "Você investe? Sabe como?" }
      ] },

    { "nome": "Profissional",
      "perguntas": [
        "Você gosta do que faz?",
        "Mesmo que não vá ficar nesse trabalho, você faz com excelência?"
      ],
      "frase": "Sempre vai ter alguém te olhando. E se aparecer uma nova oportunidade porque alguém viu a sua excelência?" },

    { "nome": "Emocional",
      "perguntas": [
        "Você se considera uma pessoa feliz?",
        "Você sabe lidar com as suas emoções?",
        "Você comemora as suas conquistas ou só passa para a próxima meta?"
      ],
      "frase": "A emoção a gente aprende a lidar; o sentimento a gente ajusta." }
  ],

  "roda": {
    "titulo": "Esse é o resultado da sua Estrela hoje.",
    "pergunta": "O que você sente quando olha para essa imagem?",
    "id": "roda_sente"
  },

  "leitura": {
    "titulo": "Leitura da roda",
    "telas": [
      { "tipo": "pergunta", "i": 0, "pergunta": "Se essa roda fosse o pneu do seu carro, até onde você chegaria?", "exemplo": "Até a próxima cidade? Ou nem até a sorveteria da esquina?" },
      { "tipo": "pergunta", "i": 1, "pergunta": "Quais pilares estão pedindo atenção agora?", "exemplo": "Pense nos 3 principais." },
      { "tipo": "pergunta", "i": 2, "pergunta": "Como seria a sua vida se todas as áreas estivessem em equilíbrio?", "exemplo": "Quero detalhes. Pegue as 3 piores áreas e descreva como seria a sua vida se todas estivessem nota 10." },
      { "tipo": "prioridades", "titulo": "Escolha 3 pilares para se dedicar nesta mentoria", "texto": "São 12 sessões, cerca de 4 a 5 meses. Já marcamos os 3 de menor nota: confirme ou troque.", "frase": "Tem poder quem age. Bora!" },
      { "tipo": "pergunta", "i": 4, "pergunta": "O que a sua roda revelou?", "exemplo": "Com essa fotografia da sua vida hoje, o que os resultados dizem sobre o seu estado atual?" }
    ]
  },

  "depois": [
    { "tipo": "perguntas", "rotulo": "Exercício", "titulo": "10 \"Eu sou\" positivos do último mês",
      "intro": "Escreva 10 características positivas que você viveu nos últimos 30 dias, cada uma com o porquê.\nExemplo: **Eu sou forte**, porque passei por uma situação difícil e precisei ser forte.",
      "campos": [ { "id": "eusou10", "tipo": "eusou", "porque": true, "rotulo": "Minhas 10 características", "linhas": 10 } ],
      "dica": "Se for difícil lembrar, pause e responda com calma." },

    { "tipo": "audio", "id": "gaivota", "rotulo": "Metáfora da Gaivota", "titulo": "Pare tudo.",
      "preparo": "Larga a caneta e o celular. Sente com a coluna ereta, os pés no chão, as mãos sobre as coxas. Feche os olhos e ouça a minha voz.",
      "frase": "A sua mente não distingue o que é real do que é imaginado.",
      "audio": "",
      "semAudio": "O áudio da Gaivota chega em breve. Por enquanto, siga com a aula gravada." },

    { "tipo": "perguntas", "rotulo": "Aprendizados e decisões", "titulo": "Que fichas caíram?",
      "campos": [ { "id": "aprendizados", "tipo": "paragrafo", "rotulo": "Que fichas caíram para você, da gaivota e de toda esta sessão? Quais aprendizados você teve? Que decisão você toma?" } ] },

    { "tipo": "agenda", "rotulo": "Até a próxima sessão", "titulo": "Agenda programada",
      "intro": "Cada item vale estrelas no **Jogo Estrela**.",
      "itens": [
        { "categoria": "Livro · missão semanal", "atividade": "Viva Sua Real Identidade · Introdução e Capítulo 1",
          "obs": "Mande print ou foto + seus aprendizados e decisões.", "estrelas": "5 estrelas",
          "link": "#ex=s1-livro", "linkTexto": "Responder aqui",
          "whats": "Oi Geovana! Aqui está o meu print do livro Viva Sua Real Identidade e os meus aprendizados e decisões:" },
        { "categoria": "Filme · missão semanal", "atividade": "À Procura da Felicidade",
          "obs": "Assista com olhar clínico. Mande uma foto do final do filme + seus aprendizados e decisões.", "estrelas": "5 estrelas",
          "link": "#ex=s1-filme", "linkTexto": "Responder aqui",
          "whats": "Oi Geovana! Aqui está a foto do final do filme À Procura da Felicidade e os meus aprendizados e decisões:" },
        { "categoria": "Missão diária · todos os dias", "atividade": "30 \"Eu sou\"",
          "obs": "As 10 de hoje + 20 do que você quer se tornar (ex.: \"Eu sou uma pessoa organizada\"). Mande para a Geovana conferir antes. Depois, leia todos os dias, em voz alta se puder.",
          "estrelas": "Fez os dois (Eu sou + gratidão) no dia = 2 estrelas por dia",
          "link": "#ex=s1-eusou", "linkTexto": "Escrever aqui",
          "whats": "Oi Geovana! Aqui estão os meus 30 \"Eu sou\" para você conferir:" },
        { "categoria": "Missão diária · todos os dias", "atividade": "40 motivos de gratidão",
          "obs": "Escritos todos os dias (e falados, se puder).",
          "estrelas": "Fez os dois (Eu sou + gratidão) no dia = 2 estrelas por dia",
          "link": "#ex=s1-gratidao", "linkTexto": "Escrever aqui",
          "whats": "Oi Geovana! Fiz os meus 40 motivos de gratidão de hoje." },
        { "categoria": "Exercício pontual · uma vez", "atividade": "Uma nova narrativa nos seus 3 pilares",
          "obs": "Escolha os 3 pilares de menor nota e escreva, para cada um, uma nova narrativa de quem você é a partir de hoje, com 2 a 3 linhas.\nEx.: \"Hoje eu decido, na área da saúde, comer uma fruta por dia e beber mais uma garrafa de água.\"",
          "estrelas": "10 estrelas",
          "link": "#ex=s1-pilares", "linkTexto": "Escrever aqui",
          "whats": "Oi Geovana! Aqui está a minha nova narrativa nos meus 3 pilares:" }
      ] }
  ],

  "compromisso": {
    "titulo": "Primeira atitude",
    "pergunta": "Qual é a primeira atitude que você vai tomar esta semana no seu pilar prioritário? Uma decisão prática.",
    "exemplos": [
      "**Saúde:** comer uma fruta por dia.",
      "**Intelectual:** ler 10 páginas por dia de um livro que te ensine algo."
    ],
    "botao": "Concluir a sessão",
    "rotuloPainel": "Primeira atitude",
    "salvo": "Sessão 1 concluída. Até a próxima sessão."
  },

  "encerramento": {
    "titulo": "Sessão 1 concluída.",
    "texto": "Até a próxima sessão."
  }
}$j$::jsonb,
  '{intro,video}', coalesce(conteudo->'intro'->'video', '""'::jsonb))
where sessao = 1 and conteudo->>'componente' = 'maas';

-- deve aparecer "UPDATE 1". Se aparecer "UPDATE 0", me avise.
