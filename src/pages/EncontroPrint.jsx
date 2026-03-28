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

function Estrelas({ nota }) {
  if (!nota) return null
  const total = 5
  const filled = Math.floor(nota)
  const half = nota - filled >= 0.5
  return (
    <span className={styles.estrelas}>
      {Array.from({ length: total }, (_, i) => {
        if (i < filled) return <span key={i} className={styles.estrelaCheio}>★</span>
        if (i === filled && half) return <span key={i} className={styles.estrelaMetade}>★</span>
        return <span key={i} className={styles.estrelaVazio}>☆</span>
      })}
      <span className={styles.notaNum}>{nota.toFixed(1)}</span>
    </span>
  )
}

function FichaCompacta({ avaliacao }) {
  const f = avaliacao.ficha
  if (!f) return null
  const aromas = f.nariz?.aromas || []

  return (
    <div className={styles.fichaCard}>
      <div className={styles.fichaAutor}>
        <span className={styles.fichaInicial}>{avaliacao.apelido[0]?.toUpperCase()}</span>
        <span className={styles.fichaNome}>{avaliacao.apelido}</span>
        {avaliacao.nota && <Estrelas nota={avaliacao.nota} />}
      </div>

      <div className={styles.fichaCorpo}>
        {/* Visual */}
        {(f.visual?.cor || f.visual?.intensidade) && (
          <div className={styles.fichaLinha}>
            <span className={styles.fichaSecLabel}>Visual</span>
            <span className={styles.fichaVal}>
              {f.visual.cor && (
                <span
                  className={styles.corDot}
                  style={{ background: COR_HEX[f.visual.cor] || '#888' }}
                />
              )}
              {[f.visual.cor, f.visual.intensidade, f.visual.limpidez]
                .filter(Boolean).join(' · ')}
            </span>
          </div>
        )}

        {/* Nariz */}
        {(f.nariz?.intensidade || aromas.length > 0) && (
          <div className={styles.fichaLinha}>
            <span className={styles.fichaSecLabel}>Nariz</span>
            <span className={styles.fichaVal}>
              {f.nariz.intensidade && <span>{f.nariz.intensidade}</span>}
              {aromas.length > 0 && (
                <span className={styles.aromas}>{aromas.join(', ')}</span>
              )}
            </span>
          </div>
        )}

        {/* Boca */}
        {(f.boca?.acidez || f.boca?.tanino || f.boca?.corpo || f.boca?.doçura) && (
          <div className={styles.fichaLinha}>
            <span className={styles.fichaSecLabel}>Boca</span>
            <span className={styles.fichaVal}>
              {[
                f.boca.doçura,
                f.boca.corpo && `corpo ${f.boca.corpo}`,
                f.boca.acidez && `acidez ${f.boca.acidez}/5`,
                f.boca.tanino && `tanino ${f.boca.tanino}/5`,
                f.boca.final && `final ${f.boca.final}`,
              ].filter(Boolean).join(' · ')}
            </span>
          </div>
        )}

        {/* Potencial */}
        {f.conclusao?.potencial && (
          <div className={styles.fichaLinha}>
            <span className={styles.fichaSecLabel}>Guarda</span>
            <span className={styles.fichaVal}>{f.conclusao.potencial}</span>
          </div>
        )}

        {/* Notas livres */}
        {f.conclusao?.notas && (
          <p className={styles.fichaNotas}>"{f.conclusao.notas}"</p>
        )}
      </div>
    </div>
  )
}

function GarrafaPrint({ garrafa, index }) {
  const avaliacoesComFicha = garrafa.avaliacoes?.filter((a) => a.ficha) ?? []
  const avaliacoesSemFicha = garrafa.avaliacoes?.filter((a) => !a.ficha) ?? []
  const media = garrafa.avaliacoes?.length
    ? garrafa.avaliacoes.reduce((s, a) => s + Number(a.nota), 0) / garrafa.avaliacoes.length
    : null

  return (
    <div className={styles.garrafa}>
      <div className={styles.garrafaHeader}>
        <div className={styles.garrafaNum}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className={styles.garrafaInfo}>
          <h2 className={styles.garrafaNome}>{garrafa.nome}</h2>
          <div className={styles.garrafaMeta}>
            {[garrafa.produtor, garrafa.regiao, garrafa.safra, garrafa.tipo && TIPO_LABELS[garrafa.tipo]]
              .filter(Boolean).join('  ·  ')}
          </div>
          <div className={styles.garrafaRodape}>
            <span className={styles.trazidoPor}>Por {garrafa.apelido}</span>
            {media !== null && (
              <span className={styles.garrafaMedia}>
                Média: <Estrelas nota={media} />
                {' '}({garrafa.avaliacoes.length} {garrafa.avaliacoes.length === 1 ? 'ficha' : 'fichas'})
              </span>
            )}
          </div>
        </div>
        {garrafa.foto_url && (
          <img src={garrafa.foto_url} alt={garrafa.nome} className={styles.garrafaFoto} />
        )}
      </div>

      {/* Notas do dono */}
      {garrafa.notas_dono && (
        <p className={styles.notasDono}>"{garrafa.notas_dono}"</p>
      )}

      {/* Fichas */}
      {avaliacoesComFicha.length > 0 && (
        <div className={styles.fichasGrid}>
          {avaliacoesComFicha.map((a) => (
            <FichaCompacta key={a.id} avaliacao={a} />
          ))}
        </div>
      )}

      {/* Avaliações sem ficha */}
      {avaliacoesSemFicha.length > 0 && (
        <div className={styles.notasSimples}>
          {avaliacoesSemFicha.map((a) => (
            <span key={a.id} className={styles.notaSimples}>
              {a.apelido}: <Estrelas nota={a.nota} />
            </span>
          ))}
        </div>
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
      // Pequeno delay para garantir que imagens carregam antes de imprimir
      const t = setTimeout(() => window.print(), 600)
      return () => clearTimeout(t)
    }
  }, [carregando, encontro])

  if (carregando) {
    return <div className={styles.loading}>A preparar para impressão…</div>
  }
  if (!encontro) {
    return <div className={styles.loading}>Encontro não encontrado.</div>
  }

  const confirmados = /* pressas */ []

  return (
    <div className={styles.pagina}>

      {/* Cabeçalho */}
      <header className={styles.cabecalho}>
        <div className={styles.cabecalhoEsq}>
          <div className={styles.logoMarca}>◆ The Cellar</div>
          {confraria && <div className={styles.confNome}>{confraria.nome}</div>}
        </div>
        <div className={styles.cabecalhoDir}>
          {encontro.numero_romano && (
            <div className={styles.encontroNum}>Encontro {encontro.numero_romano}</div>
          )}
          {encontro.data_hora && (
            <div className={styles.encontroData}>{formatarDataExt(encontro.data_hora)}</div>
          )}
        </div>
      </header>

      <div className={styles.headerDivider} />

      {/* Título */}
      <div className={styles.tituloArea}>
        <h1 className={styles.titulo}>{encontro.titulo}</h1>
        {encontro.tema && <p className={styles.tema}>{encontro.tema}</p>}
        {encontro.local_nome && (
          <p className={styles.local}>{encontro.local_nome}</p>
        )}
      </div>

      {/* Garrafas */}
      {garrafas.length > 0 ? (
        <div className={styles.garrafas}>
          {garrafas.map((g, i) => (
            <GarrafaPrint key={g.id} garrafa={g} index={i} />
          ))}
        </div>
      ) : (
        <p className={styles.vazio}>Nenhum vinho registado neste encontro.</p>
      )}

      {/* Rodapé */}
      <footer className={styles.rodape}>
        <span className={styles.rodapeTexto}>The Cellar · {confraria?.nome}</span>
        <span className={styles.rodapeDiamond}>◆</span>
        <span className={styles.rodapeTexto}>Impresso em {formatarDataExt(new Date().toISOString())}</span>
      </footer>

    </div>
  )
}
