import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { paraRomano } from '../lib/utils.js'

const ADMIN_KEY = 'the-cellar-admin'

export function useAdmin() {
  const [autenticado, setAutenticado] = useState(false)

  useEffect(() => {
    const val = sessionStorage.getItem(ADMIN_KEY)
    setAutenticado(val === 'ok')
  }, [])

  function login(senha) {
    const senhaCorreta = import.meta.env.VITE_ADMIN_PASSWORD
    if (senha === senhaCorreta) {
      sessionStorage.setItem(ADMIN_KEY, 'ok')
      setAutenticado(true)
      return true
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_KEY)
    setAutenticado(false)
  }

  return { autenticado, login, logout }
}

// CRUD Confrarias
export function useAdminConfrarias() {
  const [confrarias, setConfrarias] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { buscar() }, [])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('confrarias')
      .select(`
        *,
        membros(count),
        encontros(count)
      `)
      .order('criada_em', { ascending: false })
    setConfrarias(data || [])
    setCarregando(false)
  }

  async function criar({ nome, slug, descricao, senha }) {
    // Chama Edge Function que faz bcrypt hash da senha
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const resp = await fetch(`${supabaseUrl}/functions/v1/criar-confraria`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, slug, descricao, senha }),
    })
    const json = await resp.json()
    if (!resp.ok) return { data: null, error: { message: json.erro } }
    await buscar()
    return { data: json.confraria, error: null }
  }

  async function atualizar(id, campos) {
    const { error } = await supabase
      .from('confrarias')
      .update(campos)
      .eq('id', id)
    if (!error) await buscar()
    return { error }
  }

  async function alternarAtivo(id, ativo) {
    return atualizar(id, { ativa: !ativo })
  }

  return { confrarias, carregando, criar, atualizar, alternarAtivo, refetch: buscar }
}

// CRUD Membros
export function useAdminMembros(confrariaId) {
  const [membros, setMembros] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (confrariaId) buscar()
  }, [confrariaId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('membros')
      .select('*')
      .eq('confraria_id', confrariaId)
      .order('apelido')
    setMembros(data || [])
    setCarregando(false)
  }

  async function adicionar({ apelido, papel }) {
    const { data, error } = await supabase
      .from('membros')
      .insert({ confraria_id: confrariaId, apelido, papel })
      .select()
      .single()
    if (!error) await buscar()
    return { data, error }
  }

  async function atualizar(id, campos) {
    const { error } = await supabase
      .from('membros')
      .update(campos)
      .eq('id', id)
    if (!error) await buscar()
    return { error }
  }

  async function alternarAtivo(id, ativo) {
    return atualizar(id, { ativo: !ativo })
  }

  return { membros, carregando, adicionar, atualizar, alternarAtivo, refetch: buscar }
}

// CRUD Encontros
export function useAdminEncontros(confrariaId) {
  const [encontros, setEncontros] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (confrariaId) buscar()
  }, [confrariaId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('encontros')
      .select('*')
      .eq('confraria_id', confrariaId)
      .order('criado_em', { ascending: false })
    setEncontros(data || [])
    setCarregando(false)
  }

  async function criar(campos) {
    // Gera número romano automaticamente
    const proximo = encontros.length + 1
    const numero_romano = paraRomano(proximo)
    const { data, error } = await supabase
      .from('encontros')
      .insert({ ...campos, confraria_id: confrariaId, numero_romano })
      .select()
      .single()
    if (!error) await buscar()
    return { data, error }
  }

  async function atualizar(id, campos) {
    const { error } = await supabase
      .from('encontros')
      .update(campos)
      .eq('id', id)
    if (!error) await buscar()
    return { error }
  }

  async function excluir(id) {
    const { error } = await supabase
      .from('encontros')
      .delete()
      .eq('id', id)
    if (!error) await buscar()
    return { error }
  }

  return { encontros, carregando, criar, atualizar, excluir, refetch: buscar }
}
