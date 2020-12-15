const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    obtenerServicios, 
    obtenerServicio,
    crearServicios, 
    actualizarServicios, 
    eliminarServicios} = require('../controllers/servicio.controllers')

//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER
router.get('/obtenerservicios/:desde', mdwVerificarToken.verificaToken, obtenerServicios);
router.get('/obtenerservicio/:id', mdwVerificarToken.verificaToken, obtenerServicio);
router.post('/crearservicio', mdwVerificarToken.verificaToken, crearServicios);
router.put('/actualizarservicio/:id', mdwVerificarToken.verificaToken, actualizarServicios);
router.delete('/elimarservicio/:id', mdwVerificarToken.verificaToken, eliminarServicios);

module.exports = router;