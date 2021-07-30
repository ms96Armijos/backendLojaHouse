const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const { cacheInit } = require('../../utils/cache');
const router = express();

const { 
    obtenerContratos, 
    obtenerContrato,
    crearContrato, 
    actualizarContrato, 
    eliminarContrato,
    aceptarContrato,
    estadoContrato,
    contratoarrendatario,
    contratoarrendatariomovil,
    obtenerContratosArrendatarioAdministrador,
    cargarContratosPendientesDeAceptar
} = require('../controllers/contrato.controllers');


router.get('/obtenercontratos/:desde', cacheInit, mdwVerificarToken.verificaToken, obtenerContratos);
router.get('/obtenercontratos-contador', cacheInit, mdwVerificarToken.verificaToken, cargarContratosPendientesDeAceptar);



router.get('/obtenercontrato/:id', cacheInit, mdwVerificarToken.verificaToken, obtenerContrato);
router.post('/crearcontrato', mdwVerificarToken.verificaToken,crearContrato);
router.put('/actualizarcontrato/:id', mdwVerificarToken.verificaToken,actualizarContrato);
router.delete('/eliminarcontrato/:id', mdwVerificarToken.verificaToken,eliminarContrato);
router.put('/acuerdo/:id/aceptar', mdwVerificarToken.verificaToken, aceptarContrato);
router.put('/:id/estado', mdwVerificarToken.verificaToken, estadoContrato);

router.get('/arrendatario/obtenercontratos/:desde', cacheInit, mdwVerificarToken.verificaToken, contratoarrendatario);
router.get('/arrendatario/obtenercontratosmovil', mdwVerificarToken.verificaToken, contratoarrendatariomovil);

//ADMINISTRADOR-ARRENDATARIO
router.get('/administrador/arrendatario/contratos/:desde', cacheInit, mdwVerificarToken.verificaToken, obtenerContratosArrendatarioAdministrador);


module.exports = router;