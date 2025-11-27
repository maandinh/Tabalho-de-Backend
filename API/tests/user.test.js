const supertest = require('supertest');
const app = require('../app.js');
require("dotenv").config({ path: ".env.test" });
const User = require('../src/models/userModel');
const { gerarToken } = require('../src/middlewares/authMiddleware.js');
const request = supertest(app);

urlRegistrar = '/auth/registrar'
urlLogin = '/auth/login'

describe("Testes da Rota Usuários", () => {
    
    
    let usuarioCriado = null;
    let token = null;
    
    test("POST /registrar deve retornar 201", async () => {
        await User.deleteMany({});
        const res = await request.post(urlRegistrar)
            .send({
                email: "teste@teste.com",
                senha: "123456"
            });
 

        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();

          usuarioId = res.body._id;
        usuarioCriado = res.body;
    });

test("POST /registrar deve retornar 400", async () => {
         const res = await request.post(urlRegistrar)
            .send({
                email: "",
                senha: ""
            });

       expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email e senha são obrigatórios.");
    });

    test("POST /registrar não deve aceitar email duplicado", async () => {
         const res = await request.post(urlRegistrar)
            .send({
                email: "teste@teste.com",
                senha: "123"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Este e-mail já está cadastrado.");
    });


    test("POST /login deve retornar Token", async () => {
        
        const res = await request.post(urlLogin)
            .send({
                email: usuarioCriado.email,
                senha: "123456"
            });
        token = res.body.token;
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");

    });

   test("POST /login deve retornar 401 se senha errada", async () => {
       const res = await request.post(urlLogin)
            .send({
                email: "login@teste.com",
                senha: "errada"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("Credenciais inválidas.");
    });

    test("POST /login deve retornar 401 se logar com usuário inexistente", async () => {
         const res = await request.post(urlLogin)
            .send({
                email: "naoexiste@teste.com",
                senha: "123"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("Credenciais inválidas.");
    });


    test("POST /renovar deve retornar 200", async () => {
        const res = await request.post("/auth/renovar")
            .set("Authorization", token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        
    });
   
});
 