import { useState } from 'react'
import StarRating from './StarRating.jsx'
import styles from './FichaMestreForm.module.css'

const UVAS_TINTAS = ['Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah/Shiraz', 'Malbec', 'Tempranillo', 'Sangiovese', 'Nebbiolo', 'Grenache', 'Carménère', 'Tannat', 'Touriga Nacional']
const UVAS_BRANCAS = ['Chardonnay', 'Sauvignon Blanc', 'Riesling', 'Pinot Grigio', 'Gewürztraminer', 'Viognier', 'Albariño', 'Moscato', 'Chenin Blanc', 'Verdejo']
const UVAS = [...UVAS_TINTAS, ...UVAS_BRANCAS].sort()

export default function FichaMestreForm({ fichaInicial, notaInicial, onSalvar, onCancelar }) {
  const inicial = fichaInicial?.tipo === 'mestre' ? fichaInicial : null

  const [uva, setUva] = useState(inicial?.chutes?.uva ?? '')
  const [regiao, setRegiao] = useState(inicial?.chutes?.regiao ?? '')
  const [safra, setSafra] = useState(inicial?.chutes?.safra ?? '')
  const [produtor, setProdutor] = useState(inicial?.chutes?.produtor ?? '')
  const [notas, setNotas] = useState(inicial?.notas ?? '')
  const [nota, setNota] = useState(notaInicial ?? 0)
  const [uvaPersonalizada, setUvaPersonalizada] = useState(
    inicial?.chutes?.uva && !UVAS.includes(inicial.chutes.uva)
  )

  function handleSalvar(e) {
    e.preventDefault()
    const ficha = {
      tipo: 'mestre',
      chutes: {
        uva: uva.trim() || null,
        regiao: regiao.trim() || null,
        safra: safra ? parseInt(safra) : null,
        produtor: produtor.trim() || null,
      },
      acertos: inicial?.acertos ?? { uva: null, regiao: null, safra: null, produtor: null },
      notas: notas.trim() || null,
    }
    onSalvar(nota, ficha)
  }

  return (
    <form className={styles.form} onSubmit={handleSalvar}>
      <p className={styles.intro}>
        Faça os seus chutes sobre este vinho. Os acertos serão marcados pelo dono após a revelação.
      </p>

      <div className={styles.campos}>
        {/* Uva */}
        <div className={styles.campo}>
          <label className={styles.campoLabel}>Uva / Casta <span className={styles.pts}>3 pts</span></label>
          {!uvaPersonalizada ? (
            <select
              className="input"
              value={uva}
              onChange={(e) => {
                if (e.target.value === '__outro__') { setUvaPersonalizada(true); setUva('') }
                else setUva(e.target.value)
              }}
            >
              <option value="">— não sei</option>
              {UVAS.map((u) => <option key={u} value={u}>{u}</option>)}
              <option value="__outro__">Outra uva…</option>
            </select>
          ) : (
            <div className={styles.inputComVoltar}>
              <input
                className="input"
                placeholder="ex: Touriga Franca"
                value={uva}
                onChange={(e) => setUva(e.target.value)}
                autoFocus
              />
              <button type="button" className={styles.btnVoltar}
                onClick={() => { setUvaPersonalizada(false); setUva('') }}>
                ← Lista
              </button>
            </div>
          )}
        </div>

        {/* Região */}
        <div className={styles.campo}>
          <label className={styles.campoLabel}>Região <span className={styles.pts}>2 pts</span></label>
          <input
            className="input"
            placeholder="ex: Douro, Bordeaux, Mendoza"
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
          />
        </div>

        {/* Safra */}
        <div className={styles.campo}>
          <label className={styles.campoLabel}>Safra <span className={styles.pts}>2 pts</span></label>
          <input
            className="input"
            type="number"
            min="1900"
            max="2099"
            placeholder="ex: 2019"
            value={safra}
            onChange={(e) => setSafra(e.target.value)}
          />
        </div>

        {/* Produtor */}
        <div className={styles.campo}>
          <label className={styles.campoLabel}>Produtor <span className={styles.pts}>3 pts</span></label>
          <input
            className="input"
            placeholder="ex: Quinta do Crasto"
            value={produtor}
            onChange={(e) => setProdutor(e.target.value)}
          />
        </div>

        {/* Notas livres */}
        <div className={`${styles.campo} ${styles.campoFull}`}>
          <label className={styles.campoLabel}>Percepções livres <span className={styles.pts}>—</span></label>
          <textarea
            className="input"
            rows={2}
            placeholder="O que percebeu ao provar? Cor, aromas, sensações…"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </div>
      </div>

      {/* Nota */}
      <div className={styles.notaWrap}>
        <span className={styles.notaLabel}>Sua nota para o vinho</span>
        <StarRating nota={nota} onChange={setNota} />
        {nota > 0 && <span className={styles.notaNum}>{nota.toFixed(1)}</span>}
      </div>

      <div className={styles.acoes}>
        <button type="button" className="btn-ghost" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar chutes</button>
      </div>
    </form>
  )
}
