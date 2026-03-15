-- ─── The Cellar — MVP Migration ─────────────────────────────────────────────
-- Execute no SQL Editor do Supabase ou via `supabase db push`

-- Extensão para UUID
create extension if not exists "pgcrypto";

-- ─── Confrarias ──────────────────────────────────────────────────────────────

create table confrarias (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  slug          text unique not null,
  descricao     text,
  logo_url      text,
  senha_hash    text not null,
  ativa         boolean default true,
  criada_em     timestamptz default now(),
  configuracoes jsonb
);

-- RLS: apenas a Edge Function (service role) pode ler senha_hash
alter table confrarias enable row level security;

create policy "Leitura pública de confrarias ativas (sem senha_hash)"
  on confrarias for select
  using (ativa = true);

-- ─── Membros ─────────────────────────────────────────────────────────────────

create table membros (
  id              uuid primary key default gen_random_uuid(),
  confraria_id    uuid references confrarias on delete cascade,
  apelido         text not null,
  cor             text,
  papel           text check (papel in ('organizador', 'membro')) default 'membro',
  ativo           boolean default true,
  primeiro_acesso timestamptz,
  ultimo_acesso   timestamptz,
  unique (confraria_id, apelido)
);

alter table membros enable row level security;

create policy "Membros visíveis para todos autenticados da confraria"
  on membros for select
  using (ativo = true);

create policy "Admin pode tudo em membros"
  on membros for all
  using (true)
  with check (true);

-- ─── Encontros ───────────────────────────────────────────────────────────────

create table encontros (
  id                 uuid primary key default gen_random_uuid(),
  confraria_id       uuid references confrarias on delete cascade,
  numero_romano      text not null,
  titulo             text not null,
  tema               text,
  descricao          text,
  data_hora          timestamptz,
  local_nome         text,
  local_endereco     text,
  status             text check (status in (
                       'planejado', 'confirmado', 'realizado', 'cancelado'
                     )) default 'planejado',
  criado_por         text,
  notas_pos_encontro text,
  criado_em          timestamptz default now()
);

alter table encontros enable row level security;

create policy "Encontros visíveis para todos"
  on encontros for select
  using (true);

create policy "Admin pode tudo em encontros"
  on encontros for all
  using (true)
  with check (true);

-- ─── Presenças ───────────────────────────────────────────────────────────────

create table presencas (
  id            uuid primary key default gen_random_uuid(),
  encontro_id   uuid references encontros on delete cascade,
  confraria_id  uuid references confrarias,
  apelido       text not null,
  status        text check (status in (
                  'confirmado', 'recusado', 'talvez', 'pendente'
                )) default 'pendente',
  atualizado_em timestamptz default now(),
  unique (encontro_id, apelido)
);

alter table presencas enable row level security;

create policy "Presenças visíveis para todos"
  on presencas for select
  using (true);

create policy "Qualquer um pode upsert presença"
  on presencas for insert
  with check (true);

create policy "Qualquer um pode atualizar presença"
  on presencas for update
  using (true);

-- ─── Índices ─────────────────────────────────────────────────────────────────

create index on encontros (confraria_id, data_hora);
create index on presencas (encontro_id);
create index on membros (confraria_id);
