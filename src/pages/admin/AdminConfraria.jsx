import { useState } from 'react'
import GoldDivider from '../../components/ui/GoldDivider.jsx'
import styles from './AdminConfraria.module.css'

export default function AdminConfraria({ confraria, onUpdate, onToggle }) {
  const [form, setForm] = useState({
    nome: confraria.nome || '',
    descricao: confraria.descricao || '',
  })
  const [salvo, setSalvo] = useState(false)
  const [editandoSenha, setEditandoSenha] = useState(false)
  const [novaSenha, setNovaSenha] = useState('')

  async function handleSalvar(e) {
    e.preventDefault()
    await onUpdate(form)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const link = `${window.location.origin}/c/${confraria.slug}`

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.titulo}>{confraria.nome}</h2>
          <p className={styles.slug}>/c/{confraria.slug}</p>
        </div>
        <span className={confraria.ativa ? styles.ativa : styles.inativa}>
          {confraria.ativa ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      <div className={styles.linkBox}>
        <code className={styles.link}>{link}</code>
        <button
          className="btn-ghost"
          onClick={() => navigator.clipboard.writeText(link)}
        >
          Copiar link
        </button>
      </div>

      <GoldDivider />

      <form className={styles.form} onSubmit={handleSalvar}>
        <div className={styles.campo}>
          <label className={styles.campoLabel}>Nome</label>
          <input
            className="input"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.campoLabel}>Descrição</label>
          <textarea
            className="input"
            rows={3}
            value={form.descricao}
            onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
          />
        </div>

        <div className={styles.acoes}>
          <button type="submit" className="btn-primary">
            {salvo ? 'Anotado.' : 'Salvar'}
          </button>
          <button
            type="button"
            className={confraria.ativa ? 'btn-danger' : 'btn-ghost'}
            onClick={onToggle}
          >
            {confraria.ativa ? 'Desativar' : 'Reativar'}
          </button>
        </div>
      </form>
    </div>
  )
}
