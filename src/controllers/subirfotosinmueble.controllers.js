let express = require('express'),
  multer = require('multer'),
  router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { mongo: { inmuebleModel } } = require('../../databases');

// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let id = req.params.id;
    let path = `./public/inmuebles/${id}`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

var upload = multer({
  storage: storage,
   limits: {
     fileSize: 1024 * 1024 * 3
   },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Solo se permiten formatos: .png, .jpg, .jpeg'));
    }
  }
});

//ACTUALIZA Y ELIMINA, ACA ES PARA PODER ENVIAR LA LISTA DE IMAGENES Q SE CAPTURAN EN EL FRONT
//AHI ESTA LA OPCION DE ELIMINAR O CARGAR MAS IMAGENES
router.put("/actualizar/fotos/inmueble/:id", upload.array('imagen', 6), async (req, res) => {
    let id = req.params.id;
    const reqFiles = []
  
    const url = req.protocol + '://' + req.get('host');

    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + `/public/inmuebles/${id}/` + req.files[i].filename)
    }
    
    console.log('ID: '+ url)
    
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

      const diferenciaDeArreglos = (arr1, arr2) => {
        return arr1.filter(elemento => arr2.indexOf(elemento) == -1);
      }
  
  
      const result = diferenciaDeArreglos(inmueble.imagen, reqFiles);
      console.log('diferencia: '+ result);

      for (let i = 0; i < result.length; i++) {

        let separoLaCadena = result[i].split('/');
        let obtengoSoloElNombre  = separoLaCadena[separoLaCadena.length - 1]
        console.log('errrr: '+ obtengoSoloElNombre);
  
        await fs.unlink(path.resolve(`./public/inmuebles/${id}/` + obtengoSoloElNombre));
  
      }

      inmueble.imagen = null;
      inmueble.imagen = reqFiles;
      console.log('DB: '+reqFiles)



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
  });

  router.get("/:id", (req, res, next) => {
    inmuebleModel.findById(req.params.id).then(data => {
      res.status(200).json({
        message: "¡Imágenes obtenidas con éxito!",
        inmueble: data
      });
    });
  });



module.exports = router;
