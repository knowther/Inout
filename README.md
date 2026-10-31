# Controle de Estoque — Clínica de Diálise

Sistema simples de estoque: cadastro de itens, entradas, saídas e quantidade atual.

- **Backend:** Spring Boot 3 (Java 17+) + SQLite (`backend/`)
- **Frontend:** React + Vite (`frontend/`)

## Como rodar

### Backend
```bash
cd backend
mvn spring-boot:run
```
API em `http://localhost:8080`. O banco `estoque.db` é criado automaticamente na pasta `backend/`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Abra `http://localhost:5173` (as chamadas `/api` são encaminhadas ao backend).

## Regras
- A quantidade do item só muda por movimentação (entrada soma, saída subtrai).
- Saída maior que o saldo é recusada.
- Item com movimentações não pode ser excluído (preserva o histórico).
- Nome do item é único.

## API
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/itens` | Lista itens com quantidade |
| POST | `/api/itens` | Cria item `{ nome, unidade }` |
| PUT | `/api/itens/{id}` | Edita nome/unidade |
| DELETE | `/api/itens/{id}` | Exclui item sem movimentações |
| GET | `/api/movimentacoes?itemId=` | Histórico (filtro opcional) |
| POST | `/api/movimentacoes` | `{ itemId, tipo: ENTRADA\|SAIDA, quantidade, observacao }` |
