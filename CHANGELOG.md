# Changelog — The Cellar

Registo das principais alterações da aplicação.

---

## v1.3 — Fotos, Impressão e Acessibilidade
*Março 2026*

### Novas funcionalidades
- **Fotos do encontro** — Cada encontro pode ter até 5 fotos gerais. Upload directo, lightbox ao clicar, apagar por quem enviou.
- **Ficha de degustação imprimível (A4)** — Botão "⎙ Imprimir fichas" no encontro abre uma página editorial com todos os vinhos e fichas dos membros, formatada para impressão em A4. O diálogo de impressão abre automaticamente.
- **Apagar vinho** — O membro que adicionou um vinho pode apagá-lo. Fichas, avaliações e comentários são removidos em cascata. Foto apagada do Storage.
- **Gerir foto do vinho** — Trocar ou remover a foto de um vinho directamente no detalhe (apenas o dono).
- **Navegação do Dashboard** — Clicar no próximo encontro ou nos últimos encontros leva ao detalhe.

### Correcções
- Mensagens de estado vazio coerentes por contexto ("Nenhum encontro próximo agendado.", "Nenhum encontro realizado ainda.", etc.)
- Terminologia: "apelido" substituído por "Nome" em todos os textos visíveis.

---

## v1.2 — Acessibilidade
*Março 2026*

### Melhorias
- **Contraste de cores** — Tokens `--bronze` e `--cinza-quente` actualizados para ratio ≥ 4.5:1 (WCAG AA).
- **Tamanhos de toque** — Todos os botões interactivos com `min-height: 44px`; chips de cor 44 px; botões de escala 44 px.
- **Foco visível** — Regra `:focus-visible` global com outline dourado.
- **Movimento reduzido** — `prefers-reduced-motion` desactiva todas as animações/transições.
- **Teclado** — `StarRating` totalmente navegável por teclado (setas, Home, End) com `role="slider"`.
- **ARIA** — `aria-pressed` em chips e botões de grupo; `aria-label` nos chips de cor; `aria-hidden` nos SVG decorativos; `aria-expanded` no "Ver ficha"; `role="status"` nos estados de carregamento.
- **Fontes** — Tamanhos mínimos aumentados de 9–10 px para 11–12 px.

---

## v1.1 — Vinhos e Fichas de Degustação
*Fevereiro 2026*

### Novas funcionalidades
- **Garrafas por encontro** — Qualquer membro pode registar vinhos num encontro (nome, produtor, safra, região, tipo, notas pessoais, foto).
- **Avaliação com estrelas** — Classificação de 0–5 estrelas com meias estrelas, por membro por vinho.
- **Ficha de degustação (WSET simplificado)** — Formulário estruturado em 4 secções:
  - *Visual*: cor (10 chips coloridos), intensidade, limpidez
  - *Nariz*: intensidade + 8 grupos de aromas com selecção múltipla
  - *Boca*: doçura, acidez (1–5), tanino (1–5), corpo, final
  - *Conclusão*: nota geral, potencial de guarda, notas livres
- **Vista da ficha** — Leitura elegante da ficha preenchida com ponto de cor, escalas em pontos, chips de aroma dourados.
- **Fichas dos membros** — No detalhe de cada vinho, cada membro pode expandir a ficha dos outros.

---

## v1.0 — Base da Aplicação
*Janeiro–Fevereiro 2026*

### Funcionalidades iniciais
- **Multi-confraria** — Cada confraria tem o seu URL (`/c/slug`), senha de acesso e membros próprios.
- **Autenticação por senha + nome** — Sem registo; entrada por senha da confraria + nome escolhido, sessão em `localStorage`.
- **Encontros** — Lista de próximos e realizados; detalhe com título, tema, data, local, descrição.
- **RSVP** — Confirmar, recusar ou ficar pendente num encontro. Contagem de confirmados com avatares.
- **Membros** — Lista de membros activos e inativos com avatar gerado por cor determinística.
- **Dashboard** — Próximo encontro com RSVP em destaque; últimos encontros realizados.
- **Painel de administração** — Protegido por login separado; gestão de confrarias, membros (adicionar, editar, desativar, excluir) e senha de acesso.
- **Senha da confraria** — Visível em texto no admin para partilha fácil, guardada com hash bcrypt via Edge Function.
- **Link de convite** — URL completo da confraria gerado automaticamente no admin.
- **Ícone / PWA** — Ícone de garrafa de vinho dourada; manifest para instalação como web app.
- **Design art déco** — Paleta escura com dourado, tipografia editorial (Cormorant Garamond, Josefin Sans, Lora), divisores e numerais romanos.
- **Mobile first** — Interface responsiva; admin com padrão master-detail em mobile.
