import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../hooks/useAdmin.js'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { autenticado, login } = useAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    if (autenticado) navigate('/admin/dashboard')
  }, [autenticado])

  function handleSubmit(e) {
    e.preventDefault()
    const ok = login(senha)
    if (!ok) {
      setErro('Senha errada.')
      setSenha('')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <h1 className={styles.titulo}>The Cellar</h1>
        <p className={styles.sub}>Painel Admin</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className="input"
            type="password"
            placeholder="Senha master"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoFocus
          />
          {erro && <p className={styles.erro}>{erro}</p>}
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
