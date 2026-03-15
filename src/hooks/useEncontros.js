import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useEncontros(confrariaId) {
  const [encontros, setEncontros] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!confrariaId) return
    buscar()
  }, [confrariaId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('encontros')
      .select(`
        *,
        presencas(apelido, status)
      `)
      .eq('confraria_id', confrariaId)
      .order('data_hora', { ascending: true })

    setEncontros(data || [])
    setCarregando(false)
  }

  const proximos = encontros.filter(
    (e) =>
      ['planejado', 'confirmado'].includes(e.status) &&
      new Date(e.data_hora) >= new Date()
  )

  const realizados = encontros.filter(
    (e) => e.status === 'realizado' || new Date(e.data_hora) < new Date()
  )

  return { encontros, proximos, realizados, carregando, refetch: buscar }
}

export function useEncontro(encontroId) {
  const [encontro, setEncontro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!encontroId) return
    buscar()
  }, [encontroId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('encontros')
      .select(`
        *,
        presencas(apelido, status)
      `)
      .eq('id', encontroId)
      .single()

    setEncontro(data)
    setCarregando(false)
  }

  return { encontro, carregando, refetch: buscar }
}
