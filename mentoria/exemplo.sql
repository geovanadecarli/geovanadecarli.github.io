-- =====================================================================
-- EXEMPLO para testar o site antes de cadastrar os exercícios reais.
-- Cria a Sessão 1 com um exercício de teste. Pode apagar depois:
--   delete from exercicios where id = 'teste-boas-vindas';
-- =====================================================================
insert into sessoes (numero, titulo) values (1, 'Boas-vindas')
on conflict (numero) do nothing;

insert into exercicios (id, sessao, ordem, titulo, tipo, conteudo) values
('teste-boas-vindas', 1, 1, 'Como você chega', 'Exercício', '{
  "intro": "Um exercício curto só para testar o site. Responda com calma: tudo é salvo sozinho.",
  "campos": [
    { "id": "energia", "tipo": "escala", "rotulo": "De 0 a 10, como está a sua energia hoje?", "rotuloMin": "sem energia", "rotuloMax": "energia total" },
    { "id": "sentimento", "tipo": "marcar", "rotulo": "Como você está chegando?", "opcoes": ["Com entusiasmo", "Com cansaço", "Com curiosidade", "Com insegurança", "Em paz"] },
    { "id": "expectativa", "tipo": "paragrafo", "rotulo": "O que você espera da mentoria?" },
    { "id": "metas", "tipo": "lista", "rotulo": "Três sonhos para o próximo ano", "linhas": 3 }
  ]
}'::jsonb)
on conflict (id) do update set conteudo = excluded.conteudo, titulo = excluded.titulo;
