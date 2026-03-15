import { useState } from 'react'
import { usePresenca } from '../../hooks/usePresenca.js'
import styles from './RsvpButtons.module.css'

const OPCOES = [
  { status: 'confirmado', label: 'Estarei lá' },
  { status: 'recusado', label: 'Desta vez não posso' },
  { status: 'talvez', label: 'Talvez' },
]

export default function RsvpButtons({ encontroId, apelido, statusAtual }) {
  const { atualizar, carregando } = usePresenca()
  const [status, setStatus] = useState(statusAtual || 'pendente')

  async function handleClick(novoStatus) {
    if (carregando || novoStatus === status) return
    await atualizar(encontroId, apelido, novoStatus)
    setStatus(novoStatus)
  }

  return (
    <div className={styles.wrapper}>
      {OPCOES.map((opcao) => (
        <button
          key={opcao.status}
          className={`${styles.btn} ${status === opcao.status ? styles.ativo : ''}`}
          onClick={() => handleClick(opcao.status)}
          disabled={carregando}
        >
          {opcao.label}
        </button>
      ))}
    </div>
  )
}
