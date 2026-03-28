-- Permite que membros apaguem garrafas
create policy "Membro pode apagar sua garrafa"
  on garrafas for delete using (true);
