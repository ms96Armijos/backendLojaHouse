const express = require('express');
const {schemaLogin} = require('../schemas/usuario.schemas');
const validarSchemaUsuario = require('../middlewares/validarSchemas');

const router = express();

const {login} = require('../controllers/login.controllers')


router.post('/', validarSchemaUsuario(schemaLogin), login);

module.exports = router;