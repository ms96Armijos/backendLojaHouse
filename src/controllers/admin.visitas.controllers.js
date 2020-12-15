const { mongo: { visitaModel, inmuebleModel } } = require('../../databases');

module.exports = {

  //QUEDA PENDIENTE PARA REVISARLO CUANDO ESTÉ EL TOKEN
  obtenerVisitasArrendador: async (req, res, next) => {

    let idArrendador = req.params.idarrendador;
    let desde = req.params.desde;
    desde = Number(desde);

    console.log('ID ARRENDADOR ' + idArrendador)

    const inmueble = await inmuebleModel.find({ usuario: { $in: idArrendador } });

    if (inmueble) {
      const visita = await visitaModel.find({ inmueble: { $in: inmueble } })
        .populate('usuarioarrendatario', 'nombre apellido imagen correo movil cedula')
        .populate('inmueble')
        .skip(desde)
        .limit(6)
        .exec(async(err, visitas) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando visita",
              errors: err,
            });
          }

          await visitaModel.countDocuments({ inmueble: { $in: inmueble } }, (err, conteo) => {

            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando usuarios",
                errors: err,
              });
            }

            //console.log('VISITAS ' + visitas)
            res.status(200).json({
              ok: true,
              visitas: visitas,
              total: conteo
            });
          });
        });
    }
  },

  obtenerVisitasArrendatario: async (req, res, next) => {

    let idArrendatario = req.params.idarrendatario;
    let desde = req.params.desde;
    desde = Number(desde);

    console.log('ID ARRENDATARIO ' + idArrendatario)


      const visita = await visitaModel.find({ usuarioarrendatario: { $in: idArrendatario } })
        .populate('usuarioarrendatario', 'nombre apellido imagen correo movil cedula')
        .populate('inmueble')
        .skip(desde)
        .limit(6)
        .exec(async(err, visitas) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando visita",
              errors: err,
            });
          }

          await visitaModel.countDocuments({ usuarioarrendatario: { $in: idArrendatario } }, (err, conteo) => {

            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error contando usuarios",
                errors: err,
              });
            }

            //console.log('VISITAS ' + visitas)
            res.status(200).json({
              ok: true,
              visitas: visitas,
              total: conteo
            });
          });
        });
  },
}