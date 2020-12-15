const usuarioSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    correo: Joi.string().length(10),
    password: Joi.number(),
    imagen: Joi.date().iso(),

    cedula: Joi.date().iso(),
    movil: Joi.date().iso(),
    convencional: Joi.date().iso(),
    estado: Joi.date().iso(),
    rol: Joi.date().iso()

});