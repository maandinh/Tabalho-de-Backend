const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');

const file = fs.readFileSync('./swagger.yaml', 'utf8');

const swaggerDoc = YAML.parse(file);

const router = express.Router();

router.use('/',swaggerUi.serve);

router.get("/", swaggerUi.setup(swaggerDoc));

module.exports = router;