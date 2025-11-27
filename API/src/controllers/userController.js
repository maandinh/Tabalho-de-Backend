const User = require('../models/userModel');
const { cifrarSenha, compararSenha, gerarToken } = require('../middlewares/authMiddleware');

async function registrar(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ msg: "Email e senha são obrigatórios." });
        }

        const { cifrarSenha } = require('../middlewares/authMiddleware');

        const novoUser = await User.create({
            email: email.trim().toLowerCase(),
            senha: cifrarSenha(senha)
        });

        return res.status(201).json({
            id: novoUser._id,
            email: novoUser.email
        });
    } catch (err) {

        if (err.code === 11000) {
            return res.status(400).json({
                msg: 'Este e-mail já está cadastrado.'
            });
        }

        if (err.name === 'ValidationError' || err.errors) {
            const primeiroErro = Object.values(err.errors)[0];
            return res.status(422).json({
                msg: primeiroErro?.message || 'Dados inválidos.'
            });
        }
        return res.status(500).json({ msg: 'Erro interno no servidor. Tente novamente mais tarde.' })
  }
}

async function login(req, res, next) {
   
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                msg: "Email e senha são obrigatórios."
            });
        }

        const userEncontrado = await User.findOne({ email: email.trim().toLowerCase() });
       

        if (!userEncontrado) {
            return res.status(401).json({ msg: "Credenciais inválidas." });
        }

        const { compararSenha } = require('../middlewares/authMiddleware');
        const senhaCorreta = compararSenha(senha, userEncontrado.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ msg: "Credenciais inválidas." });
        }

        const { gerarToken } = require('../middlewares/authMiddleware');
        const payload = {
            id: userEncontrado._id,
            email: userEncontrado.email,
            nome: 'Maria',
            perfil: 'admin'
        };

        const token = gerarToken(payload);

        return res.json({ token });
    } catch (err) {
        
        return res.status(500).json({
            msg: "Erro interno no servidor."
        });
    }
}

async function renovar(req, res) {
    try {
         const payload = {
            id: req.usuario.id,
            email: req.usuario.email,
            nome: req.usuario.nome,
            perfil: req.usuario.perfil
        };

        const { gerarToken } = require('../middlewares/authMiddleware');
        return res.json({ token: gerarToken(payload) });
    } catch (err) {
        
        return res.status(500).json({ msg: "Erro ao renovar token." });
    }
}


module.exports = { registrar, login, renovar };
