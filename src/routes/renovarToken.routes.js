const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    renovacionDeToken, 
} = require('../controllers/renovarToken.controllers')

//RUTA: renovar/token
//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER
router.get('/token', mdwVerificarToken.verificaToken, renovacionDeToken);

module.exports = router;