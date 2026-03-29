import { useParams, Link } from 'react-router-dom'
import { useEstatisticas } from '../hooks/useEstatisticas.js'
import StarRating from '../components/wine/StarRating.jsx'
import MemberAvatar from '../components/ui/MemberAvatar.jsx'
import GoldDivider from '../components/ui/GoldDivider.jsx'
import { gerarCor } from '../lib/utils.js'
import styles from './Estatisticas.module.css'

const TIPO_LABELS = {
  tinto: 'Tinto', branco: 'Branco', 'rosé': 'Rosé',
  espumante: 'Espumante', sobremesa: 'Sobremesa', outro: 'Outro',
}

const TIPO_COR = {
  tinto: '#9B1B30', branco: '#C8B400', 'rosé': '#E8A0A0',
  espumante: '#D4C87A', sobremesa: '#C8973A', outro: '#6B5C4E',
}

function BarraHorizontal({ valor, max, cor }) {
  const pct = max > 0 ? (valor / max) * 100 : 0
  return (
    <div className={styles.barra}>
      <div className={styles.barraFill} style={{ width: `${pct}%`, background: cor ?? 'var(--ouro)' }} />
    </div>
  )
}

export default function Estatisticas() {
  const { slug } = useParams()
  const { stats, carregando } = useEstatisticas(slug)

  if (carregando) {
    return <div className={styles.loading}>A calcular…</div>
  }

  if (!stats) {
    return <div className={styles.loading}>Sem dados ainda.</div>
  }

  const maxMembro = Math.max(...stats.membroStats.map(m => m.count), 1)
  const totalVinhosParaTipo = Object.values(stats.porTipo).reduce((s, v) => s + v, 0)

  return (
    <div className={styles.page}>
      <h1 className={styles.titulo}>Estatísticas</h1>

      {/* Números gerais */}
      <div className={styles.numerosGrid}>
        <div className={styles.numero}>
          <span className={styles.numeroVal}>{stats.totalEncontros}</span>
          <span className={styles.numeroLabel}>Encontros</span>
        </div>
        <div className={styles.numero}>
          <span className={styles.numeroVal}>{stats.totalVinhos}</span>
          <span className={styles.numeroLabel}>Vinhos</span>
        </div>
        <div className={styles.numero}>
          <span className={styles.numeroVal}>{stats.totalFichas}</span>
          <span className={styles.numeroLabel}>Fichas</span>
        </div>
        {stats.mediaGeral !== null && (
          <div className={styles.numero}>
            <span className={styles.numeroVal}>{stats.mediaGeral.toFixed(1)}</span>
            <span className={styles.numeroLabel}>Média geral</span>
          </div>
        )}
      </div>

      <GoldDivider />

      {/* Destaques */}
      {(stats.melhorVinho || stats.vinhoMaisControverso) && (
        <>
          <section className={styles.secao}>
            <p className={styles.secLabel}>Destaques</p>
            <div className={styles.destaqueGrid}>
              {stats.melhorVinho && (
                <div className={styles.destaqueCard}>
                  <p className={styles.destaqueLabel}>Melhor avaliado</p>
                  <p className={styles.destaqueNome}>{stats.melhorVinho.nome}</p>
                  {stats.melhorVinho.produtor && (
                    <p className={styles.destaqueMeta}>{stats.melhorVinho.produtor}</p>
                  )}
                  <div className={styles.destaqueRating}>
                    <StarRating nota={stats.melhorVinho.media} readonly />
                    <span className={styles.destaqueMediaNum}>{stats.melhorVinho.media.toFixed(1)}</span>
                  </div>
                </div>
              )}
              {stats.vinhoMaisControverso && (
                <div className={styles.destaqueCard}>
                  <p className={styles.destaqueLabel}>Mais controverso</p>
                  <p className={styles.destaqueNome}>{stats.vinhoMaisControverso.nome}</p>
                  {stats.vinhoMaisControverso.produtor && (
                    <p className={styles.destaqueMeta}>{stats.vinhoMaisControverso.produtor}</p>
                  )}
                  <p className={styles.destaqueMeta}>
                    desvio ±{stats.vinhoMaisControverso.desvio.toFixed(2)} pts
                  </p>
                </div>
              )}
            </div>
          </section>
          <GoldDivider />
        </>
      )}

      {/* Ranking de vinhos */}
      {stats.garrafasComMedia.length > 0 && (
        <>
          <section className={styles.secao}>
            <p className={styles.secLabel}>Ranking de vinhos</p>
            <div className={styles.rankingList}>
              {stats.garrafasComMedia.slice(0, 10).map((g, i) => (
                <div key={g.id} className={styles.rankingItem}>
                  <span className={styles.rankingPos}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.rankingInfo}>
                    <p className={styles.rankingNome}>{g.nome}</p>
                    {g.produtor && <p className={styles.rankingMeta}>{g.produtor}{g.safra ? ` · ${g.safra}` : ''}</p>}
                  </div>
                  <div className={styles.rankingRating}>
                    <StarRating nota={g.media} readonly />
                    <span className={styles.rankingMedia}>{g.media.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <GoldDivider />
        </>
      )}

      {/* Membros */}
      {stats.membroStats.length > 0 && (
        <>
          <section className={styles.secao}>
            <p className={styles.secLabel}>Membros</p>
            <div className={styles.membrosList}>
              {stats.membroStats.map((m) => (
                <div key={m.apelido} className={styles.membroItem}>
                  <MemberAvatar apelido={m.apelido} cor={gerarCor(m.apelido)} size={28} />
                  <div className={styles.membroInfo}>
                    <span className={styles.membroNome}>{m.apelido}</span>
                    <BarraHorizontal valor={m.count} max={maxMembro} />
                  </div>
                  <div className={styles.membroStats}>
                    <span className={styles.membroMedia}>{m.media.toFixed(1)} ★</span>
                    <span className={styles.membroCount}>{m.count} av.</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <GoldDivider />
        </>
      )}

      {/* Tipos de vinho */}
      {Object.keys(stats.porTipo).length > 0 && (
        <>
          <section className={styles.secao}>
            <p className={styles.secLabel}>Por tipo</p>
            <div className={styles.tiposList}>
              {Object.entries(stats.porTipo)
                .sort((a, b) => b[1] - a[1])
                .map(([tipo, count]) => (
                  <div key={tipo} className={styles.tipoItem}>
                    <span
                      className={styles.tipoDot}
                      style={{ background: TIPO_COR[tipo] ?? 'var(--brique)' }}
                    />
                    <span className={styles.tipoNome}>{TIPO_LABELS[tipo] ?? tipo}</span>
                    <BarraHorizontal valor={count} max={totalVinhosParaTipo} cor={TIPO_COR[tipo]} />
                    <span className={styles.tipoCount}>{count}</span>
                  </div>
                ))}
            </div>
          </section>
          <GoldDivider />
        </>
      )}

      {/* Regiões */}
      {stats.topRegioes.length > 0 && (
        <section className={styles.secao}>
          <p className={styles.secLabel}>Regiões</p>
          <div className={styles.regioesList}>
            {stats.topRegioes.map(([regiao, count]) => (
              <div key={regiao} className={styles.regiaoItem}>
                <span className={styles.regiaoNome}>{regiao}</span>
                <BarraHorizontal valor={count} max={stats.topRegioes[0][1]} />
                <span className={styles.regiaoCount}>{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
