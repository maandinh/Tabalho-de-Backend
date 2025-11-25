# Taskly – API de Lista de Tarefas

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)]()

Repositório criado para o desenvolvimento da API **Taskly**, uma aplicação de gerenciamento de tarefas, com cadastro de usuários, autenticação JWT e CRUD completo de tarefas.

---

## Tecnologias Utilizadas

- Node.js  
- JavaScript (ESModules ou CommonJS)  
- Express  
- MongoDB + Mongoose  
- JWT (Json Web Token) para autenticação  
- Jest + Supertest para testes de integração  
- dotenv para variáveis de ambiente  

---

## Organização do Repositório

Este repositório está organizado da seguinte forma:
- **src/**: Contém todo o código-fonte da aplicação.
  - **controllers/**: Lógica das rotas.
  - **routes/**: Definição das rotas.
  - **models/**: Schemas do MongoDB com Mongoose.
  - **middlewares/**: Middlewares como autenticação JWT.
- **tests/**: Testes automatizados com Jest + Supertest.
- **.env**: Variáveis de ambiente para desenvolvimento.
- **app.js**: Inicializa o servidor e conecta ao MongoDB via Mongoose.

---

## Clonar o repositório
```shell
git clone https://github.com/maandinh/Tabalho-de-Backend.git
cd  API
```

---

## Comandos Úteis do NPM

1. Criar projeto Node.js
```bash
npm init -y
```
2. Instalar pacotes
```shell
# instala dependências
npm install
# instala para uso em produção 
npm install express mongoose dotenv jsonwebtoken    
# instala como dependência de desenvolvimento
npm install --save-dev jest supertest nodemon
```
3. Executar scripts definidos no package.json
```shell
npm run nome-do-script
```
4. Iniciar o servidor de desenvolvimento com Nodemon
```shell
npm run dev
```
5. Configurar variáveis de ambiente
```env
MONGODB_USER=seu_usuario
MONGODB_PASS=sua_senha
MONGODB_HOST=host_do_mongo
MONGODB_DBNAME=nome_do_banco
JWT_SECRET=sua_chave_secreta
```

---

## Rotas Principais

### Autenticação

- **POST /auth/register**  
  Cadastra um novo usuário.  
  **Body esperado:** `{ "email": "seu_email", "senha": "sua_senha" }`

- **POST /auth/login**  
  Realiza login de um usuário existente e retorna um token JWT.  
  **Body esperado:** `{ "email": "seu_email", "senha": "sua_senha" }`  

### Tarefas (Requer token JWT no header `Authorization: Bearer <token>`)

- **POST /tarefas**  
  Cria uma nova tarefa para o usuário autenticado.  
  **Body esperado:** `{ "titulo": "Nome da tarefa", "descricao": "Detalhes da tarefa" }`

- **GET /tarefas**  
  Lista todas as tarefas do usuário autenticado.

- **GET /tarefas/:id**  
  Retorna os detalhes de uma tarefa específica pelo seu `id`.

- **PUT /tarefas/:id**  
  Atualiza os dados de uma tarefa existente.  
  **Body esperado:** `{ "titulo": "Novo título", "descricao": "Nova descrição" }`

- **DELETE /tarefas/:id**  
  Deleta a tarefa especificada pelo `id`. Retorna **204 sem corpo**.

---

## Exemplos de Uso

### 1. Registrar usuário
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"usuario@exemplo.com","senha":"123456"}'
```
RESPOSTA ESPERADA
```json
{
  "id": "64f8c2e1f1a1234567890abc",
  "email": "usuario@exemplo.com"
}
```
### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"usuario@exemplo.com","senha":"123456"}'
```
RESPOSTA ESPERADA
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
### 3. Criar uma tarefa
```bash
curl -X POST http://localhost:3000/tarefas \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN_DO_LOGIN>" \
-d '{"titulo":"Estudar JavaScript","descricao":"Estudar ESModules e CommonJS"}'
```
RESPOSTA ESPERADA
```json
{
  "id": "64f8c3e1f1a1234567890def",
  "titulo": "Estudar JavaScript",
  "descricao": "Estudar ESModules e CommonJS",
  "owner": "64f8c2e1f1a1234567890abc"
}
```

---

## Funções dos TESTES

- Cadastro de usuário
- Login
- CRUD de tarefas
- Validações (ex: título curto retorna 422)

---

## Peculiaridades do Projeto

- Cada tarefa está vinculada a um owner (usuário autenticado)
- DELETE retorna *204 sem corpo*
- Validações personalizadas podem gerar *erros 422*
- O banco de testes é isolado do banco de desenvolvimento

---

## Integrantes do Grupo e Divisão de Tarefas

- **Julia** – Setup inicial do projeto e documentação; contribuiu na configuração do banco de dados junto com Mariana.  
- **Mariana** – Configuração do banco de dados junto com Julia; contribuiu na autenticação e no CRUD de tarefas junto com Felipe.  
- **Felipe** – Implementação da autenticação e do CRUD de tarefas junto com Mariana.  
- **Amanda** – Testes unitários e de integração; implementou melhorias e funcionalidades extras.
