// Formata data/hora para exibição
export function formatarData(dataHora) {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatarDataCurta(dataHora) {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatarHora(dataHora) {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// Gera cor única baseada no apelido (determinística)
export function gerarCor(apelido) {
  const cores = [
    '#C8973A', // ouro
    '#7B5EA7', // ametista
    '#2E86AB', // azul
    '#A23B72', // vinho rosa
    '#4CAF82', // verde
    '#E07A5F', // terracota
    '#3D405B', // azul escuro
    '#81B29A', // verde sage
    '#F2CC8F', // amarelo
    '#9B2335', // bordô
    '#6B4423', // marrom
    '#4A7C59', // verde floresta
  ]
  let hash = 0
  for (let i = 0; i < apelido.length; i++) {
    hash = apelido.charCodeAt(i) + ((hash << 5) - hash)
  }
  return cores[Math.abs(hash) % cores.length]
}

// Converte número para romano
export function paraRomano(num) {
  const valores = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'],  [90, 'XC'],  [50, 'L'],  [40, 'XL'],
    [10, 'X'],   [9, 'IX'],   [5, 'V'],   [4, 'IV'],
    [1, 'I'],
  ]
  let resultado = ''
  for (const [valor, simbolo] of valores) {
    while (num >= valor) {
      resultado += simbolo
      num -= valor
    }
  }
  return resultado
}

// Verifica se JWT está expirado
export function jwtExpirado(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return payload.exp < Math.floor(Date.now() / 1000)
  } catch {
    return true
  }
}
