import StarRating from './StarRating.jsx'
import styles from './FichaMestreView.module.css'

const CAMPOS = [
  { key: 'uva',     label: 'Uva / Casta', pts: 3 },
  { key: 'regiao',  label: 'Região',      pts: 2 },
  { key: 'safra',   label: 'Safra',       pts: 2 },
  { key: 'produtor',label: 'Produtor',    pts: 3 },
]

function calcularPontos(ficha) {
  if (!ficha?.acertos) return null
  const { acertos } = ficha
  let pts = 0
  if (acertos.uva === true)      pts += 3
  if (acertos.regiao === true)   pts += 2
  if (acertos.produtor === true) pts += 3
  if (acertos.safra === true)    pts += 2
  else if (acertos.safra === 'perto') pts += 1
  return pts
}

function temAcertosMarcados(ficha) {
  if (!ficha?.acertos) return false
  return Object.values(ficha.acertos).some((v) => v !== null)
}

function IconeAcerto({ valor }) {
  if (valor === null)    return <span className={styles.iconePendente}>?</span>
  if (valor === true)    return <span className={styles.iconeCorreto}>✓</span>
  if (valor === 'perto') return <span className={styles.iconePerto}>~</span>
  return <span className={styles.iconeErrado}>✗</span>
}

export default function FichaMestreView({ avaliacao, mostrarAcertos = true }) {
  const { nota, ficha } = avaliacao
  if (!ficha || ficha.tipo !== 'mestre') return null

  const { chutes, acertos, notas } = ficha
  const pontos = mostrarAcertos ? calcularPontos(ficha) : null
  const acertosMarcados = temAcertosMarcados(ficha)

  return (
    <div className={styles.ficha}>
      <div className={styles.badge}>🎲 Mestre dos Vinhos</div>

      <div className={styles.chutes}>
        {CAMPOS.map(({ key, label, pts }) => {
          const chute = chutes?.[key]
          const acerto = acertos?.[key] ?? null
          return (
            <div key={key} className={styles.chuteItem}>
              <div className={styles.chuteHeader}>
                <span className={styles.chuteLabel}>{label}</span>
                <span className={styles.chutePts}>{pts} pts</span>
              </div>
              <div className={styles.chuteValor}>
                {chute
                  ? <span className={styles.chuteTexto}>{String(chute)}</span>
                  : <span className={styles.chuteVazio}>—</span>
                }
                {mostrarAcertos && acertosMarcados && (
                  <IconeAcerto valor={acerto} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {notas && (
        <p className={styles.notas}>{notas}</p>
      )}

      <div className={styles.rodape}>
        <StarRating nota={Number(nota)} readonly />
        {pontos !== null && acertosMarcados && (
          <span className={styles.pontuacao}>{pontos} / 10 pts</span>
        )}
        {mostrarAcertos && !acertosMarcados && (
          <span className={styles.pendente}>Aguardando correção</span>
        )}
      </div>
    </div>
  )
}
