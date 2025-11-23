const express = require('express');
const controller = require('../controllers/tarefasController');

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscar, controller.exibir);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;
