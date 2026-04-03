import { useState } from 'react'
import StarRating from './StarRating.jsx'
import styles from './FichaDegustacaoForm.module.css'

// ── Dados ────────────────────────────────────────────────────────────────────

const CORES = [
  // Tintos
  { valor: 'violeta',  label: 'Violeta',  hex: '#4A1060' },
  { valor: 'púrpura',  label: 'Púrpura',  hex: '#6B1878' },
  { valor: 'rubi',     label: 'Rubi',     hex: '#9B1B30' },
  { valor: 'cereja',   label: 'Cereja',   hex: '#A8253A' },
  { valor: 'granada',  label: 'Granada',  hex: '#7B2D3E' },
  { valor: 'carmim',   label: 'Carmim',   hex: '#C8003E' },
  { valor: 'tijolo',   label: 'Tijolo',   hex: '#9B4A3A' },
  // Brancos
  { valor: 'palha',    label: 'Palha',    hex: '#D4C87A' },
  { valor: 'dourado',  label: 'Dourado',  hex: '#C8A830' },
  { valor: 'âmbar',    label: 'Âmbar',    hex: '#C8703A' },
  // Rosés
  { valor: 'rosé',     label: 'Rosé',     hex: '#E8A8A8' },
  { valor: 'salmão',   label: 'Salmão',   hex: '#E87060' },
  { valor: 'cerise',   label: 'Cerise',   hex: '#C84060' },
]

const GRUPOS_AROMA = [
  {
    grupo: 'Frutos Vermelhos',
    aromas: ['morango', 'cereja', 'framboesa', 'romã', 'groselha', 'geleia de frutas', 'compota'],
  },
  {
    grupo: 'Frutos Negros',
    aromas: ['amora', 'mirtilo', 'ameixa', 'cassis', 'groselha preta', 'figo', 'passa de uva'],
  },
  {
    grupo: 'Frutos Tropicais',
    aromas: ['abacaxi', 'manga', 'maracujá', 'banana', 'lichia', 'goiaba', 'frutas secas'],
  },
  {
    grupo: 'Cítricos',
    aromas: ['limão', 'lima', 'toranja', 'laranja', 'bergamota', 'casca cítrica'],
  },
  {
    grupo: 'Florais',
    aromas: ['rosa', 'violeta', 'lavanda', 'flor branca', 'jasmim', 'peônia', 'flor de laranjeira'],
  },
  {
    grupo: 'Herbáceos / Vegetal',
    aromas: ['hortelã', 'eucalipto', 'ervas frescas', 'pimentão verde', 'azeitona', 'tomilho', 'alecrim'],
  },
  {
    grupo: 'Especiarias',
    aromas: ['pimenta preta', 'pimenta branca', 'canela', 'cravo', 'noz-moscada', 'alcaçuz', 'gengibre', 'anis'],
  },
  {
    grupo: 'Terra / Mineral',
    aromas: ['mineral', 'pedra molhada', 'terra úmida', 'couro', 'cogumelo', 'trufa', 'grafite'],
  },
  {
    grupo: 'Madeira / Carvalho',
    aromas: ['baunilha', 'cedro', 'tostado', 'defumado', 'café', 'chocolate', 'tabaco', 'resina', 'carvalho'],
  },
  {
    grupo: 'Outros',
    aromas: ['mel', 'amanteigado', 'brioche', 'levedura', 'caramelo', 'alcatrão', 'petróleo'],
  },
]

// ── Componentes auxiliares ───────────────────────────────────────────────────

function BtnGroup({ opcoes, valor, onChange }) {
  return (
    <div className={styles.btnGroup}>
      {opcoes.map((op) => {
        const val = op.valor ?? op
        const ativo = valor === val
        return (
          <button
            key={val}
            type="button"
            aria-pressed={ativo}
            className={`${styles.btn} ${ativo ? styles.btnAtivo : ''}`}
            onClick={() => onChange(ativo ? null : val)}
          >
            {op.label ?? op}
          </button>
        )
      })}
    </div>
  )
}

function Escala({ valor, onChange, min = 1, max = 5, labelMin, labelMax }) {
  return (
    <div className={styles.escalaWrap}>
      {(labelMin || labelMax) && (
        <div className={styles.escalaLabels}>
          <span className={styles.escalaLabel}>{labelMin}</span>
          <span className={styles.escalaLabel}>{labelMax}</span>
        </div>
      )}
      <div className={styles.escala} role="group">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={valor === n}
            aria-label={
              n === min && labelMin ? `${n} — ${labelMin}` :
              n === max && labelMax ? `${n} — ${labelMax}` :
              String(n)
            }
            className={`${styles.escalaBt} ${valor === n ? styles.escalaBtAtivo : ''}`}
            onClick={() => onChange(valor === n ? null : n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

function SecLabel({ children }) {
  return <p className={styles.secLabel}>{children}</p>
}

function Campo({ label, children }) {
  return (
    <div className={styles.campo}>
      <span className={styles.campoLabel}>{label}</span>
      {children}
    </div>
  )
}

function GrupoAromaItem({ grupo, aromas, selecionados, onToggle }) {
  const [aberto, setAberto] = useState(false)
  const countAtivos = aromas.filter((a) => selecionados.includes(a)).length

  return (
    <div className={styles.grupoAroma}>
      <button
        type="button"
        className={styles.grupoHeader}
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
      >
        <span className={styles.grupoLabel}>{grupo}</span>
        <div className={styles.grupoHeaderRight}>
          {countAtivos > 0 && (
            <span className={styles.grupoCount}>{countAtivos}</span>
          )}
          <span className={`${styles.grupoSeta} ${aberto ? styles.grupoSetaAberta : ''}`}>▾</span>
        </div>
      </button>
      {aberto && (
        <div className={styles.chips}>
          {aromas.map((a) => {
            const ativo = selecionados.includes(a)
            return (
              <button
                key={a}
                type="button"
                aria-pressed={ativo}
                className={`${styles.chip} ${ativo ? styles.chipAtivo : ''}`}
                onClick={() => onToggle(a)}
              >
                {a}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

const FICHA_VAZIA = {
  visual:    { cor: null, intensidade: null, limpidez: null },
  nariz:     { intensidade: null, aromas: [] },
  boca:      { doçura: null, acidez: null, tanino: null, corpo: null, final: null },
  conclusao: { potencial: null, notas: '' },
}

export default function FichaDegustacaoForm({ fichaInicial, notaInicial = 0, onSalvar, onCancelar }) {
  const [ficha, setFicha] = useState(() => fichaInicial ?? FICHA_VAZIA)
  const [nota, setNota] = useState(notaInicial)
  const [salvando, setSalvando] = useState(false)

  function setVisual(campo, val)    { setFicha((f) => ({ ...f, visual:    { ...f.visual,    [campo]: val } })) }
  function setNariz(campo, val)     { setFicha((f) => ({ ...f, nariz:     { ...f.nariz,     [campo]: val } })) }
  function setBoca(campo, val)      { setFicha((f) => ({ ...f, boca:      { ...f.boca,      [campo]: val } })) }
  function setConclusao(campo, val) { setFicha((f) => ({ ...f, conclusao: { ...f.conclusao, [campo]: val } })) }

  function toggleAroma(aroma) {
    setFicha((f) => {
      const aromas = f.nariz.aromas.includes(aroma)
        ? f.nariz.aromas.filter((a) => a !== aroma)
        : [...f.nariz.aromas, aroma]
      return { ...f, nariz: { ...f.nariz, aromas } }
    })
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSalvando(true)
    await onSalvar(nota, ficha)
    setSalvando(false)
  }

  const totalAromas = ficha.nariz.aromas.length

  return (
    <form className={styles.form} onSubmit={handleSalvar}>

      {/* ── VISUAL ── */}
      <section className={styles.secao}>
        <SecLabel>Visual</SecLabel>

        <Campo label="Cor">
          <div className={styles.coresGrid} role="group" aria-label="Cor do vinho">
            {CORES.map((c) => {
              const ativo = ficha.visual.cor === c.valor
              return (
                <button
                  key={c.valor}
                  type="button"
                  aria-pressed={ativo}
                  aria-label={c.label}
                  className={`${styles.corItem} ${ativo ? styles.corItemAtivo : ''}`}
                  onClick={() => setVisual('cor', ativo ? null : c.valor)}
                >
                  <span className={styles.corCirculo} style={{ background: c.hex }} />
                  <span className={styles.corNome}>{c.label}</span>
                </button>
              )
            })}
          </div>
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

        <Campo label={`Aromas${totalAromas > 0 ? ` · ${totalAromas} selecionados` : ''}`}>
          <p className={styles.aromaDica}>Toque numa categoria para expandir e escolher os aromas</p>
          {GRUPOS_AROMA.map(({ grupo, aromas }) => (
            <GrupoAromaItem
              key={grupo}
              grupo={grupo}
              aromas={aromas}
              selecionados={ficha.nariz.aromas}
              onToggle={toggleAroma}
            />
          ))}
        </Campo>
      </section>

      {/* ── BOCA ── */}
      <section className={styles.secao}>
        <SecLabel>Boca</SecLabel>

        <Campo label="Doçura">
          <BtnGroup
            opcoes={[
              { valor: 'seco',      label: 'Seco' },
              { valor: 'meio-seco', label: 'Meio-seco' },
              { valor: 'doce',      label: 'Doce' },
            ]}
            valor={ficha.boca.doçura}
            onChange={(v) => setBoca('doçura', v)}
          />
        </Campo>

        <Campo label="Acidez">
          <Escala
            valor={ficha.boca.acidez}
            onChange={(v) => setBoca('acidez', v)}
            labelMin="Baixa"
            labelMax="Alta"
          />
        </Campo>

        <Campo label="Tanino">
          <Escala
            valor={ficha.boca.tanino}
            onChange={(v) => setBoca('tanino', v)}
            labelMin="Suave"
            labelMax="Firme"
          />
        </Campo>

        <Campo label="Corpo">
          <BtnGroup
            opcoes={[
              { valor: 'leve',       label: 'Leve' },
              { valor: 'médio',      label: 'Médio' },
              { valor: 'encorpado',  label: 'Encorpado' },
            ]}
            valor={ficha.boca.corpo}
            onChange={(v) => setBoca('corpo', v)}
          />
        </Campo>

        <Campo label="Final">
          <BtnGroup
            opcoes={[
              { valor: 'curto',  label: 'Curto' },
              { valor: 'médio',  label: 'Médio' },
              { valor: 'longo',  label: 'Longo' },
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
              { valor: 'agora',  label: 'Beber agora' },
              { valor: '1-3',    label: '1–3 anos' },
              { valor: '3-7',    label: '3–7 anos' },
              { valor: '7-12',   label: '7–12 anos' },
              { valor: '12-20',  label: '12–20 anos' },
              { valor: '20+',    label: '20+ anos' },
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
