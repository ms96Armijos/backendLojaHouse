const express = require('express');
const router = express();
var mdwVerificarToken = require('../middlewares/autenticacion');

const { buscarPorColeccion } = require('../controllers/admin.busquedas.controllers');


router.get('/coleccion/:tabla/:busqueda/:idusuario/:desde', mdwVerificarToken.verificaToken, buscarPorColeccion);

module.exports = router;