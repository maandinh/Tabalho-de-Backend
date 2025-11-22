const express = require('express');
// const { gerarToken, verificarToken, criptografarSenh, compararSenha } = require('../middleware/auth');
const controller = require('../controllers/userController');

const router = express.Router();

router.post('/registrar', controller.registrar);

router.post('/login', controller.login);

router.post('/renovar', controller.renovar);

/* router.post('/register', async (req, res) => {
    const { email, senha } = req.body;
    const novoUser = await User.create({ 
        email, 
        senha: criptografarSenh(senha) 
    });
    res.status(201).json({
        id: novoUser._id,
        email: novoUser.email
    });
});

router.post('/login', async function (req, res, next) {
    const { email, senha } = req.body;
    const userEncontrado = await User.findOne({
        email
    });

    if (userEncontrado && compararSenha(senha, userEncontrado.senha)) {
        const payload = {
            iss: 'Minha API',
            username: email,
            nome: 'Maria',
            perfil: 'admin' 
        };

        try {
            return res.json({ token: gerarToken(payload) });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    return res.status(401).json({ msg: 'Credenciais inválidas' });
});

router.post('/renovar', verificarToken, function(req, res) {
    try {
        const payload = {
            iss: req.payload.iss,
            username: req.payload.username,
            nome: req.payload.nome,
            perfil: req.payload.perfil
        };

        return req.json({ token: gerarToken(payload) });
    } catch (err) {
        return req.status(500).json({ msg: err.message });
    }
}); */

module.exports = router;