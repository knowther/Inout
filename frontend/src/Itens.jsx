import { useEffect, useState } from 'react'
import { api } from './api.js'
import { useToast } from './components/Toast.jsx'
import Modal from './components/Modal.jsx'
import { Plus, Search, Pencil, Trash2, Package, X } from 'lucide-react'

const vazio = { nome: '', unidade: '' }

export default function Itens() {
  const [itens, setItens] = useState([])
  const [form, setForm] = useState(vazio)
  const [editandoId, setEditandoId] = useState(null)
  const [busca, setBusca] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [excluirAlvo, setExcluirAlvo] = useState(null)
  const toast = useToast()

  const carregar = () => api.listarItens().then(setItens).catch(e => toast.error(e.message))

  useEffect(() => { carregar() }, [])

  const salvar = async (e) => {
    e.preventDefault()
    try {
      if (editandoId) {
        await api.atualizarItem(editandoId, form)
        toast.success('Item atualizado com sucesso!')
      } else {
        await api.criarItem(form)
        toast.success('Item cadastrado com sucesso!')
      }
      cancelar()
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const editar = (item) => {
    setEditandoId(item.id)
    setForm({ nome: item.nome, unidade: item.unidade })
    setShowForm(true)
  }

  const cancelar = () => {
    setEditandoId(null)
    setForm(vazio)
    setShowForm(false)
  }

  const confirmarExclusao = async () => {
    if (!excluirAlvo) return
    try {
      await api.excluirItem(excluirAlvo.id)
      toast.success(`"${excluirAlvo.nome}" excluído.`)
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
    setExcluirAlvo(null)
  }

  const filtrados = itens.filter(i => i.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Itens</h1>
          <p>Gerencie os itens do estoque</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Novo Item
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h2>{editandoId ? 'Editar Item' : 'Novo Item'}</h2>
            <button className="btn btn-ghost btn-icon" onClick={cancelar}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={salvar}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome</label>
                <input
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex.: Dialisador, Agulha AVF 15G"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Unidade</label>
                <input
                  value={form.unidade}
                  onChange={e => setForm({ ...form, unidade: e.target.value })}
                  placeholder="Ex.: unidade, caixa, frasco"
                  list="unidades"
                  required
                />
                <datalist id="unidades">
                  <option value="unidade" />
                  <option value="caixa" />
                  <option value="frasco" />
                  <option value="galão" />
                  <option value="pacote" />
                  <option value="ampola" />
                </datalist>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={cancelar}>
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Itens em estoque ({filtrados.length})</h2>
          <div className="search-input">
            <Search size={18} />
            <input
              placeholder="Buscar item..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>
        {filtrados.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>{busca ? 'Nenhum item encontrado para a busca.' : 'Nenhum item cadastrado ainda.'}</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Unidade</th>
                  <th className="col-num">Quantidade</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.nome}</td>
                    <td>{item.unidade}</td>
                    <td className={`col-num ${item.quantidade === 0 ? 'qty-zero' : item.quantidade <= 5 ? 'qty-low' : ''}`}>
                      {item.quantidade}
                    </td>
                    <td className="col-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" title="Editar" onClick={() => editar(item)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Excluir"
                        onClick={() => setExcluirAlvo(item)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={!!excluirAlvo}
        onClose={() => setExcluirAlvo(null)}
        onConfirm={confirmarExclusao}
        title="Excluir item"
        danger
        confirmText="Excluir"
      >
        <p>Tem certeza que deseja excluir <strong>"{excluirAlvo?.nome}"</strong>?</p>
        <p style={{ marginTop: 8 }}>Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
