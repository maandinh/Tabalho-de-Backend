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
# instala biblioteca para manipular YAML
npm install yaml
```
3. Executar scripts definidos no package.json
```shell
npm run dev    # roda o nodemon
npm run test   # executa o jest
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

- **POST /auth/cadastro**  
  Cadastra um novo usuário.  
  **Body esperado:** `{ "email": "seu_email", "senha": "sua_senha" }`

- **POST /auth/login**   
  Realiza login de um usuário existente e retorna um token JWT.  
  **Body esperado:** `{ "email": "seu_email", "senha": "sua_senha" }`

- **POST /auth/renovar**   
  Gera um novo token JWT para um usuário já autenticado, evitando que ele precise fazer login novamente.  
  **Body esperado:** `{ "token": "token_atual" }`

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
curl -X POST http://localhost:3000/auth/cadastro \
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
###   1.1 Body exemplo (copiar e colar):
```bash
{
  "email": "usuario@exemplo.com",
  "senha": "123456"
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
### 3. Renovar token JWT
```bash
curl -X POST http://localhost:3000/auth/renovar \
-H "Authorization: Bearer <TOKEN_ATUAL>"
```
RESPOSTA ESPERADA
```json
{
  "token": "novo_token_jwt_gerado"
}
```
### 4. Criar uma tarefa
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
### 5. Listar todas as tarefas
```bash
curl -X GET http://localhost:3000/tarefas \
-H "Authorization: Bearer <TOKEN>"
```
### 6. Buscar detalhes de uma tarefa por ID
```bash
curl -X GET http://localhost:3000/tarefas/ID_DA_TAREFA \
-H "Authorization: Bearer <TOKEN>"
```
### 7. Atualizar uma tarefa
```bash
curl -X PUT http://localhost:3000/tarefas/ID_DA_TAREFA \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{"titulo":"Título atualizado","descricao":"Nova descrição"}'
```
### 8. Remover uma tarefa
```bash
curl -X DELETE http://localhost:3000/tarefas/ID_DA_TAREFA \
-H "Authorization: Bearer <TOKEN>"
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
- O endpoint DELETE retorna HTTP *204 (No Content)*, seguindo a especificação REST e não enviando corpo na resposta.
- Validações personalizadas podem gerar *erros 422*

---

## Integrantes do Grupo e Divisão de Tarefas

- **Julia de Souza** – Responsável pela criação da estrutura inicial do projeto, organização do repositório e documentação base. Configurou o ambiente do servidor, definiu padrões de rotas e ajudou a estruturar a arquitetura da API. Atuou também na configuração inicial do banco de dados, garantindo conexão estável e modelos básicos em conjunto com Mariana. 
- **Mariana Kanashiro** – Trabalhou diretamente na modelagem do banco de dados, criação dos schemas, regras de validação e integração com o Mongoose. Auxiliou Julia no setup inicial e colaborou com Felipe na implementação das rotas de autenticação e do CRUD de tarefas. Foi responsável por garantir que as operações no banco estivessem funcionando corretamente. 
- **Felipe Gripp** – Desenvolveu a parte central da lógica de autenticação, incluindo registro, login, geração e validação de tokens JWT. Trabalhou junto com Mariana na implementação completa das rotas de tarefas (CRUD), aplicando middlewares de autenticação, validação e boas práticas de estruturação das controladoras.  
- **Amanda Soares** – Responsável pelos testes unitários e de integração, garantindo a qualidade e o funcionamento correto das rotas de autenticação, tarefas e middleware de autorização. Configurou o ambiente de testes, criou cenários de sucesso e erro e validou todo o fluxo da API. Também aprimorou a documentação do projeto, estruturando e expandindo o README para torná-lo mais completo e claro.
