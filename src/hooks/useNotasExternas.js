import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

async function comprimirImagem(file, maxWidth = 1024, qualidade = 0.82) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', qualidade)
    }
    img.src = url
  })
}

async function fileParaBase64(file) {
  const blob = await comprimirImagem(file)
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.readAsDataURL(blob)
  })
}

export function useNotasExternas(garrafaId) {
  const [notas, setNotas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [buscandoIA, setBuscandoIA] = useState(false)
  const [sugestoesIA, setSugestoesIA] = useState(null)
  const [vinhoIdentificado, setVinhoIdentificado] = useState(null)

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
    setVinhoIdentificado(null)
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

  async function analisarFotoComIA(file) {
    setBuscandoIA(true)
    setSugestoesIA(null)
    setVinhoIdentificado(null)
    try {
      const imagemBase64 = await fileParaBase64(file)
      const { data, error } = await supabase.functions.invoke('analisar-foto-vinho', {
        body: { imagemBase64, mimeType: 'image/jpeg' },
      })
      if (error) throw error
      setSugestoesIA(data?.notas ?? [])
      setVinhoIdentificado(data?.vinhoIdentificado ?? null)
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
    setVinhoIdentificado(null)
  }

  return {
    notas,
    carregando,
    buscandoIA,
    sugestoesIA,
    vinhoIdentificado,
    adicionar,
    remover,
    buscarComIA,
    analisarFotoComIA,
    descartarSugestao,
    descartarSugestoes,
  }
}
