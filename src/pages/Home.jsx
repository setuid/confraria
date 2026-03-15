import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessoesSalvas } from '../hooks/useAuth.js'
import { formatarDataCurta } from '../lib/utils.js'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import styles from './Home.module.css'

export default function Home() {
  const sessoes = useSessoesSalvas()
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  function handleEntrar(e) {
    e.preventDefault()
    if (!input.trim()) return
    // Aceita URL completa ou só o slug
    const slug = input.trim().replace(/.*\/c\//, '').replace(/\/$/, '')
    navigate(`/c/${slug}`)
  }

  function handleCardClick(sessao) {
    navigate(`/c/${sessao.slug}/dashboard`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <h1 className={styles.logo}>The Cellar</h1>
        <p className={styles.sub}>◆</p>

        {sessoes.length > 0 && (
          <>
            <div className={styles.sessoes}>
              {sessoes.map((s) => (
                <button
                  key={s.slug}
                  className={styles.card}
                  onClick={() => handleCardClick(s)}
                >
                  <div className={styles.cardSeal}>✦</div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardNome}>{s.confraria?.nome || s.slug}</span>
                    <div className={styles.cardMeta}>
                      <MemberAvatar apelido={s.apelido} cor={s.cor} size={20} />
                      <span className={styles.cardApelido}>{s.apelido}</span>
                    </div>
                    <span className={styles.cardData}>
                      {formatarDataCurta(s.acessoEm)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <GoldDivider />
          </>
        )}

        <p className={styles.hint}>
          {sessoes.length === 0 ? 'Tem o link de uma confraria?' : 'Ou entre numa nova confraria'}
        </p>

        <form className={styles.form} onSubmit={handleEntrar}>
          <input
            className={`input ${styles.input}`}
            type="text"
            placeholder="Cole o link ou o slug da confraria"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
