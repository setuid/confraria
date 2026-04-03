import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase.js'
import FichaDegustacaoForm from './FichaDegustacaoForm.jsx'
import styles from './LerFichaFoto.module.css'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function LerFichaFoto({ garrafaId, notaInicial = 0, onSalvar, onCancelar }) {
  const [preview, setPreview] = useState(null)
  const [base64, setBase64] = useState(null)
  const [analisando, setAnalisando] = useState(false)
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState(null)
  const inputRef = useRef(null)

  async function handleFotoSelecionada(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setErro('')
    setResultado(null)
    setPreview(URL.createObjectURL(file))
    setBase64(await fileToBase64(file))
    // Limpa o input para permitir selecionar o mesmo ficheiro de novo
    e.target.value = ''
  }

  async function handleAnalisar() {
    if (!base64) return
    setAnalisando(true)
    setErro('')

    const { data, error } = await supabase.functions.invoke('ler-ficha', {
      body: { image_base64: base64, garrafa_id: garrafaId },
    })

    setAnalisando(false)

    if (error) {
      // Tenta extrair mensagem detalhada do corpo da resposta
      let msg = error.message || 'Erro ao chamar a edge function.'
      try {
        const ctx = error.context
        if (ctx) {
          const body = await ctx.json?.() ?? null
          if (body?.erro) msg = body.erro
        }
      } catch (_) { /* ignora */ }
      setErro(msg)
      return
    }

    if (data?.erro) {
      setErro(data.erro)
      return
    }

    setResultado(data)
  }

  function handleTrocarFoto() {
    setPreview(null)
    setBase64(null)
    setResultado(null)
    setErro('')
    inputRef.current?.click()
  }

  // ── Etapa 3: ficha lida → formulário pré-preenchido ──
  if (resultado) {
    return (
      <div>
        <div className={styles.banner}>
          <span className={styles.bannerIcone}>✓</span>
          <span className={styles.bannerTexto}>Ficha lida. Reveja e corrija se necessário.</span>
          <button type="button" className={styles.btnBannerLink} onClick={handleTrocarFoto}>
            Tentar outra foto
          </button>
        </div>
        <FichaDegustacaoForm
          fichaInicial={resultado.ficha}
          notaInicial={resultado.nota ?? notaInicial}
          onSalvar={onSalvar}
          onCancelar={onCancelar}
        />
      </div>
    )
  }

  // ── Input de ficheiro (escondido) ──
  const inputEl = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      capture="environment"
      className={styles.inputEscondido}
      onChange={handleFotoSelecionada}
    />
  )

  // ── Etapa 1: sem foto ──
  if (!preview) {
    return (
      <div className={styles.etapa1}>
        {inputEl}
        <button
          type="button"
          className={styles.btnCapturar}
          onClick={() => inputRef.current?.click()}
        >
          <span className={styles.btnCapturarIcone}>📷</span>
          <span>Fotografar ficha</span>
        </button>
        <p className={styles.dica}>
          Fotografe a secção preenchida à mão da ficha impressa
        </p>
        <button type="button" className="btn-ghost" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    )
  }

  // ── Etapa 2: preview + analisar ──
  return (
    <div className={styles.etapa2}>
      {inputEl}
      <img src={preview} alt="Ficha fotografada" className={styles.previewImg} />
      {erro && <p className={styles.erro}>{erro}</p>}
      <div className={styles.acoes}>
        <button
          type="button"
          className="btn-ghost"
          onClick={handleTrocarFoto}
          disabled={analisando}
        >
          Trocar foto
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancelar}
          disabled={analisando}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleAnalisar}
          disabled={analisando}
        >
          {analisando ? 'A ler a ficha…' : 'Analisar ficha'}
        </button>
      </div>
    </div>
  )
}
