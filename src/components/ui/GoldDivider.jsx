import styles from './GoldDivider.module.css'

export default function GoldDivider({ className = '' }) {
  return (
    <div className={`${styles.divider} ${className}`}>
      <div className={styles.line} />
      <span className={styles.diamond}>◆</span>
      <div className={styles.line} />
    </div>
  )
}
