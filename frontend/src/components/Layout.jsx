import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ArrowLeftRight, Sun, Moon, Menu, X } from 'lucide-react'

export default function Layout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="layout">
      <div className="mobile-header">
        <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>InOut</span>
        <div style={{ width: 24 }} />
      </div>

      {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Package size={28} strokeWidth={2.5} />
          <div>
            <h1>InOut</h1>
            <span>Clínica de Diálise</span>
          </div>
          <button className="sidebar-close" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end onClick={closeSidebar}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/itens" onClick={closeSidebar}>
            <Package size={20} />
            Itens
          </NavLink>
          <NavLink to="/movimentacoes" onClick={closeSidebar}>
            <ArrowLeftRight size={20} />
            Movimentações
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
