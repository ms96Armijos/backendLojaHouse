let express = require('express'),
  multer = require('multer'),
  router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { mongo: { usuarioModel } } = require("../../databases");
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
    let path = `./public/usuarios/${id}`;
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
router.put("/:tipo/:id", upload.array('imagen', 1), async (req, res) => {
  let id = req.params.id;
  const reqFiles = []
  const finalImage = []
  const pathsLocal = []
  const pathsInmueble = []

  const url = req.protocol + '://' + req.get('host');

  for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + `/public/usuarios/${id}/` + req.files[i].filename)
       pathsLocal.push(req.files[i].path)
      console.log(req.files[i].path)
      await cloudinary.v2.uploader.upload(req.files[i].path, { folder : "usuario/"+id}, async(err, imagen) => {

        const generarImagen = {
          "_id": uuidv4(),
          "url": imagen.url,
          "public_id": imagen.public_id
        };
        finalImage.push(generarImagen)
      });
      
  }
  
  console.log('ID: '+ url)
  console.log(reqFiles);
  await usuarioModel.findById(id, async (err, usuario) => {

      if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id: " + id + " no existe",
        errors: { message: "No existe un usuario con ese ID" },
      });
    }

    for (let m = 0; m < finalImage.length; m++) {
      pathsInmueble.push(finalImage[m])
    }
    
    if(usuario.imagen.length>0){
      usuario.imagen.forEach(element => {
        pathsInmueble.push(element);
      });
    }

    usuario.imagen = null;
    usuario.imagen = pathsInmueble;

   await usuario.save( async(err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el usuario",
          errors: err,
        });
      }

     


      for (let i = 0; i < pathsLocal.length; i++) {
        await fs.unlink(pathsLocal[i])
        
      }
      await fs.rmdir(`./public/usuarios/${id}`);

      
      let urlDeleteImage = usuario.url;
      await cloudinary.v2.uploader.destroy(urlDeleteImage, async(err, result) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al eliminar imágen",
            errors: err,
          });
        }
      });


      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado,
        mensaje: "El usuario ha sido actualizado correctamente",
      });
    });
  });
});


module.exports = router;






