const mongoose = require("mongoose");
const Tarefa = require("../models/tarefasModel");

async function criar(req, res) {
    try {
        const novaTarefa = await Tarefa.create({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            concluida: false,
            dataCriacao: req.body.dataCriacao,
            owner: req.user?.id || req.body.owner 
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
        
        if (err.name === "ValidationError") {

            const mensagens = Object.values(err.errors).map(e => e.menssge);
              return res.status(422).json({ msg: mensagens[0] });
        }

        return res.status(500).json({
            msg: "Erro interno do servidor."
        });
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

    if (!tarefaEncontrada) {
        return res.status(404).json({ msg: "Tarefa não encontrada." });
    }

    req.tarefa = {
        id: tarefaEncontrada._id,
        titulo: tarefaEncontrada.titulo,
        descricao: tarefaEncontrada.descricao,
        concluida: tarefaEncontrada.concluida,
        dataCriacao: tarefaEncontrada.dataCriacao,
        owner: tarefaEncontrada.owner
    };

    next();
}

function exibir(req, res) {
    return res.json(req.tarefa);
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tarefaAtualizada) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    return res.status(200).json({
      id: tarefaAtualizada._id,
      titulo: tarefaAtualizada.titulo,
      descricao: tarefaAtualizada.descricao,
      concluida: tarefaAtualizada.concluida,
      dataCriacao: tarefaAtualizada.dataCriacao,
      dataAtualizacao: new Date(),
      owner: tarefaAtualizada.owner
    });

  } catch (err) {
    if (err.errors) {
      return res.status(422).json({
        msg: err.errors["titulo"]?.message || "Erro de validação"
      });
    }

    return res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
}

async function remover(req, res) {
  try {
    const { id } = req.params;

     if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const tarefaRemovida = await Tarefa.findOneAndDelete({ _id: id });
    if (!tarefaRemovida) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    return res.status(204).end();
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao remover tarefa" });
  }
}


module.exports = { criar, listar, buscar, exibir, atualizar, remover };