# Roteirizador de Entregas

Este projeto é uma solução de microsserviços para gestão e roteirização de entregas, composta por uma API de gerenciamento (Rails), uma API de roteirização (Node.js/Express) e um Frontend (Vite/React).

## 🚀 Como Rodar o Projeto

A forma mais simples de subir todo o ecossistema é utilizando o Docker Compose.

### Pré-requisitos
- Docker e Docker Compose instalados.

### Subindo o Ambiente Completo
```bash
docker-compose up --build
```
*   **Objetivo:** Constrói as imagens de todos os serviços e sobe os containers (Banco de Dados, Management API, Routing API e Frontend).

---

## 🏗️ Estrutura de Microsserviços

### 1. Management API (Gerenciamento)
Responsável pelo cadastro de endereços, veículos e motoristas.
- **Tecnologias:** Ruby on Rails 8, PostgreSQL.
- **Porta:** 3000

#### Comandos Úteis (via Docker):
*   **Rodar Testes (RSpec):**
    ```bash
    docker-compose exec -e RAILS_ENV=test management-api bundle exec rspec
    ```
    *   *Objetivo:* Executa a suíte de testes automatizados garantindo a integridade da API de gerenciamento.
*   **Acessar Console do Rails:**
    ```bash
    docker-compose exec management-api bundle exec rails c
    ```
    *   *Objetivo:* Interagir diretamente com o banco de dados e modelos da aplicação.

---

### 2. Routing API (Roteirização)
Responsável pelo cálculo inteligente de rotas (Health Check implementado).
- **Tecnologias:** Node.js, TypeScript, Express.
- **Porta:** 3001

#### Comandos Úteis (dentro da pasta `/routing-api`):
*   **Instalação Local:** `npm install`
*   **Modo Desenvolvimento:** `npm run dev`
    *   *Objetivo:* Executa o código TypeScript diretamente usando `ts-node` para agilizar o desenvolvimento.
*   **Build de Produção:** `npm run build`
    *   *Objetivo:* Transpila o código TypeScript para JavaScript na pasta `/dist`.
*   **Health Check:** `GET http://localhost:3001/ping`
    *   *Objetivo:* Validar se o serviço está ativo e respondendo.

---

### 3. Frontend
Interface do usuário para visualização e gestão das entregas.
- **Tecnologias:** React + Vite.
- **Porta:** 5173

---

## 🧪 Validando o Funcionamento

Após subir os containers, você pode validar os serviços principais:

1.  **Management API:** Acesse `http://localhost:3000/enderecos` para ver a lista de endereços.
2.  **Routing API:** Acesse `http://localhost:3001/ping` (deve retornar `{"message":"pong"}`).
3.  **Frontend:** Acesse `http://localhost:5173` para visualizar a interface.
 
