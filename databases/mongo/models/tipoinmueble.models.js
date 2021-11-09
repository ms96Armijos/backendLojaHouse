let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//VERSIONKEY: FALSE PARA QUE NO APAREZCA -V CUANDO SE CREA EL DOCUMENTO
let tipoInmuebleSchema = new Schema({
    nombre: {type: String, required: true, unique: true, minlength: 4, maxlength: 80},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}
}, {timestamps: true, versionKey: false}, { collection: 'tipoinmueble'});

tipoInmuebleSchema.plugin(uniqueValidator, {message: 'El {PATH} debe ser único'});



module.exports = mongoose.model('Tipoinmueble', tipoInmuebleSchema);