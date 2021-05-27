let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
const { collection } = require('./contrato.models');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMINISTRADOR', 'ARRENDATARIO', 'ARRENDADOR'],
    message: '{VALUE} no es un rol permitido'
}

let estadosValidos = {
    values: ['1', '0'],
    message: '{VALUE} no es un estado permitido'
}

//REVISAR LA PROPIEDAD SELECT PARA LOS CAMPOS QUE QUIERO MOSTRAR

let usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'Debe ingresar sus nombres']},
    apellido: {type: String, required: [true, 'Debe ingresar sus apellidos']},
    correo: {type: String, unique: [true, 'El correo debe ser único']},
    password: {type: String},
    imagen: { type: Array},
    cedula: {type: String, unique: [true, 'La cédula debe ser única']},
    movil: {type: String, required: [true, 'Debe ingresar su número de celular']},
    convencional: {type: String},
    estado: {type: String, default: '1', enum: estadosValidos},
    rol: {type: String, required: [true, 'Debes indicar quién eres'], enum: rolesValidos},
    tokenfirebase: {type: String, unique: [true, 'El token debe ser único']},
}, {timestamps: true, versionKey: false}, {collection: 'usuarios'});




usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} debe ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);