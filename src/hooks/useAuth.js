import { useState, useEffect, useCallback } from 'react'
import { gerarCor, jwtExpirado } from '../lib/utils.js'

const STORAGE_KEY = 'the-cellar-sessoes'

function lerSessoes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function salvarSessoes(sessoes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessoes))
}

export function useAuth(slug) {
  const [sessao, setSessao] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  // Carrega sessão do localStorage na montagem
  useEffect(() => {
    if (!slug) return
    const sessoes = lerSessoes()
    const s = sessoes[slug]
    if (s && s.token && !jwtExpirado(s.token)) {
      setSessao(s)
    } else if (s) {
      // Token expirado — remove
      delete sessoes[slug]
      salvarSessoes(sessoes)
    }
  }, [slug])

  const entrar = useCallback(async (senha, apelido) => {
    setCarregando(true)
    setErro(null)
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const resp = await fetch(
        `${supabaseUrl}/functions/v1/validar-senha`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ slug, senha }),
        }
      )
      const data = await resp.json()
      if (!resp.ok) {
        setErro(data.erro || 'Senha errada.')
        return false
      }
      const cor = gerarCor(apelido)
      const novaSessao = {
        slug,
        apelido,
        token: data.token,
        confraria: data.confraria,
        papel: 'membro',
        cor,
        acessoEm: new Date().toISOString(),
      }
      const sessoes = lerSessoes()
      sessoes[slug] = novaSessao
      salvarSessoes(sessoes)
      setSessao(novaSessao)
      return true
    } catch (e) {
      setErro('Erro de conexão.')
      return false
    } finally {
      setCarregando(false)
    }
  }, [slug])

  const sair = useCallback(() => {
    const sessoes = lerSessoes()
    delete sessoes[slug]
    salvarSessoes(sessoes)
    setSessao(null)
  }, [slug])

  return { sessao, carregando, erro, entrar, sair }
}

// Para a tela Home — lista todas as sessões salvas
export function useSessoesSalvas() {
  const [sessoes, setSessoes] = useState([])

  useEffect(() => {
    const todas = lerSessoes()
    const lista = Object.values(todas)
      .filter((s) => s.token && !jwtExpirado(s.token))
      .sort((a, b) => new Date(b.acessoEm) - new Date(a.acessoEm))
    setSessoes(lista)
  }, [])

  return sessoes
}
