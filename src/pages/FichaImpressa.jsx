import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import styles from './FichaImpressa.module.css'

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function formatarDataExt(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

const ROMANOS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII']

const CORES = [
  { valor: 'violeta', label: 'Violeta', hex: '#4A1060' },
  { valor: 'púrpura', label: 'Púrpura', hex: '#6B1878' },
  { valor: 'rubi',    label: 'Rubi',    hex: '#9B1B30' },
  { valor: 'cereja',  label: 'Cereja',  hex: '#A8253A' },
  { valor: 'granada', label: 'Granada', hex: '#7B2D3E' },
  { valor: 'carmim',  label: 'Carmim',  hex: '#C8003E' },
  { valor: 'tijolo',  label: 'Tijolo',  hex: '#9B4A3A' },
  { valor: 'palha',   label: 'Palha',   hex: '#D4C87A' },
  { valor: 'dourado', label: 'Dourado', hex: '#C8A830' },
  { valor: 'âmbar',   label: 'Âmbar',   hex: '#C8703A' },
  { valor: 'rosé',    label: 'Rosé',    hex: '#E8A8A8' },
  { valor: 'salmão',  label: 'Salmão',  hex: '#E87060' },
  { valor: 'cerise',  label: 'Cerise',  hex: '#C84060' },
]

const GRUPOS_AROMA = [
  { grupo: 'Frutos Vermelhos', aromas: ['morango', 'cereja', 'framboesa', 'romã', 'groselha', 'geleia', 'compota'] },
  { grupo: 'Frutos Negros',    aromas: ['amora', 'mirtilo', 'ameixa', 'cassis', 'gros. preta', 'figo', 'passa'] },
  { grupo: 'Frutos Tropicais', aromas: ['abacaxi', 'manga', 'maracujá', 'banana', 'lichia', 'goiaba'] },
  { grupo: 'Cítricos',         aromas: ['limão', 'lima', 'toranja', 'laranja', 'bergamota'] },
  { grupo: 'Florais',          aromas: ['rosa', 'violeta', 'lavanda', 'flor branca', 'jasmim', 'peônia'] },
  { grupo: 'Herbáceos',        aromas: ['hortelã', 'eucalipto', 'ervas frescas', 'pimentão', 'tomilho', 'alecrim'] },
  { grupo: 'Especiarias',      aromas: ['pimenta', 'p. branca', 'canela', 'cravo', 'noz-mosc.', 'alcaçuz', 'anis'] },
  { grupo: 'Terra / Mineral',  aromas: ['mineral', 'pedra', 'terra', 'couro', 'cogumelo', 'trufa', 'grafite'] },
  { grupo: 'Madeira / Carvalho', aromas: ['baunilha', 'cedro', 'tostado', 'defumado', 'café', 'chocolate', 'tabaco', 'carvalho'] },
  { grupo: 'Outros',           aromas: ['mel', 'amanteigado', 'brioche', 'levedura', 'caramelo'] },
]

function Circulo() {
  return <span className={styles.circulo} />
}

function Checkbox() {
  return <span className={styles.checkbox} />
}

function BlocoVinho({ garrafa, index }) {
  const romano = ROMANOS[index] ?? String(index + 1)

  return (
    <div className={styles.blocoVinho}>
      {/* ── Cabeçalho do vinho ── */}
      <div className={styles.vinhoHeader}>
        <span className={styles.vinhoRomano}>VINHO {romano}</span>
        {!garrafa.cego && (
          <span className={styles.vinhoNome}>
            {[garrafa.nome, garrafa.produtor, garrafa.safra, garrafa.regiao]
              .filter(Boolean)
              .join('  ·  ')}
          </span>
        )}
      </div>

      {/* ── VISUAL ── */}
      <div className={styles.secao}>
        <div className={styles.secaoTitulo}>VISUAL</div>

        <div className={styles.campo}>
          <span className={styles.campoLabel}>Cor</span>
          <div className={styles.coresGrid}>
            {CORES.map((c) => (
              <span key={c.valor} className={styles.corItem}>
                <span className={styles.corBox} style={{ background: c.hex }} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.campoRow}>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Intensidade</span>
            <div className={styles.opcoes}>
              {['Pálido', 'Médio', 'Profundo'].map((o) => (
                <span key={o} className={styles.opcaoItem}><Circulo /> {o}</span>
              ))}
            </div>
          </div>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Limpidez</span>
            <div className={styles.opcoes}>
              {['Límpido', 'Turvo'].map((o) => (
                <span key={o} className={styles.opcaoItem}><Circulo /> {o}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── NARIZ ── */}
      <div className={styles.secao}>
        <div className={styles.secaoTitulo}>NARIZ</div>

        <div className={styles.campo}>
          <span className={styles.campoLabel}>Intensidade</span>
          <div className={styles.opcoes}>
            {['Fechado', 'Sutil', 'Médio', 'Pronunciado'].map((o) => (
              <span key={o} className={styles.opcaoItem}><Circulo /> {o}</span>
            ))}
          </div>
        </div>

        <div className={styles.campo}>
          <span className={styles.campoLabel}>Aromas</span>
          <div className={styles.aromasGrupos}>
            {GRUPOS_AROMA.map(({ grupo, aromas }) => (
              <div key={grupo} className={styles.aromaLinha}>
                <span className={styles.aromaGrupoLabel}>{grupo}</span>
                <span className={styles.aromaItens}>
                  {aromas.map((a) => (
                    <span key={a} className={styles.aromaItem}><Checkbox /> {a}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOCA ── */}
      <div className={styles.secao}>
        <div className={styles.secaoTitulo}>BOCA</div>

        <div className={styles.campoRow}>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Doçura</span>
            <div className={styles.opcoes}>
              {['Seco', 'Meio-seco', 'Doce'].map((o) => (
                <span key={o} className={styles.opcaoItem}><Circulo /> {o}</span>
              ))}
            </div>
          </div>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Corpo</span>
            <div className={styles.opcoes}>
              {['Leve', 'Médio', 'Encorpado'].map((o) => (
                <span key={o} className={styles.opcaoItem}><Circulo /> {o}</span>
              ))}
            </div>
          </div>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Final</span>
            <div className={styles.opcoes}>
              {['Curto', 'Médio', 'Longo'].map((o) => (
                <span key={o} className={styles.opcaoItem}><Circulo /> {o}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.campoRow}>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Acidez</span>
            <div className={styles.escalaOpcoes}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={styles.opcaoItem}><Circulo /> {n}</span>
              ))}
              <span className={styles.escalaHint}>(baixa → alta)</span>
            </div>
          </div>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Tanino</span>
            <div className={styles.escalaOpcoes}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={styles.opcaoItem}><Circulo /> {n}</span>
              ))}
              <span className={styles.escalaHint}>(suave → firme)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONCLUSÃO ── */}
      <div className={styles.secao}>
        <div className={styles.secaoTitulo}>CONCLUSÃO</div>

        <div className={styles.campoRow}>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Nota</span>
            <span className={styles.notaEstrelas}>★ ★ ★ ★ ★&nbsp;&nbsp; _____ / 5</span>
          </div>
          <div className={styles.campo}>
            <span className={styles.campoLabel}>Potencial de guarda</span>
            <div className={styles.opcoes}>
              {['Agora', '1–3a', '3–7a', '7–12a', '12–20a', '20+a'].map((o) => (
                <span key={o} className={styles.opcaoItem}><Circulo /> {o}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.campo}>
          <span className={styles.campoLabel}>Notas pessoais</span>
          <div className={styles.linhasNotas}>
            <div className={styles.linhaEscrita} />
            <div className={styles.linhaEscrita} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FichaImpressa() {
  const { slug, id } = useParams()
  const [encontro, setEncontro] = useState(null)
  const [confraria, setConfraria] = useState(null)
  const [garrafas, setGarrafas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [{ data: enc }, { data: conf }, { data: garr }] = await Promise.all([
        supabase.from('encontros').select('*').eq('id', id).single(),
        supabase.from('confrarias').select('nome').eq('slug', slug).single(),
        supabase.from('garrafas').select('*').eq('encontro_id', id)
          .order('ordem', { ascending: true, nullsFirst: false })
          .order('criado_em', { ascending: true }),
      ])
      setEncontro(enc)
      setConfraria(conf)
      setGarrafas(garr || [])
      setCarregando(false)
    }
    carregar()
  }, [id, slug])

  useEffect(() => {
    if (!carregando && encontro) {
      const t = setTimeout(() => window.print(), 800)
      return () => clearTimeout(t)
    }
  }, [carregando, encontro])

  if (carregando) return <div className={styles.loading}>A preparar fichas…</div>
  if (!encontro)  return <div className={styles.loading}>Encontro não encontrado.</div>

  return (
    <div className={styles.pagina}>

      {/* ── Cabeçalho ── */}
      <header className={styles.cabecalho}>
        <div className={styles.cabEsq}>
          <div className={styles.logoMarca}>◆ The Cellar</div>
          {confraria && <div className={styles.confNome}>{confraria.nome}</div>}
        </div>
        <div className={styles.cabDir}>
          {encontro.numero_romano && (
            <div className={styles.encNum}>Encontro {encontro.numero_romano}</div>
          )}
          {encontro.data_hora && (
            <div className={styles.encData}>{formatarDataExt(encontro.data_hora)}</div>
          )}
        </div>
      </header>

      <div className={styles.dividerOuro} />

      <div className={styles.tituloArea}>
        <h1 className={styles.titulo}>{encontro.titulo}</h1>
        {encontro.tema && <p className={styles.tema}>{encontro.tema}</p>}
      </div>

      <div className={styles.nomeLinha}>
        <span className={styles.nomeRotulo}>Nome</span>
        <span className={styles.nomeTracejado} />
      </div>

      <div className={styles.dividerFino} />

      {/* ── Vinhos ── */}
      {garrafas.map((g, i) => (
        <BlocoVinho key={g.id} garrafa={g} index={i} />
      ))}

      <footer className={styles.rodape}>
        ◆ The Cellar · {confraria?.nome}
      </footer>
    </div>
  )
}
