let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let acuerdoValidos = {
    values: ['ACEPTADO', 'RECHAZADO', 'PENDIENTE'],
    message: '{VALUE} no es un estado permitido'
}


let estadoValidos = {
    values: ['VIGENTE', 'BORRADOR', 'TERMINADO'],
    message: '{VALUE} no es un estado permitido'
}


let contratoSchema = new Schema({
    nombrecontrato: {type: String},
    fechainicio: {type: Date, required: [true, 'La fecha de inicio es necesaria']},
    fechafin: {type: Date, required: [true, 'La fecha de finalización es necesaria']},
    tiempocontrato: {type: Number},
    monto: {type: Number, required: [true, 'El monto del alquiler es necesario']},
    estado: {type: String, enum: estadoValidos},
    acuerdo: {type: String, default: 'PENDIENTE', enum: acuerdoValidos},
    inmueble: {type: Schema.Types.ObjectId, ref: 'Inmueble'},
    usuarioarrendador: {type: Schema.Types.ObjectId, ref: 'Usuario'},
    usuarioarrendatario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
}, {timestamps: true, versionKey: false}, { collection: 'contratos'});

module.exports = mongoose.model('Contrato', contratoSchema);