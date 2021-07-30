const express = require('express');
const mdwVerificarToken = require('../middlewares/autenticacion');
const { cacheInit } = require('../../utils/cache');
const router = express();

const { 
    obtenerinmueblesarrendador,
    obtenerInmuebleArrendador,
    actualizarInmuebleArrendador,
    desactivarinmuebleArrendador
} = require('../controllers/admin.inmuebles.controllers');

//RUTA DEL ADMIN
router.get('/arrendador/obtener/inmuebles/:desde/:idarrendador', cacheInit, mdwVerificarToken.verificaToken, obtenerinmueblesarrendador);

//OBTENER UN INMUEBLE ESPECÍFICO
router.get('/arrendador/obtener/inmueble/:idinmueble', cacheInit, mdwVerificarToken.verificaToken, obtenerInmuebleArrendador);

//ACCIONES PARA PULICAR Y DESACTIVAR UN INMUEBLE
router.put('/arrendador/inmueble/actualizar/:idinmueble', mdwVerificarToken.verificaToken, actualizarInmuebleArrendador);


//ACCIONES PARA PULICAR Y DESACTIVAR UN INMUEBLE
router.put('/arrendador/inmueble/desactivarinmueble/:idinmueble', mdwVerificarToken.verificaToken, desactivarinmuebleArrendador);

module.exports = router;