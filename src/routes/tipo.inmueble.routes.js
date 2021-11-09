const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    obtenerTipoInmuebles, 
    obtenerTipoInmueble,
    crearTipoInmueble, 
    actualizarTipoInmueble, 
    eliminarTipoInmueble} = require('../controllers/tipo.inmueble.controllers')

//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER
router.get('/obtenertipoinmuebles/:desde', mdwVerificarToken.verificaToken, obtenerTipoInmuebles);
router.get('/obtenertipoinmueble/:id', mdwVerificarToken.verificaToken, obtenerTipoInmueble);
router.post('/creartipoinmueble', mdwVerificarToken.verificaToken, crearTipoInmueble);
router.put('/actualizartipoinmueble/:id', mdwVerificarToken.verificaToken, actualizarTipoInmueble);
router.delete('/elimartipoinmueble/:id', mdwVerificarToken.verificaToken, eliminarTipoInmueble);

module.exports = router;