-- Fotos dos encontros (máx. 5 por encontro)
create table encontro_fotos (
  id           uuid primary key default gen_random_uuid(),
  encontro_id  uuid references encontros on delete cascade,
  url          text not null,
  apelido      text not null,
  criado_em    timestamptz default now()
);

alter table encontro_fotos enable row level security;

create policy "Fotos de encontro visíveis para todos"
  on encontro_fotos for select using (true);

create policy "Membros podem adicionar fotos de encontro"
  on encontro_fotos for insert with check (true);

create policy "Membros podem apagar fotos de encontro"
  on encontro_fotos for delete using (true);

create index on encontro_fotos (encontro_id);
