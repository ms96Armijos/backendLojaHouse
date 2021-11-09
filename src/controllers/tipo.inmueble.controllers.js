const {mongo: {tipoInmuebleModel} } = require('../../databases');

module.exports = {

    obtenerTipoInmuebles: (req, res, next) => {

        let desde = req.params.desde;
        desde = Number(desde);
      
        tipoInmuebleModel.find({})
          .skip(desde)
          .limit(6)
          .sort({'updatedAt': -1})
          .exec((err, tipoinmuebles) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error cargando tipo de inmuebles",
                errors: err,
              });
            }
            
            tipoInmuebleModel.countDocuments({}, (err, conteo) => {
             
              if (err) {
                return res.status(500).json({
                  ok: false,
                  mensaje: "Error contando tipo de inmuebles",
                  errors: err,
                });
              }
              res.status(200).json({
                ok: true,
                tipoinmuebles: tipoinmuebles,
                total: conteo
              });
            });
      
      
          });
      },

    obtenerTipoInmueble: async(req, res) => {
        let id = req.params.id;

        await tipoInmuebleModel.findById(id)
          .exec((err, tipoinmueble) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar tipo de inmueble',
                errors: err
              });
            }
            if (!tipoinmueble) {
              return res.status(400).json({
                ok: false,
                mensaje: 'El tipo de inmueble con el id: ' + id + ' no existe',
                errors: { message: 'No existe el tipo de inmueble con ese ID' }
              });
            }
      
            res.status(200).json({
              ok: true,
              tipoinmueble: tipoinmueble
            })
          })
      },

    crearTipoInmueble: async(req, res) => {
        const { nombre } = req.body;
      
        if (nombre.length <= 0 || nombre === undefined || nombre === null) {
          return res.status(400).json({
            ok: false,
            mensaje: "Debe ingresar el nombre del tipo de inmueble",
          });
        }


        const tipoinmuebleEncontrado = await tipoInmuebleModel.findOne({nombre});

        if(!tipoinmuebleEncontrado){

          let tipoinmueble = new tipoInmuebleModel({
            nombre: nombre
          });
        
        tipoinmueble.save((err, tipoinmuebleGuardado) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error al crear tipo de inmueble",
                errors: err,
              });
        
            }
        
            res.status(201).json({
              ok: true,
              tipoinmueble: tipoinmuebleGuardado,
              mensaje: `Se ha creado el tipo de inmueble: ${nombre}`
            });
          });
        }else{
          return res.status(400).json({
            ok: false,
            mensaje: `Ya existe el tipo de inmueble: ${nombre}`,
          });
        }
      },

    actualizarTipoInmueble: async(req, res) => {
        let id = req.params.id;
        const { nombre } = req.body;
      
        await tipoInmuebleModel.findById(id, (err, tipoinmueble) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar tipo de inmueble",
              errors: err,
            });
          }
      
          if (!tipoinmueble) {
            return res.status(400).json({
              ok: false,
              mensaje: "El tipo de inmueble con el id: " + id + " no existe",
              errors: { message: "No existe un tipo de inmueble con ese ID" },
            });
          }
      
          if (nombre.length <= 0 || nombre === undefined || nombre === null) {
            return res.status(400).json({
              ok: false,
              mensaje: "Debe ingresar el nombre del tipo de inmueble",
            });
          }

          tipoinmueble.nombre = nombre;
      
      
          tipoinmueble.save((err, tipoinmuebleGuardado) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error al actualizar tipo de inmueble",
                errors: err,
              });
            }
      
            res.status(200).json({
              ok: true,
              tipoinmueble: tipoinmuebleGuardado,
              mensaje: `Se ha actualizado el tipo de inmueble: ${nombre}`
            });
          });
        });
      },

    eliminarTipoInmueble: (req, res) => {
        let id = req.params.id;
      
        tipoInmuebleModel.findByIdAndRemove(id, (err, tipoinmuebleBorrado) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al borrar tipo de inmueble",
              errors: err,
            });
          }
      
          if (!tipoinmuebleBorrado) {
            return res.status(400).json({
              ok: false,
              mensaje: "No existe un tipoinmueble con ese ID",
              errors: { message: "No existe un tipo de inmueble con ese ID" },
            });
          }
      
          res.status(200).json({
            ok: true,
            tipoinmueble: tipoinmuebleBorrado,
          });
        });
      },
}