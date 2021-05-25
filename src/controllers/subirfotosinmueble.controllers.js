let express = require('express'),
  multer = require('multer'),
  router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { mongo: { inmuebleModel, imagenModel } } = require('../../databases');

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
    const finalImage = []
    const pathsLocal = []
    const pathsInmueble = []
  
    const url = req.protocol + '://' + req.get('host');

    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + `/public/inmuebles/${id}/` + req.files[i].filename)
         pathsLocal.push(req.files[i].path)
        console.log(req.files[i].path)
        await cloudinary.v2.uploader.upload(req.files[i].path, async(err, imagen) => {

          const generarImagen = {
            "_id": uuidv4(),
            "url": imagen.url,
            "inmueble": id,
            "public_id": imagen.public_id
          };

          /*const newImage = new imagenModel({
            url: imagen.url,
            inmueble: id,
            public_id: imagen.public_id
          })*/
          finalImage.push(generarImagen)
        });
        
    }
    
    
    console.log('ID: '+ url)
    console.log(reqFiles);
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

      /*const diferenciaDeArreglos = (arr1, arr2) => {
        return arr1.filter(elemento => arr2.indexOf(elemento) == -1);
      }*/
  
  
      /*const result = diferenciaDeArreglos(inmueble.imagen, reqFiles);
      console.log('diferencia: '+ result);*/

      /*for (let i = 0; i < result.length; i++) {

        let separoLaCadena = result[i].split('/');
        let obtengoSoloElNombre  = separoLaCadena[separoLaCadena.length - 1]
        console.log('errrr: '+ obtengoSoloElNombre);
  
        await fs.unlink(path.resolve(`./public/inmuebles/${id}/` + obtengoSoloElNombre));
  
      }*/

      for (let m = 0; m < finalImage.length; m++) {
        pathsInmueble.push(finalImage[m])
      }


      
      if(inmueble.imagen.length>0){
        inmueble.imagen.forEach(element => {
          pathsInmueble.push(element);
        });
      }

      inmueble.imagen = null;
      inmueble.imagen = pathsInmueble;
      //console.log('DB: '+finalImage)

     await inmueble.save( async(err, inmuebleGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar el inmueble",
            errors: err,
          });
        }

        /*finalImage.forEach(element => {

           element.save( (err, img) => {
            
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error al actualizar el inmueble",
                errors: err,
              });
            }
          });
        });*/

        for (let i = 0; i < pathsLocal.length; i++) {
          await fs.unlink(pathsLocal[i])
          
        }
        await fs.rmdir(`./public/inmuebles/${id}`);
  
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

//OBTENER IMAGENES A PARTIR DEL MODELO
/*router.get("/photo/inmueble/:id", async(req, res)=>{
  let id = req.params.id;
  await imagenModel.find({ inmueble: { $in: id } }, async (err, imagenes) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al obtener imágenes",
        errors: err,
      });
    }

    if (!imagenes) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existen imágenes",
        errors: { message: "No existen imágenes" },
      });
    }
    res.status(200).json({
      message: "¡Imágenes obtenidas con éxito!",
      image: imagenes
    });
  });
});*/


  /*OBTENER TODAS LAS IMAGENES*/
  /*router.get("/images/inmueble", async(req, res)=>{
    await imagenModel.find({ })
    .exec((err, imagenes) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al obtener imágenes",
          errors: err,
        });
      }

      if (!imagenes) {
        return res.status(400).json({
          ok: false,
          mensaje: "No existen imágenes",
          errors: { message: "No existen imágenes" },
        });
      }
      res.status(200).json({
        message: "¡Imágenes obtenidas con éxito!",
        image: imagenes
      });
    });
  });*/


  router.delete("/photo/inmueble/:id", async(req, res)=>{
    let id = req.params.id;

    await cloudinary.v2.uploader.destroy(id, (err, result) => {
      console.log(result); // { result: 'ok' }

      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al eliminar imágen",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: "El inmueble ha sido actualizado correctamente",
      });

      });
  });



  
  router.put("/photo-update/:id/inmueble", async(req, res)=>{
    let id = req.params.id;
    let pathImagenes = []
    let pathTemporales = []

    await inmuebleModel.findById(id, async(err, inmuebleEncontrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al obtener inmueble",
          errors: err,
        });
      }

      
      if (!inmuebleEncontrado) {
        return res.status(400).json({
          ok: false,
          mensaje: "No existe el inmueble con ese ID",
          errors: { message: "No existe el inmueble con ese ID" },
        });
      }


    const posicion = inmuebleEncontrado.imagen.indexOf(id);
    let elementoEliminado = inmuebleEncontrado.imagen.splice(posicion, 1)
    console.log(inmuebleEncontrado.imagen)
    

      //console.log(inmuebleEncontrado)



      await inmuebleEncontrado.save( async(err, inmuebleGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar el inmueble",
            errors: err,
          });
        }
        
        console.log(inmuebleGuardado)

        res.status(200).json({
          ok: true,
          inmueble: inmuebleGuardado,
          mensaje: "El inmueble ha sido actualizado correctamente",
        });
      });

    });
  
  });




//ELIMINAR EN LA BD LA REFERENCIA A LA IMAGEN (FUNCIOONA CON UN OBJETO)
  /*router.put("/photo-update/:id/inmueble", async(req, res)=>{
    let id = req.params.id;
    let pathImagenes = []
    let pathTemporales = []


    await imagenModel.findById(id, async(err, imagenEncontrada) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al obtener imágen",
          errors: err,
        });
      }

      if (!imagenEncontrada) {
        return res.status(400).json({
          ok: false,
          mensaje: "No existe la imágen con ese ID",
          errors: { message: "No existe la imágen con ese ID" },
        });
      }

      await inmuebleModel.findById(imagenEncontrada.inmueble, async(err, inmuebleEncontrado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al obtener inmueble",
            errors: err,
          });
        }

        
        if (!inmuebleEncontrado) {
          return res.status(400).json({
            ok: false,
            mensaje: "No existe el inmueble con ese ID",
            errors: { message: "No existe el inmueble con ese ID" },
          });
        }


      const posicion = inmuebleEncontrado.imagen.indexOf(id);
      let elementoEliminado = inmuebleEncontrado.imagen.splice(posicion, 1)
      console.log(inmuebleEncontrado.imagen)
      

        //console.log(inmuebleEncontrado)

 
  
        await inmuebleEncontrado.save( async(err, inmuebleGuardado) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al actualizar el inmueble",
              errors: err,
            });
          }
          
          console.log(inmuebleGuardado)

          res.status(200).json({
            ok: true,
            inmueble: inmuebleGuardado,
            mensaje: "El inmueble ha sido actualizado correctamente",
          });
        });
  
      });



    });


  
  });*/


module.exports = router;

