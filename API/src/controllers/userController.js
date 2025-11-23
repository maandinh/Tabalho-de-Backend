const User = require('../models/userModel');
const { cifrarSenha, compararSenha, gerarToken } = require('../middlewares/authMiddleware');

async function registrar(req, res) {
  try {
    const senhaCriptografada = cifrarSenha(req.body.senha);

    const novoUser = await User.create({
      email: req.body.email,
      senha: senhaCriptografada
    });

    return res.status(201).json({
      id: novoUser._id,
      email: novoUser.email
    });
  } catch (err) {
    if (err.errors) {
      return res.status(422).json({
        msg: err.errors['email'].message
      });
    }
    return res.status(500).json({ msg: 'Erro interno no servidor. Tente novamente mais tarde.' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const userEncontrado = await User.findOne({ email });

    if (userEncontrado && compararSenha(senha, userEncontrado.senha)) {
      const payload = {
        id: userEncontrado._id,
        email: userEncontrado.email
      };

      return res.json({ token: gerarToken(payload) });
    }

    return res.status(401).json({ msg: 'Credenciais inválidas.' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function renovar(req, res) {
  try {
    const payload = {
      id: req.payload.id,
      email: req.payload.email
    };

    return res.json({ token: gerarToken(payload) });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

module.exports = { registrar, login, renovar };
