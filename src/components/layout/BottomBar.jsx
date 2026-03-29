import { NavLink } from 'react-router-dom'
import styles from './BottomBar.module.css'

const NAV_ITEMS = [
  { to: 'dashboard', label: 'Início', icon: '⌂' },
  { to: 'encontros', label: 'Encontros', icon: '◈' },
  { to: 'membros', label: 'Membros', icon: '◉' },
  { to: 'estatisticas', label: 'Stats', icon: '❖' },
]

export default function BottomBar({ slug }) {
  return (
    <nav className={styles.bar}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={`/c/${slug}/${item.to}`}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.itemActive : ''}`
          }
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
