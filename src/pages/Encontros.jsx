import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useEncontros } from '../hooks/useEncontros.js'
import MeetingCard from '../components/meeting/MeetingCard.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import styles from './Encontros.module.css'

export default function Encontros() {
  const { slug } = useParams()
  const { sessao } = useAuth(slug)
  const { proximos, realizados, carregando } = useEncontros(sessao?.confraria?.id)
  const [aba, setAba] = useState('proximos')

  const lista = aba === 'proximos' ? proximos : realizados

  return (
    <div className={styles.page}>
      <h1 className={styles.titulo}>Encontros</h1>
      <GoldDivider />

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${aba === 'proximos' ? styles.tabAtivo : ''}`}
          onClick={() => setAba('proximos')}
        >
          Próximos
        </button>
        <button
          className={`${styles.tab} ${aba === 'realizados' ? styles.tabAtivo : ''}`}
          onClick={() => setAba('realizados')}
        >
          Realizados
        </button>
      </div>

      {carregando ? (
        <p className={styles.loading}>...</p>
      ) : lista.length === 0 ? (
        <p className={styles.vazio}>Nada marcado ainda.</p>
      ) : (
        <div className={styles.lista}>
          {lista.map((e) => (
            <MeetingCard key={e.id} encontro={e} slug={slug} />
          ))}
        </div>
      )}
    </div>
  )
}
