const express = require('express');
const router = express();
var mdwVerificarToken = require('../middlewares/autenticacion');

const { buscarPorColeccion, busquedaGeneral, busquedaAnidada} = require('../controllers/busqueda');


router.get('/coleccion/:tabla/:busqueda', mdwVerificarToken.verificaToken, buscarPorColeccion);
router.get('/todo/:busqueda', mdwVerificarToken.verificaToken, busquedaGeneral);
router.get('/coleccion/:tabla/:tipo/:ubicacion/:precio', busquedaAnidada);

module.exports = router;