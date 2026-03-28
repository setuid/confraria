import { useRef, useState } from 'react'
import styles from './FotoUpload.module.css'

const MAX_MB = 5

export default function FotoUpload({ onFile }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [erro, setErro] = useState('')

  function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setErro('')
    if (file.size > MAX_MB * 1024 * 1024) {
      setErro(`Máximo ${MAX_MB} MB.`)
      return
    }
    setPreview(URL.createObjectURL(file))
    onFile(file)
  }

  function handleRemover() {
    setPreview(null)
    setErro('')
    if (inputRef.current) inputRef.current.value = ''
    onFile(null)
  }

  return (
    <div className={styles.wrap}>
      {preview ? (
        <div className={styles.preview}>
          <img src={preview} alt="preview" className={styles.img} />
          <button type="button" className={styles.remover} onClick={handleRemover}>
            Remover
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.zona}
          onClick={() => inputRef.current?.click()}
        >
          <span className={styles.icone}>↑</span>
          <span className={styles.texto}>Adicionar foto</span>
          <span className={styles.sub}>até {MAX_MB} MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.inputEscondido}
        onChange={handleChange}
      />
      {erro && <p className={styles.erro}>{erro}</p>}
    </div>
  )
}
