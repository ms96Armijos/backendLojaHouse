const express = require('express');
const router = express();
const mdwVerificarToken = require('../middlewares/autenticacion');

const { 
    enviarUnaNotificacion} = require('../controllers/enviar.notificaciones.controllers')

//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER


router.get('/notificacion-usuario/:idInmueble', mdwVerificarToken.verificaToken , enviarUnaNotificacion);
//router.get('/notificacion-usuarios/topic', sendPushToTopic);

module.exports = router;