const { mongo: { inmuebleModel } } = require('../../databases');


module.exports = {

  //OBTENER INMUEBLES (ARRENDADOR) PSDTA: Falta llamar el middleware verificar token
  obtenerinmueblesarrendador: (req, res, next) => {

      let idArrendador = req.params.idarrendador;
      let desde = req.params.desde;
      desde = Number(desde);

   

    inmuebleModel.find({ $and: [{ usuario: {$in: idArrendador} }, { estado: {$ne: 'ELIMINADO'} }] })
      .populate('usuario', 'nombre correo rol imagen')
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

        inmuebleModel.countDocuments({ usuario: {$in: idArrendador} }, (err, conteo) => {

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

  obtenerInmuebleArrendador: async (req, res) => {
    let id = req.params.idinmueble;

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

  actualizarInmuebleArrendador: async (req, res) => {
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

  desactivarinmuebleArrendador: async (req, res) => {
    let id = req.params.idinmueble;
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
  }
}