const { mongo: { visitaModel, inmuebleModel } } = require('../../databases');
const { usuarioModel } = require('../../databases/mongo');

module.exports = {

  //QUEDA PENDIENTE PARA REVISARLO CUANDO ESTÉ EL TOKEN
  obtenerVisitas: async (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

    const inmueble = await inmuebleModel.find({ usuario: { $in: req.usuario._id } });

    if (inmueble) {
      const visita = await visitaModel.find({ 
        $and: [
        { inmueble: { $in: inmueble }  },
         { estado: { $ne: 'ELIMINADA' } },
       ]
        })
        .populate('usuarioarrendatario', 'nombre imagen apellido correo movil cedula imagen')
        .populate('inmueble')
        .skip(desde)
        .limit(5)
        .exec((err, visitas) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando visita",
              errors: err,
            });
          }
          
          visitaModel.countDocuments({ 
            $and: [
              { inmueble: { $in: inmueble }  },
               { estado: { $ne: 'ELIMINADA' } },
             ]
           }, (err, conteo) => {

            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando usuarios",
                errors: err,
              });
            }


            res.status(200).json({
              ok: true,
              visitas: visitas,
              total: conteo
            });
          });
        });
    }

    /*Visita.find({usuarioarrendatario: { $in: req.usuario._id}})
    .populate('usuarioarrendatario', 'nombre apellido correo movil cedula')
    .populate('inmueble')
    .skip(desde)
    .limit(5)
    .exec((err, visitas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando visita",
          errors: err,
        });
      }
  
      visitas.forEach(visit => {
        console.log(visit.inmueble.usuario)
        
      });
        Visita.countDocuments({usuarioarrendatario: { $in: req.usuario._id}}, (err, conteo) => {
  
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando usuarios",
              errors: err,
            });
          }
          res.status(200).json({
            ok: true,
            visitas: visitas,
            total: conteo
          });
        });
    });*/
  },

  //QUEDA PENDIENTE PARA REVISARLO CUANDO ESTÉ EL TOKEN
  obtenerVisitasArrendatarioAdministrador: async (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

      const visita = await visitaModel.find({})
        .populate('usuarioarrendatario', 'nombre imagen apellido correo movil cedula')
        .populate('inmueble')
        .skip(desde)
        .limit(5)
        .exec((err, visitas) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando visita",
              errors: err,
            });
          }
          visitaModel.countDocuments({}, (err, conteo) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando usuarios",
                errors: err,
              });
            }
            res.status(200).json({
              ok: true,
              visitas: visitas,
              total: conteo
            });
          });
        });
  },

  crearVisita: async (req, res) => {
    const { fecha, descripcion, inmueble, usuarioarrendatario } = req.body;

    if (fecha.length <= 0 || fecha === undefined || fecha === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar la fecha de la visita",
      });
    }
    if (descripcion.length <= 0 || descripcion === undefined || descripcion === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar la descripción de la visita",
      });
    }

    let visita = new visitaModel({
      fecha,
      descripcion,
      inmueble,
      usuarioarrendatario
    });

    
    await usuarioModel.findById(usuarioarrendatario, (err, usuarioEncontrado) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar usuario",
          errors: err,
        });
      }

      if (!usuarioEncontrado) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el id: " + usuarioEncontrado + " no existe",
          errors: { message: "No existe un usuario con ese ID" },
        });
      }

      if(usuarioEncontrado.rol == 'ARRENDADOR' || usuarioEncontrado.rol == 'ADMINISTRADOR'){
        return res.status(400).json({
          ok: false,
          mensaje: "No se puede solicitar la visita, debe ser un usuario arrendatario",
          errors: err,
        });
      }

       visita.save((err, visitaGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al crear visita",
            errors: err,
          });
  
        }
  
        res.status(201).json({
          ok: true,
          visita: visitaGuardado,
          mensaje: "Se ha registrado su visita"
        });
      });


    });



  },

  //REVISAR EN EL FRONT COMO HAGO ESTA PARTE, SI SOLO ES PARA ACTUALIZAR EL ESTADO O LA VISITA EN GENERAL
  actualizarVisita: async (req, res) => {
    let id = req.params.id;
    const { fecha, descripcion, estado } = req.body;

    if (fecha.length <= 0 || fecha === undefined || fecha === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar la fecha de la visita",
      });
    }
    if (descripcion.length <= 0 || descripcion === undefined || descripcion === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar la descripción de la visita",
      });
    }

    await visitaModel.findById(id, (err, visita) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar visita",
          errors: err,
        });
      }

      if (!visita) {
        return res.status(400).json({
          ok: false,
          mensaje: "El visita con el id: " + id + " no existe",
          errors: { message: "No existe un visita con ese ID" },
        });
      }

      visita.fecha = fecha;
      visita.descripcion = descripcion;
      visita.estado = estado;


     visita.save((err, visitaGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar visita",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          visita: visitaGuardado,
          mensaje: "Se ha actualizado su visita"
        });
      });
    });
  },

  eliminarVisita: async(req, res) => {
    let id = req.params.id;
    //el estado debe recibirse como eliminado
    const { estado } = req.body;

    await visitaModel.findById(id, (err, visita) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar visita",
          errors: err,
        });
      }

      if (!visita) {
        return res.status(400).json({
          ok: false,
          mensaje: "El visita con el id: " + id + " no existe",
          errors: { message: "No existe un visita con ese ID" },
        });
      }

      if(visita.estado == 'PENDIENTE' || visita.estado == 'RECHAZADA'){
        
        visita.estado = estado;

        visita.save((err, visitaEliminada) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al eliminar la visita",
              errors: err,
            });
          }
  
          res.status(200).json({
            ok: true,
            visita: visitaEliminada,
            mensaje: `La visita está: ${estado}`,
          });
        });
      }else{
        //no puedo eliminar
      return res.status(400).json({
        ok: false,
        mensaje: "No se puede eliminar, la visita ha sido "+visita.estado,
        errors: { message: "No se puede eliminar, la visita ha sido "+visita.estado },
      });
      }
    });

  },

  aceptarVisita: async (req, res) => {
    let id = req.params.id;
    const { estado } = req.body;

    await visitaModel.findById(id, (err, visita) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar visita",
          errors: err,
        });
      }

      if (!visita) {
        return res.status(400).json({
          ok: false,
          mensaje: "El visita con el id: " + id + " no existe",
          errors: { message: "No existe un visita con ese ID" },
        });
      }

      visita.estado = estado;


      visita.save((err, visitaGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al aceptar la visita",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          visita: visitaGuardado,
          mensaje: `La visita está: ${estado}`,
        });
      });
    });
  },

  //QUEDA PENDIENTE PARA REVISARLO CUANDO ESTÉ EL TOKEN
  obtenerVisitasSolicitadas: async (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

    await visitaModel.find({ 
      $and: [
       { usuarioarrendatario: { $in: req.usuario._id } },
        { estado: { $ne: 'ELIMINADA' } },
      ]
      
       })
      .populate('usuarioarrendatario', 'nombre imagen apellido correo movil cedula')
      .populate('inmueble')
      .skip(desde)
      .limit(6)
      .exec((err, visitas) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando visita",
            errors: err,
          });
        }


        visitaModel.countDocuments({ 
          $and: [
            { usuarioarrendatario: { $in: req.usuario._id } },
            { estado: { $ne: 'ELIMINADA' } },
            ]
         }, (err, conteo) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando usuarios",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            visitas: visitas,
            total: conteo
          });
        });
      });
  },

   //QUEDA PENDIENTE PARA REVISARLO CUANDO ESTÉ EL TOKEN
   obtenerVisitasSolicitadasMovil: (req, res, next) => {

    let desde = req.params.desde;
    desde = Number(desde);

   visitaModel.find({ 
      $and: [
       { usuarioarrendatario: { $in: req.usuario._id } },
        { estado: { $ne: 'ELIMINADA' } },
      ]
      
       })
      .populate('usuarioarrendatario', 'nombre imagen apellido correo movil cedula')
      .populate('inmueble')
      //.skip(desde)
      //.limit(6)
      .exec((err, visitas) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando visita",
            errors: err,
          });
        }


        visitaModel.countDocuments({ 
          $and: [
            { usuarioarrendatario: { $in: req.usuario._id } },
            { estado: { $ne: 'ELIMINADA' } },
            ]
         }, (err, conteo) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando visitas",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            visitas: visitas,
            total: conteo
          });
        });
      });
  },

  obtenerVisitaEspecificaArrendatario: (req, res) => {
    let id = req.params.id;

    visitaModel.findById(id)
      .populate('usuarioarrendatario', 'nombre imagen apellido correo movil cedula rol').populate('inmueble')
      .exec((err, visita) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar visita',
            errors: err
          });
        }
        if (!visita) {
          return res.status(400).json({
            ok: false,
            mensaje: 'El inmueble con el id: ' + id + ' no existe',
            errors: { message: 'No existe el visita con ese ID' }
          });
        }

        res.status(200).json({
          ok: true,
          visita: visita
        })
      })
  },

  obtenerVisitaEspecificaArrendador: (req, res) => {
    let id = req.params.id;

    visitaModel.findById(id)
      .populate('usuarioarrendatario', 'nombre imagen apellido correo movil cedula rol')
      .populate('inmueble')
      .exec((err, visita) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar visita',
            errors: err
          });
        }
        if (!visita) {
          return res.status(400).json({
            ok: false,
            mensaje: 'El inmueble con el id: ' + id + ' no existe',
            errors: { message: 'No existe el visita con ese ID' }
          });
        }
        console.log(visita)
        res.status(200).json({
          ok: true,
          visita: visita
        })
      })
  },


   obtenerSolicitudVisitasPendientes: async (req, res, next) => {


    const inmueble = await inmuebleModel.find({ usuario: { $in: req.usuario._id } });

    if (inmueble) {
      const visita = await visitaModel.find({ 
        $and: [
        { inmueble: { $in: inmueble }  },
         { estado: { $in: 'PENDIENTE' } },
       ]
        })
        .populate('inmueble')
        .exec((err, visitas) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando visita",
              errors: err,
            });
          }
          
          visitaModel.countDocuments({ 
            $and: [
              { inmueble: { $in: inmueble }  },
               { estado: { $in: 'PENDIENTE' } },
             ]
           }, (err, conteo) => {

            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando usuarios",
                errors: err,
              });
            }

            res.status(200).json({
              ok: true,
              total: conteo
            });
          });
        });
    }
  },
}