import { useState } from 'react'
import styles from './StarRating.module.css'

const TOTAL = 5

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

  return (
    <div
      className={`${styles.stars} ${readonly ? styles.readonly : ''}`}
      onMouseLeave={() => !readonly && setHover(null)}
      aria-label={`${display} de 5 estrelas`}
    >
      {Array.from({ length: TOTAL }, (_, i) => {
        const index = i + 1
        const preenchida = display >= index
        const meia = !preenchida && display >= index - 0.5

        return (
          <span
            key={index}
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
