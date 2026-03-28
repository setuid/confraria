import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

// Lista de garrafas de um encontro
export function useGarrafas(encontroId) {
  const [garrafas, setGarrafas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (encontroId) buscar()
  }, [encontroId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('garrafas')
      .select(`
        *,
        avaliacoes(*),
        comentarios(*)
      `)
      .eq('encontro_id', encontroId)
      .order('criado_em', { ascending: true })
    setGarrafas(data || [])
    setCarregando(false)
  }

  async function adicionar(campos) {
    const { data, error } = await supabase
      .from('garrafas')
      .insert({ ...campos, encontro_id: encontroId })
      .select()
      .single()
    if (!error) await buscar()
    return { data, error }
  }

  async function remover(garrafaId, fotoUrl) {
    if (fotoUrl) await deleteFotoStorage(fotoUrl)
    const { error } = await supabase.from('garrafas').delete().eq('id', garrafaId)
    if (!error) await buscar()
    return { error }
  }

  return { garrafas, carregando, adicionar, remover, refetch: buscar }
}

// Garrafa individual com tudo
export function useGarrafa(garrafaId) {
  const [garrafa, setGarrafa] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (garrafaId) buscar()
  }, [garrafaId])

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase
      .from('garrafas')
      .select(`
        *,
        avaliacoes(*),
        comentarios(*)
      `)
      .eq('id', garrafaId)
      .single()
    setGarrafa(data || null)
    setCarregando(false)
  }

  async function adicionarAvaliacao(apelido, nota, ficha = null) {
    const { error } = await supabase
      .from('avaliacoes')
      .upsert({ garrafa_id: garrafaId, apelido, nota, ficha }, { onConflict: 'garrafa_id,apelido' })
    if (!error) await buscar()
    return { error }
  }

  async function adicionarComentario(apelido, texto) {
    const { error } = await supabase
      .from('comentarios')
      .insert({ garrafa_id: garrafaId, apelido, texto })
    if (!error) await buscar()
    return { error }
  }

  async function atualizarFoto(novaFotoUrl) {
    const { error } = await supabase
      .from('garrafas')
      .update({ foto_url: novaFotoUrl })
      .eq('id', garrafaId)
    if (!error) await buscar()
    return { error }
  }

  return { garrafa, carregando, adicionarAvaliacao, adicionarComentario, atualizarFoto, refetch: buscar }
}

// Upload de foto para o Storage
export async function uploadFotoGarrafa(file) {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('garrafas-fotos')
    .upload(path, file, { upsert: false })
  if (error) return { url: null, error }
  const { data } = supabase.storage.from('garrafas-fotos').getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

// Apaga foto do Storage a partir da URL pública
export async function deleteFotoStorage(url) {
  const marker = '/garrafas-fotos/'
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await supabase.storage.from('garrafas-fotos').remove([path])
}
