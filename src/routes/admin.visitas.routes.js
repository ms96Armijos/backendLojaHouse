const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const { cacheInit } = require('../../utils/cache');
const router = express();

const { 
    obtenerVisitasArrendador,
    obtenerVisitasArrendatario
} = require('../controllers/admin.visitas.controllers');

//SE OBTIENE SOLO LAS VISITAS A LOS INMUEBLES DEL ARRENDADOR
router.get('/arrendador/obtenervisitas/:desde/:idarrendador', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitasArrendador);

router.get('/arrendatario/obtenervisitas/:desde/:idarrendatario', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitasArrendatario);

module.exports = router;