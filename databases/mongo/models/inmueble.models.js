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
    nombre: { type: String, required: [true, 'El nombre del inmueble es necesario'], minlength: 5, maxlength: 100},
    descripcion: { type: String, required: [true, 'La descripción del inmueble es necesario'], minlength: 5, maxlength: 200},
    direccion: { type: String, required: [true, 'La dirección del inmueble es necesario'], minlength: 5, maxlength: 250},
    codigo: { type: String},
    tipo: { type: String, required: [true, 'El tipo de inmueble es necesario'] },
    precioalquiler: { type: Number, required: [true, 'El precio de alquiler es necesario'] },
    servicio: { type: Array, default: [] },
    imagen: { type: Array},
    garantia: { type: Number },
    estado: { type: String, default: 'DISPONIBLE', enum: estadosValidos },
    publicado: { type: String, default: 'PRIVADO', enum: publicadoValidos },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    barrio: { type: String, required: [true, 'El barrio del inmueble es necesario'] },
    ciudad: { type: String, required: [true, 'La ciudad del inmueble es necesaria'] },
    provincia: { type: String, required: [true, 'La provincia de inmueble es necesaria'] },
}, { timestamps: true, versionKey: false }, { collection: 'inmuebles'});

module.exports = mongoose.model('Inmueble', inmuebleSchema);