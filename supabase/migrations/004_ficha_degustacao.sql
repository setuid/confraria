-- Adiciona coluna JSONB para ficha de degustação estruturada
-- A coluna nota existente permanece para cálculo rápido de médias
alter table avaliacoes add column if not exists ficha jsonb;
