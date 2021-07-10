const { mongo: { usuarioModel } } = require("../../databases");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


module.exports = {

  obtenerImagen: (req, res, next) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
      res.sendFile(pathImagen);
    } else {
      let pathInvalido = path.resolve(__dirname, '../../assets/no-img.jpg');
      res.sendFile(pathInvalido);
    }
  },

  actualizarImagen: async(req, res, next) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    //TIPOS DE COLECCION
    let tiposValidos = ["usuarios", "inmuebles"];

    if (tiposValidos.indexOf(tipo) < 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "Tipo de colección no es válida",
        errors: { message: "Los tipos válidos son " + tiposValidos.join(", ") },
      });
    }

    if (!req.files) {
      return res.status(400).json({
        ok: false,
        mensaje: "No seleccionó ninguna imagen",
        errors: { message: "Debe seleccionar una imagen" },
      });
    }

    //OBTENER NOMBRE DEL ARCHIVO
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split(".");
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ["png", "jpg", "jpeg"];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "Extensión no válida",
        errors: {
          message: "Las extensiones válidas son " + extensionesValidas.join(", "),
        },
      });
    }

    //NOMBRE DEL ARCHIVO PERSONALIZADO
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //MOVER EL ARCHIVO DEL TEMPORAL A UN PATH ESPECIFICO
    try {
        fs.mkdirsSync(`./uploads/${tipo}`);
    } catch (error) {
      console.log(error)
    }
    let path = `./uploads/${tipo}/${nombreArchivo}`;

    
    
     archivo.mv(path, async(err) => {
      
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al mover archivo",
          errors: { message: err },
        });
      }
      
      console.log('path moved: '+path);

      await cloudinary.v2.uploader.upload(path, { folder : "usuario/"+id}, async(err, imagen) => {
        const generarImagen = {
          "url": imagen.url,
          "public_id": imagen.public_id,
          "pathlocal":  path
        };
        console.log('IMG GENERATE: '+generarImagen.public_id)
        nombreArchivo = generarImagen
      });

      subirFotoPorTipo(tipo, id, nombreArchivo, res);

      /* res.status(200).json({
        ok: true,
        mensaje: "Archivo movido",
        extensionArchivo: extensionArchivo,
      });*/
    });
  }
}

function subirFotoPorTipo(tipo, id, nombreArchivo, res) {
  
  if (tipo === 'usuarios') {
    usuarioModel.findById(id, async(err, usuario) => {




      console.log(usuario.password)
      if (!usuario) {
        return res.status(400).json({
          ok: true,
          mensaje: "Usuario no existe",
          errors: { message: 'Usuario no existe en la Base de Datos' },
        });
      }

        for (let i = 0; i < usuario.imagen.length; i++) {
          let url =  usuario.imagen[i].public_id
        console.log('url: '+usuario.imagen[i].url)
        await cloudinary.v2.uploader.destroy(url, async(err, result) => {
          
          })
          
        }

      let pathViejo = './uploads/usuarios/' + usuario.imagen;
      console.log('imagen ' + pathViejo);
      //si existe imagen, la borra
      //if (fs.existsSync(pathViejo)) {
        console.log('eliminando ' + pathViejo);
        fs.unlinkSync(nombreArchivo.pathlocal);
     // }
     
  

      usuario.imagen = nombreArchivo;
      console.log('nueva foto ' + usuario.imagen);


      usuario.save((err, usuarioActualizado) => {

      


        usuarioActualizado.password = ':)';
        console.log(usuarioActualizado)
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de usuario actualizada",
          usuario: usuarioActualizado,
        });
      });
    });
  }
  if (tipo === "inmuebles") {
  }
}