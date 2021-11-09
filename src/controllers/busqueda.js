let express = require("express");
let app = express();

const {mongo: {inmuebleModel, usuarioModel, visitaModel, servicioModel, contratoModel, mensajeModel, tipoInmuebleModel } } = require('../../databases');

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

            case "tipoinmueble":
              promesa = buscarTipoInmueble(busqueda, expresionRegular, auth);
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
              mensaje: "Los tipos de búsqueda son: usuarios, visitas, inmuebles, servicios, tipoinmueble",
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
          buscarTipoInmueble(busqueda, expresionRegular, auth),
        ])
          .then((respuestas) => {
            res.status(200).json({
              ok: true,
              inmuebles: respuestas[0],
              visitas: respuestas[1],
              usuarios: respuestas[2],
              servicios: respuestas[3],
              contratos: respuestas[4],
              visitasarrendatario: respuestas[5],
              tipoinmueble: respuestas[6],
            });
          })
          .catch((err)=>{
            console.log(err)
          });
      },


      busquedaAnidada: (req, res) => {
        let tabla = req.params.tabla;

        let termminoUbicacion = req.params.ubicacion;
        let termminoTipoInmueble = req.params.tipo;
        let termminoPrecio = req.params.precio;

        console.log(termminoPrecio);

        let primerPrecio = termminoPrecio.split('-')[0];
        let segundoPrecio = termminoPrecio.split('-')[1];

        let expresionRegularUbicacion = new RegExp(termminoUbicacion, "i");
        let expresionRegularTipoInmueble = new RegExp(termminoTipoInmueble, "i");

        let promesa;
      
        switch (tabla) {
          case "inmuebles":
            promesa = buscarInmueblesPrincipal(expresionRegularTipoInmueble, expresionRegularUbicacion, primerPrecio, segundoPrecio);
            break;

          default:
            return res.status(400).json({
              ok: false,
              mensaje: "Los tipos de búsqueda son: inmuebles",
              error: { message: "Tipo de colección no válida" },
            });
        }
      
        promesa.then((data) => {
          res.status(200).json({
            [tabla]: data,
          });
        });
      },

      buscarMensajes: (req, res) => {
        let tabla = req.params.tabla;
        let busqueda = req.params.busqueda;

        let desde = req.params.desde;
        desde = Number(desde);

        let expresionRegularBusqueda = new RegExp(busqueda, "i");

        let promesa;
      
        switch (tabla) {
          case "mensajes":
            promesa = buscarMensajes(expresionRegularBusqueda, desde);
            break;

          default:
            return res.status(400).json({
              ok: false,
              mensaje: "Los tipos de búsqueda son: mensajes",
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

    }
    
    function buscarInmuebles(busqueda, expresionRegular, auth, rol) {
      return new Promise((resolve, reject) => {
        if(rol == 'ARRENDADOR'){
          console.log('hola '+ rol)
          inmuebleModel.find({ $and: [{ usuario: { $in: auth} }, { estado: {$in: 'DISPONIBLE'} }, { estado: {$ne: 'ELIMINADO'} }]})
          .or([{ nombre: expresionRegular }, { estado: expresionRegular }])
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
            { estado: { $in: 'DISPONIBLE' }, estado: {$ne: 'ELIMINADO'} },
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
    
           visitaModel.find({
            $and: [
              { usuarioarrendatario: {$in: auth} },
               { estado: { $ne: 'ELIMINADA' } },
             ] 
            
            }) 
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
                .sort({'updatedAt': -1})
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
        .sort({'updatedAt': -1})
          .exec((err, servicios) => {
            if (err) {
              reject("Error al cargar Servicios", err);
            } else {
              resolve(servicios);
            }
          });
      });
    }

    function buscarTipoInmueble(busqueda, expresionRegular, auth) {
      return new Promise((resolve, reject) => {
        tipoInmuebleModel.find({ nombre: expresionRegular})
        .sort({'updatedAt': -1})
          .exec((err, tipoinmueble) => {
            if (err) {
              reject("Error al cargar el tipo de inmueble", err);
            } else {
              resolve(tipoinmueble);
            }
          });
      });
    }
    
    function buscarContratos(busqueda, expresionRegular, auth) {
      return new Promise((resolve, reject) => {
        contratoModel.find({usuarioarrendador: auth})
        .or([{ nombrecontrato: expresionRegular }, {estado: expresionRegular}])
        .populate('usuarioarrendatario', " nombre")
      .populate('inmueble', " tipo")
      .sort({'updatedAt': -1})
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
        contratoModel.find({ usuarioarrendatario: auth})
        .or([{ nombrecontrato: expresionRegular }, {estado: expresionRegular}])
        .sort({'updatedAt': -1})
          .exec((err, contratos) => { 
            if (err) {
              reject("Error al cargar Contratos", err);
            } else {
              resolve(contratos);
            }
          });
      });
    }

    


    function buscarInmueblesPrincipal(expresionRegularTipoInmueble, expresionRegularUbicacion, primerPrecio, segundoPrecio) {

      //console.log(expresionRegularPrecio)
     

      return new Promise((resolve, reject) => {
      
        //REALIZO LA BÚSQUEDA SI MIS PRECIOS DE ALQUILER SON MAYORES A 0
       if(primerPrecio > 0 && segundoPrecio > 0){
         console.log('iguales')
        inmuebleModel.find({})
        .populate('usuario', 'nombre correo')
        .and([{ estado: { $ne : 'ELIMINADO'}}, { publicado: { $ne : 'PRIVADO'}}])
        .and([{ tipo: expresionRegularTipoInmueble }, { barrio: expresionRegularUbicacion }, { precioalquiler: { $gte : primerPrecio , $lte : segundoPrecio}}])
        .sort({'updatedAt': -1})
        .exec((err, inmuebles) => {
          console.log(inmuebles)
          if (err) {
            reject("Error al cargar Inmuebles", err);
          } 
          if(!inmuebles){
            reject("No existen inmuebles", err);
          }
          else {
            resolve(inmuebles);
          }
        });
       }
        //REALIZO LA BÚSQUEDA SI SON PRECIOS MENORES A 50
       else if(primerPrecio == 0 && segundoPrecio > 0){
         console.log('segundo mayor')
        inmuebleModel.find({})
        .populate('usuario', 'nombre correo')
        .and([{ estado: { $ne : 'ELIMINADO'}}, { publicado: { $ne : 'PRIVADO'}}])
        .and([{ tipo: expresionRegularTipoInmueble }, { barrio: expresionRegularUbicacion }, { precioalquiler: { $lte : segundoPrecio}}])
        .sort({'updatedAt': -1})
        .exec((err, inmuebles) => {
          console.log(inmuebles)
          console.log(inmuebles)
          if (err) {
            reject("Error al cargar Inmuebles", err);
          } 
          if(!inmuebles){
            reject("No existen inmuebles", err);
          }
          else {
            resolve(inmuebles);
          }
        });
       }
        //REALIZO LA BÚSQUEDA SI SON PRECIOS MAYORES A 200
       else if(primerPrecio > 0 && segundoPrecio == 0){
        console.log('PRIMERO mayor')

       inmuebleModel.find({})
       .populate('usuario', 'nombre correo')
       .and([{ estado: { $ne : 'ELIMINADO'}}, { publicado: { $ne : 'PRIVADO'}}])
       .and([{ tipo: expresionRegularTipoInmueble }, { barrio: expresionRegularUbicacion }, { precioalquiler: { $gt : primerPrecio}}])
       .sort({'updatedAt': -1})
       .exec((err, inmuebles) => {
         console.log(inmuebles)
         console.log(inmuebles)
         if (err) {
           reject("Error al cargar Inmuebles", err);
         } 
         if(!inmuebles){
           reject("No existen inmuebles", err);
         }
         else {
           resolve(inmuebles);
         }
       });
      }


    });

    }

    function buscarMensajes(expresionRegular, desde) {

      return new Promise((resolve, reject) => {
        
        mensajeModel.find({estado: {$ne: 'ELIMINADO'}})
          .or([{ estado: expresionRegular }])
          .skip(desde)
          .limit(6)
          .sort({'updatedAt': -1})
          .exec((err, mensajes) => {
            if (err) {
              reject("Error al cargar los mensajes", err);
            } else {
              resolve(mensajes);
            }
          });
      });
    }
    
    

