const express = require('express');
const mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    obtenerInmuebles, 
    obtenerInmueble,
    obtenerInmueblePublico,
    crearInmueble, 
    actualizarInmueble, 
    eliminarInmueble,
    desactivarinmueble,
    inmueblesPublicadosPorArrendador,
    inmueblesPublicos,
    inmueblesPublicosMovil,
    obtenerinmueblesarrendador,
    eliminarInmuebleDesdeElAdministrador,
    buscaInmueblePublicoMovil,
    actualizarFotosInmueble
} = require('../controllers/inmueble.controllers');
const { cacheInit } = require('../../utils/cache');

//RUTA DEL ADMIN
router.get('/obtenerinmuebles/:desde', obtenerInmuebles);

//CRUD ARRENDADOR
router.get('/obtenerinmueble/:id', cacheInit, mdwVerificarToken.verificaToken, obtenerInmueble);
router.get('/obtenerinmueble/publico/:id', cacheInit, obtenerInmueblePublico);
router.post('/crearinmueble', mdwVerificarToken.verificaToken, crearInmueble);
router.put('/actualizarinmueble/:id', mdwVerificarToken.verificaToken, actualizarInmueble);
router.put('/eliminarinmueble/:id', mdwVerificarToken.verificaToken, eliminarInmueble);

//ACCIONES PARA PULICAR Y DESACTIVAR UN INMUEBLE
router.put('/desactivarinmueble/:id', mdwVerificarToken.verificaToken, desactivarinmueble);
router.get('/publicados/arrendador/:desde', cacheInit, mdwVerificarToken.verificaToken, inmueblesPublicadosPorArrendador);

//RUTA PÚBLICA
router.get('/inmueblespublicos/:desde', cacheInit, inmueblesPublicos);
router.get('/inmuebles/publicos/movil', cacheInit, inmueblesPublicosMovil);

  //BUSCAR INMUEBLES PARA LA PRINCIPAL DE LA MOVIL
router.get('/buscar/:busqueda', cacheInit, buscaInmueblePublicoMovil);

//RUTA DEL ARRENDADOR
router.get('/obtenerinmuebles/arrendador/:desde', cacheInit, mdwVerificarToken.verificaToken, obtenerinmueblesarrendador);

//ELIMINAR INMUEBLE DESDE EL ADMINISITRADOR
router.put('/eliminar-inmueble/admin/:id', mdwVerificarToken.verificaToken, eliminarInmuebleDesdeElAdministrador);
module.exports = router;