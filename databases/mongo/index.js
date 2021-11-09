const contratoModel = require('./models/contrato.models');
const inmuebleModel = require('./models/inmueble.models');
const servicioModel = require('./models/servicio.models');
const usuarioModel = require('./models/usuario.models');
const visitaModel = require('./models/visita.models');
const mensajeModel = require('./models/mensaje.models');
const imagenModel = require('./models/imagen.models');
const tipoInmuebleModel = require('./models/tipoinmueble.models');

//EXPORTO TODOS LOS MODELOS DE MI BASE DE DATOS
module.exports = { 
    contratoModel, 
    inmuebleModel, 
    servicioModel, 
    usuarioModel, 
    visitaModel,
    mensajeModel,
    imagenModel,
    tipoInmuebleModel,
    
}
