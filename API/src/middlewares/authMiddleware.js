const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

function compararSenha(password, hash) {
  return bcryptjs.compareSync(password, hash);
}

function cifrarSenha(password) {
  const salto = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salto);
}

function gerarToken(payload) {
  try {
    const expiresIn = 60;
    const token = jwt.sign(payload, process.env.JWT_SEGREDO, { expiresIn });
    return token;
  } catch (err) {
    throw Error("Erro ao gerar um token");
  }
}

function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "Token não fornecido ou formato inválido" });
    }

    const token = authHeader.replace('Bearer', '').trim();


    const payload = jwt.verify(token, process.env.JWT_SEGREDO);

    req.payload = payload;
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

module.exports = { gerarToken, verificarToken, cifrarSenha, compararSenha };
