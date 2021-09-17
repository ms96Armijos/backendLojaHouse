const { string } = require('@hapi/joi');
const Joi = require('@hapi/joi');
const {EXPRESIONEMAIL} = require('../../config/index')



/**Este es un esquema para validar a los campos de login */
const schemaLogin = Joi.object({
    nombre: Joi.string().allow(null),
    apellido: Joi.string().allow(null),
    movil: Joi.string().allow(null),
    rol: Joi.string().allow(null),
    correo: Joi.string().required().min(5).max(150).pattern(EXPRESIONEMAIL),
    password: Joi.string().required().min(6).max(30),
});



module.exports = {
    schemaLogin
}