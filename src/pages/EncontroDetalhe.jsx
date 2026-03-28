import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useEncontro } from '../hooks/useEncontros.js'
import { useGarrafas, uploadFotoGarrafa } from '../hooks/useGarrafas.js'
import RomanNumeral from '../components/ui/RomanNumeral.jsx'
import RsvpButtons from '../components/meeting/RsvpButtons.jsx'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import ArtDecoCard from '../components/ui/ArtDecoCard.jsx'
import GarrafaCard from '../components/wine/GarrafaCard.jsx'
import FotoUpload from '../components/wine/FotoUpload.jsx'
import { formatarData, formatarHora } from '../lib/utils.js'
import styles from './EncontroDetalhe.module.css'

const STATUS_LABELS = {
  planejado: 'Planejado',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
}

const FORM_VAZIO = { nome: '', produtor: '', safra: '', regiao: '', tipo: '', notas_dono: '' }

export default function EncontroDetalhe() {
  const { slug, id } = useParams()
  const { sessao } = useAuth(slug)
  const { encontro, carregando } = useEncontro(id)
  const { garrafas, carregando: carregandoGarrafas, adicionar } = useGarrafas(id)

  const [formAberto, setFormAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [fotoFile, setFotoFile] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  async function handleAdicionarGarrafa(e) {
    e.preventDefault()
    if (!form.nome.trim()) { setErroForm('Nome do vinho é obrigatório.'); return }
    setSalvando(true)
    setErroForm('')
    let foto_url = null
    if (fotoFile) {
      const { url, error } = await uploadFotoGarrafa(fotoFile)
      if (error) { setErroForm('Erro ao enviar foto.'); setSalvando(false); return }
      foto_url = url
    }
    const campos = {
      ...form,
      safra: form.safra ? parseInt(form.safra) : null,
      foto_url,
      apelido: sessao.apelido,
      confraria_id: encontro.confraria_id,
    }
    const { error } = await adicionar(campos)
    if (error) { setErroForm(error.message); setSalvando(false); return }
    setForm(FORM_VAZIO)
    setFotoFile(null)
    setFormAberto(false)
    setSalvando(false)
  }

  if (carregando) {
    return <div className={styles.loading}>...</div>
  }

  if (!encontro) {
    return <div className={styles.loading}>Encontro não encontrado.</div>
  }

  const presencaAtual = encontro.presencas?.find(
    (p) => p.apelido === sessao?.apelido
  )

  const confirmados = encontro.presencas?.filter((p) => p.status === 'confirmado') || []
  const pendentes   = encontro.presencas?.filter((p) => p.status === 'pendente')   || []
  const recusados   = encontro.presencas?.filter((p) => p.status === 'recusado')   || []

  return (
    <div className={styles.page}>
      <Link to={`/c/${slug}/encontros`} className={styles.voltar}>
        ← Encontros
      </Link>

      {/* Header */}
      <div className={styles.header}>
        <RomanNumeral value={encontro.numero_romano} size="xl" />
        <span className={`badge badge-${encontro.status}`}>
          {STATUS_LABELS[encontro.status]}
        </span>
      </div>

      <h1 className={styles.titulo}>{encontro.titulo}</h1>
      {encontro.tema && <p className={styles.tema}>{encontro.tema}</p>}

      <div className={styles.meta}>
        {encontro.data_hora && (
          <span>{formatarData(encontro.data_hora)} às {formatarHora(encontro.data_hora)}</span>
        )}
        {encontro.local_nome && <span>{encontro.local_nome}</span>}
      </div>

      <GoldDivider />

      {/* RSVP */}
      <ArtDecoCard className={styles.rsvpCard}>
        <p className={styles.secLabel}>Sua presença</p>
        <RsvpButtons
          encontroId={encontro.id}
          apelido={sessao?.apelido}
          statusAtual={presencaAtual?.status}
        />
      </ArtDecoCard>

      <GoldDivider />

      {/* Quem vem */}
      <section className={styles.secao}>
        <p className={styles.secLabel}>Quem vem</p>
        <p className={styles.presCount}>
          {confirmados.length} confirmado{confirmados.length !== 1 ? 's' : ''}
          {pendentes.length > 0 && ` · ${pendentes.length} pendente${pendentes.length !== 1 ? 's' : ''}`}
          {recusados.length > 0 && ` · ${recusados.length} não pode${recusados.length !== 1 ? 'm' : ''}`}
        </p>

        {confirmados.length > 0 && (
          <div className={styles.avatarGrid}>
            {confirmados.map((p) => (
              <div key={p.apelido} className={styles.avatarItem}>
                <MemberAvatar apelido={p.apelido} size={36} />
                <span className={styles.avatarNome}>{p.apelido}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sobre */}
      {(encontro.descricao || encontro.local_endereco) && (
        <>
          <GoldDivider />
          <section className={styles.secao}>
            <p className={styles.secLabel}>Sobre esta noite</p>
            {encontro.descricao && (
              <p className={styles.descricao}>{encontro.descricao}</p>
            )}
            {encontro.local_endereco && (
              <p className={styles.endereco}>{encontro.local_endereco}</p>
            )}
          </section>
        </>
      )}

      {/* Garrafas */}
      <GoldDivider />
      <section className={styles.secao}>
        <div className={styles.garrafasHeader}>
          <p className={styles.secLabel}>Garrafas do encontro</p>
          {sessao && !formAberto && (
            <button className={styles.btnAdicionarGarrafa} onClick={() => setFormAberto(true)}>
              + Adicionar garrafa
            </button>
          )}
        </div>

        {formAberto && (
          <form className={styles.garrafaForm} onSubmit={handleAdicionarGarrafa}>
            <div className={styles.garrafaFormGrid}>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Nome do vinho *</label>
                <input className="input" value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Produtor</label>
                <input className="input" value={form.produtor}
                  onChange={(e) => setForm((f) => ({ ...f, produtor: e.target.value }))} />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Safra</label>
                <input className="input" type="number" min="1900" max="2099" placeholder="ex: 2019"
                  value={form.safra}
                  onChange={(e) => setForm((f) => ({ ...f, safra: e.target.value }))} />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Região</label>
                <input className="input" value={form.regiao}
                  onChange={(e) => setForm((f) => ({ ...f, regiao: e.target.value }))} />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Tipo</label>
                <select className="input" value={form.tipo}
                  onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}>
                  <option value="">—</option>
                  <option value="tinto">Tinto</option>
                  <option value="branco">Branco</option>
                  <option value="rosé">Rosé</option>
                  <option value="espumante">Espumante</option>
                  <option value="sobremesa">Sobremesa</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className={`${styles.campo} ${styles.campoFull}`}>
                <label className={styles.campoLabel}>Notas pessoais</label>
                <textarea className="input" rows={2} value={form.notas_dono}
                  onChange={(e) => setForm((f) => ({ ...f, notas_dono: e.target.value }))} />
              </div>
              <div className={`${styles.campo} ${styles.campoFull}`}>
                <label className={styles.campoLabel}>Foto</label>
                <FotoUpload onFile={setFotoFile} />
              </div>
            </div>

            {erroForm && <p className={styles.erroForm}>{erroForm}</p>}

            <div className={styles.garrafaFormAcoes}>
              <button type="button" className="btn-ghost"
                onClick={() => { setFormAberto(false); setForm(FORM_VAZIO); setErroForm('') }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={salvando}>
                {salvando ? 'A guardar...' : 'Guardar garrafa'}
              </button>
            </div>
          </form>
        )}

        {carregandoGarrafas ? (
          <p className={styles.garrafasLoading}>...</p>
        ) : garrafas.length === 0 && !formAberto ? (
          <p className={styles.garrafasVazio}>Nenhuma garrafa registada ainda.</p>
        ) : (
          <div className={styles.garrafasLista}>
            {garrafas.map((g) => (
              <GarrafaCard key={g.id} garrafa={g} slug={slug} encontroId={id} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
