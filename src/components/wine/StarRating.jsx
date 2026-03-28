import { useState } from 'react'
import styles from './StarRating.module.css'

const TOTAL = 5
const STEP  = 0.5

export default function StarRating({ nota = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(null)

  const display = hover !== null ? hover : nota

  function handleMouseMove(e, index) {
    if (readonly) return
    const rect = e.currentTarget.getBoundingClientRect()
    const metade = (e.clientX - rect.left) < rect.width / 2
    setHover(metade ? index - 0.5 : index)
  }

  function handleClick(e, index) {
    if (readonly || !onChange) return
    const rect = e.currentTarget.getBoundingClientRect()
    const metade = (e.clientX - rect.left) < rect.width / 2
    onChange(metade ? index - 0.5 : index)
  }

  function handleKeyDown(e) {
    if (readonly || !onChange) return
    let nova = nota
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      nova = Math.min(TOTAL, nota + STEP)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      nova = Math.max(0, nota - STEP)
    } else if (e.key === 'Home') {
      e.preventDefault()
      nova = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nova = TOTAL
    } else {
      return
    }
    onChange(nova)
  }

  return (
    <div
      role={readonly ? undefined : 'slider'}
      aria-label="Avaliação"
      aria-valuemin={readonly ? undefined : 0}
      aria-valuemax={readonly ? undefined : TOTAL}
      aria-valuenow={readonly ? undefined : nota}
      aria-valuetext={`${display} de ${TOTAL} estrelas`}
      tabIndex={readonly ? -1 : 0}
      className={`${styles.stars} ${readonly ? styles.readonly : ''}`}
      onMouseLeave={() => !readonly && setHover(null)}
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: TOTAL }, (_, i) => {
        const index = i + 1
        const preenchida = display >= index
        const meia = !preenchida && display >= index - 0.5

        return (
          <span
            key={index}
            aria-hidden="true"
            className={`${styles.star} ${preenchida ? styles.cheia : meia ? styles.meia : styles.vazia}`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={(e) => handleClick(e, index)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
