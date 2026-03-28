-- ─── The Cellar — Garrafas, Avaliações e Comentários ────────────────────────

-- Garrafas levadas aos encontros
create table garrafas (
  id           uuid primary key default gen_random_uuid(),
  encontro_id  uuid references encontros on delete cascade,
  confraria_id uuid references confrarias,
  apelido      text not null,
  nome         text not null,
  produtor     text,
  safra        integer,
  regiao       text,
  tipo         text check (tipo in ('tinto','branco','rosé','espumante','sobremesa','outro')),
  foto_url     text,
  notas_dono   text,
  criado_em    timestamptz default now()
);

alter table garrafas enable row level security;

create policy "Garrafas visíveis para todos"
  on garrafas for select using (true);

create policy "Qualquer membro pode inserir garrafa"
  on garrafas for insert with check (true);

create policy "Membro pode atualizar sua garrafa"
  on garrafas for update using (true);

create index on garrafas (encontro_id);

-- Avaliações (1 por membro por garrafa, upsert)
create table avaliacoes (
  id         uuid primary key default gen_random_uuid(),
  garrafa_id uuid references garrafas on delete cascade,
  apelido    text not null,
  nota       numeric(2,1) check (nota >= 0 and nota <= 5),
  criado_em  timestamptz default now(),
  unique(garrafa_id, apelido)
);

alter table avaliacoes enable row level security;

create policy "Avaliações visíveis para todos"
  on avaliacoes for select using (true);

create policy "Qualquer membro pode avaliar"
  on avaliacoes for insert with check (true);

create policy "Membro pode atualizar sua avaliação"
  on avaliacoes for update using (true);

create index on avaliacoes (garrafa_id);

-- Comentários
create table comentarios (
  id         uuid primary key default gen_random_uuid(),
  garrafa_id uuid references garrafas on delete cascade,
  apelido    text not null,
  texto      text not null,
  criado_em  timestamptz default now()
);

alter table comentarios enable row level security;

create policy "Comentários visíveis para todos"
  on comentarios for select using (true);

create policy "Qualquer membro pode comentar"
  on comentarios for insert with check (true);

create index on comentarios (garrafa_id);

-- ─── Storage ─────────────────────────────────────────────────────────────────
-- Execute no dashboard do Supabase → Storage → New bucket:
--   Nome: garrafas-fotos  |  Public: true
--
-- Depois, adicione esta policy de INSERT no bucket:
--   create policy "Membros podem fazer upload de fotos"
--     on storage.objects for insert
--     with check (bucket_id = 'garrafas-fotos');
