import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin, useAdminConfrarias } from '../../hooks/useAdmin.js'
import AdminConfraria from './AdminConfraria.jsx'
import AdminMembros from './AdminMembros.jsx'
import AdminEncontros from './AdminEncontros.jsx'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { autenticado, logout } = useAdmin()
  const navigate = useNavigate()
  const { confrarias, carregando, criar, atualizar, alternarAtivo, atualizarSenha } = useAdminConfrarias()

  const [confSelecionada, setConfSelecionada] = useState(null)
  const [aba, setAba] = useState('confraria')
  const [novaConfraria, setNovaConfraria] = useState(false)

  useEffect(() => {
    if (!autenticado) navigate('/admin')
  }, [autenticado])

  function handleLogout() {
    logout()
    navigate('/admin')
  }

  function handleSelectConf(c) {
    setConfSelecionada(c)
    setAba('confraria')
    setNovaConfraria(false)
  }

  function handleVoltar() {
    setConfSelecionada(null)
    setNovaConfraria(false)
  }

  const mostraDetalhe = confSelecionada || novaConfraria

  return (
    <div className={`${styles.layout} ${mostraDetalhe ? styles.mostraDetalhe : ''}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <span className={styles.sideLogo}>The Cellar</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>

        <div className={styles.sideSection}>
          <p className={styles.sideLabel}>Confrarias</p>
          <button
            className={`${styles.sideItem} ${novaConfraria ? styles.sideItemActive : ''}`}
            onClick={() => { setNovaConfraria(true); setConfSelecionada(null) }}
          >
            + Nova Confraria
          </button>
          {carregando ? (
            <p className={styles.sideLoading}>...</p>
          ) : (
            confrarias.map((c) => (
              <button
                key={c.id}
                className={`${styles.sideItem} ${confSelecionada?.id === c.id ? styles.sideItemActive : ''} ${!c.ativa ? styles.sideItemInactive : ''}`}
                onClick={() => handleSelectConf(c)}
              >
                {c.nome}
                {!c.ativa && ' ·'}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Conteúdo */}
      <main className={styles.main}>
        <button className={styles.btnVoltar} onClick={handleVoltar}>
          ← Confrarias
        </button>

        {novaConfraria && (
          <NovaConfrariaForm
            onCreate={async (dados) => {
              const { data, error } = await criar(dados)
              if (!error) {
                setNovaConfraria(false)
                setConfSelecionada(data)
              }
              return { data, error }
            }}
            onCancel={() => setNovaConfraria(false)}
          />
        )}

        {confSelecionada && !novaConfraria && (
          <>
            <div className={styles.tabs}>
              {['confraria', 'membros', 'encontros'].map((t) => (
                <button
                  key={t}
                  className={`${styles.tab} ${aba === t ? styles.tabAtivo : ''}`}
                  onClick={() => setAba(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {aba === 'confraria' && (
              <AdminConfraria
                confraria={confSelecionada}
                onUpdate={(campos) => atualizar(confSelecionada.id, campos)}
                onToggle={() => alternarAtivo(confSelecionada.id, confSelecionada.ativa)}
                onAtualizarSenha={(senha) => atualizarSenha(confSelecionada.id, senha)}
              />
            )}
            {aba === 'membros' && (
              <AdminMembros confrariaId={confSelecionada.id} />
            )}
            {aba === 'encontros' && (
              <AdminEncontros confrariaId={confSelecionada.id} />
            )}
          </>
        )}

        {!confSelecionada && !novaConfraria && (
          <div className={styles.vazio}>
            <p>Selecione uma confraria ou crie uma nova.</p>
          </div>
        )}
      </main>
    </div>
  )
}

function NovaConfrariaForm({ onCreate, onCancel }) {
  const [form, setForm] = useState({ nome: '', slug: '', descricao: '', senha: '' })
  const [erro, setErro] = useState('')
  const [linkGerado, setLinkGerado] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  function handleNome(e) {
    const nome = e.target.value
    const slug = nome.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
    setForm((f) => ({ ...f, nome, slug }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.slug || !form.senha) {
      setErro('Nome, slug e senha são obrigatórios.')
      return
    }
    const { data, error } = await onCreate(form)
    if (error) {
      setErro(error.message)
    } else {
      setLinkGerado(`${window.location.origin}${import.meta.env.BASE_URL}#/c/${form.slug}`)
    }
  }

  if (linkGerado) {
    return (
      <div className={styles.form}>
        <h2 className={styles.formTitulo}>Confraria criada!</h2>
        <p className={styles.linkLabel}>Link da confraria:</p>
        <div className={styles.linkBox}>
          <code>{linkGerado}</code>
          <button
            className="btn-ghost"
            onClick={() => navigator.clipboard.writeText(linkGerado)}
          >
            Copiar
          </button>
        </div>
        <button className="btn-primary" onClick={onCancel}>
          Concluído
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitulo}>Nova Confraria</h2>

      <div className={styles.campo}>
        <label className={styles.campoLabel}>Nome</label>
        <input className="input" value={form.nome} onChange={handleNome} />
      </div>

      <div className={styles.campo}>
        <label className={styles.campoLabel}>Slug (URL)</label>
        <input
          className="input"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.campoLabel}>Descrição (opcional)</label>
        <textarea
          className="input"
          rows={2}
          value={form.descricao}
          onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.campoLabel}>Senha de acesso</label>
        <div className={styles.senhaWrap}>
          <input
            className="input"
            type={mostrarSenha ? 'text' : 'password'}
            value={form.senha}
            onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
          />
          <button
            type="button"
            className={styles.toggleSenha}
            onClick={() => setMostrarSenha((v) => !v)}
          >
            {mostrarSenha ? 'ocultar' : 'mostrar'}
          </button>
        </div>
      </div>

      {erro && <p className={styles.erro}>{erro}</p>}

      <div className={styles.acoes}>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Criar Confraria
        </button>
      </div>
    </form>
  )
}
