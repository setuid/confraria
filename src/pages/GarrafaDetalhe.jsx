import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useGarrafa } from '../hooks/useGarrafas.js'
import StarRating from '../components/wine/StarRating.jsx'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import { gerarCor } from '../lib/utils.js'
import styles from './GarrafaDetalhe.module.css'

const TIPO_LABELS = {
  tinto: 'Tinto', branco: 'Branco', 'rosé': 'Rosé',
  espumante: 'Espumante', sobremesa: 'Sobremesa', outro: 'Outro',
}

function media(avaliacoes) {
  if (!avaliacoes?.length) return null
  return avaliacoes.reduce((s, a) => s + Number(a.nota), 0) / avaliacoes.length
}

export default function GarrafaDetalhe() {
  const { slug, encontroId, garrafaId } = useParams()
  const { sessao } = useAuth(slug)
  const { garrafa, carregando, adicionarAvaliacao, adicionarComentario } = useGarrafa(garrafaId)

  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (carregando) return <div className={styles.loading}>...</div>
  if (!garrafa)   return <div className={styles.loading}>Garrafa não encontrada.</div>

  const mediaVal = media(garrafa.avaliacoes)
  const minhaAvaliacao = garrafa.avaliacoes?.find((a) => a.apelido === sessao?.apelido)
  const ehDono = garrafa.apelido === sessao?.apelido

  async function handleNota(nota) {
    if (!sessao) return
    await adicionarAvaliacao(sessao.apelido, nota)
  }

  async function handleComentario(e) {
    e.preventDefault()
    if (!comentario.trim() || !sessao) return
    setEnviando(true)
    await adicionarComentario(sessao.apelido, comentario.trim())
    setComentario('')
    setEnviando(false)
  }

  return (
    <div className={styles.page}>
      <Link to={`/c/${slug}/encontros/${encontroId}`} className={styles.voltar}>
        ← Encontro
      </Link>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.fotoWrap}>
          {garrafa.foto_url ? (
            <img src={garrafa.foto_url} alt={garrafa.nome} className={styles.foto} />
          ) : (
            <div className={styles.semFoto}>
              <svg viewBox="0 0 24 24" fill="none" className={styles.iconGarrafa}>
                <path
                  d="M9 2h6v4c0 0 2 1.5 2 4v10a1 1 0 01-1 1H8a1 1 0 01-1-1V10c0-2.5 2-4 2-4V2z"
                  stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        <div className={styles.heroInfo}>
          <h1 className={styles.nome}>{garrafa.nome}</h1>
          {garrafa.produtor && <p className={styles.meta}>{garrafa.produtor}</p>}
          <div className={styles.tags}>
            {garrafa.safra && <span className={styles.tag}>{garrafa.safra}</span>}
            {garrafa.regiao && <span className={styles.tag}>{garrafa.regiao}</span>}
            {garrafa.tipo && <span className={styles.tag}>{TIPO_LABELS[garrafa.tipo] || garrafa.tipo}</span>}
          </div>
          <div className={styles.trazidoPor}>
            <MemberAvatar apelido={garrafa.apelido} cor={gerarCor(garrafa.apelido)} size={24} />
            <span className={styles.trazidoNome}>{garrafa.apelido}</span>
          </div>
        </div>
      </div>

      <GoldDivider />

      {/* Avaliação do membro logado */}
      {sessao && (
        <section className={styles.secao}>
          <p className={styles.secLabel}>
            {ehDono ? 'Sua garrafa' : minhaAvaliacao ? 'Sua avaliação' : 'Avaliar este vinho'}
          </p>
          {ehDono ? (
            <p className={styles.donoNote}>Você trouxe esta garrafa.</p>
          ) : (
            <div className={styles.minhaRating}>
              <StarRating nota={minhaAvaliacao?.nota || 0} onChange={handleNota} />
              {minhaAvaliacao && (
                <span className={styles.notaVal}>{Number(minhaAvaliacao.nota).toFixed(1)}</span>
              )}
            </div>
          )}
          {garrafa.notas_dono && (
            <p className={styles.notasDono}>{garrafa.notas_dono}</p>
          )}
        </section>
      )}

      <GoldDivider />

      {/* Avaliações de todos */}
      <section className={styles.secao}>
        <p className={styles.secLabel}>
          Avaliações
          {mediaVal !== null && (
            <span className={styles.mediaLabel}> · média {mediaVal.toFixed(1)} ★</span>
          )}
        </p>

        {garrafa.avaliacoes?.length === 0 && (
          <p className={styles.vazio}>Nenhuma avaliação ainda.</p>
        )}

        <div className={styles.listaAvaliacoes}>
          {garrafa.avaliacoes?.map((a) => (
            <div key={a.id} className={styles.avaliacaoRow}>
              <MemberAvatar apelido={a.apelido} cor={gerarCor(a.apelido)} size={28} />
              <span className={styles.avaliacaoNome}>{a.apelido}</span>
              <StarRating nota={Number(a.nota)} readonly />
              <span className={styles.notaVal}>{Number(a.nota).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* Comentários */}
      <section className={styles.secao}>
        <p className={styles.secLabel}>Comentários</p>

        {garrafa.comentarios?.length === 0 && (
          <p className={styles.vazio}>Nenhum comentário ainda.</p>
        )}

        <div className={styles.listaComentarios}>
          {garrafa.comentarios?.map((c) => (
            <div key={c.id} className={styles.comentario}>
              <div className={styles.comentarioHeader}>
                <MemberAvatar apelido={c.apelido} cor={gerarCor(c.apelido)} size={24} />
                <span className={styles.comentarioNome}>{c.apelido}</span>
              </div>
              <p className={styles.comentarioTexto}>{c.texto}</p>
            </div>
          ))}
        </div>

        {sessao && (
          <form className={styles.comentarioForm} onSubmit={handleComentario}>
            <textarea
              className="input"
              rows={2}
              placeholder="Suas percepções sobre este vinho..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={enviando}>
              {enviando ? '...' : 'Enviar'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
