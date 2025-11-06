const mongoose = require("mongoose");
const Tarefa = require("../models/tarefasModel");

async function criar(req, res) {
    try {
        const novaTarefa = await Tarefa.create({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            concluida: false,
            dataCriacao: req.body.dataCriacao,
            owner: req.user.id
        });

        return res.status(201).json({
            id: novaTarefa._id,
            titulo: novaTarefa.titulo,
            descricao: novaTarefa.descricao,
            concluida: novaTarefa.concluida,
            dataCriacao: novaTarefa.dataCriacao,
            owner: novaTarefa.owner
        });
    } catch (err) {
        if (err.errors) {
            return res.status(422).json({
                msg: err.errors["titulo"].message
            });
        }
        return res.status(500).json({ msg: "Erro interno do servidor. Tente novamente mais tarde." });
    }
}

async function listar(req, res) {
    const tarefas = await Tarefa.find({});
    return res.json(tarefas);
}

async function buscar(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID inválido." });
    }

    const tarefaEncontrada = await Tarefa.findOne({ _id: id });
    if (tarefaEncontrada) {
        req.tarefa = {
            id: tarefaEncontrada._id,
            titulo: tarefaEncontrada.titulo,
            descricao: tarefaEncontrada.descricao,
            concluida: tarefaEncontrada.concluida,
            dataCriacao: tarefaEncontrada.dataCriacao,
            owner: tarefaEncontrada.owner
        };
        return next();
    }
    return res.status(400).json({ msg: "Tarefa não encontrada." });
}

function exibir(req, res) {
    return res.json(req.tarefa);
}

async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const tarefaAtualizada = await Tarefa.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true, runValidators: true }
        );

        return res.json({
            id: tarefaAtualizada._id,
            titulo: tarefaAtualizada.titulo,
            descricao: tarefaEncontrada.descricao,
            concluida: tarefaAtualizada.concluida,
            dataCriacao: tarefaAtualizada.dataCriacao,
            dataAtualizacao: new Date,
            owner: tarefaAtualizada.owner
        });
    } catch (err) {
        if (err.errors) {
            return res.status(422).json({
                msg: err.errors["titulo"].message
            });
        }
    }
}

async function remover(req, res) {
    const { id } = req.params;
    const tarefaRemovida = await Tarefa.findOneAndDelete({ _id: id });
    return res.status(204).end();
}

module.exports = { criar, listar, buscar, exibir, atualizar, remover };