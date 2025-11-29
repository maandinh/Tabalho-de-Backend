const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require('dotenv').config()

function compararSenha(password, hash) {
  return bcryptjs.compareSync(password, hash);
}

function cifrarSenha(password) {
  const salto = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salto);
}

function gerarToken(payload) {
  try {
    const expiresIn = 120;
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token
  } catch (err) {
    console.error('Erro ao gerar token:', err);
    throw Error("Erro ao gerar um token");
  }
}

function verificarToken(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "Não autorizado" });
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Token Inválido" });
  }
}


module.exports = { gerarToken, verificarToken, cifrarSenha, compararSenha };
