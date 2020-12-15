const { mongo: { inmuebleModel } } = require('../../databases');


module.exports = {

  //OBTENER INMUEBLES (ADMIN)
  obtenerInmuebles: (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

    inmuebleModel.find({})
      .populate('usuario', 'nombre correo rol')
      .skip(desde)
      .limit(6)
      .exec((err, inmuebles) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al obtener los inmuebles",
            errors: err,
          });
        }

        inmuebleModel.countDocuments({}, (err, conteo) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando usuarios",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            inmuebles: inmuebles,
            total: conteo
          });
        });
      });
  },

  //OBTENER INMUEBLES (ARRENDADOR) PSDTA: Falta llamar el middleware verificar token
  obtenerinmueblesarrendador: (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

    inmuebleModel.find({ $and: [{ usuario: req.usuario._id }, { estado: {$ne: 'ELIMINADO'} }]     })
      .populate('usuario', 'nombre correo rol')
      .skip(desde)
      .limit(6)
      .exec((err, inmuebles) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando inmueble",
            errors: err,
          });
        }

        inmuebleModel.countDocuments({ $and: [{ usuario: req.usuario._id }, { estado: {$ne: 'ELIMINADO'} }] }, (err, conteo) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando usuarios",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            inmuebles: inmuebles,
            total: conteo
          });

        });


      });
  },

  obtenerInmueble: async (req, res) => {
    let id = req.params.id;

    await inmuebleModel.findById(id)
      .populate('usuario', 'nombre imagen correo estado rol')
      .exec((err, inmueble) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar inmueble',
            errors: err
          });
        }
        if (!inmueble) {
          return res.status(400).json({
            ok: false,
            mensaje: 'El inmueble con el id: ' + id + ' no existe',
            errors: { message: 'No existe el inmueble con ese ID' }
          });
        }

        res.status(200).json({
          ok: true,
          inmueble: inmueble
        })
      })
  },

  obtenerInmueblePublico: async (req, res) => {
    let id = req.params.id;

    await inmuebleModel.findById(id)
      .populate('usuario', 'nombre imagen correo estado rol')
      .exec((err, inmueble) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar inmueble',
            errors: err
          });
        }
        if (!inmueble) {
          return res.status(400).json({
            ok: false,
            mensaje: 'El inmueble con el id: ' + id + ' no existe',
            errors: { message: 'No existe el inmueble con ese ID' }
          });
        }

        res.status(200).json({
          ok: true,
          inmueble: inmueble
        })
      })
  },


  crearInmueble: async (req, res) => {

    const { nombre, descripcion, direccion, codigo, tipo, servicio, precioalquiler, garantia, estado, publicado, usuario } = req.body;

    console.log(req.usuario._id)
    let inmueble = new inmuebleModel({
      nombre,
      descripcion,
      direccion,
      codigo,
      tipo,
      servicio,
      precioalquiler,
      garantia,
      estado,
      publicado,
      usuario

    });
    console.log(inmueble)

    await inmueble.save((err, inmuebleGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al crear inmueble",
          errors: err,
        });

      }

      res.status(201).json({
        ok: true,
        inmueble: inmuebleGuardado,
        mensaje: "El inmueble ha sido creado",
      });
    });
  },

  actualizarInmueble: async (req, res) => {
    let id = req.params.id;

    const { nombre, descripcion, direccion, codigo, tipo, servicio, precioalquiler, garantia, usuario } = req.body;

    await inmuebleModel.findById(id, async (err, inmueble) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar inmueble",
          errors: err,
        });
      }

      if (!inmueble) {
        return res.status(400).json({
          ok: false,
          mensaje: "El inmueble con el id: " + id + " no existe",
          errors: { message: "No existe un inmueble con ese ID" },
        });
      }

      inmueble.nombre = nombre;
      inmueble.descripcion = descripcion;
      inmueble.direccion = direccion;
      inmueble.codigo = codigo;
      inmueble.tipo = tipo;
      inmueble.servicio = servicio;
      inmueble.precioalquiler = precioalquiler;
      inmueble.garantia = garantia;


      await inmueble.save((err, inmuebleGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar el inmueble",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          inmueble: inmuebleGuardado,
          mensaje: "El inmueble ha sido actualizado correctamente",
        });
      });
    });
  },

  eliminarInmueble: async (req, res) => {
    let id = req.params.id;
    const { estado } = req.body;


    await inmuebleModel.findById(id, async (err, inmueble) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar inmueble",
          errors: err,
        });
      }

      if (!inmueble) {
        return res.status(400).json({
          ok: false,
          mensaje: "El inmueble con el id: " + id + " no existe",
          errors: { message: "No existe un inmueble con ese ID" },
        });
      }

      inmueble.estado = estado;


      await inmueble.save((err, inmuebleGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al eliminar inmueble",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          inmueble: inmuebleGuardado,
          mensaje: "Se ha eliminado el inmueble correctamente"
        });
      });
    });
  },

  desactivarinmueble: async (req, res) => {
    let id = req.params.id;
    const { estado, publicado } = req.body;
    

    await inmuebleModel.findById(id, async (err, inmueble) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar inmueble",
          errors: err,
        });
      }

      if (!inmueble) {
        return res.status(400).json({
          ok: false,
          mensaje: "El inmueble con el id: " + id + " no existe",
          errors: { message: "No existe un inmueble con ese ID" },
        });
      }

      inmueble.publicado = publicado;
      inmueble.estado = estado;


      await inmueble.save((err, inmuebleGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar inmueble",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          inmueble: inmuebleGuardado,
          mensaje: "Se ha actualizado el inmueble correctamente"
        });
      });
    });
  },
  //OBTENER INMUEBLES PUBLICADOS(ARRENDADOR) PSDTA: Falta llamar el middleware verificar token
  inmueblesPublicadosPorArrendador: (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

    inmuebleModel.find({ usuario: req.usuario._id, $and: [{ publicado: { $eq: 'PUBLICO' } }, { estado: { $eq: 'DISPONIBLE' } }] })
      .populate('usuario', 'nombre correo')
      .skip(desde)
      .limit(6)
      .exec((err, inmuebles) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando inmueble",
            errors: err,
          });
        }

        inmuebleModel.countDocuments({ usuario: req.usuario._id, $and: [{ publicado: { $eq: 'PUBLICO' } }, { estado: { $eq: 'DISPONIBLE' } }] }, (err, conteo) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando inmuebles",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            inmuebles: inmuebles,
            total: conteo
          });
        });


      });
  },
  //OBTENER INMUEBLES PUBBLICOS(TODOS PUEDEN ACCEDER) 
  inmueblesPublicos: async (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

    await inmuebleModel.find({ $and: [{ publicado: { $eq: 'PUBLICO' } }, { estado: { $eq: 'DISPONIBLE' } }] })
      .populate('usuario', 'nombre correo')
      .skip(desde)
      .limit(6)
      .exec((err, inmuebles) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando inmueble",
            errors: err,
          });
        }

        inmuebleModel.countDocuments({ $and: [{ publicado: { $eq: 'PUBLICO' } }, { estado: { $eq: 'DISPONIBLE' } }] }, (err, conteo) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando inmuebles",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            inmuebles: inmuebles,
            total: conteo
          });
        });


      });
  },

    //OBTENER INMUEBLES PUBBLICOS(TODOS PUEDEN ACCEDER) 
  inmueblesPublicosMovil: async (req, res, next) => {


      await inmuebleModel.find({ $and: [{ publicado: { $eq: 'PUBLICO' } }, { estado: { $eq: 'DISPONIBLE' } }] })
        .populate('usuario', 'nombre correo')
        .exec((err, inmuebles) => {
          //console.log(inmuebles);
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando inmueble",
              errors: err,
            });
          }
          res.status(200).json({
            inmuebles: inmuebles
          });
        });
  },
}