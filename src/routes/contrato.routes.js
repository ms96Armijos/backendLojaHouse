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


router.get('/obtenercontratos/:desde', mdwVerificarToken.verificaToken, obtenerContratos);
router.get('/obtenercontratos-contador', mdwVerificarToken.verificaToken, cargarContratosPendientesDeAceptar);



router.get('/obtenercontrato/:id', mdwVerificarToken.verificaToken, obtenerContrato);
router.post('/crearcontrato', mdwVerificarToken.verificaToken,crearContrato);
router.put('/actualizarcontrato/:id', mdwVerificarToken.verificaToken,actualizarContrato);
router.delete('/eliminarcontrato/:id', mdwVerificarToken.verificaToken,eliminarContrato);
router.put('/acuerdo/:id/aceptar', mdwVerificarToken.verificaToken, aceptarContrato);
router.put('/:id/estado', mdwVerificarToken.verificaToken, estadoContrato);

router.get('/arrendatario/obtenercontratos/:desde',  mdwVerificarToken.verificaToken, contratoarrendatario);
router.get('/arrendatario/obtenercontratosmovil', mdwVerificarToken.verificaToken, contratoarrendatariomovil);

//ADMINISTRADOR-ARRENDATARIO
router.get('/administrador/arrendatario/contratos/:desde', mdwVerificarToken.verificaToken, obtenerContratosArrendatarioAdministrador);


module.exports = router;