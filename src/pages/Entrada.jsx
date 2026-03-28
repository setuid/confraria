import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useConfraria } from '../hooks/useConfraria.js'
import styles from './Entrada.module.css'

export default function Entrada() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { sessao, carregando, erro, entrar } = useAuth(slug)
  const { confraria } = useConfraria(slug)

  const [fase, setFase] = useState('animacao') // animacao | senha | apelido
  const [senha, setSenha] = useState('')
  const [apelido, setApelido] = useState('')
  const [erroLocal, setErroLocal] = useState('')

  // Se já tem sessão válida, redireciona
  useEffect(() => {
    if (sessao) {
      navigate(`/c/${slug}/dashboard`, { replace: true })
    }
  }, [sessao])

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setFase('senha'), 1400)
    return () => clearTimeout(timer)
  }, [])

  async function handleSenha(e) {
    e.preventDefault()
    if (!senha.trim()) return
    setErroLocal('')

    // Tenta entrar sem apelido primeiro para validar a senha
    // Se já temos apelido salvo de sessão anterior, usa direto
    // Caso contrário, precisa pedir o apelido
    const resp = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validar-senha`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ slug, senha }),
      }
    )
    if (!resp.ok) {
      const data = await resp.json()
      setErroLocal(data.erro || 'Senha errada.')
      setSenha('')
      return
    }

    // Senha correta — pede apelido
    setFase('apelido')
  }

  async function handleApelido(e) {
    e.preventDefault()
    if (!apelido.trim()) return
    const ok = await entrar(senha, apelido.trim())
    if (!ok) {
      setErroLocal('Algo correu mal. Tente novamente.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.container} ${fase !== 'animacao' ? styles.visible : ''}`}>

        {/* Logo animado */}
        <div className={`${styles.logoWrap} ${fase !== 'animacao' ? styles.logoUp : ''}`}>
          <div className={styles.diamond}>◆</div>
          <h1 className={styles.logo}>The Cellar</h1>
          {confraria && (
            <div className={styles.confrariaNome}>{confraria.nome}</div>
          )}
        </div>

        {/* Formulário de senha */}
        {fase === 'senha' && (
          <form className={styles.form} onSubmit={handleSenha}>
            <p className={styles.pergunta}>Qual é a senha?</p>
            <input
              className={`input-display ${styles.inputSenha}`}
              type="password"
              placeholder="· · · · · · · ·"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoFocus
            />
            {erroLocal && (
              <p className={styles.erro}>{erroLocal}</p>
            )}
            <button type="submit" className={`btn-primary ${styles.btn}`}>
              Entrar
            </button>
          </form>
        )}

        {/* Formulário de apelido */}
        {fase === 'apelido' && (
          <form className={styles.form} onSubmit={handleApelido}>
            <p className={styles.pergunta}>Como te chamam?</p>
            <input
              className={`input-display ${styles.inputApelido}`}
              type="text"
              placeholder="Seu nome"
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              maxLength={20}
              autoFocus
            />
            {erroLocal && (
              <p className={styles.erro}>{erroLocal}</p>
            )}
            <button
              type="submit"
              className={`btn-primary ${styles.btn}`}
              disabled={carregando}
            >
              {carregando ? '...' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
