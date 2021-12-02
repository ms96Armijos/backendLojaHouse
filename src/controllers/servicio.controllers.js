const {mongo: {servicioModel} } = require('../../databases');

module.exports = {

    obtenerServicios: (req, res, next) => {

        let desde = req.params.desde;
        desde = Number(desde);
      
        servicioModel.find({})
          .skip(desde)
          .limit(6)
          .sort({'updatedAt': -1})
          .exec((err, servicios) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error cargando servicio",
                errors: err,
              });
            }
            
            servicioModel.countDocuments({}, (err, conteo) => {
             
              if (err) {
                return res.status(500).json({
                  ok: false,
                  mensaje: "Error contando usuarios",
                  errors: err,
                });
              }
              res.status(200).json({
                ok: true,
                servicios: servicios,
                total: conteo
              });
            });
      
      
          });
      },

    obtenerServicio: async(req, res) => {
        let id = req.params.id;

        await servicioModel.findById(id)
          .exec((err, servicio) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar servicio',
                errors: err
              });
            }
            if (!servicio) {
              return res.status(400).json({
                ok: false,
                mensaje: 'El servicio con el id: ' + id + ' no existe',
                errors: { message: 'No existe el servicio con ese ID' }
              });
            }
      
            res.status(200).json({
              ok: true,
              servicio: servicio
            })
          })
      },

    crearServicios: async(req, res) => {
        const { nombre } = req.body;
      
        if (nombre.length <= 0 || nombre === undefined || nombre === null) {
          return res.status(400).json({
            ok: false,
            mensaje: "Debe ingresar el nombre del servicio",
          });
        }


        const servicioEncontrado = await servicioModel.findOne({nombre});

        if(!servicioEncontrado){

          let servicio = new servicioModel({
            nombre: nombre
          });
        
        servicio.save((err, servicioGuardado) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error al crear servicio",
                errors: err,
              });
        
            }
        
            res.status(201).json({
              ok: true,
              servicio: servicioGuardado,
              mensaje: `Se ha creado el servicio: ${nombre}`
            });
          });
        }else{
          return res.status(400).json({
            ok: false,
            mensaje: `Ya existe el servicio: ${nombre}`,
          });
        }
      },

    actualizarServicios: async(req, res) => {
        let id = req.params.id;
        const { nombre } = req.body;
      
        await servicioModel.findById(id, (err, servicio) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar servicio",
              errors: err,
            });
          }
      
          if (!servicio) {
            return res.status(400).json({
              ok: false,
              mensaje: "El servicio con el id: " + id + " no existe",
              errors: { message: "No existe un servicio con ese ID" },
            });
          }
      
          if (nombre.length <= 0 || nombre === undefined || nombre === null) {
            return res.status(400).json({
              ok: false,
              mensaje: "Debe ingresar el nombre del servicio",
            });
          }

          servicio.nombre = nombre;
      
      
          servicio.save((err, servicioGuardado) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error al actualizar servicio",
                errors: err,
              });
            }
      
            res.status(200).json({
              ok: true,
              servicio: servicioGuardado,
              mensaje: `Se ha actualizado el servicio: ${nombre}`
            });
          });
        });
      },

    eliminarServicios: (req, res) => {
        let id = req.params.id;
      
        servicioModel.findOneAndDelete(id, (err, servicioBorrado) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al borrar usuario",
              errors: err,
            });
          }
      
          if (!servicioBorrado) {
            return res.status(400).json({
              ok: false,
              mensaje: "No existe un servicio con ese ID",
              errors: { message: "No existe un servicio con ese ID" },
            });
          }
      
          res.status(200).json({
            ok: true,
            servicio: servicioBorrado,
          });
        });
      },
}