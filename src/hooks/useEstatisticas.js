import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

function desvio(notas) {
  if (notas.length < 2) return 0
  const m = notas.reduce((s, n) => s + n, 0) / notas.length
  return Math.sqrt(notas.reduce((s, n) => s + (n - m) ** 2, 0) / notas.length)
}

export function useEstatisticas(slug) {
  const [stats, setStats] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (slug) buscar()
  }, [slug])

  async function buscar() {
    setCarregando(true)

    const [{ data: confraria }, { data: encontros }] = await Promise.all([
      supabase.from('confrarias').select('id').eq('slug', slug).single(),
      supabase.from('encontros').select('id, titulo, data, status').eq('confraria_slug', slug).order('data', { ascending: false }),
    ])

    if (!confraria) { setCarregando(false); return }

    const { data: garrafas } = await supabase
      .from('garrafas')
      .select('id, nome, produtor, safra, regiao, tipo, cego, apelido, encontro_id, avaliacoes(*)')
      .eq('confraria_id', confraria.id)
      .order('criado_em', { ascending: true })

    const realizados = (encontros || []).filter(e => e.status === 'realizado')
    const todasAvaliacoes = (garrafas || []).flatMap(g => g.avaliacoes || [])

    // Media geral
    const mediaGeral = todasAvaliacoes.length
      ? todasAvaliacoes.reduce((s, a) => s + Number(a.nota), 0) / todasAvaliacoes.length
      : null

    // Melhor vinho (mín 2 avaliações)
    const garrafasComMedia = (garrafas || [])
      .filter(g => g.avaliacoes?.length >= 2)
      .map(g => ({
        ...g,
        media: g.avaliacoes.reduce((s, a) => s + Number(a.nota), 0) / g.avaliacoes.length,
      }))
      .sort((a, b) => b.media - a.media)

    const melhorVinho = garrafasComMedia[0] || null

    // Mais controverso (maior desvio-padrão, mín 2 avaliações)
    const vinhoMaisControverso = (garrafas || [])
      .filter(g => g.avaliacoes?.length >= 2)
      .map(g => ({
        ...g,
        desvio: desvio(g.avaliacoes.map(a => Number(a.nota))),
      }))
      .sort((a, b) => b.desvio - a.desvio)[0] || null

    // Stats por membro
    const porMembro = {}
    todasAvaliacoes.forEach(a => {
      if (!porMembro[a.apelido]) porMembro[a.apelido] = { total: 0, count: 0 }
      porMembro[a.apelido].total += Number(a.nota)
      porMembro[a.apelido].count++
    })
    const membroStats = Object.entries(porMembro)
      .map(([apelido, { total, count }]) => ({ apelido, media: total / count, count }))
      .sort((a, b) => b.count - a.count)

    // Distribuição por tipo
    const porTipo = {}
    ;(garrafas || []).forEach(g => {
      const t = g.tipo || 'outro'
      porTipo[t] = (porTipo[t] || 0) + 1
    })

    // Top regiões
    const porRegiao = {}
    ;(garrafas || []).filter(g => g.regiao).forEach(g => {
      porRegiao[g.regiao] = (porRegiao[g.regiao] || 0) + 1
    })
    const topRegioes = Object.entries(porRegiao)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)

    setStats({
      totalEncontros: realizados.length,
      totalVinhos: (garrafas || []).length,
      totalFichas: todasAvaliacoes.filter(a => a.ficha).length,
      mediaGeral,
      melhorVinho,
      vinhoMaisControverso,
      membroStats,
      porTipo,
      topRegioes,
      encontros: realizados,
      garrafasComMedia,
    })
    setCarregando(false)
  }

  return { stats, carregando }
}
