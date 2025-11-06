const express = require('express');
const controller = require('../controllers/tarefasController');

const router = express.Router();

router.post('/', controller.criar);

router.get('/', controller.listar);

router.get('/:id', controller.buscar, controller.exibir);

router.put('/:id', controller.buscar, controller.atualizar);

router.delete('/:id', controller.buscar, controller.remover);

module.exports = router;