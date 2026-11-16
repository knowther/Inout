# Controle de Estoque — Clínica de Diálise

Sistema simples de estoque: cadastro de itens, entradas, saídas e quantidade atual.

- **Backend:** Spring Boot 3 (Java 17+) + SQLite (`backend/`)
- **Frontend:** React + Vite (`frontend/`)

## Rodar com Docker (recomendado)

Precisa apenas do Docker instalado.

```bash
docker compose up -d --build
```

Abra `http://localhost:8080`. O frontend (nginx) serve a tela e repassa `/api` para o backend.
Os dados do SQLite ficam no volume `estoque-dados` e não se perdem ao reiniciar ou atualizar os containers.

- Parar: `docker compose down`
- Ver logs: `docker compose logs -f`
- Trocar a porta: altere `"8080:80"` no `docker-compose.yml` (ex.: `"80:80"`)
- Backup do banco: `docker compose cp backend:/data/estoque.db ./backup-estoque.db`

> Cuidado: `docker compose down -v` apaga o volume e todos os dados.

## Rodar sem Docker (desenvolvimento)

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
