let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let estadoValidos = {
    values: ['ENVIADO', 'LEIDO', 'ELIMINADO'],
    message: '{VALUE} no es un estado permitido'
}

//VERSIONKEY: FALSE PARA QUE NO APAREZCA -V CUANDO SE CREA EL DOCUMENTO
let mensajeSchema = new Schema({
    titulo: {type: String, required: [true, 'El título es necesario'], minlength: 5, maxlength: 80},
    asunto: {type: String, required: [true, 'El asunto es necesario'], minlength: 5, maxlength: 200},
    fecha: {type: Date, required: [true, 'La fecha es necesaria']},
    estado: {type: String, default: 'ENVIADO', enum: estadoValidos},
    correo: {type: String, required: [true, 'El correo es necesario'], minlength: 5, maxlength: 30}
}, {timestamps: true, versionKey: false}, { collection: 'mensaje'});

module.exports = mongoose.model('Mensaje', mensajeSchema);