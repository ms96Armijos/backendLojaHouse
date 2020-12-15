
let jwt = require('jsonwebtoken');
let SEMILLA = require('../../config/index').SEMILLATOKEN;

const {mongo: {inmuebleModel, visitaModel}} = require("../../databases");


//VERIFICAR TOKEN DEL USUARIO
exports.verificaToken = async function(req, res, next){
    let token = req.query.token;
//console.log(token)
    if(token){

      jwt.verify(token, SEMILLA, (err, decode) => {
  
        if (err) {
          return res.status(401).json({
            ok: false,
            mensaje: "Tu token ha finalizado, por favor inicia sesión nuevamente",
            errors: err,
          });
        }

        req.usuario = decode.usuario;
        next();
      });

    }else{
      return res.status(400).json({
        ok: false,
        mensaje: 'El token no existe',
        errors: { message: 'No existe el token' }
      });
    } 
}

//VERIFICAR ROL
exports.verificaRol = async function(req, res, next){

  let usuario = req.usuario;

  if(usuario.rol == 'ADMINISTRADOR'){
      next();
      return;
  }else{
  
      return res.status(401).json({
        ok: false,
        mensaje: "Tu token es incorrecto, no puedes acceder",
        errors: {message: 'Acceso no autorizado'}
      });
  
  }
}

//VERIFICAR ROL O MISMO USUARIO
exports.verificaMismoUsuarioRol = async function(req, res, next){

  let usuario = req.usuario;
  let id = req.params.id;


  if(usuario.rol == 'ADMINISTRADOR' || usuario._id === id){
      next();
      return;
  }else{
  
      return res.status(401).json({
        ok: false,
        mensaje: "Tu token es incorrecto, no puedes acceder",
        errors: {message: 'Acceso no autorizado'}
      });
  
  }
}

//VERIFICAR ROL DE QUIEN PUEDE PUBLICAR INMUEBLES
/*exports.verificaMismoUsuarioRol = async function(req, res, next){

  let usuario = req.usuario;
  let id = req.params.id;


  if(usuario.rol == 'ARRENDADOR' || usuario._id === id){
      next();
      return;
  }else{
  
      return res.status(401).json({
        ok: false,
        mensaje: "Tu token es incorrecto, no puedes acceder",
        errors: {message: 'Acceso no autorizado'}
      });
  
  }
}*/


//VERIFICAR ROL O MISMO USUARIO
exports.usuarioActivo = async function(req, res, next){

  let usuario = req.usuario;


  if(usuario.estado == '1'){
      next();
      return;
  }else{
  
      return res.status(401).json({
        ok: false,
        mensaje: "El usuario ha sido inhabilitado",
        errors: {message: 'Acceso no autorizado'}
      });
  
  }
}

//actualizar Solo El Mismo Arrendador
exports.actualizarSoloElMismoArrendador = async function(req, res, next){

  let usuario = req.usuario;
  let id = req.params.id;

  const inmueble = await inmuebleModel.findById(id);

  if(inmueble.usuario != usuario._id){
    return res.status(401).json({
      ok: false,
      mensaje: "Tu token ha finalizado, por favor inicia sesión nuevamente",
      errors: {message: 'Lo siento'},
    });
  }

    if(inmueble){
      console.log('acceso')
      req.inmueble = inmueble;
      next();
    }
  

  /*if(usuario.rol == 'ADMINISTRADOR' || usuario._id === id){
      next();
      return;
  }else{
  
      return res.status(401).json({
        ok: false,
        mensaje: "Tu token es incorrecto, no puedes acceder",
        errors: {message: 'Acceso no autorizado'}
      });
  
  }*/
}

//validar Contrato
exports.validarVisita = async function(req, res, next){

  let usuario = req.usuario;
  let id = req.params.id;

  const visitaObtenida = await visitaModel.findById(id);

  const inmueble = await inmuebleModel.findById(visitaObtenida.inmueble);

  //console.log('visita: '+ inmueble)

  if(inmueble.usuario != usuario._id){
    return res.status(401).json({
      ok: false,
      mensaje: "Tu token ha finalizado, por favor inicia sesión nuevamente",
      errors: {message: 'Lo siento'},
    });
  }

    if(visitaObtenida){
      console.log('acceso')
      req.visita = visitaObtenida;
      next();
    }
}
