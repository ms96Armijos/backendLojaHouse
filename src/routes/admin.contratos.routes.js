const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const { cacheInit } = require('../../utils/cache');
const router = express();

const { 
    obtenerContratosAdminArrendador,
    obtenerContratosAdminArrendatario
} = require('../controllers/admin.contratos.controllers');


router.get('/obtenercontratos/:desde/:idusuario', cacheInit, mdwVerificarToken.verificaToken, obtenerContratosAdminArrendador);
router.get('/arrendatario/obtenercontratos/:desde/:idusuario', cacheInit, mdwVerificarToken.verificaToken, obtenerContratosAdminArrendatario);

module.exports = router;