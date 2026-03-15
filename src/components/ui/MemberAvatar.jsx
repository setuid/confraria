import styles from './MemberAvatar.module.css'

export default function MemberAvatar({ apelido, cor, size = 40, className = '' }) {
  const inicial = apelido ? apelido[0].toUpperCase() : '?'
  const bgColor = cor || '#5C4A2A'

  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor + '33', // 20% opacity
        borderColor: bgColor,
        fontSize: size * 0.4,
      }}
      title={apelido}
    >
      {inicial}
    </div>
  )
}
