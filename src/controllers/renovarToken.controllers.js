const {
  mongo: { usuarioModel },
} = require("../../databases");
let jwt = require("jsonwebtoken");
let SEMILLA = require('../../config/index').SEMILLATOKEN;

module.exports = {
  renovacionDeToken: async (req, res, next) => {
    //RECUPERANDO EL ID DEL USUARIO
    const id = req.usuario._id;
    
    //BUSCO EL USUARIO EN LA BD
    await usuarioModel.findById( id, (err, usuarioObtenido) => {
      console.log(usuarioObtenido);
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar usuario",
          errors: err,
        });
      }

      if (!usuarioObtenido) {
        return res.status(400).json({
          ok: false,
          mensaje: "Los datos ingresados están incorrectos",
          errors: err,
        });
      }

      if (usuarioObtenido.estado === "0") {
        return res.status(400).json({
          ok: false,
          mensaje:
            "Tu cuenta ha sido bloqueada, comunícate con el administrador para más información",
          errors: err,
        });
      }
      //OBTENER EL USUARIO POR EL ID OBTENIDO
      payload = {
        _id: usuarioObtenido._id,
        nombre: usuarioObtenido.nombre,
        apellido: usuarioObtenido.apellido,
        cedula: usuarioObtenido.cedula,
        movil: usuarioObtenido.movil,
        convencional: usuarioObtenido.convencional,
        correo: usuarioObtenido.correo,
        imagen: usuarioObtenido.imagen,
        estado: usuarioObtenido.estado,
        rol: usuarioObtenido.rol,
      };

      //GENERAR UN NUEVO TOKEN
      const tokenUsuario = jwt.sign({ usuario: payload }, SEMILLA, {
        expiresIn: 10,
      }); //DURACION DE 28800 = 8 HORAS EL TOKEN
      console.log('TOKKKEEEENNNN:   '+tokenUsuario);
      res.json({
        ok: true,
        msg: "Renovando Token",
        token: tokenUsuario,
      });
    });
  },
};
