import { useEffect, useState } from 'react'
import { api } from './api.js'

const vazio = { itemId: '', tipo: 'ENTRADA', quantidade: '', observacao: '' }

const formatarData = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export default function Movimentacoes() {
  const [itens, setItens] = useState([])
  const [movs, setMovs] = useState([])
  const [form, setForm] = useState(vazio)
  const [filtroItem, setFiltroItem] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const carregarItens = () => api.listarItens().then(setItens).catch((e) => setErro(e.message))
  const carregarMovs = () =>
    api.listarMovimentacoes(filtroItem).then(setMovs).catch((e) => setErro(e.message))

  useEffect(() => {
    carregarItens()
  }, [])

  useEffect(() => {
    carregarMovs()
  }, [filtroItem])

  const itemSelecionado = itens.find((i) => String(i.id) === String(form.itemId))

  const registrar = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await api.registrarMovimentacao({
        itemId: Number(form.itemId),
        tipo: form.tipo,
        quantidade: Number(form.quantidade),
        observacao: form.observacao,
      })
      setSucesso(`${form.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'} registrada.`)
      setForm({ ...vazio, tipo: form.tipo })
      carregarItens()
      carregarMovs()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <section>
      <form className="card form-linha" onSubmit={registrar}>
        <h2>Registrar movimentação</h2>
        <div className="tipo">
          <button
            type="button"
            className={form.tipo === 'ENTRADA' ? 'entrada ativa' : 'entrada'}
            onClick={() => setForm({ ...form, tipo: 'ENTRADA' })}
          >
            Entrada
          </button>
          <button
            type="button"
            className={form.tipo === 'SAIDA' ? 'saida ativa' : 'saida'}
            onClick={() => setForm({ ...form, tipo: 'SAIDA' })}
          >
            Saída
          </button>
        </div>
        <label>
          Item
          <select
            value={form.itemId}
            onChange={(e) => setForm({ ...form, itemId: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {itens.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nome} ({i.quantidade} {i.unidade})
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantidade{itemSelecionado ? ` (${itemSelecionado.unidade})` : ''}
          <input
            type="number"
            min="1"
            max={form.tipo === 'SAIDA' && itemSelecionado ? itemSelecionado.quantidade : undefined}
            value={form.quantidade}
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            required
          />
        </label>
        <label className="largo">
          Observação
          <input
            value={form.observacao}
            onChange={(e) => setForm({ ...form, observacao: e.target.value })}
            placeholder="Ex.: NF 1234, lote, setor, paciente/sessão..."
          />
        </label>
        <div className="acoes">
          <button type="submit">Registrar</button>
        </div>
      </form>

      {erro && <div className="erro">{erro}</div>}
      {sucesso && <div className="sucesso">{sucesso}</div>}

      <div className="card">
        <div className="cabecalho-tabela">
          <h2>Histórico</h2>
          <select value={filtroItem} onChange={(e) => setFiltroItem(e.target.value)}>
            <option value="">Todos os itens</option>
            {itens.map((i) => (
              <option key={i.id} value={i.id}>{i.nome}</option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Item</th>
              <th className="num">Quantidade</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {movs.map((m) => (
              <tr key={m.id}>
                <td>{formatarData(m.dataHora)}</td>
                <td>
                  <span className={`etiqueta ${m.tipo === 'ENTRADA' ? 'entrada' : 'saida'}`}>
                    {m.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td>{m.item.nome}</td>
                <td className="num">
                  {m.tipo === 'ENTRADA' ? '+' : '−'}
                  {m.quantidade} {m.item.unidade}
                </td>
                <td>{m.observacao}</td>
              </tr>
            ))}
            {movs.length === 0 && (
              <tr>
                <td colSpan="5" className="vazio">Nenhuma movimentação registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
