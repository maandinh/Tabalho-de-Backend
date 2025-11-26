const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

function cifrarSenha(password) {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
}

function compararSenha(password, hash) {
  return bcryptjs.compareSync(password, hash);
}

function gerarToken(payload) {
  try {
    const expiresIn = 60;
    const token = jwt.sign(payload, process.env.JWT_SEGREDO || "segredo", { expiresIn });
    return token;
  } catch (err) {
    throw new Error("Erro ao gerar token");
  }
}

function verificarToken(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error("Token não fornecido");

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SEGREDO || "segredo");
    req.payload = payload;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

module.exports = { cifrarSenha, compararSenha, gerarToken, verificarToken };
