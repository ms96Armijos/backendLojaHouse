const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    enviarNotificacion, 
    sendPushToTopic,} = require('../middlewares/enviarNotificaciones')

//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER


router.get('/notificacion-usuario', enviarNotificacion);
//router.get('/notificacion-usuarios/topic', sendPushToTopic);

module.exports = router;