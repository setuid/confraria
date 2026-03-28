-- Adiciona coluna senha_texto para exibição no painel admin
-- Somente o service role (Edge Functions) escreve neste campo.

alter table confrarias
  add column if not exists senha_texto text;
