const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();
const { cacheInit } = require('../../utils/cache');


const { 
    obtenerVisitas, 
    crearVisita, 
    actualizarVisita, 
    eliminarVisita,
    aceptarVisita,
    obtenerVisitasSolicitadas,
    obtenerVisitaEspecificaArrendatario,
    obtenerVisitaEspecificaArrendador,
    obtenerVisitasArrendatarioAdministrador,
    obtenerVisitasSolicitadasMovil,
    obtenerSolicitudVisitasPendientes
} = require('../controllers/visita.controllers');

//SE OBTIENE SOLO LAS VISITAS A LOS INMUEBLES DEL ARRENDADOR
router.get('/obtenervisitas/:desde', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitas);
//SE OBTIENE SOLO LAS VISITAS A LOS INMUEBLES DEL ARRENDADOR, este es para el dashboard
router.get('/obtenervisitas-contador', cacheInit, mdwVerificarToken.verificaToken, obtenerSolicitudVisitasPendientes);

//SE OBTIENE SOLO LAS VISITAS A LOS INMUEBLES DEL ARRENDADOR-ADMINISTRADOR
router.get('/administrador/arrendador/visitas/:desde', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitasArrendatarioAdministrador);

//CRUD ARRENDADOR (VISITA)
router.post('/crearvisita', mdwVerificarToken.verificaToken, crearVisita);
router.put('/actualizarvisita/:id', mdwVerificarToken.verificaToken, actualizarVisita);
router.put('/eliminarvisita/:id', mdwVerificarToken.verificaToken, eliminarVisita);

//RUTAS DEL USUARIO ARRENDADOR PARA ACEPTAR LAS VISITAS
router.put('/arrendador/aceptarvisita/:id', aceptarVisita);

//RUTA PARA OBTENER TODAS LAS VISITAS QUE EL USUARIO ARRENDATARIO HA SOLICITADO
router.get('/arrendatario/visitasolicitada/:desde', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitasSolicitadas);
router.get('/arrendatario/visitasolicitadamovil', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitasSolicitadasMovil);
//RUTAS DEL USUARIO ARRENDATARIO PARA LAS VISITAS
router.get('/arrendatario/obtenervisita/:id', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitaEspecificaArrendatario);
router.get('/arrendador/obtenervisita/:id', cacheInit, mdwVerificarToken.verificaToken, obtenerVisitaEspecificaArrendador);

module.exports = router;