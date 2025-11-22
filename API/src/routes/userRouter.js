const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.post('/registrar', controller.registrar);

router.post('/login', controller.login);

router.post('/renovar', controller.renovar);


module.exports = router;