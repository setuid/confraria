import { useState } from 'react'
import StarRating from './StarRating.jsx'
import styles from './FichaDegustacaoForm.module.css'

// ── Dados de configuração ────────────────────────────────────────────────────

const CORES = [
  { valor: 'púrpura',  label: 'Púrpura',  hex: '#5C1A6B' },
  { valor: 'rubi',     label: 'Rubi',      hex: '#9B1B30' },
  { valor: 'granada',  label: 'Granada',   hex: '#7B2D3E' },
  { valor: 'carmim',   label: 'Carmim',    hex: '#C8003E' },
  { valor: 'tijolo',   label: 'Tijolo',    hex: '#9B4A3A' },
  { valor: 'âmbar',   label: 'Âmbar',     hex: '#C8973A' },
  { valor: 'dourado',  label: 'Dourado',   hex: '#C8B400' },
  { valor: 'palha',    label: 'Palha',     hex: '#D4C87A' },
  { valor: 'rosé',    label: 'Rosé',      hex: '#E8A0A0' },
  { valor: 'salmão',  label: 'Salmão',    hex: '#E87060' },
]

const GRUPOS_AROMA = [
  { grupo: 'Frutos Vermelhos', aromas: ['morango', 'cereja', 'framboesa', 'romã'] },
  { grupo: 'Frutos Negros',   aromas: ['amora', 'mirtilo', 'ameixa', 'cassis'] },
  { grupo: 'Frutos Tropicais', aromas: ['abacaxi', 'manga', 'maracujá', 'banana'] },
  { grupo: 'Cítricos',         aromas: ['limão', 'toranja', 'laranja', 'bergamota'] },
  { grupo: 'Florais',          aromas: ['rosa', 'violeta', 'flor branca', 'jasmim'] },
  { grupo: 'Especiarias',      aromas: ['pimenta', 'canela', 'cravo', 'noz-moscada'] },
  { grupo: 'Terra / Mineral',  aromas: ['mineral', 'pedra molhada', 'terra', 'couro', 'cogumelo'] },
  { grupo: 'Madeira / Carvalho', aromas: ['baunilha', 'cedro', 'tostado', 'defumado', 'café', 'chocolate'] },
]

// ── Componentes auxiliares ───────────────────────────────────────────────────

function BtnGroup({ opcoes, valor, onChange }) {
  return (
    <div className={styles.btnGroup}>
      {opcoes.map((op) => (
        <button
          key={op.valor ?? op}
          type="button"
          className={`${styles.btn} ${(valor === (op.valor ?? op)) ? styles.btnAtivo : ''}`}
          onClick={() => onChange(valor === (op.valor ?? op) ? null : (op.valor ?? op))}
        >
          {op.label ?? op}
        </button>
      ))}
    </div>
  )
}

function Escala({ valor, onChange, min = 1, max = 5, labelMin, labelMax }) {
  return (
    <div className={styles.escalaWrap}>
      {labelMin && <span className={styles.escalaLabel}>{labelMin}</span>}
      <div className={styles.escala}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.escalaBt} ${valor === n ? styles.escalaBtAtivo : ''}`}
            onClick={() => onChange(valor === n ? null : n)}
          >
            {n}
          </button>
        ))}
      </div>
      {labelMax && <span className={styles.escalaLabel}>{labelMax}</span>}
    </div>
  )
}

function SecLabel({ children }) {
  return <p className={styles.secLabel}>{children}</p>
}

function Campo({ label, children }) {
  return (
    <div className={styles.campo}>
      <label className={styles.campoLabel}>{label}</label>
      {children}
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

const FICHA_VAZIA = {
  visual: { cor: null, intensidade: null, limpidez: null },
  nariz:  { intensidade: null, aromas: [] },
  boca:   { doçura: null, acidez: null, tanino: null, corpo: null, final: null },
  conclusao: { potencial: null, notas: '' },
}

export default function FichaDegustacaoForm({ fichaInicial, notaInicial = 0, onSalvar, onCancelar }) {
  const [ficha, setFicha] = useState(() => fichaInicial ?? FICHA_VAZIA)
  const [nota, setNota] = useState(notaInicial)
  const [salvando, setSalvando] = useState(false)

  function setVisual(campo, val) {
    setFicha((f) => ({ ...f, visual: { ...f.visual, [campo]: val } }))
  }
  function setNariz(campo, val) {
    setFicha((f) => ({ ...f, nariz: { ...f.nariz, [campo]: val } }))
  }
  function toggleAroma(aroma) {
    setFicha((f) => {
      const aromas = f.nariz.aromas.includes(aroma)
        ? f.nariz.aromas.filter((a) => a !== aroma)
        : [...f.nariz.aromas, aroma]
      return { ...f, nariz: { ...f.nariz, aromas } }
    })
  }
  function setBoca(campo, val) {
    setFicha((f) => ({ ...f, boca: { ...f.boca, [campo]: val } }))
  }
  function setConclusao(campo, val) {
    setFicha((f) => ({ ...f, conclusao: { ...f.conclusao, [campo]: val } }))
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSalvando(true)
    await onSalvar(nota, ficha)
    setSalvando(false)
  }

  return (
    <form className={styles.form} onSubmit={handleSalvar}>

      {/* ── VISUAL ── */}
      <section className={styles.secao}>
        <SecLabel>Visual</SecLabel>

        <Campo label="Cor">
          <div className={styles.cores}>
            {CORES.map((c) => (
              <button
                key={c.valor}
                type="button"
                title={c.label}
                className={`${styles.corChip} ${ficha.visual.cor === c.valor ? styles.corChipAtivo : ''}`}
                style={{ background: c.hex }}
                onClick={() => setVisual('cor', ficha.visual.cor === c.valor ? null : c.valor)}
              />
            ))}
          </div>
          {ficha.visual.cor && (
            <span className={styles.corLabel}>
              {CORES.find((c) => c.valor === ficha.visual.cor)?.label}
            </span>
          )}
        </Campo>

        <Campo label="Intensidade">
          <BtnGroup
            opcoes={['Pálido', 'Médio', 'Profundo'].map((l) => ({ valor: l.toLowerCase(), label: l }))}
            valor={ficha.visual.intensidade}
            onChange={(v) => setVisual('intensidade', v)}
          />
        </Campo>

        <Campo label="Limpidez">
          <BtnGroup
            opcoes={[{ valor: 'límpido', label: 'Límpido' }, { valor: 'turvo', label: 'Turvo' }]}
            valor={ficha.visual.limpidez}
            onChange={(v) => setVisual('limpidez', v)}
          />
        </Campo>
      </section>

      {/* ── NARIZ ── */}
      <section className={styles.secao}>
        <SecLabel>Nariz</SecLabel>

        <Campo label="Intensidade">
          <BtnGroup
            opcoes={['Fechado', 'Sutil', 'Médio', 'Pronunciado'].map((l) => ({ valor: l.toLowerCase(), label: l }))}
            valor={ficha.nariz.intensidade}
            onChange={(v) => setNariz('intensidade', v)}
          />
        </Campo>

        <Campo label="Aromas">
          {GRUPOS_AROMA.map(({ grupo, aromas }) => (
            <div key={grupo} className={styles.grupoAroma}>
              <p className={styles.grupoLabel}>{grupo}</p>
              <div className={styles.chips}>
                {aromas.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`${styles.chip} ${ficha.nariz.aromas.includes(a) ? styles.chipAtivo : ''}`}
                    onClick={() => toggleAroma(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </Campo>
      </section>

      {/* ── BOCA ── */}
      <section className={styles.secao}>
        <SecLabel>Boca</SecLabel>

        <Campo label="Doçura">
          <BtnGroup
            opcoes={[
              { valor: 'seco', label: 'Seco' },
              { valor: 'meio-seco', label: 'Meio-seco' },
              { valor: 'doce', label: 'Doce' },
            ]}
            valor={ficha.boca.doçura}
            onChange={(v) => setBoca('doçura', v)}
          />
        </Campo>

        <Campo label="Acidez">
          <Escala valor={ficha.boca.acidez} onChange={(v) => setBoca('acidez', v)} labelMin="Baixa" labelMax="Alta" />
        </Campo>

        <Campo label="Tanino">
          <Escala valor={ficha.boca.tanino} onChange={(v) => setBoca('tanino', v)} labelMin="Suave" labelMax="Firme" />
        </Campo>

        <Campo label="Corpo">
          <BtnGroup
            opcoes={[
              { valor: 'leve', label: 'Leve' },
              { valor: 'médio', label: 'Médio' },
              { valor: 'encorpado', label: 'Encorpado' },
            ]}
            valor={ficha.boca.corpo}
            onChange={(v) => setBoca('corpo', v)}
          />
        </Campo>

        <Campo label="Final">
          <BtnGroup
            opcoes={[
              { valor: 'curto', label: 'Curto' },
              { valor: 'médio', label: 'Médio' },
              { valor: 'longo', label: 'Longo' },
            ]}
            valor={ficha.boca.final}
            onChange={(v) => setBoca('final', v)}
          />
        </Campo>
      </section>

      {/* ── CONCLUSÃO ── */}
      <section className={styles.secao}>
        <SecLabel>Conclusão</SecLabel>

        <Campo label="Nota geral">
          <StarRating nota={nota} onChange={setNota} />
        </Campo>

        <Campo label="Potencial de guarda">
          <BtnGroup
            opcoes={[
              { valor: 'agora', label: 'Beber agora' },
              { valor: '1-3', label: '1–3 anos' },
              { valor: '3-5', label: '3–5 anos' },
              { valor: '5+', label: '5+ anos' },
            ]}
            valor={ficha.conclusao.potencial}
            onChange={(v) => setConclusao('potencial', v)}
          />
        </Campo>

        <Campo label="Notas livres (opcional)">
          <textarea
            className="input"
            rows={3}
            placeholder="Impressões gerais, comparações, memórias…"
            value={ficha.conclusao.notas}
            onChange={(e) => setConclusao('notas', e.target.value)}
          />
        </Campo>
      </section>

      {/* ── AÇÕES ── */}
      <div className={styles.acoes}>
        <button type="button" className="btn-ghost" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={salvando}>
          {salvando ? 'A guardar…' : 'Guardar ficha'}
        </button>
      </div>
    </form>
  )
}
