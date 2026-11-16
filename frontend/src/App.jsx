import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './components/Dashboard.jsx'
import Itens from './Itens.jsx'
import Movimentacoes from './Movimentacoes.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/itens" element={<Itens />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
