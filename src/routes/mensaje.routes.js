const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    obtenerMensajes, 
    obtenerMensaje,
    crearMensajes, 
    leerMensajes,
    eliminarMensajes} = require('../controllers/mensaje.controllers')

//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER
router.get('/obtenermensajes/:desde', mdwVerificarToken.verificaToken, obtenerMensajes);
router.get('/obtenermensaje/:id', mdwVerificarToken.verificaToken, obtenerMensaje);
router.post('/crearmensaje', crearMensajes);
router.put('/leermensaje/:id', mdwVerificarToken.verificaToken, leerMensajes);
router.put('/eliminarmensaje/:id', mdwVerificarToken.verificaToken, eliminarMensajes);

module.exports = router;