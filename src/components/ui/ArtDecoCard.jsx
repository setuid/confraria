import styles from './ArtDecoCard.module.css'

export default function ArtDecoCard({ children, highlight = false, className = '', ...props }) {
  return (
    <div
      className={`${styles.card} ${highlight ? styles.highlight : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
