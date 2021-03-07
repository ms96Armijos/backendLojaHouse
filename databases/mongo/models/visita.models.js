let mongoose = require('mongoose');

let Schema = mongoose.Schema;


let estadosValidos = {
    values: ['ACEPTADA', 'RECHAZADA', 'PENDIENTE', 'ATENDIDA', 'ELIMINADA'],
    message: '{VALUE} no es un estado permitido'
}

let visitaSchema = new Schema({
    fecha: {type: Date, required: [true, 'La fecha es necesaria']},
    descripcion: {type: String, required: [true, 'La descripción es necesaria']},
    estado: {type: String,required:false, default: 'PENDIENTE', enum: estadosValidos},
    inmueble: {type: Schema.Types.ObjectId, ref: 'Inmueble'},
    usuarioarrendatario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
}, {timestamps: true, versionKey: false}, {collection: 'visitas'});

module.exports = mongoose.model('Visita', visitaSchema);