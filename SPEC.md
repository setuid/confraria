# The Cellar — Especificação Completa
**Wine Brotherhood Management App · Speakeasy Edition**
Versão 4.0 — Março 2026

> *"Só para quem foi convidado."*

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Identidade Visual e Linguagem](#2-identidade-visual-e-linguagem)
3. [Modelo de Acesso](#3-modelo-de-acesso)
4. [Painel Admin](#4-painel-admin)
5. [Stack e Arquitetura](#5-stack-e-arquitetura)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [MVP — Escopo e Implementação](#7-mvp--escopo-e-implementação)
8. [Produto Completo — Módulos e Telas](#8-produto-completo--módulos-e-telas)
9. [Funcionalidades Especiais](#9-funcionalidades-especiais)
10. [Arquitetura de Busca de Vinhos](#10-arquitetura-de-busca-de-vinhos)
11. [Navegação](#11-navegação)
12. [Estrutura de Arquivos](#12-estrutura-de-arquivos)
13. [Roadmap](#13-roadmap)

---

## 1. Visão Geral

**Nome:** The Cellar

The Cellar — a adega clandestina. Um lugar que só existe para quem sabe onde procurar. Sem cadastro, sem contas públicas, sem vitrine. Você recebe um link. Você conhece a senha. A porta se abre.

O nome carrega tudo: o mistério de um speakeasy dos anos 20, a elegância de uma adega privada, e a cumplicidade de um círculo de amigos que compartilha algo precioso.

**URL base:** `thecellar.app`

### Propósito

Organizar confrarias de vinho entre amigos — os encontros, os vinhos tomados, as avaliações, as memórias. Tudo num lugar só, acessível apenas para quem foi convidado.

---

## 2. Identidade Visual e Linguagem

### 2.1 Estética: Speakeasy Art Déco

O app vive na tensão entre secreto e sofisticado. Referências:

- Speakeasies americanos dos anos 1920 — Club 21, The Green Mill
- Adegas aristocráticas europeias
- Cartazes de jazz da era proibição
- Cartas de menu de restaurantes franceses antigos

**Não é:** dark mode genérico, app de vinho convencional, clube de luxo esterilizado.
**É:** escuro, quente, íntimo. Como estar num porão elegante às 23h com um Barolo na taça.

### 2.2 Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `--noir` | `#0D0A07` | Fundo principal — quase preto, quente |
| `--cave` | `#161009` | Fundos de cards, superfícies |
| `--brique` | `#1E1510` | Bordas, divisores |
| `--tabac` | `#2A1F10` | Bordas secundárias |
| `--bronze` | `#5C4A2A` | Textos secundários, ornamentos |
| `--ouro` | `#C8973A` | Destaque principal — ouro fosco |
| `--ouro-suave` | `#9A7030` | Hover, ícones |
| `--pergaminho` | `#E8D5B0` | Texto principal |
| `--creme` | `#F2E8D5` | Títulos, texto em destaque |
| `--vinho` | `#6B1F2A` | Erros, status cancelado |
| `--verde-escuro` | `#1A3A2A` | Status realizado |
| `--cinza-quente` | `#4A3B25` | Placeholders, textos terciários |

```css
:root {
  --noir:         #0D0A07;
  --cave:         #161009;
  --brique:       #1E1510;
  --tabac:        #2A1F10;
  --bronze:       #5C4A2A;
  --ouro:         #C8973A;
  --ouro-suave:   #9A7030;
  --pergaminho:   #E8D5B0;
  --creme:        #F2E8D5;
  --vinho:        #6B1F2A;
  --verde-escuro: #1A3A2A;
  --cinza-quente: #4A3B25;

  --font-display: 'Cormorant Garamond', serif;
  --font-ui:      'Josefin Sans', sans-serif;
  --font-body:    'Lora', serif;
}
```

### 2.3 Tipografia

```html
<link href="https://fonts.googleapis.com/css2?
  family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&
  family=Josefin+Sans:wght@200;300;400&
  family=Lora:ital@0;1&display=swap" rel="stylesheet">
```

- **Display — Cormorant Garamond:** nomes de vinho, títulos de encontros, citações. Muito itálico.
- **UI — Josefin Sans:** labels, navegação, badges. Sempre uppercase, letter-spacing: 0.3–0.5em, peso 200–300.
- **Corpo — Lora:** descrições, notas de degustação, textos longos.

### 2.4 Ornamentos Art Déco

Elementos visuais recorrentes em todo o app:

- Losangos dourados como separadores ◆
- Linhas finas horizontais com fade nas extremidades
- Bordas `0.5px solid var(--brique)` com detalhe dourado apenas nas arestas superior e inferior em elementos de destaque
- Números romanos para encontros (I, II, III... XIV)
- Avatares: círculos coloridos com a inicial do apelido, cor única por membro

### 2.5 Regras de Estilo

- Fundo sempre `--noir`. Cards em `--cave`.
- Bordas: `0.5px solid var(--brique)` padrão; `var(--tabac)` para ênfase
- Botões primários: borda `--ouro`, fundo transparente, texto `--ouro`; hover: `rgba(200,151,58,0.08)`
- Números romanos: `--font-display`, cor `--ouro`, peso 300, tamanho generoso
- Separadores: GoldDivider — linha fina com fade + ◆ dourado ao centro

### 2.6 Microcopy

O app fala como um maître discreto de clube privado. Simples, seco — o mistério está na estética, não nas palavras.

| Situação | Texto |
|---|---|
| Campo de senha | "Qual é a senha?" |
| Senha errada | "Senha errada." |
| Campo de apelido | "Como te chamam?" |
| Confirmar presença | "Estarei lá" |
| Recusar presença | "Desta vez não posso" |
| Talvez | "Talvez" |
| Nenhum encontro futuro | "Nada marcado ainda." |
| Vinho sem avaliações | "Ainda sem opinião da turma." |
| Carregando dados IA | "Buscando informações..." |
| Salvo | "Anotado." |
| Sessão expirada | "A porta fechou. Qual é a senha?" |

---

## 3. Modelo de Acesso

### 3.1 Filosofia

Nenhum cadastro. Nenhum e-mail. Nenhuma conta pública. The Cellar existe em silêncio — só aparece para quem tem o link e a senha.

```
thecellar.app/c/quinta-dos-amigos
```

### 3.2 Tela de Entrada — a "Porta"

A tela de entrada é o momento mais importante do app. É onde o clima speakeasy se estabelece.

**Sequência de animação:**

1. Tela começa completamente escura
2. Um losango dourado aparece ao centro, pulsando suavemente
3. "The Cellar" dissolve-se de cima para baixo em Cormorant Garamond
4. Nome da confraria aparece em itálico dentro de uma moldura art déco
5. Aparece: "Qual é a senha?"
6. Campo de senha — placeholder `· · · · · · · ·`

**Após senha correta — primeiro acesso:**
- Fade suave
- "Como te chamam?" → input em itálico, máx 20 chars
- Botão "Entrar"
- Entra no Dashboard

**Após senha correta — acesso recorrente:**
- Entra direto, sem perguntar apelido novamente

**Senha errada:**
- Sem vibração, sem vermelho berrante
- "Senha errada." em bronze, discreta
- Campo limpa. Tudo permanece sereno.

### 3.3 Identidade do Usuário

Sem contas. O usuário é identificado pelo apelido. JWT + apelido salvos em localStorage:

```json
{
  "slug": "quinta-dos-amigos",
  "apelido": "Victor",
  "token": "eyJ...",
  "papel": "membro",
  "cor": "#C8973A",
  "acessoEm": "2026-03-14T22:00:00Z"
}
```

A cor é gerada automaticamente — única por apelido dentro da confraria.

### 3.4 Múltiplas Confrarias

A tela inicial (`thecellar.app/`) mostra as confrarias salvas no localStorage como cartas lacradas — cada uma com nome, apelido do usuário e data do último acesso. Clique entra direto se o JWT ainda for válido.

---

## 4. Painel Admin

**URL:** `thecellar.app/admin`
**Acesso:** senha master via variável de ambiente `VITE_ADMIN_PASSWORD`, comparada localmente no frontend. Sessão salva em `sessionStorage` (expira ao fechar o browser). Nenhum link para `/admin` existe no app.

### Funcionalidades

**Confrarias**
- Listar todas: nome · slug · nº de membros · nº de encontros · ativa/inativa
- Criar: nome, slug (gerado automaticamente, editável), descrição, senha (toggle mostrar/ocultar)
- Editar: todos os campos
- Desativar / reativar
- Após criação: link gerado com botão de copiar — `thecellar.app/c/[slug]`

**Membros** (dentro de uma confraria)
- Listar: apelido · papel · data de adição · ativo/inativo
- Adicionar: apelido + papel
- Editar papel (organizador / membro)
- Desativar / reativar

**Encontros** (dentro de uma confraria)
- Listar: número romano · título · data · status
- Criar: título, tema, descrição, data/hora, local (nome + endereço), status
- Número romano gerado automaticamente em ordem de criação, editável
- Editar e excluir

---

## 5. Stack e Arquitetura

- **Frontend:** React (SPA) — Vite + React Router
- **Hospedagem:** GitHub Pages ou Vercel (gratuito)
- **Banco de dados:** Supabase (PostgreSQL + Storage para fotos)
- **Auth:** sem OAuth — validação de senha via Supabase Edge Function + JWT próprio (30 dias)
- **IA (v1.1+):** Claude API para enriquecimento de vinhos
- **Fontes:** Google Fonts
- **Zero backend customizado**

### Edge Function — Validação de Senha

```typescript
// supabase/functions/validar-senha/index.ts
import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import { create } from "https://deno.land/x/djwt/mod.ts"

serve(async (req) => {
  const { slug, senha } = await req.json()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: confraria } = await supabase
    .from("confrarias")
    .select("id, nome, slug, senha_hash, ativa")
    .eq("slug", slug)
    .eq("ativa", true)
    .single()

  if (!confraria) {
    return new Response(JSON.stringify({ erro: "Confraria não encontrada." }), { status: 404 })
  }

  const senhaCorreta = await bcrypt.compare(senha, confraria.senha_hash)

  if (!senhaCorreta) {
    return new Response(JSON.stringify({ erro: "Senha errada." }), { status: 401 })
  }

  const token = await create(
    { alg: "HS256", typ: "JWT" },
    {
      confraria_id: confraria.id,
      slug: confraria.slug,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
    },
    Deno.env.get("JWT_SECRET")!
  )

  return new Response(
    JSON.stringify({
      token,
      confraria: { id: confraria.id, nome: confraria.nome, slug: confraria.slug }
    }),
    { status: 200 }
  )
})
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD=senha-super-secreta
VITE_WINE_SEARCHER_API_KEY=...   # v1.1+
VITE_CLAUDE_API_KEY=...          # v1.1+
```

---

## 6. Modelo de Dados

```sql
-- Confrarias
confrarias (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome         text NOT NULL,
  slug         text UNIQUE NOT NULL,
  descricao    text,
  logo_url     text,
  senha_hash   text NOT NULL,
  ativa        boolean DEFAULT true,
  criada_em    timestamptz DEFAULT now(),
  configuracoes jsonb
)

-- Membros (identidade leve — apelido, sem conta)
membros (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confraria_id  uuid REFERENCES confrarias ON DELETE CASCADE,
  apelido       text NOT NULL,
  cor           text,
  papel         text CHECK(papel IN ('organizador','membro')) DEFAULT 'membro',
  ativo         boolean DEFAULT true,
  primeiro_acesso timestamptz,
  ultimo_acesso   timestamptz,
  UNIQUE(confraria_id, apelido)
)

-- Encontros
encontros (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confraria_id   uuid REFERENCES confrarias ON DELETE CASCADE,
  numero_romano  text NOT NULL,
  titulo         text NOT NULL,
  tema           text,
  descricao      text,
  data_hora      timestamptz,
  local_nome     text,
  local_endereco text,
  status         text CHECK(status IN (
                   'planejado','confirmado','realizado','cancelado'
                 )) DEFAULT 'planejado',
  criado_por     text,
  notas_pos_encontro text,
  criado_em      timestamptz DEFAULT now()
)

-- Presenças
presencas (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encontro_id   uuid REFERENCES encontros ON DELETE CASCADE,
  confraria_id  uuid REFERENCES confrarias,
  apelido       text NOT NULL,
  status        text CHECK(status IN (
                  'confirmado','recusado','talvez','pendente'
                )) DEFAULT 'pendente',
  atualizado_em timestamptz DEFAULT now(),
  UNIQUE(encontro_id, apelido)
)

-- Vinhos (v1.1+)
vinhos (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                  text NOT NULL,
  produtor              text,
  regiao                text,
  pais                  text,
  tipo                  text CHECK(tipo IN (
                          'tinto','branco','rosé','espumante','sobremesa','fortificado'
                        )),
  uvas                  text[],
  safra                 integer,
  graduacao_alcoolica   numeric,
  temperatura_servico_min integer,
  temperatura_servico_max integer,
  foto_url              text,
  lwin_id               text,
  nota_criticos         integer,
  preco_medio           numeric,
  dados_ia              jsonb,
  dados_ia_gerado_em    timestamptz
)

-- Vinhos de um encontro (v1.1+)
encontro_vinhos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encontro_id    uuid REFERENCES encontros ON DELETE CASCADE,
  vinho_id       uuid REFERENCES vinhos,
  status         text CHECK(status IN (
                   'sugerido','confirmado','tomado','removido'
                 )) DEFAULT 'sugerido',
  ordem          integer,
  preco_pago     numeric,
  quem_trouxe    text,
  notas_contexto text
)

-- Avaliações (v1.1+)
avaliacoes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encontro_vinho_id uuid REFERENCES encontro_vinhos ON DELETE CASCADE,
  confraria_id      uuid REFERENCES confrarias,
  apelido           text NOT NULL,
  nota              integer CHECK(nota BETWEEN 1 AND 100),
  aroma             integer CHECK(aroma BETWEEN 1 AND 5),
  paladar           integer CHECK(paladar BETWEEN 1 AND 5),
  final_boca        integer CHECK(final_boca BETWEEN 1 AND 5),
  notas_livres      text,
  beberia_novamente boolean,
  criado_em         timestamptz DEFAULT now(),
  UNIQUE(encontro_vinho_id, apelido)
)

-- Fotos (v1.1+)
fotos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encontro_id  uuid REFERENCES encontros ON DELETE CASCADE,
  confraria_id uuid REFERENCES confrarias,
  url          text NOT NULL,
  legenda      text,
  enviado_por  text,
  criado_em    timestamptz DEFAULT now()
)

-- LWIN — base local de vinhos (v1.1+)
lwin_wines (
  lwin_id        text PRIMARY KEY,
  display_name   text NOT NULL,
  producer       text,
  region         text,
  sub_region     text,
  country        text,
  colour         text,
  wine_type      text,
  classification text,
  search_vector  tsvector
)
CREATE INDEX ON lwin_wines USING GIN(search_vector);
```

---

## 7. MVP — Escopo e Implementação

### 7.1 O que está no MVP

O MVP valida o núcleo do produto: acesso secreto por senha, gestão pelo admin, e visualização dos encontros pelos membros.

| Funcionalidade | MVP |
|---|---|
| Tela inicial com confrarias salvas | ✅ |
| Tela de entrada speakeasy com senha | ✅ |
| Painel admin — criar/editar confrarias | ✅ |
| Painel admin — gerenciar membros | ✅ |
| Painel admin — criar/editar encontros | ✅ |
| Dashboard do membro | ✅ |
| Lista de encontros (próximos e realizados) | ✅ |
| Detalhe do encontro | ✅ |
| RSVP — confirmar/recusar presença | ✅ |
| Lista de membros | ✅ |
| Catálogo de vinhos | v1.1 |
| Busca de vinhos (LWIN + Wine-Searcher) | v1.1 |
| Avaliações de vinho | v1.1 |
| Enriquecimento por IA (Claude API) | v1.1 |
| Galeria de fotos | v1.1 |
| Modo Degustação | v1.1 |
| Estatísticas | v1.2 |
| Modo Cego | v1.2 |

### 7.2 Telas do MVP

**`/` — Tela Inicial**

Com confrarias no localStorage:
- Cards estilo carta lacrada: nome · apelido · data do último acesso
- Clique → entra direto (JWT válido) ou redireciona para entrada

Sem confrarias:
- Logo + "Tem o link de uma confraria?"
- Input para colar URL ou digitar slug + botão "Entrar"

---

**`/c/[slug]` — Entrada**

Descrita em detalhe na seção 3.2. Animação speakeasy completa.

---

**`/c/[slug]/dashboard` — Dashboard**

Header: nome da confraria · avatar + apelido do usuário · botão sair

**Próximo Encontro** (card de destaque):
- Número romano + título + tema
- Data, hora e local
- Avatares dos confirmados + contagem
- Botões RSVP: "Estarei lá" · "Desta vez não posso" · "Talvez"
- Se nenhum encontro futuro: "Nada marcado ainda."

**Últimos encontros** (até 3, realizados):
- Número romano + título + data
- Link "Ver todos os encontros →"

---

**`/c/[slug]/encontros` — Lista de Encontros**

Tabs: Próximos · Realizados

Card:
- Número romano em ouro
- Título + tema · data e hora · local
- Badge de status: planejado (bronze) · confirmado (ouro) · realizado (verde escuro) · cancelado (vinho)
- Número de confirmados

---

**`/c/[slug]/encontros/[id]` — Detalhe do Encontro**

- Header: número romano grande · título + tema em itálico · data · local · badge de status
- Sua presença: botões RSVP com estado atual do usuário destacado
- Quem vem: avatares + apelidos dos confirmados · contagem: "5 confirmados · 2 pendentes · 1 não pode"
- Sobre esta noite: descrição em Lora itálico · endereço completo

---

**`/c/[slug]/membros` — Membros**

- Avatar colorido com inicial + apelido + papel
- Organizadores: ícone de saca-rolha dourado
- Membros inativos não aparecem

---

**`/admin` — Painel Admin**

Interface funcional (não precisa do clima speakeasy — é ferramenta interna).

- Login: campo de senha master
- Sidebar: lista de confrarias
- Área de conteúdo: abas Confraria · Membros · Encontros

### 7.3 Fluxos do MVP

**Fluxo A — Primeiro acesso de um membro**
```
Recebe o link: thecellar.app/c/quinta-dos-amigos
→ Tela de entrada com animação speakeasy
→ Digita a senha
→ Edge Function valida
→ "Como te chamam?" → digita "Victor"
→ localStorage salva sessão
→ entra no Dashboard
```

**Fluxo B — Acesso recorrente**
```
Abre thecellar.app/
→ Vê card "Quinta dos Amigos · Victor"
→ Clica → JWT válido → Dashboard direto
```

**Fluxo C — Confirmar presença**
```
Dashboard → card do próximo encontro
→ Clica "Estarei lá"
→ Supabase upsert em presencas
→ botão atualiza para estado confirmado
```

**Fluxo D — Admin cria confraria**
```
thecellar.app/admin → senha master
→ "Nova Confraria"
→ nome, slug "quinta-dos-amigos", senha "nebbiolo"
→ Salva → link gerado: thecellar.app/c/quinta-dos-amigos
→ Copia link + senha → envia no grupo do WhatsApp
```

**Fluxo E — Admin cria encontro**
```
Admin → "Quinta dos Amigos" → Encontros → "Novo Encontro"
→ "Noite Italiana" · 29 Mar · Casa do Pedro
→ Número romano gerado: "III"
→ Salva → aparece no Dashboard dos membros
```

### 7.4 Estrutura de Arquivos do MVP

```
the-cellar/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ArtDecoCard.jsx      # Card base — fundo --cave, borda fina
│   │   │   ├── GoldDivider.jsx      # Linha com ◆ dourado ao centro
│   │   │   ├── RomanNumeral.jsx     # Número romano em --ouro
│   │   │   └── MemberAvatar.jsx     # Círculo colorido com inicial
│   │   ├── meeting/
│   │   │   ├── MeetingCard.jsx
│   │   │   └── RsvpButtons.jsx      # "Estarei lá" / "Não posso" / "Talvez"
│   │   └── layout/
│   │       ├── AppShell.jsx
│   │       ├── Sidebar.jsx
│   │       └── BottomBar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Entrada.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Encontros.jsx
│   │   ├── EncontroDetalhe.jsx
│   │   ├── Membros.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminConfraria.jsx
│   │       ├── AdminMembros.jsx
│   │       └── AdminEncontros.jsx
│   ├── hooks/
│   │   ├── useAuth.js               # Validação de senha + localStorage
│   │   ├── useConfraria.js
│   │   ├── useEncontros.js
│   │   ├── usePresenca.js
│   │   └── useAdmin.js
│   ├── lib/
│   │   └── supabase.js
│   ├── router.jsx
│   └── styles/
│       └── tokens.css
├── supabase/
│   ├── migrations/
│   │   └── 001_mvp.sql
│   └── functions/
│       └── validar-senha/
│           └── index.ts
├── .env.example
└── README.md
```

---

## 8. Produto Completo — Módulos e Telas

Telas adicionais além do MVP, implementadas nas versões 1.1 e 1.2.

### 8.1 Dashboard Completo (v1.1)

Além do MVP, adiciona:
- Estatísticas rápidas: encontros realizados · vinhos tomados · membros ativos
- Últimos vinhos: 3 cards com foto, nome, nota média
- Feed de atividade: "André registrou um Barolo 2018", "Pedro confirmou presença no Encontro XIV"

### 8.2 Encontros — Recursos Adicionais (v1.1)

**Detalhe do Encontro** ganha:
- Seção "Os vinhos desta noite": lista com foto, produtor, quem traz, ordem de serviço
- Galeria de fotos do encontro (upload pelo celular)
- Notas pós-encontro do organizador

**Registro Pós-Encontro** (organizadores):
- Marcar como realizado
- Confirmar quais vinhos foram servidos
- Upload de fotos
- Nota geral do encontro

**Planejamento de Encontro — "A Curadoria"** (organizadores):
- Interface para selecionar e ordenar vinhos
- Arrastar para reordenar (ordem de serviço)
- Para cada vinho: foto · dados · nota histórica na confraria · quem traz · preço
- Painel lateral "Sobre este vinho" com dados IA
- Alerta sutil: "Quatro tintos seguidos — considere um branco"
- Botão: "Publicar a lista desta noite"

### 8.3 Membros — Perfil Completo (v1.1)

Perfil de um membro:
- Estatísticas: encontros · vinhos trazidos · nota média dada · nota média recebida
- Estilo de paladar inferido: "Prefere vinhos encorpados e tânicos"
- Histórico de avaliações

### 8.4 Vinhos — "A Adega" (v1.1)

**Catálogo:**
- Filtros: tipo · país · região · safra · nota
- Ordenação: mais recente · melhor veredicto · mais controverso
- Card: foto da garrafa · nome · produtor · nota em formato Parker

**Detalhe do Vinho:**
- Foto da garrafa em formato vertical, fundo escuro
- Nome em Cormorant Garamond grande, produtor em Josefin Sans uppercase
- Tags: região · uvas · safra · graduação
- Bloco "Sobre este vinho" — gerado por IA, fundo levemente mais claro, borda dourada:
  - História do produtor (Lora itálico)
  - Terroir e região
  - Análise da safra
  - Na taça: cor, aromas primários/secundários, textura
  - Harmonizações (4 sugestões)
  - Curiosidades (3 itens com ◆)
  - Janela de consumo: quando beber, pico, guarda máxima
  - Rodapé: "✦ Gerado com IA"
- Veredicto da Confraria: nota média circular · distribuição de notas · avaliações individuais
- Em quais encontros foi servido (com número romano)

**Adicionar Vinho:**
- Campo de busca: nome, produtor ou região
- Busca em cascata (vide seção 10)
- Formulário pré-preenchido — usuário só confirma
- Câmera para foto da garrafa
- Enriquecimento IA em background ao confirmar

**Avaliar Vinho** (modal):
- Slider de nota 1–100 com linha dourada
- Sliders: Aroma · Paladar · Final (1–5)
- Campo "Suas impressões" em Lora itálico
- Toggle "Beberia novamente?"
- Botão "Anotado."

### 8.5 Estatísticas (v1.2)

- Total de encontros · vinhos · litros estimados
- País mais bebido · uva mais amada · safra favorita
- Membro mais assíduo · vinho mais controverso (maior desvio padrão)
- Gráfico de evolução de notas ao longo do tempo
- Mapa de origens dos vinhos

### 8.6 Galeria — "As Memórias" (v1.1)

- Fotos de todos os encontros, navegação por número romano
- "Vinho da Noite" de cada encontro destacado

---

## 9. Funcionalidades Especiais

### 9.1 Modo Degustação (v1.1)

Tela otimizada para uso na mesa durante o encontro.

- Interface mobile-first, fundo escuro total, letras grandes
- Exibe o vinho atual: foto grande, nome em destaque
- Abre diretamente para o modal de avaliação
- Navegação: ‹ anterior · próximo ›
- Mínima distração — como uma carta de menu elegante

### 9.2 Modo Cego (v1.2)

Para degustações onde o prazer está no mistério.

- Organizador ativa o modo cego no encontro
- Vinhos aparecem apenas como "Vinho I", "Vinho II"...
- Membros avaliam sem saber o que bebem
- Organizador clica "Revelar" → animação descobre o vinho
- Comparativo: nota antes vs. nota depois da revelação

---

## 10. Arquitetura de Busca de Vinhos

Implementada na v1.1. O MVP não inclui busca de vinhos.

### 10.1 Visão Geral — Três Camadas em Cascata

Cada vinho é processado uma única vez — os resultados ficam em cache no Supabase para sempre.

```
Usuário digita "Barolo Bussia Conterno"
        │
        ▼
[Camada 1] LWIN local (Supabase full-text)
  → nome canônico, produtor, região, país, tipo, lwin_id
  → sem custo, sem latência, sem limite
        │
        ▼
[Camada 2] Wine-Searcher API (1 call por vinho)
  → nota de críticos, uvas, graduação, faixa de preço
  → 100 calls/dia gratuitas
        │
        ▼
Usuário fotografa a garrafa com o celular
  → upload para Supabase Storage
        │
        ▼
Usuário confirma → vinho salvo
        │
        ▼
[Camada 3] Claude API — assíncrono, background
  → produtor, terroir, safra, aromas, harmonizações,
    curiosidades, janela de consumo
  → salvo em vinhos.dados_ia
```

### 10.2 Camada 1 — LWIN (Liv-ex)

A maior base open-source de vinhos do mundo: mais de 200 mil rótulos, licença Creative Commons, gratuita para sempre. Funciona como o ISBN do vinho.

- Baixar CSV em `liv-ex.com/lwin` e importar para tabela `lwin_wines` no Supabase
- Campos: `lwin_id`, `display_name`, `producer`, `region`, `sub_region`, `country`, `colour`, `type`, `classification`
- Busca via `to_tsvector` + índice GIN — instantânea, offline-capable
- Atualizar o CSV manualmente a cada 6 meses

### 10.3 Camada 2 — Wine-Searcher API

- Chamada única por vinho: `GET ?api_key=KEY&winename={nome}&vintage={safra}&format=json`
- Retorna: `score`, `grape`, `region`, `price-average`, `price-min`, `price-max`, `abv`
- Trial gratuito: 100 calls/dia — suficiente para o volume de uma confraria
- Resultado salvo em cache — nunca reprocessa o mesmo vinho+safra

### 10.4 Camada 3 — Claude API (Prompt)

```
Sistema: Você é um sommelier especialista, historiador de vinhos e escritor elegante.
Responda sempre em português brasileiro. Responda APENAS com JSON válido, sem markdown.

Usuário: Forneça informações ricas sobre este vinho:
  Nome: {nome} | Produtor: {produtor} | Região: {regiao}, {pais}
  Uvas: {uvas} | Safra: {safra} | Nota de críticos: {nota_criticos}/100

{
  "resumo_produtor": "3-4 frases sobre história e filosofia do produtor",
  "descricao_terroir": "2-3 frases sobre região, solo e clima",
  "analise_safra": "2-3 frases sobre condições e qualidade da safra {safra}",
  "como_no_copo": {
    "cor": "descrição precisa da cor",
    "aromas_primarios": ["...", "...", "..."],
    "aromas_secundarios": ["...", "..."],
    "textura": "taninos, acidez, corpo e final"
  },
  "harmonizacoes": [
    { "prato": "...", "explicacao": "1 frase" },
    { "prato": "...", "explicacao": "1 frase" },
    { "prato": "...", "explicacao": "1 frase" },
    { "prato": "...", "explicacao": "1 frase" }
  ],
  "curiosidades": [
    "curiosidade histórica ou única",
    "algo surpreendente sobre a safra ou terroir",
    "detalhe técnico ou cultural pouco conhecido"
  ],
  "janela_consumo": {
    "beber_a_partir_de": 2024,
    "pico_de": 2026,
    "pico_ate": 2032,
    "guarda_maxima": 2040,
    "observacao": "Ainda jovem — decante por 2h antes de servir"
  }
}
```

### 10.5 Hook `useVinhoSearch.js`

```javascript
export function useVinhoSearch() {

  async function searchLWIN(query) {
    const { data } = await supabase
      .from('lwin_wines')
      .select('*')
      .textSearch('search_vector', query)
      .limit(8)
    return data
  }

  async function enrichWithWineSearcher(wineName, vintage) {
    const res = await fetch(
      `https://www.wine-searcher.com/api/v1/wine?api_key=${KEY}` +
      `&winename=${encodeURIComponent(wineName)}&vintage=${vintage}&format=json`
    )
    const data = await res.json()
    return {
      nota_criticos: data.score,
      uvas: data.grape,
      graduacao: data.abv,
      preco_medio: data['price-average'],
      preco_min: data['price-min'],
      preco_max: data['price-max'],
    }
  }

  async function saveAndEnrich(wineData) {
    const { data: vinho } = await supabase
      .from('vinhos')
      .insert(wineData)
      .select()
      .single()
    enrichWithClaude(vinho) // assíncrono, não bloqueia UI
    return vinho
  }

  return { searchLWIN, enrichWithWineSearcher, saveAndEnrich }
}
```

### 10.6 Custo Estimado

| Fonte | Custo | Limite |
|---|---|---|
| LWIN (CSV local) | Gratuito para sempre | Ilimitado |
| Wine-Searcher API | Gratuito | 100 calls/dia |
| Claude API | ~$0,003/vinho | Por uso — centavos/mês |
| Supabase storage | Gratuito até 1 GB | ~500 fotos |

---

## 11. Navegação

### Mobile — Bottom Bar

MVP:
```
[Início]  [Encontros]  [Membros]
```

v1.1+:
```
[Início]  [Encontros]  [A Adega]  [Stats]  [⚙]
```

### Desktop — Sidebar

MVP: Dashboard · Encontros · Membros

v1.1+: Dashboard · Encontros · A Adega · Estatísticas · Configurações

- Logo The Cellar no topo
- Switcher de confraria (se múltiplas)
- Avatar + apelido do usuário no rodapé + botão sair

---

## 12. Estrutura de Arquivos (Produto Completo)

```
the-cellar/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ArtDecoCard.jsx
│   │   │   ├── GoldDivider.jsx
│   │   │   ├── RomanNumeral.jsx
│   │   │   ├── TastingScore.jsx        # Medidor circular 1–100
│   │   │   └── MemberAvatar.jsx
│   │   ├── wine/
│   │   │   ├── WineCard.jsx
│   │   │   ├── WineDetail.jsx
│   │   │   ├── AIWinePanel.jsx         # Bloco "Sobre este vinho"
│   │   │   └── WineRating.jsx
│   │   ├── meeting/
│   │   │   ├── MeetingCard.jsx
│   │   │   ├── RsvpButtons.jsx
│   │   │   ├── TastingMode.jsx         # Modo Degustação
│   │   │   └── BlindMode.jsx           # Modo Cego
│   │   └── layout/
│   │       ├── AppShell.jsx
│   │       ├── Sidebar.jsx
│   │       └── BottomBar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Entrada.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Encontros.jsx
│   │   ├── EncontroDetalhe.jsx
│   │   ├── Membros.jsx
│   │   ├── Adega.jsx                   # v1.1+
│   │   ├── VinhoDetalhe.jsx            # v1.1+
│   │   ├── Estatisticas.jsx            # v1.2+
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminConfraria.jsx
│   │       ├── AdminMembros.jsx
│   │       └── AdminEncontros.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useConfraria.js
│   │   ├── useEncontros.js
│   │   ├── usePresenca.js
│   │   ├── useAdmin.js
│   │   ├── useVinho.js                 # v1.1+
│   │   ├── useVinhoSearch.js           # v1.1+ busca em cascata
│   │   └── useIA.js                    # v1.1+ Claude API
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── claude.js                   # v1.1+
│   │   ├── wineSearch.js               # v1.1+ Wine-Searcher wrapper
│   │   └── lwin.js                     # v1.1+ busca local LWIN
│   ├── router.jsx
│   └── styles/
│       ├── tokens.css
│       └── artdeco.css
├── supabase/
│   ├── migrations/
│   │   ├── 001_mvp.sql
│   │   └── 002_vinhos_avaliacoes.sql   # v1.1+
│   └── functions/
│       └── validar-senha/
│           └── index.ts
├── .env.example
└── README.md
```

---

## 13. Roadmap

### v1.0 — MVP · A Entrada
- ✅ Tela de entrada com animação speakeasy
- ✅ Auth por URL + senha + apelido (sem OAuth)
- ✅ Painel admin — confrarias, membros, encontros
- ✅ Dashboard do membro
- ✅ Lista e detalhe de encontros
- ✅ RSVP — confirmar/recusar presença
- ✅ Lista de membros
- ✅ Múltiplas confrarias no localStorage

### v1.1 — A Adega
- Catálogo de vinhos
- Busca em cascata: LWIN + Wine-Searcher + Claude API
- Avaliações individuais de vinho
- Bloco "Sobre este vinho" gerado por IA
- Janela de consumo
- Foto da garrafa via câmera
- Galeria de fotos dos encontros
- Modo Degustação
- Planejamento de encontro (curadoria)
- Dashboard completo com feed de atividade

### v1.2 — O Ritual
- Estatísticas da confraria
- Mapa de origens dos vinhos
- Modo Cego com revelação dramática

---

*The Cellar · Especificação v4.0 · Só para quem foi convidado.*
