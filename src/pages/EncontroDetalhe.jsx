import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useEncontro } from '../hooks/useEncontros.js'
import RomanNumeral from '../components/ui/RomanNumeral.jsx'
import RsvpButtons from '../components/meeting/RsvpButtons.jsx'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import ArtDecoCard from '../components/ui/ArtDecoCard.jsx'
import { formatarData, formatarHora } from '../lib/utils.js'
import styles from './EncontroDetalhe.module.css'

const STATUS_LABELS = {
  planejado: 'Planejado',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
}

export default function EncontroDetalhe() {
  const { slug, id } = useParams()
  const { sessao } = useAuth(slug)
  const { encontro, carregando } = useEncontro(id)

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
    </div>
  )
}
