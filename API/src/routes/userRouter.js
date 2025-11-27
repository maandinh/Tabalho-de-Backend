const express = require('express');
const controller = require('../controllers/userController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/registrar', controller.registrar);

router.post('/login', controller.login);

router.post('/renovar', verificarToken, controller.renovar);

module.exports = router;