const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const router = express();
let fileUpload = require("express-fileupload");
router.use(fileUpload());

const { 
    obtenerImagen, 
    actualizarImagen
    } = require('../controllers/imagenes.controllers');

//RUTAS QUE SOLO EL ADMINISTRADOR PUEDE ACCEDER
router.get('/:tipo/:img', obtenerImagen);
router.put('/:tipo/:id', actualizarImagen);

module.exports = router;