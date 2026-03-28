import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import styles from './EncontroPrint.module.css'

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function formatarDataExt(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

const TIPO_LABELS = {
  tinto: 'Tinto', branco: 'Branco', rosé: 'Rosé',
  espumante: 'Espumante', sobremesa: 'Sobremesa', outro: 'Outro',
}

const COR_HEX = {
  púrpura: '#5C1A6B', rubi: '#9B1B30', granada: '#7B2D3E',
  carmim: '#C8003E', tijolo: '#9B4A3A', âmbar: '#C8973A',
  dourado: '#C8B400', palha: '#D4C87A', rosé: '#E8A0A0', salmão: '#E87060',
}

const POTENCIAL_LABELS = {
  agora: 'Beber agora', '1-3': '1–3 anos', '3-5': '3–5 anos', '5+': '5+ anos',
}

function Estrelas({ nota, size = 'md' }) {
  if (nota == null) return null
  const total = 5
  const filled = Math.floor(nota)
  const half = nota - filled >= 0.5
  return (
    <span className={`${styles.estrelas} ${styles[`estrelas_${size}`]}`}>
      {Array.from({ length: total }, (_, i) => {
        if (i < filled) return <span key={i} className={styles.estrelaCheio}>★</span>
        if (i === filled && half) return <span key={i} className={styles.estrelaMetade}>★</span>
        return <span key={i} className={styles.estrelaVazio}>☆</span>
      })}
      <span className={styles.notaNum}>{Number(nota).toFixed(1)}</span>
    </span>
  )
}

function Escala({ valor, max = 5 }) {
  return (
    <span className={styles.escala}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < valor ? styles.escalaPonto : styles.escalaVazio}>●</span>
      ))}
    </span>
  )
}

function FichaCard({ avaliacao }) {
  const f = avaliacao.ficha
  const aromas = f?.nariz?.aromas || []

  return (
    <div className={styles.fichaCard}>
      {/* Cabeçalho do membro */}
      <div className={styles.fichaHead}>
        <div className={styles.fichaInicial}>{avaliacao.apelido[0]?.toUpperCase()}</div>
        <div className={styles.fichaHeadInfo}>
          <span className={styles.fichaMembro}>{avaliacao.apelido}</span>
          {avaliacao.nota != null && <Estrelas nota={avaliacao.nota} size="sm" />}
        </div>
      </div>

      {f ? (
        <div className={styles.fichaBody}>
          {/* Visual */}
          {(f.visual?.cor || f.visual?.intensidade || f.visual?.limpidez) && (
            <div className={styles.fichaSecao}>
              <p className={styles.fichaSecTitulo}>Visual</p>
              <div className={styles.fichaVisual}>
                {f.visual.cor && (
                  <span
                    className={styles.corBolinha}
                    style={{ background: COR_HEX[f.visual.cor] || '#888' }}
                    title={f.visual.cor}
                  />
                )}
                <span className={styles.fichaTexto}>
                  {[f.visual.cor, f.visual.intensidade, f.visual.limpidez].filter(Boolean).join(' · ')}
                </span>
              </div>
            </div>
          )}

          {/* Nariz */}
          {(f.nariz?.intensidade || aromas.length > 0) && (
            <div className={styles.fichaSecao}>
              <p className={styles.fichaSecTitulo}>Nariz</p>
              {f.nariz?.intensidade && (
                <p className={styles.fichaTexto}>{f.nariz.intensidade}</p>
              )}
              {aromas.length > 0 && (
                <div className={styles.aromasWrap}>
                  {aromas.map((a) => (
                    <span key={a} className={styles.aromaChip}>{a}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Boca */}
          {(f.boca?.doçura || f.boca?.acidez || f.boca?.tanino || f.boca?.corpo || f.boca?.final) && (
            <div className={styles.fichaSecao}>
              <p className={styles.fichaSecTitulo}>Boca</p>
              {(f.boca.doçura || f.boca.corpo) && (
                <p className={styles.fichaTexto}>
                  {[f.boca.doçura, f.boca.corpo].filter(Boolean).join(' · ')}
                </p>
              )}
              {f.boca.acidez != null && (
                <div className={styles.fichaEscalaRow}>
                  <span className={styles.fichaEscalaLabel}>Acidez</span>
                  <Escala valor={f.boca.acidez} />
                </div>
              )}
              {f.boca.tanino != null && (
                <div className={styles.fichaEscalaRow}>
                  <span className={styles.fichaEscalaLabel}>Tanino</span>
                  <Escala valor={f.boca.tanino} />
                </div>
              )}
              {f.boca.final && (
                <p className={styles.fichaTexto}>Final {f.boca.final}</p>
              )}
            </div>
          )}

          {/* Conclusão */}
          {(f.conclusao?.potencial || f.conclusao?.notas) && (
            <div className={styles.fichaSecao}>
              {f.conclusao.potencial && (
                <p className={styles.fichaPotencial}>
                  {POTENCIAL_LABELS[f.conclusao.potencial] || f.conclusao.potencial}
                </p>
              )}
              {f.conclusao.notas && (
                <p className={styles.fichaNotas}>"{f.conclusao.notas}"</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.fichaBody}>
          <p className={styles.fichaSemFicha}>Sem ficha de degustação</p>
        </div>
      )}
    </div>
  )
}

function VinhoPrint({ garrafa, index }) {
  const avaliacoes = garrafa.avaliacoes || []
  const comFicha = avaliacoes.filter((a) => a.ficha)
  const semFicha = avaliacoes.filter((a) => !a.ficha)
  const media = avaliacoes.length
    ? avaliacoes.reduce((s, a) => s + Number(a.nota), 0) / avaliacoes.length
    : null

  return (
    <div className={styles.vinho}>
      {/* Cabeçalho do vinho */}
      <div className={styles.vinhoHeader}>
        <div className={styles.vinhoNum}>{String(index + 1).padStart(2, '0')}</div>
        <div className={styles.vinhoInfo}>
          <h2 className={styles.vinhoNome}>{garrafa.nome}</h2>
          <div className={styles.vinhoMeta}>
            {[
              garrafa.produtor,
              garrafa.regiao,
              garrafa.safra,
              garrafa.tipo && TIPO_LABELS[garrafa.tipo],
            ].filter(Boolean).join('  ·  ')}
          </div>
          <div className={styles.vinhoRodape}>
            <span className={styles.trazidoPor}>Apresentado por {garrafa.apelido}</span>
            {media != null && (
              <span className={styles.vinhoMedia}>
                <Estrelas nota={media} size="md" />
                <span className={styles.mediaCount}>
                  {avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </span>
            )}
          </div>
          {garrafa.notas_dono && (
            <p className={styles.notasDono}>"{garrafa.notas_dono}"</p>
          )}
        </div>
        {garrafa.foto_url && (
          <img src={garrafa.foto_url} alt={garrafa.nome} className={styles.vinhoFoto} />
        )}
      </div>

      {/* Fichas */}
      {avaliacoes.length > 0 ? (
        <div className={styles.fichasGrid}>
          {[...comFicha, ...semFicha].map((a) => (
            <FichaCard key={a.id} avaliacao={a} />
          ))}
        </div>
      ) : (
        <p className={styles.semAvaliacoes}>Nenhuma avaliação registada.</p>
      )}
    </div>
  )
}

export default function EncontroPrint() {
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
        supabase.from('garrafas').select('*, avaliacoes(*)').eq('encontro_id', id).order('criado_em'),
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

  if (carregando) return <div className={styles.loading}>A preparar para impressão…</div>
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

      {/* ── Título do encontro ── */}
      <div className={styles.tituloArea}>
        <h1 className={styles.titulo}>{encontro.titulo}</h1>
        {encontro.tema && <p className={styles.tema}>{encontro.tema}</p>}
        {encontro.local_nome && <p className={styles.local}>{encontro.local_nome}</p>}
      </div>

      <div className={styles.dividerFino} />

      {/* ── Vinhos ── */}
      {garrafas.length > 0 ? (
        <div className={styles.vinhos}>
          {garrafas.map((g, i) => (
            <VinhoPrint key={g.id} garrafa={g} index={i} />
          ))}
        </div>
      ) : (
        <p className={styles.vazio}>Nenhum vinho registado neste encontro.</p>
      )}

      {/* ── Rodapé ── */}
      <footer className={styles.rodape}>
        <span className={styles.rodapeTexto}>The Cellar · {confraria?.nome}</span>
        <span className={styles.rodapeDiamond}>◆</span>
        <span className={styles.rodapeTexto}>{formatarDataExt(new Date().toISOString())}</span>
      </footer>

    </div>
  )
}
