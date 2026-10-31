async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let msg = `Erro ${res.status}`
    try {
      const body = await res.json()
      if (body.erro) msg = body.erro
    } catch {}
    throw new Error(msg)
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  listarItens: () => request('/itens'),
  criarItem: (item) => request('/itens', { method: 'POST', body: JSON.stringify(item) }),
  atualizarItem: (id, item) => request(`/itens/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  excluirItem: (id) => request(`/itens/${id}`, { method: 'DELETE' }),
  listarMovimentacoes: (itemId) =>
    request(`/movimentacoes${itemId ? `?itemId=${itemId}` : ''}`),
  registrarMovimentacao: (mov) =>
    request('/movimentacoes', { method: 'POST', body: JSON.stringify(mov) }),
}
