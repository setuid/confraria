-- Adiciona coluna de ordem de apresentação dos vinhos no encontro
alter table garrafas add column if not exists ordem integer;
