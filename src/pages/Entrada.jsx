import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useConfraria } from '../hooks/useConfraria.js'
import { useMembros } from '../hooks/useMembros.js'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import { gerarCor } from '../lib/utils.js'
import styles from './Entrada.module.css'

export default function Entrada() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { sessao, carregando, erro, entrar } = useAuth(slug)
  const { confraria } = useConfraria(slug)
  const { membros } = useMembros(confraria?.id)

  const [fase, setFase] = useState('animacao') // animacao | senha | apelido
  const [senha, setSenha] = useState('')
  const [apelido, setApelido] = useState('')
  const [outroNome, setOutroNome] = useState(false)
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
    if (e?.preventDefault) e.preventDefault()
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

        {/* Seleção de apelido */}
        {fase === 'apelido' && (
          <div className={styles.form}>
            <p className={styles.pergunta}>Quem é você?</p>

            {membros.length > 0 && !outroNome && (
              <div className={styles.membrosList}>
                {membros.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`${styles.membroBtn} ${apelido === m.apelido ? styles.membroBtnAtivo : ''}`}
                    onClick={() => setApelido(m.apelido)}
                  >
                    <MemberAvatar apelido={m.apelido} cor={m.cor || gerarCor(m.apelido)} size={32} />
                    <span className={styles.membroNome}>{m.apelido}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.outroBtn}
                  onClick={() => { setOutroNome(true); setApelido('') }}
                >
                  Outro nome…
                </button>
              </div>
            )}

            {(outroNome || membros.length === 0) && (
              <>
                <input
                  className={`input-display ${styles.inputApelido}`}
                  type="text"
                  placeholder="Seu nome"
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
                {membros.length > 0 && (
                  <button
                    type="button"
                    className={styles.outroBtn}
                    onClick={() => { setOutroNome(false); setApelido('') }}
                  >
                    ← Ver membros
                  </button>
                )}
              </>
            )}

            {erroLocal && <p className={styles.erro}>{erroLocal}</p>}

            <button
              type="button"
              className={`btn-primary ${styles.btn}`}
              disabled={carregando || !apelido.trim()}
              onClick={(e) => handleApelido(e)}
            >
              {carregando ? '...' : 'Entrar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
