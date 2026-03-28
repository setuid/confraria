import StarRating from './StarRating.jsx'
import styles from './FichaDegustacaoView.module.css'

const CORES_HEX = {
  'púrpura': '#5C1A6B', rubi: '#9B1B30', granada: '#7B2D3E',
  carmim: '#C8003E', tijolo: '#9B4A3A', 'âmbar': '#C8973A',
  dourado: '#C8B400', palha: '#D4C87A', 'rosé': '#E8A0A0', 'salmão': '#E87060',
}

const POTENCIAL_LABELS = {
  agora: 'Beber agora', '1-3': '1–3 anos', '3-5': '3–5 anos', '5+': '5+ anos',
}

function Linha({ label, children }) {
  if (!children) return null
  return (
    <div className={styles.linha}>
      <span className={styles.linhaLabel}>{label}</span>
      <span className={styles.linhaVal}>{children}</span>
    </div>
  )
}

function EscalaView({ valor }) {
  if (!valor) return null
  return (
    <div className={styles.escala}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${styles.escalaDot} ${n <= valor ? styles.escalaDotAtivo : ''}`}
        />
      ))}
    </div>
  )
}

export default function FichaDegustacaoView({ avaliacao }) {
  const { nota, ficha } = avaliacao
  if (!ficha) return null

  const { visual, nariz, boca, conclusao } = ficha
  const corHex = visual?.cor ? CORES_HEX[visual.cor] : null

  const temVisual = visual?.cor || visual?.intensidade || visual?.limpidez
  const temNariz  = nariz?.intensidade || nariz?.aromas?.length
  const temBoca   = boca?.doçura || boca?.acidez || boca?.tanino || boca?.corpo || boca?.final

  return (
    <div className={styles.ficha}>

      {temVisual && (
        <section className={styles.secao}>
          <p className={styles.secLabel}>Visual</p>
          {corHex && (
            <div className={styles.corRow}>
              <span className={styles.corCirculo} style={{ background: corHex }} />
              <span className={styles.corNome}>{visual.cor}</span>
              {visual.intensidade && <span className={styles.tag}>{visual.intensidade}</span>}
              {visual.limpidez    && <span className={styles.tag}>{visual.limpidez}</span>}
            </div>
          )}
          {!corHex && (
            <>
              {visual.intensidade && <Linha label="Intensidade">{visual.intensidade}</Linha>}
              {visual.limpidez    && <Linha label="Limpidez">{visual.limpidez}</Linha>}
            </>
          )}
        </section>
      )}

      {temNariz && (
        <section className={styles.secao}>
          <p className={styles.secLabel}>Nariz</p>
          {nariz.intensidade && <Linha label="Intensidade">{nariz.intensidade}</Linha>}
          {nariz.aromas?.length > 0 && (
            <div className={styles.chips}>
              {nariz.aromas.map((a) => (
                <span key={a} className={styles.chip}>{a}</span>
              ))}
            </div>
          )}
        </section>
      )}

      {temBoca && (
        <section className={styles.secao}>
          <p className={styles.secLabel}>Boca</p>
          {boca.doçura && <Linha label="Doçura">{boca.doçura}</Linha>}
          {boca.acidez && (
            <div className={styles.linha}>
              <span className={styles.linhaLabel}>Acidez</span>
              <EscalaView valor={boca.acidez} />
            </div>
          )}
          {boca.tanino && (
            <div className={styles.linha}>
              <span className={styles.linhaLabel}>Tanino</span>
              <EscalaView valor={boca.tanino} />
            </div>
          )}
          {boca.corpo && <Linha label="Corpo">{boca.corpo}</Linha>}
          {boca.final && <Linha label="Final">{boca.final}</Linha>}
        </section>
      )}

      <section className={styles.secaoConclusao}>
        <StarRating nota={Number(nota)} readonly />
        {conclusao?.potencial && (
          <span className={styles.potencial}>{POTENCIAL_LABELS[conclusao.potencial] ?? conclusao.potencial}</span>
        )}
        {conclusao?.notas && (
          <p className={styles.notas}>{conclusao.notas}</p>
        )}
      </section>
    </div>
  )
}
