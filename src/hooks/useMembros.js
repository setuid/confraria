import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useMembros(confrariaId) {
  const [membros, setMembros] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!confrariaId) return
    buscar()
  }, [confrariaId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('membros')
      .select('*')
      .eq('confraria_id', confrariaId)
      .eq('ativo', true)
      .order('papel', { ascending: true })
      .order('apelido', { ascending: true })

    setMembros(data || [])
    setCarregando(false)
  }

  return { membros, carregando, refetch: buscar }
}
