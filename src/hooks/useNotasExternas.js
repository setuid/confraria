import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useNotasExternas(garrafaId) {
  const [notas, setNotas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [buscandoIA, setBuscandoIA] = useState(false)
  const [sugestoesIA, setSugestoesIA] = useState(null)

  const buscar = useCallback(async () => {
    if (!garrafaId) return
    setCarregando(true)
    const { data } = await supabase
      .from('notas_externas')
      .select('*')
      .eq('garrafa_id', garrafaId)
      .order('criado_em', { ascending: true })
    setNotas(data ?? [])
    setCarregando(false)
  }, [garrafaId])

  useEffect(() => { buscar() }, [buscar])

  async function adicionar({ fonte, pontuacao, notas: texto, url, adicionado_por }) {
    await supabase.from('notas_externas').insert({
      garrafa_id: garrafaId,
      fonte,
      pontuacao: pontuacao || null,
      notas: texto || null,
      url: url || null,
      adicionado_por,
    })
    await buscar()
  }

  async function remover(id) {
    await supabase.from('notas_externas').delete().eq('id', id)
    await buscar()
  }

  async function buscarComIA(vinho) {
    setBuscandoIA(true)
    setSugestoesIA(null)
    try {
      const { data, error } = await supabase.functions.invoke('buscar-notas-vinho', {
        body: { nome: vinho.nome, produtor: vinho.produtor, safra: vinho.safra, regiao: vinho.regiao, tipo: vinho.tipo },
      })
      if (error) throw error
      setSugestoesIA(data?.notas ?? [])
    } catch {
      setSugestoesIA([])
    } finally {
      setBuscandoIA(false)
    }
  }

  function descartarSugestao(idx) {
    setSugestoesIA((prev) => prev.filter((_, i) => i !== idx))
  }

  function descartarSugestoes() {
    setSugestoesIA(null)
  }

  return {
    notas,
    carregando,
    buscandoIA,
    sugestoesIA,
    adicionar,
    remover,
    buscarComIA,
    descartarSugestao,
    descartarSugestoes,
  }
}
