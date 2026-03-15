import { useState } from 'react'
import { useAdminEncontros } from '../../hooks/useAdmin.js'
import RomanNumeral from '../../components/ui/RomanNumeral.jsx'
import GoldDivider from '../../components/ui/GoldDivider.jsx'
import { formatarData } from '../../lib/utils.js'
import styles from './AdminEncontros.module.css'

const STATUS_OPTS = ['planejado', 'confirmado', 'realizado', 'cancelado']

const FORM_VAZIO = {
  titulo: '',
  tema: '',
  descricao: '',
  data_hora: '',
  local_nome: '',
  local_endereco: '',
  status: 'planejado',
  numero_romano: '',
}

export default function AdminEncontros({ confrariaId }) {
  const { encontros, carregando, criar, atualizar, excluir } =
    useAdminEncontros(confrariaId)

  const [editando, setEditando] = useState(null) // null | 'novo' | encontroId
  const [form, setForm] = useState(FORM_VAZIO)
  const [erro, setErro] = useState('')

  function handleNovo() {
    setForm(FORM_VAZIO)
    setEditando('novo')
    setErro('')
  }

  function handleEditar(e) {
    setForm({
      titulo: e.titulo || '',
      tema: e.tema || '',
      descricao: e.descricao || '',
      data_hora: e.data_hora ? e.data_hora.slice(0, 16) : '',
      local_nome: e.local_nome || '',
      local_endereco: e.local_endereco || '',
      status: e.status || 'planejado',
      numero_romano: e.numero_romano || '',
    })
    setEditando(e.id)
    setErro('')
  }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!form.titulo.trim()) {
      setErro('O título é obrigatório.')
      return
    }
    const dados = {
      ...form,
      data_hora: form.data_hora || null,
    }
    if (editando === 'novo') {
      const { error } = await criar(dados)
      if (error) { setErro(error.message); return }
    } else {
      const { error } = await atualizar(editando, dados)
      if (error) { setErro(error.message); return }
    }
    setEditando(null)
  }

  async function handleExcluir(id) {
    if (!confirm('Excluir este encontro?')) return
    await excluir(id)
    if (editando === id) setEditando(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h3 className={styles.secTitulo}>Encontros</h3>
        <button className="btn-primary" onClick={handleNovo}>
          Novo Encontro
        </button>
      </div>

      {/* Formulário */}
      {editando && (
        <form className={styles.form} onSubmit={handleSalvar}>
          <h4 className={styles.formTitulo}>
            {editando === 'novo' ? 'Novo Encontro' : 'Editar Encontro'}
          </h4>

          <div className={styles.grid}>
            <div className={styles.campo}>
              <label className={styles.campoLabel}>Título *</label>
              <input className="input" value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} />
            </div>
            <div className={styles.campo}>
              <label className={styles.campoLabel}>Número Romano</label>
              <input className="input" value={form.numero_romano} placeholder="Gerado auto"
                onChange={(e) => setForm((f) => ({ ...f, numero_romano: e.target.value }))} />
            </div>
            <div className={styles.campo}>
              <label className={styles.campoLabel}>Tema</label>
              <input className="input" value={form.tema}
                onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))} />
            </div>
            <div className={styles.campo}>
              <label className={styles.campoLabel}>Status</label>
              <select className="input" value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className={styles.campo}>
              <label className={styles.campoLabel}>Data e Hora</label>
              <input className="input" type="datetime-local" value={form.data_hora}
                onChange={(e) => setForm((f) => ({ ...f, data_hora: e.target.value }))} />
            </div>
            <div className={styles.campo}>
              <label className={styles.campoLabel}>Local</label>
              <input className="input" value={form.local_nome} placeholder="Nome do local"
                onChange={(e) => setForm((f) => ({ ...f, local_nome: e.target.value }))} />
            </div>
            <div className={`${styles.campo} ${styles.full}`}>
              <label className={styles.campoLabel}>Endereço</label>
              <input className="input" value={form.local_endereco}
                onChange={(e) => setForm((f) => ({ ...f, local_endereco: e.target.value }))} />
            </div>
            <div className={`${styles.campo} ${styles.full}`}>
              <label className={styles.campoLabel}>Descrição</label>
              <textarea className="input" rows={3} value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} />
            </div>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <div className={styles.acoes}>
            <button type="button" className="btn-ghost" onClick={() => setEditando(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Salvar
            </button>
          </div>
        </form>
      )}

      <GoldDivider />

      {/* Lista */}
      {carregando ? (
        <p className={styles.loading}>...</p>
      ) : encontros.length === 0 ? (
        <p className={styles.vazio}>Nenhum encontro ainda.</p>
      ) : (
        <div className={styles.lista}>
          {encontros.map((e) => (
            <div key={e.id} className={styles.row}>
              <RomanNumeral value={e.numero_romano} size="sm" />
              <div className={styles.rowInfo}>
                <span className={styles.rowTitulo}>{e.titulo}</span>
                <div className={styles.rowMeta}>
                  <span className={`badge badge-${e.status}`}>{e.status}</span>
                  {e.data_hora && <span>{formatarData(e.data_hora)}</span>}
                </div>
              </div>
              <div className={styles.rowAcoes}>
                <button className={styles.btnEditar} onClick={() => handleEditar(e)}>
                  Editar
                </button>
                <button className={styles.btnExcluir} onClick={() => handleExcluir(e.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
