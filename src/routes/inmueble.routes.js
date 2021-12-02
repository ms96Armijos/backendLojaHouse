const express = require('express');
const mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();

const { 
    obtenerInmuebles, 
    obtenerInmueble,
    obtenerInmueblePublico,
    crearInmueble, 
    actualizarInmueble, 
    eliminarInmuebleArrendador,
    desactivarinmueble,
    inmueblesPublicadosPorArrendador,
    inmueblesPublicos,
    inmueblesPublicosMovil,
    obtenerinmueblesarrendador,
    buscaInmueblePublicoMovil,
    actualizarFotosInmueble
} = require('../controllers/inmueble.controllers');


//RUTA DEL ADMIN
router.get('/obtenerinmuebles/:desde', obtenerInmuebles);

//CRUD ARRENDADOR
router.get('/obtenerinmueble/:id', mdwVerificarToken.verificaToken, obtenerInmueble);
router.get('/obtenerinmueble/publico/:id', obtenerInmueblePublico);
router.post('/crearinmueble', mdwVerificarToken.verificaToken, crearInmueble);
router.put('/actualizarinmueble/:id', mdwVerificarToken.verificaToken, actualizarInmueble);
router.delete('/eliminarinmueble/:id', mdwVerificarToken.verificaToken, eliminarInmuebleArrendador);

//ACCIONES PARA PULICAR Y DESACTIVAR UN INMUEBLE
router.put('/desactivarinmueble/:id', mdwVerificarToken.verificaToken, desactivarinmueble);
router.get('/publicados/arrendador/:desde',  mdwVerificarToken.verificaToken, inmueblesPublicadosPorArrendador);

//RUTA PÚBLICA
router.get('/inmueblespublicos/:desde', inmueblesPublicos);
router.get('/inmuebles/publicos/movil', inmueblesPublicosMovil);

  //BUSCAR INMUEBLES PARA LA PRINCIPAL DE LA MOVIL
router.get('/buscar/:busqueda', buscaInmueblePublicoMovil);

//RUTA DEL ARRENDADOR
router.get('/obtenerinmuebles/arrendador/:desde', mdwVerificarToken.verificaToken, obtenerinmueblesarrendador);

module.exports = router;