const { mongo: { usuarioModel, inmuebleModel } } = require("../../databases");
let bcrypt = require("bcryptjs");
let generarPassword = require("generate-password");
let nodemailer = require("nodemailer");
const { validarcedula } = require("../../utils/validarcedula");
const mailer = require('../middlewares/enviarcorreo');

module.exports = {
  //FUNCIÓN PARA OBTENER TODOS LOS USUARIOS REGISTRADOS
  obtenerUsuarios: (req, res, next) => {
    let desde = req.params.desde;
    desde = Number(desde);

    usuarioModel
      .find({ _id: { $ne: req.usuario } }, "nombre apellido correo imagen movil estado rol")
      .skip(desde)
      .limit(6)
      .exec((err, usuarios) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al obtener todos los usuarios",
            errors: err,
          });
        }

        usuarioModel.countDocuments({ _id: { $ne: req.usuario } }, (err, conteo) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando usuarios",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            usuarios: usuarios,
            total: conteo,
          });
        });
      });
  },

  obtenerUsuarioEspecifico: async (req, res) => {
    let id = req.params.id;

    await usuarioModel
      .findById(id, "nombre apellido correo cedula imagen movil convencional estado rol")
      .exec((err, usuario) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar usuario",
            errors: err,
          });
        }
        if (!usuario) {
          return res.status(400).json({
            ok: false,
            mensaje: "El usuario con el id: " + id + " no existe",
            errors: { message: "No existe el usuario con ese ID" },
          });
        }

        res.status(200).json({
          ok: true,
          usuario: usuario,
        });
      });
  },

  //FUNCIÓN PARA CREAR UN NUEVO USUARIO
  crearUsuario: async (req, res) => {
    const { nombre, apellido, correo, movil, estado, rol } = req.body;
    console.log(req.body.nombre);
    console.log(req.body.rol);

    if (nombre === undefined || nombre.length <= 0 || nombre === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar sus nombres",
      });
    }
    if ( apellido === undefined || apellido === null || apellido.length <= 0 ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar sus apellidos",
      });
    }
    if ( correo === undefined || correo === null || correo.length <= 0 ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar su correo",
      });
    }
    if ( movil === undefined || movil === null || movil.length <= 0 ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar su número de celular",
      });
    }
    if ( rol === undefined || rol === null || rol.length <= 0 ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debes identificarte (arrendador o arrendatario)",
      });
    }

    //PRIMERO VERIFICO SI EL CORREO DEL USUARIO EXISTE
    await usuarioModel.findOne({ correo: correo }, (err, encontrado) => {
      // SI YA EXISTE, DEVUELVO QUE YA EL USUARIO YA SE HA REGISTRADO
      if (encontrado) {
        return res.status(400).json({
          ok: false,
          mensaje: `Ya existe el usuario: ${correo}`,
        });
      }

      //SI NO EXISTE, LO CREO AL USUARIO
      if (!encontrado) {
        let passwordGenerada = generarPassword.generate({
          length: 6,
          numbers: true,
        });

        //DESDE AQÍ EMPIEZA LA GENERACIÓN DE LA CONTRASEÑA Y EL ENVÍO DEL CORREO ELECTRÓNICO
        /* let transporter = nodemailer.createTransport({
           service: "Gmail",
           auth: {
             user: "testplagios@gmail.com",
             pass: "plagios123",
           },
           debug: true, // show debug output
           logger: true, // log information in console
         });
       
         // Definimos el email
         let mailOptions = {
           from: "testplagios@gmail.com",
           to: correo,
           subject: "Generación de contraseña",
           html: `
         <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
           <tr height="200px">
             <td bgcolor="" width="600"px>
               <h1 style="color: #fff; text-align:center">Bienvenido ${nombre +
                 " " +
                 apellido}</h1>
               <p style="color:#fff; text-align:center">
                 <span style:"color: #e84393">Tu contraseña temporal es: ${passwordGenerada}</span>
               </p>
             </td>
           </tr>
       
           <tr bgcolor="#fff">
             <td style="text-align:center">
               <p style="color:#000"><a href="www.google.com">Inicia Sesión en LojaHouse</a></p>
             </td>
           </tr>
       
         </table>
         `,
         };*/

          //SE CREA EL NUEVO OBJETO DE TIPO USUARIO Y SE ASIGNA LOS VALORES O LA DATA OBTENIDA EN LA PETICIÓN
        let usuario = new usuarioModel({
          nombre,
          apellido,
          correo,
          password: bcrypt.hashSync(passwordGenerada, 10),
          movil,
          estado,
          rol,
        });

        console.log("usuario: " + correo);
        console.log("contraseña generada: " + passwordGenerada);
        /**LLAMO AL MIDDLEWARE PARA NO TENER Q ESCRIBIR TODO ESE CODIGO */
       // mailer.enviar_mail(passwordGenerada);

        //GUARDO EL USUARIO EN LA BASE DE DATOS
        usuario.save((err, usuarioGuardado) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al crear usuario",
              errors: err,
            });
          }


          
          //ENVÍO EL CORREO LUEGO DE HABER CREADO EL USUARIO EXITOSAMENTE
          // Enviamos el email
          /* transporter.sendMail(mailOptions, function(error, info) {
             if (error) {
               return console.log(error);
             } else {
               console.log(
                 "Correo Electrónico enviado satisfactoriamente: ",
                 req.body.nombre
               );
               return res.status(200).json(req.body);
             }
           }); */

          return res.status(201).json({
            ok: true,
            mensaje: `Usuario ${nombre + " " + apellido} creado exitosamente`,
            usuario: usuarioGuardado,
          });
        });
      }
    });
  },

  //FUNCIÓN PARA ACTUALIZAR UN USUARIO
  actualizarUsuario: (req, res) => {
    let id = req.params.id;
    const { nombre, apellido, cedula, movil, convencional } = req.body;

    if (nombre.length <= 0 || nombre === undefined || nombre === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar sus nombres",
      });
    }
    if (apellido.length <= 0 || apellido === undefined || apellido === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar sus apellidos",
      });
    }
    if (cedula.length <= 0 || cedula === undefined || cedula === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar su número de cédula",
      });
    }
    if (movil.length <= 0 || movil === undefined || movil === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar su número de celular",
      });
    }

    if(!validarcedula(cedula)){
      return res.status(400).json({
        mensaje: "Ingresa una cédula válida",
        ok: false,
        errors: { message: "Ingresa una cédula válida" },
      });
    }
    

    usuarioModel.findById(id, (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar usuario",
          errors: err,
        });
      }

      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el id: " + id + " no existe",
          errors: { message: "No existe un usuario con ese ID" },
        });
      }

      usuario.nombre = nombre;
      usuario.apellido = apellido;
      usuario.cedula = cedula;
      usuario.movil = movil;
      usuario.convencional = convencional;

       usuario.save((err, usuarioGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar usuario",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          usuario: usuarioGuardado,
        });
      });
    });
  },

    //FUNCIÓN PARA ACTUALIZAR TOKEN DE FIREBASE-FLUTTER
    actualizarFirebaseTokenUsuario: (req, res) => {
      let id = req.params.id;
      const { tokenfirebase } = req.body;

      console.log("TOKENFCM: "+tokenfirebase);

      usuarioModel.findById(id, (err, usuario) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar usuario",
            errors: err,
          });
        }
  
        if (!usuario) {
          return res.status(400).json({
            ok: false,
            mensaje: "El usuario con el id: " + id + " no existe",
            errors: { message: "No existe un usuario con ese ID" },
          });
        }

       /* if(usuario.tokenfirebase){

        }*/
  
        usuario.tokenfirebase = tokenfirebase;
  
         usuario.save((err, usuarioGuardado) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al actualizar usuario",
              errors: err,
            });
          }
  
          res.status(200).json({
            ok: true,
            usuario: usuarioGuardado,
          });
        });
      });
    },

  //FUNCIÓN PARA CAMBIAR CONTRASEÑA
  cambiarPassword: (req, res) => {
    let id = req.params.id;
    const { password } = req.body;

    usuarioModel.findById(id, (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar usuario",
          errors: err,
        });
      }

      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el id: " + id + " no existe",
          errors: { message: "No existe un usuario con ese ID" },
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          ok: false,
          mensaje: "debe contener mínimo 6 caracteres",
          errors: { message: "debe contener mínimo 6 caracteres" },
        });
      } else if (password.search(/\d/) == -1) {
        return res.status(400).json({
          ok: false,
          mensaje: "debe contener mínimo un número",
          errors: { message: "debe contener mínimo un número" },
        });
      } else if (password.search(/[a-z]/) == -1) {
        return res.status(400).json({
          ok: false,
          mensaje: "debe contener mínimo una letra minúscula",
          errors: { message: "debe contener mínimo una letra minúscula" },
        });
      } else if (password.search(/[A-Z]/) == -1) {
        return res.status(400).json({
          ok: false,
          mensaje: "debe contener una letra mayúscula",
          errors: { message: "debe contener una letra mayúscula" },
        });
      }

      usuario.password = bcrypt.hashSync(password, 10);
      //console.log(password)

      usuario.save((err, usuarioPasswordActualizada) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar usuario",
            errors: err,
          });
        }
        usuarioPasswordActualizada.password = "";
        res.status(200).json({
          ok: true,
          usuario: usuarioPasswordActualizada,
        });
      });
    });
  },

  //FUNCIÓN PARA RESETEAR CONTRASEÑA
  reseteoDePassword: async (req, res) => {
    const { correo } = req.body;

    if (correo === "" || correo === undefined || correo === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar su correo"
      });
    }

    /*let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "testplagios@gmail.com",
        pass: "plagios123",
      },
    });

    // Definimos el email
    let mailOptions = {
      from: "testplagios@gmail.com",
      to: correo,
      subject: "Actualización de contraseña",
      html: `
      <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
        <tr height="200px">
          <td bgcolor="" width="600"px>
            <h1 style="color: #fff; text-align:center">Se ha actualizado la contraseña del usuario: ${correo}</h1>
            <p style="color:#fff; text-align:center">
              <span style:"color: #e84393">Tu contraseña temporal es: ${passwordGenerada}</span>
            </p>
          </td>
        </tr>
    
        <tr bgcolor="#fff">
          <td style="text-align:center">
            <p style="color:#000"><a href="www.google.com">Inicia Sesión en LojaHouse</a></p>
          </td>
        </tr>
    
      </table>
      `,
    };*/

    await usuarioModel.findOne({ correo }, async (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar usuario",
          errors: err,
        });
      }

      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el correo: " + correo + " no existe",
          errors: { message: "No existe un usuario con ese correo" },
        });
      }

      if (usuario.estado == '0') {
        return res.status(400).json({
          ok: false,
          mensaje: "Se ha desactivado este usuario, comuníquese con el administrador",
          errors: { message: "Se ha desactivado este usuario, comuníquese con el administrador" },
        });
      }

      let passwordGenerada = generarPassword.generate({
        length: 5,
        numbers: true,
      });

      usuario.correo = correo;
      usuario.password = bcrypt.hashSync(passwordGenerada, 10);

      console.log("usuario: " + correo);
      console.log("Password Recuperada: " + passwordGenerada);

      await usuario.save((err, usuarioGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al resetear contraseña",
            errors: err,
          });
        }
        usuarioGuardado.password = ";)";
        res.status(200).json({
          ok: true,
          usuario: usuarioGuardado,
        });

        // Enviamos el email
        /* transporter.sendMail(mailOptions, function(error) {
          if (error) {
            console.log(error);
            return res.status(200).json(error.message);
          } else {
            console.log(
              "Correo Electrónico enviado satisfactoriamente: ",
              correo
            );
            res.status(200).json(req.body);
          }
        });*/
      });
    });
  },

  //FUNCIÓN PARA DESACTIVAR(BLOQUEAR O ELIMINAR LÓGICAMENTE) CONTRASEÑA
  desactivarUsuario: (req, res) => {
    let id = req.params.id;
    const { estado } = req.body;

    usuarioModel.findById(id, async (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar inmueble",
          errors: err,
        });
      }

      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el id: " + id + " no existe",
          errors: { message: "No existe un usuario con ese ID" },
        });
      }

      usuario.estado = estado;

      await usuario.save((err, usuarioGuardado) => {

        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar usuario",
            errors: err,
          });
        }



        if (usuario.estado === "1") {
          inmuebleModel.updateMany(
            { usuario: { $in: usuario._id } },
            { publicado: "PUBLICO" },
            { multi: true },
            (err, inmuebleNuevo) => {
              console.log("hole");
              return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                mensaje: `Se ha modificado el estado a: ${estado}`
              });
            }
          );
        }
        if (usuario.estado === "0") {
          inmuebleModel.updateMany(
            { usuario: { $in: usuario._id } },
            { publicado: "PRIVADO" },
            { multi: true },
            (err, inmuebleNuevo) => {
              console.log("hole");
              return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                mensaje: `Se ha modificado el estado a: ${estado}`
              });
            }
          );
        }
      });
    });
  },

  buscarUsuario: async (req, res) => {
    let correo = req.params.correo;

    await usuarioModel.findOne({ correo }, "correo nombre apellido cedula rol", (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar usuario",
          errors: err,
        });
      }

      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el correo: " + correo + " no existe",
          errors: { message: "No existe un usuario con ese correo" },
        });
      }

      if (usuario._id == req.usuario._id || usuario.rol == 'ADMINISTRADOR') {
        console.log('HOLAAAA: ' + usuario._id + '==' + req.usuario._id)
        return res.status(400).json({
          ok: false,
          mensaje: "No se puede asignar el contrato al usuario: "+correo,
          errors: { message: "No se puede asignar el contrato al mismo dueño" },
        });
      }

      if (usuario._id == req.usuario._id || usuario.rol == 'ARRENDADOR') {
        console.log('HOLAAAA: ' + usuario._id + '==' + req.usuario._id)
        return res.status(400).json({
          ok: false,
          mensaje: "No se puede asignar el contrato al usuario: "+correo,
          errors: { message: "No se puede asignar el contrato a un arrendador" },
        });
      }


      if (usuario.estado == '0') {
        return res.status(400).json({
          ok: false,
          mensaje: "Se ha desactivado este usuario, comuníquese con el administrador",
          errors: { message: "Se ha desactivado este usuario, comuníquese con el administrador" },
        });
      }

      console.log('GENIAL')
      res.status(200).json({
        ok: true,
        usuario: usuario,
      });

    });
  },

  //ADIMINSTRADOR-ARRENDADOR (OBTENER SOLO LOS ARRENDADORES O SOLO ARRRENDATARIOS)
  obtenerUsuariosArrendadores: (req, res, next) => {
    let rol = req.params.rol;
    let desde = req.params.desde;
    desde = Number(desde);

    usuarioModel
      .find({ rol: { $in: rol } }, "nombre apellido correo imagen movil convencional estado rol")
      .skip(desde)
      .limit(6)
      .exec((err, usuarios) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al obtener todos los usuarios",
            errors: err,
          });
        }

        usuarioModel.countDocuments({ rol: { $in: rol } }, (err, conteo) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando usuarios",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            usuarios: usuarios,
            total: conteo,
          });
        });
      });
  },

    // METODOS NUEVOS PARA FLUTTER
  verificarUsuarioRepetido: (req, res, next) => {

    const correo  = req.params.correo;

    usuarioModel.find({ correo: correo }, (err, usuarioDB) => {

      if (err) {
        return res.status(500).json({
          mensaje: 'Error al buscar usuario'
        });
      }
      if(!usuarioDB){
        return res.json({
          status: false,
          usuario: usuarioDB

        });
      }else{
        return res.json({
          status: true,
          usuario: usuarioDB
        });
      }
    });
  },

  verificarPerfilUsuario: (req, res, next) => {

   
    const correo  = req.params.correo;
    
    usuarioModel.findOne({ correo: correo }, (err, usuarioDB) => {
      
      if (err) {
        return res.status(500).json({
          mensaje: 'Error al buscar usuario'
        });
      }
      if(!usuarioDB){
        return res.json({
          ok: false,
          mensaje: "El usuario "+correo+" no es un arrendatario",
          errors: { message: "El usuario no es un arrendatario" },
        });
      }
      
      if(usuarioDB.rol == 'ADMINISTRADOR'){
        return res.json({
          ok: false,
          mensaje: "El usuario "+correo+" no es un arrendatario",
          errors: { message: "El usuario no es un arrendatario" },
        });
      }
      else{
        return res.json({
          ok: true,
          usuario: usuarioDB.rol
        });
      }
    });
  },
};