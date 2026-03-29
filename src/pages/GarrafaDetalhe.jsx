import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useGarrafa, useGarrafas, uploadFotoGarrafa, deleteFotoStorage } from '../hooks/useGarrafas.js'
import FichaDegustacaoForm from '../components/wine/FichaDegustacaoForm.jsx'
import FichaDegustacaoView from '../components/wine/FichaDegustacaoView.jsx'
import FotoUpload from '../components/wine/FotoUpload.jsx'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import StarRating from '../components/wine/StarRating.jsx'
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
  const { garrafa, carregando, adicionarAvaliacao, adicionarComentario, atualizarFoto } = useGarrafa(garrafaId)
  const { remover } = useGarrafas(encontroId)
  const navigate = useNavigate()

  const [formFichaAberto, setFormFichaAberto] = useState(false)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [fichaExpandida, setFichaExpandida] = useState(null)
  const [comparacaoAberta, setComparacaoAberta] = useState(false)
  const [fotoEditando, setFotoEditando] = useState(false)
  const [fotoFile, setFotoFile] = useState(null)
  const [salvandoFoto, setSalvandoFoto] = useState(false)
  const [apagando, setApagando] = useState(false)

  if (carregando) return <div className={styles.loading} role="status" aria-live="polite">A carregar…</div>
  if (!garrafa)   return <div className={styles.loading} role="status">Garrafa não encontrada.</div>

  const mediaVal = media(garrafa.avaliacoes)
  const minhaAvaliacao = garrafa.avaliacoes?.find((a) => a.apelido === sessao?.apelido)
  const outrasAvaliacoes = garrafa.avaliacoes?.filter((a) => a.apelido !== sessao?.apelido) ?? []

  async function handleSalvarFicha(nota, ficha) {
    if (!sessao) return
    await adicionarAvaliacao(sessao.apelido, nota, ficha)
    setFormFichaAberto(false)
  }

  async function handleComentario(e) {
    e.preventDefault()
    if (!comentario.trim() || !sessao) return
    setEnviando(true)
    await adicionarComentario(sessao.apelido, comentario.trim())
    setComentario('')
    setEnviando(false)
  }

  async function handleApagarGarrafa() {
    if (!window.confirm('Apagar este vinho? Todas as fichas e comentários serão removidos.')) return
    setApagando(true)
    await remover(garrafaId, garrafa.foto_url)
    navigate(`/c/${slug}/encontros/${encontroId}`)
  }

  async function handleSalvarFoto() {
    if (!fotoFile) return
    setSalvandoFoto(true)
    const fotoAntiga = garrafa.foto_url
    const { url, error } = await uploadFotoGarrafa(fotoFile)
    if (error) { setSalvandoFoto(false); return }
    await atualizarFoto(url)
    if (fotoAntiga) await deleteFotoStorage(fotoAntiga)
    setFotoFile(null)
    setFotoEditando(false)
    setSalvandoFoto(false)
  }

  async function handleRemoverFoto() {
    if (!window.confirm('Remover a foto deste vinho?')) return
    setSalvandoFoto(true)
    const fotoAntiga = garrafa.foto_url
    await atualizarFoto(null)
    if (fotoAntiga) await deleteFotoStorage(fotoAntiga)
    setFotoEditando(false)
    setSalvandoFoto(false)
  }

  return (
    <div className={styles.page}>
      <Link to={`/c/${slug}/encontros/${encontroId}`} className={styles.voltar}>
        ← Encontro
      </Link>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.fotoWrap}>
          {garrafa.foto_url && !fotoEditando ? (
            <img src={garrafa.foto_url} alt={garrafa.nome} className={styles.foto} />
          ) : (
            <div className={styles.semFoto}>
              <svg viewBox="0 0 24 24" fill="none" className={styles.iconGarrafa} aria-hidden="true">
                <path
                  d="M9 2h6v4c0 0 2 1.5 2 4v10a1 1 0 01-1 1H8a1 1 0 01-1-1V10c0-2.5 2-4 2-4V2z"
                  stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {sessao?.apelido === garrafa.apelido && !fotoEditando && (
            <button
              className={styles.btnFotoAlt}
              onClick={() => setFotoEditando(true)}
              disabled={salvandoFoto}
            >
              {garrafa.foto_url ? 'Trocar foto' : 'Adicionar foto'}
            </button>
          )}
        </div>

        <div className={styles.heroInfo}>
          <h1 className={styles.nome}>{garrafa.nome}</h1>
          {garrafa.produtor && <p className={styles.meta}>{garrafa.produtor}</p>}
          <div className={styles.tags}>
            {garrafa.safra && <span className={styles.tag}>{garrafa.safra}</span>}
            {garrafa.regiao && <span className={styles.tag}>{garrafa.regiao}</span>}
            {garrafa.tipo   && <span className={styles.tag}>{TIPO_LABELS[garrafa.tipo] || garrafa.tipo}</span>}
          </div>
          <div className={styles.trazidoPor}>
            <MemberAvatar apelido={garrafa.apelido} cor={gerarCor(garrafa.apelido)} size={24} />
            <span className={styles.trazidoNome}>{garrafa.apelido}</span>
          </div>
          {mediaVal !== null && (
            <div className={styles.mediaRow}>
              <StarRating nota={mediaVal} readonly />
              <span className={styles.mediaNum}>{mediaVal.toFixed(1)}</span>
              <span className={styles.mediaCount}>({garrafa.avaliacoes.length})</span>
            </div>
          )}
          {sessao?.apelido === garrafa.apelido && (
            <button
              className={styles.btnApagarGarrafa}
              onClick={handleApagarGarrafa}
              disabled={apagando}
            >
              {apagando ? 'A apagar…' : 'Apagar vinho'}
            </button>
          )}
        </div>
      </div>

      {/* Painel de edição de foto */}
      {fotoEditando && sessao?.apelido === garrafa.apelido && (
        <div className={styles.fotoEditPanel}>
          <FotoUpload onFile={setFotoFile} />
          <div className={styles.fotoEditAcoes}>
            {garrafa.foto_url && (
              <button
                type="button"
                className={styles.btnRemoverFoto}
                onClick={handleRemoverFoto}
                disabled={salvandoFoto}
              >
                Remover foto
              </button>
            )}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setFotoEditando(false); setFotoFile(null) }}
              disabled={salvandoFoto}
            >
              Cancelar
            </button>
            {fotoFile && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleSalvarFoto}
                disabled={salvandoFoto}
              >
                {salvandoFoto ? 'A guardar…' : 'Guardar foto'}
              </button>
            )}
          </div>
        </div>
      )}

      {garrafa.notas_dono && (
        <p className={styles.notasDono}>{garrafa.notas_dono}</p>
      )}

      <GoldDivider />

      {/* ── Minha ficha ── */}
      {sessao && (
        <section className={styles.secao}>
          <div className={styles.secaoHeader}>
            <p className={styles.secLabel}>Minha ficha de degustação</p>
            {minhaAvaliacao && minhaAvaliacao.apelido === sessao?.apelido && !formFichaAberto && (
              <button className={styles.btnEditar} onClick={() => setFormFichaAberto(true)}>
                Editar
              </button>
            )}
          </div>

          {!minhaAvaliacao && !formFichaAberto && (
            <button
              className={styles.btnPreencher}
              onClick={() => setFormFichaAberto(true)}
            >
              + Preencher ficha de degustação
            </button>
          )}

          {minhaAvaliacao && !formFichaAberto && (
            <FichaDegustacaoView avaliacao={minhaAvaliacao} />
          )}

          {formFichaAberto && (
            <FichaDegustacaoForm
              fichaInicial={minhaAvaliacao?.ficha ?? null}
              notaInicial={minhaAvaliacao ? Number(minhaAvaliacao.nota) : 0}
              onSalvar={handleSalvarFicha}
              onCancelar={() => setFormFichaAberto(false)}
            />
          )}
        </section>
      )}

      <GoldDivider />

      {/* ── Fichas dos outros membros ── */}
      <section className={styles.secao}>
        <p className={styles.secLabel}>
          Fichas dos membros
          {mediaVal !== null && <span className={styles.mediaInline}> · média {mediaVal.toFixed(1)} ★</span>}
        </p>

        {outrasAvaliacoes.length === 0 && (
          <p className={styles.vazio}>Nenhum outro membro avaliou ainda.</p>
        )}

        <div className={styles.listaAvaliacoes}>
          {outrasAvaliacoes.map((a) => (
            <div key={a.id} className={styles.avaliacaoItem}>
              <div className={styles.avaliacaoHeader}>
                <MemberAvatar apelido={a.apelido} cor={gerarCor(a.apelido)} size={28} />
                <span className={styles.avaliacaoNome}>{a.apelido}</span>
                <StarRating nota={Number(a.nota)} readonly />
                <span className={styles.notaNum}>{Number(a.nota).toFixed(1)}</span>
                {a.ficha && (
                  <button
                    className={styles.btnVerFicha}
                    aria-expanded={fichaExpandida === a.id}
                    aria-controls={`ficha-${a.id}`}
                    onClick={() => setFichaExpandida(fichaExpandida === a.id ? null : a.id)}
                  >
                    {fichaExpandida === a.id ? 'Fechar' : 'Ver ficha'}
                  </button>
                )}
              </div>
              {fichaExpandida === a.id && a.ficha && (
                <div id={`ficha-${a.id}`} className={styles.fichaExpandida}>
                  <FichaDegustacaoView avaliacao={a} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparação de fichas ── */}
      {garrafa.avaliacoes?.filter((a) => a.ficha).length >= 2 && (
        <>
          <GoldDivider />
          <section className={styles.secao}>
            <div className={styles.secaoHeader}>
              <p className={styles.secLabel}>Comparar fichas</p>
              <button
                className={styles.btnEditar}
                aria-expanded={comparacaoAberta}
                onClick={() => setComparacaoAberta((v) => !v)}
              >
                {comparacaoAberta ? 'Fechar' : 'Ver lado a lado'}
              </button>
            </div>

            {comparacaoAberta && (
              <div className={styles.comparacaoScroll}>
                {garrafa.avaliacoes
                  .filter((a) => a.ficha)
                  .map((a) => (
                    <div key={a.id} className={styles.comparacaoCard}>
                      <div className={styles.comparacaoCardHeader}>
                        <MemberAvatar apelido={a.apelido} cor={gerarCor(a.apelido)} size={22} />
                        <span className={styles.comparacaoNome}>{a.apelido}</span>
                      </div>
                      <div className={styles.comparacaoCardBody}>
                        <FichaDegustacaoView avaliacao={a} />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </>
      )}

      <GoldDivider />

      {/* ── Comentários ── */}
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
              placeholder="Suas percepções sobre este vinho…"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={enviando}>
              {enviando ? '…' : 'Enviar'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
