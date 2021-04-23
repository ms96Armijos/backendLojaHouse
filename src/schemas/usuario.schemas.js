const { string } = require('@hapi/joi');
const Joi = require('@hapi/joi');
const {EXPRESIONEMAIL} = require('../../config/index')

/**Este es un esquema para validar a los campos de crear usuarios*/
const schemaCrearUsuario = Joi.object({
    nombre: Joi.string().required().min(3).max(150),
    apellido: Joi.string().required().min(3).max(150),
    correo: Joi.string().required().min(5).max(30).pattern(EXPRESIONEMAIL),
    movil: Joi.string().min(10).max(10),
    rol: Joi.string(),
    estado: Joi.string(),
});

/**Este es un esquema para validar a los campos de login */
const schemaLogin = Joi.object({
    nombre: Joi.string().allow(null),
    apellido: Joi.string().allow(null),
    movil: Joi.string().allow(null),
    rol: Joi.string().allow(null),
    correo: Joi.string().required().min(5).max(30).pattern(EXPRESIONEMAIL),
    password: Joi.string().required().min(6).max(30),
});

/**Este es un esquema para validar a los campos de editar usuarios*/
const schemaActualizarUsuario = Joi.object({
    nombre: Joi.string().required().min(3).max(150),
    apellido: Joi.string().required().min(3).max(150),
    cedula: Joi.string().min(10).max(10),
    movil: Joi.string().min(10).max(10),
    convencional: Joi.string().allow("").min(0).max(10),
    _id: Joi.string(),
});

module.exports = {
    schemaLogin,
    schemaCrearUsuario,
    schemaActualizarUsuario
}