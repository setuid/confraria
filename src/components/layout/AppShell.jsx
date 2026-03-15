import { Outlet, useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import Sidebar from './Sidebar.jsx'
import BottomBar from './BottomBar.jsx'
import styles from './AppShell.module.css'

export default function AppShell() {
  const { slug } = useParams()
  const { sessao } = useAuth(slug)

  if (!sessao) {
    return <Navigate to={`/c/${slug}`} replace />
  }

  return (
    <div className={styles.shell}>
      <Sidebar slug={slug} sessao={sessao} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomBar slug={slug} />
    </div>
  )
}
