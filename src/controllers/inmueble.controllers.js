const { mongo: { inmuebleModel, contratoModel } } = require('../../databases');


module.exports = {

  //OBTENER INMUEBLES (ADMIN)
  obtenerInmuebles: (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

    inmuebleModel.find({})
      .populate('usuario', 'nombre correo rol')
      .skip(desde)
      .limit(6)
      .sort({'updatedAt': -1})
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

    inmuebleModel.find({ $and: [{ usuario: req.usuario._id }, { estado: {$in: 'DISPONIBLE'} }, { estado: {$ne: 'ELIMINADO'} }]     })
      .populate('usuario', 'nombre correo rol')
      .skip(desde)
      .limit(6)
      .sort({'updatedAt': -1})
      .exec((err, inmuebles) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando inmueble",
            errors: err,
          });
        }

        inmuebleModel.countDocuments({ $and: [{ usuario: req.usuario._id }, { estado: {$in: 'DISPONIBLE'} }, { estado: {$ne: 'ELIMINADO'} }] }, (err, conteo) => {

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


  crearInmueble: (req, res) => {

    const { nombre,
       descripcion, 
       direccion, 
       codigo, 
       tipo, 
       servicio, 
       precioalquiler, 
       garantia, 
       estado, 
       publicado, 
       usuario,
       barrio,
       ciudad,
       provincia } = req.body;

    //console.log(req.usuario._id)
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
      usuario, 
      barrio,
      ciudad, 
      provincia
    });
    console.log(inmueble)

     inmueble.save((err, inmuebleGuardado) => {
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

    const { nombre, 
      descripcion, 
      direccion, 
      codigo, 
      tipo, 
      servicio, 
      precioalquiler, 
      garantia, 
      usuario,
      barrio,
      ciudad,
      provincia 
    } = req.body;

    await inmuebleModel.findById(id, (err, inmueble) => {
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
      inmueble.barrio = barrio;
      inmueble.ciudad = ciudad;
      inmueble.provincia = provincia;


      inmueble.save((err, inmuebleGuardado) => {
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

  

  eliminarInmuebleArrendador: async(req, res) => {
    let id = req.params.id;
  
    let contrato = await contratoModel.find({ inmueble: { $in: id } });

    if(contrato && contrato.length>0){
      return res.status(500).json({
        ok: false,
        mensaje: "No se puede eliminar el inmueble",
      });
    }
    
    inmuebleModel.findByIdAndDelete(id, (err, inmuebleBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al borrar el inmueble",
          errors: err,
        });
      }
  
      if (!inmuebleBorrado) {
        return res.status(400).json({
          ok: false,
          mensaje: "No existe un inmueble con ese ID",
          errors: { message: "No existe un inmueble con ese ID" },
        });
      }
  
      res.status(200).json({
        ok: true,
        servicio: inmuebleBorrado,
      });
    });
    
    /**/
  },


  desactivarinmueble: async (req, res) => {
    let id = req.params.id;
    const { estado, publicado } = req.body;
    
    await inmuebleModel.findById(id,  (err, inmueble) => {
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

      if(inmueble.estado == 'ELIMINADO'){
        return res.status(400).json({
          ok: false,
          mensaje: "No se puede publicar el inmueble",
          errors: { message: "No se puede publicar el inmueble" },
        });
      }

      inmueble.publicado = publicado;
      inmueble.estado = estado;


      inmueble.save((err, inmuebleGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al publicar inmueble",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          inmueble: inmuebleGuardado,
          mensaje: "Se ha publicado el inmueble correctamente"
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
      .sort({'updatedAt': -1})
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
      .limit(9)
      .sort({'updatedAt': -1})
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


      await inmuebleModel.find({ $and: [{ publicado: { $eq: 'PUBLICO' } }, { estado: { $eq: 'DISPONIBLE' } }, { estado: {$ne: 'ELIMINADO'} }] })
        .populate('usuario', 'nombre correo')
        .sort({'updatedAt': -1})
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
            inmuebles: inmuebles,
          });
        });
  },

  //BUSCAR INMUEBLES PARA LA PRINCIPAL DE LA MOVIL
   buscaInmueblePublicoMovil: ( req, res, next) => {
   
        let busqueda = req.params.busqueda;
        let expresionRegular = new RegExp(busqueda, "i");

        inmuebleModel.find({ $and: [{ estado: {$in: 'DISPONIBLE'} }, { publicado: {$in: 'PUBLICO'} }, { estado: {$ne: 'ELIMINADO'} }]})
        .or([{ tipo: expresionRegular }, { barrio: expresionRegular },  { direccion: expresionRegular }])
        .populate("usuario", "nombre apellido correo _id")
        .sort({'updatedAt': -1})
        .exec((err, inmuebles) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando inmueble",
              errors: err,
            });
          }
          res.status(200).json({
            ok: true,
            inmuebles: inmuebles,
          });
        });
      }
}