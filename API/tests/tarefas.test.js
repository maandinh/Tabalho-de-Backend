const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Tarefa = require("../src/models/tarefasModel");
const User = require("../src/models/userModel");

const request = supertest(app);

describe("API completa - Autenticação e Tarefas", () => {
  let user;
  let token;
  let tarefaId;

  beforeAll(async () => {
    const mongoURL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}_test`;
    await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

    user = await User.create({ email: "teste@teste.com", senha: "123456" });
    const payload = { id: user._id, email: user.email };
    token = jwt.sign(payload, process.env.JWT_SECRET || "segredo", { expiresIn: "1h" });
  });

  afterEach(async () => {
    await Tarefa.deleteMany({});
    await User.deleteMany({ email: { $ne: "teste@teste.com" } });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("Tarefas", () => {
    beforeEach(async () => {
      const tarefa = await Tarefa.create({
        titulo: "Tarefa 1",
        descricao: "Descrição da tarefa 1",
        concluida: false,
        dataCriacao: new Date(),
        owner: user._id
      });
      tarefaId = tarefa._id;
    });

    test("POST / deve retornar 201", async () => {
      const res = await request.post("/tarefas").set("Authorization", `Bearer ${token}`).send({
          titulo: "Nova Tarefa",
          descricao: "Descrição da nova tarefa",
          dataCriacao: new Date(),
          owner: user._id
        });
      expect(res.status).toBe(201);
      expect(res.body.titulo).toBe("Nova Tarefa");
    });

    test("POST / deve retornar 422 - título vazio", async () => {
      const res = await request.post("/tarefas")
        .set("Authorization", `Bearer ${token}`)
        .send({ 
          titulo: "   ", 
          descricao: "Descrição", 
          dataCriacao: new Date(), 
          owner: user._id });
      expect(res.status).toBe(422);
    });

    test("POST / deve retornar 422 - título curto", async () => {
      const res = await request.post("/tarefas")
        .set("Authorization", `Bearer ${token}`)
        .send({ 
          titulo: "a", 
          descricao: "Descrição", 
          dataCriacao: new Date(), 
          owner: user._id });
      expect(res.status).toBe(422);
    });

    test("GET / deve retornar 200", async () => {
      const res = await request.get("/tarefas").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("GET /:id deve retornar 200", async () => {
      const res = await request.get(`/tarefas/${tarefaId}`).set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe("Tarefa 1");
    });

    test("GET /:id deve retornar 400", async () => {
      const res = await request.get("/tarefas/0").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(400);
    });

    test("GET /:id deve retornar 404", async () => {
      const res = await request.get("/tarefas/000000000000000000000000").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    test("PUT /:id deve retornar 200", async () => {
      const res = await request.put(`/tarefas/${tarefaId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "Tarefa Atualizada", concluida: true });
      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe("Tarefa Atualizada");
      expect(res.body.concluida).toBe(true);
    });

    test("PUT /:id deve retornar 422 - título vazio", async () => {
      const res = await request.put(`/tarefas/${tarefaId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "   " });
      expect(res.status).toBe(422);
    });

    test("PUT /:id deve retornar 422 - título curto", async () => {
      const res = await request.put(`/tarefas/${tarefaId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "a" });
      expect(res.status).toBe(422);
    });

    test("PUT /:id deve retornar 400", async () => {
      const res = await request.put("/tarefas/0")
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "Tarefa" });
      expect(res.status).toBe(400);
    });

    test("PUT /:id deve retornar 404", async () => {
      const res = await request.put("/tarefas/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "Tarefa" });
      expect(res.status).toBe(404);
    });

    test("DELETE /:id deve retornar 204", async () => {
      const res = await request.delete(`/tarefas/${tarefaId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(204);
    });

    test("DELETE /:id deve retornar 400", async () => {
      const res = await request.delete("/tarefas/0")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(400);
    });

    test("DELETE /:id deve retornar 404", async () => {
      const res = await request.delete("/tarefas/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
