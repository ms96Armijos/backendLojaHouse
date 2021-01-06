const {mongo: {mensajeModel, usuarioModel}} = require('../../databases');

module.exports = {

    obtenerMensajes: (req, res, next) => {

        let desde = req.params.desde;
        desde = Number(desde);
      
        mensajeModel.find({})
          .skip(desde)
          .limit(6)
          .exec((err, mensajes) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error cargando mensajes",
                errors: err,
              });
            }
            
            mensajeModel.countDocuments({}, (err, conteo) => {
             
              if (err) {
                return res.status(500).json({
                  ok: false,
                  mensaje: "Error contando mensajes",
                  errors: err,
                });
              }
              res.status(200).json({
                ok: true,
                mensajes: mensajes,
                total: conteo
              });
            });
      
      
          });
      },

    obtenerMensaje: async(req, res) => {
        let id = req.params.id;

        await mensajeModel.findById(id)
          .exec((err, mensaje) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar servicio',
                errors: err
              });
            }
            if (!mensaje) {
              return res.status(400).json({
                ok: false,
                mensaje: 'El mensaje con el id: ' + id + ' no existe',
                errors: { message: 'No existe el mensaje con ese ID' }
              });
            }
      
            res.status(200).json({
              ok: true,
              mensaje: mensaje
            })
          })
      },

    crearMensajes: async(req, res) => {
        const { titulo, asunto, fecha, correo } = req.body;
      
        if (titulo.length <= 0 || titulo === undefined || titulo === null) {
          return res.status(400).json({
            ok: false,
            mensaje: "Debe ingresar el título del mensaje",
          });
        }

        if (asunto.length <= 0 || asunto === undefined || asunto === null) {
          return res.status(400).json({
            ok: false,
            mensaje: "Debe ingresar el asunto del mensaje",
          });
        }

        if (fecha.length <= 0 || fecha === undefined || fecha === null) {
          return res.status(400).json({
            ok: false,
            mensaje: "Debe ingresar la fecha del mensaje",
          });
        }

        await usuarioModel.findOne({correo: { $in: correo}}, (err, usuarioObtenido)=>{

          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error buscando usuario",
              errors: err,
            });
          }

          if (!usuarioObtenido) {
            return res.status(500).json({
              ok: false,
              mensaje: "El usuario no existe",
              errors: err,
            });
          }

          if(usuarioObtenido){
            let mensaje = new mensajeModel({
              titulo: titulo,
              asunto: asunto,
              fecha: fecha,
              correo: correo
            });
          
          mensaje.save((err, mensajeGuardado) => {
              if (err) {
                return res.status(400).json({
                  ok: false,
                  mensaje: "Error al crear el mensaje",
                  errors: err,
                });
          
              }
          
              res.status(201).json({
                ok: true,
                mensaje: mensajeGuardado,
              });
            });
          }
        })
      },

    eliminarMensajes: async(req, res) => {
      let id = req.params.id;
      const { estado } = req.body;
  
  
      await mensajeModel.findById(id, async(err, mensaje) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar mensaje",
            errors: err,
          });
        }
  
        if (!mensaje) {
          return res.status(400).json({
            ok: false,
            mensaje: "El mensaje con el id: " + id + " no existe",
            errors: { message: "No existe un mensaje con ese ID" },
          });
        }
  
        mensaje.estado = estado;
  
  
         mensaje.save((err, mensajeGuardado) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al eliminar mensaje",
              errors: err,
            });
          }
  
          res.status(200).json({
            ok: true,
            mensaje: mensajeGuardado,
            message: "Se ha eliminado el mensaje correctamente"
          });
        });
      });
      },
}