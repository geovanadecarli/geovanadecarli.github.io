-- =====================================================================
-- MENTORIA ESTRELA · banco de dados (Supabase)
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Pode rodar de novo sem perder respostas (só cria o que falta).
-- Na ÚLTIMA linha, troque SEU-EMAIL pelo e-mail que você usa para entrar.
-- =====================================================================

-- Quem é administradora (você)
create table if not exists admins (
  email text primary key
);

-- Mentorados autorizados a entrar
create table if not exists alunos (
  email text primary key check (email = lower(email)),
  nome text not null default '',
  criado_em timestamptz not null default now(),
  aceite_privacidade timestamptz
);

-- Sessões da mentoria (ordem e título)
create table if not exists sessoes (
  numero int primary key,
  titulo text not null,
  descricao text not null default ''
);

-- Exercícios e ferramentas (o conteúdo fica aqui, protegido por login)
create table if not exists exercicios (
  id text primary key,
  sessao int not null references sessoes(numero) on update cascade,
  ordem int not null default 0,
  titulo text not null,
  tipo text not null default 'Exercício',
  conteudo jsonb not null default '{}'::jsonb
);

-- Liberações: aluno_email vazio (null) = turma toda
create table if not exists liberacoes (
  id bigint generated always as identity primary key,
  exercicio_id text not null references exercicios(id) on delete cascade on update cascade,
  aluno_email text references alunos(email) on delete cascade on update cascade,
  criado_em timestamptz not null default now()
);
create unique index if not exists liberacoes_unica
  on liberacoes (exercicio_id, coalesce(aluno_email, ''));

-- Respostas: uma linha por mentorado por exercício
create table if not exists respostas (
  aluno_email text not null references alunos(email) on delete cascade on update cascade,
  exercicio_id text not null references exercicios(id) on delete cascade on update cascade,
  dados jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now(),
  primary key (aluno_email, exercicio_id)
);

-- Seu comentário em cada exercício de cada mentorado
create table if not exists comentarios (
  aluno_email text not null references alunos(email) on delete cascade on update cascade,
  exercicio_id text not null references exercicios(id) on delete cascade on update cascade,
  texto text not null default '',
  atualizado_em timestamptz not null default now(),
  primary key (aluno_email, exercicio_id)
);

-- ---------- funções de apoio ----------
create or replace function meu_email() returns text
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create or replace function eh_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = meu_email())
$$;

create or replace function eh_aluno() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from alunos where email = meu_email())
$$;

create or replace function liberado(ex text) returns boolean
language sql stable security definer set search_path = public as $$
  select eh_aluno() and exists (
    select 1 from liberacoes
    where exercicio_id = ex and (aluno_email is null or aluno_email = meu_email())
  )
$$;

-- O mentorado só pode registrar o próprio aceite (não muda nome nem e-mail)
create or replace function aceitar_privacidade() returns void
language sql security definer set search_path = public as $$
  update alunos set aceite_privacidade = now()
  where email = meu_email() and aceite_privacidade is null
$$;

-- Você define uma nova senha para um mentorado (só administradora)
create or replace function admin_trocar_senha(p_email text, p_senha text) returns void
language plpgsql security definer set search_path = public, extensions, auth as $$
begin
  if not eh_admin() then raise exception 'Sem permissão'; end if;
  if length(coalesce(p_senha, '')) < 6 then raise exception 'A senha precisa ter pelo menos 6 caracteres'; end if;
  update auth.users
     set encrypted_password = extensions.crypt(p_senha, extensions.gen_salt('bf')), updated_at = now()
   where lower(email) = lower(p_email);
  if not found then raise exception 'Esse e-mail ainda não tem login criado'; end if;
end $$;

-- Mostra no painel quais mentorados já têm login criado
create or replace function admin_logins() returns table (email text, ultimo_acesso timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select lower(u.email)::text, u.last_sign_in_at from auth.users u where eh_admin()
$$;

-- ---------- permissões ----------
revoke all on admins, alunos, sessoes, exercicios, liberacoes, respostas, comentarios from anon;
grant select, insert, update, delete
  on admins, alunos, sessoes, exercicios, liberacoes, respostas, comentarios to authenticated;
revoke execute on function eh_admin(), eh_aluno(), liberado(text), aceitar_privacidade(), admin_trocar_senha(text, text), admin_logins() from anon, public;
grant execute on function meu_email(), eh_admin(), eh_aluno(), liberado(text), aceitar_privacidade(), admin_trocar_senha(text, text), admin_logins() to authenticated;

alter table admins      enable row level security;
alter table alunos      enable row level security;
alter table sessoes     enable row level security;
alter table exercicios  enable row level security;
alter table liberacoes  enable row level security;
alter table respostas   enable row level security;
alter table comentarios enable row level security;

do $$
declare t text;
begin
  -- apaga políticas antigas para recriar (permite rodar este arquivo de novo)
  for t in select format('drop policy %I on %I', policyname, tablename)
           from pg_policies where schemaname = 'public'
           and tablename in ('admins','alunos','sessoes','exercicios','liberacoes','respostas','comentarios')
  loop execute t; end loop;
end $$;

-- admins: só você enxerga a tabela
create policy admins_ver on admins for select to authenticated using (eh_admin());

-- alunos: cada um vê a própria linha; você vê e edita todos
create policy alunos_ver   on alunos for select to authenticated using (email = meu_email() or eh_admin());
create policy alunos_admin on alunos for all    to authenticated using (eh_admin()) with check (eh_admin());

-- sessões: qualquer mentorado vê os títulos
create policy sessoes_ver   on sessoes for select to authenticated using (eh_aluno() or eh_admin());
create policy sessoes_admin on sessoes for all    to authenticated using (eh_admin()) with check (eh_admin());

-- exercícios: o mentorado só vê o que foi liberado para ele ou para a turma
create policy exercicios_ver   on exercicios for select to authenticated using (eh_admin() or liberado(id));
create policy exercicios_admin on exercicios for all    to authenticated using (eh_admin()) with check (eh_admin());

-- liberações
create policy liberacoes_ver   on liberacoes for select to authenticated
  using (eh_admin() or (eh_aluno() and (aluno_email is null or aluno_email = meu_email())));
create policy liberacoes_admin on liberacoes for all to authenticated using (eh_admin()) with check (eh_admin());

-- respostas: cada mentorado lê e escreve só as próprias; você lê todas
create policy respostas_ver on respostas for select to authenticated
  using (aluno_email = meu_email() or eh_admin());
create policy respostas_criar on respostas for insert to authenticated
  with check (aluno_email = meu_email() and liberado(exercicio_id));
create policy respostas_editar on respostas for update to authenticated
  using (aluno_email = meu_email())
  with check (aluno_email = meu_email() and liberado(exercicio_id));
create policy respostas_apagar_admin on respostas for delete to authenticated using (eh_admin());

-- comentários: o mentorado lê os dele; só você escreve
create policy comentarios_ver on comentarios for select to authenticated
  using (aluno_email = meu_email() or eh_admin());
create policy comentarios_admin on comentarios for all to authenticated
  using (eh_admin()) with check (eh_admin());

-- ---------- você como administradora ----------
insert into admins (email) values (lower('SEU-EMAIL')) on conflict do nothing;
