import { useState } from 'react'
import { useAdminMembros } from '../../hooks/useAdmin.js'
import MemberAvatar from '../../components/ui/MemberAvatar.jsx'
import GoldDivider from '../../components/ui/GoldDivider.jsx'
import { gerarCor } from '../../lib/utils.js'
import styles from './AdminMembros.module.css'

export default function AdminMembros({ confrariaId }) {
  const { membros, carregando, adicionar, atualizar, alternarAtivo } =
    useAdminMembros(confrariaId)

  const [form, setForm] = useState({ apelido: '', papel: 'membro' })
  const [erro, setErro] = useState('')

  async function handleAdicionar(e) {
    e.preventDefault()
    if (!form.apelido.trim()) return
    setErro('')
    const { error } = await adicionar(form)
    if (error) {
      setErro(error.message.includes('unique') ? 'Este apelido já existe.' : error.message)
    } else {
      setForm({ apelido: '', papel: 'membro' })
    }
  }

  return (
    <div className={styles.page}>
      <h3 className={styles.secTitulo}>Adicionar membro</h3>
      <form className={styles.addForm} onSubmit={handleAdicionar}>
        <input
          className="input"
          placeholder="Apelido"
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
            <div key={m.id} className={`${styles.row} ${!m.ativo ? styles.rowInativo : ''}`}>
              <MemberAvatar apelido={m.apelido} cor={m.cor || gerarCor(m.apelido)} size={36} />
              <div className={styles.rowInfo}>
                <span className={styles.rowNome}>{m.apelido}</span>
                <span className={styles.rowPapel}>{m.papel}</span>
              </div>
              <div className={styles.rowAcoes}>
                <select
                  className={styles.selectPapel}
                  value={m.papel}
                  onChange={(e) => atualizar(m.id, { papel: e.target.value })}
                >
                  <option value="membro">Membro</option>
                  <option value="organizador">Organizador</option>
                </select>
                <button
                  className={m.ativo ? styles.btnDesativar : styles.btnReativar}
                  onClick={() => alternarAtivo(m.id, m.ativo)}
                >
                  {m.ativo ? 'Desativar' : 'Reativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
