import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useMembros } from '../hooks/useMembros.js'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import { gerarCor } from '../lib/utils.js'
import styles from './Membros.module.css'

export default function Membros() {
  const { slug } = useParams()
  const { sessao } = useAuth(slug)
  const { membros, carregando } = useMembros(sessao?.confraria?.id)

  const organizadores = membros.filter((m) => m.papel === 'organizador')
  const membrosSimples = membros.filter((m) => m.papel === 'membro')

  return (
    <div className={styles.page}>
      <h1 className={styles.titulo}>Membros</h1>
      <GoldDivider />

      {carregando ? (
        <p className={styles.loading}>...</p>
      ) : (
        <>
          {organizadores.length > 0 && (
            <section className={styles.grupo}>
              <p className={styles.grupoLabel}>Organizadores</p>
              <div className={styles.lista}>
                {organizadores.map((m) => (
                  <MemberRow key={m.id} membro={m} isMe={m.apelido === sessao?.apelido} />
                ))}
              </div>
            </section>
          )}

          {membrosSimples.length > 0 && (
            <section className={styles.grupo}>
              {organizadores.length > 0 && <GoldDivider />}
              <p className={styles.grupoLabel}>Membros</p>
              <div className={styles.lista}>
                {membrosSimples.map((m) => (
                  <MemberRow key={m.id} membro={m} isMe={m.apelido === sessao?.apelido} />
                ))}
              </div>
            </section>
          )}

          {membros.length === 0 && (
            <p className={styles.vazio}>Nenhum membro ainda.</p>
          )}
        </>
      )}
    </div>
  )
}

function MemberRow({ membro, isMe }) {
  const cor = membro.cor || gerarCor(membro.apelido)
  return (
    <div className={`${styles.row} ${isMe ? styles.rowMe : ''}`}>
      <MemberAvatar apelido={membro.apelido} cor={cor} size={44} />
      <div className={styles.rowInfo}>
        <span className={styles.rowNome}>{membro.apelido}</span>
        {isMe && <span className={styles.rowVoce}>(você)</span>}
      </div>
      {membro.papel === 'organizador' && (
        <span className={styles.sacaRolha} title="Organizador">✦</span>
      )}
    </div>
  )
}
