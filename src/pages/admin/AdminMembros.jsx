import { useState } from 'react'
import { useAdminMembros } from '../../hooks/useAdmin.js'
import MemberAvatar from '../../components/ui/MemberAvatar.jsx'
import GoldDivider from '../../components/ui/GoldDivider.jsx'
import { gerarCor } from '../../lib/utils.js'
import styles from './AdminMembros.module.css'

export default function AdminMembros({ confrariaId }) {
  const { membros, carregando, adicionar, atualizar, alternarAtivo, excluir } =
    useAdminMembros(confrariaId)

  const [form, setForm] = useState({ apelido: '', papel: 'membro' })
  const [erro, setErro] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [editForm, setEditForm] = useState({ apelido: '', papel: 'membro' })
  const [erroEdit, setErroEdit] = useState('')

  async function handleAdicionar(e) {
    e.preventDefault()
    if (!form.apelido.trim()) return
    setErro('')
    const { error } = await adicionar(form)
    if (error) {
      setErro(error.message.includes('unique') ? 'Este nome já existe.' : error.message)
    } else {
      setForm({ apelido: '', papel: 'membro' })
    }
  }

  function iniciarEdicao(m) {
    setEditandoId(m.id)
    setEditForm({ apelido: m.apelido, papel: m.papel })
    setErroEdit('')
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setErroEdit('')
  }

  async function handleSalvarEdicao(e) {
    e.preventDefault()
    if (!editForm.apelido.trim()) return
    setErroEdit('')
    const { error } = await atualizar(editandoId, editForm)
    if (error) {
      setErroEdit(error.message.includes('unique') ? 'Este nome já existe.' : error.message)
    } else {
      setEditandoId(null)
    }
  }

  return (
    <div className={styles.page}>
      <h3 className={styles.secTitulo}>Adicionar membro</h3>
      <form className={styles.addForm} onSubmit={handleAdicionar}>
        <input
          className="input"
          placeholder="Nome"
          value={form.apelido}
          onChange={(e) => setForm((f) => ({ ...f, apelido: e.target.value }))}
          maxLength={20}
        />
        <select
          className="input"
          value={form.papel}
          onChange={(e) => setForm((f) => ({ ...f, papel: e.target.value }))}
        >
          <option value="membro">Membro</option>
          <option value="organizador">Organizador</option>
        </select>
        <button type="submit" className="btn-primary">
          Adicionar
        </button>
      </form>
      {erro && <p className={styles.erro}>{erro}</p>}

      <GoldDivider />

      {carregando ? (
        <p className={styles.loading}>...</p>
      ) : (
        <div className={styles.lista}>
          {membros.map((m) => (
            editandoId === m.id ? (
              <form
                key={m.id}
                className={`${styles.row} ${styles.rowEditando}`}
                onSubmit={handleSalvarEdicao}
              >
                <input
                  className={`input ${styles.inputEdit}`}
                  value={editForm.apelido}
                  onChange={(e) => setEditForm((f) => ({ ...f, apelido: e.target.value }))}
                  maxLength={20}
                  autoFocus
                />
                <select
                  className={styles.selectPapel}
                  value={editForm.papel}
                  onChange={(e) => setEditForm((f) => ({ ...f, papel: e.target.value }))}
                >
                  <option value="membro">Membro</option>
                  <option value="organizador">Organizador</option>
                </select>
                <div className={styles.rowAcoes}>
                  {erroEdit && <span className={styles.erroEdit}>{erroEdit}</span>}
                  <button type="submit" className={styles.btnSalvar}>Salvar</button>
                  <button type="button" className={styles.btnCancelar} onClick={cancelarEdicao}>Cancelar</button>
                </div>
              </form>
            ) : (
              <div key={m.id} className={`${styles.row} ${!m.ativo ? styles.rowInativo : ''}`}>
                <MemberAvatar apelido={m.apelido} cor={m.cor || gerarCor(m.apelido)} size={36} />
                <div className={styles.rowInfo}>
                  <span className={styles.rowNome}>{m.apelido}</span>
                  <span className={styles.rowPapel}>{m.papel}</span>
                </div>
                <div className={styles.rowAcoes}>
                  <button
                    className={styles.btnEditar}
                    onClick={() => iniciarEdicao(m)}
                  >
                    Editar
                  </button>
                  <button
                    className={m.ativo ? styles.btnDesativar : styles.btnReativar}
                    onClick={() => alternarAtivo(m.id, m.ativo)}
                  >
                    {m.ativo ? 'Desativar' : 'Reativar'}
                  </button>
                  <button
                    className={styles.btnExcluir}
                    onClick={() => {
                      if (confirm(`Excluir "${m.apelido}" permanentemente?`)) excluir(m.id)
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}
