import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import MemberAvatar from '../ui/MemberAvatar.jsx'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: 'dashboard', label: 'Início' },
  { to: 'encontros', label: 'Encontros' },
  { to: 'membros', label: 'Membros' },
  { to: 'estatisticas', label: 'Estatísticas' },
]

export default function Sidebar({ slug, sessao }) {
  const { sair } = useAuth(slug)
  const navigate = useNavigate()

  function handleSair() {
    sair()
    navigate('/')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>The Cellar</span>
        <span className={styles.logoSub}>{sessao?.confraria?.nome}</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={`/c/${slug}/${item.to}`}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <MemberAvatar apelido={sessao?.apelido} cor={sessao?.cor} size={32} />
          <div>
            <div className={styles.userName}>{sessao?.apelido}</div>
            <div className={styles.userRole}>{sessao?.papel}</div>
          </div>
        </div>
        <button className={styles.sairBtn} onClick={handleSair}>
          Sair
        </button>
      </div>
    </aside>
  )
}
