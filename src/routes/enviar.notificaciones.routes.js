const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    enviarUnaNotificacion, 
    enviarNotificacionesAMuchos,} = require('../controllers/enviar.notificaciones.controllers')

//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER
router.get('/notificacion-usuario', enviarUnaNotificacion);
router.get('/notificacion-usuarios/topic', enviarNotificacionesAMuchos);

module.exports = router;