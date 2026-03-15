import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useConfraria(slug) {
  const [confraria, setConfraria] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!slug) return
    buscar()
  }, [slug])

  async function buscar() {
    setCarregando(true)
    const { data, error } = await supabase
      .from('confrarias')
      .select('id, nome, slug, descricao, ativa')
      .eq('slug', slug)
      .eq('ativa', true)
      .single()

    if (error) setErro(error.message)
    else setConfraria(data)
    setCarregando(false)
  }

  return { confraria, carregando, erro }
}
