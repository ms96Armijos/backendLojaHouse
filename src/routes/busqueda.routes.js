const express = require('express');
const router = express();
var mdwVerificarToken = require('../middlewares/autenticacion');

const { buscarPorColeccion, busquedaGeneral, busquedaAnidada, buscarMensajes} = require('../controllers/busqueda');


router.get('/coleccion/:tabla/:busqueda', mdwVerificarToken.verificaToken, buscarPorColeccion);
router.get('/todo/:busqueda', mdwVerificarToken.verificaToken, busquedaGeneral);
router.get('/coleccion/:tabla/:tipo/:ubicacion/:precio', busquedaAnidada);
router.get('/coleccion/:tabla/:busqueda/:desde', buscarMensajes);

module.exports = router;