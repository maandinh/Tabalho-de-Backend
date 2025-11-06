const mongoose = require("mongoose");
const userModel = require("./userModel");

const tarefasSchema = new mongoose.Schema({
    titulo: {
        type: String, 
        required: [true, 'Título da tarefa é obrigatório.'],
        trim: true,
        minLength: [3, 'Título da tarefa deve ter pelo menos 3 caracteres.']
    },
    descricao: {
        type: String, 
        required: [true, 'Descrição da tarefa é obrigatório.'],
        trim: true,
        minLength: [3, 'Descrição da tarefa deve ter pelo menos 3 caracteres.']
    },
    concluida: {
        type: Boolean,
        required: true
    },
    dataCriacao: {
        type: Date,
        required: true
    },
    dataAtualizacao: {
        type: Date,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Tarefa', tarefasSchema);