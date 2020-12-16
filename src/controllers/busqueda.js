let express = require("express");
let app = express();

const {mongo: {inmuebleModel, usuarioModel, visitaModel, servicioModel, contratoModel } } = require('../../databases');

//BUSQUEDAS ESPECIFICAS
module.exports= {

    buscarPorColeccion: (req, res) => {
        let busqueda = req.params.busqueda;
        let tabla = req.params.tabla;
        let expresionRegular = new RegExp(busqueda, "i");
        let auth = req.usuario._id;
        let rol = req.usuario.rol;
      
        let promesa;
      
        switch (tabla) {
          case "usuarios":
            promesa = buscarUsuarios(busqueda, expresionRegular);
            break;
          case "visitas":
            promesa = buscarVisitas(busqueda, expresionRegular, auth);
            break;
          case "inmuebles":
            promesa = buscarInmuebles(busqueda, expresionRegular, auth, rol);
            break;
      
          case "servicios":
            promesa = buscarServicios(busqueda, expresionRegular, auth);
            break;
      
          case "contratos":
            promesa = buscarContratos(busqueda, expresionRegular, auth);
            break;

            case "contratosarrendatario":
            promesa = buscarContratosArrendatario(busqueda, expresionRegular, auth);
            break;

      
          case "visitasarrendatario":
            promesa = buscarVisitasArrendatario(busqueda, expresionRegular, auth);
            break;
      
          default:
            return res.status(400).json({
              ok: false,
              mensaje: "Los tipos de búsqueda son: usuarios, visitas, inmuebles, servicios",
              error: { message: "Tipo de colección no válida" },
            });
        }
      
        promesa.then((data) => {
          res.status(200).json({
            ok: true,
            [tabla]: data,
          });
        });
      },
      busquedaGeneral: (req, res, next) => {
        let busqueda = req.params.busqueda;
        let expresionRegular = new RegExp(busqueda, "i");
      
        Promise.all([
          buscarInmuebles(busqueda, expresionRegular, auth, rol),
          buscarVisitas(busqueda, expresionRegular, auth),
          buscarUsuarios(busqueda, expresionRegular),
          buscarServicios(busqueda, expresionRegular, auth),
          buscarContratos(busqueda, expresionRegular, auth),
          buscarVisitasArrendatario(busqueda, expresionRegular, auth),
        ])
          .then((respuestas) => {
            res.status(200).json({
              ok: true,
              inmuebles: respuestas[0],
              visitas: respuestas[1],
              usuarios: respuestas[2],
              servicios: respuesta[3],
              contratos: respuesta[4],
              visitasarrendatario: respuesta[5],
            });
          })
          .catch((err)=>{
            console.log(err)
          });
      }

    }
    
    function buscarInmuebles(busqueda, expresionRegular, auth, rol) {
      return new Promise((resolve, reject) => {
        
        if(rol == 'ARRENDADOR'){
          console.log('hola '+ rol)
          inmuebleModel.find({ usuario: { $in: auth}})
          .or([{ estado: expresionRegular }, { nombre: expresionRegular }])
          .populate("usuario", "nombre apellido correo _id")
          .exec((err, inmuebles) => {
            console.log(inmuebles)
            if (err) {
              reject("Error al cargar Inmuebles", err);
            } else {
              resolve(inmuebles);
            }
          });
        }
        if(rol == 'ARRENDATARIO'){
          console.log('hola '+ rol)

          console.log('arrendatario')
          inmuebleModel.find({$and: [
            { nombre: { $in: expresionRegular } },
            { estado: { $in: 'DISPONIBLE' } },
          ]})
          .populate("usuario", "nombre apellido correo")
          .exec((err, inmuebles) => {
            if (err) {
              reject("Error al cargar Inmuebles", err);
            } else {
              resolve(inmuebles);
            }
          });
        }
      });
    }
    
    function buscarVisitas(busqueda, expresionRegular, auth) {
      return new Promise(async (resolve, reject) => {
    
        const inmueble = await inmuebleModel.find({usuario: { $in: auth}});
    
        if(inmueble){
           await visitaModel.find({inmueble: { $in: inmueble}}) 
           .or([{ descripcion: expresionRegular }, { estado: expresionRegular }])
          .populate("usuarioarrendatario", " nombre imagen apellido correo")
          .populate("inmueble","nombre descripcion tipo direccion precioalquiler estado")
          .exec((err, visitas) => {
            if (err) {
              reject("Error al cargar Visitas", err);
            } else {
              resolve(visitas);
            }
          });      
        }
      });
    }
    
    function buscarVisitasArrendatario(busqueda, expresionRegular, auth) {
      return new Promise((resolve, reject) => {
    
           visitaModel.find({usuarioarrendatario: {$in: auth}}) 
           .or([{ estado: expresionRegular }, {descripcion: expresionRegular}])
          .exec((err, visitasarrendatario) => {
            if (err) {
              reject("Error al cargar Visitas", err);
            } else {
              resolve(visitasarrendatario);
            }
          });      
        
      });
    }
    
    function buscarUsuarios(busqueda, expresionRegular) {
            return new Promise((resolve, reject) => {
              usuarioModel.find({}, "correo nombre apellido movil estado rol imagen")
                .or([{ correo: expresionRegular }, { nombre: expresionRegular }, { apellido: expresionRegular }, { estado: expresionRegular }, { rol: expresionRegular }])
                .exec((err, usuarios) => {
                  if (err) {
                    reject("Error al cargar los usuarios", err);
                  } else {
                    resolve(usuarios);
                  }
                });
            });
    }
    
    function buscarServicios(busqueda, expresionRegular, auth) {
      return new Promise((resolve, reject) => {
        servicioModel.find({ nombre: expresionRegular})
          .exec((err, servicios) => {
            if (err) {
              reject("Error al cargar Servicios", err);
            } else {
              resolve(servicios);
            }
          });
      });
    }
    
    function buscarContratos(busqueda, expresionRegular, auth) {
      return new Promise((resolve, reject) => {
        contratoModel.find({nombrecontrato: expresionRegular, usuarioarrendador: auth})
          .exec((err, contratos) => { 
            if (err) {
              reject("Error al cargar Contratos", err);
            } else {
              resolve(contratos);
            }
          });
      });
    }


    function buscarContratosArrendatario(busqueda, expresionRegular, auth) {
      return new Promise((resolve, reject) => {
        contratoModel.find({nombrecontrato: expresionRegular, usuarioarrendatario: auth})
          .exec((err, contratos) => { 
            if (err) {
              reject("Error al cargar Contratos", err);
            } else {
              resolve(contratos);
            }
          });
      });
    }


    

