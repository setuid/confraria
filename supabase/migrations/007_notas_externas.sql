create table notas_externas (
  id             uuid primary key default gen_random_uuid(),
  garrafa_id     uuid not null references garrafas(id) on delete cascade,
  fonte          text not null,
  pontuacao      text,
  notas          text,
  url            text,
  adicionado_por text not null,
  criado_em      timestamptz default now()
);

alter table notas_externas enable row level security;
create policy "select notas_externas" on notas_externas for select using (true);
create policy "insert notas_externas" on notas_externas for insert with check (true);
create policy "delete notas_externas" on notas_externas for delete using (true);
