let mongoose = require('mongoose');

let Schema = mongoose.Schema;


let estadosValidos = {
    values: ['DISPONIBLE', 'OCUPADO', 'ELIMINADO'],
    message: '{VALUE} no es un estado permitido'
}

let publicadoValidos = {
    values: ['PUBLICO','PRIVADO'],
    message: '{VALUE} no es un estado permitido'
}

let inmuebleSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del inmueble es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción del inmueble es necesario'] },
    direccion: { type: String, required: [true, 'La dirección del inmueble es necesario'] },
    codigo: { type: String},
    tipo: { type: String, required: [true, 'El tipo de inmueble es necesario'] },
    precioalquiler: { type: Number, required: [true, 'El precio de alquiler es necesario'] },
    servicio: { type: Array, default: [] },
    imagen: { type: Array},
    garantia: { type: Number },
    estado: { type: String, default: 'DISPONIBLE', enum: estadosValidos },
    publicado: { type: String, default: 'PRIVADO', enum: publicadoValidos },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true, versionKey: false }, { collection: 'inmuebles'});

module.exports = mongoose.model('Inmueble', inmuebleSchema);