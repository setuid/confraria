import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import StarRating from '../components/wine/StarRating.jsx'
import styles from './EncontroPartilhar.module.css'

function media(avaliacoes) {
  if (!avaliacoes?.length) return null
  return avaliacoes.reduce((s, a) => s + Number(a.nota), 0) / avaliacoes.length
}

function formatarData(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const TIPO_LABELS = {
  tinto: 'Tinto', branco: 'Branco', 'rosé': 'Rosé',
  espumante: 'Espumante', sobremesa: 'Sobremesa', outro: 'Outro',
}

export default function EncontroPartilhar() {
  const { slug, id } = useParams()
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [fotoAmpliada, setFotoAmpliada] = useState(null)

  useEffect(() => {
    async function buscar() {
      const [{ data: encontro }, { data: garrafas }, { data: fotos }] = await Promise.all([
        supabase.from('encontros').select('*, confrarias(nome)').eq('id', id).single(),
        supabase.from('garrafas').select('*, avaliacoes(*)').eq('encontro_id', id).order('criado_em'),
        supabase.from('encontro_fotos').select('*').eq('encontro_id', id).order('criado_em'),
      ])
      setDados({ encontro, garrafas: garrafas || [], fotos: fotos || [] })
      setCarregando(false)
    }
    buscar()
  }, [id])

  if (carregando) {
    return <div className={styles.loading}>A carregar…</div>
  }
  if (!dados?.encontro) {
    return <div className={styles.loading}>Encontro não encontrado.</div>
  }

  const { encontro, garrafas, fotos } = dados
  const confrariaNome = encontro.confrarias?.nome ?? slug

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <p className={styles.confrariaLabel}>{confrariaNome}</p>
        <h1 className={styles.titulo}>{encontro.titulo}</h1>
        {encontro.data_hora && (
          <p className={styles.data}>{formatarData(encontro.data_hora)}</p>
        )}
        {encontro.local_nome && (
          <p className={styles.local}>{encontro.local_nome}</p>
        )}
        <div className={styles.ornamento}>◆</div>
      </header>

      {/* Fotos */}
      {fotos.length > 0 && (
        <section className={styles.secao}>
          <p className={styles.secLabel}>Fotos do encontro</p>
          <div className={styles.fotosGrid}>
            {fotos.map((f) => (
              <img
                key={f.id}
                src={f.url}
                alt="Foto do encontro"
                className={styles.fotoItem}
                onClick={() => setFotoAmpliada(f.url)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Vinhos */}
      {garrafas.length > 0 && (
        <section className={styles.secao}>
          <p className={styles.secLabel}>Vinhos degustados</p>
          <div className={styles.garrafasList}>
            {garrafas.map((g, idx) => {
              const avg = media(g.avaliacoes)
              const isCego = g.cego
              return (
                <div key={g.id} className={styles.garrafaItem}>
                  <div className={styles.garrafaNumero}>{String(idx + 1).padStart(2, '0')}</div>
                  <div className={styles.garrafaFoto}>
                    {!isCego && g.foto_url ? (
                      <img src={g.foto_url} alt={g.nome} className={styles.garrafaImg} />
                    ) : (
                      <div className={styles.garrafaSemFoto}>
                        <span>{isCego ? '?' : '◈'}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.garrafaInfo}>
                    <p className={styles.garrafaNome}>{isCego ? 'Blind Tasting' : g.nome}</p>
                    {!isCego && g.produtor && (
                      <p className={styles.garrafaMeta}>{g.produtor}{g.safra ? ` · ${g.safra}` : ''}</p>
                    )}
                    {!isCego && (g.regiao || g.tipo) && (
                      <p className={styles.garrafaMeta}>
                        {[g.regiao, TIPO_LABELS[g.tipo]].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {avg !== null && (
                      <div className={styles.garrafaRating}>
                        <StarRating nota={avg} readonly />
                        <span className={styles.garrafaMedia}>{avg.toFixed(1)}</span>
                        <span className={styles.garrafaCount}>({g.avaliacoes.length} av.)</span>
                      </div>
                    )}
                  </div>

                  {/* Notas dos membros */}
                  {g.avaliacoes?.length > 0 && (
                    <div className={styles.avaliacoesList}>
                      {g.avaliacoes.map((a) => (
                        <div key={a.id} className={styles.avaliacaoItem}>
                          <span className={styles.avaliacaoNome}>{a.apelido}</span>
                          <StarRating nota={Number(a.nota)} readonly />
                          <span className={styles.avaliacaoNota}>{Number(a.nota).toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <span>The Cellar · {confrariaNome}</span>
      </footer>

      {/* Lightbox */}
      {fotoAmpliada && (
        <div className={styles.lightbox} onClick={() => setFotoAmpliada(null)}>
          <img src={fotoAmpliada} alt="Foto ampliada" className={styles.lightboxImg} />
        </div>
      )}
    </div>
  )
}
