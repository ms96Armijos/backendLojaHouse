const express = require('express');
const app = express();
const { port } = require('./config');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const compression = require('compression');
var fs = require('fs');

//let fileUpload = require("express-fileupload");

const setHeadersOnStatic = (res, path, stat) => {
  const type = mime.getType(path);
  res.set('content-type', type);
}

const staticOptions = {
  setHeaders: setHeadersOnStatic
}

app.use('/public', express.static(path.join(__dirname, 'public'), staticOptions));

// create a write stream (in append mode)
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

//CORS para permitir la comunicación entre varios servidores
app.use(cors());
//middleware body-parser desde express
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//middleware morgan para ver donde navega mi aplicación
// log only 4xx and 5xx responses to console
app.use(morgan('dev'))
   
  // log all requests to access.log
  app.use(morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  }))
//middleware para seguridad de mi servidor
app.use(helmet());
//compresión
app.use(compression());
//para imagenes
//app.use(fileUpload());


//REQUIERO DE LOS ARCHIVOS DONDE DEFINO LAS RUTAS
const rutaServicio = require('./src/routes/servicio.routes');
const rutaInmueble = require('./src/routes/inmueble.routes');
const rutaUsuario = require('./src/routes/usuario.routes');
const rutaVisita = require('./src/routes/visita.routes');
const rutaContrato = require('./src/routes/contrato.routes');
const rutaLogin = require('./src/routes/login.routes');
const rutaImagenes = require('./src/routes/imagenes.routes');
const rutaBusqueda = require('./src/routes/busqueda.routes');
const rutaMensaje = require('./src/routes/mensaje.routes');


const rutaEnviarNotificaciones = require('./src/routes/enviar.notificaciones.routes');




//RUTAS PARA EL ADMINISTRADOR-ARRENDADOR
const rutaInmueblesAdminArrendador = require('./src/routes/admin.inmuebles.routes');
const rutaVisitasAdminArrendador = require('./src/routes/admin.visitas.routes');
const rutaContratosAdminArrendador = require('./src/routes/admin.contratos.routes');
const rutaAdminBusquedas = require('./src/routes/admin.busquedas.routes');

const rutaSubirFotosInmueble = require('./src/controllers/subirfotosinmueble.controllers');
const rutaSubirFotoPerfil = require('./src/controllers/imagenes.controllers-copy');




//USO LAS RUTAS
app.use('/usuario', rutaUsuario);
app.use('/inmueble', rutaInmueble);
app.use('/servicio', rutaServicio);
app.use('/visita', rutaVisita);
app.use('/contrato', rutaContrato);
app.use('/login', rutaLogin);
app.use('/img', rutaImagenes);
app.use('/busqueda', rutaBusqueda);

app.use('/mensaje', rutaMensaje);

app.use('/enviarnotificaciones', rutaEnviarNotificaciones);


//RUTAS ADMINISTRADOR-ARRENDADOR
app.use('/admin/inmueble', rutaInmueblesAdminArrendador);
app.use('/admin/visita', rutaVisitasAdminArrendador);
app.use('/admin/contrato', rutaContratosAdminArrendador);
app.use('/admin/busqueda', rutaAdminBusquedas);


app.use('/fotosinmueble', rutaSubirFotosInmueble);
app.use('/img', rutaSubirFotoPerfil);



app.listen(port, () => {
    console.log("Servidor de express en el puerto 3000: \x1b[32m%s\x1b[0m",
    "online");
})