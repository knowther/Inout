import { useState } from 'react'
import Itens from './Itens.jsx'
import Movimentacoes from './Movimentacoes.jsx'

export default function App() {
  const [aba, setAba] = useState('itens')

  return (
    <div className="container">
      <header>
        <h1>Controle de Estoque</h1>
        <span className="subtitulo">Clínica de Diálise</span>
      </header>

      <nav className="abas">
        <button className={aba === 'itens' ? 'ativa' : ''} onClick={() => setAba('itens')}>
          Itens
        </button>
        <button className={aba === 'mov' ? 'ativa' : ''} onClick={() => setAba('mov')}>
          Entrada / Saída
        </button>
      </nav>

      {aba === 'itens' ? <Itens /> : <Movimentacoes />}
    </div>
  )
}
