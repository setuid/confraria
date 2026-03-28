import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const MAX_FOTOS = 5

export function useEncontroFotos(encontroId) {
  const [fotos, setFotos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (encontroId) buscar()
  }, [encontroId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('encontro_fotos')
      .select('*')
      .eq('encontro_id', encontroId)
      .order('criado_em', { ascending: true })
    setFotos(data || [])
    setCarregando(false)
  }

  async function adicionar(file, apelido) {
    if (fotos.length >= MAX_FOTOS) return { error: new Error(`Máximo de ${MAX_FOTOS} fotos por encontro.`) }
    const ext = file.name.split('.').pop()
    const path = `encontros/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('garrafas-fotos')
      .upload(path, file, { upsert: false })
    if (uploadError) return { error: uploadError }
    const { data: { publicUrl } } = supabase.storage.from('garrafas-fotos').getPublicUrl(path)
    const { error } = await supabase
      .from('encontro_fotos')
      .insert({ encontro_id: encontroId, url: publicUrl, apelido })
    if (!error) await buscar()
    return { error }
  }

  async function remover(id, url) {
    // Remove do storage
    const marker = '/garrafas-fotos/'
    const idx = url.indexOf(marker)
    if (idx !== -1) {
      const path = url.slice(idx + marker.length)
      await supabase.storage.from('garrafas-fotos').remove([path])
    }
    const { error } = await supabase.from('encontro_fotos').delete().eq('id', id)
    if (!error) await buscar()
    return { error }
  }

  return { fotos, carregando, adicionar, remover, maxFotos: MAX_FOTOS }
}
