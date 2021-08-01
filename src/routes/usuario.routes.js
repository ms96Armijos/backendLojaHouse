const express = require('express');
var mdwVerificarToken = require('../middlewares/autenticacion');
const { cacheInit } = require('../../utils/cache');
const router = express();


const { 
    obtenerUsuarios,
    obtenerUsuarioEspecifico, 
    crearUsuario, 
    actualizarUsuario,
    actualizarFirebaseTokenUsuario,
    cambiarPassword,
    desactivarUsuario,
    reseteoDePassword,
    buscarUsuario,
    obtenerUsuariosArrendadores,
    verificarUsuarioRepetido,
    verificarPerfilUsuario,
    obtenerUsuariosArrendadoresDasAdmin,
} = require('../controllers/usuario.controllers');


//OPERACIONES CRUD
router.post('/crearusuario', crearUsuario);
router.get('/obtenerusuarios/:desde',  mdwVerificarToken.verificaToken, obtenerUsuarios);
//OBTENER USUARIOS DEPENDIENDO EL ROL
router.get('/obtenerusuarios/roles/:rol/:desde', mdwVerificarToken.verificaToken, obtenerUsuariosArrendadores);

//OBTENER CANTIDAD DE ARRENDADORES AL DASHADMIN
router.get('/obtenerusuarios/roles-contador/:rol/dashadmin', mdwVerificarToken.verificaToken, obtenerUsuariosArrendadoresDasAdmin);

router.get('/obtenerusuario/:id',  mdwVerificarToken.verificaToken, obtenerUsuarioEspecifico);
router.put('/actualizarusuario/:id', mdwVerificarToken.verificaToken, actualizarUsuario);
router.get('/buscarusuario/buscar/:correo', mdwVerificarToken.verificaToken, buscarUsuario);

//ACTUALIZAR TOKEN DEL USUARIO OBTENIDO DE FCM
router.put('/actualizartoken/usuario/:id', mdwVerificarToken.verificaToken, actualizarFirebaseTokenUsuario);

//RUTA DE RESETEO DE PASSWORD
router.put('/reseteopassword', reseteoDePassword);
//RUTA DE CAMBIAR PASSWORD
router.put('/cambiarpassword/:id', mdwVerificarToken.verificaToken, cambiarPassword);
//RUTA DE DESACTIVAR UN USUARIO (BORRADO LÓGICO)
router.put('/desactivarusuario/:id', mdwVerificarToken.verificaToken, desactivarUsuario);
//RUTA PARA VERIFICAR SI EL EMAIL DEL USUARIO ESTA REPETIDO
router.get('/verificar-correo/:correo', verificarUsuarioRepetido);
router.get('/validar/usuario/:correo', verificarPerfilUsuario);



module.exports = router;