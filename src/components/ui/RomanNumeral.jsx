import styles from './RomanNumeral.module.css'

export default function RomanNumeral({ value, size = 'md', className = '' }) {
  return (
    <span className={`${styles.numeral} ${styles[size]} ${className}`}>
      {value}
    </span>
  )
}
