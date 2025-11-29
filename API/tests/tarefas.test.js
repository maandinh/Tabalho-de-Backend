const supertest = require('supertest');
const app = require('../app.js');
const mongoose = require('mongoose');

const { gerarToken } = require('../src/middlewares/authMiddleware.js')

const request = supertest(app);

urlTarefas = '/tarefas'

const fakeUser = { id: new mongoose.Types.ObjectId(), email: "teste@teste.com", senha: "123456" };
const token = 'Bearer ' + gerarToken({ id: fakeUser.id, email: fakeUser.email, nome: "Maria", perfil: "admin" });
tarefaId = null;

describe('Testes do endpoint /tarefas', () => {
  test("POST / deve retornar 201", async () => {
    const res = await request.post(urlTarefas).set("Authorization", token)
      .send({
        titulo: "Nova Tarefa",
        descricao: "Descrição da nova tarefa",
        dataCriacao: new Date(),
        owner: fakeUser.id
      });

    tarefaId = res.body.id;
    expect(res.status).toBe(201);

  });

  test("POST / deve retornar 422 se título vazio", async () => {
    const res = await request.post(urlTarefas)
      .set("Authorization", token)
      .send({
        titulo: "   ",
        descricao: "Descrição",
        dataCriacao: new Date(),
        owner: fakeUser.id
      });
    expect(res.status).toBe(422);
    expect(res.body.msg).toBe("Título da tarefa é obrigatório.");

  });

  test("POST / deve retornar 422 - título curto", async () => {
    const res = await request.post(urlTarefas)
      .set("Authorization", token)
      .send({
        titulo: "a",
        descricao: "Descrição",
        dataCriacao: new Date(),
        owner: fakeUser.id
      });
    expect(res.status).toBe(422);
  });

  test("GET / deve retornar 200", async () => {
    const res = await request.get(urlTarefas).set("Authorization", token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /:id deve retornar 200", async () => {
    const res = await request.get(`/tarefas/${tarefaId}`).set("Authorization", token);
    expect(res.status).toBe(200);
  });

  test("GET /:id deve retornar 400", async () => {
    const res = await request.get("/tarefas/0000000").set("Authorization", token);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("ID inválido.");
  });

  test("GET /:id deve retornar 404", async () => {
    const res = await request.get("/tarefas/000000000000000000000000").set("Authorization", token);
    expect(res.status).toBe(404);
  });

  test("PUT /:id deve retornar 200", async () => {
    const res = await request.put(`/tarefas/${tarefaId}`)
      .set("Authorization", token)
      .send({ titulo: "Tarefa Atualizada", concluida: true });
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("Tarefa Atualizada");
    expect(res.body.concluida).toBe(true);
  });

  test("PUT /:id deve retornar 422 - título vazio", async () => {
    const res = await request.put(`/tarefas/${tarefaId}`)
      .set("Authorization", token)
      .send({ titulo: "   " });
    expect(res.status).toBe(422);
  });

  test("PUT /:id deve retornar 422 - título curto", async () => {
    const res = await request.put(`/tarefas/${tarefaId}`)
      .set("Authorization", token)
      .send({ titulo: "a" });
    expect(res.status).toBe(422);
  });

  test("PUT /:id deve retornar 400", async () => {
    const res = await request.put("/tarefas/0")
      .set("Authorization", token)
      .send({ titulo: "Tarefa" });
    expect(res.status).toBe(400);
  });

  test("PUT /:id deve retornar 404", async () => {
    const res = await request.put("/tarefas/000000000000000000000000")
      .set("Authorization", token)
      .send({ titulo: "Tarefa" });
    expect(res.status).toBe(404);
  });

  test("DELETE /:id deve retornar 204", async () => {
    const res = await request.delete(`/tarefas/${tarefaId}`)
      .set("Authorization", token);
    expect(res.status).toBe(204);
  });

  test("DELETE /:id deve retornar 400", async () => {
    const res = await request.delete("/tarefas/0")
      .set("Authorization", token);
    expect(res.status).toBe(400);
  });

  test("DELETE /:id deve retornar 404", async () => {
    const res = await request.delete("/tarefas/000000000000000000000000")
      .set("Authorization", token);
    expect(res.status).toBe(404);
  });

});