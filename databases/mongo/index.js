const contratoModel = require('./models/contrato.models');
const inmuebleModel = require('./models/inmueble.models');
const servicioModel = require('./models/servicio.models');
const usuarioModel = require('./models/usuario.models');
const visitaModel = require('./models/visita.models');
const mensajeModel = require('./models/mensaje.models');

//EXPORTO TODOS LOS MODELOS DE MI BASE DE DATOS
module.exports = { 
    contratoModel, 
    inmuebleModel, 
    servicioModel, 
    usuarioModel, 
    visitaModel,
    mensajeModel 
}
