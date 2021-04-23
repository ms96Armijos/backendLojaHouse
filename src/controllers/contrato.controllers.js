const { mongo: { contratoModel, inmuebleModel } } = require("../../databases");
const moment = require("moment");

module.exports = {
  //FALTA IMPLEMENTAR EL TOKEN
  obtenerContratos: (req, res, next) => {
    let desde = req.params.desde;
    desde = Number(desde);
    console.log(req.usuario._id);
    contratoModel
      .find({
        $or: [
          { usuarioarrendador: { $in: req.usuario._id } },
          { usuarioarrendatario: { $in: req.usuario._id } },
        ],
      })
      .populate("usuarioarrendatario", "nombre apellido correo")
      .populate("usuarioarrendador", "nombre apellido correo")
      .populate("inmueble")
      .skip(desde)
      .limit(6)
      .exec((err, contratos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando contrato",
            errors: err,
          });
        }

        contratoModel.countDocuments(
          { $or: [
            { usuarioarrendador: { $in: req.usuario._id } },
            { usuarioarrendatario: { $in: req.usuario._id } },
          ], },
          (err, conteo) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando contratos",
                errors: err,
              });
            }

            res.status(200).json({
              ok: true,
              contratos: contratos,
              total: conteo,
            });
          }
        );
      });
  },

  obtenerContratosArrendatarioAdministrador: (req, res, next) => {
    let desde = req.params.desde;
    desde = Number(desde);

    contratoModel
      .find({})
      .populate("usuarioarrendatario", "nombre apellido correo")
      .populate("usuarioarrendador", "nombre apellido correo")
      .populate("inmueble")
      .skip(desde)
      .limit(6)
      .exec((err, contratos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando contrato",
            errors: err,
          });
        }

        contratoModel.countDocuments({}, (err, conteo) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error contando contratos",
              errors: err,
            });
          }

          res.status(200).json({
            ok: true,
            contratos: contratos,
            total: conteo,
          });
        });
      });
  },

  obtenerContrato: (req, res) => {
    let id = req.params.id;

    console.log("contratos presente");

    contratoModel
      .findById(id)
      .populate("usuarioarrendatario", "nombre apellido correo cedula movil")
      .populate("usuarioarrendador", "nombre apellido correo cedula movil")
      .populate("inmueble")
      .exec((err, contrato) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar contrato",
            errors: err,
          });
        }
        if (!contrato) {
          return res.status(400).json({
            ok: false,
            mensaje: "El contrato con el id: " + id + " no existe",
            errors: { message: "No existe el contrato con ese ID" },
          });
        }

        res.status(200).json({
          ok: true,
          contrato: contrato,
        });
      });
  },

  //PARA QUE FUNCIONE, NECESITO IMPLEMENTAR LO DEL TOKEN Y OBTENER EL USUARIO ARRENDADOR
  //EN ESTE CASO EL ARRENDADOR GENERA EL CONTRATO POR ESO OBTENGO SU ID CUANDO SE LOGUEA
  crearContrato: async (req, res) => {
    let {
      nombrecontrato,
      fechainicio,
      fechafin,
      tiempocontrato,
      monto,
      estado,
      acuerdo,
      usuarioarrendador,
      usuarioarrendatario,
      inmueble,
    } = req.body;

    if (
      fechainicio.length <= 0 ||
      fechainicio === undefined ||
      fechainicio === null
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar la fecha de inicio del contrato",
      });
    }
    if (fechafin.length <= 0 || fechafin === undefined || fechafin === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar la fecha de finalización del contrato",
      });
    }
    if (monto.length <= 0 || monto === undefined || monto === null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar precio acordado para el contrato",
      });
    }

    let fecha1 = moment(fechainicio);
    let fecha2 = moment(fechafin);
    
    if (moment(fecha2).isAfter(fecha1)) {

      if(fecha2.diff(fecha1, "month") >= 1){
        tiempocontrato = fecha2.diff(fecha1, "month");
        console.log(tiempocontrato);
      }else{
        return res.status(400).json({
          ok: false,
          mensaje: "El contrato debe por lo menos ser de un mes",
          errors: "El contrato debe por lo menos ser de un mes",
        });
      }
      }else{
        return res.status(400).json({
          ok: false,
          mensaje: "La fecha de inicio debe ser mayor a la fecha de finalización",
          errors: "La fecha de inicio debe ser mayor a la fecha de finalización",
        });
      }
  

    let contrato = new contratoModel({
      nombrecontrato,
      fechainicio,
      fechafin,
      tiempocontrato,
      monto,
      estado,
      acuerdo,
      tiempocontrato,
      usuarioarrendador: req.usuario._id,
      usuarioarrendatario,
      inmueble,
    });
    

      contrato.save(async (err, contratoGuardado) => {
        
        await inmuebleModel.findById(inmueble,  (err, inmuebleEncontrado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar inmueble",
            errors: err,
          });
        }
        
        if (!inmuebleEncontrado) {
          return res.status(400).json({
            ok: false,
            mensaje: "El inmueble con el id no existe",
            errors: { message: "No existe un inmueble con ese ID" },
          });
        }

        if(inmuebleEncontrado.estado === 'OCUPADO'){
          return res.status(400).json({
            ok: false,
            mensaje: "El inmueble está ocupado",
            errors: { message: "El inmueble está ocupado"},
          });
        }
        inmuebleEncontrado.publicado = 'PRIVADO';
        inmuebleEncontrado.estado = 'OCUPADO';
        
        inmuebleEncontrado.save((err, inmuebleGuardado) => {
          
          
          if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al crear contrato",
              errors: err,
            });
          }
          res.status(201).json({
            ok: true,
            contrato: contratoGuardado,
            inmueble: inmuebleGuardado
          });
        });


      });
    });
  },

  //SERÍA INTERESANTE QUE EL USUARIO ARRENDADOR PUEDA MODIFICAR EL CONTRATO HASTA
  //QUE EL USUARIO ARRENDATARIO ACEPTE EL CONTRATO, UNA VEZ ACEPTADO SE BLOQUEE ESTA
  //FUNCIONALIDAD
  actualizarContrato: (req, res) => {
    let id = req.params.id;
    const {
      nombrecontrato,
      fechainicio,
      fechafin,
      tiempocontrato,
      monto,
    } = req.body;

    contratoModel.findById(id, (err, contrato) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar contrato",
          errors: err,
        });
      }

      if (!contrato) {
        return res.status(400).json({
          ok: false,
          mensaje: "El contrato con el id: " + id + " no existe",
          errors: { message: "No existe un contrato con ese ID" },
        });
      }

      if (
        fechainicio.length <= 0 ||
        fechainicio === undefined ||
        fechainicio === null
      ) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe ingresar la fecha de inicio del contrato",
        });
      }
      if (fechafin.length <= 0 || fechafin === undefined || fechafin === null) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe ingresar la fecha de finalización del contrato",
        });
      }
      if (monto.length <= 0 || monto === undefined || monto === null) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe ingresar precio acordado para el contrato",
        });
      }

      contrato.nombrecontrato = nombrecontrato;
      contrato.fechainicio = fechainicio;
      contrato.fechafin = fechafin;
      contrato.monto = monto;
      contrato.tiempocontrato = tiempocontrato;

      contrato.save((err, contratoGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar contrato",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          contrato: contratoGuardado,
          mensaje: "Se ha actualizado el contrato",
        });
      });
    });
  },

  eliminarContrato: (req, res) => {
    let id = req.params.id;

    contratoModel.findByIdAndRemove(id, (err, contratoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al borrar usuario",
          errors: err,
        });
      }

      if (!contratoBorrado) {
        return res.status(400).json({
          ok: false,
          mensaje: "No existe un contrato con ese ID",
          errors: { message: "No existe un contrato con ese ID" },
        });
      }

      res.status(200).json({
        ok: true,
        contrato: contratoBorrado,
        mensaje: "Se ha eliminado el contrato correctamente",
      });
    });
  },


  contratoarrendatario: (req, res, next) => {
    let desde = req.params.desde;
    desde = Number(desde);

    contratoModel
      .find({ usuarioarrendatario: req.usuario._id })
      .populate("usuarioarrendatario", "nombre apellido correo")
      .populate("usuarioarrendador", "nombre apellido correo")
      .populate("inmueble")
      .skip(desde)
      .limit(6)
      .exec((err, contratos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando contrato",
            errors: err,
          });
        }

        contratoModel.countDocuments(
          { usuarioarrendatario: req.usuario._id },
          (err, conteo) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando contratos",
                errors: err,
              });
            }

            res.status(200).json({
              ok: true,
              contratos: contratos,
              total: conteo,
            });
          }
        );
      });
  },

  //ruta para obtener el scroll infinito en flutter
  contratoarrendatariomovil: (req, res, next) => {
    let desde = req.params.desde;
    desde = Number(desde);

    contratoModel
      .find({ usuarioarrendatario: req.usuario._id })
      .populate("usuarioarrendatario", "nombre apellido correo")
      .populate("usuarioarrendador", "nombre apellido correo")
      .populate("inmueble")
      //.skip(desde)
      //.limit(6)
      .exec((err, contratos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando contrato",
            errors: err,
          });
        }

        contratoModel.countDocuments(
          { usuarioarrendatario: req.usuario._id },
          (err, conteo) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando contratos",
                errors: err,
              });
            }

            res.status(200).json({
              ok: true,
              contratos: contratos,
              total: conteo,
            });
          }
        );
      });
  },

  aceptarAcuerdo: async (req, res) => {
    let id = req.params.id;
    const { acuerdo, estado } = req.body;

    await contratoModel.findById(id, (err, contrato) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar contrato",
          errors: err,
        });
      }

      if (!contrato) {
        return res.status(400).json({
          ok: false,
          mensaje: "El contrato con el id: " + id + " no existe",
          errors: { message: "No existe un contrato con ese ID" },
        });
      }

      contrato.acuerdo = acuerdo;
      contrato.estado = estado;

      contrato.save((err, contratoGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al aceptar el contrato",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          contrato: contratoGuardado,
          mensaje: `La contrato está: ${acuerdo}`,
        });
      });
    });
  },

  estadoContrato: async (req, res) => {
    let id = req.params.id;
    const { estado } = req.body;

    await contratoModel.findById(id, (err, contrato) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar contrato",
          errors: err,
        });
      }

      if (!contrato) {
        return res.status(400).json({
          ok: false,
          mensaje: "El contrato con el id: " + id + " no existe",
          errors: { message: "No existe un contrato con ese ID" },
        });
      }

      //VALIDACIÓN CUANDO EL CONTRATO AÚN NO SE TERMINA, SE CAMBIÓ POR LA 
      //DOBLE CONFIRMACIÓN EN EL FRONT

      /*  var momentB = moment(contrato.fechafin,"YYYY/MM/DD");
        var fechaAhora = moment().format('YYYY/MM/DD');

        console.log(fechaAhora)

          if (moment(fechaAhora).isBefore(momentB)) {

              return res.status(400).json({
                ok: false,
                mensaje: "El contrato finaliza la fecha: "+contrato.fechafin,
                errors: "El contrato finaliza la fecha: "+moment(contrato.fechafin).format('DD/MM/YYYY'),
              });
            }*/


      

      contrato.estado = estado;

      contrato.save((err, contratoGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al cambiar el estado del contrato",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          contrato: contratoGuardado,
          mensaje: `La contrato está: ${contratoGuardado.estado}`,
        });
      });
    });
  },
};
