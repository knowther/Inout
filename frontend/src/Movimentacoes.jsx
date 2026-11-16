import { useEffect, useState } from 'react'
import { api } from './api.js'
import { useToast } from './components/Toast.jsx'
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Send } from 'lucide-react'

const vazio = { itemId: '', tipo: 'ENTRADA', quantidade: '', observacao: '' }

const formatarData = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export default function Movimentacoes() {
  const [itens, setItens] = useState([])
  const [movs, setMovs] = useState([])
  const [form, setForm] = useState(vazio)
  const [filtroItem, setFiltroItem] = useState('')
  const toast = useToast()

  const carregarItens = () => api.listarItens().then(setItens).catch(e => toast.error(e.message))
  const carregarMovs = () =>
    api.listarMovimentacoes(filtroItem).then(setMovs).catch(e => toast.error(e.message))

  useEffect(() => { carregarItens() }, [])
  useEffect(() => { carregarMovs() }, [filtroItem])

  const itemSelecionado = itens.find(i => String(i.id) === String(form.itemId))

  const registrar = async (e) => {
    e.preventDefault()
    try {
      await api.registrarMovimentacao({
        itemId: Number(form.itemId),
        tipo: form.tipo,
        quantidade: Number(form.quantidade),
        observacao: form.observacao,
      })
      toast.success(
        form.tipo === 'ENTRADA'
          ? `Entrada de ${form.quantidade} registrada com sucesso!`
          : `Saída de ${form.quantidade} registrada com sucesso!`
      )
      setForm({ ...vazio, tipo: form.tipo })
      carregarItens()
      carregarMovs()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Movimentações</h1>
          <p>Registre entradas e saídas do estoque</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ marginBottom: 16 }}>
          <h2>Nova Movimentação</h2>
        </div>

        <form onSubmit={registrar}>
          <div className="toggle-group" style={{ marginBottom: 20 }}>
            <button
              type="button"
              className={form.tipo === 'ENTRADA' ? 'active-entrada' : ''}
              onClick={() => setForm({ ...form, tipo: 'ENTRADA' })}
            >
              <ArrowDownToLine size={16} style={{ marginRight: 6 }} />
              Entrada
            </button>
            <button
              type="button"
              className={form.tipo === 'SAIDA' ? 'active-saida' : ''}
              onClick={() => setForm({ ...form, tipo: 'SAIDA' })}
            >
              <ArrowUpFromLine size={16} style={{ marginRight: 6 }} />
              Saída
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Item</label>
              <select
                value={form.itemId}
                onChange={e => setForm({ ...form, itemId: e.target.value })}
                required
              >
                <option value="">Selecione um item...</option>
                {itens.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nome} — {i.quantidade} {i.unidade} em estoque
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>
                Quantidade{itemSelecionado ? ` (${itemSelecionado.unidade})` : ''}
              </label>
              <input
                type="number"
                min="1"
                max={form.tipo === 'SAIDA' && itemSelecionado ? itemSelecionado.quantidade : undefined}
                value={form.quantidade}
                onChange={e => setForm({ ...form, quantidade: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Observação</label>
              <input
                value={form.observacao}
                onChange={e => setForm({ ...form, observacao: e.target.value })}
                placeholder="Ex.: NF 1234, lote ABC, setor, paciente/sessão..."
              />
            </div>
            <div className="form-actions">
              <button type="submit" className={`btn ${form.tipo === 'ENTRADA' ? 'btn-success' : 'btn-danger'}`}>
                <Send size={16} />
                Registrar {form.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Histórico</h2>
          <select
            value={filtroItem}
            onChange={e => setFiltroItem(e.target.value)}
            style={{ width: 'auto', minWidth: 180 }}
          >
            <option value="">Todos os itens</option>
            {itens.map(i => (
              <option key={i.id} value={i.id}>{i.nome}</option>
            ))}
          </select>
        </div>

        {movs.length === 0 ? (
          <div className="empty-state">
            <ArrowLeftRight size={48} />
            <p>Nenhuma movimentação registrada.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Item</th>
                  <th className="col-num">Quantidade</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {movs.map(m => (
                  <tr key={m.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatarData(m.dataHora)}</td>
                    <td>
                      <span className={`badge ${m.tipo === 'ENTRADA' ? 'badge-success' : 'badge-danger'}`}>
                        {m.tipo === 'ENTRADA' ? '↓ Entrada' : '↑ Saída'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{m.item.nome}</td>
                    <td className="col-num" style={{ fontWeight: 600 }}>
                      <span style={{ color: m.tipo === 'ENTRADA' ? 'var(--success)' : 'var(--danger)' }}>
                        {m.tipo === 'ENTRADA' ? '+' : '−'}{m.quantidade}
                      </span>
                      {' '}
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                        {m.item.unidade}
                      </span>
                    </td>
                    <td style={{ color: m.observacao ? 'var(--text)' : 'var(--text-tertiary)' }}>
                      {m.observacao || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
