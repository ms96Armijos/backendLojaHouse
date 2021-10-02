const { mongo: { contratoModel } } = require('../../databases');

module.exports = {

  //FALTA IMPLEMENTAR EL TOKEN
    obtenerContratosAdminArrendador: async(req, res, next) => {
        let idUsuario = req.params.idusuario;
        let desde = req.params.desde;
        desde = Number(desde);
      
        await contratoModel.find({usuarioarrendador: idUsuario})
        .populate('usuarioarrendatario', 'nombre apellido correo imagen')
        .populate('usuarioarrendador', 'nombre apellido correo imagen')
        .populate('inmueble')
        .skip(desde)
        .limit(6)
        .sort({'updatedAt': -1})
        .exec(async(err, contratos) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando contrato",
              errors: err,
            });
          }
      
        await  contratoModel.countDocuments({usuarioarrendador: idUsuario}, (err, conteo) => {
      
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
              total: conteo
            });
          });
        });
      },

    obtenerContratosAdminArrendatario: async(req, res, next) => {
      let idUsuario = req.params.idusuario;
      let desde = req.params.desde;
      desde = Number(desde);
    
      await contratoModel.find({usuarioarrendatario: idUsuario})
      .populate('usuarioarrendatario', 'nombre apellido correo imagen')
      .populate('usuarioarrendador', 'nombre apellido correo imagen')
      .populate('inmueble')
      .skip(desde)
      .limit(6)
      .sort({'updatedAt': -1})
      .exec(async(err, contratos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error cargando contrato",
            errors: err,
          });
        }
    
      await  contratoModel.countDocuments({usuarioarrendatario: idUsuario}, (err, conteo) => {
    
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
            total: conteo
          });
        });
      });
    },
}