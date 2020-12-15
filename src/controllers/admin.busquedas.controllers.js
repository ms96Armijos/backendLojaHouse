let express = require("express");
let app = express();

const { mongo: { inmuebleModel, usuarioModel, visitaModel, servicioModel, contratoModel } } = require('../../databases');

//BUSQUEDAS ESPECIFICAS
module.exports = {

  buscarPorColeccion: (req, res) => {
    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    let expresionRegular = new RegExp(busqueda, "i");
    let auth = req.params.idusuario;
    let rol = req.usuario.rol;


    let desde = req.params.desde;
    desde = Number(desde);


    let promesa;

    switch (tabla) {
      case "arrendador":
        promesa = buscarUsuariosArrendadores(busqueda, expresionRegular, desde);
        break;
      case "arrendatario":
        promesa = buscarUsuariosArrendatarios(busqueda, expresionRegular, desde);
        break;
      case "visitas":
        promesa = buscarVisitas(busqueda, expresionRegular, auth, desde);
        break;
      case "inmuebles":
        promesa = buscarInmuebles(busqueda, expresionRegular, auth, rol, desde);
        break;

      case "servicios":
        promesa = buscarServicios(busqueda, expresionRegular, auth);
        break;

      case "contratos":
        promesa = buscarContratos(busqueda, expresionRegular, auth, desde);
        break;

      case "arrendatariocontratos":
        promesa = buscarContratosArrendatario(busqueda, expresionRegular, auth, desde);
        break;

      case "visitasarrendatario":
        promesa = buscarVisitasArrendatario(busqueda, expresionRegular, auth, desde);
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
}

function buscarInmuebles(busqueda, expresionRegular, auth, rol, desde) {
  return new Promise(async (resolve, reject) => {

    if (rol == 'ADMINISTRADOR') {
      console.log('adm')
      inmuebleModel.find({ nombre: expresionRegular, usuario: auth })
        .populate("usuario", "nombre apellido correo")
        .skip(desde)
        .limit(6).
        exec((err, inmuebles) => {
          if (err) {
            reject("Error al cargar Inmuebles", err);
          } else {
            resolve(inmuebles);
          }
        });
    }
  });
}

function buscarVisitas(busqueda, expresionRegular, auth, desde) {
  return new Promise(async (resolve, reject) => {

    const inmueble = await inmuebleModel.find({ usuario: { $in: auth } });


    if (inmueble) {
      await visitaModel.find({ inmueble: { $in: inmueble } })
        .or([{ descripcion: expresionRegular }, { estado: expresionRegular }])
        .populate("usuarioarrendatario", " nombre imagen apellido correo")
        .populate("inmueble", "nombre descripcion tipo direccion precioalquiler")
        .skip(desde)
        .limit(6)
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

function buscarVisitasArrendatario(busqueda, expresionRegular, auth, desde) {
  return new Promise(async (resolve, reject) => {


    console.log('visitas')

      await visitaModel.find({ usuarioarrendatario: { $in: auth } })
        .or([{ descripcion: expresionRegular }, { estado: expresionRegular }])
        .populate("usuarioarrendatario", " nombre imagen apellido correo")
        .populate("inmueble", "nombre descripcion tipo direccion precioalquiler")
        .skip(desde)
        .limit(6)
        .exec((err, visitas) => {
          if (err) {
            reject("Error al cargar Visitas", err);
          } else {
            resolve(visitas);
          }
        });
  });
}




function buscarUsuariosArrendadores(busqueda, expresionRegular, desde) {

  return new Promise((resolve, reject) => {
    
    usuarioModel.find({rol: { $in: 'ARRENDADOR' }}, "correo nombre apellido movil estado rol imagen")
      .or([{ correo: expresionRegular }, { nombre: expresionRegular }, { apellido: expresionRegular }, { estado: expresionRegular }, { rol: expresionRegular }])
      .skip(desde)
      .limit(6)
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al cargar los usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

function buscarUsuariosArrendatarios(busqueda, expresionRegular, desde) {

  return new Promise((resolve, reject) => {
    usuarioModel.find({rol: { $in: 'ARRENDATARIO' }}, "correo nombre apellido movil estado rol imagen")
      .or([{ correo: expresionRegular }, { nombre: expresionRegular }, { apellido: expresionRegular }, { estado: expresionRegular }, { rol: expresionRegular }])
      .skip(desde)
      .limit(6)
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al cargar los usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

function buscarServicios(busqueda, expresionRegular ) {
  return new Promise((resolve, reject) => {
    servicioModel.find({ nombre: expresionRegular })
    .exec((err, servicios) => {
        if (err) {
          reject("Error al cargar Servicios", err);
        } else {
          resolve(servicios);
        }
      });
  });
}

function buscarContratos(busqueda, expresionRegular, auth, desde) {
  return new Promise((resolve, reject) => {
    contratoModel.find({ nombrecontrato: expresionRegular, usuarioarrendador: auth })
      .populate('usuarioarrendatario', " nombre")
      .populate('inmueble', " tipo")
      .skip(desde)
      .limit(6)
      .exec((err, contratos) => {
        if (err) {
          reject("Error al cargar Contratos", err);
        } else {
          resolve(contratos);
        }
      });
  });
}


function buscarContratosArrendatario(busqueda, expresionRegular, auth, desde) {
  return new Promise((resolve, reject) => {
    contratoModel.find({ usuarioarrendatario: { $in: auth } })
    .or([{ nombrecontrato: expresionRegular }])
    .skip(desde)
    .limit(6)
    .exec((err, contratos) => {
        if (err) {
          reject("Error al cargar Contratos", err);
        } else {
          resolve(contratos);
        }
      });
  });
}
