const mongoose = require('mongoose');
const User = require('../models/userModel');

async function registrar(req, res) {
    try {
        const novoUser = await User.create({
            email: req.body.email,
            senha: req.body.senha
        });

        return res.status(201).json({
            id: novoUser._id,
            email: res.body.email,
            senha: novoUser.body.senha
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

async function login(req, res, next) {
    try {
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
    } catch (err) {
        return res.status(401).json({ msg: 'Credenciais inválidas.' });
    }
}

async function renovar(req, res) {
    try {
        const payload = {
            iss: req.payload.iss,
            username: req.payload.email,
            nome: req.payload.nome,
            perfil: req.payload.perfil
        };

        return req.json({ token: gerarToken(payload) });
    } catch (err) {
        return req.status(500).json({ msg: err.message });
    }
}

module.exports = { registrar, login, renovar };