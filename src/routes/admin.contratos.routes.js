const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    obtenerContratosAdminArrendador,
    obtenerContratosAdminArrendatario
} = require('../controllers/admin.contratos.controllers')


router.get('/obtenercontratos/:desde/:idusuario', mdwVerificarToken.verificaToken, obtenerContratosAdminArrendador);
router.get('/arrendatario/obtenercontratos/:desde/:idusuario', mdwVerificarToken.verificaToken, obtenerContratosAdminArrendatario);

module.exports = router;