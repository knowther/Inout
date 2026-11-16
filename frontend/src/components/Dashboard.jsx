import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [itens, setItens] = useState([])
  const [movs, setMovs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.listarItens(), api.listarMovimentacoes()])
      .then(([i, m]) => { setItens(i); setMovs(m) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="empty-state"><p>Carregando...</p></div>

  const totalItens = itens.length
  const totalEstoque = itens.reduce((sum, i) => sum + i.quantidade, 0)
  const itensZerados = itens.filter(i => i.quantidade === 0).length
  const totalMovs = movs.length

  const recentes = movs.slice(0, 8)
  const itensAlerta = itens
    .filter(i => i.quantidade <= 5)
    .sort((a, b) => a.quantidade - b.quantidade)

  const formatarData = (iso) =>
    new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral do estoque</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total de Itens</h3>
            <div className="stat-value">{totalItens}</div>
          </div>
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Em Estoque</h3>
            <div className="stat-value">{totalEstoque}</div>
          </div>
          <div className="stat-icon green">
            <ArrowDownToLine size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Itens Zerados</h3>
            <div className="stat-value">{itensZerados}</div>
          </div>
          <div className="stat-icon red">
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Movimentações</h3>
            <div className="stat-value">{totalMovs}</div>
          </div>
          <div className="stat-icon amber">
            <ArrowUpFromLine size={24} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Movimentações Recentes</h2>
            <Link to="/movimentacoes" className="btn btn-ghost btn-sm">
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          {recentes.length === 0 ? (
            <div className="empty-state">
              <ArrowUpFromLine size={40} />
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
                    <th className="col-num">Qtd.</th>
                  </tr>
                </thead>
                <tbody>
                  {recentes.map(m => (
                    <tr key={m.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatarData(m.dataHora)}</td>
                      <td>
                        <span className={`badge ${m.tipo === 'ENTRADA' ? 'badge-success' : 'badge-danger'}`}>
                          {m.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td>{m.item.nome}</td>
                      <td className="col-num">
                        <span style={{ color: m.tipo === 'ENTRADA' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          {m.tipo === 'ENTRADA' ? '+' : '−'}{m.quantidade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Estoque Baixo</h2>
            <Link to="/itens" className="btn btn-ghost btn-sm">
              Ver itens <ArrowRight size={16} />
            </Link>
          </div>
          {itensAlerta.length === 0 ? (
            <div className="empty-state">
              <Package size={40} />
              <p>Todos os itens estão abastecidos!</p>
            </div>
          ) : (
            <div>
              {itensAlerta.map(item => (
                <div key={item.id} className="alert-item">
                  <div>
                    <span className="item-name">{item.nome}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginLeft: 8 }}>
                      {item.unidade}
                    </span>
                  </div>
                  <span className={`item-qty ${item.quantidade === 0 ? 'qty-zero' : 'qty-low'}`}>
                    {item.quantidade}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
