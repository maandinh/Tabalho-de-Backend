const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email: {type: String, required: [true, 'Email é obrigatorio'], unique: true}, senha: {type: String, required: true}, 
    concluida: Boolean
});

module.exports = mongoose.model('Tarefa', schema)