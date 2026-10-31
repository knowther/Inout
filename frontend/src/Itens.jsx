import { useEffect, useState } from 'react'
import { api } from './api.js'

const vazio = { nome: '', unidade: '' }

export default function Itens() {
  const [itens, setItens] = useState([])
  const [form, setForm] = useState(vazio)
  const [editandoId, setEditandoId] = useState(null)
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  const carregar = () => api.listarItens().then(setItens).catch((e) => setErro(e.message))

  useEffect(() => {
    carregar()
  }, [])

  const salvar = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      if (editandoId) await api.atualizarItem(editandoId, form)
      else await api.criarItem(form)
      cancelar()
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  const editar = (item) => {
    setEditandoId(item.id)
    setForm({ nome: item.nome, unidade: item.unidade })
  }

  const cancelar = () => {
    setEditandoId(null)
    setForm(vazio)
  }

  const excluir = async (item) => {
    if (!confirm(`Excluir "${item.nome}"?`)) return
    setErro('')
    try {
      await api.excluirItem(item.id)
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  const filtrados = itens.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <section>
      <form className="card form-linha" onSubmit={salvar}>
        <h2>{editandoId ? 'Editar item' : 'Cadastrar item'}</h2>
        <label>
          Nome
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Ex.: Dialisador, Agulha AVF 15G, Soro 0,9%"
            required
          />
        </label>
        <label>
          Unidade
          <input
            value={form.unidade}
            onChange={(e) => setForm({ ...form, unidade: e.target.value })}
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
        </label>
        <div className="acoes">
          <button type="submit">{editandoId ? 'Salvar' : 'Cadastrar'}</button>
          {editandoId && (
            <button type="button" className="secundario" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {erro && <div className="erro">{erro}</div>}

      <div className="card">
        <div className="cabecalho-tabela">
          <h2>Itens em estoque</h2>
          <input placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Unidade</th>
              <th className="num">Quantidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.unidade}</td>
                <td className={`num ${item.quantidade === 0 ? 'zerado' : ''}`}>{item.quantidade}</td>
                <td className="acoes-linha">
                  <button className="link" onClick={() => editar(item)}>Editar</button>
                  <button className="link perigo" onClick={() => excluir(item)}>Excluir</button>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="4" className="vazio">Nenhum item encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
