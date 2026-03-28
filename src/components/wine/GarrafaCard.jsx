import { Link } from 'react-router-dom'
import MemberAvatar from '../ui/MemberAvatar.jsx'
import StarRating from './StarRating.jsx'
import { gerarCor } from '../../lib/utils.js'
import styles from './GarrafaCard.module.css'

function mediaNotas(avaliacoes) {
  if (!avaliacoes?.length) return null
  const soma = avaliacoes.reduce((acc, a) => acc + Number(a.nota), 0)
  return soma / avaliacoes.length
}

export default function GarrafaCard({ garrafa, slug, encontroId }) {
  const media = mediaNotas(garrafa.avaliacoes)

  return (
    <Link
      to={`/c/${slug}/encontros/${encontroId}/garrafas/${garrafa.id}`}
      className={styles.card}
    >
      <div className={styles.foto}>
        {garrafa.foto_url ? (
          <img src={garrafa.foto_url} alt={garrafa.nome} className={styles.img} />
        ) : (
          <div className={styles.semFoto}>
            <svg viewBox="0 0 24 24" fill="none" className={styles.iconGarrafa}>
              <path
                d="M9 2h6v4c0 0 2 1.5 2 4v10a1 1 0 01-1 1H8a1 1 0 01-1-1V10c0-2.5 2-4 2-4V2z"
                stroke="currentColor" strokeWidth="1" strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.nome}>{garrafa.nome}</p>
        {garrafa.produtor && <p className={styles.meta}>{garrafa.produtor}{garrafa.safra ? ` · ${garrafa.safra}` : ''}</p>}
        {garrafa.regiao && <p className={styles.meta}>{garrafa.regiao}</p>}

        <div className={styles.rodape}>
          <div className={styles.autor}>
            <MemberAvatar apelido={garrafa.apelido} cor={gerarCor(garrafa.apelido)} size={20} />
            <span className={styles.autorNome}>{garrafa.apelido}</span>
          </div>
          <div className={styles.rating}>
            {media !== null ? (
              <>
                <StarRating nota={media} readonly />
                <span className={styles.ratingCount}>({garrafa.avaliacoes.length})</span>
              </>
            ) : (
              <span className={styles.semRating}>sem avaliações</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
