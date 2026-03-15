import { Link } from 'react-router-dom'
import RomanNumeral from '../ui/RomanNumeral.jsx'
import styles from './MeetingCard.module.css'
import { formatarData } from '../../lib/utils.js'

const STATUS_LABELS = {
  planejado: 'Planejado',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
}

export default function MeetingCard({ encontro, slug }) {
  const confirmados = encontro.presencas?.filter((p) => p.status === 'confirmado').length ?? 0

  return (
    <Link to={`/c/${slug}/encontros/${encontro.id}`} className={styles.card}>
      <div className={styles.header}>
        <RomanNumeral value={encontro.numero_romano} size="md" />
        <span className={`badge badge-${encontro.status}`}>
          {STATUS_LABELS[encontro.status]}
        </span>
      </div>

      <h3 className={styles.titulo}>{encontro.titulo}</h3>
      {encontro.tema && <p className={styles.tema}>{encontro.tema}</p>}

      <div className={styles.meta}>
        {encontro.data_hora && (
          <span className={styles.metaItem}>
            {formatarData(encontro.data_hora)}
          </span>
        )}
        {encontro.local_nome && (
          <span className={styles.metaItem}>{encontro.local_nome}</span>
        )}
        {confirmados > 0 && (
          <span className={styles.metaItem}>{confirmados} confirmados</span>
        )}
      </div>
    </Link>
  )
}
