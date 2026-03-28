import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useEncontros } from '../hooks/useEncontros.js'
import { useConfraria } from '../hooks/useConfraria.js'
import RomanNumeral from '../components/ui/RomanNumeral.jsx'
import RsvpButtons from '../components/meeting/RsvpButtons.jsx'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import ArtDecoCard from '../components/ui/ArtDecoCard.jsx'
import { formatarData, formatarHora } from '../lib/utils.js'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { slug } = useParams()
  const { sessao } = useAuth(slug)
  const { confraria } = useConfraria(slug)
  const { proximos, realizados, carregando } = useEncontros(
    sessao?.confraria?.id
  )

  const proximoEncontro = proximos[0] || null
  const ultimosRealizados = realizados
    .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
    .slice(0, 3)

  const presencaAtual = proximoEncontro?.presencas?.find(
    (p) => p.apelido === sessao?.apelido
  )

  const confirmados = proximoEncontro?.presencas?.filter(
    (p) => p.status === 'confirmado'
  ) || []

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.confNome}>
            {confraria?.nome || sessao?.confraria?.nome}
          </h2>
          <p className={styles.confSub}>◆</p>
        </div>
        <div className={styles.userChip}>
          <MemberAvatar apelido={sessao?.apelido} cor={sessao?.cor} size={32} />
          <span className={styles.userName}>{sessao?.apelido}</span>
        </div>
      </header>

      <GoldDivider />

      {/* Próximo encontro */}
      {carregando ? (
        <p className={styles.loading}>...</p>
      ) : proximoEncontro ? (
        <ArtDecoCard highlight className={styles.proximoCard}>
          <div className={styles.proximoHeader}>
            <RomanNumeral value={proximoEncontro.numero_romano} size="lg" />
            <span className={`badge badge-${proximoEncontro.status}`}>
              {proximoEncontro.status}
            </span>
          </div>

          <h2 className={styles.proximoTitulo}>{proximoEncontro.titulo}</h2>
          {proximoEncontro.tema && (
            <p className={styles.proximoTema}>{proximoEncontro.tema}</p>
          )}

          <div className={styles.proximoMeta}>
            {proximoEncontro.data_hora && (
              <>
                <span>{formatarData(proximoEncontro.data_hora)}</span>
                <span>·</span>
                <span>{formatarHora(proximoEncontro.data_hora)}</span>
              </>
            )}
            {proximoEncontro.local_nome && (
              <>
                <span>·</span>
                <span>{proximoEncontro.local_nome}</span>
              </>
            )}
          </div>

          {confirmados.length > 0 && (
            <div className={styles.confirmados}>
              <div className={styles.avatares}>
                {confirmados.slice(0, 6).map((p) => (
                  <MemberAvatar key={p.apelido} apelido={p.apelido} size={28} />
                ))}
                {confirmados.length > 6 && (
                  <span className={styles.maisConfirmados}>+{confirmados.length - 6}</span>
                )}
              </div>
              <span className={styles.confCount}>
                {confirmados.length} confirmado{confirmados.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className={styles.rsvpWrap}>
            <RsvpButtons
              encontroId={proximoEncontro.id}
              apelido={sessao?.apelido}
              statusAtual={presencaAtual?.status}
            />
          </div>
        </ArtDecoCard>
      ) : (
        <div className={styles.vazio}>
          <p>Nenhum encontro próximo agendado.</p>
        </div>
      )}

      {/* Últimos encontros */}
      {ultimosRealizados.length > 0 && (
        <section className={styles.secao}>
          <GoldDivider />
          <h3 className={styles.secaoTitulo}>Últimos encontros</h3>
          <div className={styles.lista}>
            {ultimosRealizados.map((e) => (
              <Link
                key={e.id}
                to={`/c/${slug}/encontros/${e.id}`}
                className={styles.itemCard}
              >
                <RomanNumeral value={e.numero_romano} size="sm" />
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitulo}>{e.titulo}</span>
                  <span className={styles.itemData}>
                    {formatarData(e.data_hora)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to={`/c/${slug}/encontros`}
            className={styles.verTodos}
          >
            Ver todos os encontros →
          </Link>
        </section>
      )}
    </div>
  )
}
