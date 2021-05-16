const express = require('express');
const app = express();
const { port } = require('./config');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
//let fileUpload = require("express-fileupload");
  

app.use('/public', express.static('public'));


//CORS para permitir la comunicación entre varios servidores
corsOptions = {
    origin: "https://lojahouse.herokuapp.com",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
app.use(cors(corsOptions));
//middleware body-parser desde express
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//middleware morgan para ver donde navega mi aplicación
app.use(morgan('dev'));
//middleware para seguridad de mi servidor
app.use(helmet());
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
const rutaRenovarToken = require('./src/routes/renovarToken.routes');
const rutaMensaje = require('./src/routes/mensaje.routes');

const rutaEnviarNotificaciones = require('./src/routes/enviar.notificaciones.routes');




//RUTAS PARA EL ADMINISTRADOR-ARRENDADOR
const rutaInmueblesAdminArrendador = require('./src/routes/admin.inmuebles.routes');
const rutaVisitasAdminArrendador = require('./src/routes/admin.visitas.routes');
const rutaContratosAdminArrendador = require('./src/routes/admin.contratos.routes');
const rutaAdminBusquedas = require('./src/routes/admin.busquedas.routes');

const rutaSubirFotosInmueble = require('./src/controllers/subirfotosinmueble.controllers');


const rutaEmail = require('./src/routes/email.routes');



//USO LAS RUTAS
app.use('/usuario', rutaUsuario);
app.use('/inmueble', rutaInmueble);
app.use('/servicio', rutaServicio);
app.use('/visita', rutaVisita);
app.use('/contrato', rutaContrato);
app.use('/login', rutaLogin);
app.use('/img', rutaImagenes);
app.use('/busqueda', rutaBusqueda);

app.use('/renovar', rutaRenovarToken);
app.use('/mensaje', rutaMensaje);

app.use('/enviarnotificaciones', rutaEnviarNotificaciones);


//RUTAS ADMINISTRADOR-ARRENDADOR
app.use('/admin/inmueble', rutaInmueblesAdminArrendador);
app.use('/admin/visita', rutaVisitasAdminArrendador);
app.use('/admin/contrato', rutaContratosAdminArrendador);
app.use('/admin/busqueda', rutaAdminBusquedas);


app.use('/emails', rutaEmail);
app.use('/fotosinmueble', rutaSubirFotosInmueble);


app.listen(port, () => {
    console.log("Servidor de express en el puerto 3000: \x1b[32m%s\x1b[0m",
    "online");
})